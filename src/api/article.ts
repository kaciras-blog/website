import { EndpointBase } from "./core";
import { Pageable } from "./common";

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
	cover: string;
	summary: string;
	content: string;

	category: number;
	urlTitle: string;
}

export interface Article extends ArticleMeta {
	id: number;

	prev?: any;
	next?: any;
}

interface ArticleListQuery extends Pageable {

	/** 删除状态过滤，默认 ALIVE */
	deletion?: DeletionState;

	/** 过滤分类，默认为 0 表示全部分类 */
	category?: number;

	/** 是否包含下级分类的文章 */
	recursive?: boolean;
}

export interface PublishRequest extends ArticleMeta {
	draftId: number;
	destroy?: boolean;
}

export default class ArticleEndpoint extends EndpointBase {

	getList(params: ArticleListQuery) {
		return this.get("/articles", { start: 0, ...params }).json;
	}

	findById(id: number) {
		return this.get<Article>("/articles/" + id).json;
	}

	publish(data: PublishRequest) {
		return this.post<Article>("/articles", data).json;
	}

	update(id: number, data: any) {
		return this.put<Article>("/articles/" + id, data).json;
	}

	changeDeletion(id: number, deletion: boolean) {
		return this.patch(`/articles/${id}`, { deletion });
	}

	changeCategory(id: number, category: number) {
		return this.patch(`/articles/${id}`, { category });
	}

	getHots() {
		return this.get("/recommendation/articles").json;
	}
}
