<h2>
    <slot name="title" />
</h2>

<div class="info">By <slot name="author" /> on <slot name="date" /></div>

<slot />

<style>
    h2 {
        font-size: 32px;
        font-weight: bold;
        margin-top: 0;
        margin-bottom: var(--gap);
    }

    .info {
        color: var(--secondary-text-color);
    }
</style>
