import { BaseEntity, Column, Entity, Index, PrimaryColumn } from "typeorm";
import { Season } from "../../../ftc-api/types/Season";
import { TepStats2021 } from "./TepStats2021";

@Entity()
export class TeamEventParticipation2021 extends BaseEntity {
    @PrimaryColumn("smallint")
    eventSeason!: Season;

    @PrimaryColumn()
    eventCode!: string;

    @PrimaryColumn("int")
    teamNumber!: number;

    @Column("int", { nullable: true })
    @Index()
    rp!: number | null;

    @Column("int", { nullable: true })
    tb1!: number | null;

    @Column("int", { nullable: true })
    tb2!: number | null;

    @Column("int8", { nullable: true })
    @Index()
    rank!: number | null;

    @Column("int8", { nullable: true })
    wins!: number | null;

    @Column("int8", { nullable: true })
    losses!: number | null;

    @Column("int8", { nullable: true })
    ties!: number | null;

    @Column("int8", { nullable: true })
    dq!: number | null;

    @Column("int8", { nullable: true })
    @Index()
    qualMatchesPlayed!: number | null;

    @Column()
    @Index()
    hasStats!: boolean;

    @Column(() => TepStats2021)
    tot!: TepStats2021;

    @Column(() => TepStats2021)
    avg!: TepStats2021;

    @Column(() => TepStats2021)
    min!: TepStats2021;

    @Column(() => TepStats2021)
    max!: TepStats2021;

    @Column(() => TepStats2021)
    dev!: TepStats2021;

    @Column(() => TepStats2021)
    opr!: TepStats2021;
}
