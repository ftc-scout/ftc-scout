<script lang="ts" context="module">
    import { writable } from "svelte/store";
    export let trialStarted = writable(false);
</script>

<script lang="ts">
    export var always: boolean = false;
</script>

{#if $trialStarted || always}
    <span class="shiny">+</span>
{/if}

<style>
    @keyframes shinyAnim {
        0% {
            background-position: 0% 50%;
        }
        100% {
            background-position: 100% 50%;
        }
    }

    .shiny {
        background: linear-gradient(
            270deg,
            #ff0000,
            #ff9900,
            #ffff00,
            #33cc33,
            #0066ff,
            #6600cc,
            #ff3399,
            #ff0000
        );
        background-size: 1600% 1600%;
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: shinyAnim 3s linear infinite;
        text-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
    }
</style>
