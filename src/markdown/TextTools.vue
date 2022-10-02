<template>
	<KxButton type='icon' title='标题' @click='addHeader(1)'>
		<TitleIcon/>
	</KxButton>
	<KxButton type='icon' title='粗体' @click='switchWrapper("**")'>
		<BoldIcon/>
	</KxButton>
	<KxButton type='icon' title='斜体' @click='switchWrapper("*")'>
		<ItalicIcon/>
	</KxButton>
	<KxButton type='icon' title='删除线' @click='switchWrapper("~~")'>
		<StrikethroughIcon/>
	</KxButton>
	<KxButton type='icon' title='行内代码' @click='switchWrapper("`")'>
		<CodeIcon/>
	</KxButton>
	<KxButton type='icon' title='横线' @click='addNewLine("- - -")'>
		<RemoveIcon/>
	</KxButton>
	<KxButton type='icon' title='引用块' @click='addPrefixToLines(">")'>
		<QuoteIcon/>
	</KxButton>
	<KxButton type='icon' title='列表' @click='addPrefixToLines("* ")'>
		<ListIcon/>
	</KxButton>
	<KxButton type='icon' title='插入链接' @click='addLink'>
		<AddLinkIcon/>
	</KxButton>
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
import { KxButton, useDialog } from "@kaciras-blog/uikit";
import AddLinkDialog from "./AddLinkDialog.vue";
import { AddonContext, overwrite } from "./editor-addon";

interface TextStateGroupProps {
	ctx: AddonContext;
}

const props = defineProps<TextStateGroupProps>();
const dialog = useDialog();

// eslint-disable-next-line vue/no-setup-props-destructure
const context = props.ctx;

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

interface AddLinkData {
	text: string;
	href: string;
}

async function addLink() {
	const { text, href } = await dialog.show<AddLinkData>(AddLinkDialog).confirmPromise;
	const str = `[${text}](${href})`;

	const selEnd = getSelectedRange(false)[1];
	overwrite(context, selEnd, selEnd, str);
}
</script>
