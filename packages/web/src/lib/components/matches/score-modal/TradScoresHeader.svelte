<script lang="ts">
    import type { TradScoresTy } from "../MatchScore.svelte";

    export let scores: TradScoresTy;
</script>

<tr>
    <td />
    <td class="score red">Red <br /> <b>{scores.red.totalPoints}</b></td>
    <td class="score blue">Blue <br /> <b>{scores.blue.totalPoints}</b></td>
</tr>

<style>
    td {
        display: block;
        padding: var(--md-pad);
    }

    .score {
        padding-top: var(--sm-pad);
        padding-bottom: var(--sm-pad);

        text-align: center;
        color: var(--team-text-color);
    }

    b {
        font-weight: 900;
    }

    .red {
        background: var(--red-team-color);
    }
    .blue {
        background: var(--blue-team-color);
    }
</style>
