import axios from "axios";
import * as utils from "./utils";

axios.defaults.timeout = 10000;
axios.defaults.xsrfCookieName = "CSRF-Token";
axios.defaults.xsrfHeaderName = "X-CSRF-Token";
axios.defaults.withCredentials = true;

const API_SERVER = "https://localhost:2375";

const mainServer = axios.create({
	baseURL: "https://localhost:2375",
});
const accountServer = axios.create({
	baseURL: "https://localhost:26480",
});
const frontService = axios.create({
	baseURL: "https://localhost",
});

const _default = {};

_default.category = {

	getPath: (id) => mainServer.get(`/categories/${id}/path`).then(r => r.data),

	getChildren: (id) => mainServer.get(`/categories/${id}/subCategories`).then(r => r.data),

	deleteOne: (id) => mainServer.delete("/categories/" + id),

	getInfo: (id) => mainServer.get("/categories/" + id).then(r => r.data),

	move: (id, parent, treeMode) => mainServer.post("/categories/transfer", {
		params: {id, parent, treeMode},
	}),

	create: (data) => mainServer.post("/categories/", data),

	update: (id, data) => mainServer.put("/categories/" + id, data),
};

_default.article = {

	get: id => mainServer.get("/articles/" + id).then(r => r.data),

	publish: (data) => mainServer.post("/articles", data).then(r => r.headers["location"]),

	update: (id, data) => mainServer.put("/articles/" + id, data).then(r => r.headers["location"]),

	getList: (category, start, count, deletion = "FALSE") => mainServer.get("/articles", {
		params: {
			start: start,
			category: category,
			count: count,
			deletion: deletion,
		},
	}).then(r => r.data),


	deleteOne: (id) => mainServer.put(`/articles/${id}/deletion`, null, {params: {value: true}}),

	changeCategories: (id, cates) => mainServer.put(`/articles/${id}/categories`, cates),
};

_default.discuss = {

	add: (article, content) => mainServer.post("/discussions", {articleId: article, content}),

	getList: (article, index, count) => mainServer.get("/discussions", {
		params: {
			articleId: article,
			start: index,
			count: count,
		},
	}).then(r => r.data),

	/**
	 * 获取评论的回复（楼中楼）
	 *
	 * @param discuz {int} 评论id
	 * @param index {int} 页码，从1开始
	 * @param count {int} 每页数量
	 * @return Promise<?> 回复列表
	 */
	getReplies: (discuz, index, count) => mainServer.get(`/discussions/${discuz}/replies`, {
		params: {
			start: (index - 1) * count,
			count: count,
		},
	}).then(r => r.data),

	/**
	 * 发表回复（楼中楼）
	 *
	 * @param discuz {int} 评论id
	 * @param content {String} 内容
	 * @return Promise
	 */
	reply: (discuz, content) => mainServer.post(`/discussions/${discuz}/replies`, content),

	deleteOne: (id) => mainServer.delete("/discussions/" + id),

	voteUp: (id) => mainServer.post(`/discussions/${id}/votes`),

	revokeVote: (id) => mainServer.delete(`/discussions/${id}/votes`),
};

_default.draft = {

	get: (id) => mainServer.get("/drafts/" + id).then(r => r.data),

	getList: (userId, start, count) => mainServer.get("/drafts", {params: {userId, start, count}}).then(r => r.data),

	save: (id, data, newHistory) => {
		if (newHistory) {
			return mainServer.post(`/drafts/${id}/histories`, data);
		} else {
			return mainServer.put(`/drafts/${id}`, data);
		}
	},

	deleteOne: (id) => mainServer.delete("/drafts/" + id),

	clear: () => mainServer.delete("/drafts"),

	createNew: () => mainServer.post("/drafts").then(resp => resp.headers["location"].substring("/drafts/".length)),

	createFromPost: (postId) => mainServer.post("/drafts", null, {
		params: {
			article: postId,
		},
	}).then(resp => resp.headers["location"].substring("/drafts/".length)),

};


_default.misc = {
	/**
	 *
	 * @param file 文件
	 * @param progress 进度回调
	 * @returns Promise<String>
	 */
	uploadImage: (file, progress) => {
		const data = new FormData();
		data.append("file", file);
		return frontService.post("/image", data, {
			onUploadProgress: progress,
		}).then(r => r.headers["location"]);
	},

	/**
	 * openFile 和 uploadImage 的封装方法，弹出文件选择框(只能单选)
	 * 用户选择后上传服务器，并返回用于访问图片的文件名
	 *
	 * @returns Promise<String> 保存的图片文件名
	 */
	uploadImageFile: async function() {
		const files = await utils.openFile(false, "image/*");
		const url = await this.uploadImage(files[0]);
		return url.substring("/image/".length);
	},

	captchaAddress: () => API_SERVER + "/utils/captcha",
};

_default.session = {
	/**
	 * 用户登录，登录成功后会添加相应的Cookie
	 * @param data 一个对象，格式如下：{ name: "用户名", password: "密码" }
	 * @return Promise
	 */
	login: (data) => mainServer.post("/session/user", data),

	logout: () => mainServer.delete("/session/user").then(() => window.location.reload()),

	getCurrentUser: () => mainServer.get("/session/user").then(r => r.data),
};

_default.account = {
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
	signup: (data) => accountServer.post("/accounts", data),
};

_default.recommend = {

	getHotArticles: () => mainServer.get("/recommendation/articles").then(r => r.data),

	swiper: {
		get: () => mainServer.get("/recommendation/swiper").then(r => r.data),

		set: (list) => mainServer.put("/recommendation/swiper", list),
	},

};

export default _default;
