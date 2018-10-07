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
		changeTextArea(start, end, text) {
			const v = this.text;
			this.$emit("update:text", v.substring(0, start) + text + v.substring(end, v.length));
		},
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
	},
};
</script>
