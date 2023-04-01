<script>
    import { EMAIL } from "$lib/constants";
    import PostTemplate from "../PostTemplate.svelte";
    import MatchTable from "$lib/components/matches/MatchTable.svelte";
    const MATCH_DATA2 = [
        {
            __typename: "Match",
            season: 2022,
            eventCode: "USCOLIQ",
            id: 11001,
            matchNum: 1,
            matchDescription: "SF1-1",
            tournamentLevel: "SEMIS",
            scheduledStartTime: "1901-01-01T00:00:00.000Z",
            actualStartTime: "2023-02-06T16:35:56.881Z",
            hasBeenPlayed: true,
            scores: {
                __typename: "MatchScores2022",
                season: 2022,
                eventCode: "USCOLIQ",
                matchId: 11001,
                autoCones: {
                    __typename: "ConeLayout",
                    redNearTerminal: 0,
                    redFarTerminal: 0,
                    blueNearTerminal: 0,
                    blueFarTerminal: 0,
                    junctions: [
                        [[], [], [], [], []],
                        [[], [], ["RED_CONE", "RED_CONE", "RED_CONE", "RED_CONE", "RED_CONE"], [], []],
                        [[], ["RED_CONE", "RED_CONE"], [], [], []],
                        [["BLUE_CONE", "BLUE_CONE", "BLUE_CONE", "BLUE_CONE", "BLUE_CONE"], ["BLUE_CONE"], [], [], []],
                        [[], [], [], [], []],
                    ],
                },
                allCones: {
                    __typename: "ConeLayout",
                    redNearTerminal: 1,
                    redFarTerminal: 0,
                    blueNearTerminal: 0,
                    blueFarTerminal: 0,
                    junctions: [
                        [[], [], ["RED_BEACON_1"], ["RED_CONE", "RED_BEACON_2"], []],
                        [
                            [],
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
                                "RED_CONE",
                                "RED_CONE",
                            ],
                            [],
                            ["BLUE_CONE"],
                        ],
                        [[], ["RED_CONE", "RED_CONE", "RED_CONE", "RED_CONE"], [], ["BLUE_CONE", "BLUE_CONE"], []],
                        [
                            ["BLUE_CONE", "BLUE_CONE", "BLUE_CONE", "BLUE_CONE", "BLUE_CONE"],
                            ["BLUE_CONE", "RED_CONE", "RED_CONE"],
                            [
                                "BLUE_CONE",
                                "BLUE_CONE",
                                "BLUE_CONE",
                                "BLUE_CONE",
                                "BLUE_CONE",
                                "BLUE_CONE",
                                "BLUE_CONE",
                                "BLUE_CONE",
                                "BLUE_CONE",
                                "BLUE_CONE",
                                "BLUE_CONE",
                                "BLUE_CONE",
                                "BLUE_CONE",
                            ],
                            ["BLUE_CONE", "BLUE_BEACON_1"],
                            [],
                        ],
                        [[], ["BLUE_CONE"], [], [], []],
                    ],
                },
                red: {
                    __typename: "MatchScores2022Alliance",
                    teams: [
                        {
                            __typename: "TeamMatchParticipation",
                            season: 2022,
                            eventCode: "USCOLIQ",
                            matchId: 11001,
                            teamNumber: 11260,
                            station: "RED_2",
                            team: {
                                __typename: "Team",
                                number: 11260,
                                name: "Up-A-Creek Robotics",
                            },
                        },
                        {
                            __typename: "TeamMatchParticipation",
                            season: 2022,
                            eventCode: "USCOLIQ",
                            matchId: 11001,
                            teamNumber: 17483,
                            station: "RED_1",
                            team: {
                                __typename: "Team",
                                number: 17483,
                                name: "Blackout",
                            },
                        },
                        {
                            __typename: "TeamMatchParticipation",
                            season: 2022,
                            eventCode: "USCOLIQ",
                            matchId: 11001,
                            teamNumber: 20771,
                            station: "RED_3",
                            team: {
                                __typename: "Team",
                                number: 20771,
                                name: "Bearbotics Sigma",
                            },
                        },
                    ],
                    season: 2022,
                    eventCode: "USCOLIQ",
                    matchId: 11001,
                    alliance: "RED",
                    autoNavigation12022: "TEAM_SIGNAL",
                    autoNavigation22022: "TEAM_SIGNAL",
                    autoTerminalCones: 0,
                    autoGroundCones: 0,
                    autoLowCones: 0,
                    autoMediumCones: 0,
                    autoHighCones: 7,
                    dcTerminalCones: 1,
                    dcGroundCones: 0,
                    dcLowCones: 1,
                    dcMediumCones: 3,
                    dcHighCones: 17,
                    endgameNavigated1: true,
                    endgameNavigated2: false,
                    coneOwnedJunctions: 4,
                    beaconOwnedJunctions: 2,
                    circuit: false,
                    minorPenalties: 2,
                    majorPenalties: 0,
                    autoNavigationPoints: 40,
                    autoConePoints: 35,
                    endgameNavigationPoints: 2,
                    ownershipPoints: 32,
                    circuitPoints: 0,
                    autoPoints: 75,
                    dcPoints: 101,
                    endgamePoints: 34,
                    penaltyPoints: 0,
                    totalPoints: 210,
                    totalPointsNp: 210,
                },
                blue: {
                    __typename: "MatchScores2022Alliance",
                    teams: [
                        {
                            __typename: "TeamMatchParticipation",
                            season: 2022,
                            eventCode: "USCOLIQ",
                            matchId: 11001,
                            teamNumber: 11308,
                            station: "BLUE_2",
                            team: {
                                __typename: "Team",
                                number: 11308,
                                name: "YISE",
                            },
                        },
                        {
                            __typename: "TeamMatchParticipation",
                            season: 2022,
                            eventCode: "USCOLIQ",
                            matchId: 11001,
                            teamNumber: 17969,
                            station: "BLUE_1",
                            team: {
                                __typename: "Team",
                                number: 17969,
                                name: "MECH",
                            },
                        },
                        {
                            __typename: "TeamMatchParticipation",
                            season: 2022,
                            eventCode: "USCOLIQ",
                            matchId: 11001,
                            teamNumber: 21430,
                            station: "BLUE_3",
                            team: {
                                __typename: "Team",
                                number: 21430,
                                name: "BroomBots",
                            },
                        },
                    ],
                    season: 2022,
                    eventCode: "USCOLIQ",
                    matchId: 11001,
                    alliance: "BLUE",
                    autoNavigation12022: "TEAM_SIGNAL",
                    autoNavigation22022: "TEAM_SIGNAL",
                    autoTerminalCones: 0,
                    autoGroundCones: 0,
                    autoLowCones: 5,
                    autoMediumCones: 1,
                    autoHighCones: 0,
                    dcTerminalCones: 0,
                    dcGroundCones: 0,
                    dcLowCones: 7,
                    dcMediumCones: 2,
                    dcHighCones: 15,
                    endgameNavigated1: false,
                    endgameNavigated2: true,
                    coneOwnedJunctions: 5,
                    beaconOwnedJunctions: 1,
                    circuit: false,
                    minorPenalties: 0,
                    majorPenalties: 0,
                    autoNavigationPoints: 40,
                    autoConePoints: 19,
                    endgameNavigationPoints: 2,
                    ownershipPoints: 25,
                    circuitPoints: 0,
                    autoPoints: 59,
                    dcPoints: 104,
                    endgamePoints: 27,
                    penaltyPoints: 20,
                    totalPoints: 210,
                    totalPointsNp: 190,
                },
            },
            teams: [
                {
                    __typename: "TeamMatchParticipation",
                    season: 2022,
                    eventCode: "USCOLIQ",
                    matchId: 11001,
                    teamNumber: 11260,
                    station: "RED_2",
                    team: {
                        __typename: "Team",
                        number: 11260,
                        name: "Up-A-Creek Robotics",
                    },
                    surrogate: false,
                    noShow: false,
                    dq: false,
                    onField: true,
                },
                {
                    __typename: "TeamMatchParticipation",
                    season: 2022,
                    eventCode: "USCOLIQ",
                    matchId: 11001,
                    teamNumber: 11308,
                    station: "BLUE_2",
                    team: {
                        __typename: "Team",
                        number: 11308,
                        name: "YISE",
                    },
                    surrogate: false,
                    noShow: false,
                    dq: false,
                    onField: false,
                },
                {
                    __typename: "TeamMatchParticipation",
                    season: 2022,
                    eventCode: "USCOLIQ",
                    matchId: 11001,
                    teamNumber: 17483,
                    station: "RED_1",
                    team: {
                        __typename: "Team",
                        number: 17483,
                        name: "Blackout",
                    },
                    surrogate: false,
                    noShow: false,
                    dq: false,
                    onField: true,
                },
                {
                    __typename: "TeamMatchParticipation",
                    season: 2022,
                    eventCode: "USCOLIQ",
                    matchId: 11001,
                    teamNumber: 17969,
                    station: "BLUE_1",
                    team: {
                        __typename: "Team",
                        number: 17969,
                        name: "MECH",
                    },
                    surrogate: false,
                    noShow: false,
                    dq: false,
                    onField: true,
                },
                {
                    __typename: "TeamMatchParticipation",
                    season: 2022,
                    eventCode: "USCOLIQ",
                    matchId: 11001,
                    teamNumber: 20771,
                    station: "RED_3",
                    team: {
                        __typename: "Team",
                        number: 20771,
                        name: "Bearbotics Sigma",
                    },
                    surrogate: false,
                    noShow: false,
                    dq: false,
                    onField: false,
                },
                {
                    __typename: "TeamMatchParticipation",
                    season: 2022,
                    eventCode: "USCOLIQ",
                    matchId: 11001,
                    teamNumber: 21430,
                    station: "BLUE_3",
                    team: {
                        __typename: "Team",
                        number: 21430,
                        name: "BroomBots",
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
            code: "USCOLIQ",
            name: "CO Southwest Metro Qualifier",
            start: "2023-02-04",
            end: "2023-02-04",
            venue: "Chatfield Senior High School",
            city: "Littleton",
            stateOrProvince: "CO",
            country: "USA",
            website: "https://coloradofirst.org/COFIRST/event/first-tech-challenge-qualifier-southwest-metro/",
            remote: false,
            published: true,
            hasStarted: true,
        },
    ];
    const MATCH_DATA = [
        {
            __typename: "Match",
            season: 2022,
            eventCode: "USCALAROQ2",
            id: 30,
            matchNum: 30,
            matchDescription: "Q-30",
            tournamentLevel: "QUALS",
            scheduledStartTime: "2023-01-31T12:52:00.000Z",
            actualStartTime: "2023-01-31T13:53:48.583Z",
            hasBeenPlayed: true,
            scores: {
                __typename: "MatchScores2022",
                season: 2022,
                eventCode: "USCALAROQ2",
                matchId: 30,
                autoCones: {
                    __typename: "ConeLayout",
                    redNearTerminal: 0,
                    redFarTerminal: 0,
                    blueNearTerminal: 0,
                    blueFarTerminal: 0,
                    junctions: [
                        [[], [], [], [], []],
                        [[], ["RED_CONE"], [], [], []],
                        [[], [], [], [], []],
                        [[], [], [], ["BLUE_CONE"], []],
                        [[], [], [], [], []],
                    ],
                },
                allCones: {
                    __typename: "ConeLayout",
                    redNearTerminal: 2,
                    redFarTerminal: 0,
                    blueNearTerminal: 0,
                    blueFarTerminal: 0,
                    junctions: [
                        [[], ["RED_CONE"], [], [], []],
                        [
                            ["RED_CONE"],
                            ["RED_CONE", "RED_CONE"],
                            ["RED_CONE"],
                            ["BLUE_CONE", "RED_CONE"],
                            ["BLUE_CONE", "RED_CONE"],
                        ],
                        [
                            [],
                            ["RED_CONE", "BLUE_CONE"],
                            [],
                            ["BLUE_CONE", "RED_CONE", "BLUE_CONE", "RED_CONE", "BLUE_CONE"],
                            [],
                        ],
                        [
                            ["BLUE_CONE", "BLUE_CONE", "BLUE_CONE", "BLUE_CONE", "BLUE_CONE"],
                            [],
                            ["BLUE_CONE"],
                            ["BLUE_CONE"],
                            [],
                        ],
                        [[], [], [], ["BLUE_CONE", "BLUE_BEACON_1"], []],
                    ],
                },
                red: {
                    __typename: "MatchScores2022Alliance",
                    teams: [
                        {
                            __typename: "TeamMatchParticipation",
                            season: 2022,
                            eventCode: "USCALAROQ2",
                            matchId: 30,
                            teamNumber: 22342,
                            station: "RED_2",
                            team: {
                                __typename: "Team",
                                number: 22342,
                                name: "STAMPEDE MACHINES",
                            },
                        },
                        {
                            __typename: "TeamMatchParticipation",
                            season: 2022,
                            eventCode: "USCALAROQ2",
                            matchId: 30,
                            teamNumber: 22740,
                            station: "RED_1",
                            team: {
                                __typename: "Team",
                                number: 22740,
                                name: "Bot Bot",
                            },
                        },
                    ],
                    season: 2022,
                    eventCode: "USCALAROQ2",
                    matchId: 30,
                    alliance: "RED",
                    autoNavigation12022: "TEAM_SIGNAL",
                    autoNavigation22022: "TEAM_SIGNAL",
                    autoTerminalCones: 0,
                    autoGroundCones: 0,
                    autoLowCones: 0,
                    autoMediumCones: 1,
                    autoHighCones: 0,
                    dcTerminalCones: 2,
                    dcGroundCones: 0,
                    dcLowCones: 3,
                    dcMediumCones: 3,
                    dcHighCones: 4,
                    endgameNavigated1: false,
                    endgameNavigated2: false,
                    coneOwnedJunctions: 6,
                    beaconOwnedJunctions: 0,
                    circuit: false,
                    minorPenalties: 1,
                    majorPenalties: 0,
                    autoNavigationPoints: 40,
                    autoConePoints: 4,
                    endgameNavigationPoints: 0,
                    ownershipPoints: 18,
                    circuitPoints: 0,
                    autoPoints: 44,
                    dcPoints: 43,
                    endgamePoints: 18,
                    penaltyPoints: 10,
                    totalPoints: 115,
                    totalPointsNp: 105,
                },
                blue: {
                    __typename: "MatchScores2022Alliance",
                    teams: [
                        {
                            __typename: "TeamMatchParticipation",
                            season: 2022,
                            eventCode: "USCALAROQ2",
                            matchId: 30,
                            teamNumber: 9220,
                            station: "BLUE_2",
                            team: {
                                __typename: "Team",
                                number: 9220,
                                name: "Rancho Rebel Robotics",
                            },
                        },
                        {
                            __typename: "TeamMatchParticipation",
                            season: 2022,
                            eventCode: "USCALAROQ2",
                            matchId: 30,
                            teamNumber: 16321,
                            station: "BLUE_1",
                            team: {
                                __typename: "Team",
                                number: 16321,
                                name: "X Drive",
                            },
                        },
                    ],
                    season: 2022,
                    eventCode: "USCALAROQ2",
                    matchId: 30,
                    alliance: "BLUE",
                    autoNavigation12022: "TEAM_SIGNAL",
                    autoNavigation22022: "NONE",
                    autoTerminalCones: 0,
                    autoGroundCones: 0,
                    autoLowCones: 0,
                    autoMediumCones: 1,
                    autoHighCones: 0,
                    dcTerminalCones: 0,
                    dcGroundCones: 0,
                    dcLowCones: 7,
                    dcMediumCones: 2,
                    dcHighCones: 5,
                    endgameNavigated1: false,
                    endgameNavigated2: true,
                    coneOwnedJunctions: 5,
                    beaconOwnedJunctions: 1,
                    circuit: false,
                    minorPenalties: 1,
                    majorPenalties: 0,
                    autoNavigationPoints: 20,
                    autoConePoints: 4,
                    endgameNavigationPoints: 2,
                    ownershipPoints: 25,
                    circuitPoints: 0,
                    autoPoints: 24,
                    dcPoints: 54,
                    endgamePoints: 27,
                    penaltyPoints: 10,
                    totalPoints: 115,
                    totalPointsNp: 105,
                },
            },
            teams: [
                {
                    __typename: "TeamMatchParticipation",
                    season: 2022,
                    eventCode: "USCALAROQ2",
                    matchId: 30,
                    teamNumber: 9220,
                    station: "BLUE_2",
                    team: {
                        __typename: "Team",
                        number: 9220,
                        name: "Rancho Rebel Robotics",
                    },
                    surrogate: false,
                    noShow: false,
                    dq: false,
                    onField: true,
                },
                {
                    __typename: "TeamMatchParticipation",
                    season: 2022,
                    eventCode: "USCALAROQ2",
                    matchId: 30,
                    teamNumber: 16321,
                    station: "BLUE_1",
                    team: {
                        __typename: "Team",
                        number: 16321,
                        name: "X Drive",
                    },
                    surrogate: false,
                    noShow: false,
                    dq: false,
                    onField: true,
                },
                {
                    __typename: "TeamMatchParticipation",
                    season: 2022,
                    eventCode: "USCALAROQ2",
                    matchId: 30,
                    teamNumber: 22342,
                    station: "RED_2",
                    team: {
                        __typename: "Team",
                        number: 22342,
                        name: "STAMPEDE MACHINES",
                    },
                    surrogate: false,
                    noShow: false,
                    dq: false,
                    onField: true,
                },
                {
                    __typename: "TeamMatchParticipation",
                    season: 2022,
                    eventCode: "USCALAROQ2",
                    matchId: 30,
                    teamNumber: 22740,
                    station: "RED_1",
                    team: {
                        __typename: "Team",
                        number: 22740,
                        name: "Bot Bot",
                    },
                    surrogate: false,
                    noShow: false,
                    dq: false,
                    onField: true,
                },
            ],
        },
    ];
    const EVENT_DATA = {
        __typename: "Event",
        season: 2022,
        code: "USCALAROQ2",
        name: "CA-SoCal ILT 2 - Romoland Sunday",
        start: "2023-02-05",
        end: "2023-02-05",
        venue: "Heritage High School",
        city: "Romoland",
        stateOrProvince: "CA",
        country: "USA",
        website: "https://socalftc.org/",
        remote: false,
        published: true,
        hasStarted: true,
    };
</script>

<PostTemplate>
    <svelte:fragment slot="title">How To Tie a Tie</svelte:fragment>
    <svelte:fragment slot="author">Jonah Reinis</svelte:fragment>
    <svelte:fragment slot="date">February 20, 2023</svelte:fragment>

    <p>
        <em>All statistics in this article refer to the 2022-2023 Spin Up Season.</em>
    </p>

    <p>After much waiting, the Scouting Report hath returned.</p>

    <p>All statistics in this article refer to the 2022-2023 Spin Up Season.</p>
    <p>
        I and the rest of the VexScout team (just Daniel) are sorry for the lack of Scouting Reports over the past few
        weeks. Rest assured that we will resume regular updates starting this week. So a few weeks ago, <a
            href="/teams/16321"
            >my team
        </a>(completely shameless plug), had our <a href="/events/2022/USCALAROQ2/matches"> tournament qualifier</a>.
        The top 7 teams in advancement order in this event move on to SoCal Regionals. We were WA2. Here’s the thing,
        after a few picks that weren't based off of OPR, the captains began picking teams off of rank. If we were one
        rank higher or lower we would not have been picked by the Winning Alliance (who probably would’ve won anyways,
        <a href="/teams/21936">Samotech</a> is the
        <i>best</i> in our region.)
    </p>
    <MatchTable
        matches={MATCH_DATA}
        event={EVENT_DATA}
        teamPage={false}
        isRemote={false}
        frozen={true}
        selectedTeam={null}
    />
    <p>This is an uninteresting story so far.</p>
    <p>In this event, we had a draw. If we had not had that draw, we would not have been on the winning alliance.</p>
    <p>To curtail this long-winded introduction: this Scouting Report will be about draws.</p>
    <p>
        The team with the most amount of draws is a six way tie between
        <a href="/teams/22170">22170</a>,
        <a href="/teams/22744">22744</a>,
        <a href="/teams/22713">22713</a>,
        <a href="/teams/21338">21338 </a>,
        <a href="/teams/22852">22852</a>, and
        <a href="/teams/22709">22709</a>, with 4 draws each. These teams are all in the same league. A league which had
        a <i>suspicious</i> scrimmage with three 0-0 ties. These teams have a lot of draws, but that isn’t very hard to do
        when most of them are 0-0.
    </p>
    <p>
        We’re gonna look at teams with the most draws, barring matches with 0-0 outcomes. Team <a href="/teams/22261"
            >22261
        </a>
        and <a href="/teams/10098">10098 </a> both had 3 draws this season, which is a lot. Not even very low scoring
        draws either. All of their draws are over 70 points. As a side note, the highest scoring match that was a draw
        was <a href="https://ftcscout.org/teams/11260?scores=USCOLIQ-11001">this one </a>.
    </p>
    <MatchTable
        matches={MATCH_DATA2}
        event={EVENT_DATA2}
        teamPage={false}
        isRemote={false}
        frozen={true}
        selectedTeam={null}
    />
    <p>
        The team with the most draws, barring 0-0 matches and only matches with penalties is just a massive 11 way tie.
        Some familiar teams show up. <a
            href="https://ftcscout.org/records/2022/matches?filter=%7B%22all%22%3A%5B%7B%22lhs%22%3A%22Total+Points%22%2C%22op%22%3A%22%3D%22%2C%22rhs%22%3A%22Total+Points+Opponent%22%7D%2C%7B%22any%22%3A%5B%7B%22lhs%22%3A%22Total+Points%22%2C%22op%22%3A%22%E2%89%A0%22%2C%22rhs%22%3A%22Total+Points+No+Penalties%22%7D%2C%7B%22lhs%22%3A%22Total+Points+Opponent%22%2C%22op%22%3A%22%E2%89%A0%22%2C%22rhs%22%3A%22Total+Points+No+Penalties+Opponent%22%7D%5D%7D%5D%7D"
            >Matches in question.</a
        >
    </p>
    <p>
        Ties are pretty uncommon to say the least. The events with the most ties are <a
            href="https://ftcscout.org/events/2022/USTXWPLAM1/matches">2022 TX-W&P Lubbock-A League Meet #1</a
        >, <a href="https://ftcscout.org/events/2022/USMTBUQ/matches">2022 MT Butte Qualifier</a>, and
        <a href="https://ftcscout.org/events/2022/USCOLIQ/matches">2023 CO Southwest Metro Qualifier</a>, each with
        three ties. This is ignoring 0-0 ties, with 0-0 ties it's still three but with a few more events.
    </p>
    <p class="suggestions">
        If you have any suggestions for topics you would like us to cover email us at <a
            href="mailto:suggestions@ftcscout.org"
        >
            suggestions@vexscout.org</a
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

    .code {
        font-family: monospace;
    }

    .suggestions {
        margin-top: var(--xl-gap);
        margin-bottom: 0;
        font-style: italic;
        color: var(--secondary-text-color);
    }
</style>
