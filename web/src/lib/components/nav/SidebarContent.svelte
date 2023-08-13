<script lang="ts">
    import { CURRENT_SEASON, EMAIL } from "$lib/constants";

    import {
        ABOUT_ICON,
        PRIVACY_ICON,
        API_ICON,
        CLOSE_ICON,
        EVENTS_ICON,
        HOME_ICON,
        SEASON_RECORDS_ICON,
        TEAMS_ICON,
        BLOG_ICON,
    } from "$lib/icons";
    import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
    import { faGithub } from "@fortawesome/free-brands-svg-icons";
    import { faDiscord } from "@fortawesome/free-brands-svg-icons";
    import Fa from "svelte-fa";
    import { sidebarOpen } from "./sidebar";
    import SidebarItem from "./SidebarItem.svelte";
</script>

<b>
    <span>Navigate:</span>
    <button on:click={() => ($sidebarOpen = false)}>
        <Fa icon={CLOSE_ICON} size="1.75x" style="margin-right: var(--gap)" />
    </button>
</b>

<SidebarItem icon={HOME_ICON} href="/">Home</SidebarItem>
<SidebarItem icon={EVENTS_ICON} href="/events/{CURRENT_SEASON}">Events</SidebarItem>
<SidebarItem icon={TEAMS_ICON} href="/teams">Teams</SidebarItem>
<SidebarItem icon={SEASON_RECORDS_ICON} href="/records/{CURRENT_SEASON}/teams">Season Records</SidebarItem>

<hr />
<SidebarItem icon={BLOG_ICON} href="/blog">The Scouting Report</SidebarItem>

<hr />

<SidebarItem icon={ABOUT_ICON} href="/about">About</SidebarItem>
<SidebarItem icon={PRIVACY_ICON} href="/privacy">Privacy Policy</SidebarItem>
<SidebarItem icon={API_ICON} href="/api">API</SidebarItem>

<hr />

<SidebarItem icon={faDiscord} href="https://discord.gg/XTZhD9RnKa" newTab>Discord</SidebarItem>
<SidebarItem icon={faGithub} href="https://github.com/16321-X-Drive" newTab>Github</SidebarItem>
<SidebarItem icon={faEnvelope} href="mailto:{EMAIL}">Email</SidebarItem>

<style>
    b {
        font-weight: 600;
        align-items: center;
        justify-content: space-between;
        font-size: var(--h2-font-size);
        margin-bottom: var(--large-gap);
        display: none;
    }

    @media (max-width: 1600px) {
        b {
            display: flex;
        }
    }

    button {
        background: none;
        border: none;

        cursor: pointer;
    }

    hr {
        border-color: var(--neutral-separator-color);
        color: var(--neutral-separator-color);
        background-color: var(--neutral-separator-color);
    }
</style>
