import { AwardFtcApi, Season, notEmpty } from "@ftc-scout/common";
import { DataHasBeenLoaded } from "../entities/DataHasBeenLoaded";
import { Event } from "../entities/Event";
import { DATA_SOURCE } from "../data-source";
import { getEventAwards } from "../../ftc-api/get-event-awards";
import { Award } from "../entities/Award";

export async function loadAllAwards(season: Season) {
    console.info(`Loading awards for season ${season}.`);

    let events = await eventsToFetch(season);

    console.info(`Got ${events.length} events to fetch.`);

    const chunkSize = 25;
    for (let i = 0; i < events.length; i += chunkSize) {
        console.log(`Starting chunk starting at ${i}.`);
        console.log("Fetching from api.");

        let chunk = events.slice(i, i + chunkSize);
        let apiAwards = await Promise.all(chunk.map((e) => getEventAwards(season, e.code)));
        apiAwards.forEach(fixJudgesChoice);
        let dbAwards = apiAwards
            .flat()
            .map((a) => Award.fromApi(season, a))
            .filter(notEmpty);
        await Award.save(dbAwards);

        console.info(`Loaded ${Math.min(i + chunkSize, events.length) + 1}/${events.length}.`);
    }

    await DataHasBeenLoaded.create({
        season,
        awards: true,
    }).save();

    console.info(`Finished loading awards.`);
}

function fixJudgesChoice(awards: AwardFtcApi[]) {
    // For some reason the api sometimes reports the judges choice award as starting from 0 instead of 1.
    // We correct that here.
    let hasZeroJudgesChoice = awards.some((a) => a.name == "Judges' Choice Award" && a.series == 0);
    if (hasZeroJudgesChoice) {
        awards.forEach((a) => {
            if (a.name == "Judges' Choice Award") a.series++;
        });
    }
}

async function eventsToFetch(season: Season) {
    let loaded = await DataHasBeenLoaded.awardsHaveBeenLoaded(season);

    if (loaded) {
        return DATA_SOURCE.getRepository(Event)
            .createQueryBuilder()
            .select("code")
            .where("season = :season", { season })
            .andWhere("start < now()")
            .andWhere("start > 'now'::timestamp - '7 days'::interval")
            .getMany();
    } else {
        return Event.findBy({ season });
    }
}
