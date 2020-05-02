import { AbstractApi } from "./core";

export default class CategoryApi extends AbstractApi {

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
		return this.servers.content.post("/categories/transfer", { params: { id, parent, treeMode } });
	}

	create(data: any, parent: number) {
		return this.servers.content.post("/categories/", data, { params: { parent } });
	}

	update(id: number, data: any) {
		return this.servers.content.put(`/categories/${id}`, data);
	}
}
