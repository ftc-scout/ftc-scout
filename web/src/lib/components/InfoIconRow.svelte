<script lang="ts">
    import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
    import Fa from "svelte-fa";

    export let icon: IconDefinition;
</script>

<div class="info-icon">
    <Fa fw {icon} size="1x" color="var(--theme-color)" />
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
