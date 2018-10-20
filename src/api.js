import Axios from "axios";
import * as KxUI from "kx-ui";

const CSRF_COOKIE_NAME = "CSRF-Token";
const CSRF_HEADER_NAME = "X-CSRF-Token";

Axios.defaults.xsrfCookieName = CSRF_COOKIE_NAME;
Axios.defaults.xsrfHeaderName = CSRF_HEADER_NAME;
Axios.defaults.withCredentials = true;

if (process.env.NODE_ENV === "production") {
	Axios.defaults.timeout = 10000;
}

/**
 * 配置不同环境下的服务器地址。
 *
 * @return {*} 配置选项
 */
function defineApiServerConfig () {
	const local = {
		main: "https://localhost:2375",
		account: "https://localhost:26480",
		front: "https://localhost",
	};
	const productionWeb = {
		main: "https://api.kaciras.net:2375",
		account: "https://api.kaciras.net:26480",
		front: "https://blog.kaciras.net",
	};
	if (process.env.VUE_ENV === "server" || process.env.NODE_ENV !== "production") {
		return local; // SSR和本地开发环境都直接走localhost
	}
	return productionWeb;
}

function request (options, callback) {
	let host = `https://${options.hostname}`;
	if (options.port) {
		host += ":" + options.port;
	}

	const client = eval("require")("http2").connect(host);
	const req = client.request({
		...options.headers,
		":method": options.method.toUpperCase(),
		":path": options.path,
	});

	req.on("response", headers => {
		req.headers = headers;
		req.statusCode = headers[":status"];
		callback(req);
	});
	req.on("end", () => client.close());
	return req;
}

if (process.env.VUE_ENV === "server") {
	Axios.defaults.transport = { request };
}

// MDZZ，axios不能全局配置拦截？
function createAxios (config) {
	const instance = Axios.create(config);
	instance.interceptors.response.use(null, error => {
		if (error.response) {
			error.code = error.response.status;
		} else {
			error.code = -1; // 连接失败
		}
		return Promise.reject(error);
	});
	return instance;
}

const apiConfig = defineApiServerConfig();
const mainServer = createAxios({ baseURL: apiConfig.main });
const securityServer = createAxios({ baseURL: apiConfig.account });
const webServer = createAxios({ baseURL: apiConfig.front });


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *							下面是API调用函数
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/**
 * 服务器正常回复，而不是出现5xx状态码。
 * 加入到Axios的请求选项中：Config.validateStatus。
 *
 * @param status {number} 状态码
 * @return {boolean} 是否算作正常回复
 */
function NormalResponse (status) {
	return status >= 0 && status < 500;
}


/**
 * 使用ES6代理Axios，以便在请求前修改设置。
 *
 * Axios创建实例不能再使用create来扩展，并且用了个wrap函数封装使
 * 得扩展难以进行，所以才用这种方式，等1.0版本出了再看看能不能用更优雅的方法。
 */
class AxiosProxy {

	constructor (filters) {
		this.filters = filters;
	}

	prepare (config) {
		config = config || {};
		this.filters.forEach(f => f(config));
		return config;
	}

	get (target, name) {
		if (["delete", "get", "head", "options"].indexOf(name) > 0) {
			return (url, config) => target[name](url, this.prepare(config));
		}
		if (["post", "put", "patch"].indexOf(name) > 0) {
			return (url, data, config) => target[name](url, data, this.prepare(config));
		}
		return config => target[name](this.prepare(config));
	}
}


class BasicApiSet {

	// noinspection JSMethodCanBeStatic
	get mainServer () {
		return mainServer;
	}

	// noinspection JSMethodCanBeStatic
	get securityServer () {
		return securityServer;
	}

	// noinspection JSMethodCanBeStatic
	get webServer () {
		return webServer;
	}

	/**
	 * 创建代理API集，以便获取到代理后的Axios。
	 *
	 * @return {ProxiedApiSet}
	 */
	createProxied () {

		//为了覆写 BasicApiSet 中的相关方法，动态生成代理类继承基础API类。
		class ProxiedApiSet extends this.constructor {

			constructor () {
				super();
				this.filters = [];
			}

			get mainServer () {
				return new Proxy(super.mainServer, new AxiosProxy(this.filters));
			}

			get securityServer () {
				return new Proxy(super.securityServer, new AxiosProxy(this.filters));
			}

			get webServer () {
				return new Proxy(super.webServer, new AxiosProxy(this.filters));
			}

			static bindProto (config, proto) {
				config.headers = config.headers || {};
				if (proto.headers.cookie) {
					config.headers.Cookie = proto.headers.cookie;
				}
				const csrf = proto.cookies.get(CSRF_COOKIE_NAME);
				if (csrf) {
					config.headers[CSRF_HEADER_NAME] = "test";
				}
			}

			withPrototype (proto) {
				if (proto) {
					this.filters.push(config => ProxiedApiSet.bindProto(config, proto));
				}
				return this;
			}

			withCancelToken (cancelToken) {
				if (cancelToken instanceof KxUI.CancelToken) {
					const asioxCancelToken = Axios.CancelToken.source();
					cancelToken.onCancel(asioxCancelToken.cancel);
					cancelToken = asioxCancelToken.token;
				}
				this.filters.push(config => config.cancelToken = cancelToken);
				return this;
			}
		}

		return new ProxiedApiSet();
	}

	/**
	 * 设置原请求，发送的请求将使用原请求的Cookie和一些Header以表现出与
	 * 原请求相同的身份，用于服务端渲染时Cookie穿透。
	 *
	 * @param proto 原请求
	 * @return {*} API集
	 */
	withPrototype (proto) {
		return this.createProxied().withPrototype(proto);
	}

	/**
	 * 设置取消令牌，使请求能够取消。
	 *
	 * @param cancelToken { CancelToken } 取消令牌
	 * @return {*} API集
	 */
	withCancelToken (cancelToken) {
		return this.createProxied().withCancelToken(cancelToken);
	}
}


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *								API实现
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

class ArticleApi extends BasicApiSet {

	get (id) {
		return this.mainServer.get("/articles/" + id).then(r => r.data);
	}

	publish (data) {
		return this.mainServer.post("/articles", data).then(r => r.headers["location"]);
	}

	update (id, data) {
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
	getList (params) {
		params = Object.assign({
			start: 0,
			count: 20,
			deletion: "FALSE",
		}, params);
		return this.mainServer.get("/articles", { params }).then(r => r.data);
	}

	getHots () {
		return this.mainServer.get("/recommendation/articles").then(r => r.data);
	}

	deleteOne (id) {
		return this.mainServer.put(`/articles/${id}/deletion`, null, { params: { value: true } });
	}

	changeCategories (id, cates) {
		return this.mainServer.put(`/articles/${id}/categories`, cates);
	}
}


class CategoryApi extends BasicApiSet {

	getChildren (id) {
		return this.mainServer.get(`/categories/${id}/children`).then(r => r.data);
	}

	deleteOne (id) {
		return this.mainServer.delete("/categories/" + id);
	}

	get (id) {
		return this.mainServer.get("/categories/" + id).then(r => r.data);
	}

	move (id, parent, treeMode) {
		return this.mainServer.post("/categories/transfer", { params: { id, parent, treeMode } });
	}

	create (data, parent) {
		return this.mainServer.post("/categories/", data, { params: { parent } });
	}

	update (id, data) {
		return this.mainServer.put("/categories/" + id, data);
	}
}

class DiscussApi extends BasicApiSet {

	add (objectId, content) {
		return this.mainServer.post("/discussions", { objectId, type: 0, content });
	}

	getList (objectId, start, count) {
		return this.mainServer.get("/discussions",
			{ params: { objectId, type: 0, start, count } }).then(r => r.data);
	}

	/**
	 * 获取评论的回复（楼中楼）
	 *
	 * @param discuz {int} 评论id
	 * @param index {int} 页码，从1开始
	 * @param count {int} 每页数量
	 * @return Promise<?> 回复列表
	 */
	getReplies (discuz, index, count) {
		return this.mainServer.get(`/discussions/${discuz}/replies`, {
			params: { start: index * count, count },
		}).then(r => r.data);
	}

	/**
	 * 发表回复（楼中楼）
	 *
	 * @param discuz {int} 评论id
	 * @param content {String} 内容
	 * @return Promise
	 */
	reply (discuz, content) {
		return this.mainServer.post(`/discussions/${discuz}/replies`, content, {
			headers: { "Content-Type": "text/plain;charset=UTF-8" },
		});
	}

	deleteOne (id) {
		return this.mainServer.delete("/discussions/" + id);
	}

	voteUp (id) {
		return this.mainServer.post(`/discussions/${id}/votes`);
	}

	revokeVote (id) {
		return this.mainServer.delete(`/discussions/${id}/votes`);
	}
}


class DraftApi extends BasicApiSet {

	get (id) {
		return this.mainServer.get("/drafts/" + id).then(r => r.data);
	}

	getList (userId, start, count) {
		return this.mainServer.get("/drafts", {
			params: { userId, start, count },
		}).then(r => r.data);
	}

	save (id, saveCount, data) {
		return this.mainServer.put(`/drafts/${id}/histories/${saveCount}`, data);
	}

	saveNewHistory (id, data) {
		return this.mainServer.post(`/drafts/${id}/histories`, data);
	}

	deleteOne (id) {
		return this.mainServer.delete("/drafts/" + id);
	}

	clear () {
		return this.mainServer.delete("/drafts");
	}

	createNew () {
		return this.mainServer.post("/drafts").then(resp => resp.headers["location"].substring("/drafts/".length));
	}

	createFromPost (article) {
		return this.mainServer.post("/drafts", null, {
			params: { article },
		}).then(resp => resp.headers["location"].substring("/drafts/".length));
	}
}


class MiscApi extends BasicApiSet {
	/**
	 *
	 * @param file 文件
	 * @param progress 进度回调
	 * @returns Promise<String>
	 */
	uploadImage (file, progress) {
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
	async uploadImageFile () {
		const files = await KxUI.openFile(false, "image/*");
		return await this.uploadImage(files[0]);
	}

	// noinspection JSMethodCanBeStatic
	/**
	 * 生成一个验证码URL，该函数返回的不是Promise。
	 *
	 * @return {string} 验证码URL
	 */
	get captchaAddress () {
		return apiConfig.account + "/captcha?r=" + Math.random();
	}
}


class UserApi extends BasicApiSet {

	/**
	 * 用户登录，登录成功后会添加相应的Cookie
	 * @param form 一个对象，格式如下：{ name: 用户名, password: 密码, remember: 是否保存登录 }
	 * @return Promise
	 */
	login (form) {
		return this.securityServer.post("/session/account", form);
	}

	logout () {
		return this.securityServer.delete("/session/account");
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
	signup (data) {
		return this.securityServer.post("/accounts", data);
	}

	// 会自动创建用户，需要先登录
	getCurrent () {
		return this.mainServer.get("/current-user", { validateStatus: NormalResponse });
	}

	get (id) {
		return this.mainServer.get("/users/" + id);
	}
}


class RecommandApi extends BasicApiSet {

	constructor () {
		super();
		this.swiper = new SwiperApi();
	}
}

class SwiperApi extends BasicApiSet {

	get () {
		return this.mainServer.get("/recommendation/swiper").then(r => r.data);
	}

	set (list) {
		return this.mainServer.put("/recommendation/swiper", list);
	}
}

export default {
	article: new ArticleApi(),
	category: new CategoryApi(),
	discuss: new DiscussApi(),
	draft: new DraftApi(),
	user: new UserApi(),
	recommend: new RecommandApi(),
	misc: new MiscApi(),
};
