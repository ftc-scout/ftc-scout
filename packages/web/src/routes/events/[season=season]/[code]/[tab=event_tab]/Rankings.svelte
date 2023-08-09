<script lang="ts">
    import type { EventPageQuery } from "$lib/graphql/generated/graphql-operations";
    import type { Season } from "@ftc-scout/common";
    import LocalStatTableControls from "$lib/components/stats/LocalStatTableControls.svelte";
    import { SortDir } from "$lib/components/stats/StatTableControls.svelte";
    import { getTepStatSet } from "$lib/components/stats/tep/makeTepStats";

    type DataTy = NonNullable<EventPageQuery["eventByCode"]>["teams"][number];

    export let season: Season;
    export let data: DataTy[];
    export let focusedTeam: number | null;

    $: stats = getTepStatSet(season);
    // $: console.log(stats);

    // let stats: NonRankStatColumn<DataTy>[] = [
    //     new NonRankStatColumn({
    //         color: Color.White,
    //         id: "eventRank",
    //         columnName: "Rank",
    //         dialogName: "Rank",
    //         titleName: "Rank",
    //         ty: StatType.Rank,
    //         getNonRankValue: (x) => ({ ty: "rank", val: x.stats?.rank! }),
    //     }),
    //     new NonRankStatColumn({
    //         color: Color.White,
    //         id: "Team",
    //         columnName: "Team",
    //         dialogName: "Team",
    //         titleName: "Team",
    //         ty: StatType.Team,
    //         getNonRankValue: (x) => ({ ty: "team", number: x.team.number, name: x.team.name }),
    //     }),
    //     new NonRankStatColumn<DataTy>({
    //         color: Color.Purple,
    //         id: "OPR",
    //         columnName: "np OPR",
    //         dialogName: "OPR",
    //         titleName: "OPR",
    //         ty: StatType.Float,
    //         getNonRankValue: (x) => ({ ty: "float", val: x.stats?.opr.totalPointsNp! }),
    //     }),
    //     new NonRankStatColumn({
    //         color: Color.Purple,
    //         id: "AVG",
    //         columnName: "np AVG",
    //         dialogName: "AVG",
    //         titleName: "AVG",
    //         ty: StatType.Float,
    //         getNonRankValue: (x) => ({ ty: "float", val: x.stats?.avg.totalPointsNp! }),
    //     }),
    //     new NonRankStatColumn({
    //         color: Color.Green,
    //         id: "Record",
    //         columnName: "Record",
    //         dialogName: "Record",
    //         titleName: "Record",
    //         ty: StatType.Float,
    //         getNonRankValue: (x) =>
    //             x.stats && "wins" in x.stats
    //                 ? {
    //                       ty: "record",
    //                       wins: x.stats.wins,
    //                       losses: x.stats.losses,
    //                       ties: x.stats.ties,
    //                   }
    //                 : null,
    //     }),
    // ];
</script>

<LocalStatTableControls
    {data}
    {focusedTeam}
    {stats}
    defaultStats={stats.allStats}
    defaultSort={{ id: "totalPointsAvg", dir: SortDir.Asc }}
    hideRankStats={[]}
/>
