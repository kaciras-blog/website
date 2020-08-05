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
				v-for="(friend, i) of friends"
				:key="friend.id"
				:class="$style.item"
			>
				<div
					v-if="friend.placeholder"
					:style="friend.style"
				/>
				<friend-card
					v-else
					:disabled="sorting"
					:friend="friend"
					@dragstart="drag($event, i)"
				/>

				<button
					v-if="user.id === 2 && !sorting"
					title="修改"
					:class="$style.edit"
					@click="edit(friend)"
				/>
				<button
					v-if="user.id === 2 && !sorting"
					title="删除"
					:class="$style.remove"
					@click="rupture(i)"
				/>
			</li>
		</ul>
	</section>
</template>

<script>
import Vue from "vue";
import { mapState } from "vuex";
import { edgeScroll, moveElement, observeMouseMove } from "@kaciras-blog/uikit";
import api from "@/api";
import { errorMessage } from "@/utils";
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

		// 不能使用 gridGap 属性，CSS 设置的 grid-gap 会转换为 gridRowGap & gridColumnGap。
		const cStyle = getComputedStyle(container);
		const rowGap = parseInt(cStyle.gridRowGap), columnGap = parseInt(cStyle.gridColumnGap);

		this.xOffset = card.left + pageXOffset;
		this.yOffset = card.top + pageYOffset;

		this.tW = card.width + columnGap;
		this.tH = card.height + rowGap;

		this.columns = Math.floor((region.width + columnGap) / (card.width + columnGap));
		this.rows = Math.floor((region.height + rowGap) / (card.height + rowGap));
	}

	/**
	 * 计算给定的点落在第几个元素的范围内。
	 *
	 * 注意该方法仅计算理论值，假定格子有无穷多个，返回值可能超出实际元素数量。
	 *
	 * @param x X坐标
	 * @param y Y坐标
	 * @return {number} 格子序号
	 */
	getIndex(x, y) {
		return this.getRow(y) * this.columns + this.getColumn(x);
	}

	// 这里不要用 round，而是要向下取整
	getColumn(x) {
		const c = Math.floor((x - this.xOffset) / this.tW);
		return Math.max(0, Math.min(c, this.columns - 1));
	}

	getRow(y) {
		const r = Math.floor((y - this.yOffset) / this.tH);
		return Math.max(0, Math.min(r, this.rows - 1));
	}
}

class VueArrayInsertSort {

	constructor(array, index) {
		this.array = array;
		this.index = index;
		this.data = array[index];
	}

	dragOver(k) {
		const { index, array } = this;
		k = Math.min(k, array.length - 1);

		if (index === k) {
			return;
		}
		const holder = array.splice(index, 1)[0];
		this.index = k;
		array.splice(k, 0, holder);
	}

	dragEnd() {
		Vue.set(this.array, this.index, this.data);
	}
}

function dragSort(region, sort, event, el) {

	const observer = {
		next({ x, y }) {
			x += pageXOffset;
			y += pageYOffset;
			sort.dragOver(region.getIndex(x, y));
		},
		complete() {
			el.remove();
			sort.dragEnd();
		},
	};

	observeMouseMove().pipe(edgeScroll(), moveElement(event, el)).subscribe(observer);
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

		async rupture(index) {
			await api.friend.rupture(this.friends[index]);
			this.friends.splice(index, 1);
		},

		async edit(friend) {
			const updated = await this.$dialog.show(FriendInfoDialog, friend).confirmPromise;
			await api.friend.updateFriend(friend, updated);
			Object.assign(friend, updated);
		},

		// GridDraggingRegion 的构造方法有点耗时，在进入排序模式时就计算好，让拖动更流畅。
		// 注意不能更早去计算，因为非排序模式下可能因添加删除等改变布局。
		sort() {
			this.sorting = true;
			this.$_draggingRegion = new GridDraggingRegion(this.$refs.list);
			this.$_backup = this.friends.slice();
		},

		async sortFinish(save) {
			if (!save) {
				this.friends = this.$_backup;
				return this.sorting = false;
			}
			try {
				await api.friend.updateSort(this.friends);
				this.sorting = false;
			} catch (e) {
				this.$dialog.alertError("更新失败", errorMessage(e));
			}
		},

		drag(event, i) {
			if (!this.sorting) {
				return;
			}
			event.preventDefault();

			const { friends, $_draggingRegion } = this;

			const listEl = this.$refs.list;
			const el = listEl.children[i];
			const rect = el.getBoundingClientRect();

			const dragEl = el.firstElementChild.cloneNode(true);

			// 不能使用 dragEl.style = {...}
			Object.assign(dragEl.style, {
				position: "fixed",
				top: rect.top  + "px",
				left: rect.left + "px",
				zIndex: 10000,
				cursor: "grabbing",
			});
			document.body.appendChild(dragEl);

			const sort = new VueArrayInsertSort(friends, i);

			this.$set(friends, i, {
				placeholder: true,
				id: Symbol(),

				// 这个占位是必要的，用于保持新行
				style: {
					width: rect.width + "px",
					height: rect.height + "px",
				},
			});

			dragSort($_draggingRegion, sort, event, dragEl);
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
		& > .rightTopButton {
			opacity: 1;
			transform: scale(1);
		}
	}
}

.sorting {
	cursor: move;
}

@button-size: 40px;

.rightTopButton {
	position: absolute;
	top: -@button-size / 2;
	width: @button-size;
	height: @button-size;
	z-index: 5;

	border-radius: 50%;
	background-position: 50%;
	background-repeat: no-repeat;

	opacity: 0;
	cursor: pointer;

	transform: scale(0.25);
	transition: .3s;

	&:hover {
		border: solid 1px #222;
	}
}

.edit {
	composes: rightTopButton;
	right: @button-size - 10px;
	background-image: url("../../assets/icon/edit.svg");
	background-size: 20px;
}

.remove {
	composes: rightTopButton;
	right: -@button-size / 2;
	background-image: url("~@kaciras-blog/uikit/src/assets/icon-close.svg");
}
</style>
