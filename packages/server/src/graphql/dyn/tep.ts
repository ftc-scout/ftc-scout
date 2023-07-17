import { DESCRIPTORS, Descriptor, FloatTy, IntTy, nn, notEmpty } from "@ftc-scout/common";
import { GraphQLFieldConfig, GraphQLObjectType } from "graphql";
import { TeamEventParticipation } from "../../db/entities/dyn/team-event-participation";

export function makeTepTypes(descriptor: Descriptor): GraphQLObjectType[] {
    return [
        make(descriptor, false, descriptor.hasRemote),
        descriptor.hasRemote ? make(descriptor, true, true) : null,
    ].filter(notEmpty);
}

export function addTypename(tep: TeamEventParticipation): TeamEventParticipation {
    let hasRemote = DESCRIPTORS[tep.season].hasRemote;
    let nameSuffix = tep.isRemote ? "Remote" : hasRemote ? "Trad" : "";
    let __typename = `TeamEventStats${tep.season}${nameSuffix}`;
    return { ...tep, __typename };
}

function make(descriptor: Descriptor, remote: boolean, hasRemote: boolean): GraphQLObjectType {
    let nameSuffix = remote ? "Remote" : hasRemote ? "Trad" : "";

    let innerFields = {} as Record<string, GraphQLFieldConfig<any, any>>;

    for (let c of descriptor.columns) {
        if (c.tep == undefined) continue;

        innerFields[c.name] = FloatTy;
        if (c.tep.individual) innerFields[c.name + "Individual"] = FloatTy;
    }

    // TODO: remove
    if (Object.keys(innerFields).length == 0) {
        innerFields.placeholder = FloatTy;
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
            wins: IntTy,
            losses: IntTy,
            ties: IntTy,
            dqs: IntTy,
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
