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
				<a
					v-else
					:href="friend.url"
					target="_blank"
					:class="[
						{ [$style.active]: !sorting },
						$style.friend_container,
					]"
					@mousedown="drag($event, friend)"
				>
					<img
						:src="friend.background"
						alt="background"
						:class="$style.background"
					>
					<img
						:src="friend.favicon"
						alt="favicon"
						:class="$style.favicon"
					>
					<span :class="$style.name">{{friend.name}}</span>
				</a>

				<!-- 没有更新按钮，更新 = 删除 + 添加 -->
				<button
					v-if="user.id === 2 && !sorting"
					title="删除"
					:class="$style.remove"
					@click="rupture(friend)"
				/>
			</li>
		</ul>

		<div
			v-if="dragging"
			:class="$style.friend_container"
			:style="dragging.style"
		>
			<img
				:src="dragging.background"
				alt="background"
				:class="$style.background"
			>
			<img
				:src="dragging.favicon"
				alt="favicon"
				:class="$style.favicon"
			>
			<span :class="$style.name">{{dragging.name}}</span>
		</div>
	</section>
</template>

<script>
import { mapState } from "vuex";
import { elementPosition, observeMouseMove } from "@kaciras-blog/uikit/src/index";
import api from "@/api";
import { deleteOn, errorMessage } from "@/utils";
import FriendInfoDialog from "./FriendInfoDialog";

const DEFAULT_INFO = {
	name: "",
	url: "",
	background: "/static/img/placeholder.png",
	favicon: "/static/img/akalin.jpg",
};

export default {
	name: "FriendsSection",
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
			const { friends } = this;
			event.preventDefault();

			const listEl = this.$refs.list;
			let i = friends.indexOf(current);

			const region = listEl.getBoundingClientRect();
			const el = listEl.children[i];

			const gap = 40;
			const rect = el.getBoundingClientRect();
			const columns = Math.floor((region.width + gap) / (rect.width + gap));
			const rows = Math.ceil(friends.length / columns);

			const lrPadding = (region.width - (columns * rect.width) - (columns - 1) * gap) / 2;

			this.dragging = {
				...current,
				id: Symbol(),
				style: {
					position: "absolute",
					top: rect.top + pageYOffset + "px",
					left: rect.left + pageXOffset + "px",
					cursor: "grabbing",
				},
			};

			friends[i] = { isPlaceholder: true };

			function insertInto(k) {
				if (i === k) return;
				const holder = friends.splice(i, 1)[0];
				i = k;
				friends.splice(k, 0, holder);
			}

			observeMouseMove().pipe(elementPosition(event, el)).subscribe({

				/**
				 * 置换取决于被拖动元素的纵坐标：
				 *     小于 cards 中第一个元素中心：插入到最前
				 *     大于第N个元素中心、小于第N+1个： 插入到N之后
				 *     大于最后一个元素中心：添加到最后
				 *
				 * @param x 被拖动元素新的横坐标
				 * @param y 被拖动元素新的纵坐标
				 */
				next: ({ x, y }) => {
					this.dragging.style.left = x + "px";
					this.dragging.style.top = y + "px";

					let c = Math.round((x - region.left - lrPadding) / 300);
					let r = Math.round((y - region.top - pageYOffset) / (146.25 + 40));

					c = Math.max(0, Math.min(columns - 1, c));
					r = Math.max(0, Math.min(rows - 1, r));
					insertInto(Math.min(r * columns + c, friends.length - 1));
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

// 手机屏是否需要缩小点，一排两个？
@background-width: 260px;
@background-height: @background-width * 9 / 16;
@favicon-size: 70px;
@transition: transform .5s;

.title {
	font-size: 2rem;
}

// 自动网格的卡片布局
// https://blog.kaciras.com/article/14/use-pure-CSS-to-implement-center+wrap+left-alignment-layout
.list {
	composes: clean-list from global;

	display: grid;
	grid-template-columns: repeat(auto-fit, @background-width);
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

// =====================================================

.friend_container {
	display: block;
	position: relative;
	width: @background-width;
	height: @background-height;

	// 默认是拖动状态
	cursor: grab;

	border-radius: 4px;
	overflow: hidden;

	&::before {
		content: "";
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		height: 50%;

		z-index: 1;
		background: rgba(255, 255, 255, .4);
		transition: @transition;
	}
}

&.active {
	cursor: revert;

	@media screen and (min-width: @length-screen-mobile) {
		@ty: (@background-height + @favicon-size) / -2;

		&:hover::before { transform: translateY(@ty); }

		&:hover > .favicon { transform: translateY(@ty); }

		&:hover > .name { transform: translateY(100%); }
	}
}

.background {
	composes: full-vertex from global;
	width: 100%;
	height: 100%;
}

.favicon {
	position: absolute;
	left: (@background-width - @favicon-size) / 2;
	top: (@background-height - @favicon-size) / 2;
	.circle(@favicon-size);

	z-index: 3;
	box-shadow: 0 0 10px rgba(0, 0, 0, .4);
	transition: @transition;
}

.name {
	position: absolute;
	left: 0;
	right: 0;
	bottom: 0;
	height: 50%;

	font-size: 16px;
	padding-top: @background-height / 2 - 28px;
	padding-bottom: 8px;
	text-align: center;

	color: black;
	background: rgba(255, 255, 255, .9);
	box-shadow: 0 0 10px rgba(0, 0, 0, .3);

	transition: @transition;
}

.placeholder {
	width: @background-width;
	height: @background-height;
	border: solid 3px #94f2ca;
}
</style>
