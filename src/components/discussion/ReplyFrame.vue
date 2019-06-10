<template>
	<div :class="$style.container">

		<header :class="$style.header">
			<button title="返回"
					:class="$style.back_button"
					class="nav-item"
					@click="$dialog.close"
			>
				<i class="fas fa-arrow-left"></i>
			</button>
			<span :class="$style.title">查看回复</span>
		</header>

		<discussion-content
			:value="value"
			tag="div"
			class="segment"
			:class="$style.item"
		/>

		<scroll-paging-view
			v-model="replies"
			:loader="loadNext"
			:auto-load="true"
		>
			<template v-slot="{ items }">
				<ol class="list">
					<discussion-content
						v-for="item of items"
						:key="item.id"
						:value="item"
						:class="$style.item"/>
				</ol>
			</template>
		</scroll-paging-view>
	</div>
</template>

<script>
import api from "../../api";
import DiscussionContent from "./DiscussionContent";

export default {
	name: "ReplyFrame",
	components: {
		DiscussionContent,
	},
	props: {
		value: {
			type: Object,
			required: true,
		},
	},
	data: () => ({
		replies: null,
	}),
	methods: {
		loadNext(start, count) {
			return api.discuss.getReplies(this.value.id, start, count);
		},
	},
};
</script>

<style module lang="less">
.container {
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	background-color: white;
}

.header {
	position: relative;
	background-color: #317df3;
	color: white;
	text-align: center;
	height: 50px;
}

.back_button {
	position: absolute;
	left: 0;
	color: white !important;
}

.title {
	font-size: 20px;
	font-weight: 600;
	line-height: 50px;
}

.item {
	padding: 15px;
}
</style>
