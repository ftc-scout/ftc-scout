<script lang="ts">
    import { DATA_FROM_FIRST_ICON } from "../icons";

    import InfoIconRow from "./InfoIconRow.svelte";
</script>

<InfoIconRow icon={DATA_FROM_FIRST_ICON}>
    <a href="https://ftc-events.firstinspires.org/services/API" tabindex="-1">
        Data from <em>FIRST</em>
    </a>
</InfoIconRow>

<style>
    a {
        color: inherit;
    }
</style>
