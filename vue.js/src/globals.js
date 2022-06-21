/**
 * 웹 전체에서 접근이 필요한 데이터를 관리한다.
 * 앱과 싱크되어야 하는 정보는 무조건 globals을 통해서 처리하도록 합니다.
 * 상태관리가 필요한 정보는 store에 저장한다.
 */

import store from "@/store";
import bridgeOut from "@/bridge-out";

let syncData = {
    memberInfo: {},
};

let currentPath = "/";

export default {
    init() {
        window.syncGlobals = this.syncGlobals;
    },

    syncGlobals(params) {
        syncData = JSON.parse(window.atob(params));
        console.log(JSON.stringify(syncData));
        store.dispatch("main/setMemberInfo", syncData.memberInfo);
    },

    getData() {
        return syncData;
    },

    update() {
        bridgeOut.syncGlobals(syncData);
    },

    setMemberInfo(value) {
        syncData.memberInfo = value;
        store.dispatch("main/setMemberInfo", syncData.memberInfo);
        update();
    },

    getCurrentPath() { return currentPath; },
    setCurrentPath(value) { currentPath = value },
}