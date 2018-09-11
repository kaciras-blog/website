<template>
	<div class="button-pager">
		<div class="buttons">
			<button class="border square"
					v-if="current > 1"
					@click="showPage(1)">首页</button>

			<button class="border square"
					v-if="current > 1"
					@click="showPage(current-1)">上一页</button>

			<span v-if="current - 3 > 0" class="omit">...</span>

			<template v-for="i in totalPage" v-if="i>current - 3 && i < current + 3 && i<= totalPage">
				<button class="square" :key="i" v-if="i === current">{{i}}</button>
				<button class="border square" :key="i" @click="showPage(i)" v-else>{{i}}</button>
			</template>

			<span v-if="current + 3 <= totalPage" class="omit">...</span>

			<button class="border square"
					v-if="current < totalPage"
					@click="showPage(current+1)">下一页</button>

			<button class="border square"
					v-if="current < totalPage"
					@click="showPage(totalPage)">尾页</button>
		</div>

		<div class="minor-text">
			<span>共{{totalPage}}页</span>
			<label>跳至<input class="jump" @keyup.13="jump"/>页</label>
		</div>
	</div>
</template>

<script>
export default {
	name: "ButtonPager",
	props: {
		index: {
			type: Number,
			required: true,
		},
		pageSize: {
			type: Number,
			required: true,
		},
		totalCount: {
			type: Number,
			required: true,
		},
	},
	computed: {
		current() {
			return this.index + 1;
		},
		totalPage() {
			return Math.max(0, Math.floor((this.totalCount - 1) / this.pageSize) + 1);
		},
	},
	methods: {
		showPage(index) {
			this.$emit("loadPage", index - 1);
		},
		jump(event) {
			this.$emit("loadPage", event.target.value - 1);
			event.target.value = "";
		},
	},
};
</script>

<style scoped lang="less">
.button-pager {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.buttons button {
	margin: 0 .2rem;
}

.jump {
	font-size: .8em;
	width: 4em;
	margin: 0 .5em;
	text-align: center;
}

.omit {
	line-height: 34px;
	padding: 0 .5em;
	cursor: default;
	font-weight: 600;
	user-select: none;
}

label {
	display: inline-flex;
	align-items: center;
}
</style>
