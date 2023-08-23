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
    import { goto } from "$app/navigation";
    import { DESCRIPTORS, type Season } from "@ftc-scout/common";
    import Tep from "./Tep.svelte";
    import type { PageData } from "./$types";
    import { TEAM_CLICK_ACTION_CONTEXT } from "$lib/components/matches/MatchTeam.svelte";
    import { setContext } from "svelte";
    import FocusedTeam from "../../../../lib/components/stats/FocusedTeam.svelte";

    $: season = +$page.params.season as Season;

    let selectedTab = $page.params.tab;
    $: browser && selectedTab != $page.params.tab && goto(selectedTab, { replaceState: true });

    export let data: PageData;
    $: tepData = data.tepData;

    let focusedTeam: number | null = null;
    let focusedTeamName: string | null;
    setContext(TEAM_CLICK_ACTION_CONTEXT, (t: number, name: string) => {
        if (focusedTeam == t) {
            focusedTeam = null;
            focusedTeamName = null;
        } else {
            focusedTeam = t;
            focusedTeamName = name;
        }
    });
</script>

{#if focusedTeam && focusedTeamName}
    <FocusedTeam
        team={{ season, team: { number: focusedTeam, name: focusedTeamName } }}
        remote={false}
    />
{/if}

<WidthProvider width={"850px"}>
    <Card>
        <h1>{DESCRIPTORS[season].seasonName} Season Records</h1>
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
