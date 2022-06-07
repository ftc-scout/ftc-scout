<div class="card">
    <slot />
</div>

<style>
    div {
        background-color: var(--foreground-color);
        box-shadow: -2px 2px 10px 3px #e0e0e0;
        border-radius: 8px;

        padding: var(--large-padding);
        margin: var(--large-gap);
        margin-bottom: var(--xl-gap);
    }
</style>
