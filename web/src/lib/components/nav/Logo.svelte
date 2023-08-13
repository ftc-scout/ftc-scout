<script lang="ts">
    import { WEBSITE_LOGO } from "$lib/icons";
    import Fa from "svelte-fa";
</script>

<a href="/"><Fa icon={WEBSITE_LOGO} fw size="1.25x" translateX="-0.15" />FTC<em>Scout</em></a>

<style>
    a {
        display: block;
        padding: var(--padding);

        font-size: var(--h2-font-size);
        background-color: var(--theme-color);
        color: var(--theme-text-color);
        font-weight: bold;
        user-select: none;
    }

    a:hover {
        text-decoration: none;
    }

    @media (max-width: 1600px) {
        a {
            margin-left: calc(var(--navbar-size) * 0.75);
        }
    }
</style>
