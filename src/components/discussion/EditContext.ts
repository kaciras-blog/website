import { ref } from "vue";
import { useDialog, useToast } from "@kaciras-blog/uikit";
import api, { Discussion } from "@/api";
import { errorMessage } from "@/utils";

export interface EditContextProps {
	objectId: number;
	type: number;
	parent?: Discussion;
	onAfterSubmit: (entity: Discussion) => void;
}

export function useDiscussContext(props: EditContextProps) {
	const { objectId, type, parent, onAfterSubmit } = props;
	const key = `DIS:${type}_${objectId}_${parent}`;

	const $dialog = useDialog();
	const $toast = useToast();

	const cached = localStorage.getItem(key) ?? "";
	const content = ref(cached);
	const nickname = ref(localStorage.getItem("nickname"));
	let snapshot = cached;

	/**
	 * 自动保存功能，当年高中试卷作文一行 20 个字，这里也搞个 20 字自动保存
	 */
	function handleInput(e: InputEvent) {
		const { value } = e.target as HTMLInputElement;
		content.value = value;

		if (value.length === 0) {
			localStorage.removeItem(key);
		} else if (value.length - snapshot.length > 20) {
			snapshot = value;
			localStorage.setItem(key, value);
		}
	}

	/**
	 * 提交请求，同时处理名字和草稿等数据。
	 *
	 * @return 表示评论提交过程的 Promise
	 */
	async function submit() {
		const nicknameVal = nickname.value;
		const contentVal = content.value;

		if (/^\s*$/.test(contentVal)) {
			return; // 没写评论就按发表按钮
		}

		// null 会被转换为 "null" 所以要检查一下
		if (nicknameVal) {
			if (nicknameVal.length > 10) {
				return $dialog.alertError("名字最多16个字");
			}
			localStorage.setItem("nickname", nicknameVal);
		}

		try {
			const entity = await api.discuss.add({
				objectId,
				type,
				parent: parent?.id ?? 0,
				content: contentVal,
				nickname: nicknameVal,
			});
			content.value = "";
			localStorage.removeItem(key);
			$toast.success("评论提交成功");
			onAfterSubmit(entity);
		} catch (e) {
			$dialog.alertError("评论失败", errorMessage(e));
			throw e; // 继续抛出传递给 Sentry 和上层
		}
	}

	return { nickname, content, handleInput, submit };
}
