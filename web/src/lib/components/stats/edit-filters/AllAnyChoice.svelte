<script lang="ts">
    export let value: "ALL" | "ANY";
</script>

<select bind:value>
    <option>ALL</option>
    <option>ANY</option>
</select>

<style>
    * {
        font: inherit;
    }
</style>
