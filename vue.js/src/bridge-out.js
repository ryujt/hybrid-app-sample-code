/**
 * Web to App 브릿지 메시지
 */

/* eslint-disable */

export default {
    /**
     * Web to App Globals sync
     * @param params 싱크할 데이터
     */
    syncGlobals(params) {
        const msg = {
            code: "syncGlobals",
            params: params
        };
        this.post(msg);
    },

    /**
     * 앱 종료를 요청한다.
     */
    closeApp() {
        const msg = {
            code: "closeApp",
        };
        this.post(msg);
    },

    /**
     *  로그아웃 메시지를 앱에게 전달한다.
     */
    logout() {
        const msg = {
            code: "logout",
        };
        this.post(msg);
    },

    /**
     * 웹앱 초기화면 로딩이 완료된 것을 네이티브에게 알려준다.
     * 네이티브는 이 신호를 받으면 인트로 화면에서 웹뷰 화면으로 전환한다.
     */
    webViewReady() {
        const msg = {
            code: "webViewReady",
        };
        this.post(msg);
    },

    /**
     * 주어진 url로 메인 웹뷰를 이동한다.
     * 상단에 되돌아가기 버튼을 클릭하면 return url로 복귀한다.
     * @param url 이동할 url
     */
    loadUrl(url) {
        const msg = {
            code: "loadUrl",
            url: url,
        };
        this.post(msg);
    },

    /**
     * 앱스토어 가기
     */
    goAppStore() {
        const msg = {
            code: "goAppStore",
        };
        this.post(msg);
    },

    post(msg) {
        try {
            App.postMessage(JSON.stringify(msg));
        } catch (e) {
            console.log(msg);
            console.log(e);
        }
    },
};
