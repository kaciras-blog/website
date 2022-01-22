import { App } from "vue";
import { format } from "date-fns";
import { Article } from "@/api";

import SelectCategoryDialog from "./components/SelectCategoryDialog.vue";
import TopNavBody from "./components/top-nav/TopNavBody.vue";
import TopNav from "./components/top-nav/TopNav.vue";
import TopNavGlass from "./components/top-nav/TopNavGlass.vue";
import SettingPanel from "./components/top-nav/SettingPanel.vue";
import PageFooter from "./components/PageFooter.vue";
import BasePageLayout from "./components/BasePageLayout.vue";
import BannerPageLayout from "./components/BannerPageLayout.vue";
import DiscussionSection from "./components/discussion/DiscussionSection.vue";
import IconParagraph from "./components/IconParagraph.vue";
import IconSectionHeader from "./components/IconSectionHeader.vue";
import SocialLink from "./components/SocialLink.vue";

/**
 * 获取文章所在页面的的完整路径。
 * 格式：/article/{id}/{url}
 *
 * @param id 文章ID
 * @param url 在URL中显示的文章名
 * @return 完整路径。
 */
export function articleLink({ id, urlTitle }: Article) {
	return `/article/${id}/${urlTitle}`;
}

export function localDate(timestamp: number) {
	return format(timestamp, "yyyy-M-d");
}

export function localDateMinute(timestamp: number) {
	return format(timestamp, "yyyy-M-d HH:mm");
}

export default function install(Vue: App) {
	// Vue.filter("localDate", (timestamp: number) => format(timestamp, "yyyy-M-d"));
	// Vue.filter("localDateMinute", (timestamp: number) => format(timestamp, "yyyy-M-d HH:mm"));
	// Vue.filter("articleLink", articleLink);

	Vue.component(DiscussionSection.name, DiscussionSection);
	Vue.component(TopNavBody.name, TopNavBody);
	Vue.component(TopNav.name, TopNav);
	Vue.component(TopNavGlass.name, TopNavGlass);
	Vue.component(PageFooter.name, PageFooter);
	Vue.component(SelectCategoryDialog.name, SelectCategoryDialog);
	Vue.component(BasePageLayout.name, BasePageLayout);
	Vue.component(BannerPageLayout.name, BannerPageLayout);
	Vue.component(IconParagraph.name, IconParagraph);
	Vue.component(IconSectionHeader.name, IconSectionHeader);
	Vue.component(SocialLink.name, SocialLink);

	// Vue 函数组件里不能导入 component 只能在这全局挂载了
	Vue.component(SettingPanel.name, SettingPanel);
}
