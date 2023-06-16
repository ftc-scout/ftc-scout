import { AwardFtcApi, Season } from "@ftc-scout/common";
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
export class Award extends BaseEntity {
    @PrimaryColumn("smallint")
    season!: Season;

    @PrimaryColumn()
    eventCode!: string;

    @PrimaryColumn("smallint")
    awardCode!: number;

    @PrimaryColumn("int")
    teamNumber!: number;

    @Column("varchar", { nullable: true })
    personName!: string | null;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    static fromApi(season: Season, api: AwardFtcApi): Award | null {
        if (api.eventCode == null || api.teamNumber == null) {
            return null;
        }

        let awardCode = awardCodeFromFtcApi(api);
        if (awardCode) {
            return Award.create({
                season,
                eventCode: api.eventCode,
                awardCode,
                teamNumber: api.teamNumber,
                personName: api.person?.trim() ?? null,
            } satisfies DeepPartial<Award>);
        } else {
            return null;
        }
    }
}

export enum AwardTypes {
    DEANS_LIST_FINALIST = 0,
    DEANS_LIST_SEMI_FINALIST = 100,
    DEANS_LIST_WINNER = 200,
    JUDGES_CHOICE = 300,
    DIVISION_FINALIST = 400,
    DIVISION_WINNER = 500,
    CONFERENCE_FINALIST = 600,
    COMPASS = 700,
    PROMOTE = 800,
    CONTROL = 900,
    MOTIVATE = 1000,
    DESIGN = 1100,
    INNOVATE = 1200,
    CONNECT = 1300,
    THINK = 1400,
    TOP_RANKED = 1500,
    INSPIRE = 1600,
    WINNER = 1700,
    FINALIST = 1800,
}

export function awardCodeFromFtcApi(award: AwardFtcApi): number | null {
    switch (award.awardId) {
        case 1: // Judges Choice
            return awardTop(AwardTypes.JUDGES_CHOICE, award, 7);
        case 2: // Compass
            return awardTop(AwardTypes.COMPASS, award, 3);
        case 3: // Promote
            return awardTop(AwardTypes.PROMOTE, award, 3);
        case 4: // Control
            return awardTop(AwardTypes.CONTROL, award, 3);
        case 5: // Motivate
            return awardTop(AwardTypes.MOTIVATE, award, 3);
        case 6: // Design
            return awardTop(AwardTypes.DESIGN, award, 3);
        case 7: // Innovate
            return awardTop(AwardTypes.INNOVATE, award, 3);
        case 8: // Connect
            return awardTop(AwardTypes.CONNECT, award, 3);
        case 9: // Think
            return awardTop(AwardTypes.THINK, award, 3);
        case 10: // Dean's List
            if (award.name == "Dean's List Finalists") {
                return awardTop(AwardTypes.DEANS_LIST_FINALIST, award, 100);
            } else if (award.name == "Dean's List Semi-Finalists") {
                return awardTop(AwardTypes.DEANS_LIST_SEMI_FINALIST, award, 100);
            } else if (award.name == "Dean's List Winner") {
                return awardTop(AwardTypes.DEANS_LIST_WINNER, award, 100);
            } else {
                throw `Can't handle Dean's List named '${award.name}'`;
            }
        case 11: // Inspire
            return awardTop(AwardTypes.INSPIRE, award, 3);
        case 13: // Winning Alliance
            return awardTop(AwardTypes.WINNER, award, 3);
        case 12: // Finalist Alliance
            return awardTop(AwardTypes.FINALIST, award, 3);
        case 14: // Top Ranked
            return awardTop(AwardTypes.TOP_RANKED, award, 6);
        case 15: // Innovation Challenge Semifinalist
            return awardTop(AwardTypes.FINALIST, award, 999);
        case 17: // Innovation Challenge Winner
            return awardTop(AwardTypes.WINNER, award, 1);
        case 18: // Volunteer OTY
            return null; // Too annoying to handle.
        case 22: // Division Finalist
            return awardTop(AwardTypes.DIVISION_FINALIST, award, 3);
        case 23: // Division Winner
            return awardTop(AwardTypes.DIVISION_WINNER, award, 3);
        case 24: // Conference Finalist
            return awardTop(AwardTypes.CONFERENCE_FINALIST, award, 3);
        // As far as I can tell these 100 series awards are just the main award shifted down one
        case 102: // Compass Finalist
            return awardTop(AwardTypes.COMPASS, award, 5, true);
        case 103: // Promote Finalist
            return awardTop(AwardTypes.PROMOTE, award, 5, true);
        case 104: // Control Finalist
            return awardTop(AwardTypes.CONTROL, award, 5, true);
        case 105: // Motivate Finalist
            return awardTop(AwardTypes.MOTIVATE, award, 5, true);
        case 106: // Design Finalist
            return awardTop(AwardTypes.DESIGN, award, 5, true);
        case 107: // Innovate Finalist
            return awardTop(AwardTypes.INNOVATE, award, 5, true);
        case 108: // Connect Finalist
            return awardTop(AwardTypes.CONNECT, award, 5, true);
        case 109: // Think Finalist
            return awardTop(AwardTypes.THINK, award, 5, true);
        case 111: // Inspire Finalist
            return awardTop(AwardTypes.INSPIRE, award, 4, true);
        default:
            throw "Can't handle award: " + JSON.stringify(award);
    }
}

function awardTop(
    type: AwardTypes,
    award: AwardFtcApi,
    top: number,
    shift: boolean = false
): number {
    if (award.series <= top) {
        return type + award.series + (shift ? 1 : 0);
    } else {
        throw "Can't handle award: " + JSON.stringify(award);
    }
}
