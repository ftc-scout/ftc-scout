<script lang="ts">
    import { dateFromStr, dateToStr } from "../../../util/date";

    export let date: Date | null;
    export let id: string | null = null;
    export let name: string | null = null;

    const i = (x: Date | null) => (dateStr = x ? dateToStr(x) : null);
    const o = (x: string | null) => (date = x ? dateFromStr(x) : null);

    let dateStr: string | null;

    $: i(date);
    $: o(dateStr);

    export let min: Date;
    export let max: Date;

    $: minStr = dateToStr(min);
    $: maxStr = dateToStr(max);
</script>

<input type="date" {id} {name} min={minStr} max={maxStr} bind:value={dateStr} on:change />

<style>
    input {
        flex-grow: 1;
    }
</style>
