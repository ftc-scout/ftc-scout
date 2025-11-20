<script lang="ts">
    import { faRobot } from "@fortawesome/free-solid-svg-icons";
    import { Alliance } from "@ftc-scout/common";
    import type { RankingPointType } from "@ftc-scout/common";
    import Fa from "svelte-fa";

    export let rp: RankingPointType;
    export let active: boolean;
    export let alliance: Alliance;

    $: id = rp.id;
    $: name = rp.name;
</script>

<!-- HTML for this section taken from FTC Event Web. For adding future years, simply add a new branch in the conditional and copy over from FTC Event Web.  -->

<span
    class="rpBadge {active ? (alliance == Alliance.Red ? 'red' : 'blue') : 'inactive'}"
    title={alliance + " Alliance " + name + ": " + (active ? "Achieved" : "Not Achieved")}
>
    {#if id == "goalRp"}
        <i
            class="fa-solid"
            style="position: relative;
    width: 1em;
    height: 1em;
    display: inline-block;
    background-image: url(https://ftc-events-cdn.global-prod.ftclive.org/evtwebextFTC/artifact-CfRTbLAy.svg);
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    color: #fff;
    font-size: 2em;"
        />
    {:else if id == "movementRp"}
        <Fa size="2x" icon={faRobot} class="fa-solid" />
    {:else if id == "patternRp"}
        <i
            class="fa-solid"
            style="    position: relative;
width: 3em;
height: 1em;
margin: .06em;
display: inline-block;
background-image: url(https://ftc-events-cdn.global-prod.ftclive.org/evtwebextFTC/artifact-CfRTbLAy.svg), url(https://ftc-events-cdn.global-prod.ftclive.org/evtwebextFTC/artifact-CfRTbLAy.svg), url(https://ftc-events-cdn.global-prod.ftclive.org/evtwebextFTC/artifact-CfRTbLAy.svg);
background-size: .425em .425em, .425em .425em, .425em .425em;
background-position: left center, center center, right center;
background-repeat: no-repeat;
color: #fff;
    font-size: 2em;"
        />
    {/if}
</span>

<style>
    .rpBadge {
        position: relative;
        border-radius: 6px;
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        margin: 0 2px;
    }

    .fa-solid {
        -webkit-font-smoothing: antialiased;
        display: var(--fa-display, inline-block);
        font-style: normal;
        font-variant: normal;
        line-height: 1;
        text-rendering: auto;
    }

    .red {
        background: var(--red-team-text-color);
    }

    .blue {
        background: var(--blue-team-text-color);
    }

    .inactive {
        position: relative;
        top: 0;
        left: 0;
        border-radius: 6px;
        width: 48px;
        height: 48px;
        background-color: black;
        opacity: 0.4;
        content: "";
    }
</style>
