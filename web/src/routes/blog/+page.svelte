<script>
    import Card from "$lib/components/Card.svelte";
    import WidthProvider from "$lib/components/WidthProvider.svelte";
    import Week1 from "./posts/Week1.svelte";
    import Week2 from "./posts/Week2.svelte";
    import Week3 from "./posts/Week3.svelte";
    import Head from "$lib/components/nav/Head.svelte";
</script>

<Head
    title="The Scouting Report | FTCScout"
    description="The Scouting Report, FTCScout's weekly blog highlighting interesting facts and statistics about FIRST Tech Challenge."
/>

<WidthProvider width="1000px">
    <Card>
        <Week3 />
    </Card>
    <Card>
        <Week2 />
    </Card>
    <Card>
        <Week1 />
    </Card>
</WidthProvider>
