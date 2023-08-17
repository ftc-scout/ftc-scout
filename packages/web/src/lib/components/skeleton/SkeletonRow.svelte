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
            <span class="title" />
        {/if}
        {#each Array(rows) as _, i}
            <span style:width={lens[i % lens.length]} />
        {/each}
    </Card>
{:else}
    {#if header}
        <span class="title" />
    {/if}
    {#each Array(rows) as _, i}
        <span style:width={lens[i % lens.length]} />
    {/each}
{/if}

<style>
    span {
        height: 1em;
        background: linear-gradient(
                to right,
                rgba(255, 255, 255, 0),
                rgba(var(--fg-color-vs), 0.25) 50%,
                rgba(255, 255, 255, 0) 80%
            ),
            var(--bg-color);
        background-repeat: repeat-y;
        background-size: 10em 200px;
        background-position: 0 0;
        animation: shine 2.5s infinite;
        display: block;
        border-radius: 4px;
    }

    @keyframes shine {
        to {
            background-position: 100% 0, /* move highlight to right */ 0 0;
        }
    }

    .title {
        height: 2em;
        width: 75%;
    }

    span:not(:last-child) {
        margin-bottom: var(--lg-gap);
    }
</style>
