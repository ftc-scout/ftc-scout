<script lang="ts" context="module">
    export const JType = {
        G: "G",
        L: "L",
        M: "M",
        H: "H",
    } as const;
    export type JType = (typeof JType)[keyof typeof JType];

    export const JUNCTION_TYPES = [
        [JType.G, JType.L, JType.G, JType.L, JType.G],
        [JType.L, JType.M, JType.H, JType.M, JType.L],
        [JType.G, JType.H, JType.G, JType.H, JType.G],
        [JType.L, JType.M, JType.H, JType.M, JType.L],
        [JType.G, JType.L, JType.G, JType.L, JType.G],
    ];

    export const JUNCTION_HEIGHTS = {
        [JType.G]: 0.56,
        [JType.L]: 13.5,
        [JType.M]: 23.5,
        [JType.H]: 33.5,
    };
</script>

<script lang="ts">
    import { Canvas } from "@threlte/core";
    import Field from "../Field.svelte";
    import Camera from "../Camera.svelte";
    import PPTape from "./PPTape.svelte";
    import PpJunctions from "./PPJunctions.svelte";
    import Cones from "./Cones.svelte";
    import { Color } from "@ftc-scout/common";
    import type { ConeLayout } from "../../../../graphql/generated/graphql-operations";
    import Beacons from "./Beacons.svelte";
    import CircuitVis from "./CircuitVis.svelte";

    export let layout: ConeLayout;
</script>

<div>
    <Canvas>
        <Cones cones={layout} color={Color.Red} />
        <Cones cones={layout} color={Color.Blue} />
        <Beacons cones={layout} />

        <CircuitVis cones={layout} color={Color.Red} />
        <CircuitVis cones={layout} color={Color.Blue} />

        <Field />
        <PPTape />
        <PpJunctions />
        <Camera />
    </Canvas>
</div>

<style>
    div {
        width: 1200px;
        max-width: calc(100vw - var(--lg-gap) * 4);
        max-height: calc(100vh - var(--lg-gap) * 20);
        aspect-ratio: 16 / 9;
        margin: auto;
        position: relative;
    }
</style>
