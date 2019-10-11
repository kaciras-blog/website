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
				v-model="pageData"
				:start="value.replies.length"
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

		<input-h-o-c
			:type="value.type"
			:object-id="value.objectId"
			:parent="value.id"
			:class="$style.input_footer"
			@submitted="submitted"
		>
			<template v-slot="{ content, onSubmit, onInput }">
				<textarea
					:class="$style.input"
					:value="content"
					v-ime-input="e => fit(e, onInput)"
				/>
				<kx-button class="primary" @click="onSubmit">发送</kx-button>
			</template>
		</input-h-o-c>
	</div>
</template>

<script>
import { PreventScrollMixin } from "kx-ui";
import api from "@/api";
import InputHOC from "@/components/discussion/InputHOC";
import DiscussionContent from "./DiscussionContent";

export default {
	name: "ReplyFrame",
	components: {
		InputHOC,
		DiscussionContent,
	},
	mixins: [PreventScrollMixin],
	props: {
		value: {
			type: Object,
			required: true,
		},
	},
	data() {
		const pageData = {
			items: this.value.replies.slice(),
			total: this.value.replyCount,
		};
		return { pageData };
	},
	methods: {
		loadNext(start, count) {
			return api.discuss.getReplies(this.value.id, start, count);
		},
		fit(event, updater) {
			const el = event.target;
			el.style.height = "";
			el.style.height = el.scrollHeight + "px";
			updater(el.value);
		},
		submitted(entity) {
			this.pageData.items.push(entity);
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
	max-height: 30px; // HACK
	font-size: 14px;
	padding: .5rem;
	margin-right: 10px;
	border: none;
	border-radius: 4px;

	&:focus {
		max-height: 10rem;
	}
}
</style>
