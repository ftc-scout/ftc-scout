<script lang="ts">
    export let name: string;
    export let role: string;
    export let imgSrc: string;
    export let alt: string;
    export let href: string;
</script>

<a class="wrap" {href} target="_blank" rel="noreferrer">
    <img src={imgSrc} {alt} />
    <div class="info">
        <span>{name}</span>
        <span class="role">{role}</span>
    </div>
</a>

<style>
    .wrap {
        /* width: 100%; */
        flex-grow: 1;
        min-width: 250px;
        max-width: 300px;
        display: flex;
        align-items: center;
        gap: var(--large-gap);

        box-shadow: -1px 1px 5px 2px #e0e0e0;
        border-radius: 8px;

        padding: var(--padding);

        cursor: pointer;
        color: inherit;

        transition: all 200ms ease;
    }

    .wrap:hover {
        text-decoration: none;
        box-shadow: -2px 2px 7px 3px #e0e0e0;
    }

    .info {
        display: flex;
        flex-direction: column;
    }

    .role {
        color: var(--secondary-text-color);
        font-style: italic;
    }

    img {
        width: 64px;
        height: 64px;
        border-radius: var(--pill-border-radius);
    }

    @media (max-width: 800px) {
        img {
            width: 48px;
            height: 48px;
        }
    }
</style>
