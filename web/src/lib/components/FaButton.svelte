<script lang="ts">
    import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";

    import Fa from "svelte-fa";

    export let icon: IconDefinition;

    export let buttonStyle = "";
</script>

<button on:click style={buttonStyle}>
    <Fa {icon} />
    <slot />
</button>

<style>
    button {
        background: none;
        border: none;
        color: inherit;
        cursor: pointer;
    }
</style>
