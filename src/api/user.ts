import { FetchClient } from "@kaciras/utilities/browser";

export enum AuthType {
	None,
	Local,
	Github,
	Google,
}

export interface AccountLoginRequest {
	name: string;
	password: string;
	remember: boolean;
}

export interface AccountSignUpRequest {
	name: string;
	password: string;
	email?: string;
	captcha: string;
}

export interface UserProfile {
	name: string;
	avatar?: string;
}

export interface User extends UserProfile {
	id: number;
	auth: AuthType;
}

export default class UserEndpoint extends FetchClient {

	/** 用户登录，登录成功后会添加相应的Cookie */
	login(form: AccountLoginRequest) {
		return this.post("/accounts/login", form);
	}

	/** 用户注册后自动登录 */
	signup(data: AccountSignUpRequest) {
		return this.post("/accounts", data);
	}

	logout() {
		return this.delete("/user");
	}

	getCurrent() {
		return this.get("/user").raw;
	}

	updateProfile(profile: UserProfile) {
		return this.patch("/user", profile);
	}

	/**
	 * 生成一个随机的验证码 URL。
	 *
	 * @return {string} 验证码URL
	 */
	captchaAddress() {
		return this.baseURL + "/captcha?r=" + Math.random();
	}
}
