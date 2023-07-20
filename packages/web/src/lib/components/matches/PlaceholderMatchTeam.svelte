<script lang="ts">
    import { Alliance } from "@ftc-scout/common";

    export let alliance: "Red" | "Blue";
    export let span: number;
</script>

<td
    class:red={alliance == Alliance.Red}
    class:blue={alliance == Alliance.Blue}
    style:--span={span}
/>

<style>
    td {
        display: block;
        grid-column: span var(--span);
    }
</style>
