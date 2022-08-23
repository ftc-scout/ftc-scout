import { getAllEvents } from "../../ftc-api/get-events";
import { Season } from "../../ftc-api/types/Season";
import { DATA_SOURCE } from "../data-source";
import { FtcApiMetadata } from "../entities/FtcApiMetadata";
import { Event } from "../../db/entities/Event";
import { DeepPartial } from "typeorm";

const EVENT_RENAMING: Record<string, string> = {
    FTCCMP1: "FIRST World Championship - Finals Division",
    FTCCMP1FRNK: "FIRST World Championship - Franklin Division",
    FTCCMP1JEMI: "FIRST World Championship - Jemison Division",
};

function getEventName(name: string, code: string): string {
    return (EVENT_RENAMING[code] ?? name).trim();
}

export async function loadAllEvents(season: Season) {
    console.log(`Fetching all events for season ${season}.`);

    let dateStartQuery = new Date();
    let since = await FtcApiMetadata.getLastEventsReq(season);
    let apiEvents = await getAllEvents(season, since);

    console.log("Fetched all Events.");

    console.log("Adding all events to database.");

    let dbEvents: Event[] = apiEvents.map((apiEvent) => {
        // if (apiEvent.timezone == null) {
        //     console.log(apiEvent)
        // }

        return Event.create({
            eventId: apiEvent.eventId,
            season,
            code: apiEvent.code,
            divisionCode: apiEvent?.divisionCode === "" ? null : apiEvent.divisionCode,
            name: getEventName(apiEvent.name!, apiEvent.code!),
            remote: apiEvent.remote,
            hybrid: apiEvent.hybrid,
            fieldCount: apiEvent.fieldCount,
            published: apiEvent.published,
            type: +apiEvent.type!,
            regionCode: apiEvent.regionCode,
            leagueCode: apiEvent.leagueCode,
            districtCode: apiEvent.districtCode === "" ? null : apiEvent.districtCode,
            venue: apiEvent.venue?.trim(),
            address: apiEvent.address?.trim(),
            country: apiEvent.country,
            stateOrProvince: apiEvent.stateprov,
            city: apiEvent.city,
            website: apiEvent.website === "" ? null : apiEvent.website?.trim(),
            liveStreamURL: apiEvent.liveStreamUrl === "" ? null : apiEvent.liveStreamUrl?.trim(),
            webcasts: apiEvent.webcasts ?? [],
            timezone: apiEvent.timezone,
            start: new Date(apiEvent.dateStart),
            end: new Date(apiEvent.dateEnd),
        } as DeepPartial<Event>);
    });

    await DATA_SOURCE.transaction(async (em) => {
        await em.save(dbEvents);
        await em.save(
            FtcApiMetadata.create({
                season,
                lastEventsReq: dateStartQuery,
            })
        );
    });

    console.log("All events added to database.");
}
