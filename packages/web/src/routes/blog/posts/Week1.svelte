<script lang="ts">
    import MatchTable from "$lib/components/matches/MatchTable.svelte";
    import type { BlogMatchImport } from "../+page.svelte";
    import BlogTemplate from "../BlogTemplate.svelte";

    import * as data_ from "../data/USTXHOSLLT.json";
    let data = data_ as BlogMatchImport;
</script>

<BlogTemplate slug="worst-surrogacy">
    <svelte:fragment slot="title">The Search for the Worst Surrogacy</svelte:fragment>
    <svelte:fragment slot="author">Daniel James</svelte:fragment>
    <svelte:fragment slot="date">October 14, 2022</svelte:fragment>

    <p>
        When the number of teams at an FTC doesn’t allow every team to play exactly five matches and
        at the same time have all matches be full the match scheduler will make some teams play an
        extra sixth match as a surrogate. These matches occur near the middle of the tournament
        (both in the match schedule and for the teams involved).
    </p>

    <p>
        Since the number of surrogates required in an event is equal to <span class="code">
            #Teams mod 4
        </span>
        we would expect about 75% of events to contain surrogates. That is indeed what we see. 389 /
        526 relevant events (74%) contain surrogates. There are however two events where the match scheduler
        seems to have gone haywire. At the
        <a href="/events/2021/USCHSHAQ1/matches"> 2022 VA Harrisonburg Qualifier 1 </a>
        and the
        <a href="/events/2021/USCHSAAQ3/matches"> 2022 VA Alexandria Qualifier 3 </a>
        surrogates where scheduled despite the number of teams being a multiple of four. Harrisonburg
        contains <em>16</em> surrogates and Alexandria contains 12! (VA Alexandria Qualifier 3 is
        one of the weirdest events ever. It has 12 surrogates, 16 DQs, a tie, and the second lowest
        numbered still active
        <a href="/teams/7">Team #7 Tactical Sheep</a>).
    </p>

    <p>
        One question that I’ve often wondered about surrogates is: do alliances with surrogates
        perform worse? To answer this question we can compare the expected score (the sum of the two
        alliance member’s OPRs) to the actual score. On average these two are equal (that is the
        definition of OPR) but is the same true in surrogate matches? Let’s find out!
    </p>

    <p>
        There were 1049 alliances that contained surrogates last year. Of those alliances, drumroll
        please…, 504 scored worse than expected! That means that teams perform just at their average
        in surrogate matches. Gracious professionalism! What about when both alliance members are
        surrogates? There were 67 such alliances and 30 of them performed worse than average. It
        seems like teams perform the same regardless of if they are a surrogate or not.
    </p>

    <p>
        This investigation has brought another question to my mind. What is the biggest
        overperformance in a surrogate match? Who got really unlucky and their best match was when
        they were a surrogate? Let's find out.
    </p>

    <p>
        To do this we will find the biggest difference between a team’s average score and their
        score in surrogate. Our unlucky winner is: <a href="/teams/20394">
            Team #20394 Mustangs2.0
        </a>. The Mustangs were averaging just 89 points a match at the
        <a href="/events/2021/USTXHOSLLT/matches"> 2022 TX-Houston South-West League Tournament </a>
        when they pulled in by far their largest score (and the second best score of the day) with a
        244 in Q-7 with
        <a href="/teams/14503">Team #14503 Robo Sapiens</a>.
    </p>

    <MatchTable event={data.event} matches={data.matches} />

    <p>
        Unfortunately for them they were a surrogate. If they had gotten to count the match instead
        of one of their average scores they would have gained 155 RP and gone from 7th place to 3rd
        making them an alliance captain! As is, they didn’t even get to compete in the playoffs.
        Sorry 20394! That’s gotta sting.
    </p>
</BlogTemplate>
