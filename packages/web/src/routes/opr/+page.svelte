<script lang="ts">
    import Card from "$lib/components/Card.svelte";
    import WidthProvider from "$lib/components/WidthProvider.svelte";
    import Head from "$lib/components/Head.svelte";
</script>

<Head title="OPR | FTCScout" description="What OPR is, how it works, and when to use it." />

<WidthProvider width={"1000px"}>
    <Card>
        <h1 class="head">About OPR</h1>

        <div class="rest">
            <p>
                At the top of every team page on FTC<i>Scout</i> is a "Quick Stats" panel showing a
                team's "Best OPR" across several categories. But what exactly <i>is</i> OPR?
            </p>

            <h2>History of OPR</h2>

            <p>
                The term "Offensive Power Rating" (OPR) was first coined <a
                    href="https://www.chiefdelphi.com/forums/showpost.php?p=484220&postcount=19"
                    >by Scott Weingart</a
                >
                in 2006,
                <a
                    href="https://www.chiefdelphi.com/uploads/default/original/3X/b/1/b189025d110e1a96b70c698655fb17cd210f5a49.pdf"
                    >according to Team 2834</a
                >.
            </p>

            <p>
                He described using linear algebra to calculate the average contribution of a robot
                to their alliance during play. While I could walk you through each step of that
                process,
                <a
                    href="https://blog.thebluealliance.com/2017/10/05/the-math-behind-opr-an-introduction/"
                    >The Blue Alliance</a
                >
                already did an excellent job on their own post explaining the math behind OPR calculations,
                so I won't reinvent the wheel, and will instead refer you to them.
            </p>

            <h2>What exactly is it?</h2>

            <p>
                OPR boils down to one metric - <u
                    >How many points does a team contribute to their alliance, on average, at an
                    event?</u
                >
                It is important to make the distinction that OPR is <b>not</b> simply your average
                match score, divided by 2. OPR takes into account how good your alliance partners
                are, to figure out <i>on average</i> how many points you contributed to the team.
            </p>

            <p>
                This means that <i>in theory</i>, you could take the OPRs of 2 teams, add them
                together, and get a pretty good estimation for what the resulting score would be,
                were they ever to alliance.
            </p>

            <h2>Limitations</h2>

            <h3>With great <i>power</i> comes great responsibility</h3>

            <p>
                It is incredibly easy to misunderstand or misinterpret OPR. If you use it as your
                only metric for scouting, you're not scouting. OPR is an important tool in a good
                scouter's toolkit, but when all you have is a hammer, everything looks like a nail. <u
                    >Here are some reasons not to rely on it:</u
                >
            </p>

            <h4>It's called Offensive Power Rating for a reason</h4>

            <p>
                In seasons with substantial defensive play, OPR will end up overlooking defense as a
                metric. OPR tracks how well you do, but not how well you stop the other team from
                succeeding. Just because a potential alliance partner does not score many points
                does not mean that they won't help you win the match.
            </p>

            <h4>It's only as good as the data it has</h4>

            <p>
                Early on in an event, before enough matches have been played, OPR is completely
                useless. Before the algorithm has enough data, it will not give relevant results.
                Give the algorithm at least 4 matches to figure out what's going on.
            </p>

            <h4>Robot compatibility</h4>

            <p>
                Just because two robots have high OPRs does not mean they will work well together.
                If both robots have their autos perform best on the same side, only one of them will
                be able to perform at their best. Before picking an alliance partner, make sure to
                watch their matches and see how they play. Better yet, go to their booth and ask
                them about it.
            </p>

            <h4>Consistency</h4>
            <p>
                OPR is exactly what it says on the tin - a rating. It assumes consistent
                performance, and doesn't account for improvements or declines in performance over
                time. If a team fixes a bug in their code, or a mechanical issue, their OPR will not
                account for that. You still need to scout the good old-fashioned way if you want to
                do it right.
            </p>

            <h2>Common Questions</h2>

            <h4>How does negative OPR happen?</h4>
            <p>
                This is what happens when a team has a really good alliance partner, but together,
                they end up scoring really poorly. This can sometimes be the fault of the alliance
                partner's robot breaking down during a match.
            </p>

            <h4>What is Auto/Teleop/Endgame OPR?</h4>
            <p>
                Auto/Teleop/Endgame OPR is the same as normal OPR, but only for that specific
                period. This gives a more detailed picture of a team's strengths and weaknesses.
            </p>

            <h4>Do penalties affect OPR?</h4>
            <p>
                Most often on FTC<i>Scout</i>, penalties are not calculated in OPR, which is why you
                sometimes see it written as "npOPR" or "Total NP OPR". We do still make available a
                penalty-inclusive OPR, which you can view on the
                <a href="/records">Season Records</a> page by editing the displayed Statistics.
            </p>
            <div class="image-wrap">
                <img
                    class="statsimg"
                    src="/img/statsbutton.png"
                    alt="A screenshot of FTCScout's Season Records page, with an orange arrow pointing to the statistics button."
                />
            </div>
        </div></Card
    >
</WidthProvider>

<style>
    .head {
        background: var(--hover-color);
        border-radius: 8px;
        padding: var(--md-pad);
    }

    .rest {
        padding: var(--sm-pad);
    }

    h1 {
        font-size: var(--vl-font-size);
    }

    h2 {
        font-size: var(--lg-font-size);
        margin: var(--lg-gap) 0 var(--sm-gap) 0;
    }

    h3 {
        font-size: var(--md-font-size);
        margin: var(--md-gap) 0 var(--sm-gap) 0;
    }

    p {
        line-height: 1.75;
        margin: var(--md-gap) 0;
    }

    .image-wrap {
        width: 100%;
        display: flex;
        justify-content: center;
    }

    .statsimg {
        width: 60%;
    }

    img {
        border-radius: 8px;
    }
</style>
