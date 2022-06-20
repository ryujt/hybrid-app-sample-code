/**
 * App to Web 브릿지 메시지
 */

import router from "@/router";

export default {
    init() {
        window.refresh = this.refresh;
        window.loadUrl = this.loadUrl;
    },

    refresh() {
        router.go();
    },

    loadUrl(url) {
        router.push({ path: window.atob(url) });
    },
}
