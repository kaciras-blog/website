import { ref, watch } from "vue";
import { onBeforeRouteLeave } from "vue-router";
import { Awaitable, useEventListener, useTimeoutFn } from "@vueuse/core";
import { useDialog } from "@kaciras-blog/uikit";
import { errorMessage } from "@/utils.ts";

type SaveFn = (manual: boolean) => Awaitable<unknown>;

export default function useAutoSave(data: any, save: SaveFn) {
	const dialog = useDialog();

	const changed = ref(false);
	const saveError = ref<Error>();
	const timer = useTimeoutFn(autoSave, 5 * 60 * 1000);

	async function autoSave() {
		watchForAutoSave();
		try {
			await save(false);
			changed.value = false;
			saveError.value = undefined;
		} catch (e) {
			saveError.value = e;
		}
	}

	/**
	 * 监视文本的改变，当改变时开始计时 5 分钟，到点自动保存。
	 */
	function watchForAutoSave() {
		watch(data, timer.start, { deep: true, once: true });
	}

	/**
	 * 手动保存，成功后会停止自动保存计时，并重新监视对象的变更。
	 */
	async function manualSave() {
		try {
			await save(true);
			changed.value = false;
			saveError.value = undefined;

			timer.stop();
			watchForAutoSave();

			dialog.alertSuccess("保存成功");
		} catch (e) {
			dialog.alertError("保存失败，请手动备份", errorMessage(e));
		}
	}

	onBeforeRouteLeave(() => {
		if (!changed.value) {
			return;
		}
		const exit = window.confirm("有未保存的改动，是否退出？");
		if (!exit) {
			return false;
		}
	});

	useEventListener("beforeunload", event => {
		if (changed.value) {
			return event.returnValue = "Sure?";
		}
	});

	watchForAutoSave();
	watch(data, () => changed.value = true, { deep: true });

	return { changed, saveError, manualSave };
}
