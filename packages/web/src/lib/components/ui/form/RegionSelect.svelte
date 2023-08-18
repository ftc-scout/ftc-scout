<script lang="ts">
    import type { RegionOption } from "@ftc-scout/common";
    import { getContext } from "svelte";
    import { FORM_ID } from "./Form.svelte";
    import { REGION_GROUPS, regionName } from "../../../util/regions";

    export let region: RegionOption;
    export let name: string | null = null;
    export let id: string | null = null;
    export let style = "";

    let form = getContext(FORM_ID) as string | null;
</script>

<select bind:value={region} {form} {name} {id} on:change {style}>
    {#each REGION_GROUPS as group}
        <optgroup>
            {#each group as r}
                <option selected={region == r} value={r}>{regionName(r)}</option>
            {/each}
        </optgroup>
    {/each}
</select>

<style>
    select {
        width: 100%;
    }
</style>
