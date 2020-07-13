import { AbstractResource, Pageable } from "./core";

export interface DiscussionTarget {

	/** 被评论对象的类型 */
	type: number;

	/** 被评论对象的ID */
	objectId: number;
}

export interface DiscussionListRequest extends Pageable, DiscussionTarget {
	replySize?: number;
}

export interface DiscussionInput extends DiscussionTarget {

	/** 父评论，如果没有则为0 */
	parent: number;

	/** 评论内容 */
	content: string;

	/** 游客也可以随意填写的昵称 */
	nickname?: string;
}

export enum DiscussionState {

	/** 正常显示 */
	Visible = "Visible",

	/** 已删除 */
	Deleted = "Deleted",

	/** 等待审核 */
	Moderation = "Moderation",
}

export default class DiscussionResource extends AbstractResource {

	add(data: DiscussionInput) {
		return this.servers.content.post("/discussions", data).then(r => r.data);
	}

	getList(query: DiscussionListRequest) {
		const params = { ...query, parent: 0 };
		return this.servers.content.get("/discussions", { params }).then(r => r.data);
	}

	/**
	 * 获取评论的回复（楼中楼）。
	 *
	 * 因为 parent -> id 已经可以确定查询范围，故单独用一个方法省略 objectId & type。
	 *
	 * @param parent 评论id
	 * @param start 起始位置
	 * @param count 每页数量
	 * @return 回复列表
	 */
	getReplies(parent: number, start: number, count: number) {
		const params = { parent, start, count };
		return this.servers.content.get("/discussions", { params }).then(r => r.data);
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
