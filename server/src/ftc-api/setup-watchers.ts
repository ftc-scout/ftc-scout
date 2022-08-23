import { CURRENT_SEASON, DAY_MS, PAST_SEASONS } from "../constants";
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
            if (season != 2020) await loadAllMatches(season);
        } else {
            console.log("Matches for season", season, "already loaded.");
        }
        if ((await FtcApiMetadata.getLastAwardsReq(season)) == null) {
            if (season != 2020) await loadAllAwards(season);
        } else {
            console.log("Awards for season", season, "already loaded.");
        }
    }

    // Continually watch for updates for the current season.
    setupApiWatcher([
        {
            reqFunction: () => loadAllTeamsIntoDatabase(CURRENT_SEASON),
            getTimeOfLastReq: () => FtcApiMetadata.getLastTeamsReq(CURRENT_SEASON),
        },
        {
            reqFunction: () => loadAllEventsIntoDatabase(CURRENT_SEASON),
            getTimeOfLastReq: () => FtcApiMetadata.getLastEventsReq(CURRENT_SEASON),
        },
        {
            reqFunction: () => loadAllMatches(CURRENT_SEASON),
            getTimeOfLastReq: () => FtcApiMetadata.getLastMatchesReq(CURRENT_SEASON),
        },
        {
            reqFunction: () => loadAllAwards(CURRENT_SEASON),
            getTimeOfLastReq: () => FtcApiMetadata.getLastAwardsReq(CURRENT_SEASON),
        },
    ]);
}

function ensureSeasonHasMetadataTable(season: Season) {
    FtcApiMetadata.save({ season });
}

async function setupApiWatcher(
    funcsToRun: {
        reqFunction: () => Promise<void>;
        getTimeOfLastReq: () => Promise<Date | null>;
    }[]
) {
    let lastMidnight = getLastMidnight();
    for (let func of funcsToRun) {
        if (((await func.getTimeOfLastReq()) ?? 0) < lastMidnight) {
            await func.reqFunction();
        }
    }

    let nextMidnight = getNextMidnight();
    let currentTime = new Date();

    let runAll = async () => {
        for (let func of funcsToRun) {
            await func.reqFunction();
        }
    };

    setTimeout(async () => {
        await runAll();
        setInterval(runAll, DAY_MS);
    }, nextMidnight.getTime() - currentTime.getTime());
}

function getLastMidnight(): Date {
    let d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
}

function getNextMidnight(): Date {
    let d = new Date();
    d.setHours(24, 0, 0, 0);
    return d;
}
