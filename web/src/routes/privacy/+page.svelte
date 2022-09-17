<script>
    import Card from "$lib/components/Card.svelte";
    import WidthProvider from "$lib/components/WidthProvider.svelte";
</script>

<svelte:head>
    <title>Privacy Policy | FTCScout</title>
    <meta
        name="description"
        content="The Privacy Policy for FTCScout, a new way to track and scout FIRST Tech Challenge."
    />
    <meta property="og:title" content="Privacy Policy | FTCScout" />
    <meta property="og:image" content="/banner.png" />
</svelte:head>

<WidthProvider width={"1000px"}>
    <Card>
        <h1>Privacy Policy</h1>
        <em>Last Revision: September 16th, 2022.</em>

        <p>
            By your continued use of the FTCScout Website, you agree to the privacy policy located on this page,
            including any amendments that FTCScout makes in the future.
        </p>

        <p>
            <b>We don't collect or share personal information.</b>
        </p>

        <h2>Cookies</h2>
        <p>We do not store cookies. There aren’t any to opt-out of, delete, or control.</p>

        <h2>Third Parties</h2>
        <p>We do not exchange your personal information with any third parties.</p>

        <h2>Analytics</h2>
        <p>
            We do not have any analytics software installed on the website, though we get information limited anonymous
            information through our Content Delivery Network (CDN).
        </p>
        <p>Anonymous information provided by CDN:</p>
        <ul>
            <li>Bandwidth usage</li>
            <li>Cached request count</li>
            <li>Request count</li>
            <li>Visitor count</li>
            <li>Web traffic by country</li>
            <li>Web traffic by TLS version</li>
        </ul>
        <p>No personally-identifiable information is collected, saved, or processed.</p>

        <h2>Your rights under The California Consumer Privacy Act (CCPA)</h2>
        <p>
            To delete your personal information: We don't collect or share personal information, so there is nothing to
            delete.
        </p>
    </Card>
</WidthProvider>

<style>
    * {
        line-height: 1.5rem;
        /* font-size: 16px; */
    }

    em {
        color: var(--secondary-text-color);
    }
</style>
