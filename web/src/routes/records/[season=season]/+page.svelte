<script context="module">
    import { CURRENT_SEASON } from "$lib/constants";

    export async function load({ params }) {
        return {
            status: 302,
            redirect: `/records/${params.season}/teams`,
        };
    }
</script>
