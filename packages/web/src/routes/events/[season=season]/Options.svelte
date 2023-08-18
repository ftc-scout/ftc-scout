<script lang="ts">
    import Form from "$lib/components/ui/form/Form.svelte";
    import type { EventTypeOption, RegionOption, Season } from "@ftc-scout/common";
    import RegionSelect from "../../../lib/components/ui/form/RegionSelect.svelte";
    import EventTypeSelect from "../../../lib/components/ui/form/EventTypeSelect.svelte";
    import DateRange from "../../../lib/components/ui/form/DateRange.svelte";
    import SeasonSelect from "../../../lib/components/ui/form/SeasonSelect.svelte";

    export let season: Season;
    export let region: RegionOption;
    export let eventType: EventTypeOption;
    export let start: Date | null;
    export let end: Date | null;
</script>

<Form id="season-search" style="col">
    <label for="season-select">
        Season
        <SeasonSelect bind:season id="season-select" />
    </label>

    <label for="region-select">
        Regions
        <RegionSelect bind:region name="regions" id="region-select" />
    </label>

    <label for="event-types-select">
        Event Types
        <EventTypeSelect bind:eventType name="event-types" id="event-types-select" />
    </label>

    <div>
        Date Range
        <DateRange bind:start bind:end {season} />
    </div>

    <noscript> <input type="submit" /> </noscript>
</Form>

<style>
    label,
    div {
        display: flex;
        flex-direction: column;
        gap: var(--sm-gap);
        width: 100%;
    }

    noscript {
        display: flex;
        justify-content: right;
        margin-top: var(--md-gap);
    }
</style>
