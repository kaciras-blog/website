/* 一些乱七八糟的小功能直接写一起了 */

// 检查是否从指定的域名访问，如果不是可能网站被镜像了
// const { webHost } = process.env.CONFIG;
// if (webHost && location.host !== webHost) {
// 	location.href = location.href.replace(location.host, webHost);
// }

// =========================== Google Analytics ===========================

declare const dataLayer: any[];

interface Window {
	dataLayer: any[];
}

const { GOOGLE_ANALYTICS_ID } = process.env.CONFIG as any;
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

// ==================== 检测不支持的浏览器，显示一个提示栏 ====================

function checkBrowserSupport() {
	if (typeof CSS === "undefined") {
		return false;
	}
	return CSS.supports("display", "grid");
}

if (!checkBrowserSupport()) {
	const alert = document.createElement("div");
	alert.setAttribute("class", "ealert");
	alert.innerText = "您的浏览器版本太旧，或是非主流内核，可能无法正常浏览本站。" +
		"请使用最新版的Edge、Firefox、Chrome、Safari等浏览器（本站不支持IE）";
	document.body.insertBefore(alert, document.body.firstChild);
}
