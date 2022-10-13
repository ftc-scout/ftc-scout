<script lang="ts">
    import type { MatchScores2020Remote } from "../../../graphql/generated/graphql-operations";
    import RemoteScoreLine from "./RemoteScoreLine.svelte";
    import RemoteScoresHeader from "./RemoteScoresHeader.svelte";

    export let score: MatchScores2020Remote;
    export let teamNumber: number;
</script>

<table colspan="2">
    <RemoteScoresHeader {score} {teamNumber} />

    <RemoteScoreLine {score} heading name="Auto" getProp={(a) => a.autoPoints} />
    <RemoteScoreLine {score} name="Navigation Points" getProp={(a) => a.autoNavigationPoints} />
    <RemoteScoreLine
        {score}
        name="Tower Points"
        getProp={(a) => a.autoGoalPoints}
        subProps={[
            ["Low", (a) => a.autoGoalLow * 3],
            ["Mid", (a) => a.autoGoalMid * 6],
            ["High", (a) => a.autoGoalHigh * 12],
        ]}
    />
    <RemoteScoreLine {score} name="Wobble Goal Points" getProp={(a) => a.autoWobblePoints} />
    <RemoteScoreLine {score} name="Powershot Points" getProp={(a) => a.autoPowershotPoints} />

    <RemoteScoreLine {score} heading name="Driver-Controlled" getProp={(a) => a.driverControlledPoints} />
    <RemoteScoreLine {score} name="Low" getProp={(a) => a.driverControlledLow * 2} />
    <RemoteScoreLine {score} name="Mid" getProp={(a) => a.driverControlledMid * 4} />
    <RemoteScoreLine {score} name="High" getProp={(a) => a.driverControlledHigh * 6} />

    <RemoteScoreLine {score} heading name="Endgame" getProp={(a) => a.endgamePoints} />
    <RemoteScoreLine {score} name="Powershot Points" getProp={(a) => a.endgamePowershotPoints} />
    <RemoteScoreLine {score} name="Wobble Goal Points" getProp={(a) => a.endgameWobblePoints} />
    <RemoteScoreLine {score} name="Wobble Ring Points" getProp={(a) => a.endgameWobbleRingPoints} />

    <RemoteScoreLine {score} heading name="Penalties" getProp={(a) => a.penaltyPoints} />
    <RemoteScoreLine {score} name="Major Penalty Points" getProp={(a) => a.majorPenalties * -30} />
    <RemoteScoreLine {score} name="Minor Penalty Points" getProp={(a) => a.minorPenalties * -10} />
</table>

<style>
    table {
        display: block;
    }
</style>
