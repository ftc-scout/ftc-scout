import type { Writable } from "svelte/store";

export function clickOutside(node: any) {
    const handleClick = (event: any) => {
        if (node && !node.contains(event.target) && !event.defaultPrevented) {
            node.dispatchEvent(new CustomEvent("click_outside", node));
        }
    };

    document.addEventListener("click", handleClick, true);

    return {
        destroy() {
            document.removeEventListener("click", handleClick, true);
        },
    };
}

export function quickFocus(node: any) {
    node.focus();
}

export function stickTableHead(node: HTMLElement) {
    let table = node.parentElement!;
    let card = table.parentElement?.parentElement!;
    let content = document.getElementById("content")!;
    content?.addEventListener("scroll", listener);

    function listener() {
        let requiredOff = content.scrollTop - table.offsetTop - card.offsetTop - 1; // + table.offsetTop - card.offsetTop  - 1;

        let firstRow = table.lastChild?.firstChild as HTMLElement | null;
        let minTableHeight = firstRow?.clientHeight ?? 48;
        requiredOff = Math.min(
            requiredOff,
            table.clientHeight - node.clientHeight - minTableHeight
        );

        if (requiredOff > 0) {
            node.style.setProperty("transform", `translateY(${requiredOff}px)`);
            node.classList.add("sticking");
        } else {
            node.style.removeProperty("transform");
            node.classList.remove("sticking");
        }
    }

    return {
        destroy() {
            content?.removeEventListener("scroll", listener);
            node.style.removeProperty("transform");
            node.classList.remove("sticking");
        },
    };
}

export function watchForFocus(node: HTMLElement, args: { store: Writable<number>; myNum: number }) {
    let { store, myNum } = args;

    let firstFire = true;
    let destroySub = store.subscribe((n) => {
        if (myNum == n && !firstFire) {
            node.focus();
        }
        // Don't trigger focus on our first read because it is just the start of the subscription
        firstFire = false;
    });

    function focusIn() {
        store.set(myNum);
    }

    node.addEventListener("focusin", focusIn);

    return {
        destroy() {
            destroySub();
            node.removeEventListener("focusin", focusIn);
        },
    };
}

export function focusWithinOut(node: HTMLElement, callback: () => void) {
    function focusOut(e: FocusEvent) {
        let currTarget = e.currentTarget as HTMLElement | null;
        let relTarget = e.relatedTarget as Node | null;
        if (!currTarget?.contains(relTarget)) {
            callback();
        }
    }

    node.addEventListener("focusout", focusOut);

    return {
        destroy() {
            node.removeEventListener("focusout", focusOut);
        },
    };
}
