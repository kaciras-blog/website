import { AbstractResource, Pageable } from "./core";

/*
 * 由于Vue的HTML模板里无法很方便地引用到外部导入的成员，并且后端不是JS写的无法保证枚举的一致，
 * 故使用字符串作为值而不是整数，避免次序改变以及提升模板的可读性。其它 API 里的枚举也是一样。
 */
export enum DeletionState {
	None,
	Alive,
	Deleted,
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

	/** 删除状态过滤，默认 ALIVE */
	deletion?: DeletionState;

	/** 过滤分类，默认为 0 表示全部分类 */
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
