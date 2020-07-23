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
					tabindex="0"
					@click="sortFinish(false)"
				>
				<img
					src="../../assets/icon/correct.svg"
					alt="make friend"
					title="确定"
					:class="$style.iconButton"
					tabindex="0"
					@click="sortFinish(true)"
				>
			</div>

			<div v-else-if="user.id === 2" :class="$style.toolbar">
				<img
					src="../../assets/icon/sort.svg"
					alt="sort"
					title="调整顺序"
					:class="$style.iconButton"
					tabindex="0"
					@click="sort"
				>
				<img
					src="../../assets/icon/plus.svg"
					alt="make friend"
					title="添加"
					:class="$style.iconButton"
					tabindex="0"
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
					:style="friend.style"
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

	getIndex(x, y) {
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

		// GridDraggingRegion 的构造方法有点耗时，在进入排序模式时就计算好，让拖动更流畅。
		// 注意不能更早去计算，因为非排序模式下可能因添加删除等改变布局。
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

			// TODO 保存排序
		},
		drag(event, current) {
			if (!this.sorting) {
				return;
			}
			event.preventDefault();

			const { friends, $_draggingRegion } = this;
			const listEl = this.$refs.list;

			let i = friends.indexOf(current);
			const el = listEl.children[i];
			const rect = el.getBoundingClientRect();

			const dragEl = el.firstElementChild.cloneNode(true);

			// 不能使用 dragEl.style = {...}
			Object.assign(dragEl.style, {
				position: "absolute",
				top: rect.top + pageYOffset + "px",
				left: rect.left + pageXOffset + "px",
				zIndex: 10,
				cursor: "grabbing",
			});

			document.body.appendChild(dragEl);

			this.$set(friends, i, {
				isPlaceholder: true,
				id: Symbol(),

				// 这个占位是必要的，用于保持新行
				style: {
					width: rect.width + "px",
					height: rect.height + "px",
				},
			});

			function insertInto(k) {
				if (i === k) {
					return;
				}
				const holder = friends.splice(i, 1)[0];
				i = k;
				friends.splice(k, 0, holder);
			}

			observeMouseMove().pipe(elementPosition(event, el)).subscribe({
				next: ({ x, y }) => {
					dragEl.style.left = x + "px";
					dragEl.style.top = y + "px";
					insertInto(Math.min($_draggingRegion.getIndex(x, y), friends.length - 1));
				},
				complete: () => {
					dragEl.remove();
					this.$set(friends, i, current);
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
}

.item {
	position: relative;

	&:hover, &:focus-within {
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
</style>
