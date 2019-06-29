import SelectCategoryDialog from "./components/SelectCategoryDialog";
import TopNavBody from "./components/top-nav/TopNavBody";
import TopNav from "./components/top-nav/TopNav";
import TopNavGlass from "./components/top-nav/TopNavGlass";
import PageFooter from "./components/PageFooter";
import BasePageLayout from "./components/BasePageLayout";
import BannerPageLayout from "./components/BannerPageLayout";
import DiscussionSection from "./components/discussion/DiscussionSection";

/**
 * 获取Article对象的完整URL，该URL指向文章页面。
 * URL的形式：/article/{id}/{url}
 *
 * @param id 文章ID
 * @param url 在URL中显示的文章名
 * @return {string} URL中的Path部分。
 */
export function articleLink ({ id, urlTitle }) {
	return `/article/${id}/${urlTitle}`;
}

export function categoryLink ({ id, name }) {
	return `/category/${id}/${name}`;
}

export default function install(Vue) {
	Vue.filter("articleLink", articleLink);
	Vue.filter("categoryLink", categoryLink);

	Vue.component(DiscussionSection.name, DiscussionSection);
	Vue.component(TopNavBody.name, TopNavBody); // 函数式组件无法引用components选项
	Vue.component(TopNav.name, TopNav);
	Vue.component(TopNavGlass.name, TopNavGlass);
	Vue.component(PageFooter.name, PageFooter);
	Vue.component(SelectCategoryDialog.name, SelectCategoryDialog);
	Vue.component(BasePageLayout.name, BasePageLayout);
	Vue.component(BannerPageLayout.name, BannerPageLayout);
}
