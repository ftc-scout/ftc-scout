<script>
    import MatchTable from "$lib/components/matches/MatchTable.svelte";
    import { EMAIL } from "$lib/constants";
    import PostTemplate from "../PostTemplate.svelte";

    const MATCH_DATA = [
        {
            __typename: "Match",
            season: 2022,
            eventCode: "USGADOUGM1",
            id: 9,
            matchNum: 9,
            matchDescription: "Q-9",
            tournamentLevel: "QUALS",
            scheduledStartTime: "2022-10-29T11:46:00.000Z",
            hasBeenPlayed: true,
            scores: {
                __typename: "MatchScores2022",
                season: 2022,
                eventCode: "USGADOUGM1",
                matchId: 9,
                red: {
                    __typename: "MatchScores2022Alliance",
                    teams: [
                        {
                            __typename: "TeamMatchParticipation",
                            season: 2022,
                            eventCode: "USGADOUGM1",
                            matchId: 9,
                            teamNumber: 14750,
                            station: "RED_1",
                            team: {
                                __typename: "Team",
                                number: 14750,
                                name: "ATOM",
                            },
                        },
                        {
                            __typename: "TeamMatchParticipation",
                            season: 2022,
                            eventCode: "USGADOUGM1",
                            matchId: 9,
                            teamNumber: 20172,
                            station: "RED_2",
                            team: {
                                __typename: "Team",
                                number: 20172,
                                name: "Prometheus",
                            },
                        },
                    ],
                    season: 2022,
                    eventCode: "USGADOUGM1",
                    matchId: 9,
                    alliance: "RED",
                    autoNavigation12022: "NONE",
                    autoNavigation22022: "NONE",
                    autoTerminalCones: 0,
                    autoGroundCones: 0,
                    autoLowCones: 1,
                    autoMediumCones: 0,
                    autoHighCones: 0,
                    dcTerminalCones: 0,
                    dcGroundCones: 0,
                    dcLowCones: 2,
                    dcMediumCones: 0,
                    dcHighCones: 4,
                    endgameNavigated1: false,
                    endgameNavigated2: false,
                    coneOwnedJunctions: 2,
                    beaconOwnedJunctions: 0,
                    circuit: false,
                    minorPenalties: 0,
                    majorPenalties: 1,
                    autoNavigationPoints: 0,
                    autoConePoints: 3,
                    endgameNavigationPoints: 0,
                    ownershipPoints: 6,
                    circuitPoints: 0,
                    autoPoints: 3,
                    dcPoints: 26,
                    endgamePoints: 6,
                    penaltyPoints: 0,
                    totalPoints: 35,
                    totalPointsNp: 35,
                },
                blue: {
                    __typename: "MatchScores2022Alliance",
                    teams: [
                        {
                            __typename: "TeamMatchParticipation",
                            season: 2022,
                            eventCode: "USGADOUGM1",
                            matchId: 9,
                            teamNumber: 9785,
                            station: "BLUE_1",
                            team: {
                                __typename: "Team",
                                number: 9785,
                                name: "Cronos",
                            },
                        },
                        {
                            __typename: "TeamMatchParticipation",
                            season: 2022,
                            eventCode: "USGADOUGM1",
                            matchId: 9,
                            teamNumber: 12995,
                            station: "BLUE_2",
                            team: {
                                __typename: "Team",
                                number: 12995,
                                name: "Monkey Wrench Robotics",
                            },
                        },
                    ],
                    season: 2022,
                    eventCode: "USGADOUGM1",
                    matchId: 9,
                    alliance: "BLUE",
                    autoNavigation12022: "TEAM_SIGNAL",
                    autoNavigation22022: "TEAM_SIGNAL",
                    autoTerminalCones: 0,
                    autoGroundCones: 0,
                    autoLowCones: 0,
                    autoMediumCones: 0,
                    autoHighCones: 0,
                    dcTerminalCones: 5,
                    dcGroundCones: 1,
                    dcLowCones: 3,
                    dcMediumCones: 2,
                    dcHighCones: 7,
                    endgameNavigated1: true,
                    endgameNavigated2: false,
                    coneOwnedJunctions: 9,
                    beaconOwnedJunctions: 2,
                    circuit: true,
                    minorPenalties: 0,
                    majorPenalties: 0,
                    autoNavigationPoints: 40,
                    autoConePoints: 0,
                    endgameNavigationPoints: 2,
                    ownershipPoints: 47,
                    circuitPoints: 20,
                    autoPoints: 40,
                    dcPoints: 59,
                    endgamePoints: 69,
                    penaltyPoints: 30,
                    totalPoints: 198,
                    totalPointsNp: 168,
                },
            },
            teams: [
                {
                    __typename: "TeamMatchParticipation",
                    season: 2022,
                    eventCode: "USGADOUGM1",
                    matchId: 9,
                    teamNumber: 9785,
                    station: "BLUE_1",
                    team: {
                        __typename: "Team",
                        number: 9785,
                        name: "Cronos",
                    },
                    surrogate: false,
                    noShow: false,
                    dq: false,
                    onField: true,
                },
                {
                    __typename: "TeamMatchParticipation",
                    season: 2022,
                    eventCode: "USGADOUGM1",
                    matchId: 9,
                    teamNumber: 12995,
                    station: "BLUE_2",
                    team: {
                        __typename: "Team",
                        number: 12995,
                        name: "Monkey Wrench Robotics",
                    },
                    surrogate: false,
                    noShow: false,
                    dq: false,
                    onField: true,
                },
                {
                    __typename: "TeamMatchParticipation",
                    season: 2022,
                    eventCode: "USGADOUGM1",
                    matchId: 9,
                    teamNumber: 14750,
                    station: "RED_1",
                    team: {
                        __typename: "Team",
                        number: 14750,
                        name: "ATOM",
                    },
                    surrogate: false,
                    noShow: false,
                    dq: false,
                    onField: true,
                },
                {
                    __typename: "TeamMatchParticipation",
                    season: 2022,
                    eventCode: "USGADOUGM1",
                    matchId: 9,
                    teamNumber: 20172,
                    station: "RED_2",
                    team: {
                        __typename: "Team",
                        number: 20172,
                        name: "Prometheus",
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
        season: 2022,
        code: "USGADOUGM1",
        name: "GA Douglasville Meet 1",
        start: "2022-10-29",
        end: "2022-10-29",
        venue: "Douglas County High School",
        city: "Douglasville",
        stateOrProvince: "GA",
        country: "USA",
        website: null,
        remote: false,
        published: true,
        hasStarted: true,
    };
</script>

<PostTemplate>
    <svelte:fragment slot="title">What’s Up With Spin Up?</svelte:fragment>
    <svelte:fragment slot="author">Daniel James</svelte:fragment>
    <svelte:fragment slot="date">November 4, 2022</svelte:fragment>

    <p>
        We are now 8 weeks into the Spin Up season and are starting to get a good number of events, so we thought this
        would be a good time to take a look at some Spin Up stats. So far 45 events have published their results, 694
        matches have been played, and 1893 teams have signed up for or already participated in events.
    </p>

    <p>
        The overall (no penalties (don’t get me started on penalties being added to the other alliance it makes me
        crazy)) record is 168 (+30 penalty points) by <a href="https://ftcscout.org/teams/9785">9785 Cronos</a> and
        <a href="https://ftcscout.org/teams/12995">12995 Monkey Wrench Robotics</a> at the
        <a href="https://ftcscout.org/events/2022/USGADOUGM1/matches?scores=USGADOUGM1-9">2022 GA Douglasville Meet 1</a
        >.
    </p>
    <MatchTable
        matches={MATCH_DATA}
        event={EVENT_DATA}
        teamPage={false}
        isRemote={false}
        frozen={true}
        selectedTeam={null}
    />

    <p>
        The records for autonomous, teleop, and endgame are 55, 108, and 69 respectively. That means that we know at
        bare minimum a 232 point match is possible. Of course we expect these scores to go way up as the season
        progresses.
    </p>

    <p>
        Due to the relative simplicity of the game this year many think that strategy will be a critical deciding
        factor. One of the biggest elements of strategy is whether it is worth attempting to complete a circuit. So far
        only 87 of the 694 matches have had circuits completed. (That's 12.5%.) This suggests that it is rather hard to
        complete a circuit. On the other hand it really pays off. Teams that completed circuits went a staggering 85 -
        3. (Astute readers will notice this doesn’t add up to 87. There is one match where both alliances completed
        circuits.) Of these three losses one was from the double circuit match, a second was lost only because of
        penalties, and the third because the opposing alliance completed a rare double team signal sleeve navigation (a
        feat accomplished only 3% of the time). Of course completing a circuit correlates with being a better team so
        this may be correlation and not causation but it is still a striking statistic.
    </p>

    <p>
        It also seems like it might be worth going after junction ownership even if it doesn’t get you all the way to a
        circuit. Looking just at matches where an alliance controlled more junctions than their opponents but didn’t get
        a circuit the team with more junctions went 434 - 85. Again we have to remember that correlation is not
        causation but these are very interesting statistics.
    </p>

    <p>That’s all for now. We will keep you updated with more stats throughout the Spin Up season.</p>
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
