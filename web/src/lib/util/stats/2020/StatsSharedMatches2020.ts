import {
    Alliance,
    Match2020FieldName,
    Match2021FieldName,
    MatchGroup,
    Station,
    type MatchScores2020Remote,
    type MatchScores2020TraditionalAlliance,
    type RecordsEventFragment,
} from "../../../graphql/generated/graphql-operations";
import { DisplayWhen, makeStatFn, makeStatMaybe, type Stat } from "../Stat";
import { StatColor } from "../stat-color";
import { StatDisplayType } from "../stat-display-type";
import { groupGetter, type StatSet, type StatSetGroup } from "../StatSet";

export type FullScores2020Shared = MatchScores2020TraditionalAlliance | MatchScores2020Remote | null;

const TOTAL_POINTS_STAT: Stat<FullScores2020Shared> = makeStatMaybe(
    "totalPoints",
    "Total Points",
    "Total",
    "Total Points",
    DisplayWhen.ALWAYS,
    Match2020FieldName.TotalPoints,
    null
);

const TOTAL_POINTS_NP_STAT: Stat<FullScores2020Shared> = makeStatMaybe(
    "totalPointsNp",
    "Total Points No Penalties",
    "Total NP",
    "Total Points No Penalties",
    DisplayWhen.ALWAYS,
    Match2020FieldName.TotalPointsNp,
    null
);

// ------------------------------------------------------------------------------------------------------------------------

const AUTO_POINTS_STAT: Stat<FullScores2020Shared> = makeStatMaybe(
    "autoPoints",
    "Auto Points",
    "Auto",
    "Auto Points",
    DisplayWhen.ALWAYS,
    Match2020FieldName.AutoPoints
);

const AUTO_NAV_STAT: Stat<FullScores2020Shared> = makeStatMaybe(
    "autoNavigationPoints",
    "Auto Navigation Points",
    "Auto Nav",
    "Auto Navigation Points",
    DisplayWhen.ALWAYS,
    Match2020FieldName.AutoNavigationPoints
);

export const AUTO_TOWER_STAT: Stat<FullScores2020Shared> = makeStatMaybe(
    "autoGoalPoints",
    "Auto Tower Points",
    "Auto Tower",
    "Auto Tower Points",
    DisplayWhen.ALWAYS,
    Match2020FieldName.AutoGoalPoints
);

export const AUTO_TOWER_LOW_STAT: Stat<FullScores2020Shared> = makeStatFn(
    (s) => (s.data ? s.data.autoGoalLow * 3 : null),
    "Low",
    "Auto Tower Low",
    "Auto Tower Low Points",
    DisplayWhen.ALWAYS,
    Match2020FieldName.AutoGoalPointsLow
);
export const AUTO_TOWER_MID_STAT: Stat<FullScores2020Shared> = makeStatFn(
    (s) => (s.data ? s.data.autoGoalMid * 6 : null),
    "Mid",
    "Auto Tower Mid",
    "Auto Tower Mid Points",
    DisplayWhen.ALWAYS,
    Match2020FieldName.AutoGoalPointsMid
);
export const AUTO_TOWER_HIGH_STAT: Stat<FullScores2020Shared> = makeStatFn(
    (s) => (s.data ? s.data.autoGoalHigh * 12 : null),
    "High",
    "Auto Tower High",
    "Auto Tower High Points",
    DisplayWhen.ALWAYS,
    Match2020FieldName.AutoGoalPointsHigh
);

export const AUTO_WOBBLE_STAT: Stat<FullScores2020Shared> = makeStatMaybe(
    "autoWobblePoints",
    "Auto Wobble Points",
    "Auto Wobble",
    "Auto Wobble Points",
    DisplayWhen.ALWAYS,
    Match2020FieldName.AutoWobblePoints
);

export const AUTO_POWERSHOT_STAT: Stat<FullScores2020Shared> = makeStatMaybe(
    "autoPowershotPoints",
    "Auto Powershot Points",
    "Auto Powershot",
    "Auto Powershot Points",
    DisplayWhen.ALWAYS,
    Match2020FieldName.AutoPowershotPoints
);

// ------------------------------------------------------------------------------------------------------------------------

const DC_POINTS_STAT: Stat<FullScores2020Shared> = makeStatMaybe(
    "driverControlledPoints",
    "Driver Controlled Points",
    "Teleop",
    "Driver Controlled Points",
    DisplayWhen.ALWAYS,
    Match2020FieldName.DriverControlledPoints
);

export const DC_TOWER_LOW_STAT: Stat<FullScores2020Shared> = makeStatFn(
    (s) => (s.data ? s.data.driverControlledLow * 2 : null),
    "Low",
    "DC Tower Low",
    "Driver Controlled Tower Low Points",
    DisplayWhen.ALWAYS,
    Match2020FieldName.DcGoalPointsLow
);
export const DC_TOWER_MID_STAT: Stat<FullScores2020Shared> = makeStatFn(
    (s) => (s.data ? s.data.driverControlledMid * 4 : null),
    "Mid",
    "DC Tower Mid",
    "Driver Controlled Tower Mid Points",
    DisplayWhen.ALWAYS,
    Match2020FieldName.DcGoalPointsMid
);
export const DC_TOWER_HIGH_STAT: Stat<FullScores2020Shared> = makeStatFn(
    (s) => (s.data ? s.data.driverControlledHigh * 6 : null),
    "High",
    "DC Tower High",
    "Driver Controlled Tower High Points",
    DisplayWhen.ALWAYS,
    Match2020FieldName.DcGoalPointsHigh
);

// ------------------------------------------------------------------------------------------------------------------------

export const ENDGAME_POINTS_STAT: Stat<FullScores2020Shared> = makeStatMaybe(
    "endgamePoints",
    "Endgame Points",
    "Endgame",
    "Endgame Points",
    DisplayWhen.ALWAYS,
    Match2020FieldName.EndgamePoints
);

export const ENDGAME_POWERSHOT_STAT: Stat<FullScores2020Shared> = makeStatMaybe(
    "endgamePowershotPoints",
    "Endgame Powershot Points",
    "Endgame Powershot",
    "Endgame Powershot Points",
    DisplayWhen.ALWAYS,
    Match2020FieldName.EndgamePowershotPoints
);

export const ENDGAME_WOBBLE_STAT: Stat<FullScores2020Shared> = makeStatMaybe(
    "endgameWobblePoints",
    "Endgame Wobble Points",
    "Endgame Wobble",
    "Endgame Wobble Points",
    DisplayWhen.ALWAYS,
    Match2020FieldName.EndgameWobblePoints
);

export const ENDGAME_WOBBLE_RINGS_STAT: Stat<FullScores2020Shared> = makeStatMaybe(
    "endgameWobbleRingPoints",
    "Endgame Wobble Ring Points",
    "Endgame Wobble Rings",
    "Endgame Wobble Ring Points",
    DisplayWhen.ALWAYS,
    Match2020FieldName.EndgameWobbleRingPoints
);
// ------------------------------------------------------------------------------------------------------------------------

export const PENALTIES_STAT: Stat<FullScores2020Shared> = makeStatMaybe(
    "penaltyPoints",
    "Penalty Points",
    "Penalties",
    "Penalty Points",
    DisplayWhen.ALWAYS,
    Match2020FieldName.PenaltyPoints
);

export const PENALTIES_MAJOR_STAT: Stat<FullScores2020Shared> = makeStatFn(
    (s) => (s.data ? s.data.majorPenalties * -30 : null),
    "Major Penalty Points",
    "Majors",
    "Major Penalty Points",
    DisplayWhen.ALWAYS,
    Match2020FieldName.MajorPenaltyPoints
);

export const PENALTIES_MINOR_STAT: Stat<FullScores2020Shared> = makeStatFn(
    (s) => (s.data ? s.data.minorPenalties * -10 : null),
    "Minor Penalty Points",
    "Minors",
    "Minor Penalty Points",
    DisplayWhen.ALWAYS,
    Match2020FieldName.MinorPenaltyPoints
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
    apiField: { fieldName: Match2021FieldName.Team1Number },
};

export const TEAM_2: Stat<TeamsT | null> = {
    color: StatColor.WHITE,
    displayType: StatDisplayType.TEAM,
    listName: "Team 2",
    columnName: "Team 2",
    identifierName: "Team 2",
    displayWhen: DisplayWhen.ALWAYS,
    read: (s) => extractTeam(s.data, 2),
    apiField: { fieldName: Match2021FieldName.Team2Number },
};

export const TEAM_3: Stat<TeamsT | null> = {
    color: StatColor.WHITE,
    displayType: StatDisplayType.TEAM,
    listName: "Team 3",
    columnName: "Team 3",
    identifierName: "Team 3",
    displayWhen: DisplayWhen.ALWAYS,
    read: (s) => extractTeam(s.data, 3),
    apiField: { fieldName: Match2021FieldName.Team3Number },
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
    apiField: { fieldName: Match2021FieldName.EventName },
};

export const MATCH_DESCRIPTION_STAT: Stat<{ match: { matchDescription: string } }> = {
    color: StatColor.WHITE,
    displayType: StatDisplayType.STRING,
    listName: "Match Number",
    columnName: "Match Num",
    identifierName: "Match Number",
    displayWhen: DisplayWhen.ALWAYS,
    read: (s) => s.data.match.matchDescription,
    apiField: { fieldName: Match2021FieldName.MatchNumber },
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
    apiField: { fieldName: Match2021FieldName.Alliance },
};

export let STAT_SET_MATCHES_2020_SHARED: StatSet<FullScores2020Shared, FullScores2020Shared> = [
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
                            stat: AUTO_TOWER_STAT,
                            nestedStats: [
                                {
                                    stat: AUTO_TOWER_LOW_STAT,
                                    nestedStats: [],
                                },
                                {
                                    stat: AUTO_TOWER_MID_STAT,
                                    nestedStats: [],
                                },
                                {
                                    stat: AUTO_TOWER_HIGH_STAT,
                                    nestedStats: [],
                                },
                            ],
                        },
                        {
                            stat: AUTO_WOBBLE_STAT,
                            nestedStats: [],
                        },
                        {
                            stat: AUTO_POWERSHOT_STAT,
                            nestedStats: [],
                        },
                    ],
                },
                {
                    stat: DC_POINTS_STAT,
                    nestedStats: [
                        {
                            stat: DC_TOWER_LOW_STAT,
                            nestedStats: [],
                        },
                        {
                            stat: DC_TOWER_MID_STAT,
                            nestedStats: [],
                        },
                        {
                            stat: DC_TOWER_HIGH_STAT,
                            nestedStats: [],
                        },
                    ],
                },
                {
                    stat: ENDGAME_POINTS_STAT,
                    nestedStats: [
                        {
                            stat: ENDGAME_WOBBLE_STAT,
                            nestedStats: [],
                        },
                        {
                            stat: ENDGAME_WOBBLE_RINGS_STAT,
                            nestedStats: [],
                        },
                        {
                            stat: ENDGAME_POWERSHOT_STAT,
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

const SCORES = STAT_SET_MATCHES_2020_SHARED.find((s) => s.name == "Scores")!.set as StatSetGroup<
    FullScores2020Shared,
    FullScores2020Shared
>;
const THIS = SCORES.groups.find((g) => g.shortName == "THIS")!;

export const THIS_TOTAL_POINTS_STAT = THIS.get(TOTAL_POINTS_STAT);
export const THIS_AUTO_POINTS_STAT = THIS.get(AUTO_POINTS_STAT);
export const THIS_DC_POINTS_STAT = THIS.get(DC_POINTS_STAT);
export const THIS_ENDGAME_POINTS_STAT = THIS.get(ENDGAME_POINTS_STAT);
