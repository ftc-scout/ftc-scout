<script lang="ts">
    import Card from "$lib/components/Card.svelte";
    import WidthProvider from "$lib/components/WidthProvider.svelte";
    import { getClient } from "$lib/graphql/client";
    import { EventPageDocument } from "$lib/graphql/generated/graphql-operations";
    import { CURRENT_SEASON } from "@ftc-scout/common";

    let season = CURRENT_SEASON;
    let code = "";
    let matchId = "";

    // let q: ReadableQuery<EventPageQuery>;
    $: client = getClient(fetch);
    $: qp = client.query({
        query: EventPageDocument,
        variables: { code, season },
    });

    function copy(d: any) {
        navigator.clipboard.writeText(JSON.stringify(d, null, 2));
    }
</script>

<WidthProvider>
    <Card>
        <form>
            <label for="season">
                Season: <input id="season" type="number" bind:value={season} />
            </label>

            <label for="code">Event Code: <input id="code" bind:value={code} /> </label>
            <label for="code">Match Id: <input id="match" bind:value={matchId} /> </label>
        </form>
    </Card>

    <Card>
        {#await qp}
            ...Loading
        {:then q}
            {@const matches = q.data.eventByCode?.matches.filter((m) => m.id == +matchId)}
            {@const event = {
                ...q.data.eventByCode,
                matches: undefined,
                teams: undefined,
                awards: undefined,
            }}

            <button on:click={() => copy({ matches, event })}>Copy</button>
            <pre>{JSON.stringify({ matches, event }, null, 2)}</pre>
        {/await}
    </Card>
</WidthProvider>

<style>
    form {
        display: flex;
        justify-content: space-between;
    }
</style>
