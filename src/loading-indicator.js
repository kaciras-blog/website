/*
 * 加载指示器，仅用于客户端。
 */
import TopProgressBar from "./components/TopProgressBar";
import Vue from "vue";
import { CancelToken } from "kx-ui";


const topProgressBar = new Vue(TopProgressBar).$mount();
document.body.appendChild(topProgressBar.$el);


let cancelToken = CancelToken.NEVER;
let fetching = false;


/** 取消上一个 CancelToken，然后初始化一个新的 */
export function start() {
	if(fetching) {
		cancelToken.cancel();
	}
	topProgressBar.start();
	fetching = true;

	cancelToken = CancelToken.timeout(10_000);
	return cancelToken;
}

export function setComponentResolved() {
	topProgressBar.middle();
	fetching = true;
}

export function setError() {
	topProgressBar.error();
	fetching = false;
}

export function setSuccessful() {
	topProgressBar.finish();
	fetching = false;
}

// 没有setCancel，因为取消总是由这里发起
