<script lang="ts">
    import Card from "$lib/components/Card.svelte";
    import Head from "$lib/components/Head.svelte";
    import WidthProvider from "$lib/components/WidthProvider.svelte";
    import { CURRENT_SEASON, DESCRIPTORS } from "@ftc-scout/common";
</script>

<Head
    title="API | FTCScout"
    description="The developer API for FTCScout, providing access to all our statistics and data."
/>

<WidthProvider width="100ch">
    <Card>
        <h1 class="head">REST API</h1>

        <div class="rest">
            <p>
                The REST API can be queried at <a href="https://api.ftcscout.org/rest/v1">
                    api.ftcscout.org/rest/v1
                </a>. You do not need to add any additional headers. Please do not abuse the API or
                we may have to add rate limiting. If you need to make large volumes of queries, use
                the GraphQL API. The available routes are listed below.
            </p>

            <h2>General Notes</h2>

            <ul>
                <li>
                    Seasons are always given as a year number. For example
                    {DESCRIPTORS[CURRENT_SEASON].seasonName} would be {CURRENT_SEASON}.
                </li>
                <li>
                    <b>All query parameters are optional.</b> The shown value is the equivalent GraphQL
                    type.
                </li>
                <li>
                    Response code <code>400</code> is used for an invalid type for any variable.
                </li>
            </ul>

            <h2>Teams</h2>

            <section>
                <code class="route">/teams/<span class="var">:number</span></code>
                <p>Get a team by their number.</p>
                <p>Returns all scalar fields of the <code>Team</code> GraphQL type.</p>
                <p><code class="resp-code">404</code>s if the team does not exist.</p>
            </section>

            <section>
                <code class="route">
                    /teams/<span class="var">:number</span>/events/<span class="var">:season</span>
                </code>
                <p>Can be used to get all the team event participations for the given season.</p>
                <p>
                    Returns all scalar fields and the <code>stats</code> field of the
                    <code>TeamEventParticipation</code> GraphQL type.
                </p>
                <p>
                    Does <b>not</b> <code class="resp-code">404</code> if the team does not exist.
                </p>
            </section>

            <section>
                <code class="route">
                    /teams/<span class="var">:number</span>/awards?season=<span class="var"
                        >Int</span
                    >&ZeroWidthSpace;&eventCode=<span class="var">String</span>
                </code>
                <p>Gets a list of all the teams awards. Optionally specify the season or event.</p>
                <p>Returns all scalar fields of the <code>Award</code> GraphQL type.</p>
                <p>
                    Does <b>not</b> <code class="resp-code">404</code> if the team does not exist.
                </p>
            </section>

            <section>
                <code class="route">
                    /teams/<span class="var">:number</span>/matches?season=<span class="var"
                        >Int</span
                    >&ZeroWidthSpace;&eventCode=<span class="var">String</span>
                </code>
                <p>
                    Get all the matches a team has played optionally in a specific season or at a
                    specific event.
                </p>
                <p>
                    Returns all scalar fields of the <code>TeamMatchParticipation</code> GraphQL type.
                </p>
                <p><code class="resp-code">404</code>s if the team does not exist.</p>
            </section>

            <section>
                <code class="route">
                    /teams/<span class="var">:number</span>/quick-stats?season=<span class="var"
                        >Int</span
                    >&ZeroWidthSpace;{"&"}region=<span class="var">RegionOption</span>
                </code>
                <p>
                    Get the quick stats for a team in a specific season and region. If the season is
                    not specified defaults to the current season. If the region is not specified
                    defaults to the whole world.
                </p>
                <p>
                    Returns all fields of the <code>QuickStats</code> GraphQL type.
                </p>
                <p>
                    <code class="resp-code">404</code>s if the team does not exist or has no events
                    in the specified season.
                </p>
            </section>

            <section>
                <code class="route">
                    /teams/search?region=<span class="var">RegionOption</span
                    >&ZeroWidthSpace;&limit=<span class="var">Int</span
                    >&ZeroWidthSpace;&searchText=<span class="var">String</span>
                </code>
                <p>Get a list of teams. This is the correct query to get a list of all teams.</p>
                <p>Returns all scalar fields of the <code>Team</code> GraphQL type.</p>
            </section>

            <h2>Events</h2>

            <section>
                <code class="route">
                    /events/<span class="var">:season</span>/<span class="var">:code</span>
                </code>
                <p>Get an event with a certain code.</p>
                <p>
                    Returns all scalar fields of the <code>Event</code> GraphQL type except for
                    <code>hasMatches</code>.
                </p>
                <p><code class="resp-code">404</code>s if the event does not exist.</p>
            </section>

            <section>
                <code class="route">
                    /events/<span class="var">:season</span>/<span class="var">:code</span>/matches
                </code>
                <p>
                    Get all the matches, the scores of those matches, and the teams playing in the
                    matches.
                </p>
                <p>
                    Returns all scalar fields, the <code>scores</code> field, and the
                    <code>teams</code> field from the <code>Match</code> GraphQL type.
                </p>
                <p><code class="resp-code">404</code>s if the event does not exist.</p>
            </section>

            <section>
                <code class="route">
                    /events/<span class="var">:season</span>/<span class="var">:code</span>/awards
                </code>
                <p>Gets a list of all the awards from the event.</p>
                <p>Returns all scalar fields of the <code>Award</code> GraphQL type.</p>
                <p>
                    Does <b>not</b> <code class="resp-code">404</code> if the event does not exist.
                </p>
            </section>

            <section>
                <code class="route">
                    /events/<span class="var">:season</span>/<span class="var">:code</span>/teams
                </code>
                <p>Get all the team event participations for the event.</p>
                <p>
                    Returns all scalar fields and the <code>stats</code> field of the
                    <code>TeamEventParticipation</code> GraphQL type.
                </p>
                <p>
                    Does <b>not</b> <code class="resp-code">404</code> if the event does not exist.
                </p>
            </section>

            <section>
                <code class="route">
                    /events/search/<span class="var">:season</span>?region=<span class="var">RegionOption</span
                    >&ZeroWidthSpace;&type=<span class="var">EventType</span
                    >&ZeroWidthSpace;&hasMatches=<span class="var">Boolean</span
                    >&ZeroWidthSpace;&start=<span class="var">Date</span>&ZeroWidthSpace;&end=<span
                        class=":var">Date</span
                    >&ZeroWidthSpace;&limit=<span class="var">Int</span
                    >&ZeroWidthSpace;&searchText=<span class="var">String</span>
                </code>
                <p>Get a list of events. This is the correct query to get a list of all events.</p>
                <p>
                    Returns all scalar fields of the <code>Event</code> GraphQL type except for
                    <code>hasMatches</code>.
                </p>
            </section>
        </div>
    </Card>
</WidthProvider>

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

    ul {
        margin-left: var(--vl-gap);
    }

    p,
    ul,
    code {
        line-height: 1.75;
    }

    section {
        margin: var(--lg-gap) 0;
    }

    section p {
        padding: 0 var(--sm-pad);
    }

    code {
        background: var(--hover-color);
        padding: var(--sm-pad);
    }

    .route {
        display: block;
        padding-left: var(--lg-pad);
        border-radius: 4px;
    }

    .var {
        color: var(--neutral-team-text-color);
    }

    .resp-code {
        background: none;
        padding: 0;
    }
</style>
