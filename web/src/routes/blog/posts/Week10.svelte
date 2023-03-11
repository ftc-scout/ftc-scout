<script>
    import { EMAIL } from "$lib/constants";
    import PostTemplate from "../PostTemplate.svelte";
    import MatchTable from "$lib/components/matches/MatchTable.svelte";
    import PowerPlayVis from "$lib/components/matches/vis/2022/PowerPlayVis.svelte";

    const MATCH_DATA = [
        {
            __typename: "Match",
            season: 2022,
            eventCode: "USIAMALT",
            id: 23,
            matchNum: 23,
            matchDescription: "Q-23",
            tournamentLevel: "QUALS",
            scheduledStartTime: "2023-01-06T13:15:00.000Z",
            actualStartTime: "2023-01-06T13:48:25.838Z",
            hasBeenPlayed: true,
            scores: {
                __typename: "MatchScores2022",
                season: 2022,
                eventCode: "USIAMALT",
                matchId: 23,
                autoCones: {
                    __typename: "ConeLayout",
                    redNearTerminal: 1,
                    redFarTerminal: 0,
                    blueNearTerminal: 1,
                    blueFarTerminal: 0,
                    junctions: [
                        [[], [], [], [], []],
                        [[], [], [], [], []],
                        [[], [], [], [], []],
                        [[], [], [], [], []],
                        [[], [], [], ["BLUE_CONE"], []],
                    ],
                },
                allCones: {
                    __typename: "ConeLayout",
                    redNearTerminal: 1,
                    redFarTerminal: 1,
                    blueNearTerminal: 1,
                    blueFarTerminal: 1,
                    junctions: [
                        [["RED_CONE"], [], ["RED_BEACON_1"], [], ["RED_CONE"]],
                        [[], ["RED_CONE"], ["RED_CONE"], ["BLUE_CONE"], ["BLUE_CONE"]],
                        [[], [], ["BLUE_CONE", "RED_CONE"], ["RED_CONE"], ["BLUE_CONE"]],
                        [
                            ["BLUE_CONE"],
                            ["BLUE_CONE", "BLUE_CONE", "BLUE_CONE"],
                            ["BLUE_CONE"],
                            ["BLUE_CONE", "RED_CONE", "BLUE_CONE", "RED_CONE", "BLUE_CONE", "RED_BEACON_2"],
                            ["BLUE_CONE"],
                        ],
                        [["RED_CONE"], [], [], ["BLUE_CONE"], ["RED_CONE"]],
                    ],
                },
                red: {
                    __typename: "MatchScores2022Alliance",
                    teams: [
                        {
                            __typename: "TeamMatchParticipation",
                            season: 2022,
                            eventCode: "USIAMALT",
                            matchId: 23,
                            teamNumber: 7841,
                            station: "RED_2",
                            team: {
                                __typename: "Team",
                                number: 7841,
                                name: "Ballen Pretzels 2",
                            },
                        },
                        {
                            __typename: "TeamMatchParticipation",
                            season: 2022,
                            eventCode: "USIAMALT",
                            matchId: 23,
                            teamNumber: 19926,
                            station: "RED_1",
                            team: {
                                __typename: "Team",
                                number: 19926,
                                name: "Bago Bots",
                            },
                        },
                    ],
                    season: 2022,
                    eventCode: "USIAMALT",
                    matchId: 23,
                    alliance: "RED",
                    autoNavigation12022: "TERMINAL",
                    autoNavigation22022: "TEAM_SIGNAL",
                    autoTerminalCones: 1,
                    autoGroundCones: 0,
                    autoLowCones: 0,
                    autoMediumCones: 0,
                    autoHighCones: 0,
                    dcTerminalCones: 2,
                    dcGroundCones: 5,
                    dcLowCones: 0,
                    dcMediumCones: 3,
                    dcHighCones: 2,
                    endgameNavigated1: true,
                    endgameNavigated2: false,
                    coneOwnedJunctions: 8,
                    beaconOwnedJunctions: 2,
                    circuit: true,
                    minorPenalties: 0,
                    majorPenalties: 0,
                    autoNavigationPoints: 22,
                    autoConePoints: 1,
                    endgameNavigationPoints: 2,
                    ownershipPoints: 44,
                    circuitPoints: 20,
                    autoPoints: 23,
                    dcPoints: 34,
                    endgamePoints: 66,
                    penaltyPoints: 20,
                    totalPoints: 143,
                    totalPointsNp: 123,
                },
                blue: {
                    __typename: "MatchScores2022Alliance",
                    teams: [
                        {
                            __typename: "TeamMatchParticipation",
                            season: 2022,
                            eventCode: "USIAMALT",
                            matchId: 23,
                            teamNumber: 8807,
                            station: "BLUE_2",
                            team: {
                                __typename: "Team",
                                number: 8807,
                                name: "Molten Sprockets",
                            },
                        },
                        {
                            __typename: "TeamMatchParticipation",
                            season: 2022,
                            eventCode: "USIAMALT",
                            matchId: 23,
                            teamNumber: 19686,
                            station: "BLUE_1",
                            team: {
                                __typename: "Team",
                                number: 19686,
                                name: "Cedar Bots 2",
                            },
                        },
                    ],
                    season: 2022,
                    eventCode: "USIAMALT",
                    matchId: 23,
                    alliance: "BLUE",
                    autoNavigation12022: "NONE",
                    autoNavigation22022: "TERMINAL",
                    autoTerminalCones: 1,
                    autoGroundCones: 0,
                    autoLowCones: 1,
                    autoMediumCones: 0,
                    autoHighCones: 0,
                    dcTerminalCones: 2,
                    dcGroundCones: 2,
                    dcLowCones: 4,
                    dcMediumCones: 7,
                    dcHighCones: 1,
                    endgameNavigated1: false,
                    endgameNavigated2: false,
                    coneOwnedJunctions: 8,
                    beaconOwnedJunctions: 0,
                    circuit: true,
                    minorPenalties: 2,
                    majorPenalties: 0,
                    autoNavigationPoints: 2,
                    autoConePoints: 4,
                    endgameNavigationPoints: 0,
                    ownershipPoints: 24,
                    circuitPoints: 20,
                    autoPoints: 6,
                    dcPoints: 51,
                    endgamePoints: 44,
                    penaltyPoints: 0,
                    totalPoints: 101,
                    totalPointsNp: 101,
                },
            },
            teams: [
                {
                    __typename: "TeamMatchParticipation",
                    season: 2022,
                    eventCode: "USIAMALT",
                    matchId: 23,
                    teamNumber: 7841,
                    station: "RED_2",
                    team: {
                        __typename: "Team",
                        number: 7841,
                        name: "Ballen Pretzels 2",
                    },
                    surrogate: false,
                    noShow: false,
                    dq: false,
                    onField: true,
                },
                {
                    __typename: "TeamMatchParticipation",
                    season: 2022,
                    eventCode: "USIAMALT",
                    matchId: 23,
                    teamNumber: 8807,
                    station: "BLUE_2",
                    team: {
                        __typename: "Team",
                        number: 8807,
                        name: "Molten Sprockets",
                    },
                    surrogate: false,
                    noShow: false,
                    dq: false,
                    onField: true,
                },
                {
                    __typename: "TeamMatchParticipation",
                    season: 2022,
                    eventCode: "USIAMALT",
                    matchId: 23,
                    teamNumber: 19686,
                    station: "BLUE_1",
                    team: {
                        __typename: "Team",
                        number: 19686,
                        name: "Cedar Bots 2",
                    },
                    surrogate: false,
                    noShow: false,
                    dq: false,
                    onField: true,
                },
                {
                    __typename: "TeamMatchParticipation",
                    season: 2022,
                    eventCode: "USIAMALT",
                    matchId: 23,
                    teamNumber: 19926,
                    station: "RED_1",
                    team: {
                        __typename: "Team",
                        number: 19926,
                        name: "Bago Bots",
                    },
                    surrogate: false,
                    noShow: false,
                    dq: false,
                    onField: true,
                },
            ],
        },
    ];
    const EVENT_DATA = [
        {
            __typename: "Event",
            season: 2022,
            code: "USIAMALT",
            name: "IA Magnetic League Tournament",
            start: "2023-01-07",
            end: "2023-01-07",
            venue: "Central Lyon High School",
            city: "Rock Rapids",
            stateOrProvince: "IA",
            country: "USA",
            website: "https://engineering.uiowa.edu/first-tech-challenge-season-events-deadlines",
            remote: false,
            published: true,
            hasStarted: true,
        },
    ];
    const MATCH_DATA2 = [
        {
            __typename: "Match",
            season: 2022,
            eventCode: "USNJNOM2",
            id: 8,
            matchNum: 8,
            matchDescription: "Q-8",
            tournamentLevel: "QUALS",
            scheduledStartTime: "2022-11-06T10:18:00.000Z",
            actualStartTime: "2022-11-06T10:47:32.289Z",
            hasBeenPlayed: true,
            scores: {
                __typename: "MatchScores2022",
                season: 2022,
                eventCode: "USNJNOM2",
                matchId: 8,
                autoCones: {
                    __typename: "ConeLayout",
                    redNearTerminal: 0,
                    redFarTerminal: 0,
                    blueNearTerminal: 0,
                    blueFarTerminal: 0,
                    junctions: [
                        [[], [], [], [], []],
                        [[], [], [], [], []],
                        [[], [], [], [], []],
                        [[], [], [], [], []],
                        [[], [], [], [], []],
                    ],
                },
                allCones: {
                    __typename: "ConeLayout",
                    redNearTerminal: 0,
                    redFarTerminal: 0,
                    blueNearTerminal: 1,
                    blueFarTerminal: 1,
                    junctions: [
                        [[], ["RED_CONE"], [], ["RED_CONE"], []],
                        [
                            ["RED_CONE"],
                            ["RED_CONE"],
                            [
                                "RED_CONE",
                                "RED_CONE",
                                "RED_CONE",
                                "RED_CONE",
                                "RED_CONE",
                                "RED_CONE",
                                "RED_CONE",
                                "RED_CONE",
                                "RED_CONE",
                                "RED_CONE",
                                "RED_CONE",
                            ],
                            ["RED_CONE", "RED_BEACON_2"],
                            ["RED_CONE", "BLUE_CONE"],
                        ],
                        [[], ["RED_CONE"], [], ["RED_CONE", "BLUE_CONE"], []],
                        [[], [], ["BLUE_CONE"], [], []],
                        [[], ["BLUE_CONE"], [], ["RED_CONE"], []],
                    ],
                },
                red: {
                    __typename: "MatchScores2022Alliance",
                    teams: [
                        {
                            __typename: "TeamMatchParticipation",
                            season: 2022,
                            eventCode: "USNJNOM2",
                            matchId: 8,
                            teamNumber: 247,
                            station: "RED_2",
                            team: {
                                __typename: "Team",
                                number: 247,
                                name: "Reboot",
                            },
                        },
                        {
                            __typename: "TeamMatchParticipation",
                            season: 2022,
                            eventCode: "USNJNOM2",
                            matchId: 8,
                            teamNumber: 13103,
                            station: "RED_1",
                            team: {
                                __typename: "Team",
                                number: 13103,
                                name: "Ironmen Omega",
                            },
                        },
                    ],
                    season: 2022,
                    eventCode: "USNJNOM2",
                    matchId: 8,
                    alliance: "RED",
                    autoNavigation12022: "TEAM_SIGNAL",
                    autoNavigation22022: "TEAM_SIGNAL",
                    autoTerminalCones: 0,
                    autoGroundCones: 0,
                    autoLowCones: 0,
                    autoMediumCones: 0,
                    autoHighCones: 0,
                    dcTerminalCones: 0,
                    dcGroundCones: 0,
                    dcLowCones: 5,
                    dcMediumCones: 2,
                    dcHighCones: 13,
                    endgameNavigated1: true,
                    endgameNavigated2: true,
                    coneOwnedJunctions: 7,
                    beaconOwnedJunctions: 1,
                    circuit: false,
                    minorPenalties: 0,
                    majorPenalties: 0,
                    autoNavigationPoints: 40,
                    autoConePoints: 0,
                    endgameNavigationPoints: 4,
                    ownershipPoints: 31,
                    circuitPoints: 0,
                    autoPoints: 40,
                    dcPoints: 88,
                    endgamePoints: 35,
                    penaltyPoints: 0,
                    totalPoints: 163,
                    totalPointsNp: 163,
                },
                blue: {
                    __typename: "MatchScores2022Alliance",
                    teams: [
                        {
                            __typename: "TeamMatchParticipation",
                            season: 2022,
                            eventCode: "USNJNOM2",
                            matchId: 8,
                            teamNumber: 13105,
                            station: "BLUE_2",
                            team: {
                                __typename: "Team",
                                number: 13105,
                                name: "Ironmen Omicron",
                            },
                        },
                        {
                            __typename: "TeamMatchParticipation",
                            season: 2022,
                            eventCode: "USNJNOM2",
                            matchId: 8,
                            teamNumber: 15715,
                            station: "BLUE_1",
                            team: {
                                __typename: "Team",
                                number: 15715,
                                name: "Crusader Robotics",
                            },
                        },
                    ],
                    season: 2022,
                    eventCode: "USNJNOM2",
                    matchId: 8,
                    alliance: "BLUE",
                    autoNavigation12022: "TEAM_SIGNAL",
                    autoNavigation22022: "NONE",
                    autoTerminalCones: 0,
                    autoGroundCones: 0,
                    autoLowCones: 0,
                    autoMediumCones: 0,
                    autoHighCones: 0,
                    dcTerminalCones: 2,
                    dcGroundCones: 0,
                    dcLowCones: 2,
                    dcMediumCones: 0,
                    dcHighCones: 2,
                    endgameNavigated1: false,
                    endgameNavigated2: false,
                    coneOwnedJunctions: 4,
                    beaconOwnedJunctions: 0,
                    circuit: true,
                    minorPenalties: 0,
                    majorPenalties: 0,
                    autoNavigationPoints: 20,
                    autoConePoints: 0,
                    endgameNavigationPoints: 0,
                    ownershipPoints: 12,
                    circuitPoints: 20,
                    autoPoints: 20,
                    dcPoints: 18,
                    endgamePoints: 32,
                    penaltyPoints: 0,
                    totalPoints: 70,
                    totalPointsNp: 70,
                },
            },
            teams: [
                {
                    __typename: "TeamMatchParticipation",
                    season: 2022,
                    eventCode: "USNJNOM2",
                    matchId: 8,
                    teamNumber: 247,
                    station: "RED_2",
                    team: {
                        __typename: "Team",
                        number: 247,
                        name: "Reboot",
                    },
                    surrogate: false,
                    noShow: false,
                    dq: false,
                    onField: true,
                },
                {
                    __typename: "TeamMatchParticipation",
                    season: 2022,
                    eventCode: "USNJNOM2",
                    matchId: 8,
                    teamNumber: 13103,
                    station: "RED_1",
                    team: {
                        __typename: "Team",
                        number: 13103,
                        name: "Ironmen Omega",
                    },
                    surrogate: false,
                    noShow: false,
                    dq: false,
                    onField: true,
                },
                {
                    __typename: "TeamMatchParticipation",
                    season: 2022,
                    eventCode: "USNJNOM2",
                    matchId: 8,
                    teamNumber: 13105,
                    station: "BLUE_2",
                    team: {
                        __typename: "Team",
                        number: 13105,
                        name: "Ironmen Omicron",
                    },
                    surrogate: false,
                    noShow: false,
                    dq: false,
                    onField: true,
                },
                {
                    __typename: "TeamMatchParticipation",
                    season: 2022,
                    eventCode: "USNJNOM2",
                    matchId: 8,
                    teamNumber: 15715,
                    station: "BLUE_1",
                    team: {
                        __typename: "Team",
                        number: 15715,
                        name: "Crusader Robotics",
                    },
                    surrogate: false,
                    noShow: false,
                    dq: false,
                    onField: true,
                },
            ],
        },
    ];
    const EVENT_DATA2 = [
        {
            __typename: "Event",
            season: 2022,
            code: "USNJNOM2",
            name: "NJ 1105-P1-AM   Northern League meet (Saturday)",
            start: "2022-11-05",
            end: "2022-11-05",
            venue: "Don Bosco Prep High School",
            city: "Ramsey",
            stateOrProvince: "NJ",
            country: "USA",
            website: null,
            remote: false,
            published: true,
            hasStarted: true,
        },
    ];
</script>

<PostTemplate>
    <svelte:fragment slot="title">Circuitous Circuits</svelte:fragment>
    <svelte:fragment slot="author">Daniel James</svelte:fragment>
    <svelte:fragment slot="date">March 10, 2023</svelte:fragment>

    <p>
        FTCScout recently started tracking the exact positions of all cones scored in every Power Play match which means
        I now have extra data to analyze for Scouting Reports!
    </p>

    <p>
        The question that I was most interested in is what is the longest circuit scored this season. The answer is <a
            href="/events/2022/USIAMALT/matches?scores=USIAMALT-23">this match</a
        >
        where the blue alliance scored a circuit spanning nine junctions and terminals. Interestingly the red alliance also
        scored a circuit in this match. A rare double circuit, an event that has only occurred
        <a
            href={`/records/2022/matches?filter=%7B"all"%3A%5B%7B"lhs"%3A"Circuit+Points"%2C"op"%3A"%3D"%2C"rhs"%3A20%7D%2C%7B"lhs"%3A"Circuit+Points+Opponent"%2C"op"%3A"%3D"%2C"rhs"%3A20%7D%5D%7D`}
            >79 times</a
        > (just 3% of matches!).
    </p>

    <MatchTable
        matches={MATCH_DATA}
        event={EVENT_DATA}
        teamPage={false}
        isRemote={false}
        frozen={true}
        selectedTeam={null}
    />
    <PowerPlayVis layout={MATCH_DATA[0].scores.allCones} teams={MATCH_DATA[0].teams} />

    <p>Let’s also do some more interesting circuit facts.</p>

    <p>
        57 alliances have scored a circuit using the minimum number of cones possible (six). <a
            href="/records/2022/matches?filter=%7B%22all%22%3A%5B%7B%22lhs%22%3A%22Circuit+Points%22%2C%22op%22%3A%22%3D%22%2C%22rhs%22%3A20%7D%2C%7B%22lhs%22%3A%22Driver+Controlled+Points%22%2C%22op%22%3A%22%3D%22%2C%22rhs%22%3A18%7D%2C%7B%22lhs%22%3A%22Driver+Controlled+High+Points%22%2C%22op%22%3A%22%3D%22%2C%22rhs%22%3A10%7D%2C%7B%22lhs%22%3A%22Beacon+Ownership+Points%22%2C%22op%22%3A%22%3D%22%2C%22rhs%22%3A0%7D%5D%7D"
            >See the list here.</a
        >
    </p>

    <p>
        Two matches are tied for the greatest cone differential while still scoring a circuit but <a
            href="/events/2022/USNJNOM2/matches?scores=USNJNOM2-8">this one from New Jersey</a
        > is my favorite because it was also done using the minimum number of cones. The blue alliance got out-coned 20 to
        6 but still managed to score a circuit. (They also got destroyed 163 to 70 but they made it into a Scouting Report
        and isn’t that all that really matters?).
    </p>

    <MatchTable
        matches={MATCH_DATA2}
        event={EVENT_DATA2}
        teamPage={false}
        isRemote={false}
        frozen={true}
        selectedTeam={null}
    />
    <PowerPlayVis layout={MATCH_DATA2[0].scores.allCones} teams={MATCH_DATA2[0].teams} />

    <p>That’s all for now. Thanks for reading!</p>

    <p class="suggestions">
        If you have any suggestions for topics you would like us to cover email us at <a
            href="mailto:suggestions@ftcscout.org"
        >
            suggestions@ftcscout.org</a
        >.
    </p>
</PostTemplate>

<style>
    * {
        line-height: 1.5rem;
    }

    :not(h1, h2, h1 *, h2 *) {
        font-size: 16px;
    }

    @media (max-width: 800px) {
        :not(h1, h2) {
            font-size: 14px;
        }
    }

    .suggestions {
        margin-top: var(--xl-gap);
        margin-bottom: 0;
        font-style: italic;
        color: var(--secondary-text-color);
    }

    img {
        max-width: 100%;
    }

    .image-wrap {
        display: flex;
        flex-direction: column;
        align-items: center;
        max-width: 100%;
    }

    .image-wrap em {
        color: var(--secondary-text-color);
    }
</style>
