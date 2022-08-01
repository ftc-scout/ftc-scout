<script lang="ts">
    import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";

    import Fa from "svelte-fa";

    export let icon: IconDefinition;
    export let buttonStyle = "";
    export let iconColor = "";
    export let fw = false;
    export let disabled: string | null = null;
</script>

<button on:click style={buttonStyle} disabled={!!disabled} title={disabled ?? ""}>
    <Fa {icon} {fw} color={iconColor} />
    <slot />
</button>

<style>
    button {
        background: var(--foreground-color);
        border: none;
        color: inherit;
        cursor: pointer;

        padding: var(--padding);
        box-shadow: var(--shadow-color) 0px 2px 5px -1px, var(--shadow-color) 0px 1px 3px -1px;
        border-radius: 8px;
    }

    button:hover {
        filter: brightness(0.95);
    }

    button:active {
        filter: brightness(0.9);
    }

    button:disabled {
        filter: brightness(0.8);
        cursor: not-allowed;
    }
</style>
