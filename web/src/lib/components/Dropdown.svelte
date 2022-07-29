<script lang="ts">
    export let items: string[];
    export let value: string | null = null;

    export let style = "";
</script>

<select {style} bind:value>
    {#each items as item}
        <option>{item}</option>
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
