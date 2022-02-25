import { AbstractResource, Pageable } from "./core";
import { getLocation } from "./common";

export interface Draft {
	id: number;
	articleId: number;
	userId: number;
	title: string;
	lastSaveCount: number;
	createTime: number;
	updateTime: number;
}

export interface DraftListQuery extends Pageable {
	userId: number;
}

export interface DraftHistoryInput {
	title: string;
	keywords: string;
	cover: string;
	summary: string;
	content: string;
}

export interface DraftHistory extends DraftHistoryInput {
	time: number;
	saveCount: number;
}

export default class DraftResource extends AbstractResource {

	createNew() {
		return this.servers.content.post<Draft>("/drafts").then(getLocation("/drafts/"));
	}

	fromArticle(article: number) {
		return this.servers.content.post<Draft>("/drafts", null, {
			params: { article },
		}).then(getLocation("/drafts/"));
	}

	getList(params: DraftListQuery) {
		return this.servers.content.get<Draft[]>("/drafts", { params }).then(r => r.data);
	}

	get(id: number) {
		return this.servers.content.get<Draft>(`/drafts/${id}`).then(r => r.data);
	}

	/** 删除一个草稿 */
	remove(id: number) {
		return this.servers.content.delete("/drafts/" + id);
	}

	/** 清空所有草稿 */
	clear() {
		return this.servers.content.delete("/drafts");
	}

	getHistory(id: number, saveCount: number) {
		return this.servers.content.get<DraftHistory>(`/drafts/${id}/histories/${saveCount}`).then(r => r.data);
	}

	saveNewHistory(id: number, data: DraftHistoryInput) {
		return this.servers.content.post(`/drafts/${id}/histories`, data);
	}

	save(id: number, saveCount: number, data: DraftHistoryInput) {
		return this.servers.content.put(`/drafts/${id}/histories/${saveCount}`, data);
	}
}
