import { Field, Int } from "type-graphql";
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { Event } from "./Event";
import { TeamMatchParticipation } from "./TeamMatchParticipation";

@Entity()
export class Match extends BaseEntity {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Event, (event) => event.matches)
    event!: Event;

    @OneToMany(() => TeamMatchParticipation, (tmp) => tmp.match)
    teams!: TeamMatchParticipation[];

    @Field()
    @Column()
    startTIme!: Date;

    @Field()
    @Column()
    description!: string;

    @Field()
    @Column()
    tournamentLevel!: string;

    @Field(() => Int)
    @Column("int")
    series!: number;

    @Field(() => Int)
    @Column("int")
    matchNumber!: number;

    @Field()
    @Column()
    postResultTime!: Date;

    @Field()
    @CreateDateColumn()
    createdAt!: Date;

    @Field()
    @UpdateDateColumn()
    updatedAt!: Date;
}
