import { Field, Int, ObjectType } from "type-graphql";
import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import { Match } from "./Match";
import { Team } from "./Team";
import { TypeormLoader } from "type-graphql-dataloader";

@ObjectType()
@Entity()
export class TeamMatchParticipation extends BaseEntity {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id!: number;

    @Field(() => Match)
    @ManyToOne(() => Match, (match) => match.teams)
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
