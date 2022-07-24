<script lang="ts">
    import Card from "../Card.svelte";

    export let rows: number;
    export let card = true;
    export let header = true;

    const lens = ["90%", "75%", "60%", "80%"];
</script>

{#if card}
    <Card>
        {#if header}
            <span
                class="title"
                style:width="75%"
                style:margin-bottom="calc(var(--large-gap) * 1.5)"
                style:margin-top="calc(var(--large-gap) * 1.5)"
            />
        {/if}
        {#each Array(rows) as _, i}
            <span style:width={lens[i % lens.length]} />
        {/each}
    </Card>
{:else}
    {#if header}
        <span
            class="title"
            style:width="75%"
            style:margin-bottom="calc(var(--large-gap) * 1.5)"
            style:margin-top="calc(var(--large-gap) * 1.5)"
        />
    {/if}
    {#each Array(rows) as _, i}
        <span style:width={lens[i % lens.length]} />
    {/each}
{/if}

<style>
    span {
        /* width: 100%; */
        height: 1em;
        background: linear-gradient(
                to right,
                rgba(255, 255, 255, 0),
                rgba(255, 255, 255, 0.25) 50%,
                rgba(255, 255, 255, 0) 80%
            ),
            #eeeeee;
        background-repeat: repeat-y;
        background-size: 10em 200px;
        background-position: 0 0;
        animation: shine 2.5s infinite;
        display: block;
    }

    @keyframes shine {
        to {
            background-position: 100% 0, /* move highlight to right */ 0 0;
        }
    }

    .title {
        height: 2em;
    }

    span:not(:last-child) {
        margin-bottom: var(--large-gap);
    }
</style>
