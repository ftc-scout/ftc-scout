<script lang="ts">
    import { ALL_SEASONS, type Season } from "../constants";
    import { prettyPrintSeason } from "../util/format/pretty-print-season";
    import Dropdown from "./Dropdown.svelte";

    function seasonFromStr(str: string): Season | null {
        for (let season of ALL_SEASONS) {
            if (str == `${season} ${prettyPrintSeason(season)}`) return season;
        }
        return null;
    }

    export let season;
    export let style: string = "";

    let seasonStr: string = `${season} ${prettyPrintSeason(season)}`;
    $: season = seasonFromStr(seasonStr);
</script>

<Dropdown items={ALL_SEASONS.reverse().map((s) => `${s} ${prettyPrintSeason(s)}`)} bind:value={seasonStr} {style} />
