<script lang="ts">
    import type { FullStatsFragment } from "../../graphql/generated/graphql-operations";
    import EventStats2021Trad from "./EventStats2021Trad.svelte";
    import EventStats2021Remote from "./EventStats2021Remote.svelte";
    import EventStats2020Trad from "./EventStats2020Trad.svelte";
    import EventStats2020Remote from "./EventStats2020Remote.svelte";
    import EventStats2019 from "./EventStats2019.svelte";

    export let stats: {
        team: {
            number: number;
            name: string;
        };
        stats: FullStatsFragment;
    }[];

    export let selectedTeam: number | null = null;
    export let eventName: string;

    let type:
        | "TeamEventStats2021Traditional"
        | "TeamEventStats2021Remote"
        | "TeamEventStats2020Traditional"
        | "TeamEventStats2020Remote"
        | "TeamEventStats2019"
        | null;
    $: type = stats.length == 0 ? null : stats[0].stats.__typename ?? null;

    function force<T, U>(t: T) {
        return t as unknown as U;
    }
</script>

{#if type == "TeamEventStats2021Traditional"}
    <EventStats2021Trad data={force(stats)} bind:selectedTeam {eventName} />
{:else if type == "TeamEventStats2021Remote"}
    <EventStats2021Remote data={force(stats)} bind:selectedTeam {eventName} />
{:else if type == "TeamEventStats2020Traditional"}
    <EventStats2020Trad data={force(stats)} bind:selectedTeam {eventName} />
{:else if type == "TeamEventStats2020Remote"}
    <EventStats2020Remote data={force(stats)} bind:selectedTeam {eventName} />
{:else if type == "TeamEventStats2019"}
    <EventStats2019 data={force(stats)} bind:selectedTeam {eventName} />
{/if}
