<template functional>
	<div class="about-tab-page">

		<section class="about-section" :class="$style.blogger">
			<img src="../../assets/img/logo-kaciras-circle.svg" alt="头像" class="head">
			<div>
				<h2>Kaciras（这是网名）</h2>
				<address>Kaciras@outlook.com</address>
			</div>
		</section>

		<section class="about-section">
			<h2>标签</h2>
			<ul class="list" :class="$style.tag_list">
				<li>热爱技术</li>
				<li>冻鳗</li>
				<li>二刺螈</li>
			</ul>
		</section>

		<discussion-section
			:object-id="0"
			:type="1"
			class="about-section"
			:class="$style.discussion"/>
	</div>
</template>

<style module lang="less">
.blogger {
	display: grid;
	grid-template-columns: auto 1fr;
	grid-gap: 20px;
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
