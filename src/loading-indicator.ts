/*
 * 加载指示器，仅用于客户端。
 */
import Vue from "vue";
import TopProgressBar from "@kaciras-blog/uikit/src/components/KxProgress.vue";

// Vue2对TS的支持真的不行
const progressBar = new Vue(TopProgressBar) as any;

let abortController = new AbortController();
let fetching = false;

export function mount() {
	document.body.appendChild(progressBar.$mount().$el);
}

/** 取消上一个 AbortSignal，然后初始化一个新的 */
export function start() {
	if (fetching) {
		abortController.abort();
	}
	progressBar.setProgress(30);
	fetching = true;

	abortController = new AbortController();
	setTimeout(abortController.abort.bind(abortController), 10_000);
	abortController.signal.onabort = progressBar.reset;

	return abortController.signal;
}

export function startPrefetch() {
	progressBar.setProgress(70);
	fetching = true;
}

export function finishSuccessful() {
	progressBar.finish();
	fetching = false;
}

export function finishWithError() {
	progressBar.fail();
	fetching = false;
}

// 没有 finishCancel，因为取消总是由这里发起
