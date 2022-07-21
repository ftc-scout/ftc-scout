import { registerEnumType } from "type-graphql";
import { AwardFtcApi as AwardFtcApi } from "../../../../ftc-api/types/Award";

export type Award2021 = number;

export enum AwardTypes2021 {
    DEANS_LIST_FINALIST = 0,
    DEANS_LIST_SEMI_FINALIST = 100,
    DEANS_LIST_WINNER = 200,
    JUDGES_CHOICE = 300,
    DIVISION_FINALIST = 400,
    DIVISION_WINNER = 500,
    COMPASS = 600,
    PROMOTE = 700,
    CONTROL = 800,
    MOTIVATE = 900,
    DESIGN = 1000,
    INNOVATE = 1100,
    CONNECT = 1200,
    THINK = 1300,
    TOP_RANKED = 1400,
    INSPIRE = 1500,
    WINNER = 1600,
    FINALIST = 1700,
}

registerEnumType(AwardTypes2021, {
    name: "AwardTypes2021",
});

export function awardCode2021FromFtcApi(award: AwardFtcApi): Award2021 | null {
    switch (award.awardId) {
        case 1: // Judges Choice
            return award2021Top(AwardTypes2021.JUDGES_CHOICE, award, 6);
        case 2: // Compass
            return award2021Top(AwardTypes2021.COMPASS, award, 3);
        case 3: // Promote
            return award2021Top(AwardTypes2021.PROMOTE, award, 3);
        case 4: // Control
            return award2021Top(AwardTypes2021.CONTROL, award, 3);
        case 5: // Motivate
            return award2021Top(AwardTypes2021.MOTIVATE, award, 3);
        case 6: // Design
            return award2021Top(AwardTypes2021.DESIGN, award, 3);
        case 7: // Innovate
            return award2021Top(AwardTypes2021.INNOVATE, award, 3);
        case 8: // Connect
            return award2021Top(AwardTypes2021.CONNECT, award, 3);
        case 9: // Think
            return award2021Top(AwardTypes2021.THINK, award, 3);
        case 10: // Dean's List
            if (award.name == "Dean's List Finalists") {
                return award2021Top(AwardTypes2021.DEANS_LIST_FINALIST, award, 100);
            } else if (award.name == "Dean's List Semi-Finalists") {
                return award2021Top(AwardTypes2021.DEANS_LIST_SEMI_FINALIST, award, 100);
            } else if (award.name == "Dean's List Winner") {
                return award2021Top(AwardTypes2021.DEANS_LIST_WINNER, award, 100);
            } else {
                throw `Can't handle Dean's List named '${award.name}'`;
            }
        case 11: // Inspire
            return award2021Top(AwardTypes2021.INSPIRE, award, 3);
        case 13: // Winning Alliance
            return award2021Top(AwardTypes2021.WINNER, award, 3);
        case 12: // Finalist Alliance
            return award2021Top(AwardTypes2021.FINALIST, award, 3);
        case 14: // Top Ranked
            return award2021Top(AwardTypes2021.TOP_RANKED, award, 6);
        case 18: // Volunteer OTY
            return null; // Too annoying to handle.
        case 22: // Division Finalist
            return award2021Top(AwardTypes2021.DIVISION_FINALIST, award, 3);
        case 23: // Division Winner
            return award2021Top(AwardTypes2021.DIVISION_WINNER, award, 3);
        // As far as I can tell these 100 series awards are just the main award shifted down one
        case 102: // Compass Finalist
            return award2021Top(AwardTypes2021.COMPASS, award, 5, true);
        case 103: // Promote Finalist
            return award2021Top(AwardTypes2021.PROMOTE, award, 5, true);
        case 104: // Control Finalist
            return award2021Top(AwardTypes2021.CONTROL, award, 5, true);
        case 105: // Motivate Finalist
            return award2021Top(AwardTypes2021.MOTIVATE, award, 5, true);
        case 106: // Design Finalist
            return award2021Top(AwardTypes2021.DESIGN, award, 5, true);
        case 107: // Innovate Finalist
            return award2021Top(AwardTypes2021.INNOVATE, award, 5, true);
        case 108: // Connect Finalist
            return award2021Top(AwardTypes2021.CONNECT, award, 5, true);
        case 109: // Think Finalist
            return award2021Top(AwardTypes2021.THINK, award, 5, true);
        case 111: // Inspire Finalist
            return award2021Top(AwardTypes2021.INSPIRE, award, 4, true);
        default:
            throw "Can't handle award: " + JSON.stringify(award);
    }
}

function award2021Top(type: AwardTypes2021, award: AwardFtcApi, top: number, shift: boolean = false): Award2021 {
    if (award.series <= top) {
        return type + award.series + (shift ? 1 : 0);
    } else {
        throw "Can't handle award: " + JSON.stringify(award);
    }
}
