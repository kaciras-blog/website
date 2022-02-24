<template>
	<section :ref="lazyLoad">
		<header :class="$style.header">
			<h1 :class="$style.title">友情链接</h1>

			<div v-if="sorting" :class="$style.toolbar">
				<kx-button
					:class="$style.iconButton2"
					type="icon"
					title="取消"
					@click="sortFinish(false)"
				>
					<CloseIcon fill="#f44336"/>
				</kx-button>
				<kx-button
					:class="$style.iconButton2"
					type="icon"
					title="确定"
					@click="sortFinish(true)"
				>
					<CheckIcon fill="#2196f3"/>
				</kx-button>
			</div>

			<div
				v-else-if="user.id === 2"
				:class="$style.toolbar"
			>
				<kx-button
					type="icon"
					title="调整顺序"
					:class="$style.iconButton"
					@click="sort"
				>
					<SortIcon/>
				</kx-button>
				<kx-button
					type="icon"
					title="添加"
					:class="$style.iconButton"
					@click="makeFriend"
				>
					<AddIcon/>
				</kx-button>
			</div>
		</header>

		<ul :class="$style.list" ref="listEl">
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
					:active="active"
					:friend="friend"
					@dragstart="drag($event, i)"
				/>

				<kx-button
					v-if="user.id === 2 && !sorting"
					type="icon"
					title="修改"
					:class="$style.edit"
					@click="edit(friend)"
				>
					<PencilIcon/>
				</kx-button>
				<kx-button
					v-if="user.id === 2 && !sorting"
					type="icon"
					title="删除"
					:class="$style.remove"
					@click="rupture(i)"
				>
					<CloseIcon fill="#f44336"/>
				</kx-button>
			</li>
		</ul>
	</section>
</template>

<script lang="ts">
import { edgeScroll, moveElement, observeMouseMove } from "@kaciras-blog/uikit";

class GridDraggingRegion {

	private readonly xOffset: number;
	private readonly yOffset: number;

	private readonly tW: number;
	private readonly tH: number;

	private readonly columns: number;
	private readonly rows: number;

	constructor(container: HTMLElement) {
		const region = container.getBoundingClientRect();
		const card = container.children[0].getBoundingClientRect();

		// 不能使用 gridGap 属性，CSS 设置的 grid-gap 会转换为 gridRowGap & gridColumnGap。
		const cStyle = getComputedStyle(container);
		const rowGap = parseInt(cStyle.gridRowGap), columnGap = parseInt(cStyle.gridColumnGap);

		this.xOffset = card.left + window.scrollX;
		this.yOffset = card.top + window.scrollY;

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
	getIndex(x: number, y: number) {
		return this.getRow(y) * this.columns + this.getColumn(x);
	}

	// 这里不要用 round，而是要向下取整
	getColumn(x: number) {
		const c = Math.floor((x - this.xOffset) / this.tW);
		return Math.max(0, Math.min(c, this.columns - 1));
	}

	getRow(y: number) {
		const r = Math.floor((y - this.yOffset) / this.tH);
		return Math.max(0, Math.min(r, this.rows - 1));
	}
}

class VueArrayInsertSort {

	private readonly array: unknown[];
	private readonly data: unknown;

	private index: number;

	constructor(array: unknown[], index: number) {
		this.array = array;
		this.index = index;
		this.data = array[index];
	}

	dragOver(k: number) {
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
		this.array[this.index] = this.data;
	}
}

function dragSort(
	region: GridDraggingRegion,
	sort: VueArrayInsertSort,
	event: MouseEvent | TouchEvent,
	el: HTMLElement,
) {
	const observer = {
		next({ x, y }) {
			x += window.scrollX;
			y += window.scrollY;
			sort.dragOver(region.getIndex(x, y));
		},
		complete() {
			el.remove();
			sort.dragEnd();
		},
	};

	observeMouseMove()
		.pipe(edgeScroll(), moveElement(event, el))
		.subscribe(observer);
}
</script>

<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { KxButton, useDialog, useIntersectionHandler } from "@kaciras-blog/uikit";
import SortIcon from "@/assets/icon/sort.svg?sfc";
import AddIcon from "@/assets/icon/plus.svg?sfc";
import CloseIcon from "@material-design-icons/svg/round/close.svg?sfc";
import CheckIcon from "@material-design-icons/svg/round/check.svg?sfc";
import PencilIcon from "bootstrap-icons/icons/pencil-fill.svg?sfc";
import { errorMessage } from "@/utils";
import FriendCard from "./FriendCard.vue";
import FriendInfoDialog from "./FriendInfoDialog.vue";
import { DEFAULT_COVER } from "@/blog-plugin";
import api, { Friend } from "@/api";
import { useCurrentUser, usePrefetch } from "@/store";

const FRIEND_TEMPLATE: Friend = {
	name: "",
	url: "",
	background: DEFAULT_COVER,
};

const user = useCurrentUser();
const prefetch = usePrefetch();
const dialog = useDialog();

const friends = reactive<Friend[]>(prefetch.friends);
const active = ref(false);
const sorting = ref(false);

const listEl = ref();


let draggingRegion: GridDraggingRegion;
let backup: Friend[];

async function makeFriend() {
	let info = FRIEND_TEMPLATE;
	for (; ;) {
		const result = await dialog.show(FriendInfoDialog, info);
		if (!result.isConfirm) {
			return;
		}
		info = result.data as Friend;

		try {
			const friend = await api.friend.makeFriend(info);
			return friends.push(friend);
		} catch (e) {
			await dialog.alertError("添加失败", errorMessage(e));
		}
	}
}

async function rupture(index: number) {
	await api.friend.rupture(friends[index]);
	friends.splice(index, 1);
}

async function edit(friend: Friend) {
	const result = await dialog.show(FriendInfoDialog, friend);
	if (result.isConfirm) {
		Object.assign(friend, result.data);
		await api.friend.updateFriend(friend, result.data as Friend);
	}
}

// GridDraggingRegion 的构造方法有点耗时，在进入排序模式时就计算好，让拖动更流畅。
// 注意不能更早去计算，因为非排序模式下可能因添加删除等改变布局。
function sort() {
	sorting.value = true;
	draggingRegion = new GridDraggingRegion(listEl.value);
	backup = friends.slice();
}

async function sortFinish(save: boolean) {
	if (!save) {
		friends.splice(0, friends.length, ...backup);
		return sorting.value = false;
	}
	try {
		await api.friend.updateSort(friends);
		sorting.value = false;
	} catch (e) {
		dialog.alertError("更新失败", errorMessage(e));
	}
}

function drag(event: MouseEvent | TouchEvent, i: number) {
	if (!sorting.value) {
		return;
	}
	event.preventDefault();

	const el = listEl.value.children[i];
	const rect = el.getBoundingClientRect();

	const dragEl = el.firstElementChild.cloneNode(true);

	// 不能使用 dragEl.style = {...}
	Object.assign(dragEl.style, {
		position: "fixed",
		top: rect.top + "px",
		left: rect.left + "px",
		zIndex: 10000,
		cursor: "grabbing",
	});
	document.body.appendChild(dragEl);

	const sort = new VueArrayInsertSort(friends, i);

	friends[i] = {
		placeholder: true,
		id: Symbol(),

		// 这个占位是必要的，用于保持新行
		style: {
			width: rect.width + "px",
			height: rect.height + "px",
		},
	};

	dragSort(draggingRegion, sort, event, dragEl);
}

/*
 * 因为友链图片较多且首屏对性能要求高，所以做了个懒加载。
 * 目前仅以容器进入视区为准，若要精确到每个友链请注意拖动排序的重新生成元素问题。
 */
const lazyLoad = useIntersectionHandler((entries, observer) => {
	if (entries[0].isIntersecting) {
		active.value = true;
		observer.disconnect();
	}
}, { rootMargin: "35px" });
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
	font-size: 28px;
	margin-right: 8px;
	padding: 8px;

	border-radius: 4px;
	cursor: pointer;
	transition: background-color .15s;

	&:hover, &:focus {
		background: #f0f0f0;
	}
}

// 这俩图标比上面的小，要放大些。
.iconButton2 {
	composes: iconButton;

	padding: 0;
	font-size: 44px;
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
	top: -(@button-size / 2);
	width: @button-size;
	height: @button-size;
	z-index: 5;

	border-radius: 50%;
	background: white;

	opacity: 0;
	cursor: pointer;

	transform: scale(0.25);
	transition: .3s;

	border: solid 1px #333;
}

.edit {
	composes: rightTopButton;
	right: @button-size - 10px;
}

.remove {
	composes: rightTopButton;
	right: -(@button-size / 2);
}
</style>
