/**
 * Google Analytics
 */
declare const dataLayer: any[];

interface Window {
	dataLayer: any[];
}

const AnalyticsId = process.env.CONFIG.googleTagManager;
if (AnalyticsId) {
	window.dataLayer = window.dataLayer || [];

	function gtag(...args: any[]) {
		dataLayer.push(arguments);
	}

	gtag('js', new Date());
	gtag('config', AnalyticsId);

	const script = document.createElement("script");
	script.async = true;
	script.src = `https://www.googletagmanager.com/gtag/js?id=${AnalyticsId}`;
	document.head.append(script)
}


/**
 * 检测不支持的浏览器，显示一个提示栏。
 */
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
