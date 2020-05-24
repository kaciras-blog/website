/**
 * 转义HTML文本中的特殊字符
 *
 * @param text 原始文本
 * @return 转义后的文本
 */
export function escapeHtml(text: string) {
	const map = {
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		"\"": "&quot;",
		"'": "&#039;",
	};
	// @ts-ignore 正则提取的 ch 一定是 map 的 key
	return text.replace(/[&<>"']/g, (ch) => map[ch]);
}

/**
 * 从Axios的错误原因对象中提取错误信息。
 *
 * @param object 异常
 * @return 错误信息
 */
export function errorMessage(object: any) {
	const res = object.response;
	if (res?.data?.message) {
		return res.data.message;
	}
	return object.message || "未知的错误";
}


/**
 * 删除并返回数组中符合条件的元素，使用splice()函数删除能够触发Vue的更新。
 *
 * @param array 数组
 * @param predicate 判断函数
 * @return 被删除的元素
 */
export function deleteOn<T>(array: T[], predicate: (value: T) => boolean) {
	const removed = [];
	for (let i = array.length - 1; i >= 0; i--) {
		if (predicate(array[i])) {
			removed.push(array.splice(i, 1)[0]);
		}
	}
	return removed;
}

/**
 * 使用src对象中的值更新dest对象中相应的字段，该方法与
 * Object.assign不同之处在于不会在目标对象中添加新字段，仅复制
 * 目标对象已存在的字段。
 *
 * @param src 源对象
 * @param dist 目标对象
 * @return 目标对象
 */
export function assignUpdate(src: any, dist: any) {
	Object.keys(dist).forEach(k => dist[k] = src[k]);
	return dist;
}

/**
 * 给对象附加一个随机的 id 字段，作为列表渲染时的 key。
 * 该方法可以对一个对象重复调用，其 id 字段在生成后不会改变。
 *
 * @param object 对象
 * @return 返回输入的对象
 */
export function attachRandomId(object: any) {
	object.id = object.id || Math.random();
	return object;
}

/**
 * 获取图片的尺寸，该函数基于 HTMLImageElement 只能在浏览器端使用。
 *
 * @param image 图片文件或URL
 * @return 尺寸 { width, height }，单位像素
 */
export function getImageSize(image: string | Blob) {
	type Size = { width: number, height: number };

	const el = document.createElement("img");

	const promise = new Promise<Size>((resolve, reject) => {
		el.onerror = reject;
		el.onload = () => resolve({ width: el.width, height: el.height });
	});

	if (typeof image === "string") {
		el.src = image;
		return promise;
	} else {
		el.src = URL.createObjectURL(image);
		return promise.finally(() => URL.revokeObjectURL(el.src));
	}
}
