import {
    Alliance,
    Match2019FieldName,
    MatchGroup,
    Station,
    type MatchScores2019Alliance,
    type RecordsEventFragment,
} from "../../../graphql/generated/graphql-operations";
import { DisplayWhen, makeStatFn, makeStatMaybe, type Stat } from "../Stat";
import { StatColor } from "../stat-color";
import { StatDisplayType } from "../stat-display-type";
import { groupGetter, type StatSet, type StatSetGroup } from "../StatSet";

export type FullScores2019Shared = MatchScores2019Alliance;

const TOTAL_POINTS_STAT: Stat<FullScores2019Shared> = makeStatMaybe(
    "totalPoints",
    "Total Points",
    "Total",
    "Total Points",
    DisplayWhen.ALWAYS,
    Match2019FieldName.TotalPoints,
    null
);

const TOTAL_POINTS_NP_STAT: Stat<FullScores2019Shared> = makeStatMaybe(
    "totalPointsNp",
    "Total Points No Penalties",
    "Total NP",
    "Total Points No Penalties",
    DisplayWhen.ALWAYS,
    Match2019FieldName.TotalPointsNp,
    null
);

// ------------------------------------------------------------------------------------------------------------------------

const AUTO_POINTS_STAT: Stat<FullScores2019Shared> = makeStatMaybe(
    "autoPoints",
    "Auto Points",
    "Auto",
    "Auto Points",
    DisplayWhen.ALWAYS,
    Match2019FieldName.AutoPoints
);

const AUTO_NAV_STAT: Stat<FullScores2019Shared> = makeStatMaybe(
    "autoNavigationPoints",
    "Auto Navigation Points",
    "Auto Nav",
    "Auto Navigation Points",
    DisplayWhen.ALWAYS,
    Match2019FieldName.AutoNavigationPoints
);

const AUTO_REPOSITIONING_STAT: Stat<FullScores2019Shared> = makeStatMaybe(
    "autoRepositioningPoints",
    "Auto Repositioning Points",
    "Repositioning",
    "Auto Repositioning Points",
    DisplayWhen.ALWAYS,
    Match2019FieldName.AutoRepositioningPoints
);

const AUTO_DELIVERY_STAT: Stat<FullScores2019Shared> = makeStatMaybe(
    "autoDeliveryPoints",
    "Auto Delivery Points",
    "Auto Delivery",
    "Auto Delivery Points",
    DisplayWhen.ALWAYS,
    Match2019FieldName.AutoDeliveryPoints
);

export const AUTO_PLACEMENT_STAT: Stat<FullScores2019Shared> = makeStatMaybe(
    "autoPlacementPoints",
    "Auto Placement Points",
    "Auto Placement",
    "Auto Placement Points",
    DisplayWhen.ALWAYS,
    Match2019FieldName.AutoPlacementPoints
);

// ------------------------------------------------------------------------------------------------------------------------

const DC_POINTS_STAT: Stat<FullScores2019Shared> = makeStatMaybe(
    "dcPoints",
    "Driver Controlled Points",
    "Teleop",
    "Driver Controlled Points",
    DisplayWhen.ALWAYS,
    Match2019FieldName.DriverControlledPoints
);

const DC_DELIVERY_STAT: Stat<FullScores2019Shared> = makeStatMaybe(
    "dcDeliveryPoints",
    "Delivery Points",
    "Delivery",
    "Driver Controlled Delivery Points",
    DisplayWhen.ALWAYS,
    Match2019FieldName.DcDeliveryPoints
);

const DC_PLACEMENT_STAT: Stat<FullScores2019Shared> = makeStatMaybe(
    "dcPlacementPoints",
    "Placement Points",
    "Placement",
    "Driver Controlled Placement Points",
    DisplayWhen.ALWAYS,
    Match2019FieldName.DcPlacementPoints
);

const DC_SKYSCRAPER_BONUS_STAT: Stat<FullScores2019Shared> = makeStatMaybe(
    "dcSkyscraperBonusPoints",
    "Skyscraper Points",
    "Skyscapper",
    "Driver Controlled Skyscapper Bonus Points",
    DisplayWhen.ALWAYS,
    Match2019FieldName.DcSkyscraperBonusPoints
);

// ------------------------------------------------------------------------------------------------------------------------

export const ENDGAME_POINTS_STAT: Stat<FullScores2019Shared> = makeStatMaybe(
    "endgamePoints",
    "Endgame Points",
    "Endgame",
    "Endgame Points",
    DisplayWhen.ALWAYS,
    Match2019FieldName.EndgamePoints
);

export const ENDGAME_CAPPING_STAT: Stat<FullScores2019Shared> = makeStatMaybe(
    "cappingPoints",
    "Capping Points",
    "Capping",
    "Endgame Capping Points",
    DisplayWhen.ALWAYS,
    Match2019FieldName.CappingPoints
);

export const ENDGAME_PARKING_STAT: Stat<FullScores2019Shared> = makeStatMaybe(
    "parkingPoints",
    "Parking Points",
    "Endgame Park",
    "Endgame Parking Points",
    DisplayWhen.ALWAYS,
    Match2019FieldName.EndgameParkingPoints
);

export const ENDGAME_FOUNDATION_STAT: Stat<FullScores2019Shared> = makeStatMaybe(
    "foundationMovedPoints",
    "Foundation Moved Points",
    "Foundation Moves",
    "Endgame Foundation Moved Points",
    DisplayWhen.ALWAYS,
    Match2019FieldName.FoundationMovedPoints
);

// ------------------------------------------------------------------------------------------------------------------------

export const PENALTIES_STAT: Stat<FullScores2019Shared> = makeStatMaybe(
    "penaltyPoints",
    "Penalty Points",
    "Penalties",
    "Penalty Points",
    DisplayWhen.ALWAYS,
    Match2019FieldName.PenaltyPoints
);

export const PENALTIES_MAJOR_STAT: Stat<FullScores2019Shared> = makeStatFn(
    (s) => (s.data ? s.data.majorPenalties * -30 : null),
    "Major Penalty Points",
    "Majors",
    "Major Penalty Points",
    DisplayWhen.ALWAYS,
    Match2019FieldName.MajorPenaltyPoints
);

export const PENALTIES_MINOR_STAT: Stat<FullScores2019Shared> = makeStatFn(
    (s) => (s.data ? s.data.minorPenalties * -10 : null),
    "Minor Penalty Points",
    "Minors",
    "Minor Penalty Points",
    DisplayWhen.ALWAYS,
    Match2019FieldName.MinorPenaltyPoints
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
    apiField: { fieldName: Match2019FieldName.Team1Number },
};

export const TEAM_2: Stat<TeamsT | null> = {
    color: StatColor.WHITE,
    displayType: StatDisplayType.TEAM,
    listName: "Team 2",
    columnName: "Team 2",
    identifierName: "Team 2",
    displayWhen: DisplayWhen.ALWAYS,
    read: (s) => extractTeam(s.data, 2),
    apiField: { fieldName: Match2019FieldName.Team2Number },
};

export const TEAM_3: Stat<TeamsT | null> = {
    color: StatColor.WHITE,
    displayType: StatDisplayType.TEAM,
    listName: "Team 3",
    columnName: "Team 3",
    identifierName: "Team 3",
    displayWhen: DisplayWhen.ALWAYS,
    read: (s) => extractTeam(s.data, 3),
    apiField: { fieldName: Match2019FieldName.Team3Number },
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
    apiField: { fieldName: Match2019FieldName.EventName },
};

export const MATCH_DESCRIPTION_STAT: Stat<{ match: { matchDescription: string } }> = {
    color: StatColor.WHITE,
    displayType: StatDisplayType.STRING,
    listName: "Match Number",
    columnName: "Match Num",
    identifierName: "Match Number",
    displayWhen: DisplayWhen.ALWAYS,
    read: (s) => s.data.match.matchDescription,
    apiField: { fieldName: Match2019FieldName.MatchNumber },
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
    apiField: { fieldName: Match2019FieldName.Alliance },
};

export let STAT_SET_MATCHES_2019: StatSet<FullScores2019Shared, FullScores2019Shared> = [
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
                            stat: AUTO_DELIVERY_STAT,
                            nestedStats: [],
                        },
                        {
                            stat: AUTO_PLACEMENT_STAT,
                            nestedStats: [],
                        },
                        {
                            stat: AUTO_REPOSITIONING_STAT,
                            nestedStats: [],
                        },
                        {
                            stat: AUTO_NAV_STAT,
                            nestedStats: [],
                        },
                    ],
                },
                {
                    stat: DC_POINTS_STAT,
                    nestedStats: [
                        {
                            stat: DC_DELIVERY_STAT,
                            nestedStats: [],
                        },
                        {
                            stat: DC_PLACEMENT_STAT,
                            nestedStats: [],
                        },
                        {
                            stat: DC_SKYSCRAPER_BONUS_STAT,
                            nestedStats: [],
                        },
                    ],
                },
                {
                    stat: ENDGAME_POINTS_STAT,
                    nestedStats: [
                        {
                            stat: ENDGAME_CAPPING_STAT,
                            nestedStats: [],
                        },
                        {
                            stat: ENDGAME_FOUNDATION_STAT,
                            nestedStats: [],
                        },
                        {
                            stat: ENDGAME_PARKING_STAT,
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

const SCORES = STAT_SET_MATCHES_2019.find((s) => s.name == "Scores")!.set as StatSetGroup<
    FullScores2019Shared,
    FullScores2019Shared
>;
const THIS = SCORES.groups.find((g) => g.shortName == "THIS")!;

export const THIS_TOTAL_POINTS_STAT = THIS.get(TOTAL_POINTS_STAT);
export const THIS_AUTO_POINTS_STAT = THIS.get(AUTO_POINTS_STAT);
export const THIS_DC_POINTS_STAT = THIS.get(DC_POINTS_STAT);
export const THIS_ENDGAME_POINTS_STAT = THIS.get(ENDGAME_POINTS_STAT);
export const THIS_END_CAPPED_STAT = THIS.get(ENDGAME_CAPPING_STAT);
