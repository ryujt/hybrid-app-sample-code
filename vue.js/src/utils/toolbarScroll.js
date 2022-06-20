/**
 * http://buzztech.s3-website.ap-northeast-2.amazonaws.com/berryful/0.7/state-diagram/toolbarScroll/
 */

export default {
    start() {
        this.exTop = 0;
        this.state = "upShallow";
    },

    scroll(top) {
        if (top > this.exTop) {
            this.do_scrollUp(top);
        } else if (top < this.exTop) {
            this.do_scrollDown(top);
        }
        this.exTop = top;
    },

    do_scrollUp(top) {
        switch (this.state) {
            case "upShallow":
                if (top > this.toolbarHeight) this.state = "upDeep";
                break;
            case "downShallow": this.state = "upShallow"; break;
            case "downDeep": this.state = "upDeep"; break;
        }
    },

    do_scrollDown(top) {
        switch (this.state) {
            case "upShallow": this.state = "downShallow"; break;
            case "downDeep":
                if (top <= this.toolbarHeight) this.state = "downShallow";
                break;
            case "upDeep": this.state = "downDeep"; break;
        }
    },

    toolbarHeight: 49,
    state: "upShallow",
    exTop: 0,
}