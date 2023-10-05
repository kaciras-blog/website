import { useDialog } from "@kaciras-blog/uikit";
import { selectFile } from "@kaciras/utilities/browser";
import { AddonContext } from "@kaciras-blog/markdown-vue";
import api from "@/api/index.ts";
import { basename } from "@/utils.ts";
import UploadImageDialog from "./UploadImageDialog.vue";
import VideoVideoDialog from "./UploadVideoDialog.vue";

interface ImageUploadResult {
	vw: number;
	vh: number;
	name: string;
	url: string;
}

export interface VideoStatement {
	src: string;
	vw: number;
	vh: number;
	isVideo: boolean;
	poster: string;
	label: string;
}

export default function useMediaUploader() {
	const dialog = useDialog();

	return {
		async video(ctx: AddonContext, initFiles: File[] = []) {
			const result = await dialog
				.show<VideoStatement>(VideoVideoDialog, { initFiles });

			if (!result.isConfirm) {
				return;
			}
			const { src, vw, vh, label, poster, isVideo } = result.data;
			const text = isVideo
				? `@video[${poster}](${src})`
				: `@gif[${label}](${src}?vw=${vw}&vh=${vh})`;

			ctx.insertText(text, true);
		},

		async audio(ctx: AddonContext, file?: File) {
			file ??= (await selectFile("audio/*"))[0];
			const res = await api.media.uploadAudio(file);
			ctx.insertText(`@audio[](${res})`, true);
		},

		async image(ctx: AddonContext, initFile?: File) {
			const result = await dialog
				.show<ImageUploadResult>(UploadImageDialog, { initFile });

			if (!result.isConfirm) {
				return;
			}
			const { vw, vh, name, url } = result.data;

			// 加上宽高便于确定占位图的尺寸，从 https://chanshiyu.com/#/post/41 学的。
			ctx.insertText(`![${basename(name)}](${url}?vw=${vw}&vh=${vh})`, false);
		},
	};
}
