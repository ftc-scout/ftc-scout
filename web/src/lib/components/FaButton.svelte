<script lang="ts">
    import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";

    import Fa from "svelte-fa";

    export let icon: IconDefinition;
</script>

<button on:click>
    <Fa {icon} />
</button>

<style>
    button {
        background: none;
        border: none;
        color: inherit;
        cursor: pointer;
    }
</style>
