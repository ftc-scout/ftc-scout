<script lang="ts">
    export let venue: string | null = null;
    export let city: string;
    export let state: string;
    export let country: string;

    export let __typename: "Location" | undefined = undefined;
    __typename;

    export let link = true;

    $: computedVenue = venue ? `${venue}, ` : "";
    $: href = `https://www.google.com/maps/search/?api=1&query=${computedVenue}${city}, ${state}, ${country}`;
</script>

{#if link}
    <a {href} class="norm-link">
        {computedVenue.trim()}
        {city.trim()}, {state.trim()}, {country.trim()}
    </a>
{:else}
    {computedVenue.trim()} {city.trim()}, {state.trim()}, {country.trim()}
{/if}
