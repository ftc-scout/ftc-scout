<script lang="ts">
    import Card from "../../lib/components/Card.svelte";
    import WidthProvider from "../../lib/components/WidthProvider.svelte";
    import Form from "../../lib/components/ui/form/Form.svelte";
    import SearchInput from "../../lib/components/ui/form/SearchInput.svelte";
    import { REGION_EC_DC } from "../../lib/util/search-params/region";
    import { queryParam } from "../../lib/util/search-params/search-params";
    import { STRING_EC_DC } from "../../lib/util/search-params/string";
    import RegionSelect from "../../lib/components/ui/form/RegionSelect.svelte";
    import Loading from "../../lib/components/Loading.svelte";
    import SkeletonRow from "../../lib/components/skeleton/SkeletonRow.svelte";
    import { fuzzySearch, highlight } from "@ftc-scout/common";
    import Location from "../../lib/components/Location.svelte";
    import InfiniteScroll from "svelte-infinite-scroll";
    import { browser } from "$app/environment";

    export let data;
    $: teamsStore = data.teams;
    $: teams = $teamsStore?.data.teamsSearch ?? [];

    let searchText = queryParam("search", STRING_EC_DC);
    let region = queryParam("regions", REGION_EC_DC);

    let elementScroll = (browser ? document.getElementById("content") : null)!;
    let take = 100;
    $: {
        $searchText;
        $region;
        take = 100;
    }

    function doSearch(needle: string, ts: typeof teams) {
        if (needle.match(/^\d+$/)) {
            return ts
                .filter((t) => (t.number + "").startsWith(needle))
                .sort((a, b) => a.number - b.number)
                .map((t) => ({ document: t, distance: 0, highlights: [] }));
        }

        return fuzzySearch(teams, $searchText, Infinity, "name", true);
    }

    $: search = doSearch($searchText, teams);

    function highlightNum(num: number): string {
        let s = num + "";
        return s.startsWith($searchText)
            ? "<b>" + $searchText + "</b>" + s.slice($searchText.length)
            : s;
    }
</script>

<WidthProvider>
    <Card>
        <h1>Teams</h1>

        <Form id="team-search" style="col">
            <div class="row">
                <label for="search-select">
                    Search
                    <SearchInput bind:value={$searchText} name="search" id="search-select" />
                </label>

                <label for="region-select">
                    Regions
                    <RegionSelect bind:region={$region} name="regions" id="region-select" />
                </label>
            </div>

            <noscript> <input type="submit" /> </noscript>
        </Form>
    </Card>

    <Loading store={$teamsStore} checkExists={() => true}>
        <SkeletonRow rows={50} header={false} slot="loading" />

        <Card>
            <ul>
                {#each search.slice(0, take) as { document, highlights } (document.number)}
                    {@const href = `/teams/${document.number}`}
                    {@const team = document}

                    <li>
                        <a {href}>
                            <span class="number"> {@html highlightNum(team.number)} </span>
                            <span class="name">{@html highlight(team.name, highlights)} </span>
                            <em class="location"> <Location {...team.location} link={false} /> </em>
                        </a>
                    </li>
                {:else}
                    <div class="no-teams">
                        <b> No matching Teams. </b>
                        <p>Try modifying your filters.</p>
                    </div>
                {/each}

                <InfiniteScroll threshold={200} on:loadMore={() => (take += 100)} {elementScroll} />
            </ul>
        </Card>
    </Loading>
</WidthProvider>

<style>
    h1 {
        margin-top: var(--sm-gap);
        margin-bottom: var(--lg-gap);
    }

    label,
    div {
        display: flex;
        flex-direction: column;
        gap: var(--sm-gap);
        width: 100%;
    }

    .row {
        display: flex;
        flex-direction: row;
        gap: var(--vl-gap);
    }

    @media (max-width: 800px) {
        .row {
            flex-direction: column;
            gap: var(--md-gap);
        }
    }

    noscript {
        display: flex;
        justify-content: right;
        margin-top: var(--md-gap);
    }

    ul {
        list-style: none;
        display: grid;
        grid-template-columns: 1fr 1fr;
    }

    @media (max-width: 900px) {
        ul {
            grid-template-columns: 1fr;
        }
    }

    a {
        color: inherit;

        padding: var(--md-pad) 0;
        border-radius: 8px;

        display: grid;
        grid-template-columns: 6ch 1fr;
        grid-template-rows: auto auto;
        gap: var(--sm-gap) var(--lg-gap);

        font-size: var(--lg-font-size);
    }

    a:hover {
        text-decoration: none;
        background: var(--hover-color);
    }

    .number {
        grid-row: span 2;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: var(--lg-font-size);
    }

    .name {
        font-size: var(--md-font-size);
    }

    .location {
        font-size: var(--md-font-size);
        color: var(--secondary-text-color);
    }

    .no-teams {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--md-gap);
        grid-column: span 2;

        width: 100%;
    }
</style>
