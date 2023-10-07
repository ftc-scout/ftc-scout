<script lang="ts">
    import { BLUE_COLOR, RED_COLOR, TILE_CNT, TILE_SIZE } from "../Field.svelte";
    import FieldLine from "../FieldLine.svelte";

    const RT2 = Math.SQRT2 / TILE_SIZE;
    const RT1_2 = Math.SQRT1_2 / TILE_SIZE;
    const INCH = 1 / TILE_SIZE;
</script>

<!-- Stack Tape -->
<FieldLine start={[2.5 - INCH / 2, 0]} end={[2.5 - INCH / 2, 1]} color={RED_COLOR} />
<FieldLine start={[2.5 - INCH / 2, 6]} end={[2.5 - INCH / 2, 5]} color={RED_COLOR} />
<FieldLine start={[3.5 + INCH / 2, 0]} end={[3.5 + INCH / 2, 1]} color={BLUE_COLOR} />
<FieldLine start={[3.5 + INCH / 2, 6]} end={[3.5 + INCH / 2, 5]} color={BLUE_COLOR} />

<!-- Terminals -->
<FieldLine start={[1, -RT2]} end={[-RT2, 1]} color={RED_COLOR} />
<FieldLine start={[5, 6 + RT2]} end={[6 + RT2, 5]} color={RED_COLOR} />
<FieldLine start={[5, -RT2]} end={[6 + RT2, 1]} color={BLUE_COLOR} />
<FieldLine start={[-RT2, 5]} end={[1, 6 + RT2]} color={BLUE_COLOR} />

<!-- Substations -->
<FieldLine start={[-RT1_2, 2.5 - RT1_2]} end={[0.5 + RT1_2, 3 + RT1_2]} color={RED_COLOR} />
<FieldLine start={[-RT1_2, 3.5 + RT1_2]} end={[0.5 + RT1_2, 3 - RT1_2]} color={RED_COLOR} />
<FieldLine
    start={[TILE_CNT + RT1_2, 2.5 - RT1_2]}
    end={[TILE_CNT - 0.5 - RT1_2, 3 + RT1_2]}
    color={BLUE_COLOR}
/>
<FieldLine
    start={[TILE_CNT + RT1_2, 3.5 + RT1_2]}
    end={[TILE_CNT - 0.5 - RT1_2, 3 - RT1_2]}
    color={BLUE_COLOR}
/>
