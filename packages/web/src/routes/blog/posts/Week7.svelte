<script lang="ts">
    import BlogTemplate from "../BlogTemplate.svelte";
</script>

<BlogTemplate slug="change-log">
    <svelte:fragment slot="title">FTC<em>Scout</em> Season 2: What's New</svelte:fragment>
    <svelte:fragment slot="author">Daniel James</svelte:fragment>
    <svelte:fragment slot="date">October 15, 2023</svelte:fragment>

    <p>
        This offseason we rewrote FTC<em>Scout</em> from the ground up. In the process we made many improvements,
        fixed lots of bugs, and added cool new features. Here is a fairly exhaustive list of what's changed.
    </p>

    <h2>New Features</h2>
    <ul>
        <li><b>Center Stage!:</b> We now have the 2023-2024 season Center Stage!</li>
        <li>
            <b>Dark Mode!:</b> FTC<em>Scout</em> is the first FTC website with dark mode. Enable it by
            clicking the moon icon in the top right. Your preference will be remembered and your operating
            system preference respected. Let us know if there are any dark mode visual bugs or things
            that don't look great.
        </li>
        <li>
            <b>Matches Update Without Refresh:</b> If you are viewing the event page for a live
            event you no longer need to refresh the page to see if new matches have been added. The
            matches will be updated automatically as soon as FTC<em>Scout</em> has them.
        </li>
        <li>
            <b>Vote for the best team name:</b> We are running a competition to see which team has the
            best name. On the home screen you will see two random teams. Vote for your favorite name
            by clicking it. Once we have enough votes we will write a blog post about the winners.
        </li>
        <li>
            <b>Quick Stats:</b> On the page for individual teams you will now see a "Quick Stats" section.
            This includes the team's best OPR for total points, auto points, teleop points, and endgame
            points. It also shows you the team's rank and percentile among all teams in each of those
            categories.
        </li>
        <li>
            <b>REST API:</b> We hear you. The GraphQL API is too complicated for quick queries.
            That's why we added a simple REST API for getting data about matches and events. You can
            read about it <a href="/api/rest">here</a>. <b>Note:</b> If you are currently using the GraphQL
            API a small number of fields have changed names.
        </li>
    </ul>

    <h2>Improvements</h2>
    <ul>
        <li>
            <b>Numerous Visual Improvements:</b> The visual style of the site has been slightly
            reworked.
            <ul>
                <li>No more shadows on cards throughout the website.</li>
                <li>Larger font sizes on mobile.</li>
                <li>More compact layouts. Less wasted whitespace.</li>
                <li>Nicer looking buttons, dropdown menus, and text boxes.</li>
                <li>The filter dialog looks significantly better.</li>
                <li>
                    The header on stat pages now sticks to the top of the screen when you scroll.
                </li>
                <li>Team names aren't too large on stat tables and can still be seen on mobile.</li>
                <li>The list of related events uses just the name of the division.</li>
                <li>
                    The awards page uses a two column layout and division awards are named
                    correctly.
                </li>
                <li>Socials links in the sidebar look nicer.</li>
                <li>And more…</li>
            </ul>
        </li>
        <li>
            <b>Searchbar Rework:</b> The searchbar in the top right of the screen has been reworked.
            It now loads all data immediately so future searches are instant. You can use the hotkey
            '/' to start a search. We've also switched to a custom search algorithm developed
            specifically for FTC<em>Scout</em>. Let us know hot it works!
        </li>
        <li>
            <b>Records and Custom Events:</b> Events with modified rules are no longer included in the
            season records page or in the world record on the home page. The home page world record also
            no longer includes offseason events.
        </li>
        <li>
            <b>Rank Only Best Results:</b> You can now choose to only rank the best result by each team
            on the season records page. This is enabled by default.
        </li>
        <li>
            <b>Team and Events Pages:</b> The team and event pages have been redone to be much more useful.
            We can now recommend using the events page to find events. These pages also now use the custom
            algorithm the search bar uses.
        </li>
        <li>
            <b>Livestream URLs:</b> If an event lists a livestream url it is now displayed on the event
            page.
        </li>
        <li>
            <b>Backend Improvements:</b> The backend of the website has been redone so that all the information
            needed to define a season is located in a single file. This will make it much quicker to
            add future seasons.
        </li>
        <li>
            <b>Performance Improvements:</b> Certain actions are now much faster. For instance season
            records queries and search queries.
        </li>
    </ul>

    <h2>Bug Fixes</h2>
    <ul>
        <li>
            Previously the teams for an event wouldn't show up until the day of the event. Now teams
            should show up as soon as the event publishes their team list.
        </li>
        <li>OPR was missing from the bottom bar when focusing a team at an event.</li>
        <li>
            Going to a team's page from an event from a previous season would take you to the wrong
            season.
        </li>
        <li>Match played times are now correct.</li>
        <li>Skystone tiebreaker points are calculated correctly.</li>
        <li>
            You can now scroll the page immediately upon loading instead of having to click
            something first.
        </li>
        <li>Typing in the searchbar before the page had finished loading would break it.</li>
        <li>Fixed a crash in the cone visualization.</li>
        <li>Fixed data being unnecessarily loaded on first load of the site.</li>
    </ul>

    <p>
        As always we appreciate any feedback, bug reports, or suggestions you might have. Please
        email us or contact a dev on discord.
    </p>
</BlogTemplate>

<style>
    h2 {
        font-size: var(--lg-font-size);
        margin: var(--lg-gap) 0 var(--sm-gap) 0;
    }

    ul {
        line-height: 1.75;
        margin-left: var(--vl-gap);
    }
</style>
