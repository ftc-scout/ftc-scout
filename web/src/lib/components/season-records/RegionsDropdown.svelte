<script lang="ts">
    import { REGION_GROUPS } from "$lib/util/regions";

    export let value: string = "All";

    export let style = "";
</script>

<select {style} bind:value>
    {#each REGION_GROUPS as group}
        <optgroup>
            {#each group as region}
                <option>{region}</option>
            {/each}
        </optgroup>
    {/each}
</select>

<style>
    select {
        font: var(--main-font);

        background: var(--foreground-color);
        border: none;
        color: inherit;
        cursor: pointer;

        padding: var(--small-padding);
        box-shadow: var(--shadow-color) 0px 2px 5px -1px, var(--shadow-color) 0px 1px 3px -1px;
        border-radius: 8px;
    }

    select:hover {
        filter: brightness(0.95);
    }

    select:active {
        filter: brightness(0.9);
    }
</style>
