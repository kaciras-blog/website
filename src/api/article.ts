import { AbstractResource, Pageable } from "./core";

export enum DeletionState {
	ALIVE = "ALIVE",
	DELETED = "DELETED",
	ALL = "ALL",
}

interface ArticleMeta {
	title: string;
	keywords: string[];
	cover: string;
	summary: string;
	content: string;

	category: number;
	urlTitle: string;
}

export interface Article extends ArticleMeta {
	id: number;
}

interface ArticleListQuery extends Pageable {

	/** 删除状态过滤 */
	deletion?: DeletionState;

	/** 过滤分类 */
	category?: number;

	/** 是否包含下级分类的文章 */
	recursive?: boolean;
}

interface PublishRequest extends ArticleMeta {
	draftId: number;
	destroy?: boolean;
}

export default class ArticleResource extends AbstractResource {

	get(id: number) {
		return this.servers.content.get("/articles/" + id).then(r => r.data);
	}

	publish(data: PublishRequest) {
		return this.servers.content.post<Article>("/articles", data).then(r => r.data);
	}

	update(id: number, data: any) {
		return this.servers.content.put<Article>("/articles/" + id, data).then(r => r.data);
	}

	getList(params: ArticleListQuery) {
		params = Object.assign({ start: 0, count: 20, }, params);
		return this.servers.content.get("/articles", { params }).then(r => r.data);
	}

	changeDeletion(id: number, deletion: boolean) {
		return this.servers.content.patch(`/articles/${id}`, { deletion });
	}

	changeCategory(id: number, category: number) {
		return this.servers.content.patch(`/articles/${id}`, { category });
	}

	getHots() {
		return this.servers.content.get("/recommendation/articles").then(r => r.data);
	}
}
