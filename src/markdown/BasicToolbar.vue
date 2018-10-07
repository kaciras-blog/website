<template>
	<div>
		<kx-button class="minor icon" title="标题" @click="addHeader(2)">
			<i class="fas fa-heading"></i>
		</kx-button>
		<kx-button class="minor icon" title="粗体" @click="switchWrapper('**', '**')">
			<i class="fa fa-bold"></i>
		</kx-button>
		<kx-button class="minor icon" title="斜体" @click="switchWrapper('_', '_')">
			<i class="fa fa-italic"></i>
		</kx-button>
		<kx-button class="minor icon" title="删除线" @click="switchWrapper('~~', '~~')">
			<i class="fa fa-strikethrough"></i>
		</kx-button>
		<kx-button class="minor icon" title="行内代码" @click="switchWrapper('`', '`')">
			<i class="fa fa-code"></i>
		</kx-button>
		<kx-button class="minor icon" title="横线" @click="addNewLine('- - -')">
			<i class="fa fa-minus"></i>
		</kx-button>
		<kx-button class="minor icon" title="引用块" @click="addPrefixToLines('>')">
			<i class="fa fa-quote-left"></i>
		</kx-button>
		<kx-button class="minor icon" title="列表" @click="addPrefixToLines('* ')">
			<i class="fas fa-list-ul"></i>
		</kx-button>
	</div>
</template>

<script>
export default {
	name: "KxMarkdownBasicToolbar",
	model: {
		prop: "text",
		event: "change",
	},
	props: {
		text: {
			type: String,
			required: true,
		},
	},
	methods: {
		addHeader(level) {
			const prefix = new Array(level + 1).join("#") + " ";
			addPrefixToLines.call(this, prefix);
		},
		addNewLine(text) {
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
		},
		addPrefixToLines(prefix) {
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
		},
		switchWrapper(prefix) {
			const v = this.content;
			const [selStart, selEnd] = getSelectedRange.apply(this, [false]);
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

			changeTextArea.call(this, selStart, selEnd, text);
			reselect.call(this, selStart, end);
		}
	},
};
</script>

<style scoped>

</style>
