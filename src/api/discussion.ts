import { EndpointBase } from "./core";
import { User } from "./user";
import { ListQueryView, Pageable } from "./common";

export interface TopicKey {

	/** 被评论对象的类型 */
	type: number;

	/** 被评论对象的 ID */
	objectId: number;
}

export interface Topic {
	url: string;
	name: string;
}

export enum DiscussionState {

	/** 正常显示 */
	Visible,

	/** 已删除 */
	Deleted,

	/** 等待审核 */
	Moderation,
}

export interface Discussion extends TopicKey {
	id: number;

	parent?: Discussion;
	floor: number;

	nestId: number;
	nestFloor: number;
	nestSize: number;

	user: User;
	nickname?: string;
	content: string;
	time: number;
	state: DiscussionState;

	topic?: Topic;
	replies?: Discussion[];
}

export interface DiscussionQuery extends Pageable, Partial<TopicKey> {
	nestId?: number;
	state?: DiscussionState;

	includeTopic?: boolean;
	childCount?: number;
	includeParent?: boolean;
}

export interface DiscussionInput extends TopicKey {

	/** 父评论，没有为0 */
	parent: number;

	/** 评论内容 */
	content: string;

	/** 可以随意填写的昵称，不能为空字符串 */
	nickname?: string | null;
}

/**
 * 后端返回的数据是 ID 与实体分离的，其中一些字段是整数型 ID。
 */
interface RawObjectOverride {
	parent: number;
	replies?: number[];
}

type RawObject = Omit<Discussion, keyof RawObjectOverride> & RawObjectOverride;

/**
 * 后端返回的列表查询结果，使用 assembly() 来重组为 ListQueryView<Discussion>。
 */
interface MappingListView extends ListQueryView<number> {
	objects: { [id: string]: RawObject };
}

/**
 * 重组后端的数据，把 items 以及必要的 replies、parent 从 ID 替换为评论对象。
 *
 * 【重复性论证】
 * 从下到上的引用模式中只有子节点需要转换，而子节点是不会重复的。
 * 从上到下的树和楼中楼模式中也是转换子节点而不会返回上级，不存在一个对象被重复修改。
 * 所以这里无需复制直接修改原对象即可。
 *
 * @param mappingView 原始数据
 * @return 重组后的数据
 */
function assembly(mappingView: MappingListView) {
	const { total, objects } = mappingView;

	function toObject(id: number) {
		const raw = objects[id.toString()];
		const value = raw as unknown as Discussion;
		const { parent, replies } = raw;

		//
		value.parent = objects[parent.toString()] as unknown as Discussion;
		value.replies = replies?.map(toObject);
		return value;
	}

	const items = mappingView.items.map(toObject);

	return { total, items } as ListQueryView<Discussion>;
}

export default class DiscussionEndpoint extends EndpointBase {

	add(data: DiscussionInput) {
		return this.post<Discussion>("/discussions", data).data;
	}

	getList(params: DiscussionQuery) {
		return this.get<MappingListView>("/discussions", params).data.then(assembly);
	}

	/**
	 * 获取评论的回复（楼中楼）。
	 *
	 * 因为 parent -> id 已经可以确定查询范围，故单独用一个方法省略 objectId & type。
	 *
	 * @param nestId 评论id
	 * @param start 起始位置
	 * @param count 每页数量
	 * @return 回复列表
	 */
	getReplies(nestId: number, start: number, count: number) {
		const params = { nestId, start, count };
		return this.get<MappingListView>("/discussions", params).data.then(assembly);
	}

	/**
	 * 批量更新评论的状态（待审、删除、正常）
	 * 该 API 目前仅能由管理者使用，不支持用户删除自己的评论，因为匿名评论无法确定用户身份。
	 *
	 * @param ids 评论ID或ID数组
	 * @param state 目标状态
	 */
	updateStates(ids: number | number[] | Set<number>, state: DiscussionState) {
		if (typeof ids === "number") {
			ids = [ids];
		} else if (!Array.isArray(ids)) {
			ids = Array.from(ids);
		}
		return this.patch("/discussions", { ids, state });
	}
}
