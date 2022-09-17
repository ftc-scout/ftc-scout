<script lang="ts">
    import { page } from "$app/stores";

    export let title: string;
    export let description: string =
        "FTCScout is a new way to track and scout FIRST Tech Challenge, providing advanced statistics and data on all aspects of FTC.";
    export let image = "/banner.png";
    export let url: string | null = null;

    $: url_ = url ?? $page.url.toString();
</script>

<svelte:head>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap" rel="stylesheet" />

    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
    <link rel="manifest" href="/site.webmanifest" />
    <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#2c666e" />
    <meta name="msapplication-TileColor" content="#2c666e" />
    <meta name="theme-color" content="#ffffff" />
    <meta property="og:site_name" content="FTCScout" />

    <title>{title}</title>
    <meta name="description" content={description} />
    <meta property="og:title" content={title} />
    <meta property="og:image" content={image} />
    <meta property="og:description" content={description} />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="theme-color" content="#2c666e" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="620" />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content={url_} />

    <slot />
</svelte:head>
