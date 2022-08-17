<script lang="ts">
    const p = (s: any, n: number) => s.toString().padStart(n, "0");
    const formatDate = (d: Date | null) =>
        d ? `${p(d.getFullYear(), 4)}-${p(d.getMonth() + 1, 2)}-${p(d.getDate(), 2)}` : "";

    export let startDate: Date | null = null;
    $: startDate = !startDateStr ? null : new Date(startDateStr);
    export let endDate: Date | null = null;
    $: endDate = !endDateStr ? null : new Date(endDateStr);

    let startDateStr: string = formatDate(startDate);
    let endDateStr: string = formatDate(endDate);

    export let style: string = "";
</script>

<span {style}>
    <input type="date" bind:value={startDateStr} style="margin-right: var(--large-gap);" /> to
    <input type="date" bind:value={endDateStr} style="margin-left: var(--large-gap);" />
</span>

<style>
    span {
        display: flex;
        align-items: center;
    }

    input {
        font: var(--main-font);

        background: var(--foreground-color);
        border: none;
        color: inherit;
        cursor: pointer;

        padding: var(--small-padding);
        box-shadow: var(--shadow-color) 0px 2px 5px -1px, var(--shadow-color) 0px 1px 3px -1px;
        border-radius: 8px;

        width: 100%;
    }
</style>
