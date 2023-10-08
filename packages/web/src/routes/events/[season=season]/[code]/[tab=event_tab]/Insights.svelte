<script lang="ts" context="module">
    type TradAllianceScore = Extract<FullMatchScoresFragment, { red: any }>["red"];
    type RemoteAllianceScore = Exclude<FullMatchScoresFragment, { red: any }>;
    export type AllianceScore = TradAllianceScore | RemoteAllianceScore;
</script>

<script lang="ts">
    import type { FullMatchScoresFragment } from "$lib/graphql/generated/graphql-operations";
    import { DESCRIPTORS, SortDir, type Season, getMatchStatSet } from "@ftc-scout/common";
    import LocalStatTableControls from "$lib/components/stats/LocalStatTableControls.svelte";

    export let season: Season;
    export let remote: boolean;
    export let eventName: string;
    export let data: AllianceScore[];
    export let focusedTeam: number | null;

    $: descriptor = DESCRIPTORS[season];
    $: stats = getMatchStatSet(season, remote);
    $: totalPoints = descriptor.pensSubtract || remote ? "totalPointsThis" : "totalPointsNpThis";
    $: defaultStats = [
        totalPoints,
        "autoPointsThis",
        "dcPointsThis",
        "egPointsThis",
        ...descriptor.getMatchInsightCols(remote).map((c) => c + "This"),
        "team1This",
        ...(remote ? [] : ["team2This"]),
        "matchNum",
        ...(remote ? [] : ["alliance"]),
    ];

    $: saveId = `eventPageMs${season}${remote ? "Remote" : "Trad"}`;

    $: underscoreEventName = eventName.replace(" ", "_");
    $: filename = `${season}_${underscoreEventName}_Match_Stats`;
    $: title = `${season} ${eventName} Match Stats`;
    $: csv = { filename, title };
</script>

<LocalStatTableControls
    {saveId}
    {data}
    {focusedTeam}
    {stats}
    {defaultStats}
    defaultSort={{ id: totalPoints, dir: SortDir.Desc }}
    {csv}
/>
