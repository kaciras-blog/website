import { ref } from "vue";
import { useLocalStorage } from "@vueuse/core";
import { useDialog, useToast } from "@kaciras-blog/uikit";
import api, { Discussion } from "@/api";
import { USERNAME_LENGTH } from "@/common";
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
	const email = useLocalStorage("email", "");
	const nickname = useLocalStorage("nickname", "");

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
	async function submit(signal?: AbortSignal) {
		if (/^\s*$/.test(content.value)) {
			return; // 没写评论就按发表按钮
		}

		if (nickname.value.length > USERNAME_LENGTH) {
			return $dialog.alertError(`名字最多 ${USERNAME_LENGTH} 个字`);
		}

		try {
			const entity = await api
				.configure({ signal })
				.discuss.add({
					objectId,
					type,
					parent: parent?.id ?? 0,
					content: content.value,

					// 这几个不能为空字符串。
					email: email.value || null,
					nickname: nickname.value || null,
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

	return { nickname, email, content, handleInput, submit };
}
