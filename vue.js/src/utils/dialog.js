import { ElMessage, ElMessageBox } from "element-plus";

export default {
    confirm(message, resolve, reject) {
        ElMessageBox.confirm(message, {
            confirmButtonText: "확인",
            cancelButtonText: "취소",
        }).then(() => {
            resolve();
        }).catch(() => {
            if (reject) reject();
        });
    },

    confirmWithTitle(title, message, resolve, reject) {
        ElMessageBox.confirm(message, title, {
            showClose: false,
            confirmButtonText: "확인",
            cancelButtonText: "취소",
        }).then(() => {
            resolve();
        }).catch(() => {
            if (reject) reject();
        });
    },

    inform(message, resolve) {
        ElMessageBox.alert(message, {
            showClose: false,
            showCancelButton: false,
            confirmButtonText: "확인",
        }).then(() => {
            resolve();
        });
    },

    error(message) {
        ElMessage.error({
            message: message,
            showClose: true,
        });
    },
};