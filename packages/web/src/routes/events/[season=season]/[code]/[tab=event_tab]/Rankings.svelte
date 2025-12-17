<script lang="ts">
    import type { EventPageQuery } from "$lib/graphql/generated/graphql-operations";
    import { DESCRIPTORS, getTepStatSet, SortDir, type Season } from "@ftc-scout/common";
    import LocalStatTableControls from "$lib/components/stats/LocalStatTableControls.svelte";

    type EventTeam = NonNullable<EventPageQuery["eventByCode"]>["teams"][number];
    type LeagueRankingEntry = NonNullable<
        EventPageQuery["eventByCode"]
    >["leagueRankings"][number]["teams"][number];
    type DataTy = EventTeam | LeagueRankingEntry;

    export let season: Season;
    export let remote: boolean;
    export let eventName: string;
    export let data: DataTy[];
    export let focusedTeam: number | null;
    export let saveIdOverride: string | null = null;

    $: descriptor = DESCRIPTORS[season];
    $: stats = getTepStatSet(season, remote);
    $: totalPoints = descriptor.pensSubtract || remote ? "totalPoints" : "totalPointsNp";
    $: defaultStats = [
        "eventRank",
        "team",
        "rankingScore",
        "tb1",
        "played",
        ...(remote ? [] : ["eventRecord"]),
        totalPoints + "Avg",
        ...(remote ? [] : [totalPoints + "Opr"]),
        totalPoints + "Max",
    ];

    $: defaultSaveId = `eventPageTep${season}${remote ? "Remote" : "Trad"}`;
    $: saveId = saveIdOverride ?? defaultSaveId;

    $: underscoreEventName = eventName.replace(" ", "_");
    $: filename = `${season}_${underscoreEventName}_Team_Stats`;
    $: title = `${season} ${eventName} Team Stats`;
    $: csv = { filename, title };
</script>

<LocalStatTableControls
    {saveId}
    {data}
    {focusedTeam}
    {stats}
    {defaultStats}
    defaultSort={{ id: "eventRank", dir: SortDir.Asc }}
    hideRankStats={[
        "eventRank",
        "rankingScore",
        ...(descriptor.rankings.rp == "Record" ? ["record"] : ["totalPointsAvg", "totalPointsTot"]),
    ]}
    {csv}
/>
