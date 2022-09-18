<script>
    import Card from "$lib/components/Card.svelte";
    import Head from "$lib/components/nav/Head.svelte";
    import WidthProvider from "$lib/components/WidthProvider.svelte";
    import Contributor from "./Contributor.svelte";
</script>

<Head title="About | FTCScout" description="About FTCScout, a new way to track and scout FIRST Tech Challenge." />

<WidthProvider width={"1000px"}>
    <Card>
        <h1>About FTCScout</h1>

        <p>
            FTCScout is a new website that allows you to view teams, events, matches, and statistics for FTC in the vain
            of the <a href="https://theorangealliance.org/">The Orange Alliance</a>.
        </p>

        <p>
            FTCScout is the passion project of a group of programmers at team <a href="/teams/16321">16321 X Drive</a>.
            It was heavily inspired by the amazing websites
            <a href="https://theorangealliance.org/">The Orange Alliance</a>,
            <a href="https://ftcscores.com/">FTCScores</a>, <a href="http://www.ftcstats.org/">FTC Stats</a>, and
            <a href="https://ftc-events.firstinspires.org/">FTC Events</a>.
        </p>

        <h2>Why FTCScout?</h2>

        <p>Although FTCScout provides similar features to other websites we believe it has several advantages:</p>

        <h3>More Data</h3>
        <p>FTCScout provides more and more advanced statistics than any other website on the internet.</p>

        <p>
            The rankings page for each event provides advanced statistics for each team for every aspect of the game in
            six categories: Total, Average, OPR, Min, Max, and Standard Deviation. For Freight Frenzy we tracked 191
            statistics.
        </p>

        <p>
            As well as viewing these statistics for each team at an event you can also view this data for the whole
            season using our highly advanced <a href="/records">Season Records Page</a>. This page provides the same
            data as the event rankings page but for every event of the season. In addition you can use our advanced
            filtering and sorting options to find even more information. For example here you can see the
            <a
                sveltekit:prefetch
                href={`/records/2021/teams?region=California&filter=%7B"all"%3A%5B%7B"lhs"%3A"Team"%2C"op"%3A"%3D"%2C"rhs"%3A16321%7D%5D%7D&sort=Auto+Points+OPR`}
            >
                rankings of our Autonomous OPR in California for the Freight Frenzy season.
            </a>
        </p>

        <p>
            Finally FTCScout is designed to correctly handle remote events (both statistics and page layout) something
            that other websites struggle with.
        </p>

        <h3>Fast, Secure, and Accessible</h3>
        <p>
            We designed FTCScout with performance, security, and accessability in mind. FTCScout pages load fast and
            with all data at the same time instead of popping in slowly like on some other websites. Because of these
            optimizations FTCScout receives near perfect <a href="https://en.wikipedia.org/wiki/Google_Lighthouse">
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
            Lastly, although this is a matter of opinion, we believe FTCScout is beautiful. We put a lot of effort into
            the design of FTCScout and think that it looks sleek, modern, and the best looking of the FTC websites.
        </p>

        <h2>Our Team</h2>
        <p>
            FTCScout was developed by programmers at <a href="/teams/16321">16321 X Drive</a> however it is FOSS and you
            can contribute to it right now <a href="https://github.com/16321-X-Drive/ftc-scout">on our Github</a>.
        </p>
        <div class="contributors">
            <Contributor
                name="Daniel James"
                role="Programmer"
                imgSrc="/img/daniel.png"
                alt="Daniel James' avatar: a pixel art drawing of a green and tan egg with black lines showing the egg breaking."
                href="https://github.com/Dragon-Hatcher"
            />
            <Contributor
                name="Jonah Reinis"
                role="Programmer"
                imgSrc="/img/jonah.png"
                alt="Jonah Reinis' avatar: A sepia photo of a man in a suit."
                href="https://github.com/Joncode9001"
            />
            <Contributor
                name="Levi Gilbert-Adler"
                role="Web Admin"
                imgSrc="/img/levi.png"
                alt="Levi Gilbert-Adler's avatar: A cartoon drawing of a computer chip on a green background."
                href="https://github.com/Bobrobot1"
            />
        </div>
    </Card>
</WidthProvider>

<style>
    * {
        line-height: 1.5rem;
    }

    :not(h1, h2) {
        font-size: 16px;
    }

    @media (max-width: 800px) {
        :not(h1, h2) {
            font-size: 14px;
        }
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
        gap: var(--xl-gap);
    }
</style>
