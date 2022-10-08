type PublicAPIConfig = string | number | Record<string, string | number>;

/**
 * 获取内容服务器的 URL 前缀，适配各种场景。
 *
 * 因为内容服务器是用 JAVA 写的，我又懒得加层代理去统一域名端口，
 * 所以在各个情况下其地址不同，复杂到需要一个函数来判断。
 *
 * @param config 配置项 config.backend.public
 */
export function getContentServerURL(config: PublicAPIConfig): string {
	if (import.meta.env.SSR) {
		return import.meta.env.API_INTERNAL;
	}
	const { protocol, hostname } = location;
	switch (typeof config) {
		case "object":
			return getContentServerURL(config[protocol.slice(0, -1)]);
		case "string":
			return config;
		default:
			return `${protocol}//${hostname}:${config}`;
	}
}

// 这俩到处都有用，跟 index.ts 或 utils.ts 放一起可能会引入额外的副作用代码。
export const contentServiceURL = getContentServerURL(import.meta.env.API_PUBLIC);
export const webServiceURL = import.meta.env.SSR ? "__NEVER_USED__" : location.href;
