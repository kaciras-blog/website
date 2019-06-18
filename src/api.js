import * as KxUI from "kx-ui";
import Axios from "axios";
import cookies from "axios/lib/helpers/cookies";
import isURLSameOrigin from "axios/lib/helpers/isURLSameOrigin";
import { isStandardBrowserEnv } from "axios/lib/utils";

const CSRF_COOKIE_NAME = "CSRF-Token";
const CSRF_HEADER_NAME = "X-CSRF-Token";

Axios.defaults.withCredentials = true;

// CSRF Token 在下面自定义处理了
// Axios.defaults.xsrfCookieName = CSRF_COOKIE_NAME;
// Axios.defaults.xsrfHeaderName = CSRF_HEADER_NAME;

if (process.env.NODE_ENV === "production") {
	Axios.defaults.timeout = 10000;
}

/**
 * 配置Axios实例，在请求参数中带上Token来防止CSRF攻击。
 *
 * Axios内置了在请求头中带Token的功能，但是这个请求头将导致所有跨域请求都要预检。
 * 这里自定义了这一过程，并排除掉安全请求（GET，HEAD）以提高性能。
 *
 * @param axios Axios实例
 */
function parameterCsrfProtection(axios) {

	function configure(config) {
		const method = config.method.toUpperCase();
		if(method === "GET" || method === "HEAD") {
			return config;
		}
		const xsrfValue = config.withCredentials || isURLSameOrigin(config.url)
			? cookies.read(CSRF_COOKIE_NAME) : null;

		if (xsrfValue) {
			// config.params = config.params || {};
			// config.params["csrf"] = xsrfValue;
			config.headers[CSRF_HEADER_NAME] = xsrfValue;
		}
		return config;
	}

	if (isStandardBrowserEnv()) {
		axios.interceptors.request.use(configure);
	}
}

// MDZZ，axios不能全局配置拦截？
function createAxios(config) {
	const axios = Axios.create(config);
	parameterCsrfProtection(axios);

	axios.interceptors.response.use(null, error => {
		if (error.response) {
			error.code = error.response.status;
		} else {
			error.code = -1; // 连接失败
		}
		return Promise.reject(error);
	});
	return axios;
}

const apiSet = {
	mainServer: createAxios({ baseURL: process.env.CONFIG.contentServerUri }),
	webServer: createAxios(),
};


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *						API工厂类，实现各种 withXXX()
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/**
 * 服务器正常回复，而不是出现5xx状态码。
 * 加入到Axios的请求选项中：Config.validateStatus。
 *
 * @param status {number} 状态码
 * @return {boolean} 是否算作正常回复
 */
function NormalResponse(status) {
	return status >= 0 && status < 500;
}

export class BasicApiFactory {

	constructor(axiosSet) {
		this.axiosSet = axiosSet;
	}

	/**
	 * 设置原请求，发送的请求将使用原请求的 Cookie 和一些 Header 以表现出与原请求相同的身份。
	 * 该方法仅用于服务端渲染，在浏览器中无效。
	 *
	 * @param proto 原请求
	 * @return {*} API集
	 */
	withPrototype(proto) {
		return new ProxyApiFactory(this.axiosSet).withPrototype(proto);
	}

	/**
	 * 设置取消令牌，使请求能够取消。
	 *
	 * @param cancelToken { CancelToken } 取消令牌
	 * @return {*} API集
	 */
	withCancelToken(cancelToken) {
		return new ProxyApiFactory(this.axiosSet).withCancelToken(cancelToken);
	}

	// protected
	createApiInstance(clazz) {
		return new clazz(this.axiosSet);
	}

	get article() { return this.createApiInstance(ArticleApi); }

	get category() { return this.createApiInstance(CategoryApi); }

	get discuss() { return this.createApiInstance(DiscussApi); }

	get draft() { return this.createApiInstance(DraftApi); }

	get user() { return this.createApiInstance(UserApi); }

	get recommend() { return this.createApiInstance(RecommendApi); }

	get misc() { return this.createApiInstance(MiscApi); }

	get config() { return this.createApiInstance(ConfigApi); }
}


class AxiosSetProxy {

	constructor(filters) {
		this.filters = filters;
	}

	get(target, name) {
		return new Proxy(target[name], new AxiosProxy(this.filters));
	}
}

/**
 * 使用ES6代理Axios，以便在请求前修改设置。
 *
 * Axios创建实例不能再使用create来扩展，并且用了个wrap函数封装使
 * 得扩展难以进行，所以才用这种方式，等1.0版本出了再看看能不能用更优雅的方法。
 */
class AxiosProxy {

	constructor(filters) {
		this.filters = filters;
	}

	prepare(config) {
		config = config || {};
		this.filters.forEach(f => f(config));
		return config;
	}

	get(target, name) {
		if (["delete", "get", "head", "options"].indexOf(name) > 0) {
			return (url, config) => target[name](url, this.prepare(config));
		}
		if (["post", "put", "patch"].indexOf(name) > 0) {
			return (url, data, config) => target[name](url, data, this.prepare(config));
		}
		return config => target[name](this.prepare(config));
	}
}

class ProxyApiFactory extends BasicApiFactory {

	constructor(axiosSet) {
		super(axiosSet);
		this.filters = [];
	}

	createApiInstance(clazz) {
		return new clazz(new Proxy(this.axiosSet, new AxiosSetProxy(this.filters)));
	}

	// TODO: 所有请求都穿透了CSRF，但安全请求并不需要
	withPrototype(proto) {
		if (!proto) {
			return this;
		}
		this.filters.push(config => {
			config.headers = config.headers || {};

			// UA可以随便改，没啥实际用，还不如穿透了统计下客户端类型
			if (proto.headers["user-agent"]) {
				config.headers["User-Agent"] = proto.headers["user-agent"];
			}
			if (proto.headers.cookie) {
				config.headers.Cookie = proto.headers.cookie;
			}

			const csrfToken = proto.cookies.get(CSRF_COOKIE_NAME);
			if (csrfToken) {
				config.headers[CSRF_HEADER_NAME] = csrfToken;
			}

			// SSR 也属于反向代理，记得带上原始IP
			config.headers["X-Forwarded-For"] = proto.ip;
		});
		return this;
	}

	withCancelToken(cancelToken) {
		if (!cancelToken) {
			return this;
		}
		if (cancelToken instanceof KxUI.CancelToken) {
			const axiosCancelToken = Axios.CancelToken.source();
			cancelToken.onCancel(axiosCancelToken.cancel);
			cancelToken = axiosCancelToken.token;
		}
		this.filters.push(config => config.cancelToken = cancelToken);
		return this;
	}
}


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *								API实现
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

class AbstractApi {

	constructor(axiosSet) {
		this.axiosSet = axiosSet;
	}

	get mainServer() {
		return this.axiosSet.mainServer;
	}

	get webServer() {
		return this.axiosSet.webServer;
	}
}

class ArticleApi extends AbstractApi {

	get(id) {
		return this.mainServer.get("/articles/" + id).then(r => r.data);
	}

	publish(data) {
		return this.mainServer.post("/articles", data).then(r => r.headers["location"]);
	}

	update(id, data) {
		return this.mainServer.put("/articles/" + id, data).then(r => r.headers["location"]);
	}

	/**
	 * 接受以下参数：
	 *   start：起始位置
	 *   count：抓取数量
	 *   category：分类
	 *   deletion：删除状态
	 *   recursive：是否递归子分类
	 * @param params
	 * @return {Promise<Array>} 文章基本信息列表
	 */
	getList(params) {
		params = Object.assign({
			start: 0,
			count: 20,
			deletion: "FALSE",
		}, params);
		return this.mainServer.get("/articles", { params }).then(r => r.data);
	}

	getHots() {
		return this.mainServer.get("/recommendation/articles").then(r => r.data);
	}

	updateDeletion(id, deletion) {
		return this.mainServer.patch(`/articles/${id}`, { deletion });
	}

	changeCategories(id, category) {
		return this.mainServer.patch(`/articles/${id}`, { category });
	}
}

class CategoryApi extends AbstractApi {

	getChildren(id) {
		return this.mainServer.get(`/categories/${id}/children`).then(r => r.data);
	}

	remove(id, treeMode) {
		return this.mainServer.delete("/categories/" + id, { params: { tree: treeMode } });
	}

	get(id, aggregate) {
		return this.mainServer.get("/categories/" + id, { params: { aggregate } }).then(r => r.data);
	}

	move(id, parent, treeMode) {
		return this.mainServer.post("/categories/transfer", { params: { id, parent, treeMode } });
	}

	create(data, parent) {
		return this.mainServer.post("/categories/", data, { params: { parent } });
	}

	update(id, data) {
		return this.mainServer.put("/categories/" + id, data);
	}
}

class DiscussApi extends AbstractApi {

	add(objectId, type, content) {
		return this.mainServer.post("/discussions", { objectId, type, content });
	}

	/**
	 * 发表回复（楼中楼）
	 *
	 * @param parent {int} 评论id
	 * @param content {String} 内容
	 * @return Promise
	 */
	reply(parent, content) {
		return this.mainServer.post("/discussions", { parent, content });
	}

	getList(objectId, type, start, count, sort = undefined) {
		const params = { objectId, type, parent: 0, start, count, sort };
		return this.mainServer.get("/discussions", { params }).then(r => r.data);
	}

	/**
	 * 获取评论的回复（楼中楼）
	 *
	 * @param parent {int} 评论id
	 * @param start {int} 起始位置
	 * @param count {int} 每页数量
	 * @return Promise<?> 回复列表
	 */
	getReplies(parent, start, count) {
		return this.mainServer.get("/discussions", { params: { parent, start, count } }).then(r => r.data);
	}

	getModeration() {
		return this.mainServer.get("/discussions", { params: { state: "Moderation", linked: true } }).then(r => r.data);
	}

	/**
	 * 批量更新评论的状态（待审、删除、正常）
	 * 该API目前仅能由管理者使用，不支持用户删除自己的评论，因为匿名评论无法确定用户身份。
	 *
	 * @param ids 评论ID或ID数组
	 * @param state 目标状态
	 */
	updateStates(ids, state) {
		ids = Array.isArray(ids) ? ids : [ids];
		this.mainServer.patch("/discussions", { ids, state });
	}

	voteUp(id) {
		return this.mainServer.post(`/discussions/${id}/votes`);
	}

	revokeVote(id) {
		return this.mainServer.delete(`/discussions/${id}/votes`);
	}
}

class DraftApi extends AbstractApi {

	createNew() {
		return this.mainServer.post("/drafts").then(resp => resp.headers["location"].substring("/drafts/".length));
	}

	fromArticle(article) {
		return this.mainServer.post("/drafts", null, {
			params: { article },
		}).then(resp => resp.headers["location"].substring("/drafts/".length));
	}

	getList(userId, start, count) {
		return this.mainServer.get("/drafts", { params: { userId, start, count } }).then(r => r.data);
	}

	get(id) {
		return this.mainServer.get(`/drafts/${id}`).then(r => r.data);
	}

	getHistory(id, saveCount) {
		return this.mainServer.get(`/drafts/${id}/histories/${saveCount}`).then(r => r.data);
	}

	saveNewHistory(id, data) {
		return this.mainServer.post(`/drafts/${id}/histories`, data);
	}

	save(id, saveCount, data) {
		return this.mainServer.put(`/drafts/${id}/histories/${saveCount}`, data);
	}

	/** 删除一个草稿 */
	remove(id) {
		return this.mainServer.delete("/drafts/" + id);
	}

	/** 清空所有草稿 */
	clear() {
		return this.mainServer.delete("/drafts");
	}
}

class MiscApi extends AbstractApi {
	/**
	 *
	 * @param file 文件
	 * @param progress 进度回调
	 * @returns Promise<String>
	 */
	uploadImage(file, progress) {
		const data = new FormData();
		data.append("file", file);
		return this.webServer.post("/image", data, {
			onUploadProgress: progress,
		}).then(r => r.headers["location"]);
	}

	/**
	 * openFile 和 uploadImage 的封装方法，弹出文件选择框(只能单选)
	 * 用户选择后上传服务器，并返回用于访问图片的文件名
	 *
	 * @returns Promise<String> 保存的图片文件名
	 */
	async uploadImageFile() {
		const files = await KxUI.openFile(false, "image/*");
		return await this.uploadImage(files[0]);
	}

	// noinspection JSMethodCanBeStatic
	/**
	 * 生成一个验证码URL，该函数返回的不是Promise。
	 *
	 * @return {string} 验证码URL
	 */
	newCaptchaAddress() {
		return process.env.CONFIG.contentServerUri + "/captcha?r=" + Math.random();
	}
}

class UserApi extends AbstractApi {

	/**
	 * 用户登录，登录成功后会添加相应的Cookie
	 * @param form 一个对象，格式如下：{ name: 用户名, password: 密码, remember: 是否保存登录 }
	 */
	login(form) {
		return this.mainServer.post("/accounts/login", form);
	}

	/**
	 * 用户注册，注册后自动登录
	 * @param data 一个对象，格式如下：{
	 * 		name: "用户名",
	 * 		password: "密码",
	 * 		email: "邮箱",
	 * 		captcha: "验证码"
	 * }
	 * @return Promise
	 */
	signup(data) {
		return this.mainServer.post("/accounts", data);
	}

	logout() {
		return this.mainServer.delete("/session/user");
	}

	getCurrent() {
		return this.mainServer.get("/session/user", { validateStatus: NormalResponse });
	}

	get(id) {
		return this.mainServer.get("/users/" + id);
	}

	updateProfile(profile) {
		return this.mainServer.patch("/session/user", profile);
	}
}


class RecommendApi extends AbstractApi {

	get swiper() {
		return new SwiperApi(this.axiosSet);
	}
}

class SwiperApi extends AbstractApi {

	get() {
		return this.mainServer.get("/recommendation/cards").then(r => r.data);
	}

	set(list) {
		return this.mainServer.put("/recommendation/cards", list);
	}
}

class ConfigApi extends AbstractApi {

	get(namespace) {
		return this.mainServer.get(`config/${namespace}`).then(r => r.data);
	}

	set(namespace, properties) {
		return this.mainServer.patch(`config/${namespace}`, properties);
	}
}

export const DiscussionState = {
	Visible: "Visible", // 正常显示
	Deleted: "Deleted", // 已删除
	Moderation: "Moderation", // 等待审核
};

export default new BasicApiFactory(apiSet);
