<template>
	<div class="flex vertical margin-vert">
		<div class="flex between">
			<button @click="goBack"><i class="fa fa-arrow-left"></i>返回</button>
			<button class="primary" @click="submitEdit"><i class="fa fa-check"></i>确定</button>
		</div>

		<!-- 主分类属性编辑面板 -->
		<div class="wrapper">
			<div class="background" :style="background"></div>
			<div class="category-info panel">
				<h2 class="compact">分类属性</h2>
				<img title="添加封面" :src="'/image/' + category.cover" @click="uploadCover">
				<button class="square" @click="uploadBackground"><i class="fa fa-upload"></i>上传背景图片</button>
				<input class="expansion" placeholder="类名" v-model="category.name">
				<textarea class="input" placeholder="简介" v-model="category.description"></textarea>
			</div>
		</div>

		<div class="flex vertical panel" v-if="category.id">
			<header class="flex between segment">
				<h2 class="compact">子分类列表</h2>
				<button class="primary" @click="editSub()"><i class="fa fa-plus"></i>添加分类</button>
			</header>
			<div class="flex center-align between segment"
				 :key="sub.id"
				 v-for="sub in subCategories">
				<div class="flex margin-horiz center-align">
					<img class="head" :src="'/image/'+ sub.cover" alt="封面">
					<h3 class="compact">{{sub.name}}</h3>
				</div>
				<div>
					<button class="square border primary" @click="editSub(sub)">编辑</button>
					<button class="square border primary" @click="move(sub)">移动</button>
					<button class="square border dangerous" @click="deleteCategory(sub)">删除</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import api from "../apis";

const defalutAttributes = {
	"cover": "placeholder.png",
	"name": "",
	"description": "",
};

function loadData() {
	const id = this.$route.params["id"];
	this.parent = this.$route.query["parent"] || 0;

	if (!id) {
		this.category = Object.assign({}, defalutAttributes);
		this.subCategories = [];
	} else {
		api.category.getInfo(id).then(json => this.category = json);
		api.category.getChildren(id).then(r => this.subCategories = r);
	}
}

export default {
	name: "category-info",
	data() {
		return {
			category: {},
			parent: 0,
			subCategories: [],
		};
	},
	computed: {
		background() {
			const bkg = this.category.background;
			return bkg ? { backgroundImage: "url(/image/" + bkg + ")" } : { backgroundColor: "white" };
		},
	},
	methods: {
		move(sub) {
			this.$dialog.show(selectCategoryDialog.name, null)
				.then(target => api.category.move(sub.id, target, false));
		},
		goBack() {
			this.$router.go(-1);
		},
		editSub(sub) {
			let url = "/editCategory";
			if (sub)
				url += "/" + sub.id;
			if (this.$route.params["id"])
				url += "?parent=" + this.$route.params["id"];
			this.$router.push(url);
		},
		submitEdit() {
			const category = this.category;
			const mp = Object.assign({}, category);
			mp["parent"] = this.parent;
			delete mp["id"];

			let promise;
			if (category.id) {
				promise = api.category.update(category.id, mp);
			} else {
				promise = api.category.create(mp);
			}
			promise.then(() => this.goBack()).catch(e => alert("失败"));
		},
		uploadCover() {
			api.misc.uploadImageFile().then(url => this.category.cover = url);
		},
		uploadBackground() {
			//收到的数据对象可能不包含category字段，需要动态添加
			api.misc.uploadImageFile().then(url => this.$set(this.category, "background", url));
		},
		deleteCategory(sub) {
			api.category.deleteOne(sub.id).then(() => getSubCategories(id).then(r => this.subCategories = r));
		},
	},
	watch: {
		"$route": loadData,
	},
	created: loadData,
};
</script>

<style scoped>
	.wrapper{
		position: relative;
		height: 280px;
	}
	.category-info {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 1;

		display: grid;
		grid-template: repeat(5,1fr)/repeat(18,1fr) ;
		grid-template-areas:
				"h h h h h h h h h h h h h h h h h h"
				"a a a a b b b b b b b b b b b x x x"
				"a a a a c c c c c c c c c c c c c c"
				"a a a a c c c c c c c c c c c c c c"
				"a a a a c c c c c c c c c c c c c c";
		grid-gap: 1rem;
		background: rgba(255, 255, 255, 0.88);
	}
	.background{
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;

		background: no-repeat center 0;
		background-size: cover;
	}
	.category-info > h2 {
		grid-area: h;
		border-bottom: solid 1px #c4c4c4;
		padding-bottom: 1rem;
	}

	.category-info > img {
		grid-area: a;
		cursor: pointer;
		width: 100%;
		height: 100%;
	}
	.category-info > input, .input {
		background: transparent;
	}
	.category-info > input {
		grid-area: b;
	}

	.category-info > textarea {
		grid-area: c;
	}

	.category-info > button{
		grid-area: x;
	}
</style>
