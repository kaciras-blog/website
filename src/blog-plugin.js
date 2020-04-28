import SelectCategoryDialog from "./components/SelectCategoryDialog";
import TopNavBody from "./components/top-nav/TopNavBody";
import TopNav from "./components/top-nav/TopNav";
import TopNavGlass from "./components/top-nav/TopNavGlass";
import PageFooter from "./components/PageFooter";
import BasePageLayout from "./components/BasePageLayout";
import BannerPageLayout from "./components/BannerPageLayout";
import DiscussionSection from "./components/discussion/DiscussionSection";
import IconParagraph from "./components/IconParagraph";
import IconSectionHeader from "./components/IconSectionHeader";

import { format } from "date-fns";

/**
 * 获取该文章所在页面的的完整路径。
 * 格式：/article/{id}/{url}
 *
 * @param id 文章ID
 * @param url 在URL中显示的文章名
 * @return {string} 完整路径。
 */
export function articleLink({ id, urlTitle }) {
	return `/article/${id}/${urlTitle}`;
}

export function categoryLink({ id, name }) {
	return `/category/${id}/${name}`;
}

export default function install(Vue) {
	Vue.filter("localDate", timestamp => format(timestamp, "yyyy-M-d"));
	Vue.filter("localDateMinute", timestamp => format(timestamp, "yyyy-M-d HH:mm"));

	Vue.filter("articleLink", articleLink);
	Vue.filter("categoryLink", categoryLink);

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
}
