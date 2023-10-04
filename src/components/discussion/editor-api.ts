import { ref, watch } from "vue";
import { useLocalStorage } from "@vueuse/core";
import { useDialog, useToast } from "@kaciras-blog/uikit";
import api, { Discussion, TopicKey } from "@/api/index.ts";
import { errorMessage } from "@/utils.ts";
import { USERNAME_LENGTH } from "@/common.ts";

export interface DiscussEditProps extends TopicKey {
	parent?: Discussion;
	onSubmitted: (entity: Discussion) => void;
}

interface Options extends TopicKey {
	parent?: Discussion | number;
	onSubmitted?: (entity: Discussion) => void;
}

export function useDiscussContext(options: Options) {
	const { objectId, type, onSubmitted } = options;
	const parent = typeof options.parent === "number"
		? options.parent
		: options.parent?.id ?? 0;

	const key = `DIS:${type},${objectId},${parent}`;
	let snapshot = localStorage.getItem(key) ?? "";

	const dialog = useDialog();
	const toast = useToast();

	const content = ref(snapshot);
	const email = useLocalStorage("email", "");
	const nickname = useLocalStorage("nickname", "");

	// 自动保存功能，当年高中试卷作文一行 20 个字，这里也搞个 20 字自动保存
	watch(content, value => {
		if (value.length === 0) {
			return localStorage.removeItem(key);
		}
		const changed = value.length - snapshot.length;
		if (Math.abs(changed) > 20) {
			snapshot = value;
			localStorage.setItem(key, value);
		}
	});

	async function submit(signal?: AbortSignal) {
		if (/^\s*$/.test(content.value)) {
			return; // 没写评论就按发表按钮。
		}

		if (nickname.value.length > USERNAME_LENGTH) {
			dialog.alertError(`名字最多 ${USERNAME_LENGTH} 个字`);
			return;
		}

		return api.configure({ signal })
			.discuss.add({
				objectId,
				type,
				parent,
				content: content.value,

				// 这几个不能为空字符串。
				email: email.value || null,
				nickname: nickname.value || null,
			});
	}

	/**
	 * 提交请求，成功就返回新的评论对象，失败抛出异常，无效则返回 undefined。
	 */
	async function submitSimple(signal?: AbortSignal) {
		try {
			const discussion = await submit(signal);
			if (discussion) {
				content.value = "";
				toast.success("评论提交成功");
				onSubmitted?.(discussion);
			}
			return discussion;
		} catch (e) {
			dialog.alertError("评论失败", errorMessage(e));
			throw e; // 继续抛出传递给 Sentry 和上层。
		}
	}

	return { nickname, email, content, submit, submitSimple };
}
