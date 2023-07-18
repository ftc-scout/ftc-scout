<script lang="ts">
    import { fa0, type IconDefinition } from "@fortawesome/free-solid-svg-icons";
    import Fa from "svelte-fa";

    export let icon: IconDefinition | null = null;
    $: color = icon ? "var(--inline-theme-color)" : "transparent";
</script>

<div>
    <Fa fw icon={icon ?? fa0} size="1x" {color} />
    <span>
        <slot />
    </span>
</div>

<style>
    div {
        display: flex;
        flex-direction: row;
        align-items: center;
        flex: 1 0 auto;
        gap: var(--md-gap);
        margin-bottom: var(--md-gap);
    }

    div:last-child {
        margin-bottom: 0;
    }
</style>
