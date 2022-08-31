<script lang="ts">
    import { dateFromStr, dateToStr } from "$lib/util/format/pretty-print-date";

    export let season: 2021 | 2019;

    export let startDate: Date | null = null;
    $: startDate = !startDateStr ? null : dateFromStr(startDateStr);
    export let endDate: Date | null = null;
    $: endDate = !endDateStr ? null : dateFromStr(endDateStr);

    let startDateStr: string = dateToStr(startDate) ?? "";
    let endDateStr: string = dateToStr(endDate) ?? "";

    export let style: string = "";

    $: minDate = season == 2021 ? "2021-09-17" : "2019-10-12";
    $: maxDate = season == 2021 ? "2022-09-23" : "2020-03-08";
</script>

<span {style}>
    <div>
        <input type="date" bind:value={startDateStr} aria-label="start date" min={minDate} max={maxDate} />
    </div>
    to
    <div>
        <input type="date" bind:value={endDateStr} aria-label="end date" min={minDate} max={maxDate} />
    </div>
</span>

<style>
    span {
        display: flex;
        align-items: center;
        gap: var(--large-gap);
    }

    div {
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

    div:focus,
    div:focus-within {
        outline: var(--text-color) 2px solid;
    }
</style>
