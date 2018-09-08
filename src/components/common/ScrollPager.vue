<template>
	<div class="scroll-pager">
		<!-- 通过该插槽可以自定义状态显示，父组件内请使用inline-template -->
		<slot name="state">
			<sk-fading-circle v-if="state === 'loading'"></sk-fading-circle>

			<span v-else-if="state === 'failed'" class="text-warning">
				加载失败,请<a class="error highlight" @click="loadPage">重试</a>
			</span>

			<span v-else-if="state === 'allLoaded'" class="minor-text">没有更多的了</span>
		</slot>

		<!-- 手动加载按钮 -->
		<a :href="this.options.nextPageLink"
		   class="button"
		   v-if="this.options.manually && state==='free'"
		   @click="loadManually($event)">下一页</a>
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
		this.finish("failed");
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
	name: "ScrollPager",
	props: {
		options: {},
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
.scroll-pager{
	text-align: center;
}
</style>
