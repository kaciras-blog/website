<template>
	<BasePageLayout>
		<PageMeta title="用户" :body-class="$style.pageLayout"/>

		<div :class="$style.body">
			<form :class="$style.card" class="panel">
				<h2>修改用户信息</h2>

				<div :class="[$style.headSection, $style.field]">
					<img
						:class="$style.head"
						alt="头像"
						title="换头像"
						:src="user.avatar ?? DEFAULT_AVATAR"
						@click="changeAvatar"
					>
				</div>

				<div :class="$style.field">
					ID:
					<AuthTypeTag :type="user.auth"/>
					{{ user.id }}
				</div>

				<div :class="$style.field">
					<label for="name" :class="$style.label">用户名</label>
					<input
						id="name"
						v-model="user.name"
						name="name"
						:class="$style.input"
					>
				</div>

				<KxButton class="primary" @click="save">保存</KxButton>
			</form>
		</div>
	</BasePageLayout>
</template>

<script setup lang="ts">
import { shallowReactive, toRaw } from "vue";
import { KxButton, openFile, useDialog } from "@kaciras-blog/uikit";
import api from "@/api";
import { DEFAULT_AVATAR } from "@/common";
import { useCurrentUser } from "@/store";
import { errorMessage } from "@/utils";
import BasePageLayout from "@/components/BasePageLayout.vue";
import AuthTypeTag from "./AuthTypeTag.vue";
import PageMeta from "@/components/PageMeta";

const globalUser = useCurrentUser();
const dialog = useDialog();

const user = shallowReactive(globalUser.$state);

async function changeAvatar() {
	const image = await openFile("image/*");
	const session = dialog.cropImage({
		image,
		aspectRatio: 1,
	});
	const cropped = await session.confirmPromise;
	user.avatar = await api.media.uploadImage(cropped);
}

async function save() {
	try {
		await api.user.updateProfile(toRaw(user));
		globalUser.$state = user;
		dialog.alertSuccess("保存成功");
	} catch (e) {
		dialog.alertError("保存失败", errorMessage(e));
	}
}
</script>

<style module lang="less">
@import "../../css/imports";

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

.label,
.input {
	display: block;
	width: 100%;
}

.label {
	color: @color-text-minor;
	margin-bottom: 5px;
}

.head {
	.circle(8rem);
	border: dashed 4px transparent;
	cursor: pointer;
	transition: border-color .2s;

	&:hover, &:active {
		border-color: #39afff;
	}
}
</style>
