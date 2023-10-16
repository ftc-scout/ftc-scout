<script lang="ts">
    import Card from "$lib/components/Card.svelte";
    import Head from "$lib/components/Head.svelte";
    import WidthProvider from "$lib/components/WidthProvider.svelte";
    import { DISCORD } from "$lib/constants";
</script>

<Head
    title="Api | FTCScout"
    description="The developer apis for FTCScout providing access to all our statistics and data."
/>

<WidthProvider width="100ch">
    <Card>
        <h1 class="head">FTC<em>Scout</em> APIs</h1>

        <div class="rest">
            <p>
                FTC<em>Scout</em> has two APIs for you to choose between: a fully featured GraphQL API
                and a simple to use REST API.
            </p>

            <p>
                If you ever need help with either API, feel free to ask for assistance on our <a
                    href={DISCORD}>Discord</a
                >.
            </p>

            <h2>GraphQL</h2>
            <p>
                The FTC<em>Scout</em> GraphQL API provides access to all of the FTC<em>Scout</em>'s
                data and statistics. It is used internally by the website.
            </p>
            <p>
                Because it uses
                <a href="https://graphql.org/" target="_blank" rel="noreferrer">GraphQL</a>, you can
                access as much or as little data as you need.
            </p>
            <p>
                You can query this API at
                <a href="https://api.ftcscout.org/graphql">api.ftcscout.org/graphql</a> or you can
                try the playground <span class="maybe-hide">below or</span> in a new tab by clicking
                <a href="https://api.ftcscout.org/graphql" target="_blank" rel="noreferrer">here</a
                >.
            </p>

            <h2>REST</h2>
            <p>
                The REST API is best used for simpler cases. It is not used internally and so
                doesn't provide all of our data. For example, you can't perform season record
                queries using it. However, if you just need team data, match data, or single event
                statistics, it provides an easy way to access those.
            </p>
            <p>
                Query the API at <a href="https://api.ftcscout.org/rest/v1"
                    >api.ftcscout.org/rest/v1</a
                >.
            </p>
            <p>You can view the full documentation for this API <a href="/api/rest">here</a>.</p>
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

    h2 {
        font-size: var(--lg-font-size);
        margin: var(--lg-gap) 0 var(--sm-gap) 0;
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
