<script lang="ts">
    import { DESCRIPTORS_LIST, type Season } from "@ftc-scout/common";
    import Select from "./Select.svelte";

    export let season: Season;
    export let nonForm = false;
    export let id: string | null = null;

    const i = (x: Season) => (seasonStr = "" + x);
    const o = (x: string) => (season = +x as Season);

    let seasonStr: string;

    $: i(season);
    $: o(seasonStr);
</script>

<Select
    bind:value={seasonStr}
    name={"season"}
    options={DESCRIPTORS_LIST.slice().reverse().map((d) => ({
        value: d.season + "",
        name: d.seasonNameWithYear,
    }))}
    {nonForm}
    {id}
    on:change
/>
