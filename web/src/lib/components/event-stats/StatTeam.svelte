<script lang="ts">
    export let team: {
        number: number;
        name: string;
    };
    export let selectedTeam: number | null = null;
    export let frozen = false;

    $: number = team.number;
    $: name = team.name;

    $: focused = number == selectedTeam;

    $: title = `${number} ${name}`;

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

<td class:focused on:click={handleClick}>
    <div class="wrap">
        {#if frozen}
            <a sveltekit:prefetch href={`/teams/${number}`} class="inner" {title}>
                <span> {number} </span>
                <em class="maybe-hide">{name}</em>
            </a>
        {:else}
            <div class="inner" {title}>
                <span> {number} </span>
                <em class="maybe-hide">{name}</em>
            </div>
        {/if}
    </div>
</td>

<style>
    td {
        border: transparent solid 2px;
        transition: border 0.12s ease 0s;
    }

    td:hover {
        z-index: 10;
        border: 2px solid var(--color-team-neutral);
    }

    .inner {
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

    td.focused {
        background-color: var(--color-team-neutral);
        color: var(--color-team-text);
    }
</style>
