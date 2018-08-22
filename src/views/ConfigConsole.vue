<template>
<div class="flex vertical margin-vert">
	<div class="flex reserve">
		<button class="dangerous round" v-on:click="refreshCategory()"><i class="fa fa-refresh"></i>全部重置</button>
	</div>

	<form class="flex vertical panel">
		<section class="flex vertical margin-vert segment" v-for="(group, name) in configs">
			<h2>{{group.desc}}</h2>

			<div class="flex between center-align" v-for="(property, key) in configs">
				<span>{{property.desc}}</span>

				<div v-if="property.type==='bool'" class="toggle-button">
					<input type="checkbox" @change="putConfig(name,key)" v-model="property.value">
					<label></label>
				</div>

				<div v-if="property.type==='string'">
					<input v-model="property.value">
					<button type="button" @click="putConfig(name,key)">应用</button>
				</div>

				<!--<dropdown v-if="property.type==='enum'" :options="property.options" v-model="property.value"/>-->
			</div>
		</section>
	</form>
</div>
</template>

<script>
import api from "../apis";
// import dropdown from "../../component/Dropdown.vue";

// Vue.component(dropdown.name, dropdown);

export default {
	name: "config",
	data() {
		return {
			configs: {},
		};
	},
	methods: {
		loadConfigs() {
			api.config.getAll().then(configs => this.configs = configs).catch(() => alert("加载失败"));
		},
		putConfig(group, key) {
			const fullKey = group + "." + key;
			api.config.put(fullKey, this.configs[group][key].value);
		},
	},
	created() {
		this.loadConfigs();
	},
};
</script>

<style scoped>

</style>
