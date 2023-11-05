<template>
	<MarkdownEditor v-model='content' class='full-vertex'>
		<template #toolbar-left>
			<!-- 虽然不是工具栏的组件，但还是放这免得根节点变成片段。-->
			<PageMeta title='编写评论' body-class=''/>

			<BaseSyntaxWeights></BaseSyntaxWeights>
			<MediaWeights></MediaWeights>
		</template>
		<template #toolbar-right>
			<label
				title='名字（可选，最多 16 字）'
				:class='$style.name'
			>
				<img
					:class='$style.icon'
					class='head'
					alt='头像'
					:src='user.avatar ?? DEFAULT_AVATAR'
				>
				<input
					v-model='nickname'
					name='nickname'
					:class='$style.input'
					:maxlength='USERNAME_LENGTH'
					:placeholder='user.name'
				>
			</label>

			<label
				title='邮箱（可选，用于回复提醒）'
				:class='$style.name'
			>
				<EnvelopeIcon :class='$style.icon'/>
				<input
					v-model='email'
					type='email'
					name='email'
					:class='$style.input'
				>
			</label>

			<VerticalSeparator/>
			<ConfigWeights></ConfigWeights>

			<KxButton
				:class='$style.submit'
				type='icon'
				@click='handleSubmit'
			>
				<PaperPlaneIcon/>
				发表
			</KxButton>
		</template>
		<template #status-right>
			<SelectionWeight></SelectionWeight>
		</template>
	</MarkdownEditor>
</template>

<script setup lang="ts">
import { KxButton, useDialog } from "@kaciras-blog/uikit";
import { useRoute } from "vue-router";
import EnvelopeIcon from "bootstrap-icons/icons/envelope.svg?sfc";
import PaperPlaneIcon from "@/assets/icon/paper-plane.svg?sfc";
import PageMeta from "@/components/PageMeta.ts";
import { useDiscussContext } from "@/components/discussion/editor-api.ts";
import {
	BaseSyntaxWeights,
	ConfigWeights,
	MarkdownEditor,
	MediaWeights,
	SelectionWeight,
	VerticalSeparator,
} from "@kaciras-blog/markdown-vue";
import { DEFAULT_AVATAR, USERNAME_LENGTH } from "@/common.ts";
import { validateInt } from "@/utils.ts";
import { useCurrentUser } from "@/store/index.ts";

const { objectId, type, parent = 0 } = useRoute().query;
const dialog = useDialog();
const user = useCurrentUser();

const { nickname, email, content, submit } = useDiscussContext({
	parent: validateInt(parent),
	type: validateInt(type),
	objectId: validateInt(objectId),
});

async function handleSubmit() {
	await submit();
	await dialog.alertSuccess("提交成功", "由于还未实现评论导航，请手动刷新原页面。");
	window.close();
}
</script>

<style module lang='less'>
.name {
	margin: 4px 8px;
}

.icon {
	margin-right: 4px;
	width: 24px;
	height: 24px;
	vertical-align: middle;
}

.input {
	padding: 4px 6px;
	vertical-align: middle;
	background: white;
}

.submit {
	font-size: 16px;
	gap: 4px;
	border-radius: 0;

	& > svg {
		font-size: 20px;
	}
}
</style>
