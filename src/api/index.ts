import { openFile } from "@kaciras-blog/uikit";
import { BASE_URL, BasicApiFactory } from "./support";
import { AxiosInstance, AxiosResponse } from "axios";


/**
 * 服务器正常回复，而不是出现5xx状态码。
 * 加入到Axios的请求选项中：Config.validateStatus。
 *
 * @param status 状态码
 * @return 是否算作正常回复
 */
function NormalResponse(status: number) {
	return status >= 0 && status < 500;
}

/**
 * 从响应的 Location 头重截取一部分
 *
 * @param prefix 跳过的前缀
 * @return 截取的函数
 */
function extractLocation(prefix: string) {
	return (response: AxiosResponse) => response.headers.location.substring(prefix.length);
}

class AbstractApi {

	protected readonly webServer: AxiosInstance;
	protected readonly mainServer: AxiosInstance;

	constructor(axiosSet: any) {
		this.webServer = axiosSet.webServer;
		this.mainServer = axiosSet.mainServer;
	}
}

export enum DeletionState {
	ALIVE = "ALIVE",
	DELETED = "DELETED",
	ALL = "ALL",
}

interface ArticleListQuery {
	start: number;
	count: number;
	category?: number;
	deletion?: DeletionState; // 删除状态
	recursive?: boolean; //是否递归子分类
}

class ArticleApi extends AbstractApi {

	get(id: number) {
		return this.mainServer.get("/articles/" + id).then(r => r.data);
	}

	publish(data: any) {
		return this.mainServer.post("/articles", data).then(extractLocation("/articles/"));
	}

	update(id: number, data: any) {
		return this.mainServer.put("/articles/" + id, data).then(extractLocation("/articles/"));
	}

	getList(params: ArticleListQuery) {
		params = Object.assign({
			start: 0,
			count: 20,
			deletion: DeletionState.ALIVE,
		}, params);
		return this.mainServer.get("/articles", { params }).then(r => r.data);
	}

	getHots() {
		return this.mainServer.get("/recommendation/articles").then(r => r.data);
	}

	updateDeletion(id: number, deletion: boolean) {
		return this.mainServer.patch(`/articles/${id}`, { deletion });
	}

	changeCategories(id: number, category: number) {
		return this.mainServer.patch(`/articles/${id}`, { category });
	}
}

class CategoryApi extends AbstractApi {

	getChildren(id: number) {
		return this.mainServer.get(`/categories/${id}/children`).then(r => r.data);
	}

	remove(id: number, treeMode: boolean) {
		return this.mainServer.delete("/categories/" + id, { params: { tree: treeMode } });
	}

	get(id: number, aggregate?: boolean) {
		return this.mainServer.get("/categories/" + id, { params: { aggregate } }).then(r => r.data);
	}

	move(id: number, parent: number, treeMode: boolean) {
		return this.mainServer.post("/categories/transfer", { params: { id, parent, treeMode } });
	}

	create(data: any, parent: number) {
		return this.mainServer.post("/categories/", data, { params: { parent } });
	}

	update(id: number, data: any) {
		return this.mainServer.put("/categories/" + id, data);
	}
}

export enum DiscussionState {
	Visible = "Visible", // 正常显示
	Deleted = "Deleted", // 已删除
	Moderation = "Moderation", // 等待审核
}

class DiscussApi extends AbstractApi {

	/**
	 * 添加评论，返回服务端保存的对象。
	 *
	 * @param objectId 被评论对象的ID
	 * @param type 被评论对象的类型
	 * @param parent 父评论，如果没有则填0
	 * @param content 评论内容
	 */
	add(objectId: number, type: number, parent: number, content: string) {
		return this.mainServer.post("/discussions", { objectId, type, parent, content }).then(r => r.data);
	}

	getList(objectId: number, type: number, start: number, count: number, sort?: string) {
		const params = { objectId, type, parent: 0, start, count, sort };
		return this.mainServer.get("/discussions", { params }).then(r => r.data);
	}

	/**
	 * 获取评论的回复（楼中楼）
	 *
	 * @param parent 评论id
	 * @param start 起始位置
	 * @param count 每页数量
	 * @return 回复列表
	 */
	getReplies(parent: number, start: number, count: number) {
		return this.mainServer.get("/discussions", { params: { parent, start, count } }).then(r => r.data);
	}

	getModeration() {
		const config = { params: { state: "Moderation", linked: true } };
		return this.mainServer.get("/discussions", config).then(r => r.data);
	}

	/**
	 * 批量更新评论的状态（待审、删除、正常）
	 * 该API目前仅能由管理者使用，不支持用户删除自己的评论，因为匿名评论无法确定用户身份。
	 *
	 * @param ids 评论ID或ID数组
	 * @param state 目标状态
	 */
	updateStates(ids: number[], state: DiscussionState) {
		ids = Array.isArray(ids) ? ids : [ids];
		this.mainServer.patch("/discussions", { ids, state });
	}

	voteUp(id: number) {
		return this.mainServer.post(`/discussions/${id}/votes`);
	}

	revokeVote(id: number) {
		return this.mainServer.delete(`/discussions/${id}/votes`);
	}
}

class DraftApi extends AbstractApi {

	createNew() {
		return this.mainServer.post("/drafts").then(extractLocation("/drafts/"));
	}

	fromArticle(article: number) {
		return this.mainServer.post("/drafts", null, {
			params: { article },
		}).then(extractLocation("/drafts/"));
	}

	getList(userId: number, start = 0, count = 10) {
		return this.mainServer.get("/drafts", { params: { userId, start, count } }).then(r => r.data);
	}

	get(id: number) {
		return this.mainServer.get(`/drafts/${id}`).then(r => r.data);
	}

	getHistory(id: number, saveCount: number) {
		return this.mainServer.get(`/drafts/${id}/histories/${saveCount}`).then(r => r.data);
	}

	saveNewHistory(id: number, data: any) {
		return this.mainServer.post(`/drafts/${id}/histories`, data);
	}

	save(id: number, saveCount: number, data: any) {
		return this.mainServer.put(`/drafts/${id}/histories/${saveCount}`, data);
	}

	/** 删除一个草稿 */
	remove(id: number) {
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
	uploadImage(file: File, progress?: (progressEvent: any) => void) {
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
		const files = await openFile(false, "image/*");
		return await this.uploadImage(files[0]);
	}

	// noinspection JSMethodCanBeStatic
	/**
	 * 生成一个验证码URL，该函数返回的不是Promise。
	 *
	 * @return {string} 验证码URL
	 */
	newCaptchaAddress() {
		return BASE_URL + "/captcha?r=" + Math.random();
	}
}

interface AccountLoginRequest {
	name: string;
	password: string;
	remember: boolean;
}

interface AccountSignUpRequest {
	name: string;
	password: string;
	email?: string;
	captcha: string;
}

class UserApi extends AbstractApi {

	/** 用户登录，登录成功后会添加相应的Cookie */
	login(form: AccountLoginRequest) {
		return this.mainServer.post("/accounts/login", form);
	}

	/** 用户注册后自动登录 */
	signUp(data: AccountSignUpRequest) {
		return this.mainServer.post("/accounts", data);
	}

	logout() {
		return this.mainServer.delete("/session/user");
	}

	getCurrent() {
		return this.mainServer.get("/session/user", { validateStatus: NormalResponse });
	}

	get(id: number) {
		return this.mainServer.get("/users/" + id);
	}

	updateProfile(profile: object) {
		return this.mainServer.patch("/session/user", profile);
	}
}


class RecommendApi extends AbstractApi {

	getCards() {
		return this.mainServer.get("/recommendation/cards").then(r => r.data);
	}

	setCards(cards: any[]) {
		return this.mainServer.put("/recommendation/cards", cards);
	}
}

class ConfigApi extends AbstractApi {

	get(namespace: string) {
		return this.mainServer.get(`config/${namespace}`).then(r => r.data);
	}

	set(namespace: string, properties: object) {
		return this.mainServer.patch(`config/${namespace}`, properties);
	}
}

interface FriendLink {
	name: string;
	url: string;
	favicon: string;
}

class FriendApi extends AbstractApi {

	getFriends() {
		return this.mainServer.get("/friends").then(r => r.data);
	}

	makeFriends(link: FriendLink){
		return this.mainServer.post("/friends", link).then(r => r.data);
	}

	rupture(link: FriendLink) {
		const host = new URL(link.url).hostname;
		return this.mainServer.delete("/friends/" + host);
	}
}

BasicApiFactory.registerApi("article", ArticleApi);
BasicApiFactory.registerApi("draft", DraftApi);
BasicApiFactory.registerApi("category", CategoryApi);
BasicApiFactory.registerApi("discuss", DiscussApi);
BasicApiFactory.registerApi("friend", FriendApi);
BasicApiFactory.registerApi("user", UserApi);
BasicApiFactory.registerApi("config", ConfigApi);
BasicApiFactory.registerApi("recommend", RecommendApi);
BasicApiFactory.registerApi("misc", MiscApi);

// 为了让IDE能够提示
interface ApiSet extends BasicApiFactory {
	article: ArticleApi;
	draft: DraftApi;
	category: CategoryApi;
	discuss: DiscussApi;
	friend: FriendApi;
	user: UserApi;
	config: ConfigApi;
	recommend: RecommendApi;
	misc: MiscApi;
}

export default new BasicApiFactory() as ApiSet;
