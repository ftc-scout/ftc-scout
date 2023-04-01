<script>
    import { EMAIL } from "$lib/constants";
    import PostTemplate from "../PostTemplate.svelte";
</script>

<PostTemplate>
    <svelte:fragment slot="title">Mid, MID, MID!</svelte:fragment>
    <svelte:fragment slot="author">Jonah Reinis</svelte:fragment>
    <svelte:fragment slot="date">October 21, 2022</svelte:fragment>

    <p>
        <em>All statistics in this article refer to the 2021 Freight Frenzy Season.</em>
    </p>

    <p>
        I can remember checking <a href="http://ftcstats.org">ftcstats.org</a> nearly every day to see if someone topped
        our
        <a
            href="https://ftcscout.org/records/2021/teams?region=California+-+Los+Angeles&event-types=Traditional&end=2021-12-24"
        >
            1st place OPR Los Angeles
        </a>
        record (which held until the end of January). This is because we, as humans, tend to value extremes more than regular
        ones. That's why this scouting report is dedicated to our unsung heroes: the average.
    </p>

    <p>
        So there’s a few forms of average and a few different teams that could fit that criteria. Before we really dive
        into this I want to outline a few rules:
    </p>
    <ol>
        <li>
            A team needs to have a low standard deviation around their average score. An inconsistent team isn’t an
            average one.
        </li>
        <li>
            A team has to have a certain amount of matches, we’ll say a minimum of 20. It’s easy to get a low standard
            deviation without a substantial sample size.
        </li>
        <li>
            Remote events won’t be counted at all. This is because remote events aren’t really indicative of a team's
            strength.
        </li>
        <li>
            No stats from funky events will be calculated. This one is more subjective, but for example if your event
            had weird scheduling issues, or if there was a team (there always is) which went around an event scoring
            alliances -150 in penalty points.
        </li>
    </ol>

    <p>
        Our average score over all non-remote matches is <em>97.8</em>. Now that we have our rules and averages we can
        get to finding some average teams. Yowzas, it seems like
        <a href="https://ftcscout.org/teams/11337">Team 11337, Robonauts</a>, scored a daring 97.75 average over 28
        matches. With a low enough standard deviation for us to count it. To be fair,
        <a href="https://ftcscout.org/teams/9881">Team 9881, Golden Gears</a>, scored an average of 89 points over 33
        matches, which is the closest to the total <em>median</em> (89) score of matches in FTC. I guess not all battles
        have one winner, so at VexScout we want to congratulate both
        <a href="https://ftcscout.org/teams/9881">Golden Gear</a>s and
        <a href="https://ftcscout.org/teams/11337">Robonauts</a> on their terrific performances this past year. Truly the
        teams of all time.
    </p>

    <p>
        Now this is cool and all, but personally it doesn’t satisfy my <em>exceptionally average hunger</em>. We know
        what teams are average, but what about the average zone. A place in which one can't help but fit in with one's
        adjacent FTC brethren. What I’m talking about, of course, is the most average region. Our two regions, with
        average closest to the median, and average closest to the average are as follows. Aptly from the Midwest, I
        present to you: North Dakota at 97 points on average (technically Colorado is a little closer to the average at
        97.2 but Colorado had a substantially higher standard deviation, and we like that the most mid region is in the
        midwest). Our other region is South Texas with an average score of 88.5. Let's give it up for our two regions!
    </p>

    <p>
        The main takeaway from this blog is that the true average is the friends we’ve made along the way. Unless your
        friend is from North Dakota, in that case they’re the true average.
    </p>

    <p class="suggestions">
        If you have any suggestions for topics you would like us to cover email us at <a
            href="mailto:suggestions@ftcscout.org"
        >
            suggestions@vexscout.org</a
        >.
    </p>
</PostTemplate>

<style>
    * {
        line-height: 1.5rem;
    }

    :not(h1, h2, h1 *, h2 *) {
        font-size: 16px;
    }

    @media (max-width: 800px) {
        :not(h1, h2) {
            font-size: 14px;
        }
    }

    .code {
        font-family: monospace;
    }

    .suggestions {
        margin-top: var(--xl-gap);
        margin-bottom: 0;
        font-style: italic;
        color: var(--secondary-text-color);
    }
</style>
