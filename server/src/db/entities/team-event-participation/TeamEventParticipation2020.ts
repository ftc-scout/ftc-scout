import { BaseEntity, Column, Entity, Index, PrimaryColumn } from "typeorm";
import { Season } from "../../../ftc-api/types/Season";
import { TepStats2020 } from "./TepStats2020";

@Entity()
export class TeamEventParticipation2020 extends BaseEntity {
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

    @Column(() => TepStats2020)
    tot!: TepStats2020;

    @Column(() => TepStats2020)
    avg!: TepStats2020;

    @Column(() => TepStats2020)
    min!: TepStats2020;

    @Column(() => TepStats2020)
    max!: TepStats2020;

    @Column(() => TepStats2020)
    dev!: TepStats2020;

    @Column(() => TepStats2020)
    opr!: TepStats2020;
}
