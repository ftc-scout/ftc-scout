<script>
    import Card from "$lib/components/Card.svelte";
    import Head from "$lib/components/nav/Head.svelte";
    import WidthProvider from "$lib/components/WidthProvider.svelte";
</script>

<Head title="About | FTCScout" description="About FTCScout, a new way to track and scout FIRST Tech Challenge." />

<WidthProvider width={"1000px"}>
    <Card>
        <h1>About FTCScout</h1>

        <p>
            FTCScout is the passion project of a group of programmers at team <a href="/teams/16321">16321 X Drive</a>.
        </p>
    </Card>
</WidthProvider>

<style>
    * {
        line-height: 1.5rem;
    }
</style>
