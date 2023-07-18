<script lang="ts">
    import {
        faBinoculars,
        faCalendarAlt,
        faClose,
        faCode,
        faGavel,
        faHashtag,
        faHome,
        faInfoCircle,
        faTrophy,
    } from "@fortawesome/free-solid-svg-icons";
    import SidebarItem from "./SidebarItem.svelte";
    import { sidebarOpen } from "./Sidebar.svelte";
    import Fa from "svelte-fa";
</script>

<b>
    <span>Navigate</span>
    <button on:click={() => ($sidebarOpen = false)}>
        <Fa icon={faClose} size="1.75x" style="margin-right: var(--md-gap)" />
    </button>
</b>

<SidebarItem icon={faHome} name="Home" link="/" strict />
<SidebarItem icon={faCalendarAlt} name="Events" link="/events" />
<SidebarItem icon={faHashtag} name="Teams" link="/teams" />
<SidebarItem icon={faTrophy} name="Season Records" link="/records" />

<hr />

<SidebarItem icon={faBinoculars} name="The Scouting Report" link="/blog" />

<hr />

<SidebarItem icon={faInfoCircle} name="About" link="/about" />
<SidebarItem icon={faGavel} name="Teams" link="/privacy" />
<SidebarItem icon={faCode} name="API" link="/api" />

<style>
    hr {
        margin-bottom: var(--lg-gap);
    }

    b {
        display: none;
        align-items: center;
        justify-content: space-between;
        margin-bottom: var(--lg-gap);

        font-size: var(--vl-font-size);
        font-weight: 600;
    }

    @media (max-width: 1600px) {
        b {
            display: flex;
        }
    }

    button {
        background: none;
        border: none;
    }
</style>
