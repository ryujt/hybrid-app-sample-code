let owner = "";
let lastScrollHeight = -1;
let onNextPage = null;
let onScroll = null;
let savedTops = [];

let handlerPull = null;
let isClick = false;
let touchstartX = 0;
let touchendX = 0;

let scrollEnabled = true;

window.addEventListener("scroll", () => {
    const scrollTop = document.documentElement.scrollTop;
    const clientHeight = document.documentElement.clientHeight;
    const scrollHeight = document.documentElement.scrollHeight;
    if (onScroll) onScroll(scrollTop);
    savedTops[owner] = scrollTop;
    if (scrollTop + clientHeight + 200 >= scrollHeight) {
        if (lastScrollHeight === scrollHeight) return;
        if (scrollTop <= 0) return;
        lastScrollHeight = scrollHeight;
        if (onNextPage) onNextPage();
    }
});

window.addEventListener("touchstart", (e) => {
    touchstartX = e.changedTouches[0].screenX;
    isClick = true;
});

window.addEventListener("touchmove", () => {
    isClick = false;
});

window.addEventListener(
    "touchend",
    (e) => {
        if (isClick) return;
        touchendX = e.changedTouches[0].screenX;
        const scrollTop = document.documentElement.scrollTop;
        if (scrollTop <= 0) {
            if (Math.abs(Math.abs(touchstartX) - Math.abs(touchendX)) > 50) return;
            lastScrollHeight = -1;
            if (handlerPull !== null) handlerPull();
        }
    },
    false
);

window.addEventListener("wheel",
    (e) => {
        if (scrollEnabled) return true;

        e.preventDefault();
        e.stopPropagation();
        return false;
    },
    { passive: false }
);

window.addEventListener("touchmove",
    (e) => {
        if (scrollEnabled) return true;

        e.preventDefault();
        e.stopPropagation();
        return false;
    },
    { passive: false }
);

export default {
    clear(o) {
        savedTops[o] = 0;
    },

    /**
     * 스크롤 핸들링 준비를 합니다.
     * @param eventOwner 스크롤의 대상을 구분하기 위한 문자열. Vue 객체마다 다른 이름을 주면 됩니다.
     * @param eventNextPage 스크롤이 바닥을 쳐서 다음 페이지가 필요한 경우의 이벤트 핸들러
     * @param eventScroll 스크롤 이벤트 핸들러
     */
    start(eventOwner, eventNextPage, eventScroll) {
        owner = eventOwner;
        onNextPage = eventNextPage;
        onScroll = eventScroll;
        lastScrollHeight = -1;
    },

    stop() {
        owner = "";
        onNextPage = null;
        onScroll = null;
    },

    restore(owner) {
        const saved = savedTops[owner];
        window.scrollTo(0, saved);
        setTimeout(function () {
            window.scrollTo(0, saved);
        }, 200);
    },

    pullToRefresh(f) {
        handlerPull = f;
        isClick = false;
        touchstartX = 0;
        touchendX = 0;
    },

    destroyPullToRefresh() {
        handlerPull = null;
    },

    setScrollEnabled(value) {
        scrollEnabled = value;
    },
};
