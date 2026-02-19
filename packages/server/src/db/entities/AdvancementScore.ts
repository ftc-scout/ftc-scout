import { Season, AdvancementEligibility } from "@ftc-scout/common";
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    DeepPartial,
    Entity,
    PrimaryColumn,
    UpdateDateColumn,
} from "typeorm";

@Entity()
export class AdvancementScore extends BaseEntity {
    @PrimaryColumn("smallint")
    season!: Season;

    @PrimaryColumn()
    eventCode!: string;

    @PrimaryColumn("int")
    teamNumber!: number;

    @Column("int", { nullable: true })
    qualPoints!: number | null;

    @Column("bool", { default: false })
    isQualFinal!: boolean;

    @Column("int", { nullable: true })
    allianceSelectionPoints!: number | null;

    @Column("bool", { default: false })
    isAllianceSelectionFinal!: boolean;

    @Column("int", { nullable: true })
    playoffPoints!: number | null;

    @Column("bool", { default: false })
    isPlayoffPointsFinal!: boolean;

    @Column("int", { nullable: true })
    awardPoints!: number | null;

    @Column("int", { nullable: true })
    totalPoints!: number | null;

    @Column("int", { nullable: true })
    rank!: number | null;

    @Column("int", { nullable: true })
    advancementRank!: number | null;

    @Column("bool", { default: true })
    isAdvancementEligible!: boolean;

    @Column({
        type: "varchar",
        default: AdvancementEligibility.Eligible,
    })
    eligibility!: AdvancementEligibility;

    @Column("bool", { default: false })
    advanced!: boolean;

    @CreateDateColumn({ type: "timestamptz" })
    createdAt!: Date;

    @UpdateDateColumn({ type: "timestamptz" })
    updatedAt!: Date;

    static createEmpty(season: Season, eventCode: string, teamNumber: number): AdvancementScore {
        return AdvancementScore.create({
            season,
            eventCode,
            teamNumber,
            qualPoints: null,
            isQualFinal: false,
            allianceSelectionPoints: null,
            isAllianceSelectionFinal: false,
            eligibility: AdvancementEligibility.Eligible,
            playoffPoints: null,
            isPlayoffPointsFinal: false,
            awardPoints: null,
            totalPoints: null,
            rank: null,
            advancementRank: null,
            isAdvancementEligible: true,
            advanced: false,
        } satisfies DeepPartial<AdvancementScore>);
    }
}
