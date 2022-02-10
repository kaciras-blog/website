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

import DEFAULT_AVATAR from "@/assets/img/akalin.jpg";
import DEFAULT_COVER from "@/assets/img/placeholder.png";

export { DEFAULT_AVATAR, DEFAULT_COVER };

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

	Vue.component("DiscussionSection", DiscussionSection);
	Vue.component("TopNavBody", TopNavBody);
	Vue.component("TopNav", TopNav);
	Vue.component("TopNavGlass", TopNavGlass);
	Vue.component("PageFooter", PageFooter);
	Vue.component("SelectCategoryDialog", SelectCategoryDialog);
	Vue.component("BasePageLayout", BasePageLayout);
	Vue.component("BannerPageLayout", BannerPageLayout);
	Vue.component("IconParagraph", IconParagraph);
	Vue.component("IconSectionHeader", IconSectionHeader);
	Vue.component("SocialLink", SocialLink);
	Vue.component("SettingPanel", SettingPanel);
}
