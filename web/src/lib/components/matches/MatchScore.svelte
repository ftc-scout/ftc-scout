<script lang="ts">
    export let red: number | null = null;
    export let blue: number | null = null;
    export let solo: number | null = null;
    export let winner: "RED" | "BLUE" | "TIE" | "SOLO";
    export let description: string;
</script>

<td style:width="10.75em" on:click>
    <div class="wrapper">
        <div
            class:red={winner == "RED"}
            class:blue={winner == "BLUE"}
            class:tie={winner == "TIE"}
        >
            <strong>{description}</strong>
        </div>

        <div class="score" style:width="6.25em">
            {#if winner == "SOLO"}
                <b>{solo}</b>
            {:else}
                <span
                    class="o l"
                    class:winner={winner == "RED"}
                    class:tie={winner == "TIE"}
                >
                    {red}
                </span>
                <span>-</span>
                <span
                    class="o r"
                    class:winner={winner == "BLUE"}
                    class:tie={winner == "TIE"}
                >
                    {blue}
                </span>
            {/if}
        </div>
    </div>
</td>

<style>
    .l {
        text-align: right;
        width: 100%;
        padding-right: var(--small-gap);
    }

    .l.winner {
        color: var(--color-team-red);
        font-weight: bold;
    }

    .r {
        text-align: left;
        width: 100%;
        padding-left: var(--small-gap);
    }

    .r.winner {
        color: var(--color-team-blue);
        font-weight: bold;
    }

    .tie {
        color: var(--color-team-neutral);
        font-weight: bold;
    }

    .score {
        display: flex;
        align-items: baseline;
        justify-content: space-around;
    }

    .wrapper {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    td {
        display: table-cell;
        padding-left: var(--gap);

        outline: transparent solid 2px;
        transition: outline 0.12s ease 0s;

        cursor: pointer;
    }

    td:hover {
        outline: 2px solid var(--color-team-neutral);
        z-index: 1;
    }

    .red {
        color: var(--color-team-red);
    }

    .blue {
        color: var(--color-team-blue);
    }

    .tie {
        color: var(--color-team-neutral);
    }
</style>
