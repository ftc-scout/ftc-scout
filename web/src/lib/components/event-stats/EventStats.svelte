<script lang="ts">
    import type { FullStatsFragment } from "../../graphql/generated/graphql-operations";
    import EventStats2021Trad from "./EventStats2021Trad.svelte";

    export let stats: {
        team: {
            number: number;
            name: string;
        };
        stats: FullStatsFragment;
    }[];

    export let selectedTeam: number | null = null;

    let type: "TeamEventStats2021Traditional" | "TeamEventStats2021Remote" | null;
    $: type = stats.length == 0 ? null : stats[0].stats.__typename ?? null;

    function force<T, U>(t: T) {
        return t as unknown as U;
    }
</script>

{#if type == "TeamEventStats2021Traditional"}
    <EventStats2021Trad stats={force(stats)} bind:selectedTeam />
{:else if type == "TeamEventStats2021Remote"}
    TODO
{/if}
