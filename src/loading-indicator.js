/*
 * 加载指示器，仅用于客户端。
 */
import TopProgressBar from "./components/TopProgressBar";
import Vue from "vue";
import { CancellationToken } from "@kaciras-blog/uikit";

const topProgressBar = new Vue(TopProgressBar).$mount();
document.body.appendChild(topProgressBar.$el);

let cancelToken = CancellationToken.NEVER;
let fetching = false;

/** 取消上一个 CancelToken，然后初始化一个新的 */
export function start() {
	if (fetching) {
		cancelToken.cancel();
	}
	topProgressBar.setProgress(30);
	fetching = true;

	cancelToken = CancellationToken.create();
	setTimeout(() => cancelToken.cancel(), 10_000);
	cancelToken.addListener(topProgressBar.reset);
	return cancelToken;
}

export function startPrefetch() {
	topProgressBar.setProgress(70);
	fetching = true;
}

export function finishSuccessful() {
	topProgressBar.finish();
	fetching = false;
}

export function finishWithError() {
	topProgressBar.fail();
	fetching = false;
}

// 没有 finishCancel，因为取消总是由这里发起
