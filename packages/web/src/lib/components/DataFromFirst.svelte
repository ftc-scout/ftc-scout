<script lang="ts">
    import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
    import InfoIconRow from "./InfoIconRow.svelte";
</script>

<InfoIconRow icon={faCheckCircle}>
    <a href="https://ftc-events.firstinspires.org/services/API" tabindex="-1">
        Data from <em>FIRST</em>
    </a>
</InfoIconRow>

<style>
    a {
        color: inherit;
    }
</style>
