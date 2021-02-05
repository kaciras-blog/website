import { Vue } from "vue/types/vue";
import api from "@/api";
import { errorMessage } from "@/utils";

/**
 * 使用该 Mixin 的组件必须具有这些属性。
 * 因为 Vue2 冇得 Portal，弹窗必须在根组件所以没法用Inject。
 */
interface Props {
	objectId: number;
	type: number;
	parent: number;
	afterSubmit: (entity: any) => void;
}

interface MixinData {
	nickname: string;
	key: string;
	content: string;
	snapshot: string;
}

type Instance = Vue & Props & MixinData;

/**
 * 通用的评论处理逻辑，因为有两个评论输入组件（手机和宽屏的）所以提取出来。
 * 由于 Vue2 冇得 Hooks，只能用过时的 Mixin 了。
 */
export default {
	props: ["objectId", "type", "parent", "afterSubmit"],
	data(this: Instance) {
		const key = `DIS_${this.type}_${this.objectId}_${this.parent}`;
		const cached = localStorage.getItem(key) || "";
		const nickname = localStorage.getItem("nickname");
		return { nickname, key, content: cached, snapshot: cached };
	},
	methods: {

		/**
		 * 自动保存功能，当年高中试卷作文一行 20 个字，这里也搞个 20 字自动保存
		 */
		handleInput(this: Instance, e: InputEvent) {
			const { value } = e.target as HTMLInputElement;
			this.content = value;

			if (value.length === 0) {
				localStorage.removeItem(this.key);
			} else if (value.length - this.snapshot.length > 20) {
				this.snapshot = value;
				localStorage.setItem(this.key, value);
			}
		},

		/**
		 * 提交请求，同时处理名字和草稿等数据。
		 *
		 * @return 表示评论提交过程的 Promise
		 */
		async submit(this: Instance) {
			const { type, objectId, parent, key, content, nickname } = this;

			if (/^\s*$/.test(content)) {
				return; // 没写评论就按发表按钮
			}
			if (nickname && nickname.length > 10) {
				return this.$dialog.alertError("评论失败", "名字最多16个字");
			}

			// null 会被转换为 "null" 所以要检查一下
			if (nickname) {
				localStorage.setItem("nickname", nickname);
			}

			try {
				const entity = await api.discuss.add({ objectId, type, parent, content, nickname });
				this.content = "";
				localStorage.removeItem(key);
				this.afterSubmit(entity);
			} catch (e) {
				this.$dialog.alertError("评论失败", errorMessage(e));
				throw e; // 继续抛出传递给 Sentry 和上层
			}
		},
	},
};
