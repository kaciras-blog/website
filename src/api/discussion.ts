import { AbstractApi } from "./core";

export interface DiscussionListRequest {
	objectId: number;
	type: number;

	start: number;
	count: number;
	sort?: string;

	replySize?: number;
}

export enum DiscussionState {
	Visible = "Visible", // 正常显示
	Deleted = "Deleted", // 已删除
	Moderation = "Moderation", // 等待审核
}

export default class extends AbstractApi {

	/**
	 * 添加评论，返回服务端保存的对象。
	 *
	 * @param objectId 被评论对象的ID
	 * @param type 被评论对象的类型
	 * @param parent 父评论，如果没有则填0
	 * @param content 评论内容
	 */
	add(objectId: number, type: number, parent: number, content: string) {
		return this.servers.content.post("/discussions", { objectId, type, parent, content }).then(r => r.data);
	}

	getList(query: DiscussionListRequest) {
		const params = { ...query, parent: 0 };
		return this.servers.content.get("/discussions", { params }).then(r => r.data);
	}

	/**
	 * 获取评论的回复（楼中楼）
	 *
	 * @param parent 评论id
	 * @param start 起始位置
	 * @param count 每页数量
	 * @return 回复列表
	 */
	getReplies(parent: number, start: number, count: number) {
		return this.servers.content.get("/discussions", {
			params: { parent, start, count }
		}).then(r => r.data);
	}

	getModeration() {
		const config = { params: { state: "Moderation", linked: true } };
		return this.servers.content.get("/discussions", config).then(r => r.data);
	}

	/**
	 * 批量更新评论的状态（待审、删除、正常）
	 * 该API目前仅能由管理者使用，不支持用户删除自己的评论，因为匿名评论无法确定用户身份。
	 *
	 * @param ids 评论ID或ID数组
	 * @param state 目标状态
	 */
	updateStates(ids: number | number[], state: DiscussionState) {
		ids = Array.isArray(ids) ? ids : [ids];
		return this.servers.content.patch("/discussions", { ids, state });
	}

	voteUp(id: number) {
		return this.servers.content.post(`/discussions/${id}/votes`);
	}

	revokeVote(id: number) {
		return this.servers.content.delete(`/discussions/${id}/votes`);
	}
}
