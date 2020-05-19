<template>
	<section>
		<h1>友情链接</h1>
		<ul class="clean-list" :class="$style.list">
			<li
				v-for="friend of friends"
				:key="friend.id"
				:class="$style.item"
			>
				<a
					:href="friend.url"
					target="_blank"
					:class="$style.friend_container"
				>
					<img
						:src="friend.background"
						alt="favicon"
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
					v-if="user.id === 2"
					title="删除"
					:class="$style.remove"
					@click="() => rupture(friend)"
				/>
			</li>

			<li
				v-if="user.id === 2"
				:class="$style.hexagon_add"
			>
				<img
					src="../../assets/img/hexagon-add.svg"
					alt="添加友链"
					title="添加友链"
					role="button"
					:class="$style.hexagon_add_image"
					@click="makeFriend"
				>
			</li>
		</ul>
	</section>
</template>

<script>
import { mapState } from "vuex";
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
	},
};
</script>

<style module lang="less">
@import "../../css/imports";

// 手机屏是否需要缩小点，一排两个？

@background-width: 260px;
@background-height: @background-width * 9 / 16;
@favicon-size: 70px;
@transition: transform .5s;

.list {
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
		background: rgba(255, 255, 255, .5);
		transition: @transition;
	}

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
	box-shadow: 0 0 10px rgba(0, 0, 0, .3);
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

// =====================================================

.hexagon_add {
	composes: item;
	padding: 35px;
}

.hexagon_add_image {
	width: 90px;
	height: 90px;

	opacity: .15;
	cursor: pointer;
	transition: opacity .3s ease;

	&:hover, &:active { opacity: .8; }
}
</style>
