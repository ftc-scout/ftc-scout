<script lang="ts">
    import Card from "$lib/components/Card.svelte";
    import WidthProvider from "$lib/components/WidthProvider.svelte";
    import Head from "$lib/components/Head.svelte";
</script>

<Head title="Sponsors | FTCScout" description="Our Sponors this season" />

<WidthProvider width={"1000px"}>
    <Card>
        <h1 class="head">Our Sponsors</h1>

        <div class="rest">
            <p>
                We are currently sponsored by <a
                    href="https://hackclub.com/first?utm_source=ftcscout&utm_content=banner&tub_program=ftcscout"
                    >HCB</a
                >
                for this season, but we we may be available for future sponsorship. See sponsorship
                details <a href="/sponsors/info">here</a>.
            </p>
        </div></Card
    >
</WidthProvider>

<style>
    .head {
        background: var(--hover-color);
        border-radius: 8px;
        padding: var(--md-pad);
    }

    .rest {
        padding: var(--sm-pad);
    }

    h1 {
        font-size: var(--vl-font-size);
    }

    h2 {
        font-size: var(--lg-font-size);
        margin: var(--lg-gap) 0 var(--sm-gap) 0;
    }

    h3 {
        font-size: var(--md-font-size);
        margin: var(--md-gap) 0 var(--sm-gap) 0;
    }

    p {
        line-height: 1.75;
        margin: var(--md-gap) 0;
    }

    .image-wrap {
        width: 100%;
        display: flex;
        justify-content: center;
    }

    .statsimg {
        width: 60%;
    }

    img {
        border-radius: 8px;
    }
</style>
