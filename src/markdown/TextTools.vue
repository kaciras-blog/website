<template>
	<kx-button type="icon" title="标题" @click="addHeader(1)">
		<TitleIcon/>
	</kx-button>
	<kx-button type="icon" title="粗体" @click="switchWrapper('**')">
		<BoldIcon/>
	</kx-button>
	<kx-button type="icon" title="斜体" @click="switchWrapper('*')">
		<ItalicIcon/>
	</kx-button>
	<kx-button type="icon" title="删除线" @click="switchWrapper('~~')">
		<StrikethroughIcon/>
	</kx-button>
	<kx-button type="icon" title="行内代码" @click="switchWrapper('`')">
		<CodeIcon/>
	</kx-button>
	<kx-button type="icon" title="横线" @click="addNewLine('- - -')">
		<RemoveIcon/>
	</kx-button>
	<kx-button type="icon" title="引用块" @click="addPrefixToLines('>')">
		<QuoteIcon/>
	</kx-button>
	<kx-button type="icon" title="列表" @click="addPrefixToLines('* ')">
		<ListIcon/>
	</kx-button>
	<kx-button type="icon" title="插入链接" @click="addLink">
		<AddLinkIcon/>
	</kx-button>
</template>

<script setup lang="ts">
import TitleIcon from "@material-design-icons/svg/round/title.svg?sfc";
import BoldIcon from "@material-design-icons/svg/round/format_bold.svg?sfc";
import ItalicIcon from "@material-design-icons/svg/round/format_italic.svg?sfc";
import StrikethroughIcon from "@material-design-icons/svg/round/strikethrough_s.svg?sfc";
import CodeIcon from "@material-design-icons/svg/round/code.svg?sfc";
import RemoveIcon from "@material-design-icons/svg/round/remove.svg?sfc";
import QuoteIcon from "bootstrap-icons/icons/quote.svg?sfc";
import ListIcon from "@material-design-icons/svg/round/format_list_bulleted.svg?sfc";
import AddLinkIcon from "@material-design-icons/svg/round/add_link.svg?sfc";
import { getImageResolution, getVideoResolution, KxButton, openFile, useDialog } from "@kaciras-blog/uikit";
import api from "@/api";
import { basename } from "@/utils";
import VideoDialog from "./VideoDialog.vue";
import AddLinkDialog from "./AddLinkDialog.vue";
import { overwrite, useEditorContext } from "./editor-addon";

const context = useEditorContext();
const dialog = useDialog();

/**
 * 获取用户选择的范围，也可以将范围扩大到整行。
 *
 * @param extend 是否扩展到整行
 * @return [number, number] 起点和终点
 */
function getSelectedRange(extend: boolean) {
	const { content, selection } = context;
	let [s, e] = selection;
	if (extend) {
		if (s > 0) {
			s = content.lastIndexOf("\n", s - 1) + 1;
		}
		e = content.indexOf("\n", e);
		if (e === -1) e = content.length;
	}
	return [s, e];
}

function addPrefixToLines(prefix: string) {
	const [selStart, selEnd] = getSelectedRange(true);
	const lines = context.content.substring(selStart, selEnd).split("\n");

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

	overwrite(context, selStart, selEnd, text);
}

function addHeader(level: number) {
	addPrefixToLines(new Array(level + 1).join("#") + " ");
}

function addNewLine(text: string) {
	const v = context.content;
	const index = getSelectedRange(false)[0];

	if (index > 0 && v.charAt(index - 1) !== "\n") {
		text = "\n" + text;
	}
	if (index < v.length && v.charAt(index) !== "\n") {
		text += "\n";
	}

	overwrite(context, index, index, text);
}

function switchWrapper(prefix: string) {
	const v = context.content;
	const [selStart, selEnd] = getSelectedRange(false);

	let text = v.substring(selStart, selEnd);
	if (text.startsWith(prefix) && text.endsWith(prefix)) {
		text = text.substring(prefix.length, text.length - prefix.length);
	} else {
		text = prefix + text + prefix;
	}

	overwrite(context, selStart, selEnd, text);
}

interface AddLinkData  {
	text: string;
	href: string;
}

async function addLink() {
	const { text, href } = await dialog.show<AddLinkData>(AddLinkDialog).confirmPromise;
	const str = `[${text}](${href})`;

	const selEnd = getSelectedRange(false)[1];
	overwrite(context, selEnd, selEnd, str);
}

async function addImage() {
	const file = await openFile("image/*");

	// 加上宽高便于确定占位图的尺寸，从 https://chanshiyu.com/#/post/41 学到的
	const { width, height } = await getImageResolution(file);
	const res = await api.misc.uploadImage(file) + `?vw=${width}&vh=${height}`;

	const [, selEnd] = context.selection;
	overwrite(context, selEnd, selEnd, `![${basename(file.name)}](${res})`);
}

interface VDP_Copy {
	src: string;
	isVideo: boolean;
	poster: string;
	label: string;
	autoLabel: boolean;
}

async function addVideo() {
	const { src, label, poster, isVideo } = await dialog
		.show<VDP_Copy>(VideoDialog).confirmPromise;
	let text;

	if (isVideo) {
		text = `@video[${poster}](${src})`;
	} else {
		const { width, height } = await getVideoResolution(src);
		text = `@gif[${label}](${src}?vw=${width}&vh=${height})`;
	}

	const [selEnd] = context.selection;
	overwrite(context, selEnd, selEnd, text);
}

async function addAudio() {
	const file = await openFile("audio/*");
	const res = await api.misc.uploadAudio(file);
	const [selEnd] = context.selection;
	overwrite(context, selEnd, selEnd, `@audio[](${res})`);
}
</script>
