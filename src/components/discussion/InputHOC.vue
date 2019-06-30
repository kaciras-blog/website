<template>
	<component
		:is="component"
		:content="content"
		:onSubmit="submit"
		@input="handleInput"
		@submit="submit"
	/>
</template>

<script>
import api from "../../api";
import { errorMessage } from "../../utils";

export default {
	name: "InputHOC",
	props: {
		component: {
			type: Object,
			required: true,
		},
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
		const key = `DIS_${this.type}_${this.objectId}`;
		const cached = localStorage.getItem(key) || "";
		return { key, content: cached, snapshot: cached };
	},
	methods: {
		handleInput(newContent) {
			console.log(newContent);
			if (newContent.length - this.snapshot.length > 20) {
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
				const entry = await api.discuss.add(objectId, type, parent, content);
				this.content = "";
				localStorage.removeItem(key);
				this.$emit("submitted", entry);
			} catch (e) {
				this.$dialog.alertError("发表失败", errorMessage(e));
			}
		},
	},
};
</script>
