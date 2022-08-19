<script context="module">
    import { CURRENT_SEASON } from "$lib/constants";

    export async function load() {
        return {
            status: 302,
            redirect: `/records/${CURRENT_SEASON}`,
        };
    }
</script>
