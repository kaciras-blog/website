<template>
	<div class="center">

		<!-- 加载动画 -->
		<div v-if="state === 'loading'" class="sk-fading-circle">
			<div class="sk-circle1 sk-circle"></div>
			<div class="sk-circle2 sk-circle"></div>
			<div class="sk-circle3 sk-circle"></div>
			<div class="sk-circle4 sk-circle"></div>
			<div class="sk-circle5 sk-circle"></div>
			<div class="sk-circle6 sk-circle"></div>
			<div class="sk-circle7 sk-circle"></div>
			<div class="sk-circle8 sk-circle"></div>
			<div class="sk-circle9 sk-circle"></div>
			<div class="sk-circle10 sk-circle"></div>
			<div class="sk-circle11 sk-circle"></div>
			<div class="sk-circle12 sk-circle"></div>
		</div>

		<!-- 手动加载按钮 -->
		<a :href="this.options.nextPageLink"
		   class="button"
		   v-if="this.options.manually && state==='free'"
		   @click="loadManually($event)">下一页</a>

		<!-- 失败提示 -->
		<span v-if="state === 'fail'" class="text-warning">
			加载失败,请<a class="highlight" @click="loadPage">重试</a>
		</span>

		<!-- 全部加载完成提示 -->
		<span v-if="state === 'allLoaded'" class="minor-text">没有更多的了</span>
	</div>
</template>

<script>
class LoadTask {

	constructor(vm) {
		this._finish = false;
		this._vm = vm;
	}

	complete(allLoaded = false) {
		this.finish(allLoaded ? "allLoaded" : "free");
	}

	error() {
		this.finish("fail");
	}

	finish(state) {
		if (this._finish) {
			throw new Error("不能重复设置加载的结果");
		}
		this._finish = true;
		this._vm.state = state;
	}
}

export default {
	name: "scroll-pager",
	props: {
		options: {
		},
		activeHeight: {
			type: Number,
			default: 400,
		},
	},
	data() {
		return {
			state: "free", //free,fail,loading,allLoaded
		};
	},
	computed: {
		loadable() {
			return ["allLoaded", "loading"].indexOf(this.state) < 0;
		},
	},
	methods: {
		loadManually(event) {
			if (!this.options.tradition) {
				this.loadPage();
				event.preventDefault();
			}
		},
		windowScrollHandler() {
			if (this.state !== "free")
				return;
				//网页高度 - 窗口高度 - 窗口之上部分的高度 = 窗口下面剩余的高度
			const remain = document.body.offsetHeight - window.innerHeight - window.scrollY;
			if (remain < this.activeHeight) this.loadPage();
		},
		loadPage() {
			if (!this.loadable) return;
			this.state = "loading";
			this.$emit("load-page", new LoadTask(this));
		},
	},
	created() {
		if (!this.options.manually)
			window.addEventListener("scroll", this.windowScrollHandler);
		this.loadPage();
	},
};
</script>

<style>
	.sk-fading-circle {
		margin-top: 1rem;
	}
</style>
