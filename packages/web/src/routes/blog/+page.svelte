<script lang="ts" context="module">
    export type BlogMatchImport = { matches: FullMatchFragment[]; event: BasicEventInfoFragment };
</script>

<script lang="ts">
    import WidthProvider from "$lib/components/WidthProvider.svelte";
    import { Season } from "@ftc-scout/common";
    import SeasonMarker from "./SeasonMarker.svelte";
    import Week1 from "./posts/Week1.svelte";
    import type {
        BasicEventInfoFragment,
        FullMatchFragment,
    } from "$lib/graphql/generated/graphql-operations";
    import Head from "$lib/components/Head.svelte";
    import Week2 from "./posts/Week2.svelte";
    import Week3 from "./posts/Week3.svelte";
    import Week4 from "./posts/Week4.svelte";
    import Week5 from "./posts/Week5.svelte";
    import Week6 from "./posts/Week6.svelte";
</script>

<Head
    title="The Scouting Report | FTCScout"
    description="The Scouting Report, FTCScout's blog highlighting interesting facts and statistics about FIRST Tech Challenge."
/>

<WidthProvider width="90ch">
    <SeasonMarker season={Season.PowerPlay} />
    <Week6 />
    <Week5 />
    <Week4 />
    <SeasonMarker season={Season.FreightFrenzy} />
    <Week3 />
    <Week2 />
    <Week1 />
</WidthProvider>
