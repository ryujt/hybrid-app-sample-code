import moment from "moment";

export default {
    today() {
        return moment().format('YYYY.MM.DD');
    },

    isToday(target) {
        const today = moment().valueOf();
        const date = moment(target).valueOf();
        const miliseconds = today - date;
        const days = Math.floor(miliseconds / (1000 * 60 * 60 * 24));
        return days < 1;
    },

    isThisWeek(target) {
        if (this.isToday(target)) return false;

        const today = moment().valueOf();
        const date = moment(target).valueOf();
        const miliseconds = today - date;
        const weeks = Math.floor(miliseconds / (1000 * 60 * 60 * 24 * 7));
        return weeks < 1;
    },

    isThisMonth(target) {
        if (this.isThisWeek(target)) return false;

        const today = moment().valueOf();
        const date = moment(target).valueOf();
        const miliseconds = today - date;
        const weeks = Math.floor(miliseconds / (1000 * 60 * 60 * 24 * 7));
        return weeks <= 4;
    },

    isMonthBefore(target) {
        const today = moment().valueOf();
        const date = moment(target).valueOf();
        const miliseconds = today - date;
        const weeks = Math.floor(miliseconds / (1000 * 60 * 60 * 24 * 7));
        return weeks > 4;
    },

    getTitle(target) {
        if (this.isToday(target)) return "오늘";
        if (this.isThisWeek(target)) return "이번 주";
        if (this.isThisMonth(target)) return "이번 달";

        return "이전 활동"
    }
}