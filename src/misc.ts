/* 一些乱七八糟的小功能直接写一起了 */

// =========================== Google Analytics ===========================

declare const dataLayer: any[];

interface Window {
	dataLayer: any[];
}

// 【坑爹】读取 DefinePlugin 中的值不能使用对象展开语法
const GOOGLE_ANALYTICS_ID = process.env.GOOGLE_ANALYTICS_ID;
if (GOOGLE_ANALYTICS_ID) {
	window.dataLayer = window.dataLayer || [];

	function gtag(...args: any[]) {
		dataLayer.push(arguments);
	}

	gtag('js', new Date());
	gtag('config', GOOGLE_ANALYTICS_ID);

	const script = document.createElement("script");
	script.async = true;
	script.src = `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`;
	document.head.append(script)
}

/**
 * 判断浏览器是否支持，根据：
 *
 * 1.ServiceWorker 里 fetchAndCache() 使用了 Response.body 创建新响应。
 * 2.页面大量使用 grid 布局。
 *
 * @return 如果支持则为true，否则false
 */
function isSupportedBrowser() {

	// https://github.com/GoogleChrome/workbox/issues/1473
	try {
		new ReadableStream({ start() {} });
	} catch (error) {
		return false;
	}

	return CSS.supports("display", "grid");
}

// 检测不支持的浏览器，显示一个提示栏
if (!isSupportedBrowser()) {
	const alert = document.createElement("div");
	alert.className = "global-error";
	alert.innerText = "您的浏览器版本太旧，或是非主流内核，可能无法正常浏览本站。" +
		"请使用最新版的Edge、Firefox、Chrome、Safari等浏览器（本站不支持IE）";
	document.body.insertBefore(alert, document.body.firstChild);
}
