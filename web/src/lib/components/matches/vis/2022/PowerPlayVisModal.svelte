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
    import Modal from "../../../Modal.svelte";
    import Fa from "svelte-fa";
    import { CLOSE_ICON } from "../../../../icons";
    import type { ConeLayout } from "../../../../graphql/generated/graphql-operations";

    export let shown = false;
    export let matchDescription: string;
    export let autoLayout: ConeLayout;
    export let allLayout: ConeLayout;

    let autoRotateTimeout: NodeJS.Timeout | null = null;

    let cones: "All Cones" | "Auto Cones" = "All Cones";

    $: layout = cones == "All Cones" ? allLayout : autoLayout;
</script>

<Modal bind:shown>
    <b slot="title">
        <span>Match {matchDescription} Cones</span>
        <button
            on:click={() => {
                shown = false;
            }}
        >
            <Fa icon={CLOSE_ICON} size="1.5x" />
        </button>
    </b>

    <form on:submit|preventDefault>
        <span>
            <input type="radio" bind:group={cones} id="auto" name="cones" value="Auto Cones" />
            <label for="auto">Auto Cones</label>
        </span>
        <span>
            <input type="radio" bind:group={cones} id="all" name="cones" value="All Cones" />
            <label for="all">All Cones</label>
        </span>
    </form>

    <div>
        <SC.Canvas antialias background={new THREE.Color("#ffffff")} localClippingEnabled={true}>
            <Field />

            <Cones {layout} ourColor={"R"} />
            <Cones {layout} ourColor={"B"} />
            <Beacons {layout} />

            <CircuitVis {layout} ourColor={"R"} />
            <CircuitVis {layout} ourColor={"B"} />

            <!-- Camera -->
            <SC.PerspectiveCamera position={[-24 * 7, 90, -24]} />
            <SC.OrbitControls maxPolarAngle={Math.PI * 0.49} enablePan={false} />

            <!-- Lighting -->
            <SC.AmbientLight intensity={0.6} />
            <SC.DirectionalLight intensity={0.64} position={[-24, 24, 24]} />
        </SC.Canvas>
    </div>
</Modal>

<style>
    div {
        width: 1200px;
        max-width: 100%;
        max-height: calc(100vh - var(--large-gap) * 20);
        aspect-ratio: 16 / 9;
        margin: auto;
        position: relative;
    }

    b {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: var(--h2-font-size);
        margin-bottom: var(--large-gap);
    }

    button {
        background: none;
        border: none;

        cursor: pointer;
    }

    form {
        display: flex;
        justify-content: center;
        gap: var(--xl-gap);
        align-items: center;
    }
</style>
