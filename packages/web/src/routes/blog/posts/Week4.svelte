<script lang="ts">
    import MatchTable from "$lib/components/matches/MatchTable.svelte";
    import type { BlogMatchImport } from "../+page.svelte";
    import BlogTemplate from "../BlogTemplate.svelte";

    import * as data_ from "../data/USGADOUGM1.json";
    let data = data_ as BlogMatchImport;
</script>

<BlogTemplate slug="whats-up-with-power-play">
    <svelte:fragment slot="title">What’s Up With Power Play?</svelte:fragment>
    <svelte:fragment slot="author">Daniel James</svelte:fragment>
    <svelte:fragment slot="date">November 4, 2022</svelte:fragment>

    <p>
        We are now 8 weeks into the Power Play season and are starting to get a good number of
        events, so we thought this would be a good time to take a look at some Power Play stats. So
        far 45 events have published their results, 694 matches have been played, and 1893 teams
        have signed up for or already participated in events.
    </p>

    <p>
        The overall (no penalties (don’t get me started on penalties being added to the other
        alliance it makes me crazy)) record is 168 (+30 penalty points) by <a href="/teams/9785">
            9785 Cronos
        </a>
        and
        <a href="/teams/12995">12995 Monkey Wrench Robotics</a> at the
        <a href="/events/2022/USGADOUGM1/matches?scores=USGADOUGM1-9">2022 GA Douglasville Meet 1</a
        >.
    </p>

    <MatchTable event={data.event} matches={data.matches} />

    <p>
        The records for autonomous, teleop, and endgame are 55, 108, and 69 respectively. That means
        that we know at bare minimum a 232 point match is possible. Of course we expect these scores
        to go way up as the season progresses.
    </p>

    <p>
        Due to the relative simplicity of the game this year many think that strategy will be a
        critical deciding factor. One of the biggest elements of strategy is whether it is worth
        attempting to complete a circuit. So far only 87 of the 694 matches have had circuits
        completed. (That's 12.5%.) This suggests that it is rather hard to complete a circuit. On
        the other hand it really pays off. Teams that completed circuits went a staggering 85 - 3.
        (Astute readers will notice this doesn’t add up to 87. There is one match where both
        alliances completed circuits.) Of these three losses one was from the double circuit match,
        a second was lost only because of penalties, and the third because the opposing alliance
        completed a rare double team signal sleeve navigation (a feat accomplished only 3% of the
        time). Of course completing a circuit correlates with being a better team so this may be
        correlation and not causation but it is still a striking statistic.
    </p>

    <p>
        It also seems like it might be worth going after junction ownership even if it doesn’t get
        you all the way to a circuit. Looking just at matches where an alliance controlled more
        junctions than their opponents but didn’t get a circuit the team with more junctions went
        434 - 85. Again we have to remember that correlation is not causation but these are very
        interesting statistics.
    </p>

    <p>
        That’s all for now. We will keep you updated with more stats throughout the Power Play
        season.
    </p>
</BlogTemplate>
