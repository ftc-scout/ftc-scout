<script lang="ts">
    import TradScoresHeader from "./TradScoresHeader.svelte";
    import { AutoNavigation2022, type MatchScores2022 } from "../../../graphql/generated/graphql-operations";
    import TradScoreLine from "./TradScoreLine.svelte";

    export let score: MatchScores2022;

    function autoNavPoints(nav: AutoNavigation2022): number {
        return {
            [AutoNavigation2022.None]: 0,
            [AutoNavigation2022.Terminal]: 2,
            [AutoNavigation2022.Signal]: 10,
            [AutoNavigation2022.TeamSignal]: 20,
        }[nav]!;
    }

    console.log(score);
</script>

<table colspan="3">
    <TradScoresHeader {score} />

    <TradScoreLine {score} heading name="Auto" getProp={(a) => a.autoPoints} />
    <TradScoreLine
        {score}
        name="Auto Navigation Points"
        getProp={(a) => a.autoNavigationPoints}
        subProps={[
            ["Robot 1", (a) => autoNavPoints(a.autoNavigation12022)],
            ["Robot 2", (a) => autoNavPoints(a.autoNavigation22022)],
        ]}
    />
    <TradScoreLine
        {score}
        name="Cone Points"
        getProp={(a) => a.autoConePoints}
        subProps={[
            ["Terminal", (a) => a.autoTerminalCones],
            ["Ground", (a) => a.autoGroundCones * 2],
            ["Low", (a) => a.autoLowCones * 3],
            ["Medium", (a) => a.autoMediumCones * 4],
            ["High", (a) => a.autoHighCones * 5],
        ]}
    />

    <TradScoreLine {score} heading name="Driver-Controlled" getProp={(a) => a.dcPoints} />
    <TradScoreLine {score} name="Terminal" getProp={(a) => a.dcTerminalCones} />
    <TradScoreLine {score} name="Ground" getProp={(a) => a.dcGroundCones * 2} />
    <TradScoreLine {score} name="Low" getProp={(a) => a.dcLowCones * 3} />
    <TradScoreLine {score} name="Medium" getProp={(a) => a.dcMediumCones * 4} />
    <TradScoreLine {score} name="High" getProp={(a) => a.dcHighCones * 5} />

    <TradScoreLine {score} heading name="Endgame" getProp={(a) => a.endgamePoints} />
    <TradScoreLine
        {score}
        name="Endgame Navigation Points"
        getProp={(a) => a.endgameNavigationPoints}
        subProps={[
            ["Robot 1", (a) => (a.endgameNavigated1 ? 2 : 0)],
            ["Robot 2", (a) => (a.endgameNavigated2 ? 2 : 0)],
        ]}
    />
    <TradScoreLine
        {score}
        name="Ownership Points"
        getProp={(a) => a.ownershipPoints}
        subProps={[
            ["Regular", (a) => a.coneOwnedJunctions * 3],
            ["Beacon", (a) => a.beaconOwnedJunctions * 10],
        ]}
    />
    <TradScoreLine {score} name="Circuit Points" getProp={(a) => a.circuitPoints} />

    <TradScoreLine {score} heading name="Penalties" getProp={(a) => a.penaltyPoints} />
    <TradScoreLine {score} name="Major Penalty Points" getProp={(a) => a.majorPenalties * -30} />
    <TradScoreLine {score} name="Minor Penalty Points" getProp={(a) => a.minorPenalties * -10} />
</table>

<style>
    table {
        display: block;
    }
</style>
