import { Award } from "../../db/entities/Award";
import { Event } from "../../db/entities/Event";
import { FieldResolver, Resolver, Root } from "type-graphql";
import { Loader } from "type-graphql-dataloader";
import { Season } from "../../ftc-api/types/Season";
import DataLoader from "dataloader";
import { TeamEventParticipation } from "../objects/TeamEventParticipation";
import { Team } from "../../db/entities/Team";

@Resolver(TeamEventParticipation)
export class TeamEventParticipationResolver {
    @FieldResolver(() => Event)
    @Loader<{ season: number; code: string }, Event>(async (ids, _) => {
        let events = await Event.find({
            where: ids as { season: number; code: string }[],
        });

        let groups: Event[] = ids.map((_) => ({} as Event));

        for (let e of events) {
            for (let i = 0; i < ids.length; i++) {
                let id = ids[i];
                if (id.season == e.season && id.code == e.code) {
                    groups[i] = e;
                }
            }
        }
        return groups;
    })
    event(@Root() tep: TeamEventParticipation) {
        return async (dl: DataLoader<{ season: Season; code: string }, Event>) => {
            return dl.load({ season: tep.season, code: tep.eventCode });
        };
    }

    @FieldResolver(() => Team)
    @Loader<{ number: number }, Team>(async (ids, _) => {
        let teams = await Team.find({
            where: ids as { number: number }[],
        });

        let groups: Team[] = ids.map((_) => ({} as Team));

        for (let t of teams) {
            for (let i = 0; i < ids.length; i++) {
                let id = ids[i];
                if (id.number == t.number) {
                    groups[i] = t;
                }
            }
        }
        return groups;
    })
    team(@Root() tep: TeamEventParticipation) {
        return async (dl: DataLoader<{ number: number }, Team>) => {
            return dl.load({ number: tep.teamNumber });
        };
    }

    @FieldResolver(() => [Award])
    @Loader<{ season: number; eventCode: string; teamNumber: number }, Award[]>(async (ids, _) => {
        let awards = await Award.find({
            where: ids as { season: number; eventCode: string; teamNumber: number }[],
        });

        let groups: Award[][] = ids.map((_) => []);

        for (let a of awards) {
            for (let i = 0; i < ids.length; i++) {
                let id = ids[i];
                if (id.season == a.season && id.eventCode == a.eventCode && id.teamNumber == a.teamNumber) {
                    groups[i].push(a);
                }
            }
        }
        return groups;
    })
    awards(@Root() tep: TeamEventParticipation) {
        return async (dl: DataLoader<{ season: Season; eventCode: string; teamNumber: number }, Award[]>) => {
            return dl.load({ season: tep.season, eventCode: tep.eventCode, teamNumber: tep.teamNumber });
        };
    }
}
