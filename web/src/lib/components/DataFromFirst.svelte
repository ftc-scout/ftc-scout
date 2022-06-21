<script lang="ts">
    import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
    import InfoIconRow from "./InfoIconRow.svelte";
</script>

<InfoIconRow icon={faCircleCheck}>
    <a href="https://ftc-events.firstinspires.org/services/API">
        Data from <em>FIRST</em>
    </a>
</InfoIconRow>

<style>
    a {
        color: inherit;
    }
</style>
