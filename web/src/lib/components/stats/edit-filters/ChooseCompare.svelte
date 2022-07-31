<script lang="ts">
    import {
        statFilterTypeFromString,
        statFilterTypeToString,
        type StatFilterType,
    } from "../../../util/stats/StatFilter";
    import Dropdown from "../../Dropdown.svelte";

    export let type: StatFilterType;

    let value: string = statFilterTypeToString(type);
    $: type = statFilterTypeFromString(value)!;
</script>

<Dropdown bind:value items={["=", "≠", ">", "≥", "<", "≤"]} />
