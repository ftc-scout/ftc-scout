<script lang="ts">
    import { DESCRIPTORS, type Season } from "@ftc-scout/common";
    import Card from "../../../lib/components/Card.svelte";
    import type { TeamQuery } from "../../../lib/graphql/generated/graphql-operations";
    import { prettyPrintFloat, prettyPrintOrdinal } from "../../../lib/printers/number";

    export let stats: NonNullable<NonNullable<TeamQuery["teamByNumber"]>["quickStats"]>;
    export let season: Season;
    $: np = DESCRIPTORS[season].pensSubtract ? "" : "NP";
</script>

<Card>
    <h2 id="quick-stats">Quick Stats</h2>
    <hr />

    <div class="table">
        <div class="header row-label" />
        <div class="header">Total {np}</div>
        <div class="header">Auto</div>
        <div class="header">Teleop</div>
        <div class="header">Endgame</div>

        <div class="row-label first">Best OPR</div>
        <div class="val first">{prettyPrintFloat(stats.tot.value)}</div>
        <div class="val first">{prettyPrintFloat(stats.auto.value)}</div>
        <div class="val first">{prettyPrintFloat(stats.dc.value)}</div>
        <div class="val first">{prettyPrintFloat(stats.eg.value)}</div>

        <div class="row-label thin">World Rank</div>
        <div class="val thin">{prettyPrintOrdinal(stats.tot.rank)}</div>
        <div class="val thin">{prettyPrintOrdinal(stats.auto.rank)}</div>
        <div class="val thin">{prettyPrintOrdinal(stats.dc.rank)}</div>
        <div class="val thin">{prettyPrintOrdinal(stats.eg.rank)}</div>

        <div class="row-label thin">Percentile</div>
        <div class="val thin">
            {prettyPrintFloat((1 - (stats.tot.rank - 1) / (stats.count - 1)) * 100)}%
        </div>
        <div class="val thin">
            {prettyPrintFloat((1 - (stats.auto.rank - 1) / (stats.count - 1)) * 100)}%
        </div>
        <div class="val thin">
            {prettyPrintFloat((1 - (stats.dc.rank - 1) / (stats.count - 1)) * 100)}%
        </div>
        <div class="val thin">
            {prettyPrintFloat((1 - (stats.eg.rank - 1) / (stats.count - 1)) * 100)}%
        </div>

        <div class="row-label thick">Rank / Percentile</div>
        <div class="val thick">
            {prettyPrintOrdinal(stats.tot.rank)} /
            {prettyPrintFloat((1 - (stats.tot.rank - 1) / (stats.count - 1)) * 100)}%
        </div>
        <div class="val thick">
            {prettyPrintOrdinal(stats.auto.rank)} /
            {prettyPrintFloat((1 - (stats.auto.rank - 1) / (stats.count - 1)) * 100)}%
        </div>
        <div class="val thick">
            {prettyPrintOrdinal(stats.dc.rank)} /
            {prettyPrintFloat((1 - (stats.dc.rank - 1) / (stats.count - 1)) * 100)}%
        </div>
        <div class="val thick">
            {prettyPrintOrdinal(stats.eg.rank)} /
            {prettyPrintFloat((1 - (stats.eg.rank - 1) / (stats.count - 1)) * 100)}%
        </div>
    </div>
</Card>

<style>
    h2 {
        font-size: var(--lg-font-size);
        margin-bottom: var(--md-gap);
    }

    hr {
        margin-bottom: var(--md-gap);
    }

    .table {
        width: 100%;
        display: grid;
        grid-template-columns: auto repeat(4, 1fr);
    }

    .table * {
        padding: var(--sm-pad);
    }

    .header {
        text-align: center;
        font-weight: bold;

        border-bottom: 1px solid var(--sep-color);
        white-space: nowrap;
    }

    .row-label {
        text-align: left;
        font-weight: bold;
        border-right: 1px solid var(--sep-color);
        padding-right: var(--vl-gap);
    }

    .thin {
        display: none;
    }

    @media (max-width: 700px) {
        .thin {
            display: block;
        }

        .thick {
            display: none;
        }
    }

    .first {
        padding-top: var(--md-gap);
    }

    .val {
        text-align: center;
    }
</style>
