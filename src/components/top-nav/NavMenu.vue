<template>
	<div :class="$style.container">
		<div :class="$style.header">
			<div :class="$style.header_content">
				<img
					src="@/assets/img/logo-kaciras-circle.svg"
					alt="Kaciras' Blog"
					class="head"
					:class="$style.head"
				>
				<p :class="$style.name">Kaciras' Blog</p>
			</div>
		</div>

		<div :class="$style.body">
			<router-link to="/" :class="$style.item">
				<HomeIcon/>
				首页
			</router-link>
			<router-link to="/list" :class="$style.item">
				<ListIcon/>
				文章
			</router-link>
			<router-link to="/about/me" :class="$style.item">
				<CopyrightIcon/>
				关于
			</router-link>
			<a href="/feed/rss" :class="$style.item">
				<RssIcon/>
				Feed 订阅
			</a>
			<div :class="$style.item" @click="showSettingFrame">
				<SettingIcon/>
				设置
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import HomeIcon from "@material-design-icons/svg/filled/home.svg?sfc";
import ListIcon from "bootstrap-icons/icons/list.svg?sfc";
import CopyrightIcon from "@material-design-icons/svg/filled/copyright.svg?sfc";
import RssIcon from "@material-design-icons/svg/filled/rss_feed.svg?sfc";
import SettingIcon from "@material-design-icons/svg/filled/settings.svg?sfc";
import SettingFrame from "./SettingFrame.vue";
import { useDialog } from "@kaciras-blog/uikit";

const dialog = useDialog();

function showSettingFrame() {
	dialog.show(SettingFrame);
}
</script>

<style module lang="less">
.container {
	display: flex;
	flex-direction: column;
	background: white;

	font-size: 16px; /* TODO: hack */
}

.header {
	background: url("../../assets/img/54045756_p0.png");
	background-size: cover;
}

.header_content {
	padding: 35px 0;
	color: black;
	background: rgba(255, 255, 255, .15);
	text-align: center;
}

.name {
	font-size: 20px;
	margin: 10px 0 0 0;
}

.body {
	flex-grow: 1;
	padding: 10px 0;
}

.item {
	composes: clean-link from global;

	display: block;
	padding: 10px 0;

	& > svg {
		font-size: 24px;
		vertical-align: -6px;
		margin: 0 1pc;
	}

	&:hover, &:focus {
		background-color: rgba(0, 0, 0, .05);
	}
}
</style>
