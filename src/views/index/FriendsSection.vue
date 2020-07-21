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
				<div v-if="friend.isPlaceholder"/>
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
				item: current,
				style: {
					position: "absolute",
					top: rect.top + pageYOffset + "px",
					left: rect.left + pageXOffset + "px",
					zIndex: 10,
					cursor: "grabbing",
				},
			};

			friends[i] = { id: Symbol(), isPlaceholder: true };

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
</style>
