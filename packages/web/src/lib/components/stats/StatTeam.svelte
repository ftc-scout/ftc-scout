<script lang="ts">
    import { browser } from "$app/environment";
    import { getContext } from "svelte";
    import { TEAM_CLICK_ACTION_CTX } from "../matches/MatchTeam.svelte";
    import { CURRENT_SEASON, type StatValue } from "@ftc-scout/common";
    import { page } from "$app/stores";
    import TeamAvatar from "$lib/components/TeamAvatar.svelte";

    export let val: Extract<StatValue, { ty: "team" }>;
    export let eventCode: string | null = null;
    export let focusedTeam: number | null;
    $: number = val.number;
    $: name = val.name;
    $: href = `/teams/${number}`;
    $: season = Number($page.params.season ?? CURRENT_SEASON);

    let clickAction = getContext(TEAM_CLICK_ACTION_CTX) as
        | ((num: number, name: string, eventCode: string | null) => void)
        | undefined;
</script>

<td
    class:focused={number == focusedTeam}
    class="inner-hover"
    title="{number} {name}"
    on:click={(e) => {
        if (clickAction) {
            e.preventDefault();
            e.stopPropagation();
            clickAction(number, name, eventCode);
        }
    }}
>
    <a class="wrap" {href} role={browser && clickAction ? "button" : "link"}>
        <TeamAvatar {number} {season} size="2em" />
        <div class="text">
            <span> {number} </span>
            <em class="name">{name}</em>
        </div>
    </a>
</td>

<style>
    td {
        outline: transparent 2px solid;
        outline-offset: -2px;
        transition: outline 0.12s ease 0s;
    }

    td:hover {
        outline: 2px solid var(--neutral-team-color);
        z-index: var(--focused-row-zi);
    }

    a {
        display: flex;
        align-items: center;
        gap: var(--md-gap);

        text-decoration: none;
        color: inherit;

        padding: var(--sm-pad);
    }

    .text {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }

    .text * {
        display: block;
        min-width: 100%;
        width: 20ch;
        max-width: 100%;

        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        padding-right: calc(1px); /* don't cut italics */
    }

    @media (max-width: 600px) {
        a {
            padding: var(--sm-pad);
        }

        .text * {
            width: 14ch;
        }
    }

    .focused {
        color: var(--team-text-color);
        background-color: var(--neutral-team-color);
    }
</style>
