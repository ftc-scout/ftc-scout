<script lang="ts">
    import Dropdown from "../../Dropdown.svelte";

    export let type: "and" | "or";
</script>

<Dropdown bind:value={type} items={["and", "or"]} />
