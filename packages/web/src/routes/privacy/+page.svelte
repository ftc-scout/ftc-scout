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
            <em class="revision">Last Revision: September 11th, 2023.</em>
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
                We care deeply about personal privacy. Any information we recieve is information you
                choose to send us. Some of that information is automatically included with any
                request you make.
            </p>
            <br />
            <b>Information we process:</b>
            <ul>
                <li>User-Agent String</li>
                <li>IP Address</li>
                <li>Request URL</li>
                <li>Request Method</li>
            </ul>
            <b>We use it to determine:</b>
            <ul>
                <li>Total visitor count</li>
                <li>Visitor count by country</li>
                <li>User counts by platform (mobile vs desktop, etc)</li>
                <li>Times of day people use FTCScout the most</li>
            </ul>
            <b>The information we store cannot be used to:</b>
            <ul>
                <li>Identify you</li>
                <li>Find your precise location</li>
                <li>Track you online</li>
            </ul>
            <br />
            <p>
                We do not use your information for any other puropse, and we only collect
                information sent to us by your browser.
            </p>
            <h2>Your rights under The California Consumer Privacy Act (CCPA)</h2>
            <p>
                To delete your personal information: We don't collect or share personal information,
                so there is nothing to delete. If you would like us to delete specific IP addresses
                from our records anyway, email us at
                <a href="mailto:privacy@ftcscout.org">privacy@ftcscout.org</a>.
            </p>
        </div>
    </Card>
</WidthProvider>

<style>
    .head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--md-gap);

        background: var(--hover-color);
        border-radius: 8px;
        padding: var(--md-pad);
        margin-bottom: var(--sm-gap);
    }

    @media (max-width: 800px) {
        .head {
            flex-direction: column;
        }
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
