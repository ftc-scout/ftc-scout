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
import { EVENT_CODE_LEN } from "./Event";
import { Season } from "../../ftc-api/types/Season";
import { Station } from "./types/Station";
import { TypeormLoader } from "type-graphql-dataloader";

@ObjectType()
@Entity()
export class TeamMatchParticipation extends BaseEntity {
    @Field(() => Int)
    @PrimaryColumn("smallint")
    season!: Season;

    @PrimaryColumn({ length: EVENT_CODE_LEN })
    eventCode!: string;

    @PrimaryColumn("int")
    matchNum!: number;

    @PrimaryColumn("int")
    teamNumber!: number;

    // It seems typeorm can't handle multiple relations using the same columns as foreign keys.

    // @Field(() => Event)
    // @ManyToOne(() => Event, (event) => event.teamMatches)
    // @JoinColumn([
    //     { name: "season", referencedColumnName: "season" },
    //     { name: "eventCode", referencedColumnName: "code" },
    // ])
    // @TypeormLoader()
    // event!: Event;

    @Field(() => Match)
    @ManyToOne(() => Match, (match) => match.teams)
    @JoinColumn([
        { name: "season", referencedColumnName: "eventSeason" },
        { name: "eventCode", referencedColumnName: "eventCode" },
        { name: "matchNum", referencedColumnName: "num" },
    ])
    @TypeormLoader()
    match!: Match;

    @Field(() => Team)
    @ManyToOne(() => Team, (team) => team.matches)
    @TypeormLoader()
    team!: Team;

    @Field(() => Station)
    @Column("enum", { enum: Station })
    station!: Station;

    @Field()
    @Column()
    surrogate!: boolean;

    @Field(() => Boolean, { nullable: true })
    @Column("bool", { nullable: true })
    noShow!: boolean | null;

    @Field(() => Boolean, { nullable: true })
    @Column("bool", { nullable: true })
    dq!: boolean | null;

    @Field(() => Boolean, { nullable: true })
    @Column("bool", { nullable: true })
    onField!: boolean | null;
}
