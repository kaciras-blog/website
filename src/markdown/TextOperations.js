
/**
 * 获取选择的起止位置。
 * @param extend bool 是否扩展到整行
 * @return [start: Number , end: Number]
 */
function getSelectedRange(extend) {
	const area = this.$refs.textarea;
	let s = area.selectionStart;
	let e = area.selectionEnd;

	if (extend) {
		if (s > 0) {
			s = area.value.lastIndexOf("\n", s - 1) + 1;
		}
		e = area.value.indexOf("\n", e);
		if (e === -1) e = area.value.length;
	}
	return [s, e];
}

function reselect(start, end) {
	const area = this.$refs.textarea;
	this.$nextTick(() => {
		area.selectionEnd = end;
		area.selectionStart = start;
		area.focus();
	});
}

function changeTextArea(start, end, text) {
	const v = this.content;
	this.content = v.substring(0, start) + text + v.substring(end, v.length);
}

/**
 * 浏览器默认的tab键用于切换选择的元素。
 * 在文本框上监听@keydown.9.prevent="inputTab"，使其能够输入tab字符。
 */
function inputTab() {
	const [selStart, selEnd] = getSelectedRange.apply(this, [false]);
	const v = this.content.substring(selStart, selEnd);
	const selen = selStart + 1 - v.length;
	changeTextArea.apply(this, [selStart, selEnd, "\t"]);
	reselect.call(this, selen, selen);
}

function addHeader(level) {
	const prefix = new Array(level + 1).join("#") + " ";
	addPrefixToLines.call(this, prefix);
}

function switchWrapper(prefix, suffix) {
	const v = this.content;
	const [selStart, selEnd] = getSelectedRange.apply(this, [false]);
	const totalLength = prefix.length + suffix.length;

	let text = v.substring(selStart, selEnd);
	let end;
	if (text.startsWith(prefix) && text.endsWith(suffix)) {
		end = selEnd - totalLength;
		text = text.substring(prefix.length, text.length - suffix.length);
	} else {
		end = selEnd + totalLength;
		text = prefix + text + suffix;
	}

	changeTextArea.call(this, selStart, selEnd, text);
	reselect.call(this, selStart, end);
}

function addNewLine(text) {
	const v = this.content;
	const index = getSelectedRange.call(this, false)[0];

	if (index > 0 && v.charAt(index - 1) !== "\n") {
		text = "\n" + text;
	}
	if (index < v.length && v.charAt(index) !== "\n") {
		text += "\n";
	}

	const nIndex = index + text.length;
	changeTextArea.call(this, index, index, text);
	reselect.call(this, nIndex, nIndex);
}

function addPrefixToLines(prefix) {
	const [selStart, selEnd] = getSelectedRange.call(this, true);
	const lines = this.content.substring(selStart, selEnd).split("\n");

	let text = "";
	for (let line of lines) {
		text += "\n";
		if (/^\s*$/.test(line)) {
			text += line;
		} else {
			text += prefix + line;
		}
	}
	text = text.substring(1);

	changeTextArea.call(this, selStart, selEnd, text);
	reselect.call(this, selStart, selEnd + lines.length);
}

function addLink(text, href) {
	const selEnd = getSelectedRange.call(this, false)[1];
	const str = "[" + text + "](" + href + ")";
	changeTextArea.call(this, selEnd, selEnd, str);
	reselect.call(this, selEnd, selEnd + str.length);
}

function addImageElement(url) {
	const [selStart, selEnd] = getSelectedRange.call(this);
	changeTextArea.call(this, selEnd, selEnd, `![](${url})`);
	const p = selStart + 2;
	reselect.call(this, p, p);
}

export default {
	inputTab,
	addHeader,
	addLink,
	addPrefixToLines,
	addNewLine,
	addImageElement,
	switchWrapper,
};
