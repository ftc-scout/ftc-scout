import {
    Alliance,
    Match2022FieldName,
    MatchGroup,
    Station,
    type MatchScores2022Alliance,
    type RecordsEventFragment,
} from "../../../graphql/generated/graphql-operations";
import { DisplayWhen, makeStatFn, makeStatMaybe, type Stat } from "../Stat";
import { StatColor } from "../stat-color";
import { StatDisplayType } from "../stat-display-type";
import { groupGetter, type StatSet, type StatSetGroup } from "../StatSet";

export type FullScores2022Shared = MatchScores2022Alliance;

const TOTAL_POINTS_STAT: Stat<FullScores2022Shared> = makeStatMaybe(
    "totalPoints",
    "Total Points",
    "Total",
    "Total Points",
    DisplayWhen.ALWAYS,
    Match2022FieldName.TotalPoints,
    null
);

const TOTAL_POINTS_NP_STAT: Stat<FullScores2022Shared> = makeStatMaybe(
    "totalPointsNp",
    "Total Points No Penalties",
    "Total NP",
    "Total Points No Penalties",
    DisplayWhen.ALWAYS,
    Match2022FieldName.TotalPointsNp,
    null
);

// ------------------------------------------------------------------------------------------------------------------------

const AUTO_POINTS_STAT: Stat<FullScores2022Shared> = makeStatMaybe(
    "autoPoints",
    "Auto Points",
    "Auto",
    "Auto Points",
    DisplayWhen.ALWAYS,
    Match2022FieldName.AutoPoints
);

const AUTO_NAV_STAT: Stat<FullScores2022Shared> = makeStatMaybe(
    "autoNavigationPoints",
    "Auto Navigation Points",
    "Auto Nav",
    "Auto Navigation Points",
    DisplayWhen.ALWAYS,
    Match2022FieldName.AutoNavigationPoints
);

const AUTO_CONE_STAT: Stat<FullScores2022Shared> = makeStatMaybe(
    "autoConePoints",
    "Auto Cone Points",
    "Auto Cone",
    "Auto Cone Points",
    DisplayWhen.ALWAYS,
    Match2022FieldName.AutoConePoints
);

export const AUTO_CONE_TERMINAL_STAT: Stat<FullScores2022Shared> = makeStatFn(
    (a) => a.data.autoTerminalCones,
    "Terminal",
    "Auto Terminal",
    "Auto Terminal Points",
    DisplayWhen.ALWAYS,
    Match2022FieldName.AutoTerminalPoints
);
export const AUTO_CONE_GROUND_STAT: Stat<FullScores2022Shared> = makeStatFn(
    (a) => a.data.autoGroundCones * 2,
    "Ground",
    "Auto Ground",
    "Auto Ground Points",
    DisplayWhen.ALWAYS,
    Match2022FieldName.AutoGroundPoints
);
export const AUTO_CONE_LOW_STAT: Stat<FullScores2022Shared> = makeStatFn(
    (a) => a.data.autoLowCones * 3,
    "Low",
    "Auto Low",
    "Auto Low Points",
    DisplayWhen.ALWAYS,
    Match2022FieldName.AutoLowPoints
);
export const AUTO_CONE_MEDIUM_STAT: Stat<FullScores2022Shared> = makeStatFn(
    (a) => a.data.autoMediumCones * 4,
    "Medium",
    "Auto Medium",
    "Auto Medium Points",
    DisplayWhen.ALWAYS,
    Match2022FieldName.AutoMediumPoints
);
export const AUTO_CONE_HIGH_STAT: Stat<FullScores2022Shared> = makeStatFn(
    (a) => a.data.autoHighCones * 5,
    "High",
    "Auto High",
    "Auto High Points",
    DisplayWhen.ALWAYS,
    Match2022FieldName.AutoHighPoints
);

// ------------------------------------------------------------------------------------------------------------------------

const DC_POINTS_STAT: Stat<FullScores2022Shared> = makeStatMaybe(
    "dcPoints",
    "Driver Controlled Points",
    "Teleop",
    "Driver Controlled Points",
    DisplayWhen.ALWAYS,
    Match2022FieldName.DriverControlledPoints
);

export const DC_CONE_TERMINAL_STAT: Stat<FullScores2022Shared> = makeStatFn(
    (a) => a.data.dcTerminalCones,
    "Terminal",
    "DC Terminal",
    "Driver Controlled Terminal Points",
    DisplayWhen.ALWAYS,
    Match2022FieldName.DcTerminalPoints
);
export const DC_CONE_GROUND_STAT: Stat<FullScores2022Shared> = makeStatFn(
    (a) => a.data.dcGroundCones * 2,
    "Ground",
    "DC Ground",
    "Driver Controlled Ground Points",
    DisplayWhen.ALWAYS,
    Match2022FieldName.DcGroundPoints
);
export const DC_CONE_LOW_STAT: Stat<FullScores2022Shared> = makeStatFn(
    (a) => a.data.dcLowCones * 3,
    "Low",
    "DC Low",
    "Driver Controlled Low Points",
    DisplayWhen.ALWAYS,
    Match2022FieldName.DcLowPoints
);
export const DC_CONE_MEDIUM_STAT: Stat<FullScores2022Shared> = makeStatFn(
    (a) => a.data.dcMediumCones * 4,
    "Medium",
    "DC Medium",
    "Driver Controlled Medium Points",
    DisplayWhen.ALWAYS,
    Match2022FieldName.DcMediumPoints
);
export const DC_CONE_HIGH_STAT: Stat<FullScores2022Shared> = makeStatFn(
    (a) => a.data.dcHighCones * 5,
    "High",
    "DC High",
    "Driver Controlled High Points",
    DisplayWhen.ALWAYS,
    Match2022FieldName.DcHighPoints
);

// ------------------------------------------------------------------------------------------------------------------------

export const ENDGAME_POINTS_STAT: Stat<FullScores2022Shared> = makeStatMaybe(
    "endgamePoints",
    "Endgame Points",
    "Endgame",
    "Endgame Points",
    DisplayWhen.ALWAYS,
    Match2022FieldName.EndgamePoints
);

export const EG_NAV_STAT: Stat<FullScores2022Shared> = makeStatMaybe(
    "endgameNavigationPoints",
    "Endgame Navigation Points",
    "Endgame Nav",
    "Endgame Navigation Points",
    DisplayWhen.ALWAYS,
    Match2022FieldName.EndgameNavigationPoints
);

export const OWNERSHIP_STAT: Stat<FullScores2022Shared> = makeStatMaybe(
    "ownershipPoints",
    "Ownership Points",
    "Ownership",
    "Ownership Points",
    DisplayWhen.ALWAYS,
    Match2022FieldName.OwnershipPoints
);
export const CONE_OWNERSHIP_STAT: Stat<FullScores2022Shared> = makeStatFn(
    (a) => a.data.coneOwnedJunctions * 3,
    "Regular",
    "Regular Ownership",
    "Regular Ownership Points",
    DisplayWhen.ALWAYS,
    Match2022FieldName.ConeOwnershipPoints
);
export const BEACON_OWNERSHIP_STAT: Stat<FullScores2022Shared> = makeStatFn(
    (a) => a.data.beaconOwnedJunctions * 10,
    "Beacon",
    "Beacon Ownership",
    "Beacon Ownership Points",
    DisplayWhen.ALWAYS,
    Match2022FieldName.BeaconOwnershipPoints
);

export const CIRCUIT_STAT: Stat<FullScores2022Shared> = makeStatMaybe(
    "circuitPoints",
    "Circuit Points",
    "Circuit",
    "Circuit Points",
    DisplayWhen.ALWAYS,
    Match2022FieldName.CircuitPoints
);

// ------------------------------------------------------------------------------------------------------------------------

export const PENALTIES_STAT: Stat<FullScores2022Shared> = makeStatMaybe(
    "penaltyPoints",
    "Penalty Points",
    "Penalties",
    "Penalty Points",
    DisplayWhen.ALWAYS,
    Match2022FieldName.PenaltyPoints
);

export const PENALTIES_MAJOR_STAT: Stat<FullScores2022Shared> = makeStatFn(
    (s) => (s.data ? s.data.majorPenalties * -30 : null),
    "Major Penalty Points",
    "Majors",
    "Major Penalty Points",
    DisplayWhen.ALWAYS,
    Match2022FieldName.MajorPenaltyPoints
);

export const PENALTIES_MINOR_STAT: Stat<FullScores2022Shared> = makeStatFn(
    (s) => (s.data ? s.data.minorPenalties * -10 : null),
    "Minor Penalty Points",
    "Minors",
    "Minor Penalty Points",
    DisplayWhen.ALWAYS,
    Match2022FieldName.MinorPenaltyPoints
);

// ------------------------------------------------------------------------------------------------------------------------

type TeamsT =
    | {
          teams: {
              station: Station;
              team: {
                  number: number;
                  name: string;
              };
          }[];
      }
    | {
          team: {
              team: {
                  number: number;
                  name: string;
              };
          };
      };

function extractTeam(data: TeamsT | null, num: 1 | 2 | 3): { number: number; name: string } | null {
    if (data == null) {
        return null;
    } else if ("team" in data) {
        if (num == 1) return data.team.team;
        return null;
    } else {
        switch (num) {
            case 1:
                return data.teams.find((t) => t.station == Station.Blue_1 || t.station == Station.Red_1)?.team ?? null;
            case 2:
                return data.teams.find((t) => t.station == Station.Blue_2 || t.station == Station.Red_2)?.team ?? null;
            case 3:
                return data.teams.find((t) => t.station == Station.Blue_3 || t.station == Station.Red_3)?.team ?? null;
        }
    }
}

export const TEAM_1: Stat<TeamsT | null> = {
    color: StatColor.WHITE,
    displayType: StatDisplayType.TEAM,
    listName: "Team 1",
    columnName: "Team 1",
    identifierName: "Team 1",
    displayWhen: DisplayWhen.ALWAYS,
    read: (s) => extractTeam(s.data, 1),
    apiField: { fieldName: Match2022FieldName.Team1Number },
};

export const TEAM_2: Stat<TeamsT | null> = {
    color: StatColor.WHITE,
    displayType: StatDisplayType.TEAM,
    listName: "Team 2",
    columnName: "Team 2",
    identifierName: "Team 2",
    displayWhen: DisplayWhen.ALWAYS,
    read: (s) => extractTeam(s.data, 2),
    apiField: { fieldName: Match2022FieldName.Team2Number },
};

export const TEAM_3: Stat<TeamsT | null> = {
    color: StatColor.WHITE,
    displayType: StatDisplayType.TEAM,
    listName: "Team 3",
    columnName: "Team 3",
    identifierName: "Team 3",
    displayWhen: DisplayWhen.ALWAYS,
    read: (s) => extractTeam(s.data, 3),
    apiField: { fieldName: Match2022FieldName.Team3Number },
};

export const EVENT_STAT: Stat<{ event: RecordsEventFragment }> = {
    color: StatColor.WHITE,
    displayType: StatDisplayType.EVENT,
    listName: "Event",
    columnName: "Event",
    identifierName: "Event",
    displayWhen: DisplayWhen.ALWAYS,
    read: (s) => ({
        name: s.data.event.name,
        start: s.data.event.start,
        end: s.data.event.end,
        code: s.data.event.code,
        season: s.data.event.season,
    }),
    apiField: { fieldName: Match2022FieldName.EventName },
};

export const MATCH_DESCRIPTION_STAT: Stat<{ match: { matchDescription: string } }> = {
    color: StatColor.WHITE,
    displayType: StatDisplayType.STRING,
    listName: "Match Number",
    columnName: "Match Num",
    identifierName: "Match Number",
    displayWhen: DisplayWhen.ALWAYS,
    read: (s) => s.data.match.matchDescription,
    apiField: { fieldName: Match2022FieldName.MatchNumber },
};

function capitalizeFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLocaleLowerCase();
}

export const ALLIANCE_STAT: Stat<{ alliance?: Alliance }> = {
    color: StatColor.WHITE,
    displayType: StatDisplayType.STRING,
    listName: "Alliance",
    columnName: "Alliance",
    identifierName: "Alliance",
    displayWhen: DisplayWhen.TRAD,
    read: (s) => ("alliance" in s.data ? capitalizeFirstLetter(s.data.alliance) : "Solo"),
    apiField: { fieldName: Match2022FieldName.Alliance },
};

export let STAT_SET_MATCHES_2022: StatSet<FullScores2022Shared, FullScores2022Shared> = [
    {
        name: "Scores",
        type: "group",
        set: {
            groups: [
                {
                    longName: "This",
                    shortName: "THIS",
                    description: "Points scored by the alliance the row is about.",
                    color: StatColor.BLUE,
                    get: (s) =>
                        groupGetter((t) => ({ ...t, data: t.data }), s, StatColor.BLUE, "", "", "", MatchGroup.This),
                },
                {
                    longName: "Opp",
                    shortName: "OPP",
                    description: "Points scored by the opposing alliance.",
                    color: StatColor.RED,
                    get: (s) =>
                        groupGetter(
                            (t) => ({
                                ...t,
                                data: t.data && "opponentsScore" in t.data ? t.data.opponentsScore : null,
                            }),
                            s,
                            StatColor.RED,
                            "Opp",
                            "Opponent",
                            "Opponent",
                            MatchGroup.Other
                        ),
                },
            ],

            groupStats: [
                {
                    stat: TOTAL_POINTS_STAT,
                    nestedStats: [],
                },
                {
                    stat: TOTAL_POINTS_NP_STAT,
                    nestedStats: [],
                },
                {
                    stat: AUTO_POINTS_STAT,
                    nestedStats: [
                        {
                            stat: AUTO_NAV_STAT,
                            nestedStats: [],
                        },
                        {
                            stat: AUTO_CONE_STAT,
                            nestedStats: [
                                {
                                    stat: AUTO_CONE_TERMINAL_STAT,
                                    nestedStats: [],
                                },
                                {
                                    stat: AUTO_CONE_GROUND_STAT,
                                    nestedStats: [],
                                },
                                {
                                    stat: AUTO_CONE_LOW_STAT,
                                    nestedStats: [],
                                },
                                {
                                    stat: AUTO_CONE_MEDIUM_STAT,
                                    nestedStats: [],
                                },
                                {
                                    stat: AUTO_CONE_HIGH_STAT,
                                    nestedStats: [],
                                },
                            ],
                        },
                    ],
                },
                {
                    stat: DC_POINTS_STAT,
                    nestedStats: [
                        {
                            stat: DC_CONE_TERMINAL_STAT,
                            nestedStats: [],
                        },
                        {
                            stat: DC_CONE_GROUND_STAT,
                            nestedStats: [],
                        },
                        {
                            stat: DC_CONE_LOW_STAT,
                            nestedStats: [],
                        },
                        {
                            stat: DC_CONE_MEDIUM_STAT,
                            nestedStats: [],
                        },
                        {
                            stat: DC_CONE_HIGH_STAT,
                            nestedStats: [],
                        },
                    ],
                },
                {
                    stat: ENDGAME_POINTS_STAT,
                    nestedStats: [
                        {
                            stat: EG_NAV_STAT,
                            nestedStats: [],
                        },
                        {
                            stat: OWNERSHIP_STAT,
                            nestedStats: [
                                {
                                    stat: CONE_OWNERSHIP_STAT,
                                    nestedStats: [],
                                },
                                {
                                    stat: BEACON_OWNERSHIP_STAT,
                                    nestedStats: [],
                                },
                            ],
                        },
                        {
                            stat: CIRCUIT_STAT,
                            nestedStats: [],
                        },
                    ],
                },
                {
                    stat: PENALTIES_STAT,
                    nestedStats: [
                        {
                            stat: PENALTIES_MAJOR_STAT,
                            nestedStats: [],
                        },
                        {
                            stat: PENALTIES_MINOR_STAT,
                            nestedStats: [],
                        },
                    ],
                },
            ],
        },
    },
    {
        name: "Teams",
        type: "group",
        set: {
            groups: [
                {
                    longName: "This",
                    shortName: "THIS",
                    description: "Teams on the alliance the row is about.",
                    color: StatColor.BLUE,
                    get: (s) =>
                        groupGetter((t) => ({ ...t, data: t.data }), s, StatColor.WHITE, "", "", "", MatchGroup.This),
                },
                {
                    longName: "Opp",
                    shortName: "OPP",
                    description: "Teams on the opposing alliance.",
                    color: StatColor.RED,
                    get: (s) =>
                        groupGetter(
                            (t) => ({
                                ...t,
                                data: t.data && "opponentsScore" in t.data ? t.data.opponentsScore : null,
                            }),
                            s,
                            StatColor.WHITE,
                            "Opp",
                            "Opponent",
                            "Opponent",
                            MatchGroup.Other
                        ),
                },
            ],

            groupStats: [
                {
                    stat: TEAM_1,
                    nestedStats: [],
                },
                {
                    stat: TEAM_2,
                    nestedStats: [],
                },
                {
                    stat: TEAM_3,
                    nestedStats: [],
                },
            ],
        },
    },
    {
        name: "Info",
        type: "standalone",
        set: {
            standalone: [MATCH_DESCRIPTION_STAT as any, ALLIANCE_STAT as any, EVENT_STAT as any],
        },
    },
];

const SCORES = STAT_SET_MATCHES_2022.find((s) => s.name == "Scores")!.set as StatSetGroup<
    FullScores2022Shared,
    FullScores2022Shared
>;
const THIS = SCORES.groups.find((g) => g.shortName == "THIS")!;

export const THIS_TOTAL_POINTS_NP_STAT = THIS.get(TOTAL_POINTS_NP_STAT);
export const THIS_AUTO_POINTS_STAT = THIS.get(AUTO_POINTS_STAT);
export const THIS_DC_POINTS_STAT = THIS.get(DC_POINTS_STAT);
export const THIS_ENDGAME_POINTS_STAT = THIS.get(ENDGAME_POINTS_STAT);
export const THIS_AUTO_CONE_POINTS = THIS.get(AUTO_CONE_STAT);
export const THIS_CIRCUIT_POINTS = THIS.get(CIRCUIT_STAT);
