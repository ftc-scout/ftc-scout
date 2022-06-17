import { Field, Int, ObjectType } from "type-graphql";
import {
    BaseEntity,
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryColumn,
} from "typeorm";
import { Match } from "./Match";
import { Team } from "./Team";
import { TypeormLoader } from "type-graphql-dataloader";
import { EVENT_CODE_LEN } from "./Event";
import { Season } from "../../ftc-api/types/Season";
import { Event } from "./Event";

@ObjectType()
@Entity()
export class TeamMatchParticipation extends BaseEntity {
    @Field(() => Int, { name: "season" })
    @PrimaryColumn("smallint")
    eventSeason!: Season;

    @PrimaryColumn("varchar", { length: EVENT_CODE_LEN })
    eventCode!: string;

    @PrimaryColumn("int")
    matchNum!: number;

    @PrimaryColumn("int")
    teamNumber!: number;

    @Field(() => Event)
    @ManyToOne(() => Event, (event) => event.teamMatches)
    @TypeormLoader()
    event!: Event;

    @Field(() => Match)
    @ManyToOne(() => Match, (match) => match.teams)
    @JoinColumn([
        { name: "eventSeason", referencedColumnName: "eventSeason" },
        { name: "eventCode", referencedColumnName: "eventCode" },
        { name: "matchNum", referencedColumnName: "num" },
    ])
    @TypeormLoader()
    match!: Match;

    @Field(() => Team)
    @ManyToOne(() => Team, (team) => team.matches)
    @TypeormLoader()
    team!: Team;

    @Field()
    @Column()
    station!: string; // TODO enum

    @Field()
    @Column()
    surrogate!: boolean;

    @Field(() => Boolean, { nullable: true })
    @Column("bool", { nullable: true })
    noShow!: boolean | null;

    @Field(() => Boolean, { nullable: true })
    @Column("bool", { nullable: true })
    dq!: boolean;

    @Field(() => Boolean, { nullable: true })
    @Column("bool", { nullable: true })
    onField!: boolean;
}
