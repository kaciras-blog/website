<template>
	<kx-button type="icon" color="info" title="双列视图" @click="context.viewMode = 0">
		<SplitIcon/>
	</kx-button>
	<kx-button type="icon" color="info" title="Markdown视图" @click="context.viewMode = 1">
		<EditIcon/>
	</kx-button>
	<kx-button type="icon" color="info" title="Html视图" @click="context.viewMode = 2">
		<EyeIcon/>
	</kx-button>
</template>

<script setup lang="ts">
import { KxButton } from "@kaciras-blog/uikit";
import SplitIcon from "@material-design-icons/svg/round/vertical_split.svg?sfc";
import EditIcon from "bootstrap-icons/icons/pencil-square.svg?sfc";
import EyeIcon from "bootstrap-icons/icons/eye-fill.svg?sfc";
import { useEditorContext } from "@/markdown/editor-addon";

const context = useEditorContext();
</script>
