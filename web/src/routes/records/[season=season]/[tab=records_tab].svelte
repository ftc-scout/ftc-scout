<script lang="ts">
    import { browser } from "$app/env";
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import Card from "../../../lib/components/Card.svelte";
    import Dropdown from "../../../lib/components/Dropdown.svelte";
    import TabbedCard from "../../../lib/components/tabs/TabbedCard.svelte";
    import TabContent from "../../../lib/components/tabs/TabContent.svelte";
    import WidthProvider from "../../../lib/components/WidthProvider.svelte";
    import { TEAMS_ICON, MATCHES_ICON } from "../../../lib/icons";
    import { prettyPrintSeason } from "../../../lib/util/format/pretty-print-season";

    function gotoSubPage(name: string) {
        if (browser && $page.routeId == "records/[season=season]/[tab=records_tab]") {
            goto(`/records/${$page.params.season}/${name.toLowerCase()}`, { replaceState: true });
        }
    }

    let selectedPage: string = $page.params.tab;
    $: gotoSubPage(selectedPage);

    $: season = +$page.params.season as 2021;
</script>

<svelte:head>
    <title>
        {`${season} ${$page.params.tab == "teams" ? "Team" : "Match"} Records | FTC Scout`}
    </title>
</svelte:head>

<WidthProvider width={"1250px"}>
    <Card>
        <h1>{prettyPrintSeason(season)} Season Records</h1>

        <p>Season: <Dropdown items={["2021 Freight Frenzy"]} value="2021 Freight Frenzy" /></p>
        <p>
            Event Types:&nbsp; <Dropdown
                items={["Traditional and Remote", "Traditional", "Remote"]}
                value="Traditional"
            />
        </p>
    </Card>

    <TabbedCard
        names={[
            [MATCHES_ICON, "Matches"],
            [TEAMS_ICON, "Teams"],
        ]}
        bind:selectedName={selectedPage}
    >
        <TabContent name="Matches">Matches</TabContent>

        <TabContent name="Teams">Teams</TabContent>
    </TabbedCard>
</WidthProvider>
