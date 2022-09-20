<script>
    import Card from "$lib/components/Card.svelte";
    import Head from "$lib/components/nav/Head.svelte";
    import WidthProvider from "$lib/components/WidthProvider.svelte";
</script>

<Head
    title="Api | FTCScout"
    description="The developer api for FTCScout providing access to all our statistics and data."
/>

<WidthProvider width="1000px">
    <Card>
        <h1>TODO Api</h1>
        <iframe src="https://api.ftcscout.org/graphql" title="FTCScout Api Playground" />
    </Card>
</WidthProvider>
