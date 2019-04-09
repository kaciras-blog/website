/*
 * 加载指示器，仅用于客户端。
 */
import TopProgressBar from "./components/TopProgressBar";
import Vue from "vue";
import { CancelToken } from "kx-ui";


const topProgressBar = new Vue(TopProgressBar).$mount();
document.body.appendChild(topProgressBar.$el);

class State {
	static Free = 0;
	static ResolvingComponent = 1;
	static PreFetching = 2;
	static Success = 3;
	static Error = 4;
	static Cancelled = 5;
}

let cancelToken = CancelToken.NEVER;
let state = State.Free;


/** 取消上一个 CancelToken，然后初始化一个新的 */
export function start() {
	if(state === State.ResolvingComponent || state === State.PreFetching) {
		cancelToken.cancel();
	}
	topProgressBar.start();
	state = State.ResolvingComponent;

	cancelToken = CancelToken.timeout(10_000);
	cancelToken.onCancel(setError);
	return cancelToken;
}

export function setComponentResolved() {
	topProgressBar.middle();
	state = State.PreFetching;
}

export function setError() {
	topProgressBar.error();
	state = State.Error;
}

export function setSuccessful() {
	topProgressBar.finish();
	state = State.Success;
}

// 没有setCancel，因为取消总是由这里发起
