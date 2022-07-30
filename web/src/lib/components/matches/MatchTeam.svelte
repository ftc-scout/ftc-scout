<script lang="ts">
    import { Station } from "$lib/graphql/generated/graphql-operations";

    export let width: string;
    export let team: {
        station: Station;
        surrogate: boolean;
        dq?: boolean | null;
        noShow: boolean;
        onField?: boolean | null;
        team: { number: number; name: string };
    };
    export let winner: boolean;
    export let selectedTeam: number | null = null;
    export let eventCode: string;
    export let border = false;
    export let frozen: boolean;

    $: number = team.team.number;
    $: name = team.team.name;

    $: focused = number == selectedTeam;

    $: color = {
        [Station.Red_1]: "red",
        [Station.Red_2]: "red",
        [Station.Red_3]: "red",
        [Station.Blue_1]: "blue",
        [Station.Blue_2]: "blue",
        [Station.Blue_3]: "blue",
        [Station.Solo]: "solo",
    }[team.station];
    $: red = color == "red";
    $: blue = color == "blue";
    $: solo = color == "solo";

    $: dq = !!team.dq && !solo;
    $: noShow = team.noShow && !solo;
    $: surrogate = team.surrogate;
    $: onField = team.onField;

    $: title =
        `${number} ${name}` +
        (noShow ? " (No Show)" : "") +
        (dq && !noShow ? " (Disqualified)" : "") +
        (!onField && !dq && !noShow ? " (Not on Field)" : "") +
        (surrogate ? " (Surrogate)" : "");

    function handleClick() {
        if (!frozen) {
            if (focused) {
                selectedTeam = null;
            } else {
                selectedTeam = number;
            }
        }
    }
</script>

<td
    class:red
    class:blue
    class:solo
    class:border
    class:focused
    class:not-on-field={!onField}
    style:max-width={width}
    style:min-width={width}
    on:click={handleClick}
>
    <div class="wrap">
        {#if frozen}
            <a sveltekit:prefetch href={`/teams/${number}#${eventCode}`} class="inner" {title} class:winner>
                <span class:dq={dq || noShow}>
                    {number}{surrogate ? "*" : ""}
                </span>
                <em class="maybe-hide">{name}</em>
            </a>
        {:else}
            <div class="inner" {title} class:winner>
                <span class:dq={dq || noShow}>
                    {number}{surrogate ? "*" : ""}
                </span>
                <em class="maybe-hide">{name}</em>
            </div>
        {/if}
    </div>
</td>

<style>
    td {
        outline: transparent solid 2px;
        transition: outline 0.12s ease 0s;

        display: table-cell;
    }

    td.red {
        background-color: var(--color-team-red-transparent);
    }

    td.red:hover {
        outline: 2px solid var(--color-team-red);
    }

    td.blue {
        background-color: var(--color-team-blue-transparent);
    }

    td.blue:hover {
        outline: 2px solid var(--color-team-blue);
    }

    td.solo:hover {
        outline: 2px solid var(--color-team-neutral);
    }

    td:hover {
        z-index: 1;
    }

    td.border {
        border-right: 2px solid lightgray;
        clip-path: inset(-2px -0.5px -2px -2px);
    }

    td.border.solo:hover {
        border-right: 2px solid var(--color-team-neutral); /* This is quite the hack */
    }

    td.border.red:hover {
        border-right: 2px solid var(--color-team-red); /* This is quite the hack */
    }

    td.border.blue:hover {
        border-right: 2px solid var(--color-team-blue); /* This is quite the hack */
    }

    .inner {
        height: 100%;

        display: flex;
        flex-direction: column;
        align-items: flex-start;

        text-decoration: none;
        color: inherit;

        padding: var(--small-padding);

        cursor: pointer;
    }

    .wrap {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: block;

        width: 100%;
        height: 100%;
    }

    @media (max-width: 1000px) {
        .maybe-hide {
            display: none;
        }

        .inner {
            align-items: center;
            justify-content: center;
        }
    }

    .winner {
        font-weight: 600;
    }

    .dq {
        text-decoration: line-through;
    }

    .not-on-field {
        color: gray;
    }

    .focused.red {
        background-color: var(--color-team-red);
        color: var(--color-team-text);
    }

    .focused.blue {
        background-color: var(--color-team-blue);
        color: var(--color-team-text);
    }

    .focused.solo {
        background-color: var(--color-team-neutral);
        color: var(--color-team-text);
    }
</style>
