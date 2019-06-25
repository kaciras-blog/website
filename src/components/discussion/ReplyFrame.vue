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

		<div :class="$style.body">
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
					<ol class="clean-list">
						<discussion-content
							v-for="item of items"
							:key="item.id"
							:value="item"
							:class="$style.item"/>
					</ol>
				</template>
			</scroll-paging-view>
		</div>

		<div :class="$style.input_footer">
			<input :value="inputData">
		</div>
	</div>
</template>

<script>
import api from "../../api";
import DiscussionContent from "./DiscussionContent";
import { PreventScrollMixin } from "kx-ui";

export default {
	name: "ReplyFrame",
	components: {
		DiscussionContent,
	},
	mixins: [PreventScrollMixin],
	props: {
		value: {
			type: Object,
			required: true,
		},
	},
	data: () => ({
		replies: null,
		inputData: "",
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
	composes: full-vertex from global;
	display: flex;
	position: fixed;

	flex-direction: column;
	z-index: 900;
	background-color: white;
}

.header {
	position: relative;
	text-align: center;
	height: 50px;
	box-shadow: rgba(0, 0, 0, .2) 0 0 3px 1px;
}

.body {
	overflow-y: auto;
	flex: 1;
}

.back_button {
	position: absolute;
	left: 0;
}

.title {
	font-size: 20px;
	font-weight: 600;
	line-height: 50px;
}

.item {
	padding: 15px;
}

.input_footer {
	padding: 10px;
	border-top: solid 1px #d1d1d1;
}
</style>
