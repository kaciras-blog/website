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
		</div>

		<textarea
			ref="textarea"
			:value="content"
			name="content"
			placeholder='说点什么吧'
			aria-label="输入评论"
			class='input'
			:class="$style.textarea"
			v-ime-input="(event) => $emit('input', event.target.value)"
		/>

		<div :class='$style.bottom_toolbar'>
			<span v-if="options.moderation" class="minor-text">
				为防止恶意刷评论，评论将在审核后显示
			</span>
			<kx-task-button
				class='primary'
				:class="$style.buttons"
				:on-click='submit'
			>
				发表评论
			</kx-task-button>
		</div>
	</form>
</template>

<script>
import { mapState } from "vuex";

export default {
	name: "DiscussEditor",
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
	min-height: 8em;
	margin-top: 1rem;
	margin-bottom: 1rem;
	resize: vertical;
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

.bottom_toolbar {
	display: flex;
	align-items: center;
}

.buttons {
	margin-left: auto;
}
</style>
