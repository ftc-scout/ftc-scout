<script lang="ts">
    import type { MatchScores2021Remote } from "../../../graphql/generated/graphql-operations";
    import RemoteScoreLine from "./RemoteScoreLine.svelte";
    import RemoteScoresHeader from "./RemoteScoresHeader.svelte";

    export let score: MatchScores2021Remote;
    export let teamNumber: number;
</script>

<table colspan="2">
    <RemoteScoresHeader {score} {teamNumber} />

    <RemoteScoreLine {score} heading name="Auto" getProp={(a) => a.autoPoints} />
    <RemoteScoreLine
        {score}
        name="Freight Points"
        getProp={(a) => a.autoFreightPoints}
        subProps={[
            ["Level 1", (a) => a.autoFreight1 * 6],
            ["Level 2", (a) => a.autoFreight2 * 6],
            ["Level 3", (a) => a.autoFreight3 * 6],
        ]}
    />
    <RemoteScoreLine {score} name="Carousel Points" getProp={(a) => a.autoCarouselPoints} />
    <RemoteScoreLine {score} name="Navigation Points" getProp={(a) => a.autoNavigationPoints} />
    <RemoteScoreLine {score} name="Bonus Points" getProp={(a) => a.autoBonusPoints} />

    <RemoteScoreLine {score} heading name="Driver-Controlled" getProp={(a) => a.driverControlledPoints} />
    <RemoteScoreLine
        {score}
        name="Alliance Hub Points"
        getProp={(a) => a.driverControlledAllianceHubPoints}
        subProps={[
            ["Level 1", (a) => a.driverControlledFreight1 * 2],
            ["Level 2", (a) => a.driverControlledFreight2 * 4],
            ["Level 3", (a) => a.driverControlledFreight3 * 6],
        ]}
    />
    <RemoteScoreLine {score} name="Storage Points" getProp={(a) => a.driverControlledStoragePoints} />

    <RemoteScoreLine {score} heading name="Endgame" getProp={(a) => a.endgamePoints} />
    <RemoteScoreLine {score} name="Delivery Points" getProp={(a) => a.endgameDeliveryPoints} />
    <RemoteScoreLine {score} name="Capping Points" getProp={(a) => a.cappingPoints} />
    <RemoteScoreLine {score} name="Parking Points" getProp={(a) => a.endgameParkingPoints} />
    <RemoteScoreLine {score} name="Balanced Points" getProp={(a) => a.allianceBalancedPoints} />

    <RemoteScoreLine {score} heading name="Penalties" getProp={(a) => a.penaltyPoints} />
    <RemoteScoreLine {score} name="Major Penalty Points" getProp={(a) => a.majorPenalties * -30} />
    <RemoteScoreLine {score} name="Minor Penalty Points" getProp={(a) => a.minorPenalties * -10} />
</table>

<style>
    table {
        display: block;
    }
</style>
