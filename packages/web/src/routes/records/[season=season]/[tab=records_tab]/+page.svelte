<script lang="ts" context="module">
    export let PAGE_SIZE = 50;
</script>

<script lang="ts">
    import Card from "$lib/components/Card.svelte";
    import WidthProvider from "$lib/components/WidthProvider.svelte";
    import { page } from "$app/stores";
    import TabbedCard from "$lib/components/tabs/TabbedCard.svelte";
    import { faBolt, faHashtag } from "@fortawesome/free-solid-svg-icons";
    import TabContent from "$lib/components/tabs/TabContent.svelte";
    import { browser } from "$app/environment";
    import { afterNavigate, goto } from "$app/navigation";
    import { DESCRIPTORS, type Season } from "@ftc-scout/common";
    import Tep from "./Tep.svelte";
    import type { PageData } from "./$types";
    import { TEAM_CLICK_ACTION_CTX } from "$lib/components/matches/MatchTeam.svelte";
    import { setContext } from "svelte";
    import FocusedTeam from "$lib/components/stats/FocusedTeam.svelte";
    import Form from "$lib/components/ui/form/Form.svelte";
    import SeasonSelect from "$lib/components/ui/form/SeasonSelect.svelte";
    import RegionSelect from "$lib/components/ui/form/RegionSelect.svelte";
    import {
        commitQueryParamBatch,
        queryParam,
        queryParamUrlKeeping,
        startQueryParamBatch,
    } from "$lib/util/search-params/search-params";
    import { REGION_EC_DC } from "$lib/util/search-params/region";
    import { DATE_EC_DC } from "$lib/util/search-params/date";
    import DateRange from "$lib/components/ui/form/DateRange.svelte";
    import { REMOTE_EC_DC } from "$lib/util/search-params/event-ty";
    import RemoteSelect from "$lib/components/ui/form/RemoteSelect.svelte";
    import { PAGE_EC_DC } from "$lib/util/search-params/int";
    import Head from "$lib/components/Head.svelte";

    function go(tab: string, season: Season) {
        let tabChanged = tab != $page.params.tab;
        let seasonChanged = season != +$page.params.season;
        if (browser && (tabChanged || seasonChanged)) {
            let toKeep = ["region", "filter"];
            if (DESCRIPTORS[season].hasRemote) toKeep.push("remote");
            if (!seasonChanged) {
                toKeep.push("start");
                toKeep.push("end");
            }
            let params = queryParamUrlKeeping(toKeep);
            goto(`/records/${season}/${selectedTab}${params}`, { replaceState: false });
        }
    }

    let season = +$page.params.season as Season;
    let selectedTab = $page.params.tab;
    $: go(selectedTab, season);

    afterNavigate(() => {
        season = +$page.params.season as Season;
        selectedTab = $page.params.tab;
    });

    export let data: PageData;
    $: tepData = data.tepData;

    let focusedTeam: number | null = null;
    let focusedTeamName: string | null;
    let focusedTeamEvent: string | null;
    setContext(TEAM_CLICK_ACTION_CTX, (t: number, name: string, event?: string) => {
        if (focusedTeam == t) {
            focusedTeam = null;
            focusedTeamName = null;
            focusedTeamEvent = null;
        } else {
            focusedTeam = t;
            focusedTeamName = name;
            focusedTeamEvent = event ?? null;
        }
    });

    let region = queryParam("region", REGION_EC_DC);
    let start = queryParam("start", DATE_EC_DC);
    let end = queryParam("end", DATE_EC_DC);
    let remote = queryParam("remote", REMOTE_EC_DC);
    let pageNum = queryParam("page", PAGE_EC_DC);

    function change() {
        startQueryParamBatch();
        $region = $region;
        $start = $start;
        $end = $end;
        $remote = $remote;
        $pageNum = 1;
        commitQueryParamBatch();
    }
</script>

<Head
    title={`${season} ${$page.params.tab == "teams" ? "Team" : "Match"} Records | FTCScout`}
    description="Records and high scores for the {$page.params.season} season."
/>

{#if focusedTeam && focusedTeamName}
    <FocusedTeam
        team={{
            season,
            team: { number: focusedTeam, name: focusedTeamName },
            eventCode: focusedTeamEvent ?? undefined,
        }}
        remote={false}
    />
{/if}

<WidthProvider width={"850px"}>
    <Card>
        <h1>{DESCRIPTORS[season].seasonName} Season Records</h1>

        <Form id="records-options" style="col">
            <div class="row">
                <label for="season-select">
                    Season
                    <SeasonSelect bind:season id="season-select" />
                </label>

                <label for="region-select">
                    Regions
                    <RegionSelect
                        bind:region={$region}
                        name="regions"
                        id="region-select"
                        on:change={change}
                    />
                </label>

                {#if DESCRIPTORS[season].hasRemote}
                    <label for="remote-select">
                        Events
                        <RemoteSelect bind:remote={$remote} id="remote-select" on:change={change} />
                    </label>
                {/if}
            </div>

            <div>
                Date Range
                <DateRange bind:start={$start} bind:end={$end} {season} on:change={change} />
            </div>

            <noscript> <input type="submit" /> </noscript>
        </Form>
    </Card>
</WidthProvider>

<WidthProvider>
    <TabbedCard
        tabs={[
            [faHashtag, "Teams", "teams", true],
            [faBolt, "Matches", "matches", true],
        ]}
        bind:selectedTab
    >
        <TabContent name="teams">
            <Tep {tepData} {focusedTeam} />
        </TabContent>

        <TabContent name="matches">Matches</TabContent>
    </TabbedCard>
</WidthProvider>

<style>
    label,
    div {
        display: flex;
        flex-direction: column;
        gap: var(--sm-gap);
        width: 100%;
    }

    .row {
        flex-direction: row;
        gap: var(--vl-gap);
    }

    @media (max-width: 800px) {
        .row {
            flex-direction: column;
            gap: var(--md-gap);
        }
    }
</style>
