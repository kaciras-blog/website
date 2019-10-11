<!-- 这个组件没有样式，只是封装数据，但Vue2就是没有Hooks只能用这种丑陋的写法 -->
<template>
	<div>
		<slot :content="content" :onSubmit="submit" :onInput="handleInput"/>
	</div>
</template>

<script>
import api from "@/api";
import { errorMessage } from "@/utils";

export default {
	name: "InputHOC",
	props: {
		type: {
			type: Number,
			required: true,
		},
		objectId: {
			type: Number,
			required: true,
		},
		parent: {
			type: Number,
			default: 0,
		},
	},
	data() {
		const key = `DIS_${this.type}_${this.objectId}_${this.parent}`;
		const cached = localStorage.getItem(key) || "";
		return { key, content: cached, snapshot: cached };
	},
	methods: {
		handleInput(newContent) {
			// 想当年高中试卷，作文格子一行20个字
			if (newContent.length === 0) {
				localStorage.removeItem(this.key);
			} else if (newContent.length - this.snapshot.length > 20) {
				this.snapshot = newContent;
				localStorage.setItem(this.key, newContent);
			}
			this.content = newContent;
		},
		async submit() {
			const { type, objectId, parent, key, content } = this;

			if (/^\s*$/.test(content)) {
				return; // 没写评论就按发表按钮
			}
			try {
				const entity = await api.discuss.add(objectId, type, parent, content);
				this.content = "";
				localStorage.removeItem(key);
				this.$emit("submitted", entity);
			} catch (e) {
				this.$dialog.alertError("发表失败", errorMessage(e));
			}
		},
	},
};
</script>
