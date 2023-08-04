<script lang="ts">
    import type { EventPageQuery } from "$lib/graphql/generated/graphql-operations";
    import StatTable from "$lib/components/stat-table/StatTable.svelte";
    import { Color, StatColumn, StatType } from "$lib/components/stat-table/stat-table";

    type DataTy = NonNullable<EventPageQuery["eventByCode"]>["teams"][number];

    export let data: DataTy[];
    export let focusedTeam: number | null;

    $: rankedData = data.map((data) => ({
        noFilterRank: 1,
        filterRank: 1,
        noFilterSkipRank: 1,
        filterSkipRank: 1,
        data,
    }));

    let stats: StatColumn<DataTy>[] = [
        new StatColumn({
            color: Color.White,
            id: "Rank",
            columnName: "Rank",
            dialogName: "Rank",
            titleName: "Rank",
            ty: StatType.Rank,
            getValue: (x) => ({ ty: "rank", val: x.filterRank }),
        }),
        new StatColumn({
            color: Color.White,
            id: "Team",
            columnName: "Team",
            dialogName: "Team",
            titleName: "Team",
            ty: StatType.Team,
            getValue: (x) => ({ ty: "team", number: x.data.team.number, name: x.data.team.name }),
        }),
        new StatColumn<DataTy>({
            color: Color.Purple,
            id: "OPR",
            columnName: "np OPR",
            dialogName: "OPR",
            titleName: "OPR",
            ty: StatType.Float,
            getValue: (x) => ({ ty: "float", val: x.data.stats?.opr.totalPointsNp! }),
        }),
        new StatColumn({
            color: Color.Purple,
            id: "AVG",
            columnName: "np AVG",
            dialogName: "AVG",
            titleName: "AVG",
            ty: StatType.Float,
            getValue: (x) => ({ ty: "float", val: x.data.stats?.avg.totalPointsNp! }),
        }),
        new StatColumn({
            color: Color.Green,
            id: "Record",
            columnName: "Record",
            dialogName: "Record",
            titleName: "Record",
            ty: StatType.Float,
            getValue: (x) =>
                x.data.stats && "wins" in x.data.stats
                    ? {
                          ty: "record",
                          wins: x.data.stats.wins,
                          losses: x.data.stats.losses,
                          ties: x.data.stats.ties,
                      }
                    : null,
        }),
    ];
</script>

<StatTable {stats} data={rankedData} {focusedTeam} />
