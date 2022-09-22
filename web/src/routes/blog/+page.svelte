<script>
    import Card from "$lib/components/Card.svelte";
    import WidthProvider from "$lib/components/WidthProvider.svelte";
    import Week1 from "./posts/Week1.svelte";
</script>

<WidthProvider width="1000px">
    <Card>
        <Week1 />
    </Card>
</WidthProvider>
