<script lang="ts">
    export let teams: {
        number: number;
        name: string;
    }[];
    export let selectedTeam: number | null;

    function handleClick(teamNumber: number) {
        if (teamNumber == selectedTeam) {
            selectedTeam = null;
        } else {
            selectedTeam = teamNumber;
        }
    }
</script>

<ol>
    {#each teams.sort((a, b) => a.number - b.number) as team}
        <li>
            <div class:selected={team.number == selectedTeam} on:click={() => handleClick(team.number)}>
                {team.number} - {team.name}
            </div>
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

    div {
        color: inherit;
        text-decoration: none;

        display: block;
        width: 100%;
        height: 100%;

        padding: var(--padding);

        border-radius: 4px;

        cursor: pointer;
    }

    div.selected {
        background-color: var(--color-team-neutral);
        color: var(--color-team-text);
    }

    li:hover {
        background: var(--hover-color);
    }
</style>
