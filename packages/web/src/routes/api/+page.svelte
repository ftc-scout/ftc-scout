<script lang="ts">
    import Card from "$lib/components/Card.svelte";
    import Head from "$lib/components/Head.svelte";
    import WidthProvider from "$lib/components/WidthProvider.svelte";
    import { DISCORD } from "$lib/constants";
</script>

<Head
    title="Api | FTCScout"
    description="The developer api for FTCScout providing access to all our statistics and data."
/>

<WidthProvider width="100ch">
    <Card>
        <h1 class="head">FTC<em>Scout</em> API</h1>

        <div class="rest">
            <p>
                The FTC<em>Scout</em> API provides access to all of the FTC<em>Scout</em>'s data and
                statistics.
            </p>
            <p>
                The API uses
                <a href="https://graphql.org/" target="_blank" rel="noreferrer">GraphQL</a>,
                allowing you to access as much or as little data as you need.
            </p>
            <p>
                You can query the API at
                <a href="https://api.ftcscout.org/graphql">api.ftcscout.org/graphql</a> or you can
                try the playground <span class="maybe-hide">below or</span> in a new tab by clicking
                <a href="https://api.ftcscout.org/graphql" target="_blank" rel="noreferrer">here</a
                >.
            </p>
            <p>
                If you need help with the API, feel free to ask for assistance on our <a
                    href={DISCORD}>Discord</a
                >.
            </p>
        </div>
    </Card>
</WidthProvider>

<div class="maybe-hide">
    <WidthProvider width="1600px">
        <Card>
            <iframe src="https://api.ftcscout.org/graphql" title="FTCScout API Playground" />
        </Card>
    </WidthProvider>
</div>

<style>
    .head {
        background: var(--hover-color);
        border-radius: 8px;
        padding: var(--md-pad);
        margin-bottom: var(--sm-gap);
    }

    .rest {
        padding: var(--sm-pad);
    }

    h1 {
        font-size: var(--vl-font-size);
    }

    p {
        line-height: 1.75;
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
