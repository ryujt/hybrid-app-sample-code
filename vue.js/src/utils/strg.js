export default {
    getNumberStr(value) {
        if (!value) return "0";
        let unit = "";
        if (value >= 1000000) {
            value = Math.round(value / 1000000);
            unit = "M";
        } else if (value >= 1000) {
            value = Math.round(value / 1000);
            unit = "K";
        }
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + unit;
    },

    getPriceStr(value) {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },

    getHashTag(text) {
        if (!text) return "";

        let tags = [];
        let words = text.split(/[ ,\n]+/);
        words.forEach((word) => {
            if (word.startsWith("#")) {
                let temp = word.split("#");
                temp.forEach((item) => {
                    if (item.trim()) tags.push(item.trim());
                });
            }
        });
        const result = tags.filter((element, index) => {
            return tags.indexOf(element) === index;
        });
        return result.join(" ");
    },

    putTextAtCurrentPos(id, text, hiddenInput) {
        try {
            var element = document.getElementById(id);
            if (!element) return;

            var hidden = document.getElementById(hiddenInput);
            if (!hidden) return;

            hidden.focus();

            var strOriginal = element.value;
            var iStartPos = element.selectionStart;
            var iEndPos = element.selectionEnd;
            if (iStartPos !== iEndPos) return;

            var strFront = "";
            var strEnd = "";
            strFront = strOriginal.substring(0, iStartPos);
            strEnd = strOriginal.substring(iEndPos, strOriginal.length);
            element.value = strFront + text + strEnd;
            element.focus();
            element.selectionStart = iEndPos + 2;
            element.selectionEnd = iEndPos + 2;
        } catch (e) {
            console.log(e);
        }
    },

    trim(text) {
        try {
            return text.trim();
        } catch (e) {
            console.log(e);
            return "";
        }
    },

    toHtml(str) {
        try {
            let parser = new DOMParser();
            let string = str.replaceAll("<br>", "\n");
            return parser.parseFromString(string, "text/html").body.textContent;
        } catch (e) {
            console.log(e);
        }
        return "";
    },

    lineBreak(text) {
        return text.split('\n').join('<br />');
    },

    phoneNumber(text) {
        if (text) return text.replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`);
        return "";
    },

    /**
     * ???????????? ???????????? ????????????.
     * @param text ?????? ?????????
     */
    lineCount(text) {
        const lines = text.split("\n");
        return lines.length;
    },

    /**
     * ????????? ??????????????? ????????? ????????????.
     * @param text ?????? ?????????
     * @param size ????????? ?????? ?????? ???
     * @param lineBreak ????????????(\n)??? br ????????? ?????? ????????? ??????
     */
    shortenLines(text, size, lineBreak) {
        let lines = text.split("\n");
        lines = lines.slice(0, size);
        let result = lines.join("\n") + " ...";
        if (lineBreak) result = this.lineBreak(result);
        return result;
    },

    /**
     * ????????? count ????????? ?????? ???????????? ????????????.
     * @param count
     * @return string
     */
    randomStr(count) {
        var text = '';
        var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (var i = 0; i < count; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    },
};
