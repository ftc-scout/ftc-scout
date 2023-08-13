<script>
    import Card from "$lib/components/Card.svelte";
    import Head from "$lib/components/nav/Head.svelte";
    import WidthProvider from "$lib/components/WidthProvider.svelte";
</script>

<Head
    title="API | FTCScout"
    description="The developer API for FTCScout providing access to all our statistics and data."
/>

<WidthProvider width="1600px">
    <Card>
        <h1>FTC<em>Scout</em> API</h1>

        <p>The FTC<em>Scout</em> API provides access to all of the FTC<em>Scout</em>'s data and statistics.</p>
        <p>
            The FTC<em>Scout</em> API uses <a href="https://graphql.org/">GraphQL</a> allowing you to access as much or as
            little data as you need in the shape that is most convenient to you.
        </p>
        <p>
            The FTC<em>Scout</em> API can be queried at
            <a href="https://api.ftcscout.org/graphql">api.ftcscout.org/graphql</a>
            or you can try the playground at the same address
            <span class="maybe-hide"> or right here on FTC<em>Scout</em></span>.
        </p>

        <iframe class="maybe-hide" src="https://api.ftcscout.org/graphql" title="FTCScout API Playground" />
    </Card>
</WidthProvider>

<style>
    * {
        line-height: 1.5rem;
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

        margin: auto;
    }

    @media (max-width: 1000px) {
        .maybe-hide {
            display: none;
        }
    }
</style>
