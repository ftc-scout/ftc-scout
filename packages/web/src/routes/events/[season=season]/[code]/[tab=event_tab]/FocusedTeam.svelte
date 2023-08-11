<script lang="ts">
    import { CURRENT_SEASON, DESCRIPTORS, Season } from "@ftc-scout/common";
    import type { EventPageQuery } from "$lib/graphql/generated/graphql-operations";
    import Fa from "svelte-fa";
    import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
    import { preloadData } from "$app/navigation";
    import { fly } from "svelte/transition";
    import { prettyPrintFloat, prettyPrintOrdinal } from "$lib/printers/number";

    export let team: NonNullable<EventPageQuery["eventByCode"]>["teams"][number];
    export let remote: boolean;

    $: season = team.season as Season;
    $: code = team.eventCode;
    $: number = team.team.number;
    $: name = team.team.name;

    $: href = `/teams/${number}${season == CURRENT_SEASON ? "" : `?season=${season}`}#${code}`;
    $: preloadData(href);

    $: stats = team.stats;
    $: useNp = !(DESCRIPTORS[season].pensSubtract || remote);
    $: np = useNp ? "np" : "";
    $: npStat = useNp ? ("totalPointsNp" as const) : ("totalPoints" as const);
</script>

<a {href} transition:fly={{ y: 100, duration: 300 }}>
    <div class="top-row">
        <b class="name"> {number} - <em> {name} </em> </b>
        <span class="view-team"> View Team <Fa icon={faAngleRight} /></span>
    </div>

    {#if stats}
        <div class="stats">
            <b>{prettyPrintOrdinal(stats.rank)}</b> place ·
            {#if "wins" in stats}
                <b>{stats.wins}-{stats.losses}-{stats.ties}</b> W-L-T ·
            {/if}
            <b>{prettyPrintFloat(stats.opr[npStat])}</b>
            {np}OPR ·
            <b>{prettyPrintFloat(stats.avg[npStat])}</b>
            {np}AVG
        </div>
    {/if}
</a>

<style>
    a {
        display: block;
        text-decoration: none;

        position: fixed;
        bottom: 0;
        margin: var(--md-gap);
        --team-bar-width: 350px;
        --team-bar-ss: var(--sidebar-size);
        left: max(0px, calc(50% + var(--team-bar-ss) / 2 - var(--team-bar-width)));
        right: max(0px, calc(50% + var(--team-bar-ss) / 2 + var(--team-bar-width)));
        width: min(
            calc(var(--team-bar-width) * 2),
            calc(100% - var(--md-gap) * 2 - var(--team-bar-ss))
        );

        background: var(--inverse-bg-color);
        color: var(--inverse-text-color);
        font-size: var(--lg-font-size);

        padding: var(--lg-pad);
        border-radius: 5px;

        z-index: var(--focused-team-zi);

        outline-color: var(--inverse-text-color);
    }

    @media (max-width: 1500px) {
        a {
            --team-bar-ss: 0px;
        }
    }

    .top-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .name {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;

        padding-right: var(--lg-gap);
    }

    .view-team {
        white-space: nowrap;
        font-size: var(--md-font-size);
    }

    .stats {
        font-size: var(--md-font-size);
        color: var(--inverse-secondary-text-color);

        margin-top: var(--md-gap);
    }
</style>
