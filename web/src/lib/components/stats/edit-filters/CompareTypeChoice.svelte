<script lang="ts">
    import { statFilterTypeFromString, statFilterTypeToString, type StatFilterType } from "../../../util/stats/filter";

    export let value: StatFilterType;

    let _value: "=" | "≠" | ">" | "≥" | "<" | "≤" = statFilterTypeToString(value);
    $: value = statFilterTypeFromString(_value)!;
</script>

<select bind:value={_value}>
    <option>=</option>
    <option>≠</option>
    <option>{">"}</option>
    <option>≥</option>
    <option>{"<"}</option>
    <option>≤</option>
</select>

<style>
    * {
        font: inherit;
    }
</style>
