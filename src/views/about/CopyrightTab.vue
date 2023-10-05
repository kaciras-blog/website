<template>
	<PageMeta title='版权声明'/>

	<section class='about-section'>
		<IconSectionHeader
			title='版权声明'
			icon='@/assets/img/copyright.svg'
		/>
		<p>本站文章的许可参见文章末尾的声明。</p>

		<h2>第三方资源</h2>
		<p>网站的图标来自</p>
		<p>
			<a
				class='highlight'
				href='https://www.flaticon.com/'
				title='Flaticon'
			>
				www.flaticon.com
			</a>
		</p>
		<p>
			<a
				class='highlight'
				href='https://icons8.com'
				title='Flaticon'
			>
				icons8.com
			</a>
		</p>
		<p>首页的大图</p>
		<p>
			<a
				class='highlight'
				href='https://www.pixiv.net/artworks/68079722'
			>
				https://www.pixiv.net/artworks/68079722
			</a>
		</p>

		<p>手机版侧边菜单上的图</p>
		<p>
			<a
				class='highlight'
				href='https://www.pixiv.net/artworks/54045756'
			>
				https://www.pixiv.net/artworks/54045756
			</a>
		</p>
	</section>
</template>

<script setup lang="ts">
import IconSectionHeader from "@/components/IconSectionHeader.vue";
import PageMeta from "@/components/PageMeta.ts";
</script>
