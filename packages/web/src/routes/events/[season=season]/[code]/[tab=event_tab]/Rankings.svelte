<script lang="ts">
    import type { EventPageQuery } from "$lib/graphql/generated/graphql-operations";
    import { DESCRIPTORS, type Season } from "@ftc-scout/common";
    import LocalStatTableControls from "$lib/components/stats/LocalStatTableControls.svelte";
    import { SortDir } from "$lib/components/stats/StatTableControls.svelte";
    import { getTepStatSet } from "$lib/components/stats/tep/makeTepStats";

    type DataTy = NonNullable<EventPageQuery["eventByCode"]>["teams"][number];

    export let season: Season;
    export let remote: boolean;
    export let data: DataTy[];
    export let focusedTeam: number | null;

    $: descriptor = DESCRIPTORS[season];
    $: stats = getTepStatSet(season, remote);
    $: totalPoints = descriptor.pensSubtract || remote ? "totalPoints" : "totalPointsNp";
    $: defaultStats = [
        "eventRank",
        "team",
        "rankingPoints",
        "tb1",
        "played",
        totalPoints + "Avg",
        ...(remote ? [] : [totalPoints + "Opr"]),
        totalPoints + "Max",
    ];
</script>

<LocalStatTableControls
    {data}
    {focusedTeam}
    {stats}
    {defaultStats}
    defaultSort={{ id: "eventRank", dir: SortDir.Asc }}
    hideRankStats={[
        "eventRank",
        "rankingPoints",
        ...(descriptor.rankings.rp == "Record" ? ["record"] : ["totalPointsAvg", "totalPointsTot"]),
    ]}
/>
