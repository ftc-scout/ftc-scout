<script lang="ts">
    import TradScoresHeader from "./TradScoresHeader.svelte";

    import type { MatchScores2021Traditional } from "../../../graphql/generated/graphql-operations";
    import TradScoreLine from "./TradScoreLine.svelte";
    import {
        autoNavigationPoints2021,
        autoBonusPoints2021,
        endgameParkPoints2021,
    } from "../../../util/points";

    export let score: MatchScores2021Traditional;
</script>

<table colspan="3">
    <TradScoresHeader {score} />

    <TradScoreLine {score} heading name="Auto" getProp={(a) => a.autoPoints} />
    <TradScoreLine
        {score}
        name="Freight Points"
        getProp={(a) => a.autoFreightPoints}
        subProps={[
            ["Level 1", (a) => a.autoFreight1 * 6],
            ["Level 2", (a) => a.autoFreight2 * 6],
            ["Level 3", (a) => a.autoFreight3 * 6],
            ["Storage", (a) => a.autoStorageFreight * 2],
        ]}
    />
    <TradScoreLine
        {score}
        name="Carousel Points"
        getProp={(a) => a.autoCarouselPoints}
    />
    <TradScoreLine
        {score}
        name="Navigation Points"
        getProp={(a) => a.autoNavigationPoints}
        subProps={[
            ["Robot 1", (a) => autoNavigationPoints2021(a.autoNavigation1)],
            ["Robot 2", (a) => autoNavigationPoints2021(a.autoNavigation2)],
        ]}
    />
    <TradScoreLine
        {score}
        name="Bonus Points"
        getProp={(a) => a.autoBonusPoints}
        subProps={[
            [
                "Robot 1",
                (a) => autoBonusPoints2021(a.autoBonus1, a.barcodeElement1),
            ],
            [
                "Robot 2",
                (a) => autoBonusPoints2021(a.autoBonus2, a.barcodeElement2),
            ],
        ]}
    />

    <TradScoreLine
        {score}
        heading
        name="Driver-Controlled"
        getProp={(a) => a.driverControlledPoints}
    />
    <TradScoreLine
        {score}
        name="Alliance Hub Points"
        getProp={(a) => a.driverControlledAllianceHubPoints}
        subProps={[
            ["Level 1", (a) => a.driverControlledFreight1 * 2],
            ["Level 2", (a) => a.driverControlledFreight2 * 4],
            ["Level 3", (a) => a.driverControlledFreight3 * 6],
        ]}
    />
    <TradScoreLine
        {score}
        name="Shared Hub Points"
        getProp={(a) => a.driverControlledSharedHubPoints}
    />
    <TradScoreLine
        {score}
        name="Storage Points"
        getProp={(a) => a.driverControlledStoragePoints}
    />

    <TradScoreLine
        {score}
        heading
        name="Endgame"
        getProp={(a) => a.endgamePoints}
    />
    <TradScoreLine
        {score}
        name="Delivery Points"
        getProp={(a) => a.endgameDeliveryPoints}
    />
    <TradScoreLine
        {score}
        name="Capping Points"
        getProp={(a) => a.cappingPoints}
    />
    <TradScoreLine
        {score}
        name="Parking Points"
        getProp={(a) => a.endgameParkingPoints}
        subProps={[
            ["Robot 1", (a) => endgameParkPoints2021(a.endgamePark1)],
            ["Robot 2", (a) => endgameParkPoints2021(a.endgamePark2)],
        ]}
    />
    <TradScoreLine
        {score}
        name="Balanced Points"
        getProp={(a) => a.allianceBalancedPoints}
    />
    <TradScoreLine
        {score}
        name="Tipped Points"
        getProp={(a) => a.sharedUnbalancedPoints}
    />

    <TradScoreLine
        {score}
        heading
        name="Penalties"
        getProp={(a) => a.penaltyPoints}
    />
    <TradScoreLine
        {score}
        name="Major Penalty Points"
        getProp={(a) => a.majorPenalties * -30}
    />
    <TradScoreLine
        {score}
        name="Minor Penalty Points"
        getProp={(a) => a.minorPenalties * -10}
    />
</table>

<style>
    table {
        display: block;
        border-collapse: collapse;
    }
</style>
