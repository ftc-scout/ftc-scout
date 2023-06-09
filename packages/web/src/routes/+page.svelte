<script lang="ts">
    import { add } from "@ftc-scout/common";

    let a: number = 1;
    let b: number = 2;
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<input type="number" bind:value={a} />
<input type="number" bind:value={b} />
<p>{a} + {b} = {add(a, b)}</p>
