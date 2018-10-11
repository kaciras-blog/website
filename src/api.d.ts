import { CancelToken } from "axios";

interface ConfigurableApi<T> {

	withPrototype(proto: any): T;

	withCancelToken(cancelToken: CancelToken): T;
}

interface ArticleApi extends ConfigurableApi<ArticleApi> {

	get(id: number): object;
}

export default interface Api {

	article2: ArticleApi;
}
