<script lang="ts">
    import MatchTable from "$lib/components/matches/MatchTable.svelte";
    import type { BlogMatchImport } from "../+page.svelte";
    import BlogTemplate from "../BlogTemplate.svelte";

    import * as data1_ from "../data/USIAMALT.json";
    let data1 = data1_ as BlogMatchImport;

    import * as data2_ from "../data/USNJNOM2.json";
    let data2 = data2_ as BlogMatchImport;
</script>

<BlogTemplate slug="circuitous-circuits">
    <svelte:fragment slot="title">Circuitous Circuits</svelte:fragment>
    <svelte:fragment slot="author">Daniel James</svelte:fragment>
    <svelte:fragment slot="date">March 10, 2023</svelte:fragment>

    <p>
        FTCScout recently started tracking the exact positions of all cones scored in every Power
        Play match which means I now have extra data to analyze for Scouting Reports!
    </p>

    <p>
        The question that I was most interested in is what is the longest circuit scored this
        season. The answer is <a href="/events/2022/USIAMALT/matches?scores=USIAMALT-23"
            >this match</a
        >
        where the blue alliance scored a circuit spanning nine junctions and terminals. Interestingly
        the red alliance also scored a circuit in this match. A rare double circuit, an event that has
        only occurred
        <a href={`/records/2022/matches?filter=and-circuitPointsThis.eq.20+circuitPointsOpp.eq.20-`}
            >79 times</a
        > (just 3% of matches!).
    </p>

    <MatchTable {...data1} />

    <div class="image-wrap">
        <img
            src="/img/longest circuit.png"
            alt="A 3D visualization of the aforementioned match. Blue has a long winding circuit while red has one that crosses the field diagonally."
        />
        <em>To see an interactive version of this visualization click the match score above.</em>
    </div>

    <p>Let’s also do some more interesting circuit facts.</p>

    <p>
        57 alliances have scored a circuit using the minimum number of cones possible (six). <a
            href="/records/2022/matches?filter=and-circuitPointsThis.eq.20+dcPointsThis.eq.18+dcHighPointsThis.eq.10+beaconOwnershipPointsThis.eq.0-&rank-ty=FilterSkip"
            >See the list here.</a
        >
    </p>

    <p>
        Two matches are tied for the greatest cone differential while still scoring a circuit but <a
            href="/events/2022/USNJNOM2/matches?scores=USNJNOM2-8">this one from New Jersey</a
        > is my favorite because it was also done using the minimum number of cones. The blue alliance
        got out-coned 20 to 6 but still managed to score a circuit. (They also got destroyed 163 to 70
        but they made it into a Scouting Report and isn’t that all that really matters?).
    </p>

    <MatchTable {...data2} />

    <div class="image-wrap">
        <img
            src="/img/outscored circuit.png"
            alt="A 3D visualization of the aforementioned match. Blue has scored a circuit with only six cones while red has scored 20 with 9 on the closest high junction."
        />
        <em>To see an interactive version of this visualization click the match score above.</em>
    </div>

    <p>That’s all for now. Thanks for reading!</p>
</BlogTemplate>

<style>
    img {
        max-width: 100%;
        border-radius: 8px;
        margin: var(--md-gap) 0;
    }

    .image-wrap {
        display: flex;
        flex-direction: column;
        align-items: center;
        max-width: 100%;
    }

    .image-wrap em {
        color: var(--secondary-text-color);
    }
</style>
