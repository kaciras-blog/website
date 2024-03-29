import { FetchClient, selectFile } from "@kaciras/utilities/browser";

export interface VariantSaveParams {
	codec?: string;
	variant?: string;
}

export default class MediaEndpoint extends FetchClient {

	private upload(path: string, file: Blob, params?: any) {
		const data = new FormData();
		data.append("file", file);

		return this.post(path, data, params).location;
	}

	/**
	 * 上传图片文件，返回保存的文件的路径。
	 *
	 * @param file 文件数据
	 * @param crop 裁剪参数
	 */
	uploadImage(file: Blob, crop?: any) {
		let params: any;
		if (crop) {
			params = {
				crop: `${crop.top}-${crop.left}-${crop.width}-${crop.height}`,
				rotate: crop.rotate,
			};
			// 后端是先旋转后翻转，跟前端相反，要额外处理下。
			if (crop.rotate % 180 !== 0) {
				[crop.flipX, crop.flipY] = [crop.flipY, crop.flipX];
			}
			if (crop.flipX) {
				params.flip ??= "" + "X";
			}
			if (crop.flipY) {
				params.flip ??= "" + "Y";
			}
		}
		return this.upload("/image", file, params);
	}

	uploadVideo(file: Blob, params?: VariantSaveParams) {
		return this.upload("/video", file, params);
	}

	uploadAudio(file: Blob, params?: any) {
		return this.upload("/audio", file, params);
	}

	/**
	 * openFile 和 uploadImage 的封装方法，弹出文件选择框(只能单选)
	 * 用户选择后上传服务器，并返回用于访问图片的文件名
	 *
	 * @returns 保存的图片文件名
	 */
	async uploadImageFile() {
		return this.uploadImage((await selectFile("image/*"))[0]);
	}

	async uploadVideoFile() {
		return this.uploadVideo((await selectFile("video/*"))[0]);
	}
}
