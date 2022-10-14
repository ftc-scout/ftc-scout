<script lang="ts">
    import { query, type ReadableQuery } from "svelte-apollo";
    import { EventPageDocument, type EventPageQuery } from "../../../lib/graphql/generated/graphql-operations";

    let season = "2021";
    let code = "";
    let matchId = "";

    let q: ReadableQuery<EventPageQuery>;
    $: q = query(EventPageDocument, {
        variables: {
            season: +season,
            code,
        },
    });
    $: console.log($q);
</script>

<form>
    <label for="season">Season:</label> <input id="season" type="number" bind:value={season} />
    <label for="code">Event Code:</label> <input id="code" bind:value={code} />
    <label for="code">Match Id:</label> <input id="match" bind:value={matchId} />
</form>

{#if matchId == ""}
    <pre>{JSON.stringify($q?.data, null, 2)}</pre>
{:else}
    <pre>{JSON.stringify(
            $q?.data?.eventByCode?.matches?.filter((m) => m.id == +matchId),
            null,
            2
        )}</pre>
{/if}
