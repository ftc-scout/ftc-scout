import { Season, notEmpty } from "@ftc-scout/common";
import { getLeagues } from "../../ftc-api/get-leagues";
import { League } from "../entities/League";
import { DATA_SOURCE } from "../data-source";
import { DataHasBeenLoaded } from "../entities/DataHasBeenLoaded";
import { recomputeLeagues } from "./recompute-league-rankings";
import { LeagueTeam } from "../entities/LeagueTeam";
import { getLeagueMembership } from "../../ftc-api/get-league-membership";
import { LeagueRankingSchemas } from "../entities/dyn/league-ranking";
import { In, Not } from "typeorm";

type LoadAllLeaguesOptions = {
    markMatchesStale?: boolean;
    recomputeRankings?: boolean;
};

export async function loadAllLeagues(season: Season, opts: LoadAllLeaguesOptions = {}) {
    let markMatchesStale = opts.markMatchesStale ?? false;
    let recomputeRankings = opts.recomputeRankings ?? false;

    // Only compute/load leagues for Season.PowerPlay (2022) and newer.
    if (!Number.isFinite(season) || season < Season.PowerPlay) {
        console.info(
            `Skipping leagues for season ${season} — leagues are only computed for ${Season.PowerPlay} and up.`
        );
        return;
    }

    console.info(`Loading leagues for season ${season}.`);

    let apiLeagues = await getLeagues(season);
    if (!apiLeagues) {
        console.error(`Failed to fetch the leagues for season ${season}.`);
        return;
    }

    let dbLeagues = apiLeagues.map((api) => League.fromApi(api, season)).filter(notEmpty);
    let deduped = [
        ...new Map(
            dbLeagues.map((league) => [
                `${league.season}-${league.code}-${league.regionCode}`,
                league,
            ])
        ).values(),
    ];

    // Null when the request failed, so we keep the members we already have.
    let memberships = await Promise.all(
        deduped.map(async (league) => {
            let api = await getLeagueMembership(season, league.code, league.regionCode);
            return { league, members: api?.members ? LeagueTeam.fromApi(api, league) : null };
        })
    );

    await DATA_SOURCE.transaction(async (em) => {
        // FIRST moves and renames leagues during the season, so remove the ones it no longer lists.
        let listed = new Set(deduped.map((l) => `${l.code}-${l.regionCode}`));
        let removed = (await em.find(League, { where: { season } })).filter(
            (l) => !listed.has(`${l.code}-${l.regionCode}`)
        );
        for (let { code, regionCode } of removed) {
            let where = { season, leagueCode: code, regionCode };
            await em.delete(LeagueTeam, where);
            await em.getRepository(LeagueRankingSchemas[season]).delete(where);
            await em.delete(League, { season, code, regionCode });
        }
        if (removed.length) {
            console.info(`Removed ${removed.length} leagues that are no longer listed.`);
        }

        if (deduped.length) {
            await em.getRepository(League).upsert(deduped, ["season", "code", "regionCode"]);
        }

        let allMembers: LeagueTeam[] = [];
        for (let { league, members } of memberships) {
            if (!members) continue;

            let where = { season, leagueCode: league.code, regionCode: league.regionCode };
            let teamNumbers = members.map((m) => m.teamNumber);
            await em.delete(
                LeagueTeam,
                teamNumbers.length ? { ...where, teamNumber: Not(In(teamNumbers)) } : where
            );
            allMembers.push(...members);
        }
        if (allMembers.length) {
            await em
                .getRepository(LeagueTeam)
                .upsert(allMembers, ["season", "leagueCode", "regionCode", "teamNumber"]);
        }

        let status =
            (await em.getRepository(DataHasBeenLoaded).findOne({ where: { season } })) ??
            DataHasBeenLoaded.create({ season });
        status.leagues = true;
        if (markMatchesStale) {
            status.matches = false;
        }
        await em.save(status);
    });

    if (recomputeRankings) {
        await recomputeLeagues(season, deduped);
    }

    console.info(`Finished loading leagues for season ${season}.`);
}
