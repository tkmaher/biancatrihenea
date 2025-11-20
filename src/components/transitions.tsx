
export function fadeOut (id: string) {
    const item = document.getElementById(id);
    if (item) {
        item.style.opacity = "0";
        item.style.transform = "translate(0%, 50em)";
    }
}

export function fadeIn(id: string, time: number) {
    const item = document.getElementById(id);
    if (item) {
        setTimeout(() => {
        item.style.opacity = "1";
        item.style.transform = "translate(0%, 0%)";
        }, time);
    }
}