<script lang="ts">
    import { CURRENT_SEASON } from "@ftc-scout/common";
    import { requestTeamLogo, teamLogos, teamLogoUrl } from "$lib/util/avatars";
    import { onVisible } from "$lib/util/visible";

    export let number: number;
    export let season: number = CURRENT_SEASON;
    export let size = "1.5em";

    let seen = "";

    function loader(season: number, number: number) {
        return () => {
            seen = `${season}/${number}`;
            requestTeamLogo(season, number);
        };
    }

    $: logos = teamLogos(season);
    $: id = $logos[number]?.id;
    $: src = id && seen == `${season}/${number}` ? teamLogoUrl(season, number, id) : null;
</script>

<span class="avatar-box" style:--size={size} use:onVisible={loader(season, number)}>
    {#if src}
        <img {src} alt="" decoding="async" />
    {:else}
        <slot />
    {/if}
</span>

<style>
    .avatar-box {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: var(--size);
        height: var(--size);
        flex-shrink: 0;
        vertical-align: middle;
    }

    img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        border-radius: 4px;
    }
</style>
