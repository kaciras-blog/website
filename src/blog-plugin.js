import SelectCategoryDialog from "./components/SelectCategoryDialog";
import TopNav from "./components/TopNav";
import PageFooter from "./components/PageFooter";
import PageLayout from "./components/PageLayout";
import MessageBox from "./components/common/KxMessageBox";

/**
 * 获取Article对象的完整URL，该URL指向文章页面。
 * URL的形式：/article/{id}/{url}
 *
 * @param id 文章ID
 * @param url 在URL中显示的文章名
 * @return {string} URL中的Path部分。
 */
export function articleLink({ id, urlTitle }) {
	return `/article/${id}/${urlTitle}`;
}

export function categoryLink({ id, name }) {
	return `/category/${id}/${name}`;
}

export default function (Vue) {
	Vue.filter("articleLink", articleLink);
	Vue.filter("categoryLink", categoryLink);

	Vue.component(TopNav.name, TopNav);
	Vue.component(PageFooter.name, PageFooter);
	Vue.component(SelectCategoryDialog.name, SelectCategoryDialog);
	Vue.component(PageLayout.name, PageLayout);
	Vue.component(MessageBox.name, MessageBox);

	/**
	 * 弹出一个简单的消息对话框。
	 *
	 * @param title 消息框的标题，或者一个对象包含了所有参数，如果使用了对象那么
	 *                 后面的参数将无效。
	 * @param content    消息框的内容
	 * @param type 类型，error、warn 或 info（默认）
	 * @param cancelable 是否显示取消按钮和右上角的关闭
	 * @param dimmerClose 点击遮罩是否关闭窗口
	 *
	 * @return Promise<Boolean> 一个Promise，指示了窗口的状态和用户操作的结果，如果接受了true说
	 *                             明用户点击了确定，false则点击了取消、遮罩或关闭按钮。
	 */
	Vue.prototype.$dialog.messageBox = function (title, content, type, cancelable, dimmerClose) {
		//使用对象传递的参数
		if (typeof title === "object") {
			return this.$dialog.show(MessageBox, title);
		}
		return this.$dialog.show(MessageBox, { title, content, type, cancelable, dimmerClose });
	};
}
