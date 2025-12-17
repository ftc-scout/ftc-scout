<script lang="ts">
    import Modal from "$lib/components/Modal.svelte";
    import { createEventDispatcher } from "svelte";

    export let shown = false;
    export let eventSeason: number;
    export let eventCode: string;
    export let matchId: number;
    export let matchDescription: string;

    const dispatch = createEventDispatcher();

    let youtubeUrl = "";
    let startTime = "";
    let endTime = "";
    let error = "";
    let loading = false;

    function close() {
        shown = false;
        youtubeUrl = "";
        startTime = "";
        endTime = "";
        error = "";
        dispatch("close");
    }

    function parseTimeToSeconds(time: string): number {
        // Support formats: "1:30", "90", "1:30:45"
        const parts = time.split(":");
        if (parts.length === 1) {
            return parseInt(parts[0]);
        } else if (parts.length === 2) {
            return parseInt(parts[0]) * 60 + parseInt(parts[1]);
        } else if (parts.length === 3) {
            return parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
        }
        return 0;
    }

    async function handleSubmit() {
        error = "";
        loading = true;

        const startSeconds = parseTimeToSeconds(startTime);
        const endSeconds = parseTimeToSeconds(endTime);

        if (endSeconds <= startSeconds) {
            error = "End time must be after start time";
            loading = false;
            return;
        }

        try {
            const response = await fetch(`http://${import.meta.env.PUBLIC_SERVER_ORIGIN}/graphql`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Ftcscout-Code": import.meta.env.PUBLIC_FRONTEND_CODE,
                },
                credentials: "include",
                body: JSON.stringify({
                    query: `
                        mutation CreateMatchVideo(
                            $eventSeason: Int!
                            $eventCode: String!
                            $matchId: Int!
                            $youtubeUrl: String!
                            $startTime: Int!
                            $endTime: Int!
                        ) {
                            createMatchVideo(
                                eventSeason: $eventSeason
                                eventCode: $eventCode
                                matchId: $matchId
                                youtubeUrl: $youtubeUrl
                                startTime: $startTime
                                endTime: $endTime
                            ) {
                                id
                            }
                        }
                    `,
                    variables: {
                        eventSeason,
                        eventCode,
                        matchId,
                        youtubeUrl,
                        startTime: startSeconds,
                        endTime: endSeconds,
                    },
                }),
            });

            const result = await response.json();

            if (result.errors) {
                error = result.errors[0]?.message || "Failed to add video";
            } else if (result.data?.createMatchVideo) {
                dispatch("videoAdded");
                close();
            }
        } catch (e) {
            error = "Failed to connect to server";
        } finally {
            loading = false;
        }
    }
</script>

<Modal bind:shown titleText="Add Match Video" closeText="Cancel" {close}>
    <div class="add-video-form">
        <p class="match-info">Adding video for match: <strong>{matchDescription}</strong></p>

        <form on:submit|preventDefault={handleSubmit}>
            <div class="form-group">
                <label for="youtubeUrl">YouTube URL</label>
                <input
                    type="url"
                    id="youtubeUrl"
                    bind:value={youtubeUrl}
                    placeholder="https://www.youtube.com/watch?v=..."
                    required
                    disabled={loading}
                />
            </div>

            <div class="form-group">
                <label for="startTime">Start Time (MM:SS or seconds)</label>
                <input
                    type="text"
                    id="startTime"
                    bind:value={startTime}
                    placeholder="1:30 or 90"
                    required
                    disabled={loading}
                />
            </div>

            <div class="form-group">
                <label for="endTime">End Time (MM:SS or seconds)</label>
                <input
                    type="text"
                    id="endTime"
                    bind:value={endTime}
                    placeholder="3:00 or 180"
                    required
                    disabled={loading}
                />
            </div>

            {#if error}
                <div class="error">{error}</div>
            {/if}

            <button type="submit" class="submit-btn" disabled={loading}>
                {loading ? "Adding..." : "Add Video"}
            </button>
        </form>
    </div>
</Modal>

<style>
    .add-video-form {
        width: 500px;
        max-width: 90vw;
    }

    .match-info {
        margin-bottom: var(--lg-gap);
        color: var(--text-color);
    }

    .form-group {
        margin-bottom: var(--md-gap);
    }

    label {
        display: block;
        margin-bottom: var(--sm-gap);
        font-weight: 600;
        color: var(--text-color);
    }

    input {
        width: 100%;
        padding: var(--sm-pad);
        border: 1px solid var(--sep-color);
        border-radius: 4px;
        background: var(--bg-color);
        color: var(--text-color);
        font-size: 14px;
    }

    input:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .submit-btn {
        width: 100%;
        padding: var(--sm-pad);
        background: var(--red-team-color);
        color: white;
        border: none;
        border-radius: 4px;
        font-weight: 600;
        cursor: pointer;
    }

    .submit-btn:hover:not(:disabled) {
        opacity: 0.9;
    }

    .submit-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .error {
        padding: var(--sm-pad);
        background: rgba(255, 0, 0, 0.1);
        border: 1px solid rgba(255, 0, 0, 0.3);
        border-radius: 4px;
        color: var(--red-team-color);
        margin-bottom: var(--md-gap);
    }
</style>
