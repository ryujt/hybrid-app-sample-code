<template>
    <div>Sample Page</div>
</template>

<script>
import globals from "@/globals";
import bridgeIn from "@/bridge-in";
import bridgeOut from "@/bridge-out";

export default {
    watch: {
        $route(to) {
            globals.setCurrentPath(to.path);
        },
    },

    mounted() {
        globals.init();
        bridgeIn.init();
        bridgeOut.webViewReady();
    },
};
</script>
