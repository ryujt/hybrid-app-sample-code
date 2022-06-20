/**
 * 태그 요소가 모두 표시되지 않고 짤려 있는 지를 판단해서 class 목록에 truncated를 추가해주기
 * 예를 들어서 모든 p 태그를 검사해서 짤려 있으면 타겟 요소에 class 목록에 truncated를 추가해 준다.
 * 화면이 리사이징 될 때마다 재 검사한다.
 */

let started = false;
let targetTag = "";

window.addEventListener('resize', () => {
    if (started) checkTruncated();
});

function checkTruncated() {
    const ps = document.querySelectorAll(targetTag);
    const observer = new ResizeObserver(entries => {
        for (let entry of entries) {
            entry.target.classList[entry.target.scrollHeight > entry.contentRect.height ? 'add' : 'remove']('truncated');
        }
    });
    ps.forEach(p => {
        observer.observe(p);
    });
}

export default {
    /**
     * 짤림 검사를 시작한다.
     * @param src 짤려있는 지 확인할 대상 element
     * @param target src가 짤려 있으면 class를 변경해야 하는 대상 element
     */
    start(target) {
        targetTag = target;
        started = true;
        checkTruncated();
    },
    refresh() {
        checkTruncated();
    },
    stop() {
        started = false;
    },
}