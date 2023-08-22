<script lang="ts">
    import { faSearch, faXmark } from "@fortawesome/free-solid-svg-icons";
    import Fa from "svelte-fa";
    import {
        CombinedSearchDocument,
        type CombinedSearchQuery,
        type TeamsSearchTeamFragment,
        type EventsSearchEventFragment,
    } from "../../../graphql/generated/graphql-operations";
    import { CURRENT_SEASON, fuzzySearch, type FuzzyResult, calcCutoff } from "@ftc-scout/common";
    import { getClient } from "../../../graphql/client";
    import { getDataSync } from "../../../graphql/getData";
    import { browser } from "$app/environment";
    import { readable, writable, type Readable } from "svelte/store";
    import type { ApolloQueryResult } from "@apollo/client";
    import SearchRes from "./SearchRes.svelte";
    import { isCompetition } from "../../../util/event-type";
    import SkeletonRow from "../../skeleton/SkeletonRow.svelte";
    import { afterNavigate, goto, preloadData } from "$app/navigation";
    import { focusWithinOut, watchForFocus } from "../../../util/directives";

    let searchText = "";
    let shown = false;

    let resultsLoading = false;
    let results: Readable<ApolloQueryResult<CombinedSearchQuery> | null> = readable(null);

    function loadData() {
        if (!browser) return;

        if (!resultsLoading) {
            resultsLoading = true;
            results = getDataSync(getClient(), CombinedSearchDocument, { season: CURRENT_SEASON });
        }
    }

    function getURL(res: FuzzyResult<EventsSearchEventFragment | TeamsSearchTeamFragment>): string {
        let r = res.document;
        if (r.__typename == "Event") {
            return `/events/${r.season}/${r.code}/matches`;
        } else {
            return `/teams/${r.number}`;
        }
    }

    function preload() {
        if (searchResults.length == 0) return;
        let r = searchResults[Math.max(0, $focusNum)];
        preloadData(getURL(r));
    }

    function submit() {
        if (searchResults.length == 0) return;
        goto(getURL(searchResults[0]));
        searchText = "";
    }

    let focusNum = writable(-1);

    function key(e: KeyboardEvent) {
        if (e.code == "ArrowDown") {
            e.preventDefault();
            $focusNum = Math.min(searchResults.length - 1, $focusNum + 1);
        } else if (e.code == "ArrowUp") {
            e.preventDefault();
            $focusNum = Math.max(-1, $focusNum - 1);
        }
    }

    function show() {
        shown = true;
        setTimeout(() => document.getElementById("searchbar")?.focus(), 5);
    }

    $: relevantEvents = ($results?.data?.eventsSearch ?? []).filter((e) => isCompetition(e.type));
    $: relevantTeams = $results?.data?.teamsSearch ?? [];

    $: browser && searchText != "" && loadData();

    function search(needle: string, es: typeof relevantEvents, ts: typeof relevantTeams) {
        if (needle == "") return [];
        if (needle.match(/^\d+$/)) {
            return ts
                .filter((t) => (t.number + "").startsWith(needle))
                .sort((a, b) => a.number - b.number)
                .slice(0, 10)
                .map((t) => ({ document: t, distance: 0, highlights: [] }));
        }

        let events = fuzzySearch(es, needle, 5, "name", true).slice(0, 10);
        let teams = fuzzySearch(ts, needle, 5, "name", true).slice(0, 10);

        let bestEvent = Math.min(...events.map((e) => e.distance));
        let bestTeam = Math.min(...teams.map((t) => t.distance));
        let cutoff = calcCutoff(Math.min(bestEvent, bestTeam), needle.length);

        let filteredEvents = events.filter((e) => e.distance <= cutoff);
        let filteredTeams = teams.filter((t) => t.distance <= cutoff);

        return bestTeam <= bestEvent
            ? [...filteredTeams, ...filteredEvents]
            : [...filteredEvents, ...filteredTeams];
    }

    $: searchResults = search(searchText.trim().slice(0, 50), relevantEvents, relevantTeams);

    $: searchResults, $focusNum, preload();

    afterNavigate(() => (searchText = ""));
</script>

<form
    on:submit|preventDefault={submit}
    use:focusWithinOut={() => (shown = false)}
    class:has-text={searchText != ""}
    class:shown
>
    <Fa icon={faSearch} />
    <input
        bind:value={searchText}
        on:focusin={loadData}
        on:keydown={key}
        use:watchForFocus={{ store: focusNum, myNum: -1 }}
        id="searchbar"
        placeholder="Search for teams and events."
        type="search"
        autocomplete="off"
    />

    <!-- Submit the form on enter -->
    <input type="submit" style="display: none" />

    <button on:click|preventDefault|stopPropagation={() => (searchText = "")}>
        <Fa icon={faXmark} />
    </button>

    <div class="results">
        {#if searchText != "" && $results == null}
            <SkeletonRow rows={7} card={false} header={false} />
        {:else if searchResults.length && searchText != ""}
            <ul>
                {#each searchResults as res, index}
                    <li>
                        <SearchRes
                            {res}
                            {searchText}
                            {focusNum}
                            {index}
                            on:keydown={key}
                            on:click={() => (searchText = "")}
                        />
                    </li>
                {/each}
            </ul>
        {:else if searchText != ""}
            <b>No Results</b>
        {/if}
    </div>
</form>

<button class="search-btn" on:click={show}>
    <Fa icon={faSearch} size="1.25x" />
</button>

<style>
    form {
        transition: width 0.3s ease 0s;

        background: var(--fg-color);
        padding: 0 var(--sm-pad) 0 var(--lg-pad);

        border: 1px solid var(--sep-color);
        outline-offset: -1px;
        border-radius: 4px;

        position: relative;
    }

    form:focus-within {
        background: var(--zebra-stripe-color);
    }

    form:focus-within.has-text {
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
        box-shadow: -2px 2px 10px 3px rgba(0, 0, 0, 10%);
    }

    input {
        width: 270px;
        --expanded-width: 600px;
        transition: width 300ms 0s cubic-bezier(0.4, 0, 0.2, 1);

        border-radius: 4px;
        padding: calc(var(--navbar-size) / 6);
        padding-right: 0;
        border: none;
        border-radius: 0;
        background: none;
    }

    form:focus-within input {
        outline: none;
        width: var(--expanded-width);
    }

    form button {
        display: none;
        border: none;
        background: none;
        color: inherit;
        font-size: inherit;
        font-family: inherit;

        padding: var(--sm-pad) var(--md-pad);
        border-radius: var(--pill-border-radius);

        cursor: pointer;
    }

    form button:hover {
        background: var(--form-hover-bg-color);
    }

    form button:active {
        background: var(--form-click-bg-color);
    }

    .results {
        display: flex;
        flex-direction: column;
        gap: var(--md-gap);

        position: absolute;
        top: calc(100% - 2px);
        left: -1px;
        right: -1px;

        max-height: 0px;
        padding: 0 var(--lg-pad);
        overflow-y: hidden;
        transition-property: max-height, padding-top, padding-bottom, overflow-y, clip-path,
            border-color;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        transition-duration: 0.3s;

        background: var(--fg-color);

        border: 1px solid var(--sep-color);
        border-top: none;
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
        z-index: 1;

        box-shadow: -2px 2px 10px 3px rgba(0, 0, 0, 10%);

        /* Hide border */
        clip-path: inset(1px 1px 1px 1px);
    }

    ul {
        list-style: none;
    }

    @keyframes add-scroll {
        from {
            overflow-y: hidden;
        }
        to {
            overflow-y: auto;
        }
    }

    form.has-text:focus-within .results {
        max-height: 350px;
        padding: var(--lg-pad);

        clip-path: inset(0px -10px -10px -10px);

        animation: add-scroll 0.6s;
        overflow-y: auto;
    }

    @keyframes fade-in {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    form:focus-within button {
        opacity: 1;
        display: inline;
        animation: fade-in 0.3s;
    }

    input[type="search"]::-webkit-search-decoration,
    input[type="search"]::-webkit-search-cancel-button,
    input[type="search"]::-webkit-search-results-button,
    input[type="search"]::-webkit-search-results-decoration {
        display: none;
    }

    @media (max-width: 960px) {
        input {
            --expanded-width: 500px;
        }
    }

    .search-btn {
        display: none;

        background: none;
        border: none;
        /* font-size: var(--lg-font-size); */
        font-family: inherit;
        color: var(--theme-text-color);
        cursor: pointer;
    }

    @media (max-width: 860px) {
        form {
            position: absolute;
            left: var(--md-gap);
            right: var(--md-gap);
        }

        input {
            --expanded-width: calc(100% - 55px);
            width: calc(100% - 55px);
            transition-property: none;
        }

        form:not(.shown) {
            display: none;
        }

        .search-btn {
            display: block;
        }
    }
</style>
