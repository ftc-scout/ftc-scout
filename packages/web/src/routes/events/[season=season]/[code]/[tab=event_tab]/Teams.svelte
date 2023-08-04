<script lang="ts">
    import { getContext } from "svelte";
    import { TEAM_CLICK_ACTION_CONTEXT } from "$lib/components/matches/MatchTeam.svelte";
    import type { EventPageQuery } from "$lib/graphql/generated/graphql-operations";

    export let teams: NonNullable<EventPageQuery["eventByCode"]>["teams"];
    export let focusedTeam: number | null;

    let clickAction = getContext(TEAM_CLICK_ACTION_CONTEXT) as (_: number) => void | undefined;
</script>

<ul>
    {#each teams as team}
        <li>
            <button
                class:selected={focusedTeam == team.teamNumber}
                on:click={() => clickAction && clickAction(team.teamNumber)}
            >
                {team.team.number} - {team.team.name}
            </button>
        </li>
    {/each}
</ul>

<style>
    li {
        list-style: none;
    }

    button {
        background: none;
        border: none;
        font-size: inherit;
        text-align: inherit;

        display: block;
        width: 100%;

        padding: var(--md-pad);
        border-radius: 4px;
        cursor: pointer;
    }

    button:hover {
        background: var(--hover-color);
    }

    button.selected {
        background-color: var(--neutral-team-color);
        color: var(--team-text-color);
    }
</style>
