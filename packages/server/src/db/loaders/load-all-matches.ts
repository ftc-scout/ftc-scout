import { DESCRIPTORS, MatchFtcApi, MatchScoresFtcApi, Season } from "@ftc-scout/common";
import { DataHasBeenLoaded } from "../entities/DataHasBeenLoaded";
import { Event } from "../entities/Event";
import { DATA_SOURCE } from "../data-source";
import { Match } from "../entities/Match";
import { getMatches } from "../../ftc-api/get-matches";
import { getMatchScores } from "../../ftc-api/get-match-scores";
import { getTeams } from "../../ftc-api/get-teams";
import { MatchScore, MatchScoreSchemas } from "../entities/dyn/match-score";
import { TeamMatchParticipation } from "../entities/TeamMatchParticipation";
import { LoadType } from "../../ftc-api/watch";

export async function loadAllMatches(season: Season, loadType: LoadType) {
    console.info(`Loading matches for season ${season}. (${loadType})`);

    let events = await eventsToFetch(season, loadType);

    console.info(`Got ${events.length} events to fetch.`);

    for (let i = 0; i < events.length; i++) {
        let event = events[i];

        if (event.remote && !DESCRIPTORS[season].hasRemote) continue;

        try {
            let [matches, scores, _teams] = await Promise.all([
                getMatches(season, event.code),
                getMatchScores(season, event.code),
                getTeams(season, event.code),
            ]);

            let allDbMatches: Match[] = [];
            let allDbScores: MatchScore[] = [];
            let allDbTmps: TeamMatchParticipation[] = [];

            for (let match of matches) {
                let theseScores = findScores(match, scores);
                let hasBeenPlayed = !!theseScores.length;
                let dbMatch = Match.fromApi(match, event, hasBeenPlayed);
                let dbScores = theseScores.flatMap((s) =>
                    MatchScore.fromApi(s, dbMatch, event.remote)
                );
                let dbTmps = TeamMatchParticipation.fromApi(match.teams, dbMatch, event.remote);

                allDbMatches.push(dbMatch);
                allDbScores.push(...dbScores);
                allDbTmps.push(...dbTmps);
            }

            await DATA_SOURCE.transaction(async (em) => {
                await em.save(allDbMatches, { chunk: 100 });
                await em.save(allDbTmps, { chunk: 500 });
                await em.getRepository(MatchScoreSchemas[season]).save(allDbScores, { chunk: 100 });
            });
            console.info(`Loaded ${i + 1}/${events.length}.`);
        } catch (e) {
            console.error(`Loaded ${i + 1}/${events.length} !!! ERROR !!!`);
            console.error(e);
        }
    }

    await DataHasBeenLoaded.create({
        season,
        matches: true,
    }).save();

    console.info(`Finished loading events.`);
}

function findScores(match: MatchFtcApi, scores: MatchScoresFtcApi[]): MatchScoresFtcApi[] {
    return scores.filter((s) =>
        "teamNumber" in s
            ? match.teams[0].teamNumber == s.teamNumber && match.matchNumber == s.matchNumber
            : match.tournamentLevel == s.matchLevel &&
              match.series == s.matchSeries &&
              match.matchNumber == s.matchNumber
    );
}

async function eventsToFetch(season: Season, loadType: LoadType) {
    let loaded = await DataHasBeenLoaded.matchesHaveBeenLoaded(season);
    if (!loaded) {
        return Event.findBy({ season });
    }

    if (loadType == LoadType.Full) {
        return DATA_SOURCE.getRepository(Event)
            .createQueryBuilder("e")
            .select(["code", "remote", "timezone"])
            .distinct(true)
            .leftJoin(Match, "m", "e.season = m.event_season AND e.code = m.event_code")
            .leftJoin(
                `match_score_${season}`,
                "s",
                "s.season = m.event_season AND s.event_code = m.event_code AND m.id = s.match_id"
            )
            .where("e.season = :season", { season })
            .andWhere("start < now()")
            .andWhere("start > 'now'::timestamp - '1 month'::interval")
            .getMany();
    } else {
        return DATA_SOURCE.getRepository(Event)
            .createQueryBuilder()
            .select(["code", "remote", "timezone"])
            .distinct(true)
            .where("season = :season", { season })
            .andWhere("start <= (NOW() at time zone timezone)::date")
            .andWhere(`"end" >= (NOW() at time zone timezone)::date`)
            .getMany();
    }
}
