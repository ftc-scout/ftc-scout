<script lang="ts">
    import { page } from "$app/stores";

    $: {
        if (typeof gtag !== "undefined") {
            gtag("config", "G-5RC8F6X8NC", {
                page_title: document.title,
                page_path: $page.url.pathname,
            });
        }
    }
</script>

<svelte:head>
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-5RC8F6X8NC">
    </script>
    <script>
        window.dataLayer = window.dataLayer || [];

        function gtag() {
            dataLayer.push(arguments);
        }

        gtag("js", new Date());
        gtag("config", "G-5RC8F6X8NC");
    </script>
</svelte:head>
