import { FetchClient } from "@kaciras/utilities/browser";
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

export default class DraftEndpoint extends FetchClient {

	createNew() {
		return this.post("/drafts", initial).json<Draft>();
	}

	fromArticle(article: number) {
		return this.post("/drafts", null, { article }).json<Draft>();
	}

	getList(params: DraftListQuery) {
		return this.get("/drafts", params).json<Draft>();
	}

	findById(id: number) {
		return this.get(`/drafts/${id}`).json<Draft>();
	}

	/** 删除一个草稿 */
	remove(id: number) {
		return this.delete(`/drafts/${id}`);
	}

	/** 清空所有草稿 */
	clear() {
		return this.delete("/drafts");
	}

	getHistory(id: number, saveCount: number) {
		return this.get(`/drafts/${id}/histories/${saveCount}`).json<Draft>();
	}

	saveNewHistory(id: number, data: DraftHistoryInput) {
		return this.post(`/drafts/${id}/histories`, data);
	}

	save(id: number, saveCount: number, data: DraftHistoryInput) {
		return this.put(`/drafts/${id}/histories/${saveCount}`, data);
	}
}
