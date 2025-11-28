<script lang="ts">
    import LocalStatTableControls from "$lib/components/stats/LocalStatTableControls.svelte";
    import type { EventPageQuery } from "$lib/graphql/generated/graphql-operations";
    import {
        Color,
        NonRankStatColumn,
        SortDir,
        StatSet,
        StatType,
        getTepStatSet,
        type Season,
    } from "@ftc-scout/common";

    type EventTeam = NonNullable<EventPageQuery["eventByCode"]>["teams"][number];

    interface AdvancementScore {
        season: number;
        eventCode: string;
        teamNumber: number;
        qualPoints?: number | null;
        isQualFinal?: boolean;
        allianceSelectionPoints?: number | null;
        isAllianceSelectionFinal?: boolean;
        playoffPoints?: number | null;
        awardPoints?: number | null;
        totalPoints?: number | null;
        rank?: number | null;
        team?: EventTeam["team"] | null | undefined;
        stats?: EventTeam["stats"] | null | undefined;
    }

    export let season: Season;
    export let remote: boolean;
    export let eventName: string;
    export let data: AdvancementScore[];
    export let focusedTeam: number | null;
    export let saveIdOverride: string | null = null;

    function makeCol(
        id: string,
        name: string,
        color: Color,
        getValue: (d: AdvancementScore) => number | null | undefined,
        isFinal: (d: AdvancementScore) => boolean | undefined = () => true
    ) {
        let col = new NonRankStatColumn<AdvancementScore>({
            id,
            columnName: name,
            dialogName: name,
            titleName: name,
            color,
            ty: StatType.Int,
            sqlExpr: id, // Not used for local stats
            getNonRankValue: (d) => {
                let val = getValue(d);
                return val == null ? null : { ty: StatType.Int, val };
            },
        });

        col.getValue = (d) => {
            let val = getValue(d.data);
            if (val == null) return null;
            if (isFinal(d.data) !== false) {
                return { ty: StatType.Int, val };
            } else {
                return { ty: StatType.String, val: val + "*" };
            }
        };

        return col;
    }

    const columns = [
        new NonRankStatColumn<AdvancementScore>({
            id: "eventRank",
            columnName: "Rank",
            dialogName: "Rank",
            titleName: "Rank",
            color: Color.White,
            ty: StatType.Rank,
            sqlExpr: "rank",
            getNonRankValue: (d) => (d.rank == null ? null : { ty: StatType.Rank, val: d.rank }),
        }),
        new NonRankStatColumn<AdvancementScore>({
            id: "team",
            columnName: "Team",
            dialogName: "Team",
            titleName: "Team",
            color: Color.White,
            ty: StatType.Team,
            sqlExpr: "team",
            getNonRankValue: (d) => ({
                ty: StatType.Team,
                number: d.teamNumber,
                name: d.team?.name ?? "",
            }),
        }),
        makeCol("totalPoints", "Total Points", Color.LightBlue, (d) => d.totalPoints),
        makeCol(
            "qualPoints",
            "Qual Points",
            Color.Red,
            (d) => d.qualPoints,
            (d) => d.isQualFinal
        ),
        makeCol(
            "allianceSelectionPoints",
            "Alliance Points",
            Color.Green,
            (d) => d.allianceSelectionPoints,
            (d) => d.isAllianceSelectionFinal
        ),
        makeCol("playoffPoints", "Playoff Points", Color.Purple, (d) => d.playoffPoints),
        makeCol("awardPoints", "Award Points", Color.Blue, (d) => d.awardPoints),
    ];

    const stats = new StatSet<AdvancementScore>("advancement", columns, []);
    $: viewStats = getTepStatSet(season, remote) as StatSet<AdvancementScore>;

    $: defaultStats = [
        "eventRank",
        "team",
        "totalPoints",
        "qualPoints",
        "allianceSelectionPoints",
        "playoffPoints",
        "awardPoints",
    ];

    $: defaultSaveId = `eventPageAdvancement${season}${remote ? "Remote" : "Trad"}`;
    $: saveId = saveIdOverride ?? defaultSaveId;

    $: underscoreEventName = eventName.replace(" ", "_");
    $: filename = `${season}_${underscoreEventName}_Advancement`;
    $: title = `${season} ${eventName} Advancement`;
    $: csv = { filename, title };
</script>

<LocalStatTableControls
    {saveId}
    {data}
    {focusedTeam}
    {stats}
    {viewStats}
    {defaultStats}
    defaultSort={{ id: "eventRank", dir: SortDir.Asc }}
    hideRankStats={["eventRank"]}
    {csv}
    hideFiltersAndStats={true}
/>
