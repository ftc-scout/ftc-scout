import { Season } from "@ftc-scout/common";
import { Event } from "../entities/Event";
import { getAdvancement } from "../../ftc-api/get-advancement";
import { LoadType } from "../../ftc-api/watch";
import { DataHasBeenLoaded } from "../entities/DataHasBeenLoaded";

export async function loadAdvancementSlots(season: Season, loadType: LoadType) {
    if (season < Season.FreightFrenzy) {
        let rec =
            (await DataHasBeenLoaded.findOneBy({ season })) ?? DataHasBeenLoaded.create({ season });
        rec.slots = true;
        await rec.save();
        console.info(`Skipping advancement slot loading for pre-2021 season ${season}.`);
        return;
    }

    console.info(`Loading advancement slots for season ${season}. (${loadType})`);

    let events = await eventsToFetch(season, loadType);
    console.info(`Got ${events.length} events to fetch.`);

    const chunkSize = 25;
    for (let i = 0; i < events.length; i += chunkSize) {
        console.info(`Starting chunk starting at ${i}.`);

        let chunk = events.slice(i, i + chunkSize);
        let advancements = await Promise.all(chunk.map((ev) => getAdvancement(season, ev.code)));

        await Promise.all(
            chunk.map(async (ev, idx) => {
                let adv = advancements[idx];
                if (!adv || adv.slots == null) return;

                let dirty = false;
                if (ev.advancementSlots !== adv.slots) {
                    ev.advancementSlots = adv.slots;
                    dirty = true;
                }
                if (adv.advancesTo && ev.advancesTo !== adv.advancesTo) {
                    ev.advancesTo = adv.advancesTo;
                    dirty = true;
                }
                if (dirty) {
                    await ev.save();
                    console.info(
                        `Updated advancement info for ${ev.code} -> slots=${adv.slots}, advancesTo=${adv.advancesTo}`
                    );
                }
            })
        );

        console.info(`Loaded ${Math.min(i + chunkSize, events.length)}/${events.length}.`);
    }

    if (loadType === LoadType.Full) {
        let rec =
            (await DataHasBeenLoaded.findOneBy({ season })) ?? DataHasBeenLoaded.create({ season });
        rec.slots = true;
        await rec.save();
    }
}

async function eventsToFetch(season: Season, loadType: LoadType) {
    const loaded = await DataHasBeenLoaded.slotsHaveBeenLoaded(season);

    let qb = Event.createQueryBuilder("e")
        .where("e.season = :season", { season })
        .andWhere("e.season >= :minSeason", { minSeason: Season.FreightFrenzy });

    if (loaded) {
        qb.andWhere("e.advancesTo IS NOT NULL");
        if (loadType === LoadType.Full) {
            qb.andWhere("e.start < now()").andWhere("e.start > now() - interval '30 days'");
        } else {
            qb.andWhere("(e.advancementSlots IS NULL OR e.advancementSlots <= 0)")
                .andWhere("e.start <= now()")
                .andWhere(`"end" >= now() - interval '10 days'`);
        }
    }

    return qb.getMany();
}
