let count = 0;
let onRepeat = null;
let onCompleted = null;
let interval = null;

export default {
    start(duration, r, c) {
        this.stop();

        count = duration;
        onRepeat = r;
        onCompleted = c;

        onRepeat(count, this.getText());

        interval = setInterval(() => {
            onRepeat(count, this.getText());

            count--;
            if (count < 0) {
                clearInterval(interval);
                onCompleted();
            }
        }, 1000);
    },

    stop() {
        if (interval !== null) clearInterval(interval);
        interval = null;
    },

    getText() {
        let minutes = parseInt(count / 60, 10);
        let seconds = parseInt(count % 60, 10);
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        return minutes + ":" + seconds;
    }
}