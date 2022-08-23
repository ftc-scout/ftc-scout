import { Team } from "../../db/entities/Team";
import { Event } from "../../db/entities/Event";
import { Season } from "../../ftc-api/types/Season";
import { createUnionType, Field, Int, ObjectType } from "type-graphql";
import {
    TeamEventStatGroup2021Remote,
    TeamEventStatGroup2021Traditional,
    TeamEventStats2021Remote,
    TeamEventStats2021Traditional,
} from "./TepStats2021";
import { TeamEventParticipation2021 } from "../../db/entities/team-event-participation/TeamEventParticipation2021";
import { TeamEventParticipation2019 } from "../../db/entities/team-event-participation/TeamEventParticipation2019";
import { TeamEventStats2019 } from "./TepStats2019";

export const TeamEventStatsUnion = createUnionType({
    name: "TeamEventStats",
    types: () => [TeamEventStats2021Traditional, TeamEventStats2021Remote, TeamEventStats2019] as const,
});

@ObjectType()
export class TeamEventParticipation {
    constructor(_tep: TeamEventParticipation2021 | TeamEventParticipation2019) {
        this.season = _tep.eventSeason;
        this.eventCode = _tep.eventCode;
        this.teamNumber = _tep.teamNumber;

        if (_tep.eventSeason == 2021) {
            let tep = _tep as TeamEventParticipation2021;

            if (!tep.hasStats) {
                this.stats = null;
            } else if (tep.avg.sharedUnbalancedPoints == null) {
                this.stats = new TeamEventStats2021Remote({
                    rank: tep.rank,
                    rp: tep.rp,
                    tb1: tep.tb1,
                    tb2: tep.tb2,
                    qualMatchesPlayed: tep.qualMatchesPlayed,
                    total: new TeamEventStatGroup2021Remote(tep.tot),
                    average: new TeamEventStatGroup2021Remote(tep.avg),
                    min: new TeamEventStatGroup2021Remote(tep.min),
                    max: new TeamEventStatGroup2021Remote(tep.max),
                    standardDev: new TeamEventStatGroup2021Remote(tep.dev),
                    opr: new TeamEventStatGroup2021Remote(tep.opr),
                } as TeamEventStats2021Remote);
            } else {
                this.stats = new TeamEventStats2021Traditional({
                    rank: tep.rank,
                    rp: tep.rp,
                    tb1: tep.tb1,
                    tb2: tep.tb2,
                    wins: tep.wins,
                    losses: tep.losses,
                    ties: tep.ties,
                    dqs: tep.dq,
                    qualMatchesPlayed: tep.qualMatchesPlayed,
                    total: new TeamEventStatGroup2021Traditional(tep.tot),
                    average: new TeamEventStatGroup2021Traditional(tep.avg),
                    min: new TeamEventStatGroup2021Traditional(tep.min),
                    max: new TeamEventStatGroup2021Traditional(tep.max),
                    standardDev: new TeamEventStatGroup2021Traditional(tep.dev),
                    opr: new TeamEventStatGroup2021Traditional(tep.opr),
                } as TeamEventStats2021Traditional);
            }
        } else if (_tep.eventSeason == 2019) {
            let tep = _tep as TeamEventParticipation2019;

            if (!tep.hasStats) {
                this.stats = null;
            } else {
                this.stats = new TeamEventStats2019({
                    rank: tep.rank,
                    rp: tep.rp,
                    tb: tep.tb,
                    wins: tep.wins,
                    losses: tep.losses,
                    ties: tep.ties,
                    dqs: tep.dq,
                    qualMatchesPlayed: tep.qualMatchesPlayed,
                    total: tep.tot,
                    average: tep.avg,
                    min: tep.min,
                    max: tep.max,
                    standardDev: tep.dev,
                    opr: tep.opr,
                });
            }
        } else {
            throw "Can't create tep for season " + _tep.eventSeason;
        }
    }

    @Field(() => Int, { name: "season" })
    season: Season;

    @Field()
    eventCode: string;

    @Field(() => Int)
    teamNumber: number;

    @Field(() => TeamEventStatsUnion, { nullable: true })
    stats: TeamEventStats2021Remote | TeamEventStats2021Traditional | TeamEventStats2019 | null;
}
