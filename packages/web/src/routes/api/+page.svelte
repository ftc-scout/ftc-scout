<script>
    import Card from "$lib/components/Card.svelte";
    // import Head from "$lib/components/nav/Head.svelte";
    import WidthProvider from "$lib/components/WidthProvider.svelte";
</script>

<!-- <Head
    title="API | FTCScout"
    description="The developer API for FTCScout providing access to all our statistics and data."
/> -->

<WidthProvider width="1600px">
    <Card>
        <h1>FTC<em>Scout</em> API</h1>

        <p>
            The FTC<em>Scout</em> API provides access to all of the FTC<em>Scout</em>'s data and
            statistics.
        </p>
        <p>
            The FTC<em>Scout</em> API uses
            <a href="https://graphql.org/" target="_blank" rel="noreferrer">GraphQL</a> allowing you
            to access as much or as little data as you need in the shape that is most convenient to you.
        </p>
        <p>
            The FTC<em>Scout</em> API can be queried at
            <a href="https://api.ftcscout.org/graphql">api.ftcscout.org/graphql</a>. You can
            experiment using the playground below, or open the playground in a new tab by clicking
            <a href="https://api.ftcscout.org/graphql" target="_blank" rel="noreferrer">here</a>.
        </p>

        <iframe
            class="maybe-hide"
            src="https://api.ftcscout.org/graphql"
            title="FTCScout API Playground"
        />
    </Card>
</WidthProvider>

<style>
    * {
        line-height: 2.25rem;
    }

    p,
    p * {
        font-size: 16px;
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

    iframe {
        width: 100%;
        max-width: 1600px;
        height: 70vh;
        background-color: rgb(23, 43, 58);

        margin: auto;
    }

    @media (max-width: 1000px) {
        .maybe-hide {
            display: none;
        }
    }
</style>
