import { AbstractResource } from "./core";

export enum CategoryTheme {
	Default = 0, Light = 1, Dark = 2,
}

export interface CategoryMeta {
	name: string;
	cover: string;
	description: string;
	background: string;
	theme: CategoryTheme;
}

export interface Category extends CategoryMeta{
	id: number;
}

export default class CategoryResource extends AbstractResource {

	getChildren(id: number) {
		return this.servers.content.get(`/categories/${id}/children`).then(r => r.data);
	}

	remove(id: number, treeMode: boolean) {
		return this.servers.content.delete(`/categories/${id}`, { params: { tree: treeMode } });
	}

	get(id: number, aggregate?: boolean) {
		return this.servers.content.get(`/categories/${id}`, { params: { aggregate } }).then(r => r.data);
	}

	move(id: number, parent: number, treeMode: boolean) {
		return this.servers.content.post("/categories/transfer", { id, parent, treeMode });
	}

	create(data: Category, parent: number) {
		return this.servers.content.post("/categories/", data, { params: { parent } });
	}

	update(id: number, data: any) {
		return this.servers.content.put(`/categories/${id}`, data);
	}
}
