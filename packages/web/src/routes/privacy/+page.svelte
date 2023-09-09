<script lang="ts">
    import Card from "$lib/components/Card.svelte";
    import Head from "$lib/components/Head.svelte";
    import WidthProvider from "$lib/components/WidthProvider.svelte";
</script>

<Head title="Privacy Policy | FTCScout" description="The Privacy Policy for FTCScout." />

<WidthProvider width={"100ch"}>
    <Card>
        <div class="head">
            <h1>Privacy Policy</h1>
            <em class="revision">Last Revision: September 16th, 2022.</em>
        </div>

        <div class="rest">
            <p>
                By your continued use of the FTC<em>Scout</em> Website, you agree to the privacy
                policy located on this page, including any amendments that FTC<em>Scout</em> makes in
                the future.
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
                information limited anonymous information through our Content Delivery Network
                (CDN).
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
                To delete your personal information: We don't collect or share personal information,
                so there is nothing to delete.
            </p>
        </div>
    </Card>
</WidthProvider>

<style>
    .head {
        display: flex;
        align-items: center;
        justify-content: space-between;

        background: var(--hover-color);
        border-radius: 8px;
        padding: var(--md-pad);
        margin-bottom: var(--sm-gap);
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

    p,
    ul {
        line-height: 1.75;
    }

    .revision {
        color: var(--secondary-text-color);
    }

    ul {
        margin-left: var(--vl-gap);
    }
</style>
