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

    $: season = +$page.params.season as Season;

    let selectedTab = $page.params.tab;
    $: browser && goto(selectedTab, { replaceState: true });
</script>

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
        <TabContent name="teams">Teams</TabContent>

        <TabContent name="matches">Matches</TabContent>
    </TabbedCard>
</WidthProvider>
