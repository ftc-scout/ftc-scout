<script lang="ts">
    import { goto } from "$app/navigation";

    import type { NonRankStatColumn, StatData } from "@ftc-scout/common";
    import { exportCSV } from "./csv";
    import { faFileDownload } from "@fortawesome/free-solid-svg-icons";
    import Button from "../ui/Button.svelte";

    type T = $$Generic;

    export let data: StatData<T>[];
    export let shownStats: NonRankStatColumn<T>[];
    export let csv: { filename: string; title: string };
    import { trialStarted } from "../../../routes/plus/shiny.svelte";
</script>

{#if $trialStarted}
    <Button
        icon={faFileDownload}
        disabled={shownStats.length == 0
            ? "Select statistics to export csv."
            : data.length == 0
            ? "Select data to export csv."
            : null}
        on:click={() => exportCSV(data, shownStats, csv.filename, csv.title)}
    >
        Export CSV
    </Button>
{/if}
{#if !$trialStarted}
    <Button icon={faFileDownload} on:click={() => goto("/plus")}>Unlock CSV Exporting</Button>
{/if}
