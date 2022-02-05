import { AbstractResource } from "./core";
import { standardRange } from "./common";

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

export default class UserResource extends AbstractResource {

	/** 用户登录，登录成功后会添加相应的Cookie */
	login(form: AccountLoginRequest) {
		return this.servers.content.post("/accounts/login", form);
	}

	/** 用户注册后自动登录 */
	signup(data: AccountSignUpRequest) {
		return this.servers.content.post("/accounts", data);
	}

	logout() {
		return this.servers.content.delete("/user");
	}

	getCurrent() {
		return this.servers.content.get<User>("/user", { validateStatus: standardRange });
	}

	updateProfile(profile: UserProfile) {
		return this.servers.content.patch("/user", profile);
	}
}
