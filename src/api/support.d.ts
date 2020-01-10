import { CancellationToken } from "@kaciras-blog/uikit/src/cancellation";
import { AxiosInstance } from "axios";

export class BasicApiFactory {
	constructor(axiosSet?: { [key: string]: AxiosInstance })

	withPrototype(proto: any): this;
	withCancelToken(token: CancellationToken): this;

	static registerApi(name: string, clazz: Function): void;
}
