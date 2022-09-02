<script lang="ts">
    import type { Season } from "../constants";
    import { prettyPrintSeason } from "../util/format/pretty-print-season";
    import Dropdown from "./Dropdown.svelte";

    function seasonFromStr(str: string): Season | null {
        return (
            {
                "2021 Freight Frenzy": 2021 as const,
                "2019 Skystone": 2019 as const,
            }[str] ?? null
        );
    }

    export let season;
    export let style: string = "";

    let seasonStr: string = `${season} ${prettyPrintSeason(season)}`;
    $: season = seasonFromStr(seasonStr);
</script>

<Dropdown items={["2021 Freight Frenzy", "2019 Skystone"]} bind:value={seasonStr} {style} />
