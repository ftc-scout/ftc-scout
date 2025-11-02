<script lang="ts">
    import type { FullMatchFragment } from "$lib/graphql/generated/graphql-operations";
    import { Season } from "@ftc-scout/common";
    import RankingPointIcon from "./RankingPointIcon.svelte";

    export let scores: FullMatchFragment["scores"];
</script>

<!-- HELP: Season Specific -->
{#if scores && scores.season == Season.Decode && scores.__typename == "MatchScores2025"}
    <div style="text-align: center; width: 100%; margin-top: 0.5em;">
        <b>Ranking Points</b>
    </div>
    <div style="display: flex; justify-content: space-between; margin-top: 0.25rem;">
        <div style="display: flex; justify-content: center; width: 50%;">
            <RankingPointIcon id={"movementRp"} active={scores["red"]["movementRp"]} team="red" />
            <RankingPointIcon id={"goalRp"} active={scores["red"]["goalRp"]} team="red" />
            <RankingPointIcon id={"patternRp"} active={scores["red"]["patternRp"]} team="red" />
        </div>
        <div style="display: flex; justify-content: center; width: 50%;">
            <RankingPointIcon id={"movementRp"} active={scores["blue"]["movementRp"]} team="blue" />
            <RankingPointIcon id={"goalRp"} active={scores["blue"]["goalRp"]} team="blue" />
            <RankingPointIcon id={"patternRp"} active={scores["blue"]["patternRp"]} team="blue" />
        </div>
    </div>
{/if}
