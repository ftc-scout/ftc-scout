<script lang="ts">
    import { browser } from "$app/env";
    import { page } from "$app/stores";
    import Card from "$lib/components/Card.svelte";
    import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
    import { onDestroy, onMount } from "svelte";
    import { query, type ReadableQuery } from "svelte-apollo";
    import FaButton from "../../lib/components/FaButton.svelte";
    import Head from "../../lib/components/nav/Head.svelte";
    import { changeParam } from "../../lib/components/season-records/changeParams";
    import RegionsDropdown from "../../lib/components/season-records/RegionsDropdown.svelte";
    import SkeletonRow from "../../lib/components/skeleton/SkeletonRow.svelte";
    import TextInput from "../../lib/components/TextInput.svelte";
    import WidthProvider from "../../lib/components/WidthProvider.svelte";
    import { Region, TeamsSearchDocument, type TeamsSearchQuery } from "../../lib/graphql/generated/graphql-operations";
    import { regionFromStr, regionToString } from "../../lib/util/regions";

    type Team = {
        number: number;
        name: string;
    };

    const BATCH_SIZE = 50;

    let regionStr: string = regionToString(regionFromStr($page.url.searchParams.get("region") ?? "ALL") ?? Region.All);
    $: region = regionFromStr(regionStr) ?? Region.All;

    let searchText = $page.url.searchParams.get("search") ?? "";

    let limit = BATCH_SIZE;

    let teams: ReadableQuery<TeamsSearchQuery>;
    $: teams = query(TeamsSearchDocument, {
        variables: {
            limit,
            region,
            searchText,
        },
    });
    let currentlyLoading = true;
    let currentData: Team[] | null = null;
    $: if ($teams?.data?.teamsSearch) {
        currentData = $teams?.data?.teamsSearch ?? null;
        currentlyLoading = false;
    }

    $: changeParam(
        {
            region: region == Region.All ? null : regionToString(region),
            search: !searchText ? null : searchText,
        },
        true
    );

    function more() {
        currentlyLoading = true;
        limit += BATCH_SIZE;
        teams.refetch({
            limit,
            region,
            searchText,
        });
    }

    if (browser) {
        function checkMore() {
            let content = document.getElementById("content")!;
            if (!currentlyLoading && content.scrollTop + content.clientHeight + 400 >= content.scrollHeight) {
                more();
            }
        }

        onMount(() => {
            let content = document.getElementById("content")!;
            setTimeout(() => {
                content.addEventListener("scroll", checkMore);
            }, 5);
        });

        onDestroy(() => {
            let content = document.getElementById("content")!;
            content?.removeEventListener("scroll", checkMore);
        });
    }
</script>

<Head title="Teams | FTCScout" description="Find and search for FTC teams." />

<WidthProvider width="1000px">
    <Card>
        <h1>Teams</h1>
        <div class="options">
            <span>Regions:</span>
            <RegionsDropdown bind:value={regionStr} style="width: calc(100% - 15ch)" />
        </div>
        <div class="options">
            <span>Search:</span>
            <TextInput bind:value={searchText} style="width: calc(100% - 15ch)" search />
        </div>
    </Card>
    <Card>
        {#if currentData}
            <ul>
                {#each currentData as team}
                    <li>
                        <a sveltekit:prefetch href="/teams/{team.number}">
                            <span style="min-width: 5ch; display: inline-block">{team.number}</span>
                            <em class="info">
                                {team.name}
                            </em>
                        </a>
                    </li>
                {:else}
                    <p class="no-teams">No Matching Teams</p>
                {/each}

                {#if currentData.length != 0 && currentData.length % BATCH_SIZE == 0 && !currentlyLoading}
                    <div class="more-wrap">
                        <FaButton icon={faCirclePlus} on:click={more} buttonStyle="font-size: var(--large-font-size)">
                            Show More
                        </FaButton>
                    </div>
                {/if}
            </ul>
        {/if}
        {#if $teams.loading}
            <SkeletonRow rows={50} card={false} header={false} />
        {/if}
    </Card>
</WidthProvider>

<style>
    .options {
        display: flex;
        align-items: center;
        justify-content: space-between;

        margin-top: var(--large-gap);
        margin-bottom: var(--large-gap);
    }

    .options span {
        display: inline-block;
        width: 12ch;

        font-size: var(--large-font-size);
        font-weight: normal;
    }

    ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    li {
        margin: 0;

        cursor: pointer;
    }

    li:hover {
        background: var(--hover-color);
    }

    a {
        width: 100%;
        height: 100%;
        color: inherit;

        display: block;
        padding: var(--small-padding);

        border-radius: 6px;
    }

    li:not(:last-child) a {
        margin-bottom: var(--gap);
    }

    a:hover {
        text-decoration: none;
    }

    .no-teams {
        margin: 0;
        padding: var(--padding);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: var(--large-font-size);
    }

    .more-wrap {
        display: flex;
        align-items: center;
        justify-content: center;

        font-size: var(--large-font-size);
    }
</style>
