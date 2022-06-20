import axios from "axios";
import store from "@/store";
import errorLog from "./errorLog";

const instance = axios.create({
    baseURL: process.env.VUE_APP_API_BASEURL,
});

instance.interceptors.request.use(function (config) {
    if (config["method"] === "get" || config["method"] === "delete") {
        store.dispatch("main/setLoadingIcon", true);
    }

    if (store.state.main.token !== null) {
        config["headers"] = {
            Authorization: `Bearer ${store.state.main.token}`,
        };
    }
    return config;
});

instance.interceptors.response.use(
    function (response) {
        store.dispatch("main/setLoadingIcon", false);
        return Promise.resolve(response);
    },

    function (error) {
        store.dispatch("main/setLoadingIcon", false);
        errorLog.sendMessage(0, JSON.stringify(error));
        return Promise.reject(error);
    }
);

export default instance;
