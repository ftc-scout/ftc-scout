<script lang="ts">
    export let red: number;
    export let blue: number;
    export let winner: "RED" | "BLUE";
</script>

<td style:width="10ch">
    <div>
        <span class="o l" class:winner={winner == "RED"}> {red} </span>
        <span>-</span>
        <span class="o r" class:winner={winner == "BLUE"}> {blue} </span>
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

    div {
        display: flex;
        align-items: baseline;
        justify-content: space-around;
    }

    td {
        display: inline-block;
    }
</style>
