<script lang="ts">
    import { Station } from "$lib/graphql/generated/graphql-operations";

    export let width: string;
    export let team: {
        station: Station;
        team: { number: number; name: string };
    };
    export let winner: boolean;

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
</script>

<td
    class:red
    class:blue
    class:solo
    style:max-width={width}
    style:min-width={width}
>
    <div class="wrap">
        <a href={`/teams/${number}`} title={`${number} ${name}`} class:winner>
            <span>{number}</span>
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
</style>
