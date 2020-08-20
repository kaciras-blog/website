<template>
	<div v-if="!options.enabled" :class="$style.shore">
		已设置为禁止评论
	</div>

	<div v-else-if="!options.allowAnonymous && user.id === 0" :class="$style.shore">
		已禁止匿名评论,请先
		<router-link class='highlight' to='/login'>登录</router-link>
	</div>

	<form v-else>
		<div :class="$style.header">
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

			<!--<span :class="$style.guide" @click="showGuide">-->
			<!--	<span class="hide-m">编辑器指南 </span>-->
			<!--	<i class="far fa-question-circle"></i>-->
			<!--</span>-->
		</div>

		<div :class="$style.textarea" class="input">
			<markdown-view
				v-if="preview"
				class="textarea"
				:class="$style.preview"
				:value="content"
				:is-article="false"
			/>
			<textarea
				v-else
				:class="$style.textbox"
				:value="content"
				name="content"placeholder='说点什么吧'
				aria-label="输入评论"
				v-ime-input="(event) => $emit('input', event.target.value)"
			/>
		</div>

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
		submit() {
			const { nickname } = this;

			// null 会被转换为 "null" 所以要检查一下
			if (nickname) {
				localStorage.setItem("nickname", nickname);
			}
			return this.onSubmit(nickname);
		},
		showGuide() {

		},
		togglePrevicw(value) {

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
	min-height: 10em;
	margin: 1rem 0;
	padding: .5em;

	border: solid 1px #dcdee0;

	overflow-y: auto;
	resize: vertical;
}

.textbox {
	border: none;
	width: 100%;
	overflow: auto;
}

.header {
	display: flex;
}

.name {
	display: inline-flex;
	flex-direction: column;
	margin-left: 1rem;
}

.nickname {
	margin-top: 4px;
	font-weight: 600;
}

.guide {
	margin-left: auto;

	font-size: 1rem;
	cursor: pointer;
	align-self: flex-end;

	&:hover, &.active {
		color: #f785d7;
	}

	@media screen and (max-width: @length-screen-mobile) {
		font-size: 22px;
	}
}

.bottom_toolbar {
	display: flex;
	align-items: center;
}

.submit {
	margin-left: auto;
}

.warn {
	margin-top: 1.5rem;
	color: red;
	text-align: center;
}
</style>
