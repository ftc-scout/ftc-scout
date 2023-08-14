<script lang="ts">
    import type { IconDefinition as IconDefinition1 } from "@fortawesome/free-solid-svg-icons";
    import type { IconDefinition as IconDefinition2 } from "@fortawesome/free-brands-svg-icons";
    import Fa from "svelte-fa";

    export let icon: IconDefinition1 | IconDefinition2;
    export let name: string;
    export let link: string;
    export let newTab: boolean | null = null;
</script>

<a href={link} title={name} target={newTab ? "_blank" : null} rel={newTab ? "noreferrer" : null}>
    <Fa {icon} size="1.5x" />
</a>

<style>
    a {
        padding: var(--md-pad);
        border-radius: var(--pill-border-radius);
        color: var(--secondary-text-color);
        font-size: 16px;
    }

    a:hover {
        background: var(--hover-color);
        text-decoration: none;
    }
</style>
