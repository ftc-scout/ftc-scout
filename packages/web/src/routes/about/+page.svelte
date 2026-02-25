<script lang="ts">
    import Card from "$lib/components/Card.svelte";
    import WidthProvider from "$lib/components/WidthProvider.svelte";
    // import Contributor from "./Contributor.svelte";
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
                FTC<em>Scout</em> was developed by alumni from
                <a href="/teams/16321">16321 X Drive</a>, and it is FOSS (<a
                    href="https://en.wikipedia.org/wiki/Free_and_open-source_software"
                    target="_blank"
                    rel="noreferrer">Free and Open-Source Software</a
                >), so you can contribute your ideas and improvements to it
                <a href={GITHUB} target="_blank" rel="noreferrer">on our Github</a>.
            </p>
            <p>
                We also have <b>501(c)(3) non-profit status</b>, so if you find FTC<em>Scout</em>
                useful, or just like tax deductions,
                <a href="https://donate.ftcscout.org" target="_blank">please consider donating</a>.
                Our finances are
                <a href="https://ledger.ftcscout.org" target="_blank">entirely transparent</a>, so
                you can see purchases appear in the public transaction log the moment they happen.
            </p>

            <h2 class="head">Features</h2>

            <div class="feature-container">
                <div>
                    <h2>Powerful Filtering</h2>
                    <p>
                        Use almost any filter you can dream of with our advanced filtering system.
                        You can nest filters inside one another, and choose from a wide variety of
                        filter categories.
                    </p>
                </div>
                <img
                    src="/img/filter_example.jpg"
                    alt="A screenshot of FTCScout's filtering system, showing a filter for teams that have caused less then 2 penalty points, and have either an OPR above or equal to 55, or an Auto average above or equal to 30."
                />
            </div>
            <div class="feature-container revsort">
                <div>
                    <h2>Advanced Statistics</h2>
                    <p>
                        You can find and sort by almost any metric you like. The number of times a
                        team has been in a tie? Sure. The standard deviation of their Endgame
                        points? Absolutely. FTC<em>Scout</em> provides more statistics than any other
                        FTC score tracker, so you can focus less on stats, and more on scouting.
                    </p>
                </div>
                <img
                    src="/img/stats_example.jpg"
                    alt="A screenshot of FTCScout's statistics config menu, showing the various stats available to view."
                />
            </div>
            <div class="feature-container">
                <div>
                    <h2>Extensive APIs</h2>
                    <p>
                        If our existing features aren't enough for you, our API lets you do whatever
                        you like! The GraphQL API provides access to recursive queries, in-depth
                        information, and complete access to just about all of our data. Plus, it has
                        no authentication, so you can get started right away. View more info on the <a
                            href="/api"
                            target="_blank">API page</a
                        >, or try the query in the image
                        <a
                            href="https://studio.apollographql.com/sandbox/explorer?endpoint=https%3A%2F%2Fapi.ftcscout.org%2Fgraphql&explorerURLState=N4IgJg9gxgrgtgUwHYBcQC4QEcYIE4CeABMADpJFEoICGcAQgQHLwBG%2BAFEm-ukQIwA2AMwAmfgEoS5SpSR0EAGhmyAzgAcISVRDyrlFWQgBuyFKo6raOpH1EAGUaKllDsoibPS37ovMQq7gC%2BgbI0AO40eGCq3r6yKATqSqHu6gA2NFAIiKipRCE%2BhZSFhSBBQA"
                            target="_blank">here</a
                        >. We also have a simpler REST API, which provides easy access to basic data
                        and stats.
                    </p>
                </div>
                <img
                    src="/img/api_example.jpg"
                    alt="A screenshot of a GraphQL query in the GraphiQL interface, showing a query for events and awards of team 16321 in 2022"
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

    .feature-container {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        gap: var(--md-gap);
        margin: var(--md-gap) 0;
        border-radius: 8px;
        padding: var(--md-pad);
        align-items: center;
    }

    .feature-container.revsort {
        flex-direction: row-reverse;
    }

    .feature-container > img {
        border: 3px solid var(--text-color);
        max-width: 50%;
    }

    .feature-container > div {
        padding: var(--md-pad);
        width: 50%;
    }

    .feature-container > div > h2 {
        margin: 0;
    }

    @media screen and (orientation: portrait) {
        .feature-container {
            flex-direction: column-reverse;
            background-color: var(--hover-color);
        }

        .feature-container.revsort {
            flex-direction: column-reverse;
        }

        .feature-container > img {
            max-width: 100%;
        }

        .feature-container > div {
            width: 100%;
        }
        .feature-container > div > p {
            margin-bottom: 0;
        }
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
        margin: var(--md-gap) 0;
    }

    img {
        border-radius: 8px;
    }
</style>
