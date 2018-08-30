<template>
<div class="category">
	<div>
		<button><i class="fa fa-arrow-left"></i>返回</button>
		<button>应用更改</button>
		<button>移动</button>
		<button class="dangerous">删除该分类</button>
	</div>
	<div :style="{ backgroundImage: 'url(/image/' + this.current.background + ')'}">
		<div class="info">
			<div>
				<img class="head" :src="'/static/img/' + current.cover" alt="分类图标">
				<span>{{current.name}}</span>
			</div>
			<!--<span class="desc">{{current.description}}</span>-->
			<textarea title="描述" class="desc" v-model="current.description"></textarea>
		</div>
	</div>
	<div class="children-title">下级分类</div>
	<div class="children">
		<div class="category-card" v-for="child of children" :key="child.id">
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
	props: ["initId"],
	data() {
		return {
			current: {},
			children: [],
			cache: {},
		};
	},
	created() {
		api.category.getInfo(this.initId).then(json => this.current = json);
		api.category.getChildren(this.initId).then(r => this.children = r);
	},
};
</script>

<style scoped lang="less">
@import "../css/ToBeImpoert";

.category {

	font-size: initial;

	& > div:nth-child(2) {
		margin: 1rem 0;
		background-size: cover;
		padding: 2.5rem;
	}
}

.info {
	display: flex;

	max-width: 40rem;
	padding: 1rem;
	color: white;
	background-color: rgba(0, 0, 0, 0.7);
	border-radius: 1rem;

	& > div:first-child {
		text-align: center;
	}
}

.head {
	display: block;
	border: solid 3px white;
	margin: 1rem;
}

.desc {
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
		background-color: rgba(255, 255, 255, 0.1);
		box-shadow: 0 0 3px 2px #97dfff;
	}
}

.children-title {
	font-size: 1.5rem;
	width: 100%;
	margin-bottom: 1rem;
	padding-bottom: 1rem;
	border-bottom: solid 1px @color-border;
}

.children {
	display: flex;
	flex-wrap: wrap;
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
