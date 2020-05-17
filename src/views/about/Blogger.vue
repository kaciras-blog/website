<template functional>
	<div class="about-tab-page">

		<section class="about-section">
			<div :class="$style.profile">
				<img
					src="../../assets/img/logo-kaciras-circle.svg"
					alt="logo"
					class="head"
				>
				<div>
					<h2>Kaciras</h2>
					<address>Kaciras@protonmail.com</address>
				</div>
			</div>
			<p>
				GitHub: <a class="highlight" href="https://github.com/Kaciras">https://github.com/Kaciras</a>
			</p>
			<ul class="clean-list" :class="$style.tag_list">
				<li>热爱技术</li>
				<li>全栈开发</li>
				<li>冻鳗</li>
				<li>二刺螈</li>
				<li>啥都想学</li>
			</ul>
		</section>

		<section class="about-section">
			<h2>友链</h2>
			加友链的在下面评论即可，需要图片、名称、地址三项。
		</section>

		<discussion-section
			:object-id="0"
			:type="1"
			class="about-section"
			:class="$style.discussion"
		/>
	</div>
</template>

<style module lang="less">
.profile {
	display: grid;
	grid-template-columns: auto 1fr;
	grid-gap: 20px;
	margin-bottom: 1rem;
}

.tag_list {
	display: flex;
	flex-wrap: wrap;
	line-height: 1.5;

	& > li:not(:first-child)::before {
		content: "/";
		padding: 0 5px;
	}
}

.discussion {
	font-size: 14px; // 这里还得改回来...
}
</style>
