<script lang="ts">
    import TradScoresHeader from "./TradScoresHeader.svelte";

    import type { MatchScores2020Traditional } from "../../../graphql/generated/graphql-operations";
    import TradScoreLine from "./TradScoreLine.svelte";

    export let score: MatchScores2020Traditional;
</script>

<table colspan="3">
    <TradScoresHeader {score} />

    <TradScoreLine {score} heading name="Auto" getProp={(a) => a.autoPoints} />
    <TradScoreLine
        {score}
        name="Navigation Points"
        getProp={(a) => a.autoNavigationPoints}
        subProps={[
            ["Robot 1", (a) => (a.autoNavigated1 ? 5 : 0)],
            ["Robot 2", (a) => (a.autoNavigated2 ? 5 : 0)],
        ]}
    />
    <TradScoreLine
        {score}
        name="Tower Points"
        getProp={(a) => a.autoGoalPoints}
        subProps={[
            ["Low", (a) => a.autoGoalLow * 3],
            ["Mid", (a) => a.autoGoalMid * 6],
            ["High", (a) => a.autoGoalHigh * 12],
        ]}
    />
    <TradScoreLine {score} name="Wobble Goal Points" getProp={(a) => a.autoWobblePoints} />
    <TradScoreLine {score} name="Powershot Points" getProp={(a) => a.autoPowershotPoints} />

    <TradScoreLine {score} heading name="Driver-Controlled" getProp={(a) => a.driverControlledPoints} />
    <TradScoreLine {score} name="Low" getProp={(a) => a.driverControlledLow * 2} />
    <TradScoreLine {score} name="Mid" getProp={(a) => a.driverControlledMid * 4} />
    <TradScoreLine {score} name="High" getProp={(a) => a.driverControlledHigh * 6} />

    <TradScoreLine {score} heading name="Endgame" getProp={(a) => a.endgamePoints} />
    <TradScoreLine {score} name="Powershot Points" getProp={(a) => a.endgamePowershotPoints} />
    <TradScoreLine {score} name="Wobble Goal Points" getProp={(a) => a.endgameWobblePoints} />
    <TradScoreLine {score} name="Wobble Ring Points" getProp={(a) => a.endgameWobbleRingPoints} />

    <TradScoreLine {score} heading name="Penalties" getProp={(a) => a.penaltyPoints} />
    <TradScoreLine {score} name="Major Penalty Points" getProp={(a) => a.majorPenalties * -30} />
    <TradScoreLine {score} name="Minor Penalty Points" getProp={(a) => a.minorPenalties * -10} />
</table>

<style>
    table {
        display: block;
    }
</style>
