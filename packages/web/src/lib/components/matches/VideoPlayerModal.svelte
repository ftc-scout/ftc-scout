<script lang="ts">
    import Modal from "$lib/components/Modal.svelte";
    import { createEventDispatcher } from "svelte";

    export let shown = false;
    export let youtubeUrl = "";
    export let startTime = 0;
    export let endTime = 0;

    const dispatch = createEventDispatcher();

    function close() {
        shown = false;
        dispatch("close");
    }

    // Extract YouTube video ID from URL
    function getYoutubeEmbedUrl(url: string, start: number, end: number): string {
        let videoId = "";

        // Handle different YouTube URL formats
        if (url.includes("youtu.be/")) {
            videoId = url.split("youtu.be/")[1].split("?")[0];
        } else if (url.includes("youtube.com/watch?v=")) {
            videoId = url.split("v=")[1].split("&")[0];
        } else if (url.includes("youtube.com/embed/")) {
            videoId = url.split("embed/")[1].split("?")[0];
        }

        return `https://www.youtube.com/embed/${videoId}?start=${start}&end=${end}&autoplay=1`;
    }

    $: embedUrl = youtubeUrl ? getYoutubeEmbedUrl(youtubeUrl, startTime, endTime) : "";
</script>

<Modal bind:shown titleText="Match Video" closeText="Close" {close}>
    {#if embedUrl}
        <div class="video-container">
            <iframe
                src={embedUrl}
                title="YouTube video player"
                style="border: 0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
            />
        </div>
    {:else}
        <p>Invalid video URL</p>
    {/if}
</Modal>

<style>
    .video-container {
        position: relative;
        width: 800px;
        max-width: 90vw;
        padding-bottom: 56.25%; /* 16:9 aspect ratio */
        height: 0;
    }

    iframe {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
</style>
