<template>
	<div :class="$style.container">

		<header :class="$style.header">
			<button
				title="返回"
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
			<textarea :value="inputData" :class="$style.input" @input="fit"></textarea>
			<kx-button class="primary" @click="publish">发送</kx-button>
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
		fit(event) {
			const el = event.target;
			el.style.height = "";
			el.style.height = el.scrollHeight + "px";
		},
		publish() {

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
	height: 48px;
	box-shadow: rgba(0, 0, 0, .2) 0 0 3px 1px;
}

.body {
	overflow-y: auto;
	flex: 1;
}

.back_button {
	position: absolute;
	left: 0;
	top: 0;
	bottom: 0;
}

.title {
	font-size: 16px;
	line-height: 48px;
}

.item {
	padding: 15px;
}

.input_footer {
	display: flex;
	align-items: flex-end;
	padding: 10px;
	background: #f0f0f5;
}

.input {
	flex: 1;

	min-height: 0;
	max-height: 32px; // HACK
	padding: .5rem;
	margin-right: 10px;
	border-color: white;

	&:focus {
		max-height: 10rem;
	}
}
</style>
