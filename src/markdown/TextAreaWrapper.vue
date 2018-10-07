<!--<template>-->
<!--<textarea spellcheck="false"-->
<!--@keydown.tab.prevent="inputTab"-->
<!--@input="handleInput"-->
<!--@click="handleSelect"-->
<!--@keydown="handleSelect"/>-->
<!--</template>-->

<script>
export default {
	name: "TextAreaWrapper",
	functional: true,
	props: {
		catchTab: Boolean,
	},
	render(h, ctx) {
		const { props, data, listeners } = ctx;
		data.attrs = data.attrs || {};
		data.attrs.spellcheck = false;

		const { select } = listeners;
		if (select) {
			listeners.click = listeners.keydown = event => {
				const el = event.target;
				select({ start: el.selectionStart, end: el.selectionEnd });
			};
			delete listeners.select;
		}

		/**
		 * 浏览器默认的tab键用于切换选择的元素，在文本框上监听，使其能够输入tab字符。
		 *
		 * @param event
		 */
		const insertTab = event => {
			if(event.key !== "Tab") {
				return;
			}
			event.preventDefault();

			const el = event.target;
			const selStart = el.selectionStart;
			const selEnd = el.selectionEnd;

			const text = this.content.substring(selStart, selEnd);
			el.value = text.substring(0, selStart) + "\t" + text.substring(selEnd, text.length);

			const newEnd = selStart + 1 - text.length;
			el.selectionStart = el.selectionEnd = newEnd;

			if (select) {
				select({ start: newEnd, end: newEnd });
			}
		};

		if(props.catchTab) {
			listeners.keydown = insertTab;
		}

		return h("textarea", data);
	},
};
</script>
