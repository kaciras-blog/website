<template>
	<section>
		<header :class="$style.header">
			<h1 :class="$style.title">友情链接</h1>

			<div v-if="sorting" :class="$style.toolbar">
				<img
					src="../../assets/icon/close.svg"
					alt="sort"
					title="取消"
					:class="$style.iconButton"
					@click="sortFinish(false)"
				>
				<img
					src="../../assets/icon/correct.svg"
					alt="make friend"
					title="确定"
					:class="$style.iconButton"
					@click="sortFinish(true)"
				>
			</div>

			<div v-else-if="user.id === 2" :class="$style.toolbar">
				<img
					src="../../assets/icon/sort.svg"
					alt="sort"
					title="调整顺序"
					:class="$style.iconButton"
					@click="sort"
				>
				<img
					src="../../assets/icon/plus.svg"
					alt="make friend"
					title="添加"
					:class="$style.iconButton"
					@click="makeFriend"
				>
			</div>
		</header>

		<ul :class="$style.list" ref="list">
			<li
				v-for="friend of friends"
				:key="friend.id"
				:class="$style.item"
			>
				<div
					v-if="friend.isPlaceholder"
					:class="$style.placeholder"
				/>
				<friend-card
					v-else
					:disabled="sorting"
					:friend="friend"
					@dragstart="drag($event, friend)"
				/>

				<!-- 没有更新按钮，更新 = 删除 + 添加 -->
				<button
					v-if="user.id === 2 && !sorting"
					title="删除"
					:class="$style.remove"
					@click="rupture(friend)"
				/>
			</li>
		</ul>

		<!-- 函数组件事件监听还不能为undefined，非得搞个空函数不可 -->
		<friend-card
			v-if="dragging"
			:friend="dragging.item"
			:disabled="true"
			:style="dragging.style"
			@dragstart="() => {}"
		/>
	</section>
</template>

<script>
import { mapState } from "vuex";
import { elementPosition, observeMouseMove } from "@kaciras-blog/uikit/src/index";
import api from "@/api";
import { deleteOn, errorMessage } from "@/utils";
import FriendCard from "./FriendCard";
import FriendInfoDialog from "./FriendInfoDialog";

const DEFAULT_INFO = {
	name: "",
	url: "",
	background: "/static/img/placeholder.png",
	favicon: "/static/img/akalin.jpg",
};

class GridDraggingRegion {

	constructor(container) {
		const region = container.getBoundingClientRect();
		const card = container.children[0].getBoundingClientRect();

		const G = getComputedStyle(container).gridGap;

		this.xOffset = card.left + pageXOffset;
		this.territoryW = card.width + G;

		this.yOffset = card.top + pageYOffset;
		this.territoryH = card.height + G;

		this.columns = Math.floor((region.width + G) / (card.width + G));
		this.rows = Math.ceil((region.height + G) / (card.height + G));
	}

	flatIndex(x, y) {
		return this.getRow(y) * this.columns + this.getColumn(x);
	}

	getColumn(x) {
		const c = Math.round((x - this.xOffset) / this.territoryW);
		return Math.max(0, Math.min(c, this.columns - 1));
	}

	getRow(y) {
		let r = Math.round((y - this.yOffset) / this.territoryH);
		return Math.max(0, Math.min(r, this.rows - 1));
	}
}

export default {
	name: "FriendsSection",
	components: {
		FriendCard,
	},
	data() {
		return {
			friends: this.$store.state.prefetch.friends,
			sorting: false,
			dragging: null,
		};
	},
	computed: mapState(["user"]),
	methods: {
		async makeFriend() {
			let info = DEFAULT_INFO;
			for (; ;) {
				const result = await this.$dialog.show(FriendInfoDialog, info);
				if (!result.isConfirm) {
					return;
				}
				info = result.data;

				try {
					const friend = await api.friend.makeFriend(info);
					return this.friends.push(friend);
				} catch (e) {
					await this.$dialog.alertError("添加失败", errorMessage(e));
				}
			}
		},
		async rupture(friend) {
			await api.friend.rupture(friend);
			deleteOn(this.friends, v => v === friend);
		},
		sort() {
			this.sorting = true;
			this.$_draggingRegion = new GridDraggingRegion(this.$refs.list);
			this.$_backup = this.friends.slice();
		},
		sortFinish(save) {
			if (!save) {
				this.friends = this.$_backup;
			}
			this.sorting = false;
			delete this.$_draggingRegion;
			delete this.$_backup;

			// TODO 保存排序
		},
		drag(event, current) {
			if (!this.sorting) {
				return;
			}
			event.preventDefault();

			const { friends } = this;
			const area = new GridDraggingRegion(this.$refs.list);
			const listEl = this.$refs.list;

			let i = friends.indexOf(current);
			const el = listEl.children[i];
			const rect = el.getBoundingClientRect();

			this.dragging = {
				item: current,
				style: {
					position: "absolute",
					top: rect.top + pageYOffset + "px",
					left: rect.left + pageXOffset + "px",
					zIndex: 10,
					cursor: "grabbing",
				},
			};

			friends[i] = {
				id: Symbol(),
				isPlaceholder: true,
			};

			function insertInto(k) {
				if (i === k) return;
				const holder = friends.splice(i, 1)[0];
				i = k;
				friends.splice(k, 0, holder);
			}

			observeMouseMove().pipe(elementPosition(event, el)).subscribe({
				next: ({ x, y }) => {
					this.dragging.style.left = x + "px";
					this.dragging.style.top = y + "px";
					insertInto(Math.min(area.flatIndex(x, y), friends.length - 1));
				},
				complete: () => {
					this.dragging = null;
					friends[i] = current;
				},
			});
		},
	},
};
</script>

<style module lang="less">
@import "../../css/imports";

// TODO: 能否从 FriendCard 里引入？
@friend-width: 260px;
@friend-height: @friend-width / 16 * 9;

.header {
	display: flex;
}

.toolbar {
	margin-left: auto;
}

.iconButton {
	.size(2.8rem);
	margin-right: .5rem;
	padding: .5rem;

	border-radius: .25rem;
	cursor: pointer;
	transition: background-color .15s;

	&:hover, &:focus {
		background: #f0f0f0;
	}
}

.title {
	font-size: 2rem;
}

// 自动网格的卡片布局
// https://blog.kaciras.com/article/14/use-pure-CSS-to-implement-center+wrap+left-alignment-layout
.list {
	composes: clean-list from global;

	display: grid;
	grid-template-columns: repeat(auto-fit, @friend-width);
	grid-gap: 40px;
	justify-content: center;
	justify-items: center;
}

.item {
	position: relative;

	&:hover, &:focus {
		& > .remove {
			opacity: 1;
			transform: scale(1);
		}
	}
}

.sorting {
	cursor: move;
}

.remove {
	position: absolute;
	top: -10px;
	right: -10px;
	width: 30px;
	height: 30px;
	z-index: 5;

	border-radius: 50%;
	background-image: url("~@kaciras-blog/uikit/src/assets/icon-close.svg");
	background-position: 50%;
	opacity: 0;
	cursor: pointer;

	transform: scale(0.25);
	transition: .3s;
}

// 这个占位是必要的，用于保持新行
.placeholder {
	width: @friend-width;
	height: @friend-height;
}
</style>
