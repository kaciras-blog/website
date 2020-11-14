<template>
	<div v-if="!options.enabled" :class="$style.shore">
		已设置为禁止评论
	</div>

	<div v-else-if="!options.allowAnonymous && user.id === 0" :class="$style.shore">
		已禁止匿名评论,请先
		<router-link class='highlight' to='/login'>登录</router-link>
	</div>

	<form v-else>
		<div>
			<img :src="user.avatar" alt="头像" class="small head">

			<label :class="$style.name">
				名字（可选）
				<input
					v-model="nickname"
					name="nickname"
					:placeholder="user.name"
					:class="$style.nickname"
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
			:is-article="false"
		/>
		<textarea
			v-else
			ref="textarea"
			:class="$style.textarea"
			class="input"
			:value="content"
			name="content"
			placeholder='说点什么吧'
			aria-label="输入评论"
			v-ime-input="(event) => $emit('input', event.target.value)"
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

		<div v-if="options.moderation" :class="$style.warn">为防止滥用，评论将在审核后显示</div>
	</form>
</template>

<script>
import { mapState } from "vuex";
import MarkdownView from "@/markdown/MarkdownView";
import MarkdownGuideDialog from "@/components/discussion/MarkdownGuideDialog";

export default {
	name: "DiscussEditor",
	components: {
		MarkdownView,
	},
	props: {
		content: {
			type: String,
			required: true,
		},
		onSubmit: {
			type: Function,
			required: true,
		},
	},
	data: () => ({
		nickname: localStorage.getItem("nickname"),
		preview: false,
	}),
	computed: mapState({
		user: "user",
		options: "discussionOptions",
	}),
	methods: {
		focus() {
			this.$refs.textarea.focus();
		},
		submit() {
			const { nickname } = this;

			// null 会被转换为 "null" 所以要检查一下
			if (nickname) {
				localStorage.setItem("nickname", nickname);
			}
			return this.onSubmit(nickname);
		},
		showGuide() {
			this.$dialog.show(MarkdownGuideDialog);
		},
	},
};
</script>

<style module lang="less">
@import "../../css/imports";

.shore {
	padding: 3rem 0 4rem 0 !important;
	font-size: 16px;
	text-align: center;
	color: @color-text-minor;
}

.textarea {
	width: 100%;
	min-height: 12em;
	margin: 1rem 0;
	padding: .5em;

	border: solid 1px #dcdee0;

	overflow-y: auto;
	resize: vertical;
}

.preview {
	width: 100%;
	margin: 1rem 0;
	overflow-y: auto;
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

.warn {
	margin-top: 1.5rem;
	color: red;
	text-align: center;
}
</style>
