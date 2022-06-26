<script lang="ts">
    import {
        fa0,
        type IconDefinition,
    } from "@fortawesome/free-solid-svg-icons";
    import Fa from "svelte-fa";

    export let icon: IconDefinition | null;

    $: actualIcon = icon ?? fa0;
    $: color = icon ? "var(--theme-color)" : "transparent";
</script>

<div class="info-icon">
    <Fa fw icon={actualIcon} size="1x" {color} />
    <span class="content">
        <slot />
    </span>
</div>

<style>
    .info-icon {
        display: flex;
        flex-direction: row;
        align-items: center;

        margin-bottom: var(--gap);
    }

    .info-icon .content {
        margin-left: var(--gap);
    }
</style>
