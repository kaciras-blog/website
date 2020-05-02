import { AbstractApi } from "./core";
import { normalResponse } from "./common";

interface AccountLoginRequest {
	name: string;
	password: string;
	remember: boolean;
}

interface AccountSignUpRequest {
	name: string;
	password: string;
	email?: string;
	captcha: string;
}

export default class extends AbstractApi {

	/** 用户登录，登录成功后会添加相应的Cookie */
	login(form: AccountLoginRequest) {
		return this.servers.content.post("/accounts/login", form);
	}

	/** 用户注册后自动登录 */
	signUp(data: AccountSignUpRequest) {
		return this.servers.content.post("/accounts", data);
	}

	logout() {
		return this.servers.content.delete("/session/user");
	}

	getCurrent() {
		return this.servers.content.get("/session/user", { validateStatus: normalResponse });
	}

	get(id: number) {
		return this.servers.content.get("/users/" + id);
	}

	updateProfile(profile: object) {
		return this.servers.content.patch("/session/user", profile);
	}
}
