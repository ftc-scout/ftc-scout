<script context="module" lang="ts">
    export type Color = "R" | "B";
    export type ScoringElement = "RedCone" | "BlueCone" | "RedBeacon" | "BlueBeacon";
    export type Junction = "G" | "L" | "M" | "H";

    export interface ConeLayout {
        redNearTerminal: number;
        redFarTerminal: number;
        blueNearTerminal: number;
        blueFarTerminal: number;
        junctions: ScoringElement[][][];
    }

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

    let layout: ConeLayout = {
        blueFarTerminal: 1,
        blueNearTerminal: 0,
        redFarTerminal: 1,
        redNearTerminal: 1,
        junctions: [
            [[], ["RedCone"], [], [], []],
            [[], [], ["RedCone", "RedCone", "BlueCone", "RedBeacon"], ["RedBeacon"], ["RedCone", "RedCone"]],
            [[], ["BlueCone"], [], ["RedCone"], []],
            [[], ["BlueCone"], ["BlueCone", "RedCone"], ["RedCone"], ["RedCone"]],
            [[], [], [], [], []],
        ],
    };
</script>

<div>
    <SC.Canvas antialias background={new THREE.Color("#ffffff")} localClippingEnabled={true}>
        <Field />

        <Cones {layout} ourColor={"R"} />
        <Cones {layout} ourColor={"B"} />
        <Beacons {layout} />

        <CircuitVis {layout} ourColor={"R"} />
        <CircuitVis {layout} ourColor={"B"} />

        <!-- Camera -->
        <SC.PerspectiveCamera position={[24 * 4, 60, 24 * 4]} />
        <SC.OrbitControls maxPolarAngle={Math.PI * 0.49} enablePan={true} />

        <!-- Lighting -->
        <SC.AmbientLight intensity={0.6} />
        <SC.DirectionalLight intensity={0.64} position={[-24, 24, 24]} />
    </SC.Canvas>
</div>

<style>
    div {
        height: 400px;
    }
</style>
