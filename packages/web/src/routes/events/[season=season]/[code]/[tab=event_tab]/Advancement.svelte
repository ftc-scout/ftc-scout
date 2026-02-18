<script lang="ts">
    import AdvancementStatTableControls from "$lib/components/stats/advancement/AdvancementStatTableControls.svelte";
    import type { EventPageQuery } from "$lib/graphql/generated/graphql-operations";
    import { applyFilter } from "$lib/components/stats/filter/applyFilters";
    import { arrayMove } from "$lib/util/array";
    import { cycleSortDir, cycleSortDirNoNull } from "$lib/components/stats/SortButton.svelte";
    import { sortMixed } from "$lib/util/sorters";
    import {
        Color,
        NonRankStatColumn,
        SortDir,
        StatSet,
        StatType,
        getTepStatSet,
        type Season,
        RankTy,
        type StatData,
        type FilterGroup,
    } from "@ftc-scout/common";
    import { writable, type Writable } from "svelte/store";

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
        advancementRank?: number | null;
        rank?: number | null;
        advanced: boolean;
        isAdvancementEligible: boolean;
        eligibility: string;
        team?: EventTeam["team"] | null | undefined;
        stats?: EventTeam["stats"] | null | undefined;
    }

    export let season: Season;
    export let remote: boolean;
    export let eventName: string;
    export let eventCode: string;
    export let data: AdvancementScore[];
    export let focusedTeam: number | null;
    export let saveIdOverride: string | null = null;

    // State management
    type State = {
        shownStats: Writable<NonRankStatColumn<AdvancementScore>[]>;
        currentSort: Writable<{ id: string; dir: SortDir }>;
        filter: Writable<FilterGroup | null>;
        rankTy: Writable<RankTy>;
    };
    let savedState: Record<string, State> = {};

    function getSavedState(
        saveId: string,
        stats: StatSet<AdvancementScore>,
        defaultStats: string[],
        defaultSort: { id: string; dir: SortDir }
    ): State {
        if (!(saveId in savedState)) {
            savedState[saveId] = {
                shownStats: writable(defaultStats.map((s) => stats.getStat(s))),
                currentSort: writable(defaultSort),
                filter: writable(null),
                rankTy: writable(RankTy.NoFilter),
            };
        }
        return savedState[saveId];
    }

    function getOrdinalSuffix(n: number): string {
        const s = ["th", "st", "nd", "rd"];
        const v = n % 100;
        return n + (s[(v - 20) % 10] || s[v] || s[0]);
    }

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

    // Create advancement rank column with combined status display
    const advRankCol = new NonRankStatColumn<AdvancementScore>({
        id: "advancementRank",
        columnName: "Adv Rank",
        dialogName: "Advancement Rank & Status",
        titleName: "Advancement Rank & Status",
        color: Color.White,
        ty: StatType.Rank,
        sqlExpr: "advancementRank",
        getNonRankValue: (d) => {
            if (d.advancementRank == null) {
                // No rank - check for status-only display
                const eligibility = d.eligibility?.toUpperCase() || "";
                if (d.advanced) {
                    return { ty: StatType.String, val: "✓ Advanced" };
                } else if (
                    eligibility === "ALREADY_ADVANCED" ||
                    eligibility === "ALREADYADVANCED"
                ) {
                    return { ty: StatType.String, val: "Prev Adv" };
                } else if (eligibility === "WRONG_REGION" || eligibility === "WRONGREGION") {
                    return { ty: StatType.String, val: "Region" };
                } else if (eligibility === "TOO_MANY_EVENTS" || eligibility === "TOOMANYEVENTS") {
                    return { ty: StatType.String, val: "Count" };
                } else if (
                    eligibility === "MULTIPLE_REASONS" ||
                    eligibility === "MULTIPLEREASONS"
                ) {
                    return { ty: StatType.String, val: "Inelig" };
                }
                return null;
            }

            return { ty: StatType.Rank, val: d.advancementRank };
        },
    });

    // Override getValue to add status suffix while keeping rank style
    advRankCol.getValue = (d) => {
        if (d.data.advancementRank == null) {
            return advRankCol.getNonRankValue(d.data);
        }

        // For advanced teams, use special marker for CSS styling
        if (d.data.advanced) {
            return { ty: StatType.String, val: "✓ " + getOrdinalSuffix(d.data.advancementRank) };
        }

        // Check for ineligibility statuses
        const eligibility = d.data.eligibility?.toUpperCase() || "";
        if (eligibility === "ALREADY_ADVANCED" || eligibility === "ALREADYADVANCED") {
            return {
                ty: StatType.String,
                val: getOrdinalSuffix(d.data.advancementRank) + " (Prev Adv)",
            };
        } else if (eligibility === "WRONG_REGION" || eligibility === "WRONGREGION") {
            return {
                ty: StatType.String,
                val: getOrdinalSuffix(d.data.advancementRank) + " (Region)",
            };
        } else if (eligibility === "TOO_MANY_EVENTS" || eligibility === "TOOMANYEVENTS") {
            return {
                ty: StatType.String,
                val: getOrdinalSuffix(d.data.advancementRank) + " (Count)",
            };
        } else if (eligibility === "MULTIPLE_REASONS" || eligibility === "MULTIPLEREASONS") {
            return {
                ty: StatType.String,
                val: getOrdinalSuffix(d.data.advancementRank) + " (Inelig)",
            };
        }

        return { ty: StatType.Rank, val: d.data.advancementRank };
    };

    // Override getValueDistilled to sort by numeric rank
    advRankCol.getValueDistilled = (d) => {
        return d.data.advancementRank ?? null;
    };

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
        advRankCol,
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

    let defaultStats = [
        "eventRank",
        "advancementRank",
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

    let { shownStats, currentSort, filter, rankTy } = getSavedState(saveId, stats, defaultStats, {
        id: "eventRank",
        dir: SortDir.Asc,
    });

    function calcIsDefaultStats(
        def: string[],
        curr: NonRankStatColumn<AdvancementScore>[]
    ): boolean {
        if (def.length != curr.length) return false;
        for (let i = 0; i < def.length; i++) {
            if (def[i] != curr[i].id) return false;
        }
        return true;
    }

    $: isDefaultStats = calcIsDefaultStats(defaultStats, $shownStats);

    let hideRankStats: string[] = ["eventRank"];
    $: rankingByEquiv = hideRankStats.indexOf($currentSort.id) != -1;
    $: rowsDroppedByFilter = rankedData.length != data.length;
    $: showRank = !rankingByEquiv || (rowsDroppedByFilter && $rankTy != RankTy.NoFilter);

    function changeSort(id: string) {
        let oldDir = $currentSort.id == id ? $currentSort.dir : null;
        let newDir = id == "eventRank" ? cycleSortDirNoNull(oldDir) : cycleSortDir(oldDir);
        $currentSort = newDir == null ? { id: "eventRank", dir: SortDir.Asc } : { id, dir: newDir };
    }

    function moveColumn(from: number, to: number) {
        $shownStats = arrayMove($shownStats, from, to);
    }

    function toggleShowStat(id: string) {
        if ($shownStats.some((s) => s.id == id)) {
            $shownStats = $shownStats.filter((s) => s.id != id);
        } else {
            $shownStats = [...$shownStats, stats.getStat(id)];
        }
    }

    function assignRanks(
        data: StatData<AdvancementScore>[],
        sorter: NonRankStatColumn<AdvancementScore>,
        preFilter: boolean
    ) {
        const field = preFilter ? "noFilterRank" : "filterRank";
        const skipField = preFilter ? "noFilterSkipRank" : "filterSkipRank";

        let i = 1;
        let lastValue: any = null;
        let lastRank = 1;

        for (let d of data) {
            let value = sorter.getValueDistilled(d);
            if (value !== lastValue) {
                lastRank = i;
                lastValue = value;
            }
            (d as any)[field] = lastRank;
            (d as any)[skipField] = lastRank;
            i++;
        }
    }

    function sortAndRank(
        data: AdvancementScore[],
        sorter: NonRankStatColumn<AdvancementScore>,
        dir: SortDir,
        filter: FilterGroup | null
    ): StatData<AdvancementScore>[] {
        let sorted = data
            .slice()
            .sort((a, b) => {
                return (
                    sortMixed(
                        sorter.getValueDistilled({ data: a } as any),
                        sorter.getValueDistilled({ data: b } as any)
                    ) * (dir == SortDir.Asc ? 1 : -1)
                );
            })
            .map((s) => ({
                noFilterRank: 0,
                filterRank: 0,
                noFilterSkipRank: 0,
                filterSkipRank: 0,
                data: s,
            }));
        assignRanks(sorted, sorter, true);

        let filtered = applyFilter(sorted, stats, filter);
        assignRanks(filtered, sorter, false);

        return filtered;
    }

    $: rankedData = sortAndRank(data, stats.getStat($currentSort.id), $currentSort.dir, $filter);

    // Function to get eligibility status for a row
    function getIsEligible(d: AdvancementScore): boolean {
        return d.isAdvancementEligible;
    }
</script>

<div class="warning">
    <strong>Eligibility data may be incomplete or inaccurate</strong>, because of lack of official
    data on team eligibility from FIRST. Please verify with the event organizers. For more
    information about this issue, see
    <a href="https://github.com/FIRST-Tech-Challenge/scorekeeper/issues/915" target="_blank"
        >this GitHub issue</a
    >.
</div>

<AdvancementStatTableControls
    data={rankedData}
    {stats}
    shownStats={$shownStats}
    currentSort={$currentSort}
    filter={$filter}
    {isDefaultStats}
    {focusedTeam}
    bind:rankTy={$rankTy}
    {showRank}
    {csv}
    viewStats={viewStats ?? stats}
    hideFiltersAndStats={true}
    {getIsEligible}
    on:change_sort={(e) => changeSort(e.detail)}
    on:move_column={(e) => moveColumn(e.detail.oldPos, e.detail.newPos)}
    on:toggle-show-stat={(e) => toggleShowStat(e.detail)}
    on:new-filter={(e) => ($filter = e.detail)}
    on:reset-stats={() => ($shownStats = defaultStats.map((id) => stats.getStat(id)))}
/>

<div class="legend">
    <div class="legend-items">
        <div class="legend-item">
            <span class="legend-label">N/A</span>
            <span class="legend-desc">No scores available</span>
        </div>
        <div class="legend-item">
            <span class="legend-label">*</span>
            <span class="legend-desc">Not final, still earning points</span>
        </div>
        <div class="legend-item">
            <span class="legend-label advanced">✓ 1st</span>
            <span class="legend-desc">Officially advanced from this event</span>
        </div>
        <div class="legend-item">
            <span class="legend-label">Prev Adv</span>
            <span class="legend-desc"
                >Already advanced from previous event, cannot advance again</span
            >
        </div>
        <div class="legend-item">
            <span class="legend-label">Region</span>
            <span class="legend-desc">Wrong region, not eligible to advance</span>
        </div>
        <div class="legend-item">
            <span class="legend-label">Count</span>
            <span class="legend-desc">Too many events played, not eligible to advance</span>
        </div>
        <div class="legend-item">
            <span class="legend-label">Inelig</span>
            <span class="legend-desc">Multiple ineligibility reasons</span>
        </div>
    </div>
</div>
<div class="warning">
    <strong>Note:</strong> Advancement results are not official, we do our best to calculate it
    accurately based on the data we have, but there may be errors or missing information . For
    official advancement results, please refer to
    <a
        href={`https://ftc-events.firstinspires.org/2025/${eventCode}/advancementpoints`}
        target="_blank">FIRST's official advancement report</a
    > for official data.
</div>

<style>
    .legend {
        margin-top: var(--lg-gap);
        padding: var(--md-pad);
        background: var(--secondary-bg-color);
        border-radius: var(--border-radius);
    }

    .legend-title {
        font-weight: bold;
        font-size: var(--md-font-size);
        margin-bottom: var(--sm-gap);
        color: var(--primary-text-color);
    }

    .legend-items {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
        gap: var(--sm-gap);
    }

    .legend-item {
        display: flex;
        align-items: center;
        gap: var(--sm-gap);
    }

    .legend-label {
        font-weight: bold;
        min-width: 100px;
        font-family: monospace;
        font-size: var(--md-font-size);
    }

    .legend-label.advanced {
        color: #16a34a;
    }

    .legend-desc {
        color: var(--secondary-text-color);
        font-size: var(--sm-font-size);
    }

    .warning {
        background-color: var(--alert-bar-color);
        color: var(--alert-bar-text-color);
        padding: var(--lg-gap);
        border-radius: var(--lg-gap);
        margin-bottom: var(--lg-gap);
    }

    @media (max-width: 600px) {
        .legend-items {
            grid-template-columns: 1fr;
        }
    }
</style>
