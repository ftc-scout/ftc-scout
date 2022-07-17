import { registerEnumType } from "type-graphql";
import { AwardFtcApi as AwardFtcApi } from "../../../../ftc-api/types/Award";

export type Award2021 = number;

export enum AwardTypes2021 {
    DEANS_LIST = 0,
    JUDGES_CHOICE = 100,
    DIVISION_FINALIST = 300,
    DIVISION_WINNER = 400,
    COMPASS = 700,
    PROMOTE = 800,
    CONTROL = 900,
    MOTIVATE = 1000,
    DESIGN = 1100,
    INNOVATE = 1200,
    CONNECT = 1300,
    THINK = 1400,
    TOP_RANKED = 1500,
    INSPIRE = 1800,
    WINNER = 1900,
    FINALIST = 2000,
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
            return award2021Top(AwardTypes2021.DEANS_LIST, award, 100);
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
