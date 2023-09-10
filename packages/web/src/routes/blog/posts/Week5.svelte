<script lang="ts">
    import MatchTable from "$lib/components/matches/MatchTable.svelte";
    import type { BlogMatchImport } from "../+page.svelte";
    import BlogTemplate from "../BlogTemplate.svelte";

    import * as data1_ from "../data/USCALAROQ2.json";
    let data1 = data1_ as BlogMatchImport;

    import * as data2_ from "../data/USCOLIQ.json";
    let data2 = data2_ as BlogMatchImport;
</script>

<BlogTemplate slug="tie-a-tie">
    <svelte:fragment slot="title">How To Tie a Tie</svelte:fragment>
    <svelte:fragment slot="author">Jonah Reinis</svelte:fragment>
    <svelte:fragment slot="date">February 20, 2023</svelte:fragment>

    <p>After much waiting, the Scouting Report hath returned.</p>

    <p>
        I and the rest of the FTCScout team (just Daniel) are sorry for the lack of Scouting Reports
        over the past few weeks. Rest assured that we will resume regular updates starting this
        week. So a few weeks ago, <a href="/teams/16321">my team </a>(completely shameless plug),
        had our <a href="/events/2022/USCALAROQ2/matches"> tournament qualifier</a>. The top 7 teams
        in advancement order in this event move on to SoCal Regionals. We were WA2. Here’s the
        thing, after a few picks that weren't based off of OPR, the captains began picking teams off
        of rank. If we were one rank higher or lower we would not have been picked by the Winning
        Alliance (who probably would’ve won anyways,
        <a href="/teams/21936">Samotech</a> is the
        <i>best</i> in our region.)
    </p>

    <MatchTable {...data1} />

    <p>This is an uninteresting story so far.</p>
    <p>
        In this event, we had a draw. If we had not had that draw, we would not have been on the
        winning alliance.
    </p>
    <p>To curtail this long-winded introduction: this Scouting Report will be about draws.</p>

    <p>
        The team with the most amount of draws is a six way tie between
        <a href="/teams/22170">22170</a>,
        <a href="/teams/22744">22744</a>,
        <a href="/teams/22713">22713</a>,
        <a href="/teams/21338">21338 </a>,
        <a href="/teams/22852">22852</a>, and
        <a href="/teams/22709">22709</a>, with 4 draws each. These teams are all in the same league.
        A league which had a <i>suspicious</i> scrimmage with three 0-0 ties. These teams have a lot
        of draws, but that isn’t very hard to do when most of them are 0-0.
    </p>

    <p>
        We’re gonna look at teams with the most draws, barring matches with 0-0 outcomes. Team <a
            href="/teams/22261"
            >22261
        </a>
        and <a href="/teams/10098">10098 </a> both had 3 draws this season, which is a lot. Not even
        very low scoring draws either. All of their draws are over 70 points. As a side note, the
        highest scoring match that was a draw was
        <a href="/teams/11260?scores=USCOLIQ-11001">this one </a>.
    </p>

    <MatchTable {...data2} />

    <p>
        The team with the most draws, barring 0-0 matches and only matches with penalties is just a
        massive 11 way tie. Some familiar teams show up. <a
            href="/records/2022/matches?filter=%7B%22all%22%3A%5B%7B%22lhs%22%3A%22Total+Points%22%2C%22op%22%3A%22%3D%22%2C%22rhs%22%3A%22Total+Points+Opponent%22%7D%2C%7B%22any%22%3A%5B%7B%22lhs%22%3A%22Total+Points%22%2C%22op%22%3A%22%E2%89%A0%22%2C%22rhs%22%3A%22Total+Points+No+Penalties%22%7D%2C%7B%22lhs%22%3A%22Total+Points+Opponent%22%2C%22op%22%3A%22%E2%89%A0%22%2C%22rhs%22%3A%22Total+Points+No+Penalties+Opponent%22%7D%5D%7D%5D%7D"
            >Matches in question.</a
        >
    </p>

    <p>
        Ties are pretty uncommon to say the least. The events with the most ties are <a
            href="/events/2022/USTXWPLAM1/matches">2022 TX-W&P Lubbock-A League Meet #1</a
        >, <a href="/events/2022/USMTBUQ/matches">2022 MT Butte Qualifier</a>, and
        <a href="/events/2022/USCOLIQ/matches">2023 CO Southwest Metro Qualifier</a>, each with
        three ties. This is ignoring 0-0 ties, with 0-0 ties it's still three but with a few more
        events.
    </p>
</BlogTemplate>
