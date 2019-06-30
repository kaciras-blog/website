<template>
	<div v-if="!options.enabled" :class="$style.shore">
		已设置为禁止评论
	</div>

	<div v-else-if="!options.allowAnonymous && !user" :class="$style.shore">
		已禁止匿名评论,请先
		<router-link class='highlight' to='/login'>登录</router-link>
	</div>

	<div v-else>
		<div>
			<img :src="user.head" alt="头像" class="small head">
			<span :class="$style.name">{{user.name}}</span>
		</div>

		<textarea
			class='input'
			:class="$style.textarea"
			:value="content"
			placeholder='说点什么吧'
			v-input-fix="$event => $emit('input', $event.target.value)">
		</textarea>

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

/**
 * 类似 input 事件，额外处理了输入法问题。
 * 输入法再未上屏时的字符（如拼音）也算作元素的内容并触发 input 事件，使用该指令来监听可以避免这个问题。
 */
function inputFix(el, binding) {
	let completed = true;
	el.addEventListener("compositionstart", () => {
		completed = false;
	});
	el.addEventListener("compositionend", (event) => {
		completed = true;
		binding.value(event);
	});
	el.addEventListener("input", (event) => {
		completed && binding.value(event);
	});
}

export default {
	name: "DiscussEditor",
	directives: {
		inputFix: { inserted: inputFix },
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
