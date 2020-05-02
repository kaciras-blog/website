import { AbstractApi } from "./core";
import { getLocation } from "./common";

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
	recursive?: boolean; // 是否递归子分类
}

interface PublishRequest {
	title: string;
	keywords: string[];
	cover: string;
	summary: string;
	content: string;

	draftId: number;
	category: number;
	urlTitle: string;
	destroy?: boolean;
}

export default class extends AbstractApi {

	get(id: number) {
		return this.servers.content.get("/articles/" + id).then(r => r.data);
	}

	publish(data: PublishRequest) {
		return this.servers.content.post("/articles", data).then(getLocation("/articles/"));
	}

	update(id: number, data: any) {
		return this.servers.content.put("/articles/" + id, data);
	}

	getList(params: ArticleListQuery) {
		params = Object.assign({
			start: 0,
			count: 20,
			deletion: DeletionState.ALIVE,
		}, params);
		return this.servers.content.get("/articles", { params }).then(r => r.data);
	}

	getHots() {
		return this.servers.content.get("/recommendation/articles").then(r => r.data);
	}

	updateDeletion(id: number, deletion: boolean) {
		return this.servers.content.patch(`/articles/${id}`, { deletion });
	}

	changeCategories(id: number, category: number) {
		return this.servers.content.patch(`/articles/${id}`, { category });
	}
}
