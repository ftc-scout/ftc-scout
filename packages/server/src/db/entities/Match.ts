import { Season, TournamentLevel } from "@ftc-scout/common";
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryColumn,
    UpdateDateColumn,
} from "typeorm";
import { Event } from "./Event";

@Entity()
export class Match extends BaseEntity {
    @PrimaryColumn("smallint")
    eventSeason!: Season;

    @PrimaryColumn()
    eventCode!: string;

    @PrimaryColumn("int")
    id!: string;

    @ManyToOne(() => Event, (event) => event.matches)
    event!: Event;

    @Column()
    hasBeenPlayed!: boolean;

    @Column("timestamptz")
    scheduledStartTime!: Date;

    @Column("timestamptz", { nullable: true })
    actualStartTime!: Date | null;

    @Column("timestamptz", { nullable: true })
    postResultTime!: Date | null;

    @Column("enum", { enum: TournamentLevel })
    tournamentLevel!: TournamentLevel;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
