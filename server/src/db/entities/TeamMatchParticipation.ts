import { Field } from "type-graphql";
import { BaseEntity, Column, Entity, ManyToOne } from "typeorm";
import { Match } from "./Match";
import { Team } from "./Team";

@Entity()
export class TeamMatchParticipation extends BaseEntity {
    @ManyToOne(() => Match, (match) => match.teams)
    match!: Match;

    @ManyToOne(() => Team, (team) => team.matches)
    team!: Team;

    @Field()
    @Column()
    station!: string; // TODO enum

    @Field()
    @Column()
    dq!: boolean;

    @Field()
    @Column()
    onField!: boolean;
}
