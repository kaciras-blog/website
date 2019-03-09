<template>
	<page-layout :class="$style.pageLayout" view-id="profile">
		<div :class="$style.card" class="panel">
			<h2>修改用户信息</h2>
			<div :class="[$style.headSection, $style.field]">
				<img
					:class="$style.head"
					alt="头像"
					title="点击换头像"
					:src="user.head"
					@click="editHead">
			</div>
			<div :class="$style.field">
				用户ID:
				<auth-type-tag :auth-type="user.authType"/>
				{{user.id}}
			</div>
			<div :class="$style.field">
				<label :class="$style.label">用户名</label>
				<input :class="$style.input" name="name" v-model="user.name">
			</div>
			<kx-button class="primary" @click="save">保存</kx-button>
		</div>
	</page-layout>
</template>

<script>
import api from "../../api";
import { openFile } from "kx-ui/src/helpers";
import AvatarCropper from "./AvatarCropper";
import AuthTypeTag from "./AuthTypeTag";

export default {
	name: "Page",
	components: { AuthTypeTag },
	data () {
		return { user: this.$store.state.user };
	},
	methods: {
		async editHead () {
			const files = await openFile(false, "image/*");
			const reader = new FileReader();
			reader.onload = (event) => {
				this.$dialog.show(AvatarCropper, { src: event.target.result });
			};
			reader.readAsDataURL(files[0]);
		},
		save () {
			api.user.updateProfile(this.user);
		},
	},
};
</script>

<style module lang="less">
@import "../../css/Imports";

.pageLayout {
	display: flex;
	flex-direction: column;
	min-height: 100vh;
}

:global(#profile) {
	padding-top: 4rem;
	flex: 1;
	background-color: #FDFDFD;
}

.card {
	width: 20rem;
	margin: 0 auto;
	padding: 1rem;

	display: flex;
	flex-direction: column;
}

.headSection {
	text-align: center;
}

.field {
	margin-bottom: 1rem;
}

.label, .input  {
	display: block;
	width: 100%;
}

.label {
	color: @color-text-minor;
	margin-bottom: .5em;
}

.head {
	.circle(8rem);
	cursor: pointer;
}
</style>
