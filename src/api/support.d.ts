import { CancelToken } from "kx-ui";

export class BasicApiFactory {
	withPrototype(proto: any): this;
	withCancelToken(cancelToken: CancelToken): this;
}
