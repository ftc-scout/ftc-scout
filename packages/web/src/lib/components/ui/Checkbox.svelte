<script lang="ts">
    export let checked = false;
    export let disabled = false;
</script>

<input type="checkbox" bind:checked on:click {disabled} />

<style>
    input {
        width: 1.2em;
        height: 1.2em;
    }
</style>
