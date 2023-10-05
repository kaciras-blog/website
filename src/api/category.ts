import { FetchClient } from "@kaciras/utilities/browser";

export enum CategoryTheme {
	Default = 0, Light = 1, Dark = 2,
}

export interface CategoryContent {
	name: string;
	cover: string;
	description: string;
	background: string;
	banner: {
		image: string;
		theme: CategoryTheme;
	};
	theme: CategoryTheme;
}

export interface Category extends CategoryContent {
	id: number;
	parent: number;
}

export default class CategoryEndpoint extends FetchClient {

	getChildren(id: number) {
		return this.get(`/categories/${id}/children`).json<Category[]>();
	}

	findById(id: number, aggregate?: boolean) {
		return this.get(`/categories/${id}`, { aggregate }).json<Category>();
	}

	move(id: number, parent: number, treeMode: boolean) {
		return this.post("/categories/transfer", { id, parent, treeMode });
	}

	create(data: Category, parent: number) {
		return this.post("/categories/", data, { parent });
	}

	update(id: number, data: any) {
		return this.put(`/categories/${id}`, data);
	}

	remove(id: number, tree: boolean) {
		return this.delete(`/categories/${id}`, { tree });
	}
}
