import { APIService } from "./core";
import { Pageable } from "./common";

export interface Draft {
	id: number;
	articleId?: number;
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
	cover?: string;
	summary: string;
	content: string;
}

export interface DraftHistory extends DraftHistoryInput {
	time: number;
	saveCount: number;
}

const initial: DraftHistoryInput = {
	title: "新文章",
	summary: "",
	content: "",
	keywords: "",
};

export default class DraftEndpoint extends APIService {

	createNew() {
		return this.post<Draft>("/drafts", initial).data;
	}

	fromArticle(article: number) {
		return this.post<Draft>("/drafts", null, { article }).data;
	}

	getList(params: DraftListQuery) {
		return this.get<Draft[]>("/drafts", params).data;
	}

	findById(id: number) {
		return this.get<Draft>(`/drafts/${id}`).data;
	}

	/** 删除一个草稿 */
	remove(id: number) {
		return this.delete("/drafts/" + id);
	}

	/** 清空所有草稿 */
	clear() {
		return this.delete("/drafts");
	}

	getHistory(id: number, saveCount: number) {
		return this.get<DraftHistory>(`/drafts/${id}/histories/${saveCount}`).data;
	}

	saveNewHistory(id: number, data: DraftHistoryInput) {
		return this.post(`/drafts/${id}/histories`, data);
	}

	save(id: number, saveCount: number, data: DraftHistoryInput) {
		return this.put(`/drafts/${id}/histories/${saveCount}`, data);
	}
}
