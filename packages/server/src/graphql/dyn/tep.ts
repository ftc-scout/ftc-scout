import { DESCRIPTORS, Descriptor, FloatTy, IntTy, Season, nn, notEmpty } from "@ftc-scout/common";
import { GraphQLFieldConfig, GraphQLObjectType } from "graphql";
import { TeamEventParticipation } from "../../db/entities/dyn/team-event-participation";
import { LeagueRanking } from "../../db/entities/dyn/league-ranking";

type TepLike = (TeamEventParticipation | LeagueRanking) & {
    season: Season;
    isRemote: boolean;
};

export function makeTepTypes(descriptor: Descriptor): GraphQLObjectType[] {
    let l = [make(descriptor, false), descriptor.hasRemote ? make(descriptor, true) : null];
    return l.filter(notEmpty);
}

export function addTypename<T extends TepLike>(tep: T): T {
    let suffix = DESCRIPTORS[tep.season].typeSuffix(tep.isRemote);
    let __typename = `TeamEventStats${tep.season}${suffix}`;
    return { ...tep, __typename };
}

function make(descriptor: Descriptor, remote: boolean): GraphQLObjectType {
    let nameSuffix = descriptor.typeSuffix(remote);

    let innerFields = {} as Record<string, GraphQLFieldConfig<any, any>>;

    for (let c of descriptor.tepColumns()) {
        if (c.tradOnly && remote) continue;

        innerFields[c.apiName] = FloatTy;
    }

    let inner = new GraphQLObjectType({
        name: `TeamEventStats${descriptor.season}${nameSuffix}Group`,
        fields: innerFields,
    });

    let hasTb2 = descriptor.rankings.tb != "LosingScore";

    let outer = new GraphQLObjectType({
        name: `TeamEventStats${descriptor.season}${nameSuffix}`,
        fields: {
            rank: IntTy,
            rp: FloatTy,
            tb1: FloatTy,
            ...(hasTb2 ? { tb2: FloatTy } : {}),
            ...(!remote ? { wins: IntTy, losses: IntTy, ties: IntTy, dqs: IntTy } : {}),
            qualMatchesPlayed: IntTy,
            tot: { type: nn(inner) },
            avg: { type: nn(inner) },
            min: { type: nn(inner) },
            max: { type: nn(inner) },
            dev: { type: nn(inner) },
            opr: { type: nn(inner) },
        },
    });

    return outer;
}
