import { TeamMatchParticipationFtcApi } from "../ftc-api-types/Match";

export const Alliance = {
    Red: "Red",
    Blue: "Blue",
    Solo: "Solo",
} as const;
export type Alliance = (typeof Alliance)[keyof typeof Alliance];

export function allianceFromApiStation(station: TeamMatchParticipationFtcApi["station"]): Alliance {
    switch (station) {
        case "Red1":
            return Alliance.Red;
        case "Red2":
            return Alliance.Red;
        case "Red3":
            return Alliance.Red;
        case "Blue1":
            return Alliance.Blue;
        case "Blue2":
            return Alliance.Blue;
        case "Blue3":
            return Alliance.Blue;
        case "1":
            return Alliance.Solo;
    }
}

export const AllianceRole = {
    Captain: "Captain",
    FirstPick: "FirstPick",
    SecondPick: "SecondPick",
    Solo: "Solo",
} as const;
export type AllianceRole = (typeof AllianceRole)[keyof typeof AllianceRole];

export function allianceRoleFromApiStation(
    station: TeamMatchParticipationFtcApi["station"]
): AllianceRole {
    switch (station) {
        case "Red1":
            return AllianceRole.Captain;
        case "Red2":
            return AllianceRole.FirstPick;
        case "Red3":
            return AllianceRole.SecondPick;
        case "Blue1":
            return AllianceRole.Captain;
        case "Blue2":
            return AllianceRole.FirstPick;
        case "Blue3":
            return AllianceRole.SecondPick;
        case "1":
            return AllianceRole.Solo;
    }
}
