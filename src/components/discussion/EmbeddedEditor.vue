<template>
	<div>
		<div>
			<img :src="user.avatar" alt="头像" class="small head">

			<label :class="$style.name">
				名字（可选）
				<input
					:value="nickname"
					name="nickname"
					:placeholder="user.name"
					:class="$style.nickname"
					@input="$emit('update:name', )"
				>
			</label>

			<button :class="$style.guide" @click="showGuide">
				<span class="hide-m">帮助 </span>
				<i class="far fa-question-circle"></i>
			</button>
		</div>

		<markdown-view
			v-if="preview"
			:class="$style.preview"
			:value="content"
		/>
		<textarea
			v-else
			ref="textarea"
			:class="$style.textarea"
			class="input"
			:value="content"
			name="content"
			placeholder='说点什么吧...'
			aria-label="输入评论"
			v-autofocus
			v-ime-input="handleInput"
		/>

		<div :class='$style.bottom_toolbar'>
			<kx-button
				v-if="preview"
				icon="far fa-edit"
				title="编辑"
				@click="preview=false"
			>
				<span class="hide-m"> 编辑</span>
			</kx-button>
			<kx-button
				v-else
				icon="fas fa-eye"
				title="预览"
				@click="preview=true"
			>
				<span class="hide-m"> 预览</span>
			</kx-button>

			<kx-task-button
				class='primary'
				:class="$style.submit"
				:on-click='submit'
			>
				发表评论
			</kx-task-button>
		</div>
	</div>
</template>

<script>
import { mapState } from "vuex";
import MarkdownView from "@/markdown/MarkdownView.vue";
import EditContext from "./EditContext";
import GuideDialog from "./GuideDialog.vue";

export default {
	name: "EmbeddedEditor",
	mixins: [
		EditContext,
	],
	components: {
		MarkdownView,
	},
	data: () => ({
		preview: false,
	}),
	computed: mapState(["user"]),
	methods: {
		showGuide() {
			this.$dialog.show(GuideDialog);
		},
	},
};
</script>

<style module lang="less">
@import "../../css/imports";

.textarea, .preview {
	width: 100%;
	font-size: initial;
	min-height: 10em;
	margin: 1rem 0;
	padding: 10px;
	overflow-y: auto;
}

.textarea {
	border: solid 1px #dcdee0;
	resize: vertical;
}

.header {
	display: flex;
}

.name {
	display: inline-flex;
	flex-direction: column;
	margin-left: 1rem;
	vertical-align: middle;
}

.nickname {
	margin-top: 4px;
	font-weight: 600;
}

.guide {
	composes: click-item from global;

	float: right;
	padding: 0;

	font-size: 1rem;
	align-self: flex-end;
	background: none;

	&:hover, &.active {
		color: #f785d7;
	}

	@media screen and (max-width: @length-screen-mobile) {
		font-size: 22px;
	}
}

.bottom_toolbar {
	composes: btn-group from global;
	display: flex;
	align-items: center;
	justify-content: flex-end;
}
</style>
