<script>
    import MatchTable from "$lib/components/matches/MatchTable.svelte";
    import { EMAIL } from "$lib/constants";
    import PostTemplate from "../PostTemplate.svelte";

    const MATCH_DATA = [
        {
            __typename: "Match",
            season: 2021,
            eventCode: "USTXHOSLLT",
            id: 7,
            matchNum: 7,
            matchDescription: "Q-7",
            tournamentLevel: "QUALS",
            scheduledStartTime: "2022-02-26T19:40:00.000Z",
            scores: {
                __typename: "MatchScores2021Traditional",
                season: 2021,
                eventCode: "USTXHOSLLT",
                matchId: 7,
                randomization: 4,
                red: {
                    __typename: "MatchScores2021TraditionalAlliance",
                    season: 2021,
                    eventCode: "USTXHOSLLT",
                    matchId: 7,
                    alliance: "RED",
                    barcodeElement1: "DUCK",
                    barcodeElement2: "TSE",
                    autoCarousel: true,
                    autoNavigation1: "COMPLETELY_IN_STORAGE",
                    autoNavigation2: "COMPLETELY_IN_WAREHOUSE",
                    autoBonus1: false,
                    autoBonus2: true,
                    autoStorageFreight: 0,
                    autoFreight1: 1,
                    autoFreight2: 0,
                    autoFreight3: 1,
                    driverControlledStorageFreight: 0,
                    driverControlledFreight1: 1,
                    driverControlledFreight2: 0,
                    driverControlledFreight3: 12,
                    sharedFreight: 2,
                    endgameDucksDelivered: 10,
                    allianceBalanced: false,
                    sharedUnbalanced: true,
                    endgamePark1: "IN_WAREHOUSE",
                    endgamePark2: "COMPLETELY_IN_WAREHOUSE",
                    capped: 1,
                    minorPenalties: 0,
                    majorPenalties: 0,
                    autoCarouselPoints: 10,
                    autoNavigationPoints: 16,
                    autoFreightPoints: 12,
                    autoBonusPoints: 20,
                    driverControlledAllianceHubPoints: 74,
                    driverControlledSharedHubPoints: 8,
                    driverControlledStoragePoints: 0,
                    endgameDeliveryPoints: 60,
                    allianceBalancedPoints: 0,
                    sharedUnbalancedPoints: 20,
                    endgameParkingPoints: 9,
                    cappingPoints: 15,
                    autoPoints: 58,
                    driverControlledPoints: 82,
                    endgamePoints: 104,
                    penaltyPoints: 0,
                    totalPoints: 244,
                    totalPointsNp: 244,
                },
                blue: {
                    __typename: "MatchScores2021TraditionalAlliance",
                    season: 2021,
                    eventCode: "USTXHOSLLT",
                    matchId: 7,
                    alliance: "BLUE",
                    barcodeElement1: "DUCK",
                    barcodeElement2: "TSE",
                    autoCarousel: false,
                    autoNavigation1: "COMPLETELY_IN_WAREHOUSE",
                    autoNavigation2: "IN_STORAGE",
                    autoBonus1: false,
                    autoBonus2: false,
                    autoStorageFreight: 0,
                    autoFreight1: 0,
                    autoFreight2: 1,
                    autoFreight3: 0,
                    driverControlledStorageFreight: 0,
                    driverControlledFreight1: 0,
                    driverControlledFreight2: 3,
                    driverControlledFreight3: 0,
                    sharedFreight: 0,
                    endgameDucksDelivered: 9,
                    allianceBalanced: false,
                    sharedUnbalanced: false,
                    endgamePark1: "COMPLETELY_IN_WAREHOUSE",
                    endgamePark2: "COMPLETELY_IN_WAREHOUSE",
                    capped: 0,
                    minorPenalties: 0,
                    majorPenalties: 0,
                    autoCarouselPoints: 0,
                    autoNavigationPoints: 13,
                    autoFreightPoints: 6,
                    autoBonusPoints: 0,
                    driverControlledAllianceHubPoints: 12,
                    driverControlledSharedHubPoints: 0,
                    driverControlledStoragePoints: 0,
                    endgameDeliveryPoints: 54,
                    allianceBalancedPoints: 0,
                    sharedUnbalancedPoints: 0,
                    endgameParkingPoints: 12,
                    cappingPoints: 0,
                    autoPoints: 19,
                    driverControlledPoints: 12,
                    endgamePoints: 66,
                    penaltyPoints: 0,
                    totalPoints: 97,
                    totalPointsNp: 97,
                },
            },
            teams: [
                {
                    __typename: "TeamMatchParticipation",
                    season: 2021,
                    eventCode: "USTXHOSLLT",
                    matchId: 7,
                    teamNumber: 12364,
                    station: "BLUE_1",
                    team: {
                        __typename: "Team",
                        number: 12364,
                        name: "KNIGHTRON",
                    },
                    surrogate: false,
                    noShow: false,
                    dq: false,
                    onField: true,
                },
                {
                    __typename: "TeamMatchParticipation",
                    season: 2021,
                    eventCode: "USTXHOSLLT",
                    matchId: 7,
                    teamNumber: 14503,
                    station: "RED_2",
                    team: {
                        __typename: "Team",
                        number: 14503,
                        name: "Robo Sapiens",
                    },
                    surrogate: false,
                    noShow: false,
                    dq: false,
                    onField: true,
                },
                {
                    __typename: "TeamMatchParticipation",
                    season: 2021,
                    eventCode: "USTXHOSLLT",
                    matchId: 7,
                    teamNumber: 16685,
                    station: "BLUE_2",
                    team: {
                        __typename: "Team",
                        number: 16685,
                        name: "Logos Lions The Mane Show",
                    },
                    surrogate: false,
                    noShow: false,
                    dq: false,
                    onField: true,
                },
                {
                    __typename: "TeamMatchParticipation",
                    season: 2021,
                    eventCode: "USTXHOSLLT",
                    matchId: 7,
                    teamNumber: 20394,
                    station: "RED_1",
                    team: {
                        __typename: "Team",
                        number: 20394,
                        name: "Mustangs2.0",
                    },
                    surrogate: true,
                    noShow: false,
                    dq: false,
                    onField: true,
                },
            ],
        },
    ];

    const EVENT_DATA = {
        season: 2021,
        code: "USTXHOSLLT",
        name: "TX-Houston South-West League Tournament",
        start: "2022-02-26",
        end: "2022-02-26",
        venue: "Reese Career & Technical Center",
        city: "Sugar Land",
        stateOrProvince: "TX",
        country: "USA",
        website: null,
        remote: false,
        published: true,
        hasStarted: true,
    };
</script>

<PostTemplate>
    <svelte:fragment slot="title">The Search for the Worst Surrogacy</svelte:fragment>
    <svelte:fragment slot="author">Daniel James</svelte:fragment>
    <svelte:fragment slot="date">October 14, 2022</svelte:fragment>

    <p>
        <em>All statistics in this article refer to the 2021 Freight Frenzy Season.</em>
    </p>

    <p>
        When the number of teams at an FTC doesn’t allow every team to play exactly five matches and at the same time
        have all matches be full the match scheduler will make some teams play an extra sixth match as a surrogate.
        These matches occur near the middle of the tournament (both in the match schedule and for the teams involved).
    </p>

    <p>
        Since the number of surrogates required in an event is equal to <span class="code">#Teams mod 4</span> we would
        expect about 75% of events to contain surrogates. That is indeed what we see. 389 / 526 relevant events (74%)
        contain surrogates. There are however two events where the match scheduler seems to have gone haywire. At the
        <a href="https://ftcscout.org/events/2021/USCHSHAQ1/matches">2022 VA Harrisonburg Qualifier 1</a> and the
        <a href="https://ftcscout.org/events/2021/USCHSAAQ3/matches">2022 VA Alexandria Qualifier 3</a> surrogates where
        scheduled despite the number of teams being a multiple of four. Harrisonburg contains <em>16</em> surrogates and
        Alexandria contains 12! (VA Alexandria Qualifier 3 is one of the weirdest events ever. It has 12 surrogates, 16
        DQs, a tie, and the second lowest numbered still active
        <a href="https://ftcscout.org/teams/7">Team #7 Tactical Sheep</a>).
    </p>

    <p>
        One question that I’ve often wondered about surrogates is: do alliances with surrogates perform worse? To answer
        this question we can compare the expected score (the sum of the two alliance member’s OPRs) to the actual score.
        On average these two are equal (that is the definition of OPR) but is the same true in surrogate matches? Let’s
        find out!
    </p>

    <p>
        There were 1049 alliances that contained surrogates last year. Of those alliances, drumroll please…, 504 scored
        worse than expected! That means that teams perform just at their average in surrogate matches. Gracious
        professionalism! What about when both alliance members are surrogates? There were 67 such alliances and 30 of
        them performed worse than average. It seems like teams perform the same regardless of if they are a surrogate or
        not.
    </p>

    <p>
        This investigation has brought another question to my mind. What is the biggest overperformance in a surrogate
        match? Who got really unlucky and their best match was when they were a surrogate? Let's find out.
    </p>

    <p>
        To do this we will find the biggest difference between a team’s average score and their score in surrogate. Our
        unlucky winner is: <a href="https://ftcscout.org/teams/20394">Team #20394 Mustangs2.0</a>. The Mustangs were
        averaging just 89 points a match at the
        <a href="https://ftcscout.org/events/2021/USTXHOSLLT/matches">2022 TX-Houston South-West League Tournament</a>
        when they pulled in by far their largest score (and the second best score of the day) with a 244 in Q-7 with
        <a href="https://ftcscout.org/teams/14503">Team #14503 Robo Sapiens</a>.
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
        Unfortunately for them they were a surrogate. If they had gotten to count the match instead of one of their
        average scores they would have gained 155 RP and gone from 7th place to 3rd making them an alliance captain! As
        is, they didn’t even get to compete in the playoffs. Sorry 20394! That’s gotta sting.
    </p>

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
