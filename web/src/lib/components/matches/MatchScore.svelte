<script lang="ts">
    export let red: number;
    export let blue: number;
    export let winner: "RED" | "BLUE" | "TIE";
</script>

<td style:width="6.25em">
    <div>
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

    div {
        display: flex;
        align-items: baseline;
        justify-content: space-around;
    }

    td {
        display: inline-block;
    }
</style>
