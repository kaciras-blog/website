/* 一些乱七八糟的小功能直接写一起了 */

declare const dataLayer: any[];

const GA_ID = import.meta.env.GOOGLE_ANALYTICS_ID;
if (GA_ID) {
	(window as any).dataLayer ??= [];

	function gtag(...args: any[]) {
		dataLayer.push(arguments);
	}

	gtag('js', new Date());
	gtag('config', GA_ID);

	const script = document.createElement("script");
	script.async = true;
	script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
	document.head.append(script)
}
