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
@import "../../css/Imports";

.container {
	padding: 0 5vw;
	font-size: initial;

	@media screen and (min-width: @length-screen-mobile) {
		padding: 0 15vw;
	}
	@media screen and (min-width: @length-screen-wide) {
		padding: 0 25vw;
	}
}

.blogger {
	padding: 300px 0;
}
.tags {

}
</style>
