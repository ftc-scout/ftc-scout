<script>
    import { EMAIL } from "$lib/constants";
    import PostTemplate from "../PostTemplate.svelte";
</script>

<PostTemplate>
    <svelte:fragment slot="title">Introducing Vex Scout</svelte:fragment>
    <svelte:fragment slot="author">Jonah Reinis</svelte:fragment>
    <svelte:fragment slot="date">April 1, 2023</svelte:fragment>

    <p>
        <em>All statistics in this article refer to the 2022-2023 Spin Up Season.</em>
    </p>
    <p>
        As you may have seen, we’ve decided that FTCScout was in need of an upgrade. Introducing, VexScout. We’ve
        decided to make this switch because we felt that our goals and values aligned more with VEX than it did with
        FIRST.
    </p>

    <p>VEX is just objectively better than FIRST</p>
    <p>
        To show this, we took a survey. We asked 38,645,670 people (pretty much the entire country of Canada) if they
        thought VEX was better than FTC (and if they didn’t hate puppies), and people overwhelmingly preferred VEX
        Robotics Competition to FTC.
    </p>

    <div class="image-wrap">
        <img src="/img/vex stats.png" alt="Pie chart showing an overwhelming support for VEX over FTC and FLL" />
        <em
            >We understand the problem with asking people about two things at once, we just don't care. VEX enjoyers
            stay winning!</em
        >
    </div>

    <p>
        As revealed to me in a dream, the VEX Robotics Competition is proven to enhance your mood and opinions. I showed
        my friend the Spin Up game video; suddenly, she began criticizing certain sponsors of FTC and ranting about who
        profits from war.
    </p>

    <p>
        Additionally, VEX has fewer syllables than FTC. Things that are better tend to have less syllables. Take the
        words “great” and “horrible” as an example: “great” has fewer syllables, and has a much more positive
        connotation.
    </p>

    <p>
        2018 VEX Worlds is also the biggest robotics competition ever, according to <a
            href="https://www.guinnessworldrecords.com/news/commercial/2018/5/over-30-000-students-help-to-break-the-record-for-largest-robot-competition-525746"
        >
            Guinness World Records</a
        >.
    </p>

    <p>Please enjoy VexScout, the definitive Vex Robotics scouting website.</p>

    <p>
        <em
            >Disclaimer: VEX Scout is funded in part by BlackRock Inc., The University of Illinois Urbana-Champaign, and
            Calculus: Early Transcendentals (the book itself)</em
        >
    </p>

    <p class="suggestions">
        If you have any suggestions for topics you would like us to cover email us at <a
            href="mailto:suggestions@ftcscout.org"
        >
            suggestions@vexscout.org</a
        >.
    </p>
</PostTemplate>
