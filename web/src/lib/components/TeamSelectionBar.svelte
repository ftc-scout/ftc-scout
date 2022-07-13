<script lang="ts">
    import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
    import Fa from "svelte-fa";
    import { prettyPrintFloat } from "../util/format/pretty-print-float";
    import { prettyPrintOrdinal } from "../util/format/pretty-print-ordinal";
    import { fly } from "svelte/transition";

    export let tep: {
        rank?: number | null;
        wins?: number | null;
        losses?: number | null;
        ties?: number | null;
        qualPoints?: number | null;
        opr?: number | null;
        qualAverage?: number | null;
        team: {
            number: number;
            name: string;
        };
    };

    $: team = tep.team;

    $: showWLT =
        typeof tep.wins == "number" &&
        typeof tep.losses == "number" &&
        typeof tep.ties == "number";
    $: showRp = typeof tep.qualPoints == "number";
    $: showOpr = typeof tep.opr == "number";
    $: showAvg = typeof tep.qualAverage == "number";

    $: rankDot = showWLT || showRp || showOpr || showAvg;
    $: wltDot = showRp || showOpr || showAvg;
    $: rpDot = showOpr || showAvg;
    $: oprDot = showAvg;
</script>

<a
    sveltekit:prefetch
    href={`/teams/${team.number}`}
    transition:fly={{ y: 100, duration: 300 }}
>
    <div class="top-row">
        <b> {team.number} - <em> {team.name} </em> </b>
        <span class="view-team"> View Team <Fa icon={faAngleRight} /> </span>
    </div>
    <div class="bottom-row">
        {#if typeof tep.rank == "number"}
            <b>{prettyPrintOrdinal(tep.rank)}</b> place
            {rankDot ? "·" : ""}
        {/if}
        {#if typeof tep.wins == "number" && typeof tep.losses == "number" && typeof tep.ties == "number"}
            W-L-T <b>{tep.wins}-{tep.losses}-{tep.ties}</b>
            {wltDot ? "·" : ""}
        {/if}
        {#if typeof tep.qualPoints == "number"}
            RP <b>{prettyPrintFloat(tep.qualPoints)}</b>
            {rpDot ? "·" : ""}
        {/if}
        {#if typeof tep.opr == "number"}
            OPR <b>{prettyPrintFloat(tep.opr)}</b>
            {oprDot ? "·" : ""}
        {/if}
        {#if typeof tep.qualAverage == "number"}
            AVG <b>{prettyPrintFloat(tep.qualAverage)}</b>
        {/if}
    </div>
</a>

<style>
    a {
        display: block;
        text-decoration: none;

        position: fixed;
        bottom: 0;
        margin: var(--gap);
        left: max(0px, calc(50% - 350px));
        right: max(0px, calc(50% + 350px));
        width: min(700px, calc(100% - var(--gap) * 2));

        background: var(--inverse-background-color);
        color: var(--inverse-text-color);

        font-size: var(--large-font-size);

        padding: var(--large-padding);

        border-radius: 5px;
    }

    .top-row {
        display: flex;
        justify-content: space-between;
        align-items: center;

        margin-bottom: var(--gap);
    }

    .bottom-row {
        font-size: var(--font-size);
        color: var(--inverse-secondary-text-color);
    }

    .view-team {
        font-size: var(--small-font-size);
    }
</style>
