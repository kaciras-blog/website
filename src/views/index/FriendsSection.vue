<template>
	<section :ref='lazyLoad'>
		<header :class='$style.header'>
			<h1 :class='$style.title'>友情链接</h1>

			<div v-if='sorting' :class='$style.toolbar'>
				<KxButton
					:class='$style.iconButton2'
					type='icon'
					title='取消'
					@click='sortFinish(false)'
				>
					<CloseIcon fill='#f44336'/>
				</KxButton>
				<KxButton
					:class='$style.iconButton2'
					type='icon'
					title='确定'
					@click='sortFinish(true)'
				>
					<CheckIcon fill='#2196f3'/>
				</KxButton>
			</div>

			<div
				v-else-if='user.isAdmin'
				:class='$style.toolbar'
			>
				<KxButton
					type='icon'
					title='调整顺序'
					:class='$style.iconButton'
					@click='enableDragSort'
				>
					<SortIcon/>
				</KxButton>
				<KxButton
					type='icon'
					title='添加'
					:class='$style.iconButton'
					@click='makeFriend'
				>
					<AddIcon/>
				</KxButton>
			</div>
		</header>

		<ul :class='$style.list' ref='listEl'>
			<li
				v-for='(friend, i) of friends'
				:key='friend.url'
				:class='$style.item'
				@dragstart='draggingIndex = i'
				@dragenter='dragEnter(i)'
			>
				<!-- a 自带 draggable 无需再设置 -->
				<FriendCard
					:friend='friend'
					:active='active'
					:disabled='sorting'
				/>
				<KxButton
					v-if='user.isAdmin && !sorting'
					type='icon'
					title='修改'
					:class='$style.edit'
					@click='edit(friend)'
				>
					<PencilIcon/>
				</KxButton>
				<KxButton
					v-if='user.isAdmin && !sorting'
					type='icon'
					title='删除'
					:class='$style.remove'
					@click='rupture(i)'
				>
					<CloseIcon fill='#f44336'/>
				</KxButton>
			</li>
		</ul>
	</section>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { KxButton, useDialog, useIntersectionHandler } from "@kaciras-blog/uikit";
import SortIcon from "@/assets/icon/sort.svg?sfc";
import AddIcon from "@/assets/icon/plus.svg?sfc";
import CloseIcon from "@material-design-icons/svg/round/close.svg?sfc";
import CheckIcon from "@material-design-icons/svg/round/check.svg?sfc";
import PencilIcon from "bootstrap-icons/icons/pencil-fill.svg?sfc";
import { errorMessage } from "@/utils";
import FriendCard from "./FriendCard.vue";
import FriendInfoDialog from "./FriendInfoDialog.vue";
import { DEFAULT_COVER } from "@/common";
import api, { Friend } from "@/api/index.ts";
import { useCurrentUser, usePrefetch } from "@/store";

const FRIEND_TEMPLATE: Friend = {
	name: "",
	url: "",
	background: DEFAULT_COVER,
};

const user = useCurrentUser();
const prefetch = usePrefetch();
const dialog = useDialog();

const friends = reactive<Friend[]>(prefetch.data.friends);
const active = ref(false);
const sorting = ref(false);

const listEl = ref();


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
		await api.friend.updateFriend(friend, result.data);
		Object.assign(friend, result.data);
	}
}

/*
 * 旧版用得是 mousemove 型拖动，得自己计算区间，复杂不堪，新版改成原生 dragenter 了。
 * 体验上几乎没有差别，原以为的间隔区域实际上并没有什么影响，而且也同样能排到开头和末尾。
 */
let draggingIndex = 0;
let backup: Friend[];

function enableDragSort() {
	sorting.value = true;
	backup = friends.slice();
}

function dragEnter(i: number) {
	if (!sorting.value || draggingIndex === i) {
		return;
	}
	const e = friends.splice(draggingIndex, 1);
	draggingIndex = i;
	friends.splice(i, 0, e[0]);
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
@import "../../css/imports.less";

/* TODO: 能否从 FriendCard 里引入？ */
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

/* 这俩图标比上面的小，要放大些。 */
.iconButton2 {
	composes: iconButton;

	padding: 0;
	font-size: 44px;
}

.title {
	font-size: 1.75rem;
}

/* 自动网格的卡片布局 */
/* https://blog.kaciras.com/article/14/use-pure-CSS-to-implement-center+wrap+left-alignment-layout */
.list {
	composes: clean-list from global;

	display: grid;
	grid-template-columns: repeat(auto-fit, @friend-width);
	gap: 40px;
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
