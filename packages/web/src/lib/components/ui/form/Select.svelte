<script lang="ts">
    import { getContext } from "svelte";
    import { FORM_ID } from "./Form.svelte";

    export let options: { value: string; name: string }[];
    export let value: string;
    export let name: string | null = null;
    export let style = "";

    let form = getContext(FORM_ID) as string | null;
</script>

<select bind:value {form} {name} on:change {style}>
    {#each options as o}
        <option selected={value == o.value} value={o.value}>{o.name}</option>
    {/each}
</select>

<style>
    select {
        width: 100%;
    }
</style>
