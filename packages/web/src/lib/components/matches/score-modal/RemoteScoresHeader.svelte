<script lang="ts">
    import type { RemoteScoresTy } from "../MatchScore.svelte";

    export let scores: RemoteScoresTy;
    export let teamNumber: number;
</script>

<tr>
    <td />
    <td class="score">Team {teamNumber} <br /> <b>{scores.totalPoints}</b></td>
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

    .score {
        background: var(--neutral-team-color);
    }
</style>
