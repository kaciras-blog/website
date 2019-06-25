<template>
	<base-page-layout :class="$style.pageLayout">
		<div :class="$style.body">
			<div :class="$style.card" class="panel">
				<h2>修改用户信息</h2>
				<div :class="[$style.headSection, $style.field]">
					<img
						:class="$style.head"
						alt="头像"
						title="点击换头像"
						:src="user.head"
						@click="editHead"
					>
				</div>
				<div :class="$style.field">
					ID:
					<auth-type-tag :auth-type="user.authType"/>
					{{user.id}}
				</div>

				<div :class="$style.field">
					<label for="name" :class="$style.label">用户名</label>
					<input id="name"
						   v-model="user.name"
						   name="name"
						   :class="$style.input">
				</div>

				<kx-button class="primary" @click="save">保存</kx-button>
			</div>
		</div>
	</base-page-layout>
</template>

<script>
import api from "../../api";
import AuthTypeTag from "./AuthTypeTag";
import AvatarCropper from "./AvatarCropper";
import { errorMessage } from "../../utils";

export default {
	name: "UserProfilePage",
	components: {
		AuthTypeTag,
	},
	data() {
		return { user: this.$store.state.user };
	},
	methods: {
		async editHead() {
			const result = await this.$dialog.show(AvatarCropper);
			if (result.isConfirm)
				this.user.head = result.data;
		},
		async save() {
			try {
				await api.user.updateProfile(this.user);
				this.$dialog.alertSuccess("保存成功");
			} catch (e) {
				this.$dialog.alertError("保存失败", errorMessage(e));
			}
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

.body {
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

.label, .input {
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
