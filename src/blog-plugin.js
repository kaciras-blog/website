import SelectCategoryDialog from "./components/SelectCategoryDialog";
import TopNav from "./components/TopNav";
import PageFooter from "./components/PageFooter";
import BasePageLayout from "./components/BasePageLayout";
import BannerPageLayout from "./components/BannerPageLayout";
import PasswordInput from "./components/PasswordInput";
import DiscussSection from "./components/DiscussSection";

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

export default function (Vue) {
	Vue.filter("articleLink", articleLink);
	Vue.filter("categoryLink", categoryLink);

	Vue.component(DiscussSection.name, DiscussSection);
	Vue.component(TopNav.name, TopNav);
	Vue.component(PageFooter.name, PageFooter);
	Vue.component(SelectCategoryDialog.name, SelectCategoryDialog);
	Vue.component(BasePageLayout.name, BasePageLayout);
	Vue.component(BannerPageLayout.name, BannerPageLayout);
	Vue.component(PasswordInput.name, PasswordInput);
}
