import { AwardType } from "../graphql/generated/graphql-operations";
import { prettyPrintOrdinal } from "./number";

export function prettyPrintAwardCategory(type: AwardType): string {
    switch (type) {
        case AwardType.Compass:
        case AwardType.Connect:
        case AwardType.Control:
        case AwardType.Design:
        case AwardType.Innovate:
        case AwardType.Inspire:
        case AwardType.JudgesChoice:
        case AwardType.Motivate:
        case AwardType.Promote:
        case AwardType.Think:
            return prettyPrintAwardName(type) + " Winners";
        case AwardType.DeansListFinalist:
        case AwardType.DeansListSemiFinalist:
        case AwardType.DeansListWinner:
            return prettyPrintAwardName(type) + "s";
        case AwardType.Winner:
        case AwardType.Finalist:
        case AwardType.DivisionFinalist:
        case AwardType.DivisionWinner:
        case AwardType.TopRanked:
            return prettyPrintAwardName(type);
        default:
            console.error(`Unknown award ${type}`);
            return "Unknown Award";
    }
}

export function prettyPrintAwardName(type: AwardType): string {
    switch (type) {
        case AwardType.Compass:
            return "Compass Award";
        case AwardType.Connect:
            return "Connect Award";
        case AwardType.Control:
            return "Control Award";
        case AwardType.DeansListFinalist:
            return "Dean's List Finalist";
        case AwardType.DeansListSemiFinalist:
            return "Dean's List Semifinalist";
        case AwardType.DeansListWinner:
            return "Dean's List Winner";
        case AwardType.Design:
            return "Design Award";
        case AwardType.DivisionFinalist:
            return "Division Finalist Alliance";
        case AwardType.DivisionWinner:
            return "Division Winning Alliance";
        case AwardType.Winner:
            return "Winning Alliance";
        case AwardType.Finalist:
            return "Finalist Alliance";
        case AwardType.Innovate:
            return "Innovate Award";
        case AwardType.Inspire:
            return "Inspire Award";
        case AwardType.JudgesChoice:
            return "Judges' Choice Award";
        case AwardType.Motivate:
            return "Motivate Award";
        case AwardType.Promote:
            return "Promote Award";
        case AwardType.Think:
            return "Think Award";
        case AwardType.TopRanked:
            return "Top Ranked";
        default:
            console.error(`Unknown award ${type}`);
            return "Unknown Award1";
    }
}

export function prettyPrintAwardPlacement(type: AwardType, placement: number): string {
    switch (type) {
        case AwardType.DeansListFinalist:
        case AwardType.DeansListSemiFinalist:
        case AwardType.DeansListWinner:
            return prettyPrintAwardName(type);
        case AwardType.DivisionFinalist:
        case AwardType.DivisionWinner:
        case AwardType.Winner:
        case AwardType.Finalist:
            return `${prettyPrintAwardName(type)} ${alliancePlacement(placement)}`;
        case AwardType.TopRanked:
            return `Top Ranked ${prettyPrintOrdinal(placement)}`;
        default:
            return `${prettyPrintAwardName(type)} ${winnerOrOrdinal(placement)}`;
    }
}

export function prettyPrintAwardPlacementParts(
    type: AwardType,
    placement: number,
    name: string | null
): [string, string] {
    switch (type) {
        case AwardType.DeansListFinalist:
        case AwardType.DeansListSemiFinalist:
        case AwardType.DeansListWinner:
            return [prettyPrintAwardName(type), `(${name})`];
        case AwardType.DivisionFinalist:
        case AwardType.DivisionWinner:
        case AwardType.Winner:
        case AwardType.Finalist:
            return [prettyPrintAwardName(type), alliancePlacement(placement)];
        case AwardType.TopRanked:
            return ["Top Ranked", prettyPrintOrdinal(placement) + " Place"];
        default:
            return [prettyPrintAwardName(type), winnerOrOrdinal(placement)];
    }
}

export function awardHasName(type: AwardType): boolean {
    return (
        type == AwardType.DeansListFinalist ||
        type == AwardType.DeansListSemiFinalist ||
        type == AwardType.DeansListWinner
    );
}

function winnerOrOrdinal(placement: number): string {
    return placement == 1 ? "Winner" : `${prettyPrintOrdinal(placement)} Place`;
}

function alliancePlacement(placement: number): string {
    return placement == 1 ? "Captain" : `${prettyPrintOrdinal(placement - 1)} Pick`;
}
