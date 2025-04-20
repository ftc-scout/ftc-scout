<script lang="ts">
    import Card from "$lib/components/Card.svelte";
    import WidthProvider from "$lib/components/WidthProvider.svelte";
    import Head from "$lib/components/Head.svelte";
</script>

<Head title="FIRST | FTCScout" description="How to get started competing in FIRST" />

<WidthProvider width={"1000px"}>
    <Card>
        <h1 class="head">How to get started competing in FIRST</h1>

        <div class="rest">
            <p>
                On occasion, we recieve emails from mildly confused parents asking how to enroll
                their kids in FIRST. My best guess for why this happens is that the parent and kid
                come across, or are invited to, an FTC event, and are told that the scores are
                available on FTCScout. After spending the day watching robots and following the
                scores on FTCScout, their kid asks to join, and they end up hitting the email
                button. Reasonable enough.
            </p>
            <p>
                Usually, we direct them to the FIRST website or tell them how to find teams in their
                local area to join, but I feel like it would be easier and better if we made a guide
                here.
            </p>
            <h2>What is FIRST and what is FTC?</h2>
            <p>
                FIRST stands for "For Inspiration and Recognition of Science and Technology". It is
                a non-profit organization that runs robotics programs for students, all the way from
                Pre-K through 12th grade. This website (unaffiliated with FIRST) is dedicated
                specifically to tracking scores for FIRST's FTC program (FIRST Tech Challenge),
                which is a robotics competition for grades 7-12. It is an international robotics
                competition for robots 18x18in (46x46cm) or smaller. There are thousands of teams
                across the world, and they compete in a different game every year.
            </p>
            <p>
                If you're looking for a different program for a younger student, or for a league for
                larger robots, please find more information on the <a
                    href="https://www.firstinspires.org/"
                    target="_blank"
                    rel="noopener">FIRST website</a
                >. If FTC is the right program for you, read on!
            </p>
            <h2>How do I get started?</h2>
            <p>You have 2 options - join a team, or start a team.</p>
            <h3>Joining a team:</h3>
            <p>
                If you want to join a team, we maintain a convenient
                <a href="/teams">list of teams here</a>. FIRST has a similar webpage
                <a
                    href="https://www.firstinspires.org/team-event-search"
                    target="_blank"
                    rel="noopener">here</a
                >. You can sort by region, and look into each one from there. Some are affiliated
                with schools, and therefore may not be accepting students from other schools. Others
                are community teams made up of participants from the local area. While we don't
                maintain contact information on every team, you can search the internet for that
                team's name and number. Many teams have social media presences or websites.
            </p>
            <h3>Starting a team:</h3>
            <p>
                You can gather interested participants from your local area, and start your own
                team! Be aware that registration and robot parts aren't free. FIRST has a webpage
                listing out the expected costs associcated with starting an FTC team, <a
                    href="https://www.firstinspires.org/robotics/ftc/cost-and-registration"
                    target="_blank"
                    rel="noopener">located here</a
                >. They also have an example budget spreadsheet
                <a
                    href="https://www.firstinspires.org/sites/default/files/uploads/resource_library/ftc/sample-budget.xlsx"
                    target="_blank"
                    rel="noopener">here</a
                >. You may be able to offset that cost with grants and sponsorships. FIRST has a
                webpage with information on grants and sponsorships,
                <a
                    href="https://www.firstinspires.org/robotics/team-grants-faq"
                    target="_blank"
                    rel="noopener">located here</a
                >. You may also be able to encourage your kid's school to fund and maintain a
                robotics team.
            </p>
            <h2>Timeline</h2>
            <p>
                Here is the timeline assocated with FTC: <a
                    href="https://www.firstinspires.org/robotics/ftc/season-timeline"
                    target="_blank"
                    rel="noopener">Source</a
                >
            </p>
            <div class="image-wrap">
                <img
                    class="statsimg"
                    src="/img/timeline.png"
                    alt="A chart of the season timeline for FTC. Registration opens in May. Preseason lasts from May to August. Kickoff starts in September. Build and practice lasts from September to January. Qualifying lasts from October to March. State and regional championships last from December to March. The world championship starts in April."
                />
            </div>
            <h2>FAQ</h2>
            <h3>Do I need technology or robotics experience?</h3>
            <p>
                Nope. While it's nice to have some experienced people on a team, all you really need
                is curiousity and a willingness to learn. Everyone starts somewhere, and FTC is an
                excellent place to learn and explore.
            </p>
            <h3>How far do I need to travel to compete?</h3>
            <p>
                Each team has a league or region comprised of teams in the local(ish) area. These
                can be travelled to by car, and are generally pretty easy transportation-wise. If
                your team qualifies, you may advance to larger tournaments which feature teams from
                several leagues. These are generally further than your league. If you advance from
                there, you can make it to the world championships! These are located in Texas (USA),
                and for most teams, that's a plane ride away. While most teams don't make it to the
                world championships, it's always good to keep the possibility in mind when joining a
                team.
            </p>
            <h3>Are robotics safe?</h3>
            <p>
                Any activity carries some inherent risk, but teaching proper safety etiquette can go
                a long way in keeping participants safe. Make sure everyone is using their tools
                properly and is wearing safety glasses.
            </p>
            <h3>How many people are on a team?</h3>
            <p>
                There is no "perfect team size", but most teams have 6-12 students participating,
                and all teams need at least 2 adults to teach and mentor the students. Too many
                students leaves people empty-handed, while too few gives too much responsiblity on
                each person. More information is available in the <a
                    href="https://www.firstinspires.org/sites/default/files/uploads/resource_library/ftc/mentor-manual.pdf"
                    target="_blank"
                    rel="noopener">Mentor Manual</a
                >, from FIRST.
            </p>
            <h3>How often do teams meet?</h3>
            <p>
                Teams typically meet once or twice a week during the game season, though this varies
                from team to team.
            </p>
            <h3>What if I have a question that is not listed here?</h3>
            <p>
                You can find the FIRST Help Center <a
                    href="https://help.firstinspires.org"
                    target="_blank"
                    rel="noopener">here</a
                >, or you can chat with people in the FTC (unofficial) Discord Chat
                <a href="https://discord.com/invite/ftc" target="_blank" rel="noopener">here</a>.
            </p>
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
        padding: var(--md-pad);
        border-radius: 8px;
        background: var(--hover-color);
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
        width: 85%;
    }

    img {
        border-radius: 8px;
    }
</style>
