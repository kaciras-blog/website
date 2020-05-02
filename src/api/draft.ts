import { AbstractApi } from "./core";
import { getLocation } from "./common";

export default class extends AbstractApi {

	createNew() {
		return this.servers.content.post("/drafts").then(getLocation("/drafts/"));
	}

	fromArticle(article: number) {
		return this.servers.content.post("/drafts", null, {
			params: { article },
		}).then(getLocation("/drafts/"));
	}

	getList(userId: number, start = 0, count = 10) {
		return this.servers.content.get("/drafts", { params: { userId, start, count } }).then(r => r.data);
	}

	get(id: number) {
		return this.servers.content.get(`/drafts/${id}`).then(r => r.data);
	}

	getHistory(id: number, saveCount: number) {
		return this.servers.content.get(`/drafts/${id}/histories/${saveCount}`).then(r => r.data);
	}

	saveNewHistory(id: number, data: any) {
		return this.servers.content.post(`/drafts/${id}/histories`, data);
	}

	save(id: number, saveCount: number, data: any) {
		return this.servers.content.put(`/drafts/${id}/histories/${saveCount}`, data);
	}

	/** 删除一个草稿 */
	remove(id: number) {
		return this.servers.content.delete("/drafts/" + id);
	}

	/** 清空所有草稿 */
	clear() {
		return this.servers.content.delete("/drafts");
	}
}
