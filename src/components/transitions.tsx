

export function fadeIn(id: string, time: number) {
    const item = document.getElementById(id);
    if (item) {
        setTimeout(() => {
            item.style.opacity = "1";
        }, time);
    }
}

export function swipe(id1: string, id2: string, right: boolean) {
    const img1 = document.getElementById(id1);
    const img2 = document.getElementById(id2);
    if (img1 && img2) {
        setTimeout(() => {

            
        }, 100);
    }
}