<script>
    import Card from "$lib/components/Card.svelte";
    // import Head from "$lib/components/nav/Head.svelte";
    import WidthProvider from "$lib/components/WidthProvider.svelte";
    import Contributor from "./Contributor.svelte";
</script>

<!-- <Head title="About | FTCScout" description="About FTCScout, a way to track and scout FIRST Tech Challenge." /> -->

<WidthProvider width={"1000px"}>
    <Card>
        <h1>About FTC<em class="h1big-text">Scout</em></h1>

        <p>
            FTC<i>Scout</i> is a website that allows you to view teams, events, matches, and
            statistics for FTC in the vein of
            <a href="https://theorangealliance.org/" target="_blank" rel="noreferrer"
                >The Orange Alliance</a
            >.
        </p>

        <p>
            FTC<i>Scout</i> is the passion project of a group of programmers at team
            <a href="/teams/16321">16321 X Drive</a>. It was heavily inspired by the amazing
            websites like
            <a href="https://theorangealliance.org/" target="_blank" rel="noreferrer"
                >The Orange Alliance</a
            >,
            <a href="https://ftcscores.com/" target="_blank" rel="noreferrer">FTCScores</a>,
            <a href="http://www.ftcstats.org/" target="_blank" rel="noreferrer">FTC Stats</a>, and
            <a href="https://ftc-events.firstinspires.org/" target="_blank" rel="noreferrer"
                >FTC Events</a
            >.
        </p>

        <h2>Why FTC<em class="h2big-text">Scout</em>?</h2>

        <p>
            Although FTC<em>Scout</em> provides similar features to other websites we believe it has
            several advantages:
        </p>

        <h3>More Data</h3>
        <p>
            FTC<em>Scout</em> provides more advanced statistics than any other FTC website on the Internet.
        </p>

        <p>
            The rankings page for each event provides statistics for each team for every aspect of
            the game in six categories: Total, Average, OPR, Min, Max, and Standard Deviation. For
            Freight Frenzy we tracked 191 statistics.
        </p>

        <p>
            As well as viewing these statistics for each team at an event you can also view the data
            for the whole season using our unparalleled <a href="/records">Season Records Page</a>.
            This page provides the same data as the event rankings page but for every event of the
            season. In addition you can use our highly capable filtering and sorting options to find
            even more information. For example here you can see the
            <a
                href={`/records/2021/teams?region=California&filter=%7B"all"%3A%5B%7B"lhs"%3A"Team"%2C"op"%3A"%3D"%2C"rhs"%3A16321%7D%5D%7D&sort=Auto+Points+OPR`}
            >
                rankings of X Drive's Autonomous OPRs in California for the Freight Frenzy season.
            </a>
        </p>

        <p>
            Finally FTC<em>Scout</em> is designed to correctly handle remote events (both statistics
            and page layout).
        </p>

        <h3>Fast, Secure, and Accessible</h3>
        <p>
            We designed FTC<em>Scout</em> with performance, security, and accessability in mind. FTC<em
                >Scout</em
            >
            pages load fast and with all data at the same time instead of popping in slowly. As a result
            of optimizations, FTC<em> Scout </em>
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

        <h3>Beauty</h3>
        <p>
            Lastly, although this is a matter of opinion, we believe FTC<em>Scout</em> is beautiful.
            We put a lot of effort into the design of FTC<em>Scout</em> and think that it looks sleek,
            modern, and is the best looking of the FTC websites.
        </p>

        <h2>Our Team</h2>
        <p>
            FTC<em>Scout</em> was developed by programmers at
            <a href="/teams/16321">16321 X Drive</a>, but it is FOSS (<a
                href="https://en.wikipedia.org/wiki/Free_and_open-source_software"
                target="_blank"
                rel="noreferrer">Free and Open-Source Software</a
            >) so you can contribute to it
            <a href="https://github.com/16321-X-Drive/ftc-scout" target="_blank" rel="noreferrer"
                >on our Github</a
            >.
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
    </Card>
</WidthProvider>

<style>
    * {
        line-height: 2rem;
    }

    p,
    p * {
        font-size: 16px;
        margin-bottom: 0.75rem;
    }

    @media (max-width: 800px) {
        :not(h1, h2) {
            font-size: 14px;
        }
    }

    h1,
    h1 * {
        font-size: 32px;
        font-weight: bold;
    }

    h2,
    h2 * {
        font-size: 26px;
        font-weight: bold;
    }

    .image-wrap {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    img {
        max-width: 100%;
    }

    .contributors {
        display: flex;
        flex-direction: row;
        justify-content: center;
        gap: var(--xl-gap);

        max-width: 100%;
        flex-wrap: wrap;

        margin-bottom: var(--large-gap);
    }
</style>