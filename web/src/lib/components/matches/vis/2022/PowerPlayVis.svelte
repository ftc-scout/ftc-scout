<script context="module" lang="ts">
    export type Color = "R" | "B";
    export type Junction = "G" | "L" | "M" | "H";

    export function junctionType(x: number, y: number): Junction {
        return (
            [
                ["G", "L", "G", "L", "G"],
                ["L", "M", "H", "M", "L"],
                ["G", "H", "G", "H", "G"],
                ["L", "M", "H", "M", "L"],
                ["G", "L", "G", "L", "G"],
            ] as const
        )[x][y];
    }

    export function junctionHeight(x: number, y: number): number {
        const JUNCTION_HEIGHTS: Record<Junction, number> = {
            G: 0.56,
            L: 13.5,
            M: 23.5,
            H: 33.5,
        };

        return JUNCTION_HEIGHTS[junctionType(x, y)];
    }

    export const EPSILON = 0.01;

    export const RED_CONE_MAT = new THREE.MeshStandardMaterial({ color: "#D00000" });
    export const BLUE_CONE_MAT = new THREE.MeshStandardMaterial({ color: "#0000A0" });
</script>

<script lang="ts">
    import * as THREE from "three";
    import * as SC from "svelte-cubed";
    import Cones from "./Cones.svelte";
    import Field from "./Field.svelte";
    import CircuitVis from "./CircuitVis.svelte";
    import Beacons from "./Beacons.svelte";
    import type { ConeLayout, TeamMatchParticipation } from "../../../../graphql/generated/graphql-operations";
    import { TroisProvider } from "svelte-trois";
    import Hover from "./Hover.svelte";

    export let teams: TeamMatchParticipation[];
    export let layout: ConeLayout;
</script>

<div>
    <SC.Canvas antialias background={new THREE.Color("#ffffff")} localClippingEnabled={true}>
        <TroisProvider>
            <Field />

            <Cones {layout} ourColor={"R"} />
            <Cones {layout} ourColor={"B"} />
            <Beacons {layout} />

            <CircuitVis {layout} ourColor={"R"} />
            <CircuitVis {layout} ourColor={"B"} />

            <Hover {layout} {teams} />

            <!-- Camera -->
            <SC.PerspectiveCamera position={[-24 * 7, 90, -24]} />
            <SC.OrbitControls maxPolarAngle={Math.PI * 0.49} enablePan={false} />

            <!-- Lighting -->
            <SC.AmbientLight intensity={0.6} />
            <SC.DirectionalLight intensity={0.64} position={[-24, 24, 24]} />
        </TroisProvider>
    </SC.Canvas>
</div>

<style>
    div {
        width: 1200px;
        max-width: 100%;
        max-height: calc(100vh - var(--large-gap) * 20);
        aspect-ratio: 16 / 9;
        margin: auto;
        position: relative;
    }
</style>
