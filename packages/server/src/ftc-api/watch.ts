import { CURRENT_SEASON, PAST_SEASONS } from "@ftc-scout/common";
import { DataHasBeenLoaded } from "../db/entities/DataHasBeenLoaded";
import { loadAllTeams } from "../db/loaders/load-all-teams";
import { loadAllEvents } from "../db/loaders/load-all-events";
import { loadAllMatches } from "../db/loaders/load-all-matches";
import { loadAllAwards } from "../db/loaders/load-all-awards";
import { loadFutureEvents } from "../db/loaders/load-future-events";
import { loadAllLeagues } from "../db/loaders/load-all-leagues";

export const LoadType = {
    Full: "Full",
    Partial: "Partial",
};
export type LoadType = (typeof LoadType)[keyof typeof LoadType];

export async function fetchPriorSeasons() {
    for (let season of PAST_SEASONS) {
        console.info(`Checking load of season ${season}.`);
        if (!(await DataHasBeenLoaded.teamsHaveBeenLoaded(season))) {
            await loadAllTeams(season);
        } else {
            console.info(`Teams already loaded.`);
        }
        if (!(await DataHasBeenLoaded.eventsHaveBeenLoaded(season))) {
            await loadAllEvents(season);
        } else {
            console.info(`Events already loaded.`);
        }
        if (!(await DataHasBeenLoaded.matchesHaveBeenLoaded(season))) {
            await loadAllMatches(season, LoadType.Full);
        } else {
            console.info(`Matches already loaded.`);
        }
        if (!(await DataHasBeenLoaded.awardsHaveBeenLoaded(season))) {
            await loadAllAwards(season, LoadType.Full);
        } else {
            console.info(`Awards already loaded.`);
        }
        if (!(await DataHasBeenLoaded.leaguesHaveBeenLoaded(season))) {
            await loadAllLeagues(season, { recomputeRankings: true });
        } else {
            console.info(`Leagues already loaded.`);
        }
    }
}

export async function watchApi() {
    let cycleCount = 0;

    const runJob = async (fn: Function, interval: number) => {
        if (cycleCount % interval == 0) {
            try {
                await fn();
            } catch (e) {
                console.error("!!! ERROR LOADING DATA !!!");
                console.error(e);
            }
        }
    };

    const MS_PER_MIN = 60 * 1000;
    const MINS_PER_HOUR = 60;
    const MINS_PER_DAY = MINS_PER_HOUR * 24;

    const run = async () => {
        console.info(`Syncing. (Cycle ${cycleCount})`);
        await runJob(async () => await loadAllTeams(CURRENT_SEASON), MINS_PER_DAY);
        await runJob(async () => await loadAllEvents(CURRENT_SEASON), MINS_PER_HOUR);
        await runJob(async () => await loadAllMatches(CURRENT_SEASON, LoadType.Partial), 1);
        await runJob(async () => await loadAllMatches(CURRENT_SEASON, LoadType.Full), MINS_PER_DAY);
        await runJob(async () => await loadAllAwards(CURRENT_SEASON, LoadType.Partial), 5);
        await runJob(async () => await loadAllAwards(CURRENT_SEASON, LoadType.Full), MINS_PER_HOUR);
        await runJob(
            async () => await loadAllLeagues(CURRENT_SEASON, { recomputeRankings: true }),
            MINS_PER_DAY
        );
        await runJob(async () => await loadFutureEvents(CURRENT_SEASON), MINS_PER_DAY / 2);

        cycleCount += 1;
        setTimeout(run, MS_PER_MIN);
    };

    run();
}
