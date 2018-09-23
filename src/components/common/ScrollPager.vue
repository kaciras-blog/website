<template>
	<div class="scroll-pager">

		<!-- 通过该插槽可以自定义状态显示，父组件内请使用inline-template -->
		<slot name="state">
			<sk-fading-circle v-if="state === 'loading'"/>

			<span v-else-if="state === 'failed'" class="text-warning">
				加载失败,请<a class="error highlight" @click="loadPage">重试</a>
			</span>

			<span v-else-if="state === 'allLoaded'" class="minor-text">没有更多的了</span>
		</slot>

		<!-- 手动加载按钮 -->
		<a v-if="state==='free'"
		   :href="nextPageUrl"
		   class="button"
		   @click.prevent="loadPage">下一页</a>
	</div>
</template>

<script>
class LoadTask {

	constructor(vm) {
		this._finish = false;
		this._vm = vm;
	}

	complete(allLoaded = false) {
		// 可能一次加载后空余高度仍达不到activeHeight，还得继续加载
		if (!this._vm.tryLoadPage()) {
			this.finish(allLoaded ? "allLoaded" : "free");
		}
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
		// 用于多页显示模式，也能够让爬虫跟踪到后续页
		nextPageUrl: {
			type: String,
			required: false,
		},
		// 滚动时自动加载，该选项为false时将不触发滚动加载
		autoLoad: {
			type: Boolean,
			default: false,
		},
		// 滚动到距离底部还有多高时触发加载事件
		activeHeight: {
			type: Number,
			default: 500,
		},
	},
	data: () => ({
		state: "free", /* free,fail,loading,allLoaded */
	}),
	computed: {
		loadable() {
			return ["allLoaded", "loading"].indexOf(this.state) < 0;
		},
	},
	methods: {
		tryLoadPage() {
			const { state, activeHeight } = this;
			if (state !== "free")
				return;
			//网页高度 - 窗口高度 - 窗口之上部分的高度 = 窗口下面剩余的高度
			const remain = document.body.offsetHeight - window.innerHeight - window.scrollY;

			if (remain < activeHeight) {
				this.loadPage();
			}
			return remain < activeHeight;
		},
		loadPage() {
			if (!this.loadable) return;
			this.state = "loading";
			this.$emit("load-page", new LoadTask(this));
		},
	},
	mounted() {
		if (this.autoLoad)
			window.addEventListener("scroll", this.tryLoadPage);
		this.tryLoadPage();
	},
};
</script>

<style>
.scroll-pager {
	text-align: center;
}
</style>
