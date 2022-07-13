<script lang="ts">
    import A from "../../routes/events/[season]/[code]/[...tab].svelte";

    export let teams: {
        number: number;
        name: string;
    }[];
</script>

<ol>
    {#each teams.sort((a, b) => a.number - b.number) as team}
        <li>
            <a sveltekit:prefetch href={`/teams/${team.number}`}>
                {team.number} - {team.name}
            </a>
        </li>
    {/each}
</ol>

<style>
    ol {
        margin: var(--gap);
        padding: 0;
    }

    li {
        list-style: none;
        margin: 0;

        padding: 0;

        display: block;
        width: 100%;
    }

    a {
        color: inherit;
        text-decoration: none;

        display: block;
        width: 100%;
        height: 100%;

        padding: var(--padding);
    }

    li:hover {
        background: var(--hover-color);
    }
</style>
