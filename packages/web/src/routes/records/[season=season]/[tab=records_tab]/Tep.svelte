<script lang="ts">
    import { page } from "$app/stores";
    import { DESCRIPTORS, getTepStatSet, SortDir, type Season } from "@ftc-scout/common";
    import ServerStatTableControls from "$lib/components/stats/ServerStatTableControls.svelte";
    import type { PageData } from "./$types";
    import SkeletonRow from "$lib/components/skeleton/SkeletonRow.svelte";
    import { PAGE_SIZE } from "./+page.svelte";

    $: season = +$page.params.season as Season;
    export let tepData: PageData["tepData"];
    export let focusedTeam: number | null;

    $: info = $tepData?.data.tepRecords;
    $: data = info?.data;

    $: descriptor = DESCRIPTORS[season];
    $: stats = getTepStatSet(season, false);
    $: totalPoints = descriptor.pensSubtract ? "totalPoints" : "totalPointsNp";
    $: defaultStats = [
        "team",
        totalPoints + "Opr",
        "autoPointsOpr",
        "dcPointsOpr",
        "egPointsOpr",
        totalPoints + "Avg",
        "eventRank",
        "event",
        "eventRecord",
    ];
    $: defaultSort = { id: totalPoints + "Opr", dir: SortDir.Desc };

    $: filename = `${season}_Team_Records`;
    $: title = `${season} Team Records`;
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
    />
{:else}
    <SkeletonRow card={false} rows={PAGE_SIZE} />
{/if}
