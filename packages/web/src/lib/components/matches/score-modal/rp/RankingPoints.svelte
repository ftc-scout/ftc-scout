<script lang="ts">
    import { Alliance, DESCRIPTORS, RankingPointType, Season } from "@ftc-scout/common";
    import RankingPointIcon from "./RankingPointIcon.svelte";
    import type { TradScoresTy } from "../../MatchScore.svelte";

    export let scores: TradScoresTy;

    $: season = scores.season as Season | undefined;
    $: descriptor = season ? DESCRIPTORS[season] : undefined;

    function isRpActive(alliance: Alliance, rp: RankingPointType): boolean {
        let allianceScore = scores[alliance == Alliance.Red ? "red" : "blue"];
        if (rp.id in allianceScore) {
            return allianceScore[rp.id as keyof typeof allianceScore] ? true : false;
        } else {
            return false;
        }
    }
</script>

<!-- HELP: Season Specific -->
{#if descriptor}
    {#if scores && !!descriptor.rankingPoints}
        <div style="text-align: center; width: 100%; margin-top: 0.5em;">
            <b>Ranking Points</b>
        </div>
        <div style="display: flex; justify-content: space-between; margin-top: 0.25rem;">
            {#each [Alliance.Red, Alliance.Blue] as alliance}
                <div style="display: flex; justify-content: center; width: 50%;">
                    {#each descriptor.rankingPoints as rp}
                        {#if rp.id in scores[alliance == Alliance.Red ? "red" : "blue"]}
                            <RankingPointIcon
                                id={rp.id}
                                active={isRpActive(alliance, rp)}
                                {alliance}
                            />
                        {/if}
                    {/each}
                </div>
            {/each}
        </div>
    {/if}
{/if}
