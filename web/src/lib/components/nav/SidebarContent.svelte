<script lang="ts">
    import { CURRENT_SEASON } from "$lib/constants";

    import {
        ABOUT_ICON,
        API_ICON,
        CLOSE_ICON,
        EVENTS_ICON,
        HOME_ICON,
        REGIONS_ICON,
        SEASON_RECORDS_ICON,
        TEAMS_ICON,
    } from "$lib/icons";
    import Fa from "svelte-fa";
    import { sidebarOpen } from "./sidebar";
    import SidebarItem from "./SidebarItem.svelte";
</script>

<b>
    <span>Navigate:</span>
    <button on:click={() => ($sidebarOpen = false)}>
        <Fa icon={CLOSE_ICON} size="1.5x" />
    </button>
</b>

<SidebarItem icon={HOME_ICON} href="/">Home</SidebarItem>
<SidebarItem icon={EVENTS_ICON} href="/events">Events</SidebarItem>
<SidebarItem icon={TEAMS_ICON} href="/teams">Teams</SidebarItem>
<SidebarItem icon={REGIONS_ICON} href="/regions">Regions and Leagues</SidebarItem>
<SidebarItem icon={SEASON_RECORDS_ICON} href="/records/{CURRENT_SEASON}/teams">Season Records</SidebarItem>

<hr />

<SidebarItem icon={ABOUT_ICON} href="/about">About</SidebarItem>
<SidebarItem icon={API_ICON} href="/api">API</SidebarItem>

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
