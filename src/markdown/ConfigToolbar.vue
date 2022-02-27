<template>
	<div>
		<kx-button class="icon green" title="双列视图" @click="viewModel = 0">
			<SplitIcon/>
		</kx-button>
		<kx-button class="icon green" title="Markdown视图" @click="viewModel = 1">
			<EditIcon/>
		</kx-button>
		<kx-button class="icon green" title="Html视图" @click="viewModel = 2">
			<EyeIcon/>
		</kx-button>

		<kx-button class="primary icon" title="编辑器设置">
			<SettingIcon/>
		</kx-button>
	</div>
</template>

<script setup lang="ts">
import { KxButton } from "@kaciras-blog/uikit";
import SplitIcon from "@material-design-icons/svg/round/vertical_split.svg?sfc";
import EditIcon from "bootstrap-icons/icons/pencil-square.svg?sfc";
import EyeIcon from "bootstrap-icons/icons/eye-fill.svg?sfc";
import SettingIcon from "@material-design-icons/svg/filled/settings.svg?sfc";
</script>
