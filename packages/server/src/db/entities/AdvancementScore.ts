import { Season } from "@ftc-scout/common";
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

    @Column("int", { nullable: true })
    awardPoints!: number | null;

    @Column("int", { nullable: true })
    totalPoints!: number | null;

    @Column("int", { nullable: true })
    rank!: number | null;

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
            playoffPoints: null,
            awardPoints: null,
            totalPoints: null,
            rank: null,
        } satisfies DeepPartial<AdvancementScore>);
    }
}
