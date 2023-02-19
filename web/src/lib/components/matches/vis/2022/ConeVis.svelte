<script lang="ts">
    import * as THREE from "three";
    import * as SC from "svelte-cubed";
    import Cone, { type ConeLayout } from "./Cone.svelte";
    import Field from "./Field.svelte";
    import CircuitVis from "./CircuitVis.svelte";

    const RED_CONE_MAT = new THREE.MeshStandardMaterial({ color: "#D00000" });
    const BLUE_CONE_MAT = new THREE.MeshStandardMaterial({ color: "#0000A0" });

    let layout: ConeLayout = {
        blueFarTerminal: 1,
        blueNearTerminal: 0,
        redFarTerminal: 1,
        redNearTerminal: 1,
        junctions: [
            [[], ["R"], [], [], []],
            [[], [], ["R", "R", "B", "R"], ["R"], ["R", "R"]],
            [[], ["B"], [], ["R"], []],
            [[], ["B"], ["B", "R"], ["R"], ["R"]],
            [[], [], [], [], []],
        ],
    };
</script>

<div>
    <SC.Canvas antialias background={new THREE.Color("#ffffff")} localClippingEnabled={true}>
        <Field />

        <Cone material={RED_CONE_MAT} {layout} ourColor={"R"} />
        <Cone material={BLUE_CONE_MAT} {layout} ourColor={"B"} />

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
