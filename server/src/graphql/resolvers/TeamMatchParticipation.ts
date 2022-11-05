import { FieldResolver, Resolver, Root } from "type-graphql";
import { Loader } from "type-graphql-dataloader";
import DataLoader from "dataloader";
import { TeamMatchParticipation } from "../../db/entities/TeamMatchParticipation";
import { Match } from "../../db/entities/Match";

@Resolver(TeamMatchParticipation)
export class TeamMatchParticipationResolver {
    @FieldResolver(() => Match)
    @Loader<{ eventSeason: number; eventCode: string; id: number }, Match>(async (ids, _) => {
        let matches = await Match.find({
            where: ids as { eventSeason: number; eventCode: string; id: number }[],
        });

        let groups: Match[] = ids.map((_) => ({} as Match));

        for (let m of matches) {
            for (let i = 0; i < ids.length; i++) {
                let id = ids[i];
                if (id.eventSeason == m.eventSeason && id.eventCode == m.eventCode && id.id == m.id) {
                    groups[i] = m;
                }
            }
        }
        return groups;
    })
    match(@Root() tmp: TeamMatchParticipation) {
        return async (dl: DataLoader<{ eventSeason: number; eventCode: string; id: number }, Match>) => {
            return dl.load({ eventSeason: tmp.season, eventCode: tmp.eventCode, id: tmp.matchId });
        };
    }
}
