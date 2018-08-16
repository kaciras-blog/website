import Velocity from "velocity-animate";


/**
 * 转义HTML文本中的特殊字符
 *
 * @param text {String} 原始文本
 * @return {String} 转义后的文本
 */
export function escapeHtml(text) {
	const map = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#039;',
	};
	return text.replace(/[&<>"']/g, ch => map[ch]);
}

export function pageReturn () {
	const url = getQueryString("return");
	window.location.href = url ? url : "index";
}

export function scrollToElementStart(element) {
	if(typeof(element) === "string") {
		element = document.getElementById(element);
	}
	Velocity(document.body, {scrollTop: element.offsetTop}, 200);
}

export function scrollToElementEnd(element) {
	if(typeof(element) === "string") {
		element = document.getElementById(element);
	}
	Velocity(document.body, {scrollTop: element.offsetTop + element.clientHeight}, 200);
}

/**
 * 给body元素加上一个标记，指示文档已经渲染完毕。用于通知预渲染服务。
 */
export function markRenderComplete() {
	document.getElementsByTagName("body")[0].setAttribute("data-render-complete", "true")
}

/**
 * 从Axios的错误原因对象中提取错误信息。
 *
 * @param reason {*} 异常
 * @return {string} 错误信息
 */
export function errMsg(reason) {
	const res = reason.response;
	if(res && res.data && res.data.message) {
		return res.data.message;
	}
	return reason.message || "未知的错误";
}

export function extendMarkdownConvert(target) {
	target = $(target);
	hljs.initHighlighting.called = false;
	hljs.initHighlighting();
	$("img", target).wrap($(document.createElement("div")).attr("class", "image-wrapper"));
	$("code", target).not(".hljs").addClass("inline-code");
	if(MathJax) {
		MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
	}
}

/**
 * 获取URL中路径的某一片段
 *
 * @param index {int} 位置，负数表示从后往前查找
 * @return {String} 片段的值，找不到则返回null
 */
export function getUrlPathPart(index) {
	const path = window.location.pathname.split("/");
	if (index < 0 && path.length >= -index) {
		return path[path.length + index]; // index: [-path.length - 1, -1]
	} else if (index >= 0 && path.length > index) {
		return path[index]; // index: [0, path.length - 1]
	}
	return null;
}

/**
 * 获取URL中查询参数的值
 *
 * @param name {String} 参数名
 * @return {String} 参数值
 */
export function getQueryString(name) {
	const urlQueryRegex = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	const r = window.location.search.substr(1).match(urlQueryRegex);
	return r === null ? null : decodeURI(r[2]);
}


/**
 * 弹出文件选择框
 *
 * @param multiple {boolean} 是否多选
 * @param accept {String} 文件类型
 * @return {Promise<File[]>} 一个Promise，将在用户点击确定时完成
 */
export function openFile(multiple = false, accept = "*") {
	const input = document.createElement("input");
	input.setAttribute("type", "file");
	input.setAttribute("accept", accept);
	if (multiple) {
		input.setAttribute("multiple", "");
	}
	const promise = new Promise(resolve => input.addEventListener("change", event => resolve(event.target.files)));
	input.click();
	return promise;
}

/**
 * 使用src对象中的值更新dest对象中相应的字段
 * @param src
 * @param dest
 * @return {*}
 */
export function updateObject(src, dest) {
	for (let k in dest) {
		if (src.hasOwnProperty(k)) dest[k] = src[k];
	}
	return dest;
}

export function deleteOn(array, predicate) {
	for (let i = 0; i < array.length; i++) {
		if (predicate(array[i])) array.splice(i--, 1);
	}
}
