<script lang="ts">
    import { page } from "$app/stores";
    import { DESCRIPTORS, SortDir, type Season, getMatchStatSet } from "@ftc-scout/common";
    import ServerStatTableControls from "$lib/components/stats/ServerStatTableControls.svelte";
    import type { PageData } from "./$types";
    import SkeletonRow from "$lib/components/skeleton/SkeletonRow.svelte";
    import { PAGE_SIZE } from "./+page.svelte";
    import { getMatchScoresForAlliance } from "../../../../lib/components/stats/getMatchScores";

    $: season = +$page.params.season as Season;
    export let matchData: PageData["matchData"];
    export let focusedTeam: number | null;

    $: info = $matchData?.data.matchRecords;
    $: data = info?.data?.map((d) => ({
        data: getMatchScoresForAlliance(d.data.match, d.data.alliance),
        filterRank: d.filterRank,
        filterSkipRank: d.filterSkipRank,
        noFilterRank: d.noFilterRank,
        noFilterSkipRank: d.noFilterSkipRank,
    }));

    $: descriptor = DESCRIPTORS[season];
    $: stats = getMatchStatSet(season, false);
    $: totalPoints = descriptor.pensSubtract ? "totalPointsThis" : "totalPointsNpThis";
    $: defaultStats = [
        totalPoints,
        "autoPointsThis",
        "dcPointsThis",
        "egPointsThis",
        ...descriptor.getMatchInsightCols(false).map((c) => c + "This"),
        "team1This",
        "team2This",
        "event",
        "matchNum",
        "alliance",
    ];
    $: defaultSort = { id: totalPoints, dir: SortDir.Desc };

    $: filename = `${season}_Match_Records`;
    $: title = `${season} Match Records`;
    $: csv = { filename, title };
</script>

{#if info && data}
    <ServerStatTableControls
        {data}
        {stats}
        {defaultSort}
        {defaultStats}
        pageCount={Math.ceil(info.count / PAGE_SIZE)}
        {focusedTeam}
        {csv}
        includeSkipRankTys={false}
    />
{:else}
    <SkeletonRow card={false} rows={PAGE_SIZE} />
{/if}
