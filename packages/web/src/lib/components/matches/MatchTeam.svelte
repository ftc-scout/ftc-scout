<script lang="ts">
    import { CURRENT_SEASON } from "@ftc-scout/common";
    import { Alliance, type FullMatchFragment } from "../../graphql/generated/graphql-operations";

    export let team: FullMatchFragment["teams"][number];
    export let eventCode: string;
    export let season: number;
    export let focusedTeam: number | null;
    export let winner: boolean;
    export let span: number;

    $: number = team.team.number;
    $: name = team.team.name;

    $: surrogate = team.surrogate;
    $: dq = team.dq;
    $: noShow = team.noShow;
    $: onField = team.onField;

    $: title =
        `${number} ${name}` +
        (noShow ? " (No Show)" : "") +
        (dq && !noShow ? " (Disqualified)" : "") +
        (!onField && !dq && !noShow ? " (Not on Field)" : "") +
        (surrogate ? " (Surrogate)" : "");
</script>

<td
    style:--span={span}
    class:red={team.alliance == Alliance.Red}
    class:blue={team.alliance == Alliance.Blue}
    class:solo={team.alliance == Alliance.Solo}
    class:not-on-field={!onField}
    class:focused={focusedTeam == number}
    class:winner
    {title}
>
    <a href="/teams/{number}{season == CURRENT_SEASON ? '' : `?season=${season}`}#{eventCode}">
        <span class:dq={dq || noShow}>{number}{surrogate ? "*" : ""}</span>
        <em class="name">{name}</em>
    </a>
</td>

<style>
    td {
        grid-column: span var(--span);
        display: block;

        height: 100%;

        outline: transparent solid 2px;
        transition: outline 0.12s ease 0s;
    }

    a {
        display: flex;
        flex-direction: column;
        align-items: flex-start;

        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        padding: var(--sm-pad);

        cursor: pointer;

        color: inherit;
        text-decoration: none;

        height: 100%;
    }

    .red {
        background: var(--red-team-bg-color);
    }
    .blue {
        background: var(--blue-team-bg-color);
    }

    td:hover {
        z-index: 1;
    }
    .red:hover {
        outline: 2px solid var(--red-team-color);
    }
    .blue:hover {
        outline: 2px solid var(--blue-team-color);
    }
    .solo:hover {
        outline: 2px solid var(--neutral-team-color);
    }

    .focused.red {
        background: var(--red-team-color);
        color: var(--team-text-color);
    }
    .focused.blue {
        background: var(--blue-team-color);
        color: var(--team-text-color);
    }
    .focused.solo {
        background: var(--neutral-team-color);
        color: var(--team-text-color);
    }

    .winner {
        font-weight: 600;
    }

    .not-on-field {
        color: var(--grayed-out-text-color);
    }
    .dq {
        text-decoration: line-through;
    }

    @media (max-width: 1000px) {
        .name {
            display: none;
        }

        a {
            align-items: center;
            justify-content: center;
        }
    }
</style>
