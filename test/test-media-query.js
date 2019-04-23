import { MediaQueryPlugin, mediaQueryModule } from "../src/store/media-query";
import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";

test("$mediaMatch", () => {
	const localVue = createLocalVue();
	localVue.use(Vuex);
	localVue.use(MediaQueryPlugin);

	const store = new Vuex.Store(mediaQueryModule);
	const wrapper = shallowMount({ render(h) { return h("div"); } }, { localVue, store });

	expect(wrapper.vm.$mediaMatch("wide")).toBe(true);
	expect(wrapper.vm.$mediaMatch("desktop")).toBe(false);
});

