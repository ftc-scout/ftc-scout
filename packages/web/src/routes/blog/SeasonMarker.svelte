<script lang="ts">
    import Card from "$lib/components/Card.svelte";
    import { DESCRIPTORS, type Season } from "@ftc-scout/common";

    export let season: Season;
</script>

<!-- From https://www.labnol.org/code/20084-hr-center-text  -->
<Card vis={false}>
    <hr data-content="❖ {season} - {DESCRIPTORS[season].seasonName} ❖" />
</Card>

<style>
    hr {
        display: block;

        line-height: 1em;
        position: relative;
        outline: 0;
        border: 0;
        text-align: center;
        height: 1.5em;
        opacity: 0.75;
        font-size: calc(var(--md-font-size) * 1.25);

        margin: var(--vl-gap) 0;
    }

    hr:before {
        content: "";
        background: linear-gradient(to right, transparent, var(--text-color), transparent);
        position: absolute;
        left: 0;
        top: 50%;
        width: 100%;
        height: 3px;
    }
    hr:after {
        content: attr(data-content);
        position: relative;
        display: inline-block;

        padding: 0 0.5em;
        line-height: 1.5em;
        color: var(--text-color);
        background-color: var(--bg-color);
    }
</style>
