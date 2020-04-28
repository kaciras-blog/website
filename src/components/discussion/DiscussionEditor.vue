<template>
	<div v-if="!options.enabled" :class="$style.shore">
		已设置为禁止评论
	</div>

	<div v-else-if="!options.allowAnonymous && user.id === 0" :class="$style.shore">
		已禁止匿名评论,请先
		<router-link class='highlight' to='/login'>登录</router-link>
	</div>

	<div v-else>
		<div>
			<img :src="user.head" alt="头像" class="small head">
			<span :class="$style.name">{{user.name}}</span>
		</div>

		<!--suppress CheckEmptyScriptTag 什么垃圾IDE支持 -->
		<textarea
			:value="content"
			placeholder='说点什么吧'
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
				:on-click='onSubmit'
			>
				发表评论
			</kx-task-button>
		</div>
	</div>
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
	computed: mapState({
		user: "user",
		options: "discussionOptions",
	}),
};
</script>

<style module lang="less">
@import "../../css/Imports";

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
	font-size: 16px;
	font-weight: 600;
	margin-left: .5em;
}

.bottom_toolbar {
	display: flex;
	align-items: center;
}

.buttons {
	margin-left: auto;
}
</style>
