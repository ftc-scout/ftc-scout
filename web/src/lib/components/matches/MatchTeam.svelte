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
    export let focused = false;
    export let border = false;

    $: number = team.team.number;
    $: name = team.team.name;

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

    $: title =
        `${number} ${name}` +
        (dq ? " (Disqualified)" : "") +
        (noShow ? " (No Show)" : "") +
        (surrogate ? " (Surrogate)" : "");
</script>

<td
    class:red
    class:blue
    class:solo
    class:border
    class:focused
    class:not-on-field={!team.onField}
    style:max-width={width}
    style:min-width={width}
>
    <div class="wrap">
        <a href={`/teams/${number}`} {title} class:winner>
            <span class:dq={dq || noShow}>{number}{surrogate ? "*" : ""}</span>
            <em class="maybe-hide">{name}</em>
        </a>
    </div>
</td>

<style>
    td {
        outline: transparent solid 2px;
        transition: outline 0.12s ease 0s;
        width: 100%;

        display: inline-block;
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

    a {
        display: flex;
        flex-direction: column;
        align-items: flex-start;

        text-decoration: none;
        color: inherit;

        padding: var(--small-padding);
    }

    .wrap {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: block;

        width: 100%;
    }

    @media (max-width: 1000px) {
        .maybe-hide {
            display: none;
        }

        a {
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
        color: white;
    }

    .focused.blue {
        background-color: var(--color-team-blue);
        color: white;
    }
</style>
