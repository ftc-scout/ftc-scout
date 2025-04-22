<script lang="ts">
    import Card from "$lib/components/Card.svelte";
    import WidthProvider from "$lib/components/WidthProvider.svelte";
    import Head from "$lib/components/Head.svelte";
    import { EMAIL } from "$lib/constants";
</script>

<Head title="Sponsor Info | FTCScout" description="Become a sponsor of FTCScout" />

<WidthProvider width={"1000px"}>
    <Card>
        <h1 class="head">Sponsor Info</h1>

        <div class="rest">
            <p>If you're interested in sponsoring us, there's some information you should know:</p>

            <h2>What you recieve:</h2>
            <p>
                As a sponsor, your logo will be placed in the sidebar, and be visible on all pages
                where the sidebar is present. This includes the team pages, event pages, and the
                home page. Your logo will be clickable, and will link to your website.
            </p>
            <div class="image-wrap">
                <img
                    class="statsimg"
                    src="/img/examplesidebar.png"
                    alt="A screenshot of FTCScout's Teams Records page, with a green example logo in the sidebar"
                />
            </div>
            <h2>Our expenses:</h2>
            <p>
                Here is a breakdown of what the sponsorship money will be used for, as an estimate:
                (USD)
            </p>
            <table>
                <thead>
                    <tr>
                        <th>Expense</th>
                        <th>Cost</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Standard Hosting (Hetzner CPX11)</td>
                        <td>$5.59/month @ 11 months/year</td>
                    </tr>
                    <tr>
                        <td>World Championships Upgraded Hosting (Hetzner CPX31)</td>
                        <td>$18.59/month @ 1 month/year</td>
                    </tr>
                    <tr>
                        <td>Domain (Google Domains)</td>
                        <td>$12/year</td>
                    </tr>
                    <tr>
                        <td><b>Total</b></td>
                        <td><b>$92.08/year</b></td>
                    </tr>
                </tbody>
            </table>

            <h2>Your commitment</h2>
            <p>
                The cost to sponsor us for 1 year is $150. This will cover our hosting and domain
                costs for the year, as well as other miscellaneous costs, like taxes, price
                fluctuations, and server upgrades if necessary. All money will be used to maintain
                FTCScout.
            </p>

            <h2>Information we need:</h2>
            <p>
                If you're interested in sponsoring us, please <a href={"mailto:" + EMAIL}
                    >email us</a
                > with the following information:
            </p>
            <ul>
                <li>Your company name</li>
                <li>Link to your company website</li>
                <li>Logo to place on the sidebar (high-resolution PNG or SVG image)</li>
            </ul>

            <p>Thank you so much for your consideration.</p>
        </div>
    </Card>
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

    p {
        line-height: 1.75;
        margin: var(--md-gap) 0;
    }

    ul {
        margin: var(--md-gap) 0;
        padding-left: var(--lg-pad);
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

    table {
        width: 75%;
        border-collapse: collapse;
        margin: 0 auto;
    }
    th,
    td {
        padding: var(--sm-pad);
        text-align: left;
        border: 1px solid var(--sep-color);
    }
</style>
