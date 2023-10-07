<script lang="ts">
    import { T } from "@threlte/core";
    import { OrbitControls } from "@threlte/extras";
    import { fPos3 } from "./Field.svelte";
</script>

<T.PerspectiveCamera position={fPos3(-3, 2, 80)} makeDefault>
    <OrbitControls maxPolarAngle={Math.PI * 0.49} enablePan={false} />
</T.PerspectiveCamera>
