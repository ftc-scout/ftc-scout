<script lang="ts">
    import { faBinoculars } from "@fortawesome/free-solid-svg-icons";
    import type { FullMatchFragment } from "../../../graphql/generated/graphql-operations";
    import Button from "../../ui/Button.svelte";
    import { Season } from "@ftc-scout/common";
    import PowerPlayVisModal from "./2022/PowerPlayVisModal.svelte";
    import type { SimpleTeamMatchParticipation } from "./2022/HoverInfo.svelte";

    export let scores: FullMatchFragment["scores"];
    export let teams: SimpleTeamMatchParticipation[];
    export let matchDescription: string;

    let shown2022 = false;
</script>

{#if scores && scores.__typename == "MatchScores2022"}
    <PowerPlayVisModal bind:shown={shown2022} {matchDescription} {scores} {teams} />
{/if}

<!-- // HELP: Season Specific -->
{#if scores && scores.season == Season.PowerPlay}
    <div>
        <Button icon={faBinoculars} on:click={() => (shown2022 = true)}>View Cone Layout</Button>
    </div>
{/if}

<style>
    div {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: var(--lg-gap);
    }
</style>
