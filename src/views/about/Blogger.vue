<template functional>
	<div :class="$style.container">
		<section :class="$style.blogger">

			<h2>Kaciras（这是网名）</h2>
			<address>Kaciras@outlook.com</address>
		</section>
		<section :class="$style.tags">
			<h2>标签</h2>
			<p>热爱技术，</p>
		</section>
	</div>
</template>

<style module lang="less">
.container {
	padding: 0 10vw;
}

.blogger {
	padding: 300px 15vw;
}
.tags {

}
</style>
