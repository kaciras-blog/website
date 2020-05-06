import { openFile } from "@kaciras-blog/uikit";
import { AbstractResource } from "./core";
import { getLocation } from "./common";

export default class extends AbstractResource {

	/**
	 * 上传图片文件
	 *
	 * @param file 文件
	 * @param progress 进度回调
	 */
	uploadImage(file: File, progress?: (progressEvent: ProgressEvent) => void) {
		const data = new FormData();
		data.append("file", file);
		return this.servers.web.post("/image", data, { onUploadProgress: progress }).then(getLocation());
	}

	/**
	 * openFile 和 uploadImage 的封装方法，弹出文件选择框(只能单选)
	 * 用户选择后上传服务器，并返回用于访问图片的文件名
	 *
	 * @returns 保存的图片文件名
	 */
	async uploadImageFile() {
		return this.uploadImage((await openFile(false, "image/*"))[0]);
	}

	/**
	 * 生成一个验证码URL，该函数返回的不是Promise。
	 *
	 * @return {string} 验证码URL
	 */
	newCaptchaAddress() {
		return this.servers.content.defaults.baseURL + "/captcha?r=" + Math.random();
	}
}
