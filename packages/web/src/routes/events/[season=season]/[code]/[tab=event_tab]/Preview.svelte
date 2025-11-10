<script lang="ts">
    import LocalStatTableControls from "$lib/components/stats/LocalStatTableControls.svelte";
    import {
        DESCRIPTORS,
        SortDir,
        StatSet,
        getTepStatSet,
        NonRankStatColumn,
        type Season,
    } from "@ftc-scout/common";
    import type { EventPageQuery } from "$lib/graphql/generated/graphql-operations";

    type PreviewTeam =
        NonNullable<EventPageQuery["eventByCode"]>["teams"][number] & {
            quickOpr: number | null;
        };

    export let teams: PreviewTeam[];
    export let focusedTeam: number | null;
    export let eventName: string;
    export let eventCode: string;
    export let season: Season;
    export let remote: boolean;

    $: baseStatSet = getTepStatSet(season, remote) as StatSet<PreviewTeam>;

    function wrapColumn(column: NonRankStatColumn<any>): NonRankStatColumn<PreviewTeam> {
        return new NonRankStatColumn<PreviewTeam>({
            id: column.id,
            columnName: column.columnName,
            dialogName: column.dialogName,
            titleName: column.titleName,
            sqlExpr: column.sqlExpr,
            color: column.color,
            ty: column.ty,
            getNonRankValue: (team) => {
                try {
                    return column.getNonRankValue(team as any);
                } catch (err) {
                    return null;
                }
            },
        });
    }

    $: statSet = new StatSet<PreviewTeam>(
        baseStatSet.id,
        baseStatSet.allStats.map(wrapColumn),
        baseStatSet.sections
    );

    let defaultStats: string[] = ["team"];
    let defaultSort = { id: "team", dir: SortDir.Desc };
    $: descriptor = DESCRIPTORS[season];
    $: totalPointsKey = descriptor.pensSubtract || remote ? "totalPoints" : "totalPointsNp";
    $: defaultStatId = `${totalPointsKey}Opr`;
    $: defaultStats = ["team", defaultStatId];
    $: defaultSort = { id: defaultStatId, dir: SortDir.Desc };

    $: safeEventName = eventName ?? "Event";
    $: underscoreEventName = safeEventName.replace(/\s+/g, "_");
    $: csv = {
        filename: `${season}_${eventCode}_${underscoreEventName}_Preview`,
        title: `${season} ${safeEventName} Preview`,
    };
    $: saveId = `eventPreview${season}_${eventCode}`;
</script>

<LocalStatTableControls
    data={[...teams]}
    stats={statSet}
    {focusedTeam}
    {defaultStats}
    {defaultSort}
    {csv}
    {saveId}
    hideRankStats={[]}
/>
