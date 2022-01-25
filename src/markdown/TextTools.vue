<template>
	<div>
		<kx-button title="标题" icon="fas fa-heading" @click="addHeader(2)"/>
		<kx-button title="粗体" icon="fa fa-bold" @click="switchWrapper('**')"/>
		<kx-button title="斜体" icon="fa fa-italic" @click="switchWrapper('*')"/>
		<kx-button title="删除线" icon="fa fa-strikethrough" @click="switchWrapper('~~')"/>
		<kx-button title="行内代码" icon="fa fa-code" @click="switchWrapper('`')"/>
		<kx-button title="横线" icon="fa fa-minus" @click="addNewLine('- - -')"/>
		<kx-button title="引用块" icon="fa fa-quote-left" @click="addPrefixToLines('>')"/>
		<kx-button title="列表" icon="fas fa-list-ul" @click="addPrefixToLines('* ')"/>
		<kx-button title="插入链接" icon="fa fa-link" @click="addLink"/>

		<kx-button title="插入图片" icon="far fa-file-image" @click="addImage"/>
		<kx-button title="插入视频" icon="fa fa-file-video" @click="addVideo"/>
		<kx-button title="插入音频" icon="fas fa-file-audio" @click="addAudio"/>
	</div>
</template>

<script>
import { getImageResolution, getVideoResolution, openFile } from "@kaciras-blog/uikit";
import api from "@/api";
import { basename } from "@/utils";
import VideoDialog from "./VideoDialog.vue";
import AddLinkDialog from "./AddLinkDialog.vue";

export default {
	name: "TextTools",
	// functional: true,
	props: {
		ctx: {
			type: Object,
			required: true,
		},
	},
	computed: {
		text() {
			return this.ctx.content;
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
			let [s, e] = this.ctx.selection;
			if (extend) {
				if (s > 0) {
					s = this.text.lastIndexOf("\n", s - 1) + 1;
				}
				e = this.text.indexOf("\n", e);
				if (e === -1) e = this.text.length;
			}
			return [s, e];
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

			this.ctx.replaceArea(index, index, text);
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

			this.ctx.replaceArea(selStart, selEnd, text);
		},

		switchWrapper(prefix) {
			const v = this.text;
			const [selStart, selEnd] = this.getSelectedRange(false);

			let text = v.substring(selStart, selEnd);
			if (text.startsWith(prefix) && text.endsWith(prefix)) {
				text = text.substring(prefix.length, text.length - prefix.length);
			} else {
				text = prefix + text + prefix;
			}

			this.ctx.replaceArea(selStart, selEnd, text);
		},

		async addLink() {
			const { text, href } = await this.$dialog.show(AddLinkDialog).confirmPromise;
			const str = `[${text}](${href})`;

			const selEnd = this.getSelectedRange(false)[1];
			this.ctx.replaceArea(selEnd, selEnd, str);
		},

		async addImage() {
			const file = await openFile("image/*");

			// 加上宽高便于确定占位图的尺寸，从 https://chanshiyu.com/#/post/41 学到的
			const { width, height } = await getImageResolution(file);
			const res = await api.misc.uploadImage(file) + `?vw=${width}&vh=${height}`;

			const [, selEnd] = this.ctx.selection;
			this.ctx.replaceArea(selEnd, selEnd, `![${basename(file.name)}](${res})`);
		},

		async addVideo() {
			const { src, label, poster, isVideo } = await this.$dialog.show(VideoDialog).confirmPromise;
			let text;

			if (isVideo) {
				text = `@video[${poster}](${src})`;
			} else {
				const { width, height } = await getVideoResolution(src);
				text = `@gif[${label}](${src}?vw=${width}&vh=${height})`;
			}

			const selEnd = this.ctx.selection[1];
			this.ctx.replaceArea(selEnd, selEnd, text);
		},

		async addAudio() {
			const file = await openFile("audio/*");
			const res = await api.misc.uploadAudio(file);
			const selEnd = this.ctx.selection[1];
			this.ctx.replaceArea(selEnd, selEnd, `@audio[](${res})`);
		},
	},
};
</script>
