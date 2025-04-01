<script lang="ts">
    import { faMagicWandSparkles } from "@fortawesome/free-solid-svg-icons";
    import Fa from "svelte-fa";
</script>

<div class="aibtncontainer">
    <button on:click={() => alert("You are being rate limited")} class="ai-button">
        <Fa icon={faMagicWandSparkles} fw size="1.2x" style="font-size: 24px" />
    </button>
</div>

<style>
    .aibtncontainer {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 1000;
        background-color: #4a90e2;
        background-image: linear-gradient(312deg, #4a90e2 0%, #9013fe 50%, #f5a623 100%);
        border-radius: 30%;
    }

    .ai-button {
        display: flex;
        align-items: center;
        margin: var(--sm-pad);
        padding: var(--lg-pad);
        padding-top: 22%;
        padding-bottom: 22%;
        font-size: var(--vl-font-size);
        background-color: black;
        border-radius: 30%;
        color: var(--theme-text-color);
        /* remove button decoration */
        border: none;
    }
</style>
