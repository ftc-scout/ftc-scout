<script lang="ts">
    import { getContext } from "svelte";
    import { TEAM_CLICK_ACTION_CTX } from "$lib/components/matches/MatchTeam.svelte";
    import type { EventPageQuery } from "$lib/graphql/generated/graphql-operations";
    import { CURRENT_SEASON } from "@ftc-scout/common";
    import { browser } from "$app/environment";
    import Location from "../../../../../lib/components/Location.svelte";

    export let teams: NonNullable<EventPageQuery["eventByCode"]>["teams"];
    export let focusedTeam: number | null;

    let clickAction = getContext(TEAM_CLICK_ACTION_CTX) as
        | ((num: number, name: string) => void)
        | undefined;
</script>

<ul>
    {#each teams as team}
        <li>
            <a
                href="/teams/{team.teamNumber}{team.season == CURRENT_SEASON
                    ? ''
                    : `?season=${team.season}`}#{team.eventCode}"
                class:selected={focusedTeam == team.teamNumber}
                role={browser && clickAction ? "button" : "link"}
                on:click={(e) => {
                    if (clickAction) {
                        e.preventDefault();
                        clickAction(team.teamNumber, team.team.name);
                    }
                }}
            >
                <span>{team.team.number} - <em>{team.team.name}</em></span>
                <em class="loc"> &nbsp <Location {...team.team.location} link={false} /></em>
            </a>
        </li>
    {/each}
</ul>

<style>
    li {
        list-style: none;
    }

    .loc {
        color: var(--secondary-text-color);
        white-space: nowrap;
    }

    a {
        color: inherit;
        text-decoration: none;

        background: none;
        border: none;
        font-size: inherit;
        text-align: inherit;

        display: flex;
        justify-content: space-between;
        width: 100%;

        padding: var(--md-pad);
        border-radius: 4px;
        cursor: pointer;
    }

    a:hover {
        background: var(--hover-color);
    }

    a.selected {
        background-color: var(--neutral-team-color);
        color: var(--team-text-color);
    }

    a.selected .loc {
        color: var(--team-text-color);
    }
</style>
