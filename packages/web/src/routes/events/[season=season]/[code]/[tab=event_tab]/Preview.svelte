<script lang="ts">
    import LocalStatTableControls from "$lib/components/stats/LocalStatTableControls.svelte";
    import {
        Color,
        NonRankStatColumn,
        SortDir,
        StatSet,
        StatSetSection,
        StatType,
        type Season,
    } from "@ftc-scout/common";

    type PreviewTeam = {
        teamNumber: number;
        name: string;
        quickOpr: number | null;
    };

    export let teams: PreviewTeam[];
    export let focusedTeam: number | null;
    export let eventName: string;
    export let eventCode: string;
    export let season: Season;

    const teamStat = new NonRankStatColumn<PreviewTeam>({
        id: "team",
        columnName: "Team",
        dialogName: "Team",
        titleName: "Team",
        sqlExpr: "team_number",
        color: Color.White,
        ty: StatType.Team,
        getNonRankValue: (team) => ({
            ty: "team",
            number: team.teamNumber,
            name: team.name,
        }),
    });

    const oprStat = new NonRankStatColumn<PreviewTeam>({
        id: "quickOpr",
        columnName: "np OPR",
        dialogName: "np OPR",
        titleName: "Season-Best np OPR",
        sqlExpr: "quick_opr",
        color: Color.Purple,
        ty: StatType.Float,
        getNonRankValue: (team) =>
            team.quickOpr == null ? null : { ty: "float", val: team.quickOpr },
    });

    const previewStats = new StatSet<PreviewTeam>(
        "eventPreview",
        [teamStat, oprStat],
        [
            new StatSetSection(
                "Season Preview",
                [
                    { val: { id: "team", name: "Team" }, children: [] },
                    { val: { id: "quickOpr", name: "np OPR" }, children: [] },
                ],
                [
                    { id: "team", name: "Team", color: Color.White, description: null },
                    { id: "quickOpr", name: "np OPR", color: Color.Purple, description: null },
                ]
            ),
        ]
    );

    const defaultStats = ["team", "quickOpr"];
    const defaultSort = { id: "quickOpr", dir: SortDir.Desc };

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
    stats={previewStats}
    {focusedTeam}
    {defaultStats}
    {defaultSort}
    {csv}
    {saveId}
    hideRankStats={[]}
/>
