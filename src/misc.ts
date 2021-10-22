/* 一些乱七八糟的小功能直接写一起了 */

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
