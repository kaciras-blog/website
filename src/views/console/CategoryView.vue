<template>
	<div>
		<div :class="$style.infoSection"
			 @click.self="setBackground"
			 :style="styleVars"
			 :title="editable ? '点击换背景' : null"
		>
			<div :class="$style.infoPanel">
				<img
					class="head"
					:class="$style.head"
					:src="item.cover"
					:title="editable ? '点击换头像' : null"
					alt="图标"
					@click="setCover"
				>
				<input
					v-if="editable"
					v-model="item.name"
					title="名称"
					class="dark"
					:class="$style.name"
				>
				<span v-else :class="$style.name">{{item.name}}</span>

				<textarea
					v-if="editable"
					v-model="item.description"
					title="描述"
					class="dark input"
					:class="$style.desc"
				/>

				<span v-else :class="$style.desc">{{item.description}}</span>

				<div :class="$style.buttons" v-if="editable">
					<kx-button class="primary outline" @click="$emit('change')">应用更改</kx-button>
					<kx-button class="primary outline" @click="move">移动</kx-button>
					<kx-button class="dangerous outline" @click="remove">删除</kx-button>
				</div>
			</div>
		</div>

		<div v-if="editable" :class="$style.optionSection">
			<h3>导航栏背景色：</h3>
			<kx-radio-box-group v-model="item.theme" name="theme">
				<kx-radio-box :value="0">默认</kx-radio-box>
				<kx-radio-box :value="1">明亮背景</kx-radio-box>
				<kx-radio-box :value="2">暗色背景</kx-radio-box>
			</kx-radio-box-group>
		</div>
	</div>
</template>

<script>
import api from "@/api";
import SelectCategoryDialog from "@/components/SelectCategoryDialog";
import MoveCategoryDialog from "./MoveCategoryDialog";

export default {
	name: "CategoryView",
	props: {
		item: {
			type: Object,
			required: true,
		},
		editable: {
			type: Boolean,
			default: false,
		},
		parent: Number,
	},
	computed: {
		styleVars() {
			const { item, editable } = this;
			const vars = {};

			if (editable) {
				vars["--cursor"] = "pointer";
			}
			if (item.background) {
				vars["--background"] = `url(${item.background})`;
			}
			return vars;
		},
	},
	methods: {
		setCover() {
			if (!this.editable) {
				return;
			}
			api.misc.uploadImageFile().then(name => this.item.cover = name);
		},
		setBackground() {
			if (!this.editable) {
				return;
			}
			api.misc.uploadImageFile().then(name => this.item.background = name);
		},
		async move() {
			const target = await this.$dialog.show(SelectCategoryDialog);
			const moveType = await this.$dialog.show(MoveCategoryDialog);
			api.category.move(this.item.id, target.id, moveType);
		},
		remove() {
			api.category.remove(this.item.id, false).then(() => this.$emit("removed"));
		},
	},
};
</script>

<style module lang="less">
@import "../../css/Imports";

.infoSection {
	background-image: var(--background);
	background-size: cover;
	padding: 2.5rem;
	cursor: var(--cursor);
}

.optionSection {
	margin-top: 1rem;
}

.infoPanel {
	display: grid;
	grid-gap: 1rem;

	grid-template-rows: auto auto 10rem;
	grid-template-columns: 1fr auto;
	grid-template-areas: "head button" "name button" "desc desc";
	justify-items: center;

	@media screen and (min-width: @length-screen-mobile) {
		grid-template-rows: auto auto;
		grid-template-columns: auto 1fr auto;
		grid-template-areas: "head desc button" "name desc button";
	}

	cursor: default;
	max-width: 48rem;
	padding: 1rem;
	color: white;
	background-color: rgba(0, 0, 0, 0.7);
	border-radius: 1rem;

	& .head {
		margin-left: 2rem;
		margin-right: 2rem;
		margin-bottom: 0;
	}
}

.head {
	grid-area: head;

	display: block;
	margin: 1rem;
	border-radius: 1rem;

	color: black;
	border: solid 3px white;
	background-color: white;
	cursor: var(--cursor);
}

.name {
	grid-area: name;
	width: 9rem;
	text-align: center;

	&:not(input) {
		font-size: 1.2rem;
		font-weight: 600;
	}
}

.desc {
	grid-area: desc;
	justify-self: stretch;
	flex: 1;

	padding: .5rem;
	word-break: break-all;
	text-overflow: ellipsis;
	line-height: 1.4em;

	border: none;
	background: none;
	overflow: hidden;
}

.buttons {
	grid-area: button;
	display: flex;
	flex-direction: column;

	& > :global(.kx-btn) + :global(.kx-btn) {
		margin-top: 10px;
	}
}
</style>
