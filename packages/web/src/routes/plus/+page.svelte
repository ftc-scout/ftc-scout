<script lang="ts">
    import Card from "$lib/components/Card.svelte";
    import WidthProvider from "$lib/components/WidthProvider.svelte";
    // import Contributor from "./Contributor.svelte";
    import Head from "$lib/components/Head.svelte";
    import { faXmarkCircle, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
    import Fa from "svelte-fa";
    import Shiny from "./shiny.svelte";
    import { trialStarted } from "./shiny.svelte";
    import { goto } from "$app/navigation";

    function startTrial() {
        $trialStarted = true;
        goto("/");
    }
</script>

<Head title="FTCScout Plus | FTCScout" description="An even newer way to scout." />

<WidthProvider width={"1000px"}>
    <Card>
        <div class="title">
            <h1>FTC<em>Scout</em><Shiny always /></h1>
            <h2>An even newer way to scout.</h2>
        </div>

        <div class="rest">
            <p>
                Here at FTC<i>Scout</i>, we've always been committed to provding the best scouting
                experience possible, which is why we're excited to introduce our latest innovation:
                FTC<i>Scout</i> Plus. It's a way to level up your scouting game with some great new features
                we know you're going to love.
            </p>
            <p>
                We're giving users a bold new choice in the way that they enjoy FTC<i>Scout</i>. As
                part of this transition, we're sunsetting the classic FTC<i>Scout</i> name, which is
                being upgraded to FTC<i>Scout</i> Minus.
            </p>
            <h2 class="head">Incredible New Features</h2>
            <h3>Unlock Entire Statistics Library</h3>
            <p>
                With FTC<i>Scout</i> Plus, you can access our entire library of statistics, including
                complete match history, previous seasons, and even more teams. This means you can do
                the best analysis possible.
            </p>
            <h3>Get 3 free score changes every month</h3>
            <p>That's right - the more you pay, the better your OPR is.</p>
            <h3>Offline Viewing</h3>
            <p>
                Unlock the "Download CSV" button on any page, and view the data in Google Sheets any
                time you like. It's like the website, but somewhere else!
            </p>
            <h3>And so much more!</h3>
            <h2 class="head">Plans</h2>
            <table>
                <thead>
                    <tr>
                        <th />
                        <th>Minus</th>
                        <th>Plus</th>
                        <th>Enterprise</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Price</td>
                        <td>Free</td>
                        <td>$79.00/month<br />$279.00/year</td>
                        <td>Contact Sales</td>
                    </tr>
                    <tr>
                        <td>Stats Access</td>
                        <td>Limited</td>
                        <td>Full</td>
                        <td>Full + Early Access to Future Stats</td>
                    </tr>
                    <tr>
                        <td>Score Changes</td>
                        <td>0/month</td>
                        <td>3/month</td>
                        <td>Unlimited</td>
                    </tr>
                    <tr>
                        <td>Team Information</td>
                        <td class="circleIcon circleGreen"><Fa icon={faCheckCircle} /></td>
                        <td class="circleIcon circleGreen"><Fa icon={faCheckCircle} /></td>
                        <td class="circleIcon circleGreen"><Fa icon={faCheckCircle} /></td>
                    </tr>
                    <tr>
                        <td>View All Matches</td>
                        <td class="circleIcon circleRed"><Fa icon={faXmarkCircle} /></td>
                        <td class="circleIcon circleGreen"><Fa icon={faCheckCircle} /></td>
                        <td class="circleIcon circleGreen"><Fa icon={faCheckCircle} /></td>
                    </tr>
                    <tr>
                        <td>Offline Viewing</td>
                        <td class="circleIcon circleRed"><Fa icon={faXmarkCircle} /></td>
                        <td class="circleIcon circleGreen"><Fa icon={faCheckCircle} /></td>
                        <td class="circleIcon circleGreen"><Fa icon={faCheckCircle} /></td>
                    </tr>
                    <tr>
                        <td>Past Seasons</td>
                        <td class="circleIcon circleRed"><Fa icon={faXmarkCircle} /></td>
                        <td class="circleIcon circleGreen"><Fa icon={faCheckCircle} /></td>
                        <td class="circleIcon circleGreen"><Fa icon={faCheckCircle} /></td>
                    </tr>
                    <tr>
                        <td>Live Events</td>
                        <td class="circleIcon circleRed"><Fa icon={faXmarkCircle} /></td>
                        <td class="circleIcon circleGreen"><Fa icon={faCheckCircle} /></td>
                        <td class="circleIcon circleGreen"><Fa icon={faCheckCircle} /></td>
                    </tr>
                    <tr>
                        <td>3D Visualization</td>
                        <td class="circleIcon circleRed"><Fa icon={faXmarkCircle} /></td>
                        <td class="circleIcon circleGreen"><Fa icon={faCheckCircle} /></td>
                        <td class="circleIcon circleGreen"><Fa icon={faCheckCircle} /></td>
                    </tr>
                    <tr>
                        <td>AIScout</td>
                        <td class="circleIcon circleRed"><Fa icon={faXmarkCircle} /></td>
                        <td class="circleIcon circleRed"><Fa icon={faXmarkCircle} /></td>
                        <td class="circleIcon circleGreen"><Fa icon={faCheckCircle} /></td>
                    </tr>
                </tbody>
            </table>
            <div class="purchasebuttons">
                <a href="/"><button class="minusButton">Continue with Minus</button></a>
                <button class="plusButton" on:click={() => startTrial()}
                    >Begin Free Plus Trial</button
                >
                <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                    ><button class="enterpriseButton">Contact Sales</button></a
                >
            </div>
        </div>
    </Card>
</WidthProvider>

<style>
    .purchasebuttons {
        display: flex;
        gap: var(--md-gap);
        justify-content: center;
        margin-top: var(--lg-gap);
    }

    .purchasebuttons button {
        padding: var(--md-pad) var(--lg-pad);
        font-size: var(--lg-font-size);
        font-weight: bold;
        border: none;
        border-radius: 8px;
        cursor: pointer;
    }

    .purchasebuttons button:hover {
        opacity: 0.9;
    }

    .minusButton {
        background: var(--sep-color);
        color: var(--text-color);
    }

    .plusButton {
        background: var(--theme-color);
        color: var(--inverse-text-color);
    }

    .enterpriseButton {
        background: var(--blue-team-text-color);
        color: var(--inverse-text-color);
    }

    .circleIcon {
        text-align: center;
        font-size: 1.5em;
    }

    .circleRed {
        color: #ff3333;
    }

    .circleGreen {
        color: #33cc33;
    }

    .title {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--sm-gap);
    }

    .title h2 {
        font-size: calc(var(--xl-font-size) * 1.25);
    }

    .head {
        background: var(--hover-color);
        border-radius: 8px;
        padding: var(--md-pad);
    }

    .rest {
        padding: var(--sm-pad);
    }

    h1 {
        font-size: 10vw;
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

    /* .image-wrap {
        width: 100%;
        display: flex;
        justify-content: center;
    } */

    /* img {
        border-radius: 8px;
    } */

    /* .contributors {
        display: flex;
        align-items: center;
        justify-content: space-evenly;
    } */

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
        padding-top: var(--lg-pad);
        padding-bottom: var(--lg-pad);
    }

    thead {
        background: var(--hover-color);
    }

    tbody td:nth-child(2) {
        background: var(--hover-color);
    }
</style>
