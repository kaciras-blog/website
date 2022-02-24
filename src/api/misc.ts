import { openFile } from "@kaciras-blog/uikit";
import { AbstractResource } from "./core";
import { getLocation } from "./common";

type ProgressHandler = (event: ProgressEvent) => void;

export default class extends AbstractResource {

	private upload(path: string, file: Blob, progress?: ProgressHandler) {
		const data = new FormData();
		data.append("file", file);

		// 媒体文件大，需要跟 API 的超时分开
		const config = {
			timeout: Infinity,
			onUploadProgress: progress,
		};
		return this.servers.web.post(path, data, config).then(getLocation());
	}

	/**
	 * 上传图片文件，返回保存的文件的路径。
	 *
	 * @param file 文件数据
	 * @param progress 进度回调
	 */
	uploadImage(file: Blob, progress?: ProgressHandler) {
		return this.upload("/image", file, progress);
	}

	uploadVideo(file: Blob, progress?: ProgressHandler) {
		return this.upload("/video", file, progress);
	}

	uploadAudio(file: Blob, progress?: ProgressHandler) {
		return this.upload("/audio", file, progress);
	}

	/**
	 * openFile 和 uploadImage 的封装方法，弹出文件选择框(只能单选)
	 * 用户选择后上传服务器，并返回用于访问图片的文件名
	 *
	 * @returns 保存的图片文件名
	 */
	async uploadImageFile() {
		return this.uploadImage(await openFile("image/*"));
	}

	async uploadVideoFile() {
		return this.uploadVideo(await openFile("video/*"));
	}

	/**
	 * 生成一个随机的验证码 URL。
	 *
	 * @return {string} 验证码URL
	 */
	captchaAddress() {
		return this.servers.content.defaults.baseURL + "/captcha?r=" + Math.random();
	}
}
