<template>
	<div class="category">
		<div class="info-container"
			 v-if="current"
			 @click="setBackground"
			 :style="styleVars"
			 :title="editable ? '点击换背景' : null">

			<div class="info" @click.stop>
				<img class="head"
					 :src="'/image/' + current.cover"
					 :title="editable ? '点击换头像' : null"
					 alt="分类图标"
					 @click="setCover">
				<input class="name" v-if="editable" title="名称" v-model="current.name">
				<span class="name" v-else>{{current.name}}</span>

				<textarea v-if="editable" title="描述" class="desc" v-model="current.description"></textarea>
				<span v-else class="desc">{{current.description}}</span>

				<div class="buttons" v-if="editable">
					<button @click="move">移动</button>
					<button @click="submit">应用更改</button>
					<button class="dangerous">删除</button>
				</div>
			</div>
		</div>
		<div class="children-title" v-if="current">下级分类</div>
		<div class="children">
			<div class="category-card"
				 v-for="child of children"
				 :key="child.id"
				 @click="goto(child)">
				<img class="head" :src="'/image/' + child.cover" alt="分类图标">
				<span>{{child.name}}</span>
			</div>
		</div>
	</div>
</template>

<script>
import api from "../apis";

export default {
	name: "CategoryView",
	props: {
		id: {
			type: Number,
			default: 0,
		},
		editable: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			current: null,
			children: [],
			cache: {},
		};
	},
	computed: {
		styleVars() {
			const vars = {
				"--background": `url(/image/${this.current.background})`,
			};
			if (this.editable) {
				vars["--cursor"] = "pointer";
			}
			return vars;
		},
	},
	methods: {
		setCover() {
			if (this.editable)
				api.misc.uploadImageFile().then(name => this.current.cover = name);
		},
		setBackground() {
			if (this.editable)
				api.misc.uploadImageFile().then(name => this.current.background = name);
		},
		submit() {
			api.category.update(this.current.id, this.current)
				.then(() => this.$dialog.messageBox("修改分类", "修改成功"));
		},
		goto(category) {
			this.current = category;
			this.children = api.category.getChildren(category.id).then(r => this.children = r);
			this.$emit('update:id', category.id);
		},
		move() {
			this.$dialog.show("SelectCategoryDialog");
		},
		delete() {
			api.category.deleteOne(this.current.id).then(() => this.goto());
		},
	},
	created() {
		api.category.getInfo(this.id).then(json => this.current = json);
		api.category.getChildren(this.id).then(r => this.children = r);
	},
};
</script>

<style scoped lang="less">
@import "../css/ToBeImpoert";

.category {
	font-size: initial;
}

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
	border: solid 3px white;
	margin: 1rem;
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
	resize: none;
	overflow: hidden;
	color: white;
	flex: 1;

	&:focus {
		background-color: #333;
		box-shadow: 0 0 3px 2px @color-input-active;
	}
}

.children-title {
	font-size: 1.5rem;
	width: 100%;
	margin: 1rem 0;
	padding: 0 1rem 1rem;
	border-bottom: solid 1px @color-border;
}

.children {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
}

.category-card {

	cursor: pointer;
	max-width: 9rem;
	margin: 1rem;
	text-align: center;
	padding: 1rem;

	&:hover {
		box-shadow: 0 0 4px 3px #97dfff;
	}
}
</style>
