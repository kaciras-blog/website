<template>
	<div class="info-container"
		 @click.self="setBackground"
		 :style="styleVars"
		 :title="editable ? '点击换背景' : null">

		<div class="info">
			<img class="head"
				 :src="item.cover"
				 :title="editable ? '点击换头像' : null"
				 alt="分类图标"
				 @click="setCover">

			<input v-if="editable"
				   class="name"
				   title="名称"
				   v-model="item.name">
			<span v-else
				  class="name">
				{{item.name}}
			</span>

			<textarea
				v-if="editable"
				title="描述"
				class="desc"
				v-model="item.description">
			</textarea>

			<span v-else class="desc">{{item.description}}</span>

			<div class="buttons" v-if="editable">
				<kx-button class="primary outline" @click="$emit('change')">应用更改</kx-button>
				<kx-button class="primary outline" @click="move">移动</kx-button>
				<kx-button class="dangerous outline" @click="remove">删除</kx-button>
			</div>
		</div>
	</div>
</template>

<script>
import api from "../../api";
import CategoryMoveTypeDialog from "./CategoryMoveTypeDialog";
import SelectCategoryDialog from "../../components/SelectCategoryDialog";

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
		styleVars () {
			const { item, editable } = this;
			const vars = {};

			if (editable) {
				vars["--cursor"] = "pointer";
			}
			if(item.background) {
				vars["--background"] = `url(${item.background})`;
			}
			return vars;
		},
	},
	methods: {
		setCover () {
			if (this.editable)
				api.misc.uploadImageFile().then(name => this.item.cover = name);
		},
		setBackground () {
			if (this.editable)
				api.misc.uploadImageFile().then(name => this.item.background = name);
		},
		async move () {
			const target = await this.$dialog.show(SelectCategoryDialog);
			const moveType = await this.$dialog.show(CategoryMoveTypeDialog);
			api.category.move(this.item.id, target.id, moveType);
		},
		remove () {
			api.category.deleteOne(this.item.id).then(() => this.$emit("removed"));
		},
	},

};
</script>

<style scoped lang="less">
@import "../../css/Imports";

.buttons {
	grid-area: button;
	display: flex;
	flex-direction: column;

	& > button:not(:last-of-type) {
		margin-bottom: .5rem;
	}
}

.info-container {
	background-image: var(--background);
	background-size: cover;
	padding: 2.5rem;
	cursor: var(--cursor);
}

.info {
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

	padding: .5rem;
	word-break: break-all;
	text-overflow: ellipsis;
	line-height: 1.4em;

	border: none;
	background: none;
	overflow: hidden;
	color: white;
	flex: 1;

	&:focus {
		background-color: #333;
		box-shadow: 0 0 3px 2px @color-input-active;
	}
}

</style>
