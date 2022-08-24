<script lang="ts">
    import TradScoresHeader from "./TradScoresHeader.svelte";
    import type { MatchScores2019 } from "../../../graphql/generated/graphql-operations";
    import TradScoreLine from "./TradScoreLine.svelte";

    export let score: MatchScores2019;
</script>

<table colspan="3">
    <TradScoresHeader {score} />

    <TradScoreLine {score} heading name="Auto" getProp={(a) => a.autoPoints} />
    <TradScoreLine
        {score}
        name="Auto Transport Points"
        getProp={(a) => a.autoDeliveryPoints}
        subProps={[
            ["Skystones", (a) => a.autoSkystoneDeliveredFirst * 10],
            ["Regular Stones", (a) => (a.autoStonesDelivered - a.autoSkystoneDeliveredFirst) * 2],
            ["Returned", (a) => a.autoReturned * -2 + (a.autoFirstReturnedSkystone ? -8 : 0)],
        ]}
    />
    <TradScoreLine {score} name="Placement Points" getProp={(a) => a.autoPlacementPoints} />
    <TradScoreLine {score} name="Repositioning Points" getProp={(a) => a.autoRepositioningPoints} />
    <TradScoreLine
        {score}
        name="Navigation Points"
        getProp={(a) => a.autoNavigationPoints}
        subProps={[
            ["Robot 1", (a) => (a.navigated1 ? 5 : 0)],
            ["Robot 2", (a) => (a.navigated2 ? 5 : 0)],
        ]}
    />

    <TradScoreLine {score} heading name="Driver-Controlled" getProp={(a) => a.dcPoints} />
    <TradScoreLine
        {score}
        name="DC Transport Points"
        getProp={(a) => a.dcDeliveryPoints}
        subProps={[
            ["Delivered", (a) => a.dcStonesDelivered],
            ["Returned", (a) => -a.dcReturned],
        ]}
    />
    <TradScoreLine {score} name="Placement Points" getProp={(a) => a.dcPlacementPoints} />
    <TradScoreLine {score} name="Skyscrapper Points" getProp={(a) => a.dcSkyscraperBonusPoints} />

    <TradScoreLine {score} heading name="Endgame" getProp={(a) => a.endgamePoints} />
    <TradScoreLine
        {score}
        name="Capping Points"
        getProp={(a) => a.cappingPoints}
        subProps={[
            ["Robot 1", (a) => (a.capLevel1 == -1 ? 0 : a.capLevel1 + 5)],
            ["Robot 2", (a) => (a.capLevel2 == -1 ? 0 : a.capLevel2 + 5)],
        ]}
    />
    <TradScoreLine {score} name="Moving Points" getProp={(a) => a.foundationMovedPoints} />
    <TradScoreLine
        {score}
        name="Parking Points"
        getProp={(a) => a.parkingPoints}
        subProps={[
            ["Robot 1", (a) => (a.parked1 ? 5 : 0)],
            ["Robot 2", (a) => (a.parked2 ? 5 : 0)],
        ]}
    />

    <TradScoreLine {score} heading name="Penalties" getProp={(a) => a.penaltyPoints} />
    <TradScoreLine {score} name="Major Penalty Points" getProp={(a) => a.majorPenalties * -20} />
    <TradScoreLine {score} name="Minor Penalty Points" getProp={(a) => a.minorPenalties * -5} />
</table>

<style>
    table {
        display: block;
    }
</style>
