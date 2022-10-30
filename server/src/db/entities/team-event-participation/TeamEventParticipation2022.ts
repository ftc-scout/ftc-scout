import { BaseEntity, Column, Entity, Index, PrimaryColumn } from "typeorm";
import { Season } from "../../../ftc-api/types/Season";
import { TepStats2022 } from "./TepStats2022";

@Entity()
export class TeamEventParticipation2022 extends BaseEntity {
    @PrimaryColumn("smallint")
    eventSeason!: Season;

    @PrimaryColumn()
    eventCode!: string;

    @PrimaryColumn("int")
    teamNumber!: number;

    @Column("float", { nullable: true })
    @Index()
    rp!: number | null;

    @Column("float", { nullable: true })
    tb1!: number | null;

    @Column("float", { nullable: true })
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

    @Column(() => TepStats2022)
    tot!: TepStats2022;

    @Column(() => TepStats2022)
    avg!: TepStats2022;

    @Column(() => TepStats2022)
    min!: TepStats2022;

    @Column(() => TepStats2022)
    max!: TepStats2022;

    @Column(() => TepStats2022)
    dev!: TepStats2022;

    @Column(() => TepStats2022)
    opr!: TepStats2022;
}
