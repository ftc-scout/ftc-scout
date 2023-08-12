<script lang="ts">
    import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
    import Fa from "svelte-fa";

    export let icon: IconDefinition | null = null;
    export let style = "";
    export let fw = false;
    export let disabled: string | null = null;
</script>

<button on:click {style} disabled={!!disabled} title={disabled}>
    <Fa {icon} {fw} />
    <slot />
</button>

<style>
    button {
        font-size: inherit;
        color: inherit;

        background: var(--form-bg-color);

        padding: var(--md-pad) calc(var(--md-pad) * 2);

        border: none;
        border: 1px solid var(--sep-color);
        border-radius: var(--pill-border-radius);

        cursor: pointer;
    }

    button:hover {
        background: var(--form-hover-bg-color);
    }

    button:active {
        background: var(--form-click-bg-color);
    }

    button:disabled {
        background: var(--form-disabled-bg-color);
        cursor: not-allowed;
    }
</style>
