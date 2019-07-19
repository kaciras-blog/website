<template>
	<section>
		<h1>友情链接</h1>
		<ul class="clean-list">

			<li v-for="item of friends"
				:key="item.randomId"
				:class="$style.item"
			>
				<img :src="item.favicon" alt="favicon">
				{{item.name}}
			</li>
			<!--<li :class="$style.cell"></li>-->
			<!--<li :class="$style.cell"></li>-->
			<!--<li :class="$style.cell"></li>-->
			<!--<li :class="$style.cell"></li>-->
			<!--<li :class="$style.cell"></li>-->
			<li  @click="makeFriends">
				<svg class="svg-grid" style="width: 64px; height: 83.1384px; background-color: rgb(102, 102, 102);">
					<polygon points="16,0 48,0 64,28 48,56 16,56 0,28" class="svg-cell"
							 style="fill: rgb(255, 255, 255); stroke: rgb(51, 51, 51); stroke-width: 1px;"></polygon>
				</svg>
			</li>
		</ul>
	</section>
</template>

<script>
import api from "@/api";
import MakeFriendDialog from "@/views/index/MakeFriendDialog";

export default {
	name: "FriendsSection",
	data() {
		return { friends: this.$store.state.prefetch.friends };
	},
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

<style lang="less">
.svg-grid {
	background-color: #666;
}

.svg-cell {
	fill: #fff;
	stroke: #666;
	stroke-width: 1;
}

.svg-cell:focus {
	outline: none;
}

.svg-cell:hover {
	fill: #ff0000;
}
</style>

<style module lang="less">
.item {
	width: 200px;
	height: 200px;
	padding: 32px;
}
</style>
