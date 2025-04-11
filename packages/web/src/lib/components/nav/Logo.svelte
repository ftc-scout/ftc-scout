<script lang="ts">
    // import { faBinoculars } from "@fortawesome/free-solid-svg-icons";
    import { faMagicWandSparkles } from "@fortawesome/free-solid-svg-icons";
    import Fa from "svelte-fa";
</script>

<a href="/">
    <!-- <Fa icon={faBinoculars} fw size="1.2x" translateX="-0.15" style="font-size: 24px" /> -->
    <Fa icon={faMagicWandSparkles} fw size="1.2x" translateX="-0.15" style="font-size: 24px" />
    <span> hive<em>scout</em> </span>
</a>

<style>
    a {
        display: flex;
        align-items: center;
        gap: var(--sm-gap);
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

    @media (max-width: 800px) {
        span {
            display: none;
        }
    }
</style>
