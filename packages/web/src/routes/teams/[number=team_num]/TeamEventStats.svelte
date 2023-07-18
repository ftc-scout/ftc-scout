<script lang="ts">
    import { faTrophy } from "@fortawesome/free-solid-svg-icons";
    import InfoIconRow from "$lib/components/InfoIconRow.svelte";
    import type { TeamQuery } from "$lib/graphql/generated/graphql-operations";
    import { prettyPrintFloat, prettyPrintInt, prettyPrintOrdinal } from "$lib/printers/number";
    import { DESCRIPTORS, type Season } from "@ftc-scout/common";

    type Stats = NonNullable<TeamQuery["teamByNumber"]>["events"][number]["stats"];

    export let season: Season;
    export let remote: boolean;
    export let stats: Stats | undefined;

    $: rpFormat = DESCRIPTORS[season].rankings.rp == "Record" ? prettyPrintFloat : prettyPrintInt;
    $: hasOpr = stats && "opr" in stats;
    $: hasAvg = stats && "avg" in stats;
    $: np = DESCRIPTORS[season].penaltiesSubtract || remote ? "" : "np";
</script>

{#if stats}
    <InfoIconRow icon={faTrophy}>
        <b>{prettyPrintOrdinal(stats.rank)}</b> place (quals)
    </InfoIconRow>

    {#if "wins" in stats}
        <InfoIconRow>
            W-L-T: <b>{stats.wins}-{stats.losses}-{stats.ties}</b>
        </InfoIconRow>
    {/if}

    <InfoIconRow>
        {#if "rp" in stats}
            <b>{rpFormat(stats.rp)}</b> RP {hasOpr || hasAvg ? " · " : ""}
        {/if}
        {#if "opr" in stats}
            <b>{prettyPrintFloat(stats.opr.totalPointsNp)}</b> {np}OPR {hasAvg ? " · " : ""}
        {/if}
        {#if "avg" in stats}
            <b>{prettyPrintFloat(stats.avg.totalPointsNp)}</b> {np}AVG
        {/if}
    </InfoIconRow>
{/if}
