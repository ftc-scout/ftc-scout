import { BaseEntity, Column, Entity, Index, PrimaryColumn } from "typeorm";
import { Season } from "../../../ftc-api/types/Season";
import { TepStats2019 } from "./TepStats2019";

@Entity()
export class TeamEventParticipation2019 extends BaseEntity {
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
    tb!: number | null;

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

    @Column(() => TepStats2019)
    tot!: TepStats2019;

    @Column(() => TepStats2019)
    avg!: TepStats2019;

    @Column(() => TepStats2019)
    min!: TepStats2019;

    @Column(() => TepStats2019)
    max!: TepStats2019;

    @Column(() => TepStats2019)
    dev!: TepStats2019;

    @Column(() => TepStats2019)
    opr!: TepStats2019;
}
