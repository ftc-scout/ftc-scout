<script lang="ts">
    import BlogTemplate from "../BlogTemplate.svelte";
</script>

<BlogTemplate slug="advancement-and-leagues">
    <svelte:fragment slot="title">Advancement and Leagues Are Here</svelte:fragment>
    <svelte:fragment slot="author">MMathijs</svelte:fragment>
    <svelte:fragment slot="date">March 19, 2026</svelte:fragment>

    <p>
        With the 2025-2026 season there is a new advancement system, a lot of effort has been put
        into adding this new advancement system to FTC<em>Scout</em>. Alongside with that there have
        been a lot of changes, here is a quick summary:
    </p>

    <h2>New Features</h2>
    <ul>
        <li>
            <b>Advancement tab on event pages:</b> You can now just see the advancement rankings right
            on the event page. Like who is eligible to advance, how many slots there are, and where they
            advance to. Intermediate results are marked with a *, these results are unofficial and may
            change as more data comes in.
        </li>
        <li>
            <b>League rankings tab:</b> All league events now have a league rankings tab showing the
            current league rankings, with filters to switch between all teams only participating in the
            particular event or all teams in the league.
        </li>
        <li>
            <b>Preview Tab:</b> View the competition before it happens with a preview tab showing all
            teams ranked based on their opr or whatever metric you choose.
        </li>
    </ul>

    <h2>Improvements</h2>
    <ul>
        <li>
            <b>GraphQL updates:</b> Advancement and league data is also added
        </li>
        <li>
            <b>New REST API For Advancement and Leagues:</b> We added new REST endpoints for
            advancement and league data. You can read about them <a href="/api/rest">here</a>.
        </li>
        <li>
            <b>Better region team search:</b> Region team search is now based on a team's actual region
            data, instead of relying on where the team has competed in the past.
        </li>
        <li>
            <b>Cleaner icons:</b> Duplicate icons are removed and replaced with icons that better fit
            each section.
        </li>
    </ul>

    <h2>Bug Fixes</h2>
    <ul>
        <li>
            <b>DQ handling is now consistent:</b> Disqualifications now always count as a loss and give
            0 in tie-break calculations, same as how FIRST does it.
        </li>
        <li>
            Because of that DQ fix, displayed records, rankings, and tie-breaks may change compared
            to before.
        </li>
    </ul>

    <h2>Why This Matters</h2>
    <p>
        If you are trying to figure out who actually advances from an event, this update makes that
        a lot easier. All the advancement slots, rankings, and league stuff is just right there in
        FTC<em>Scout</em> now, no need to keep jumping between FTC-Events and FTC<em>Scout</em>.
    </p>

    <p>
        As always, thank you for all the bug reports and feature requests. If something still looks
        off for your region or your team, send us a message and we will take a look.
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
