<script lang="ts">
    import { prettyPrintFloat } from "../../../util/format/pretty-print-float";
    import { prettyPrintOrdinal } from "../../../util/format/pretty-print-ordinal";
    import type { Stat } from "../../../util/stats/Stat";
    import { StatDisplayType } from "../../../util/stats/stat-display-type";
    import type { StatData } from "../StatsTable.svelte";

    type T = $$Generic;

    export let data: StatData<T>;
    export let stat: Stat<T>;

    $: value = stat.read(data);
</script>

<!-- svelte-ignore empty-block -->
{#if value == null}{:else if typeof value == "string"}
    {value}
{:else if typeof value == "object" && "number" in value}
    {value.number}
{:else if typeof value == "object" && "name" in value}
    {value.name}
{:else if typeof value == "object" && "wins" in value && "losses" in value && "ties" in value}
    {value.wins}-{value.losses}-{value.ties}
{:else if stat.displayType == StatDisplayType.INTEGER}
    {value}
{:else if stat.displayType == StatDisplayType.DECIMAL}
    {prettyPrintFloat(value)}
{:else if stat.displayType == StatDisplayType.RANK}
    {prettyPrintOrdinal(value)}
{/if}
