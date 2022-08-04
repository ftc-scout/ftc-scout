<script lang="ts">
    import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
    import Fa from "svelte-fa";
    import { prettyPrintFloat } from "../util/format/pretty-print-float";
    import { prettyPrintOrdinal } from "../util/format/pretty-print-ordinal";
    import { fly } from "svelte/transition";
    import { prefetch } from "$app/navigation";

    export let tep: {
        rank: number;
        rp: number;
        wins?: number;
        losses?: number;
        ties?: number;
        opr?: {
            totalPoints: number;
        };
        average: {
            totalPoints: number;
        };
    } | null;
    export let number: number;
    export let name: string;
    export let eventCode: string | null = null;

    $: url = eventCode ? `/teams/${number}#${eventCode}` : `/teams/${number}`;
    $: prefetch(url);

    $: showWLT = typeof tep?.wins == "number" && typeof tep?.losses == "number" && typeof tep?.ties == "number";
    $: showRp = typeof tep?.rp == "number";
    $: showOpr = typeof tep?.opr == "number";
    $: showAvg = typeof tep?.average?.totalPoints == "number";

    $: rankDot = showWLT || showRp || showOpr || showAvg;
    $: wltDot = showRp || showOpr || showAvg;
    $: rpDot = showOpr || showAvg;
    $: oprDot = showAvg;
</script>

<a sveltekit:prefetch href={url} transition:fly|local={{ y: 100, duration: 300 }}>
    <div class="top-row">
        <b> {number} - <em> {name} </em> </b>
        <span class="view-team"> View Team <Fa icon={faAngleRight} /> </span>
    </div>

    {#if tep && (showWLT || showRp || showOpr || showAvg)}
        <div class="bottom-row">
            {#if typeof tep.rank == "number"}
                <b>{prettyPrintOrdinal(tep.rank)}</b> place
                {rankDot ? "·" : ""}
            {/if}
            {#if typeof tep.wins == "number" && typeof tep.losses == "number" && typeof tep.ties == "number"}
                <b>{tep.wins}-{tep.losses}-{tep.ties}</b> W-L-T
                {wltDot ? "·" : ""}
            {/if}
            {#if typeof tep.rp == "number"}
                <b>{tep.rp}</b> RP
                {rpDot ? "·" : ""}
            {/if}
            {#if typeof tep.opr == "number"}
                <b>{prettyPrintFloat(tep.opr)}</b> OPR
                {oprDot ? "·" : ""}
            {/if}
            {#if typeof tep.average.totalPoints == "number"}
                <b>{prettyPrintFloat(tep.average.totalPoints)}</b> AVG
            {/if}
        </div>
    {/if}
</a>

<style>
    a {
        display: block;
        text-decoration: none;

        position: fixed;
        bottom: 0;
        margin: var(--gap);
        left: max(0px, calc(50% + var(--sidebar-size) / 2 - 350px));
        right: max(0px, calc(50% + var(--sidebar-size) / 2 + 350px));
        width: min(700px, calc(100% - var(--gap) * 2 - var(--sidebar-size)));

        background: var(--inverse-background-color);
        color: var(--inverse-text-color);

        font-size: var(--large-font-size);

        padding: var(--large-padding);

        border-radius: 5px;

        z-index: 5;
    }

    @media (max-width: 1600px) {
        a {
            left: max(0px, calc(50% - 350px));
            right: max(0px, calc(50% + 350px));
            width: min(700px, calc(100% - var(--gap) * 2));
        }
    }

    .top-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .bottom-row {
        margin-top: var(--gap);

        font-size: var(--font-size);
        color: var(--inverse-secondary-text-color);
    }

    .view-team {
        font-size: var(--small-font-size);
    }
</style>
