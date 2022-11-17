import { CURRENT_SEASON, MINS_PER_DAY, MINS_PER_HOUR, MINUTE_MS, PAST_SEASONS } from "../constants";
import { FtcApiMetadata } from "../db/entities/FtcApiMetadata";
import { loadAllAwards } from "../db/load-data/load-all-awards";
import { loadAllEvents as loadAllEventsIntoDatabase } from "../db/load-data/load-all-events";
import { loadAllMatches } from "../db/load-data/load-all-matches";
import { loadAllTeamsIntoDatabase } from "../db/load-data/load-all-teams";
import { Season } from "./types/Season";

export async function setupApiWatchers() {
    [...PAST_SEASONS, CURRENT_SEASON].forEach(ensureSeasonHasMetadataTable);

    // Make sure past seasons have been fetched
    for (let season of PAST_SEASONS) {
        console.log("Checking load of season", season);
        if ((await FtcApiMetadata.getLastTeamsReq(season)) == null) {
            await loadAllTeamsIntoDatabase(season);
        } else {
            console.log("Teams for season", season, "already loaded.");
        }
        if ((await FtcApiMetadata.getLastEventsReq(season)) == null) {
            await loadAllEventsIntoDatabase(season);
        } else {
            console.log("Events for season", season, "already loaded.");
        }
        if ((await FtcApiMetadata.getLastMatchesReq(season)) == null) {
            await loadAllMatches(season);
        } else {
            console.log("Matches for season", season, "already loaded.");
        }
        if ((await FtcApiMetadata.getLastAwardsReq(season)) == null) {
            await loadAllAwards(season);
        } else {
            console.log("Awards for season", season, "already loaded.");
        }
    }

    // Continually watch for updates for the current season.
    setupApiWatcher([
        {
            reqFunction: async (cycleCount) => {
                if (cycleCount % MINS_PER_DAY == 0) await loadAllTeamsIntoDatabase(CURRENT_SEASON);
            },
            getTimeOfLastReq: () => FtcApiMetadata.getLastTeamsReq(CURRENT_SEASON),
        },
        {
            reqFunction: async (cycleCount) => {
                if (cycleCount % MINS_PER_DAY == 0) await loadAllEventsIntoDatabase(CURRENT_SEASON);
            },
            getTimeOfLastReq: () => FtcApiMetadata.getLastEventsReq(CURRENT_SEASON),
        },
        {
            reqFunction: async (cycleCount) => {
                await loadAllMatches(CURRENT_SEASON, cycleCount);
            },
            getTimeOfLastReq: () => FtcApiMetadata.getLastMatchesReq(CURRENT_SEASON),
        },
        {
            reqFunction: async (cycleCount) => {
                if (cycleCount % MINS_PER_HOUR == 0) await loadAllAwards(CURRENT_SEASON);
            },
            getTimeOfLastReq: () => FtcApiMetadata.getLastAwardsReq(CURRENT_SEASON),
        },
    ]);
}

function ensureSeasonHasMetadataTable(season: Season) {
    FtcApiMetadata.save({ season });
}

let cycleCount = 0;

async function setupApiWatcher(
    funcsToRun: {
        reqFunction: (cycle: number) => Promise<void>;
        getTimeOfLastReq: () => Promise<Date | null>;
    }[]
) {
    let runAll = async () => {
        console.log("run all");
        for (let func of funcsToRun) {
            try {
                await func.reqFunction(cycleCount);
            } catch (e) {
                console.error("!!! ERROR LOADING DATA !!!");
                console.error(e);
            }
        }
        cycleCount++;
        setTimeout(runAll, MINUTE_MS);
    };

    await runAll();
}
