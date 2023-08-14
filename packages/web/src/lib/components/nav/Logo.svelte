<script lang="ts">
    import { faBinoculars } from "@fortawesome/free-solid-svg-icons";
    import Fa from "svelte-fa";
</script>

<a href="/"><Fa icon={faBinoculars} fw size="1.25x" translateX="-0.15" />FTC<em>Scout</em></a>

<style>
    a {
        display: block;
        padding: var(--md-pad);
        font-size: var(--vl-font-size);
        background-color: var(--theme-color);
        color: var(--theme-text-color);
        font-weight: bold;
        user-select: none;
    }

    a:hover {
        text-decoration: none;
    }
</style>
