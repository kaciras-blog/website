<template>
	<section>
		<h1>友情链接</h1>
		<ul class="clean-list" :class="$style.list">
			<li
				v-for="friend of friends"
				:key="friend.id"
				:class="$style.item"
			>
				<a :href="friend.url" class="clean-link">
					<img
						:src="friend.favicon"
						alt="favicon"
						:class="$style.favicon"
					>
					<div :class="$style.name">{{friend.name}}</div>
				</a>
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
					@click="makeFriends"
				>
			</li>
		</ul>
	</section>
</template>

<script>
import api from "@/api";
import MakeFriendDialog from "@/views/index/MakeFriendDialog";
import { mapState } from "vuex";
import { deleteOn } from "@/utils";

export default {
	name: "FriendsSection",
	data() {
		return {
			friends: this.$store.state.prefetch.friends,
		};
	},
	computed: mapState(["user"]),
	methods: {
		async makeFriends() {
			const result = await this.$dialog.show(MakeFriendDialog);
			if (!result.isConfirm) {
				return;
			}
			try {
				const friend = await api.friend.makeFriends(result.data);
				this.friends.push(friend);
			} catch (e) {
				this.$dialog.alertError(e.message);
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
.list {
	display: flex;
	flex-wrap: wrap;
}

.item {
	position: relative;
	padding: 20px;

	&:hover, &:focus {
		& > .remove {
			opacity: 1;
			transform: scale(1);
		}
	}
}

.remove {
	position: absolute;
	top: 10px;
	right: 10px;
	width: 30px;
	height: 30px;
	border-radius: 100%;

	background-image: url("~@kaciras-blog/uikit/src/assets/icon-close.svg");
	background-position: 50%;
	opacity: 0;
	cursor: pointer;

	transform: scale(0.25);
	transition: .3s;
}

.favicon {
	width: 120px;
	height: 120px;
}

.name {
	width: 120px;
	padding: 10px 0;

	font-size: 16px;
	text-align: center;
	word-wrap: break-word;
}

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
