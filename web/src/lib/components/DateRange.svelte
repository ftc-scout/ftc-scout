<script lang="ts">
    import { dateFromStr, dateToStr } from "$lib/util/format/pretty-print-date";
    import type { Season } from "../constants";

    export let season: Season;

    export let startDate: Date | null = null;
    export let endDate: Date | null = null;

    $: startDate = !startDateStr ? null : dateFromStr(startDateStr);
    $: endDate = !endDateStr ? null : dateFromStr(endDateStr);

    let startDateStr: string = dateToStr(startDate) ?? "";
    let endDateStr: string = dateToStr(endDate) ?? "";

    export let style: string = "";

    $: minDate = season == 2021 ? "2021-09-17" : "2019-10-12";
    $: maxDate = season == 2021 ? "2022-09-23" : "2020-03-08";
</script>

<span {style}>
    <form>
        <input type="date" bind:value={startDateStr} aria-label="start date" min={minDate} max={maxDate} />
    </form>
    to
    <form>
        <input type="date" bind:value={endDateStr} aria-label="end date" min={minDate} max={maxDate} />
    </form>
</span>

<style>
    span {
        display: flex;
        align-items: center;
        gap: var(--large-gap);
    }

    form {
        background: var(--foreground-color);

        box-shadow: var(--shadow-color) 0px 2px 5px -1px, var(--shadow-color) 0px 1px 3px -1px;
        border-radius: 8px;

        width: 100%;
    }

    input {
        font: var(--main-font);

        border: none;
        color: inherit;
        cursor: pointer;

        padding: var(--small-padding);

        background: none;
        border-radius: 8px;

        height: 100%;
        width: 100%;
    }

    input:focus,
    input:focus-visible {
        outline: none;
    }

    form:focus,
    form:focus-within {
        outline: var(--text-color) 2px solid;
    }
</style>
