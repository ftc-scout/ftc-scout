<script>
    import Card from "$lib/components/Card.svelte";
    import Head from "$lib/components/nav/Head.svelte";
    import WidthProvider from "$lib/components/WidthProvider.svelte";
</script>

<Head
    title="Api | FTCScout"
    description="The developer api for FTCScout providing access to all our statistics and data."
/>

<WidthProvider width="1600px">
    <Card>
        <h1>FTCScout Api</h1>

        <p>The FTCScout Api provides access to all of the FTCScout data and statistics.</p>
        <p>
            The FTCScout Api uses <a href="https://graphql.org/">GraphQL</a> allowing you to access as much or as little
            data as you need in the shape that is most available to you.
        </p>
        <p>
            The FTCScout Api can be queried at <a href="https://api.ftcscout.org/graphql">api.ftcscout.org/graphql</a>
            or you can try the playground at the same address <span class="maybe-hide">or right here on FTCScout</span>.
        </p>

        <iframe class="maybe-hide" src="https://api.ftcscout.org/graphql" title="FTCScout Api Playground" />
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
