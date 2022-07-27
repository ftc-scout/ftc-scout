<script lang="ts">
    import { prettyPrintFloat } from "../../../util/format/pretty-print-float";
    import { prettyPrintOrdinal } from "../../../util/format/pretty-print-ordinal";

    import type { Stat } from "../../../util/stats/Stat";
    import { StatDisplayType } from "../../../util/stats/stat-display-type";

    type T = $$Generic;

    export let data: T;
    export let stat: Stat<T>;

    $: value = stat.read(data);
</script>

{#if typeof value == "object"}
    {value.number}
{:else if stat.displayType == StatDisplayType.INTEGER}
    {value}
{:else if stat.displayType == StatDisplayType.DECIMAL}
    {prettyPrintFloat(value)}
{:else if stat.displayType == StatDisplayType.RANK}
    {prettyPrintOrdinal(value)}
{/if}
