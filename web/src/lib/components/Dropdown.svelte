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

        padding: var(--small-padding);
    }

    select {
        font: var(--main-font);

        background: var(--foreground-color);
        border: none;
        color: inherit;
        cursor: pointer;

        border-radius: 8px;

        height: 100%;
        width: 100%;
    }

    div:hover {
        filter: brightness(0.95);
    }

    div:active {
        filter: brightness(0.9);
    }

    select:focus,
    select:focus-visible {
        outline: none;
    }

    div:focus,
    div:focus-within {
        outline: var(--text-color) 2px solid;
    }
</style>
