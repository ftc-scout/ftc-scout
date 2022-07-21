import { getEventAwards } from "../../ftc-api/get-event-awards";
import { Season } from "../../ftc-api/types/Season";
import { Event } from "../entities/Event";
import { FtcApiMetadata } from "../entities/FtcApiMetadata";
import { LessThanOrEqual, MoreThanOrEqual, DeepPartial } from "typeorm";
import { Award } from "../entities/Award";
import { FTCSDataSource } from "../data-source";

export async function loadAllAwards(season: Season) {
    console.log(`Loading all awards from season ${season}.`);

    let dateStartQuery = new Date();
    let dateLastReq = await FtcApiMetadata.getLastAwardsReq(season);

    console.log("Fetching event codes.");

    let eventCodes = !dateLastReq
        ? await Event.findBy({ season })
        : await Event.find({
              select: { code: true },
              where:
                  // Get events that were ongoing anytime between the last query and a week ago.
                  {
                      season,
                      start: LessThanOrEqual(dateStartQuery),
                      end: MoreThanOrEqual(addDays(dateLastReq, -7)), // with one week of leeway.
                      published: true,
                      // code: Raw("not in ...") // Get only events that don't have awards?
                  },
          });

    console.log(`${eventCodes.length} events to fetch awards from.`);

    await FTCSDataSource.transaction(async (em) => {
        const chunkSize = 25;
        for (let i = 0; i < eventCodes.length; i += chunkSize) {
            console.log(`Starting chunk starting at ${i}.`);
            console.log("Fetching from api.");

            const chunk = eventCodes.slice(i, i + chunkSize);

            let apiAwards = await Promise.all(chunk.map(({ code }) => getEventAwards(season, code)));

            console.log("Inserting into db.");

            // For some reason the api sometimes reports the judges choice award as starting from 0 instead of 1.
            // We correct that here.
            for (let oneEventAwards of apiAwards) {
                let hasZeroJudgesChoice = oneEventAwards.some((a) => a.name == "Judges' Choice Award" && a.series == 0);
                if (hasZeroJudgesChoice)
                    oneEventAwards.forEach((a) => {
                        if (a.name == "Judges' Choice Award") a.series++;
                    });
            }

            let dbAwards = apiAwards
                .flat()
                .map((a) => Award.fromApi(season, a))
                .filter((a) => !!a);
            await em.save(dbAwards);

            console.log(`Loaded ${i + chunkSize}/${eventCodes.length}`);
        }

        await em.save(
            FtcApiMetadata.create({
                season,
                lastAwardsReq: dateStartQuery,
            } as DeepPartial<FtcApiMetadata>)
        );
    });
}

function addDays(date: Date, days: number): Date {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}
