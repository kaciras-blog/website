// 也就用一个 process 而已，就不引入 node 的类型定义了
declare const process: {
	env: {
		NODE_ENV: string,
		PUBLIC_URL: string,
	}
};

const ServiceWorkerPath = "/sw.js";


function register() {
	const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
	if (publicUrl.origin !== window.location.origin) {
		return console.error("service worker won't work when PUBLIC_URL is on a different origin");
	}

	function afterRegister() {
		console.log("Service worker registered successfully!");
		const channel = new BroadcastChannel("PWA-UPDATE");
		channel.onmessage = (message) => {
			console.log("Channel消息：", message);
		};
		navigator.serviceWorker.onmessage = (message) => {
			console.log("直接消息：", message);
		};
	}

	// 等到 window.load 事件时再注册，以免 ServiceWorker 里加载的资源占用首屏宽带
	window.addEventListener("load", () => {
		navigator.serviceWorker.register(ServiceWorkerPath)
			.then(afterRegister)
			.catch((err) => console.error("Error during service worker registration:", err));
	});
}


/**
 * 注销 ServiceWorker，没有检查每个 ServiceWorker 是否都注销完成，因为就算注销失败也没有什么办法处理。
 */
function unregister() {
	navigator.serviceWorker.getRegistrations()
		.then(regs => regs.forEach(reg => reg.unregister()))
		.catch(() => console.error("Service worker failed to unregister."));
}


/* 生产模式下注册 ServiceWorker，开发模式禁用 */
if ("serviceWorker" in navigator) {
	if (process.env.NODE_ENV === "production") {
		register();
	} else {
		unregister();
	}
}
