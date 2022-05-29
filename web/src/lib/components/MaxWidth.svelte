<script lang="ts">
    export let width: string;
</script>

<div style:max-width={width}>
    <slot />
</div>

<style>
    div {
        margin: auto;
    }
</style>
