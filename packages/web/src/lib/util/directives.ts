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

function isTouchDevice() {
    return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}

export function stickTableHead(node: HTMLElement) {
    // We disable the sticky header on touchscreens because momentum scrolling causes jank.
    if (!isTouchDevice()) {
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

    return {};
}
