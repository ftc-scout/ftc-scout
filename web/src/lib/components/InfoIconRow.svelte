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
    <Fa fw icon={actualIcon} size="1x" {color} style={"min-width:1.25em"} />
    <span class="content">
        <slot />
    </span>
</div>

<style>
    .info-icon {
        display: flex;
        flex-direction: row;
        align-items: center;
        flex: 1 0 auto;
        /* flex-shrink: 0; */

        margin-bottom: var(--gap);
    }

    .info-icon .content {
        margin-left: var(--gap);
    }
</style>
