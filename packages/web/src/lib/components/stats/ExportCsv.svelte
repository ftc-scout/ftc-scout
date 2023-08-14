<script lang="ts">
    import type { NonRankStatColumn, StatData } from "./stat-table";
    import { exportCSV } from "./csv";
    import { faFileDownload } from "@fortawesome/free-solid-svg-icons";
    import Button from "../ui/Button.svelte";

    type T = $$Generic;

    export let data: StatData<T>[];
    export let shownStats: NonRankStatColumn<T>[];
    export let csv: { filename: string; title: string };
</script>

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
