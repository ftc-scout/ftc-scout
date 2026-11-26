const callbacks = new WeakMap<Element, () => void>();
let observer: IntersectionObserver | undefined;

export function onVisible(node: Element, callback: () => void) {
    observer ??= new IntersectionObserver((entries) => {
        for (let entry of entries) {
            if (!entry.isIntersecting) continue;
            observer!.unobserve(entry.target);
            callbacks.get(entry.target)?.();
        }
    });

    function watch(callback: () => void) {
        callbacks.set(node, callback);
        observer!.unobserve(node);
        observer!.observe(node);
    }

    watch(callback);

    return {
        update: watch,
        destroy: () => observer!.unobserve(node),
    };
}
