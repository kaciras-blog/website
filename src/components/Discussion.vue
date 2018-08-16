<template>
	<div class="segment">

		<header class="flex center-align between">
			<!-- 头像和用户名 -->
			<div class='flex margin-horiz' v-if="value.user.id!==0">
				<img src='/image/noface.gif' class='head'>
				<span class='name'>{{value.user.name}}</span>
			</div>
			<div class='flex center-align margin-horiz' v-else>
				<img src='/image/akalin.jpg' class='head'>
				<span class='name'>(匿名评论)</span>
			</div>
			<!-- 右边的楼层号 -->
			<span class="minor-text">{{value.floor}}楼</span>
		</header>

		<p class="content">{{value.content}}</p>

		<div class="flex between minor-text">
			<div class="minor-text tags">
				<!--<span title="暂不支持点赞" class="clickable"><i class="fa fa-thumbs-o-up"></i>{{value.voteCount}}</span>-->
				<!--<span title="暂不支持楼中楼" class="clickable" @click="reply"><i class="far fa-comment"></i>回复(0)</span>-->
			</div>

			<div class="flex center-agign margin-horiz">
				<a v-if="deleteable" @click='deleteDiscussion'><i class="far fa-trash-alt"></i> 删除</a>
				<span>{{value.time}}</span>
			</div>
		</div>

		<div v-if="value.replyCount>0">
			<!--<discussion v-for=""-->
		</div>
		<discz-editor style="margin-left: 6rem" v-if="replying === value.id"/>
	</div>
</template>

<script>
	import api from "../../apis/Api.js";
	import disczEditor from "./DiscuzEditor.vue";

	export default {
		name: "discussion",
		props: ["value"],
		components: {
			disczEditor,
		},
		computed: {
			deleteable() {
				if (!this.loginedUser) return false;
				if (this.loginedUser.id === 1) return true;
				return this.loginedUser.id === this.value.user.id;
			},
			...Vuex.mapState(["loginedUser", "replying"]),
		},
		methods: {
			deleteDiscussion() {
				api.discussion.deleteOne(this.value.id)
					.then(this.$emit("item-removed", this.value))
					.catch(r => alert("删除失败 " + r.message))
			},
			reply() {
				this.$store.commit("replying", this.value.id)
			},
		},
	}
</script>

<style scoped>
	.name {
		font-size: 16px;
		font-weight: 600;
	}
	.tags {
		display: flex;
		align-items: baseline;
	}

	.tags > *:not(:last-child) {
		margin-right: 1em;
	}

	.clickable {
		cursor: pointer;
	}

	.clickable:hover {
		color: #f785d7;
	}

	.content {
		white-space: pre-wrap;
		word-wrap: break-word;
	}
</style>