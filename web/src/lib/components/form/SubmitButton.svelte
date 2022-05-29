<script lang="ts">
    import { getContext } from "svelte";
    import type { Readable } from "svelte/store";

    export let text = "Submit";

    let canSubmit: Readable<boolean> = getContext("form-can-submit");
</script>

<input type="submit" disabled={!$canSubmit} value={text} />

<style>
    input {
        font-family: inherit;
        font-size: inherit;
        font-weight: 600;

        padding-inline-start: 1rem;
        padding-inline-end: 1rem;
        height: 2.5rem;

        color: white;

        background: var(--theme-color);

        border-radius: 0.375rem;
        border: 1px solid var(--theme-color);

        cursor: pointer;
    }

    input[disabled] {
        opacity: 0.4;
        cursor: not-allowed;
    }
</style>
