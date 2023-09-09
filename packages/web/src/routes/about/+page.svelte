<script lang="ts">
    import Card from "$lib/components/Card.svelte";
    import WidthProvider from "$lib/components/WidthProvider.svelte";
    import Contributor from "./Contributor.svelte";
    import { GITHUB } from "$lib/constants";
    import Head from "$lib/components/Head.svelte";
</script>

<Head
    title="About | FTCScout"
    description="About FTCScout, a way to track and scout FIRST Tech Challenge."
/>

<WidthProvider width={"1000px"}>
    <Card>
        <h1 class="head">About FTC<em>Scout</em></h1>

        <div class="rest">
            <p>
                FTC<i>Scout</i> is a repository of results and statistics on every aspect of FTC. View
                all a teams events, an event's matches, rankings and awards, the best results and matches
                for each season, and search for teams and events.
            </p>

            <p>
                FTC<i>Scout</i> is the passion project of a group of alumni from team
                <a href="/teams/16321">16321 X Drive</a>. It was inspired by many great FTC websites
                including
                <a href="https://theorangealliance.org/" target="_blank" rel="noreferrer">
                    The Orange Alliance</a
                >,
                <a href="https://ftcscores.com/" target="_blank" rel="noreferrer">FTCScores</a>,
                <a href="http://www.ftcstats.org/" target="_blank" rel="noreferrer">FTC Stats</a>,
                and
                <a href="https://ftc-events.firstinspires.org/" target="_blank" rel="noreferrer">
                    FTC Events
                </a>.
            </p>

            <h2>Why FTC<em>Scout</em>?</h2>

            <p>
                Although FTC<em>Scout</em> provides similar features to other websites we believe it
                has several advantages:
            </p>

            <h3>Feature-full</h3>

            <p>
                FTC<em>Scout</em> provides more advanced statistics than any other FTC website on
                the Internet. Although other websites offer some of the features of FTC<em
                    >Scout
                </em>
                we collect them all in the same place. Additionally FTC<em>Scout</em> offers features
                that no other websites do.
            </p>

            <p>
                The rankings page for each event provides statistics for each team for every aspect
                of the game in six categories: Total, Average, OPR, Min, Max, and Standard
                Deviation. For Freight Frenzy we tracked 191 statistics.
            </p>

            <p>
                As well as viewing these statistics for each team at an event you can also view the
                data for the whole season using our unparalleled <a href="/records"
                    >Season Records Page</a
                >. This page provides the same data as the event rankings page but for every event
                of the season. In addition you can use our highly capable filtering and sorting
                options to find even more information. For example here you can see the
                <a
                    href="http://localhost:5173/records/2022/teams?region=USCA&filter=and-team.eq.16321-&sort=autoPointsOpr"
                >
                    rankings of X Drive's Autonomous OPRs in California for the Power Play season.
                </a>
            </p>

            <p>
                Finally FTC<em>Scout</em> is designed to correctly handle remote events (both statistics
                and page layout).
            </p>

            <h3>Fast, Secure, and Accessible</h3>
            <p>
                We designed FTC<em>Scout</em> with performance, security, and accessability in mind.
                FTC<em>Scout</em>
                pages load fast and with all data at the same time instead of popping in slowly. As a
                result of optimizations, FTC<em> Scout </em>
                receives exceptional
                <a
                    href="https://en.wikipedia.org/wiki/Google_Lighthouse"
                    target="_blank"
                    rel="noreferrer"
                >
                    Google Lighthouse
                </a> scores and A+ security ratings from several auditors.
            </p>
            <div class="image-wrap">
                <img
                    src="/img/lighthouse.png"
                    alt="A screenshot of FTCScout's lighthouse scores showing 99% for Performance, 97% for Accessibility, 100% for Best Practices, and 100% for SEO."
                />
            </div>

            <h3>Beautiful</h3>
            <p>
                Lastly, although this is a matter of opinion, we believe FTC<em>Scout</em> is
                beautiful. We put a lot of effort into the design of FTC<em>Scout</em> and think that
                it looks sleek, modern, and is the best looking of the FTC websites.
            </p>

            <h2>Our Team</h2>
            <p>
                FTC<em>Scout</em> was developed by alumni from
                <a href="/teams/16321">16321 X Drive</a>, but it is FOSS (<a
                    href="https://en.wikipedia.org/wiki/Free_and_open-source_software"
                    target="_blank"
                    rel="noreferrer">Free and Open-Source Software</a
                >) so you can contribute to it
                <a href={GITHUB} target="_blank" rel="noreferrer">on our Github</a>.
            </p>
            <div class="contributors">
                <Contributor
                    name="Daniel James"
                    role="Programmer"
                    imgSrc="/img/daniel.jpeg"
                    alt="Daniel James' avatar: a pixel art drawing of a green and tan egg with black lines showing the egg breaking."
                    href="https://github.com/Dragon-Hatcher"
                />
                <Contributor
                    name="Jonah Reinis"
                    role="Programmer"
                    imgSrc="/img/jonah.png"
                    alt="A photo of Jonah Reinis."
                    href="https://github.com/Joncode9001"
                />
                <Contributor
                    name="Levi Gilbert-Adler"
                    role="Web Administrator"
                    imgSrc="/img/levi.png"
                    alt="A photo of Levi Gilbert-Adler"
                    href="https://github.com/9021007"
                />
            </div>
        </div>
    </Card>
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

    img {
        border-radius: 8px;
    }

    .contributors {
        display: flex;
        align-items: center;
        justify-content: space-evenly;
    }
</style>
