<template>
	<div class="el-wrapper">
		<kx-button title="标题" icon="fas fa-heading" @click="addHeader(2)"/>
		<kx-button title="粗体" icon="fa fa-bold" @click="switchWrapper('**')"/>
		<kx-button title="斜体" icon="fa fa-italic" @click="switchWrapper('_')"/>
		<kx-button title="删除线" icon="fa fa-strikethrough" @click="switchWrapper('~~')"/>
		<kx-button title="行内代码" icon="fa fa-code" @click="switchWrapper('`')"/>
		<kx-button title="横线" icon="fa fa-minus" @click="addNewLine('- - -')"/>
		<kx-button title="引用块" icon="fa fa-quote-left" @click="addPrefixToLines('>')"/>
		<kx-button title="列表" icon="fas fa-list-ul" @click="addPrefixToLines('* ')"/>
		<kx-button title="插入链接" icon="fa fa-link" @click="addLink"/>
		<kx-button title="插入视频" icon="fa fa-file-video" @click="addVideo"/>
	</div>
</template>

<script>
import AddLinkDialog from "./AddLinkDialog";
import VideoDialog from "./VideoDialog";

export default {
	name: "KxMarkdownBasicToolbar",
	props: {
		text: {
			type: String,
			required: true,
		},
		selection: {
			type: Array,
			required: true,
		},
	},
	methods: {

		/**
		 * 获取用户选择的范围，也可以将范围扩大到整行。
		 *
		 * @param extend 是否扩展到整行
		 * @return [number, number] 起点和终点
		 */
		getSelectedRange(extend) {
			let [s, e] = this.selection;
			if (extend) {
				if (s > 0) {
					s = this.text.lastIndexOf("\n", s - 1) + 1;
				}
				e = this.text.indexOf("\n", e);
				if (e === -1) e = this.text.length;
			}
			return [s, e];
		},

		/**
		 * 替换一段区域内的文本。
		 *
		 * @param start 替换起点
		 * @param end 替换终点
		 * @param text 替换的文本
		 */
		changeTextArea(start, end, text) {
			const v = this.text;
			this.$emit("update:text", v.substring(0, start) + text + v.substring(end, v.length));
		},

		/**
		 * 更改选择的文本范围。
		 *
		 * @param start 起点
		 * @param end 终点
		 */
		reselect(start, end) {
			if (!end) {
				end = start;
			}
			this.$emit("update:selection", [start, end]);
		},

		addHeader(level) {
			const prefix = new Array(level + 1).join("#") + " ";
			this.addPrefixToLines(prefix);
		},

		addNewLine(text) {
			const v = this.text;
			const index = this.getSelectedRange(false)[0];

			if (index > 0 && v.charAt(index - 1) !== "\n") {
				text = "\n" + text;
			}
			if (index < v.length && v.charAt(index) !== "\n") {
				text += "\n";
			}

			this.changeTextArea(index, index, text);
			this.reselect(index + text.length);
		},

		addPrefixToLines(prefix) {
			const [selStart, selEnd] = this.getSelectedRange(true);
			const lines = this.text.substring(selStart, selEnd).split("\n");

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

			this.changeTextArea(selStart, selEnd, text);
			this.reselect(selStart, selEnd + lines.length);
		},

		switchWrapper(prefix) {
			const v = this.text;
			const [selStart, selEnd] = this.getSelectedRange(false);
			const totalLength = prefix.length + prefix.length;

			let text = v.substring(selStart, selEnd);
			let end;
			if (text.startsWith(prefix) && text.endsWith(prefix)) {
				end = selEnd - totalLength;
				text = text.substring(prefix.length, text.length - prefix.length);
			} else {
				end = selEnd + totalLength;
				text = prefix + text + prefix;
			}

			this.changeTextArea(selStart, selEnd, text);
			this.reselect(selStart, end);
		},

		async addLink() {
			const { text, href } = await this.$dialog.show(AddLinkDialog).confirmPromise;
			const str = `[${text}](${href})`;

			const selEnd = this.getSelectedRange(false)[1];
			this.changeTextArea(selEnd, selEnd, str);
			this.reselect(selEnd, selEnd + str.length);
		},

		// TODO: 暂不支持<source>指定多个源，以后考虑七牛云？
		async addVideo() {
			const res = await this.$dialog.show(VideoDialog).confirmPromise;
			const attrs = [];

			for (const [k, v] of Object.entries(res)) {
				if (!v || k === "src") {
					continue;
				}
				if (v === true) {
					attrs.push(k);
				} else {
					attrs.push(`${k}="${v}"`);
				}
			}

			const str = `@video[](${res.src}){ ${attrs.join(" ")} }`;
			const selEnd = this.getSelectedRange(false)[1];
			this.changeTextArea(selEnd, selEnd, str);
			this.reselect(selEnd, selEnd + str.length);
		},
	},
};
</script>
