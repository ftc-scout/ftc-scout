<script lang="ts">
    import BlogTemplate from "../BlogTemplate.svelte";
</script>

<BlogTemplate slug="making-up-stats">
    <svelte:fragment slot="title">Making Up Statistics</svelte:fragment>
    <svelte:fragment slot="author">Jonah Reinis</svelte:fragment>
    <svelte:fragment slot="date">October 30, 2022</svelte:fragment>

    <p>
        A wise man once said “OPR is the den of foolish robotics teams." I say we build a city of
        fools.
    </p>

    <p>
        There’s a lot of truth in these words as OPR,
        <a href="https://blog.thebluealliance.com/2017/10/05/the-math-behind-opr-an-introduction">
            Offensive Power Rating
        </a>
        is kind of a statistic we, FIRST, made up. It doesn’t completely measure how good a team is on
        its own. Especially in years with remote events, OPR becomes less and less of the force it once
        was. The biggest flaw with OPR are the inconsistent teams. For example, take Team A that scores
        poorly in all their matches except one where they do exceptionally well, and Team B that does
        average in all of their matches. The boost in OPR from that match that team B receives will be
        higher than Team A’s, even though Team A may have contributed more in that match.
    </p>

    <p>
        For all its flaws, OPR still does a decent job at approximating a team’s performance.
        However, in the spirit of America’s Pastime, I’d like to introduce some pitches for new
        statistics we could use in FTC, to show a different perspective. Oh boy do I love making up
        numbers.
    </p>

    <p>
        Average Domination (AD): Average Domination is the statistic found by dividing your team’s
        average by the event’s average, simple enough. The team with the highest AD (not including
        remote events, refer to the previous report) is <a href="/teams/16439">
            Team 16439, AlphaGo
        </a>, at the
        <a href="/events/2021/USCHSNOQ1/matches">VA Norfolk Qualifier 1</a>. At this event, AlphaGo
        had an AD of ~2.8 meaning that they did about 3 times better than the average team at that
        event.
    </p>

    <p>
        League Domination (LD): League Domination is the statistic found by dividing your team’s OPR
        by your team’s average at any given event. This statistic both shows how lucky you are in
        terms of teammates, but also how you compare to the rest of your league (again not including
        remote events). For example an LD of 60% means that you did on average 60% of the work in
        every alliance you were in. Interestingly enough, at <a
            href="/events/2021/USOKNEM1/matches"
        >
            OK Newcastle
        </a>,
        <a href="/teams/11344">Team 11344 - Merrit Oilers</a>
        had an LD of over 100%, 106% to be exact. When I saw this I thought my query must’ve been wrong
        or something, but upon checking their event you can actually see that their average was
        <em>lower</em> than their OPR. Something else of note is that AlphaGo ranks 7 on this list, which
        I guess makes sense.
    </p>

    <p>
        These are just some statistics I thought were interesting. Really you could apply this idea
        of “domination” to anywhere. Like Regional Domination, or Total Event Domination, or even
        Auto Freight Point Domination.
    </p>

    <p>
        We apologize for the delayed report this week, college applications exist and we appreciate
        your patience. I look forward to seeing you all next week with our first <em>Power Play</em>
        Scouting report.
    </p>
</BlogTemplate>
