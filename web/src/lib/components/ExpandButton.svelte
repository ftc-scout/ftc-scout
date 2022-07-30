<script>
    import { faCaretRight } from "@fortawesome/free-solid-svg-icons";

    import Fa from "svelte-fa";

    export let style = "";

    export let open = false;
    $: rotation = open ? 90 : 0;
</script>

<button {style} on:click>
    <Fa
        icon={faCaretRight}
        style={`transform: rotate(${rotation}deg); transition-duration: 0.25s; transition-property: transform;`}
    />
</button>

<style>
    button {
        background: none;
        color: inherit;
        padding: 0;
        margin: 0;
        border: none;
        cursor: pointer;
        font-size: inherit;
    }
</style>
