import { Season, notEmpty } from "@ftc-scout/common";
import { getLeagues } from "../../ftc-api/get-leagues";
import { League } from "../entities/League";
import { DATA_SOURCE } from "../data-source";
import { DataHasBeenLoaded } from "../entities/DataHasBeenLoaded";
import { recomputeLeagueRankings } from "./recompute-league-rankings";
import { LeagueTeam } from "../entities/LeagueTeam";
import { getLeagueMembership } from "../../ftc-api/get-league-membership";

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
    let dbLeagues = apiLeagues.map((api) => League.fromApi(api, season)).filter(notEmpty);
    let deduped = [
        ...new Map(
            dbLeagues.map((league) => [
                `${league.season}-${league.code}-${league.regionCode}`,
                league,
            ])
        ).values(),
    ];

    let leagueMembers = (
        await Promise.all(
            deduped.map(async (league) =>
                LeagueTeam.fromApi(
                    await getLeagueMembership(season, league.code, league.regionCode),
                    league
                )
            )
        )
    ).flat();

    await DATA_SOURCE.transaction(async (em) => {
        await em.getRepository(League).upsert(deduped, ["season", "code", "regionCode"]);
        await em
            .getRepository(LeagueTeam)
            .upsert(leagueMembers, ["season", "leagueCode", "regionCode", "teamNumber"]);

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
        let leagueKeys = deduped.map((l) => ({ code: l.code, regionCode: l.regionCode ?? null }));
        for (let league of leagueKeys) {
            await recomputeLeagueRankings(season, league.code, league.regionCode);
        }
    }

    console.info(`Finished loading leagues for season ${season}.`);
}
