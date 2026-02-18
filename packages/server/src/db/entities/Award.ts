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

export const AwardType = {
    DeansListFinalist: "DeansListFinalist",
    DeansListSemiFinalist: "DeansListSemiFinalist",
    DeansListWinner: "DeansListWinner",
    JudgesChoice: "JudgesChoice",
    DivisionFinalist: "DivisionFinalist",
    DivisionWinner: "DivisionWinner",
    ConferenceFinalist: "ConferenceFinalist",
    Compass: "Compass",
    Promote: "Promote",
    Control: "Control",
    Motivate: "Motivate",
    Reach: "Reach",
    Sustain: "Sustain",
    Design: "Design",
    Innovate: "Innovate",
    Connect: "Connect",
    Think: "Think",
    TopRanked: "TopRanked",
    Inspire: "Inspire",
    Winner: "Winner",
    Finalist: "Finalist",
} as const;
export type AwardType = (typeof AwardType)[keyof typeof AwardType];

@Entity()
export class Award extends BaseEntity {
    @PrimaryColumn("smallint")
    season!: Season;

    @PrimaryColumn()
    eventCode!: string;

    @PrimaryColumn("int")
    teamNumber!: number;

    @PrimaryColumn("enum", { enum: AwardType, enumName: "award_type_enum" })
    type!: AwardType;

    @PrimaryColumn("smallint")
    placement!: number;

    @Column("varchar", { nullable: true })
    divisionName!: string | null;

    @Column("varchar", { nullable: true })
    personName!: string | null;

    @CreateDateColumn({ type: "timestamptz" })
    createdAt!: Date;

    @UpdateDateColumn({ type: "timestamptz" })
    updatedAt!: Date;

    static fromApi(season: Season, api: AwardFtcApi): Award | null {
        if (api.eventCode == null || api.teamNumber == null) {
            return null;
        }

        let divisionName = api.name.includes("Division")
            ? api.name.split("Division")[0].trim()
            : api.name.includes("Conference")
            ? api.name.split("Conference")[0].trim()
            : null;

        let awardCode = awardCodeFromFtcApi(api);
        if (awardCode != null) {
            return Award.create({
                season,
                eventCode: api.eventCode,
                teamNumber: api.teamNumber,
                type: awardCode[0],
                placement: awardCode[1],
                divisionName,
                personName: api.person?.trim() ?? null,
            } satisfies DeepPartial<Award>);
        } else {
            return null;
        }
    }
}

export function awardCodeFromFtcApi(award: AwardFtcApi): [AwardType, number] | null {
    switch (award.awardId) {
        case 1: // Judges Choice
            return [AwardType.JudgesChoice, awardTop(award, 7)];
        case 2: // Compass
            return [AwardType.Compass, awardTop(award, 3)];
        case 3: // Promote
            return [AwardType.Promote, awardTop(award, 3)];
        case 4: // Control
            return [AwardType.Control, awardTop(award, 3)];
        case 5: // Motivate
            return [AwardType.Motivate, awardTop(award, 3)];
        case 6: // Design
            return [AwardType.Design, awardTop(award, 3)];
        case 7: // Innovate
            return [AwardType.Innovate, awardTop(award, 3)];
        case 8: // Connect
            return [AwardType.Connect, awardTop(award, 3)];
        case 9: // Think
            return [AwardType.Think, awardTop(award, 3)];
        case 10: // Dean's List
            if (award.name.includes(" Finalists")) {
                return [AwardType.DeansListFinalist, awardTop(award, 100)];
            } else if (award.name.includes(" Semi-Finalists")) {
                return [AwardType.DeansListSemiFinalist, awardTop(award, 100)];
            } else if (award.name.includes(" Winner")) {
                return [AwardType.DeansListWinner, awardTop(award, 100)];
            } else {
                throw `Can't handle Dean's List named '${award.name}'`;
            }
        case 11: // Inspire
            return [AwardType.Inspire, awardTop(award, 3)];
        case 13: // Winning Alliance
            return [AwardType.Winner, awardTop(award, 3)];
        case 12: // Finalist Alliance
            return [AwardType.Finalist, awardTop(award, 3)];
        case 14: // Top Ranked
            return [AwardType.TopRanked, awardTop(award, 6)];
        case 15: // Innovation Challenge Semifinalist
            return [AwardType.Finalist, awardTop(award, 999)];
        case 17: // Innovation Challenge Winner
            return [AwardType.Winner, awardTop(award, 1)];
        case 18: // Volunteer OTY
        case 19: // Volunteer Award
            return null; // Too annoying to handle.
        case 22: // Division Finalist
            return [AwardType.DivisionFinalist, awardTop(award, 3)];
        case 23: // Division Winner
            return [AwardType.DivisionWinner, awardTop(award, 3)];
        case 24: // Conference Finalist
            return [AwardType.ConferenceFinalist, awardTop(award, 3)];
        case 25: // Reach
            return [AwardType.Reach, awardTop(award, 3)];
        case 26: // Sustain
            return [AwardType.Sustain, awardTop(award, 3)];
        // As far as I can tell these 100 series awards are just the main award shifted down one
        case 102: // Compass Finalist
            return [AwardType.Compass, awardTop(award, 5, true)];
        case 103: // Promote Finalist
            return [AwardType.Promote, awardTop(award, 5, true)];
        case 104: // Control Finalist
            return [AwardType.Control, awardTop(award, 5, true)];
        case 105: // Motivate Finalist
            return [AwardType.Motivate, awardTop(award, 5, true)];
        case 106: // Design Finalist
            return [AwardType.Design, awardTop(award, 5, true)];
        case 107: // Innovate Finalist
            return [AwardType.Innovate, awardTop(award, 5, true)];
        case 108: // Connect Finalist
            return [AwardType.Connect, awardTop(award, 5, true)];
        case 109: // Think Finalist
            return [AwardType.Think, awardTop(award, 5, true)];
        case 111: // Inspire Finalist
            return [AwardType.Inspire, awardTop(award, 4, true)];
        case 125: // Reach Finalist
            return [AwardType.Reach, awardTop(award, 5, true)];
        case 126: // Sustain Finalist
            return [AwardType.Sustain, awardTop(award, 5, true)];
        default:
            throw "Can't handle award: " + JSON.stringify(award);
    }
}

function awardTop(award: AwardFtcApi, top: number, shift: boolean = false): number {
    if (award.series <= top) {
        return award.series + (shift ? 1 : 0);
    } else {
        throw "Can't handle award: " + JSON.stringify(award);
    }
}
