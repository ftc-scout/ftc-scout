import { DAY_MS } from "../constants";
import { FtcApiMetadata } from "../db/entities/FtcApiMetadata";
import { loadAllEvents as loadAllEventsIntoDatabase } from "../db/load-data/load-all-events";
import { loadAllMatches } from "../db/load-data/load-all-matches";
import { loadAllTeamsIntoDatabase } from "../db/load-data/load-all-teams";
import { Season } from "./types/Season";

export async function setupApiWatchers(seasons: Season[]) {
    seasons.forEach(ensureSeasonHasMetadataTable);

    for (const season of seasons) {
        setupApiWatcher([
            {
                reqFunction: () => loadAllTeamsIntoDatabase(season),
                getTimeOfLastReq: () => FtcApiMetadata.getLastTeamsReq(season),
            },
            {
                reqFunction: () => loadAllEventsIntoDatabase(season),
                getTimeOfLastReq: () => FtcApiMetadata.getLastEventsReq(season),
            },
            {
                reqFunction: () => loadAllMatches(season),
                getTimeOfLastReq: () =>
                    FtcApiMetadata.getLastMatchesReq(season),
            },
        ]);
    }
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
