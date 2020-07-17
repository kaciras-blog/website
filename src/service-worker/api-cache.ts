import { CacheWrapper } from "./cache";
import { HostRoute } from "./routing";
import { networkFirst, timeout } from "./fetch-strategy";

const API_CACHE_NAME = "api-v1.1";

/**
 * 对内容服务接口使用网络优先缓存，保证在网络不通的情况下也能显示旧的内容。
 */
export default function apiCacheRoute() {
	const apiOrigin = process.env.API_ORIGIN as any;
	const BASE_URL = typeof apiOrigin === "string"
		? apiOrigin
		: apiOrigin[location.protocol.substring(0, location.protocol.length - 1)];

	const apiHost = new URL(BASE_URL).host;
	const apiCache = new CacheWrapper(API_CACHE_NAME)

	return new HostRoute(apiHost, networkFirst(apiCache, timeout(7500)));
}
