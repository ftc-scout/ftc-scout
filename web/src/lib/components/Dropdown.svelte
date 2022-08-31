<script lang="ts">
    export let items: string[];
    export let value: string | null = null;

    export let style = "";
</script>

<div {style}>
    <select bind:value>
        {#each items as item}
            <option>{item}</option>
        {/each}
    </select>
</div>

<style>
    div {
        background: var(--foreground-color);
        box-shadow: var(--shadow-color) 0px 2px 5px -1px, var(--shadow-color) 0px 1px 3px -1px;
        border-radius: 8px;
    }

    select {
        font: var(--main-font);

        background: var(--foreground-color);
        border: none;
        color: inherit;
        cursor: pointer;

        padding: var(--small-padding);
        border-radius: 8px;

        height: 100%;
        width: 100%;
    }

    select:hover {
        filter: brightness(0.95);
    }

    select:active {
        filter: brightness(0.9);
    }
</style>
