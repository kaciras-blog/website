<template>
	<div>
		<div class="buttons">
			<button>确定</button>
		</div>
		<details class="slide" v-for="slide of slides" :key="slide.tid">
			<summary>
				{{slide.name}}
				<i class="fas fa-arrows-alt" @click.stop></i>
				<i class="fas fa-trash" @click.stop></i>
			</summary>
			<div>
				<img :src="slide.picture" @click="setPicture(slide)"/>
				<label>
					描述
					<textarea class="input" v-model="slide.description"></textarea>
				</label>
				<label>
					标题
					<input v-model="slide.name"/>
				</label>
				<label>
					连接
					<input v-model="slide.link"/>
				</label>
			</div>
		</details>
	</div>
</template>

<script>
import api from "../apis";

export default {
	name: "SwiperConsole",
	data: () => ({
		slides: [],
	}),
	methods:{
		setPicture(slide) {

		},
	},
	beforeMount() {
		api.recommend.swiper.get().then(slides => this.slides = slides);
	},
};
</script>

<style scoped lang="less">
@import "../css/ToBeImpoert";

.slide {
	border: solid 1px #6abdff;
	cursor: pointer;
	margin-bottom: 1rem;

	& ::-webkit-details-marker, ::-moz-list-bullet {
		color: red;
	}

	& > summary{
		line-height: 2.6rem;
		background-color: #adf0ff;

		& > i {
			float: right;
			cursor: move;
			background-color: wheat;
			height: 100%;
			width: 2.6rem;
		}
	}
}
</style>
