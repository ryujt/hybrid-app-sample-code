import globals from "@/globals";
import axios from "axios";
import store from "@/store";

/**
 * 오류 정보를 로그 서버로 전송
 */
export default {
    sendMessage(code, msg) {
        let memberId = 0;
        try {
            memberId = store.state.main.memberInfo.id;
        } catch (e) {
            console.log(e);
        }

        const request = {
            memberId: memberId,
            module: globals.getCurrentPath(),
            errorCode: code,
            errorMsg: msg
        };

        try {
            axios.post(process.env.VUE_APP_API_BASEURL + 'error/loging', request);
        } catch (e) {
            console.log(e);
        }
    }
}