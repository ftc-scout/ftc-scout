<script lang="ts">
    import type { Stat } from "../../../util/stats/Stat";
    import type { StatGroup } from "../../../util/stats/StatsSet";
    import ShowData from "./ShowData.svelte";

    type T = $$Generic;

    export let data: T;
    export let group: StatGroup<T, unknown>;
    export let stat: Stat<T>;
</script>

<td class={`${group.color} group`}>
    <div>
        <ShowData {stat} {data} />
    </div>
</td>

<style>
    td.group {
        min-width: 75px;
        width: 75px;
    }

    @media (max-width: 700px) {
        td.group {
            min-width: 50px;
            width: 50px;
        }
    }

    td.group div {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;

        font-weight: normal;
    }

    .white {
        font-weight: bold;
    }

    .red {
        background: var(--red-stat-color-transparent);
    }

    .blue {
        background: var(--blue-stat-color-transparent);
    }

    .light-blue {
        background: var(--light-blue-stat-color-transparent);
    }

    .green {
        background: var(--green-stat-color-transparent);
    }

    .purple {
        background: var(--purple-stat-color-transparent);
    }
</style>
