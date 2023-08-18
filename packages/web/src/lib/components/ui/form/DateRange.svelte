<script lang="ts">
    import { DESCRIPTORS, type Season } from "@ftc-scout/common";
    import DateInput from "./DateInput.svelte";

    export let id: string | null = null;

    export let start: Date | null;
    export let end: Date | null;
    export let season: Season;

    $: min = DESCRIPTORS[season].firstDate;
    $: max = DESCRIPTORS[season].lastDate;
</script>

<div>
    <DateInput bind:date={start} {min} {max} id={id ? `start-${id}` : null} />
    to
    <DateInput bind:date={end} {min} {max} id={id ? `end-${id}` : null} />
</div>

<style>
    div {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--md-gap);

        width: 100%;
    }
</style>
