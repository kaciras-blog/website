<template>
	<section>
		<h1>友情链接</h1>
		<ul class="clean-list" :class="$style.list">
			<li
				v-for="item of friends"
				:key="item.randomId"
			>
				<a :href="item.url" :class="$style.item">
					<img
						:src="item.favicon"
						alt="favicon"
						:class="$style.favicon"
					>
					<div :class="$style.name">{{item.name}}</div>
				</a>
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

export default {
	name: "FriendsSection",
	data() {
		return { friends: this.$store.state.prefetch.friends };
	},
	computed: mapState(["user"]),
	methods: {
		async makeFriends() {
			const result = await this.$dialog.show(MakeFriendDialog);
			if (!result.isConfirm) {
				return;
			}
			const newFriend = await api.friend.makeFriends(result.data);
			this.friends.push(newFriend);
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
	composes: clean-link from global;
	display: block;
	padding: 20px;
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
