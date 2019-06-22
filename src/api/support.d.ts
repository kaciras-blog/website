import { CancelToken } from "kx-ui/src/cancellation";
import { AxiosInstance } from "axios";

export class BasicApiFactory {
	constructor(axiosSet?: { [key: string]: AxiosInstance })

	withPrototype(proto: any): this;
	withCancelToken(cancelToken: CancelToken): this;

	static registerApi(name: string, clazz: Function): void;
}
