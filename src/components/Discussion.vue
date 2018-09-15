<template>
	<div class="segment">
		<header class="discuss-header">
			<!-- 头像和用户名 -->
			<div class='flex margin-horiz' v-if="value.user.id!==0">
				<img src='/image/noface.gif' class='small head'>
				<span class='name'>{{value.user.name}}</span>
			</div>
			<div class='flex center-align margin-horiz' v-else>
				<img src='/image/akalin.jpg' class='small head'>
				<span class='name'>(匿名评论)</span>
			</div>
			<!-- 右边的楼层号 -->
			<span class="minor-text">{{value.floor}}楼</span>
		</header>

		<div class="content">{{value.content}}</div>

		<div class="minor-text metas">
			<div>
				<!--<span title="暂不支持点赞" class="clickable meta"><i class="fa fa-thumbs-o-up"></i>{{value.voteCount}}</span>-->
				<span title="暂不支持楼中楼"
					  class="clickable meta"
					  @click="reply"><i class="far fa-comment"></i>回复(0)</span>
			</div>
			<div>
				<span v-if="deleteable"
					  class="clickable meta"
					  @click='remove'><i class="far fa-trash-alt"></i>删除</span>
				<time>{{value.time}}</time>
			</div>
		</div>

		<div v-if="value.replyCount>0">
			<!--<discussion v-for=""-->
		</div>
		<discz-editor style="margin-left: 6rem" v-if="replying === value.id"/>
	</div>
</template>

<script>
import api from "../apis";
import DisczEditor from "./DiscuzEditor.vue";
import Vuex from "vuex";

export default {
	name: "Discussion",
	props: ["value", "replying"],
	components: {
		DisczEditor,
	},
	computed: {
		deleteable() {
			if (!this.user) return false;
			if (this.user.id === 1) return true;
			return this.user.id === this.value.user.id;
		},
		...Vuex.mapState(["user"]),
	},
	methods: {
		remove() {
			api.discussion.deleteOne(this.value.id)
				.then(this.$emit("item-removed", this.value))
				.catch(r => alert("删除失败 " + r.message));
		},
		reply() {
			this.$emit("reply", this.value.id);
		},
	},
};
</script>

<style scoped>
.name {
	font-size: 16px;
	font-weight: 600;
}

.metas {
	display: flex;
	justify-content: space-between;
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
	margin-top: 1rem;
	margin-bottom: 1rem;
	white-space: pre-wrap;
	word-wrap: break-word;
}

.discuss-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
}
</style>
