export function dragScroll(element: Element) {
    const slider = element.parentElement?.parentElement?.parentElement!;
    let mouseDown = false;
    let startX = 0;
    let scrollLeft = 0;

    function startDragging(e: MouseEvent) {
        mouseDown = true;
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    }
    function stopDragging(_: MouseEvent) {
        mouseDown = false;
    }
    function mouseMove(e: MouseEvent) {
        e.preventDefault();
        if (!mouseDown) {
            return;
        }
        const x = e.pageX - slider.offsetLeft;
        const scroll = x - startX;
        slider.scrollLeft = scrollLeft - scroll;
    }

    slider.addEventListener("mousedown", startDragging, false);
    slider.addEventListener("mousemove", mouseMove);
    slider.addEventListener("mouseup", stopDragging, false);
    slider.addEventListener("mouseleave", stopDragging, false);

    return {
        destroy() {
            slider.removeEventListener("mousedown", startDragging, false);
            slider.removeEventListener("mousemove", mouseMove);
            slider.removeEventListener("mouseup", stopDragging, false);
            slider.removeEventListener("mouseleave", stopDragging, false);
        },
    };
}
