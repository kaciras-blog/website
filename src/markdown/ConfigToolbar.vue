<template>
	<KxButton type='icon' color='info' title='双列视图' @click='viewMode = 0'>
		<SplitIcon/>
	</KxButton>
	<KxButton type='icon' color='info' title='Markdown 视图' @click='viewMode = 1'>
		<EditIcon/>
	</KxButton>
	<KxButton type='icon' color='info' title='预览视图' @click='viewMode = 2'>
		<EyeIcon/>
	</KxButton>
</template>

<script setup lang="ts">
import { toRef } from "vue";
import { KxButton } from "@kaciras-blog/uikit";
import SplitIcon from "@material-design-icons/svg/round/vertical_split.svg?sfc";
import EditIcon from "bootstrap-icons/icons/pencil-square.svg?sfc";
import EyeIcon from "bootstrap-icons/icons/eye-fill.svg?sfc";
import { AddonContext } from "./editor-addon";

interface TextStateGroupProps {
	ctx: AddonContext;
}

const props = defineProps<TextStateGroupProps>();

const viewMode = toRef(props.ctx, "viewMode");
</script>
