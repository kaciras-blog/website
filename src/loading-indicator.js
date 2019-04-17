/*
 * 加载指示器，仅用于客户端。
 */
import TopProgressBar from "./components/TopProgressBar";
import GlobalPoptipContainer from "./components/GlobalPoptipContainer";
import Vue from "vue";
import { CancelToken } from "kx-ui";
import NavigatePoptip from "./components/NavigatePoptip";


const topProgressBar = new Vue(TopProgressBar).$mount();
document.body.appendChild(topProgressBar.$el);

const poptipContainer = new Vue(GlobalPoptipContainer).$mount();
document.body.appendChild(poptipContainer.$el);


let cancelToken = CancelToken.NEVER;
let fetching = false;
let closePoptip = null;

/** 取消上一个 CancelToken，然后初始化一个新的 */
export function start() {
	if (fetching) {
		cancelToken.cancel();
	}
	topProgressBar.setProgress(30);
	fetching = true;

	cancelToken = CancelToken.timeout(10_000);
	cancelToken.onCancel(() => {
		closePoptip();
		topProgressBar.reset();
	});
	closePoptip = poptipContainer.add(NavigatePoptip, { state: 1 }, { cancel: () => closePoptip() });
	return cancelToken;
}

export function setComponentResolved() {
	topProgressBar.setProgress(70);
	fetching = true;
}

export function setError() {
	topProgressBar.fail();
	fetching = false;
}

export function setSuccessful() {
	closePoptip();
	topProgressBar.finish();
	fetching = false;
}

// 没有setCancel，因为取消总是由这里发起
