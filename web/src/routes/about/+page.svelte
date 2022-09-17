<script>
    import Card from "$lib/components/Card.svelte";
    import WidthProvider from "$lib/components/WidthProvider.svelte";
</script>

<svelte:head>
    <title>About | FTCScout</title>
    <meta name="description" content="About FTCScout, a new way to track and scout FIRST Tech Challenge." />
    <meta property="og:title" content="About | FTCScout" />
    <meta property="og:image" content="/banner.png" />
</svelte:head>

<WidthProvider width={"1000px"}>
    <Card>
        <h1>About</h1>
    </Card>
</WidthProvider>

<style>
    * {
        line-height: 1.5rem;
    }
</style>
