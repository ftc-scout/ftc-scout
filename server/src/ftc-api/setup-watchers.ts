import { DAY_MS } from "../constants";
import { FtcApiMetadata } from "../db/entities/FtcApiMetadata";
import { loadAllEvents as loadAllEventsIntoDatabase } from "../db/load-data/load-all-events";
import { loadAllTeamsIntoDatabase } from "../db/load-data/load-all-teams";
import { Season } from "./types/Season";

export async function setupApiWatchers(seasons: Season[]) {
    seasons.forEach(ensureSeasonHasMetadataTable);

    for (const season of seasons) {
        setupApiWatcher(
            () => loadAllTeamsIntoDatabase(season),
            () => FtcApiMetadata.getLastTeamsReq(season)
        );
        setupApiWatcher(
            () => loadAllEventsIntoDatabase(season),
            () => FtcApiMetadata.getLastEventsReq(season)
        );
    }
}

function ensureSeasonHasMetadataTable(season: Season) {
    FtcApiMetadata.save({ season });
}

async function setupApiWatcher(
    reqFunction: () => void,
    getTimeOfLastReq: () => Promise<Date | null>
) {
    let lastMidnight = getLastMidnight();
    if (((await getTimeOfLastReq()) ?? 0) < lastMidnight) {
        reqFunction();
    }

    let nextMidnight = getNextMidnight();
    let currentTime = new Date();

    setTimeout(() => {
        reqFunction();
        setInterval(reqFunction, DAY_MS);
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
