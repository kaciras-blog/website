<template>
	<div :class='$style.container'>
		<div :class='$style.header'>
			<img
				src='/avatar.png'
				alt='Kaciras" Blog'
				class='head'
			>
			<p :class='$style.name'>Kaciras' Blog</p>
		</div>

		<div :class='$style.body'>
			<RouterLink to='/' :class='$style.item'>
				<HomeIcon fill='#0099ff'/>
				首页
			</RouterLink>
			<RouterLink to='/list/0' :class='$style.item'>
				<ListIcon/>
				文章
			</RouterLink>
			<RouterLink to='/about/me' :class='$style.item'>
				<CopyrightIcon fill='#01AD20'/>
				关于
			</RouterLink>
			<a href='/feed/rss' :class='$style.item'>
				<RssIcon fill='#eb8a34'/>
				Feed 订阅
			</a>
			<div :class='$style.item' @click='showSettingFrame'>
				<SettingIcon fill='#3961ff'/>
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
	padding: 35px 0;
	text-align: center;

	/* 无需套元素也能实现半透明遮罩。 */
	background: url("../../assets/img/54045756_p0.png") rgba(255, 255, 255, .15);
	background-size: cover;
	background-blend-mode: overlay;
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
	padding: 12px 0;

	& > svg {
		font-size: 24px;
		vertical-align: -7px;
		margin: 0 1pc;
	}

	&:hover, &:focus {
		background-color: rgba(0, 0, 0, .05);
	}
}
</style>
