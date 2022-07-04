import { getEventAwards } from "../../ftc-api/get-event-awards";
import { Season } from "../../ftc-api/types/Season";
import { Event } from "../entities/Event";

export async function loadAllAwards(season: Season) {
    let eventCodes = await Event.find({
        select: { code: true },
        where: { season },
        order: { start: "desc" },
    });

    const chunkSize = 25;
    for (let i = 0; i < eventCodes.length; i += chunkSize) {
        const chunk = eventCodes.slice(i, i + chunkSize);

        (
            await Promise.all(
                chunk.map(({ code }) => getEventAwards(season, code))
            )
        ).flat();
    }
}
