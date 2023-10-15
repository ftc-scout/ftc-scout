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

        <div class="row-label">Percentile</div>
        <div class="val" title="{prettyPrintOrdinal(stats.tot.rank)} in the world">
            {prettyPrintFloat(((stats.tot.rank - 1) / (stats.count - 1)) * 100)}%
        </div>
        <div class="val" title="{prettyPrintOrdinal(stats.auto.rank)} in the world">
            {prettyPrintFloat(((stats.auto.rank - 1) / (stats.count - 1)) * 100)}%
        </div>
        <div class="val" title="{prettyPrintOrdinal(stats.dc.rank)} in the world">
            {prettyPrintFloat(((stats.dc.rank - 1) / (stats.count - 1)) * 100)}%
        </div>
        <div class="val" title="{prettyPrintOrdinal(stats.eg.rank)} in the world">
            {prettyPrintFloat(((stats.eg.rank - 1) / (stats.count - 1)) * 100)}%
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
    }

    .row-label {
        text-align: left;
        font-weight: bold;

        white-space: nowrap;
        border-right: 1px solid var(--sep-color);
        padding-right: var(--vl-gap);
    }

    .first {
        padding-top: var(--md-gap);
    }

    .val {
        text-align: center;
    }
</style>
