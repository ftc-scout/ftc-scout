<script>
    import Card from "$lib/components/Card.svelte";
    // import Head from "$lib/components/nav/Head.svelte";
    import WidthProvider from "$lib/components/WidthProvider.svelte";
</script>

<!-- <Head
    title="Privacy Policy | FTCScout"
    description="The Privacy Policy for FTCScout, a new way to track and scout FIRST Tech Challenge."
/> -->

<WidthProvider width={"1000px"}>
    <Card>
        <h1>Privacy Policy</h1>
        <em style="color: var(--secondary-text-color)">Last Revision: September 16th, 2022.</em>

        <p>
            By your continued use of the FTC<em>Scout</em> Website, you agree to the privacy policy
            located on this page, including any amendments that FTC<em>Scout</em> makes in the future.
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
            We do not have any analytics software installed on the website, though we get
            information limited anonymous information through our Content Delivery Network (CDN).
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
            To delete your personal information: We don't collect or share personal information, so
            there is nothing to delete.
        </p>
    </Card>
</WidthProvider>

<style>
    * {
        line-height: 2rem;
    }

    p,
    p * {
        font-size: 16px;
        margin-bottom: 0.25rem;
    }

    @media (max-width: 800px) {
        :not(h1, h2) {
            font-size: 14px;
        }
    }

    h1 {
        font-size: 32px;
        font-weight: bold;
        margin-bottom: 0.5rem;
    }

    h2 {
        font-size: 26px;
        font-weight: bold;
        margin-bottom: 0.75rem;
    }

    ul {
        margin-left: 1.5rem;
        margin-bottom: 0.75rem;
    }
</style>
