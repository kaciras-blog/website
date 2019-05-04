<template>
	<base-page-layout>
		<header :class="$style.header">
			<tab-button
				:class="$style.tab"
				name="Person"
				:active-class="$style.active"
				v-model="subPage">
				关于博主
			</tab-button>
			<tab-button
				:class="$style.tab"
				name="Technology"
				:active-class="$style.active"
				v-model="subPage">
				关于网站
			</tab-button>
		</header>
		<component :is="subPage"/>
	</base-page-layout>
</template>

<script>
import Person from "./Person";
import Technology from "./Technology";
import TabButton from "./TabButton";

export default {
	name: "AboutPage",
	components: {
		TabButton,
		Person,
		Technology,
	},
	data: () => ({
		subPage: "Person",
	}),
};
</script>

<style module lang="less">
@import "../../css/Imports";

.header {
	padding-top: 100px;

	border-bottom: solid 1px @color-border;
	text-align: center;
}

.tab {
	display: inline-block;
	margin-left: -1px;
	margin-bottom: -1px;
	padding: .8em 3rem;

	font-weight: 600;

	border: solid 1px @color-border;
	cursor: pointer;

	&.active {
		border-bottom-color: white;
		color: #0083ff;
	}
}

</style>
