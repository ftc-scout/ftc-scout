<script lang="ts">
    export let venue: string | null = null;
    export let city: string;
    export let stateOrProvince: string;
    export let country: string;

    export let link = true;

    $: venue_ = venue ? `${venue}, ` : "";
</script>

{#if link}
    <a href="https://www.google.com/maps/search/?api=1&query={venue_}{city}, {stateOrProvince}, {country}">
        {venue_.trim()}
        {city.trim()}, {stateOrProvince.trim()}, {country.trim()}
    </a>
{:else}
    {venue_.trim()} {city.trim()}, {stateOrProvince.trim()}, {country.trim()}
{/if}
