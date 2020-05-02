import { AxiosResponse } from "axios";

/**
 * 服务器正常回复，而不是出现5xx状态码。
 * 加入到Axios的请求选项中：Config.validateStatus。
 *
 * @param status 状态码
 * @return 是否算作正常回复
 */
export function normalResponse(status: number) {
	return status >= 0 && status < 500;
}

/**
 * 从响应的 Location 头重截取一部分
 *
 * @param prefix 跳过的前缀
 * @return 截取的函数
 */
export function getLocation(prefix: string = "") {
	return (response: AxiosResponse) => response.headers.location.substring(prefix.length);
}
