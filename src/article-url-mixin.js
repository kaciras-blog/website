/**
 * 获取Article对象的完整URL，该URL指向文章页面。
 * URL的形式：/article/{id}/{url}
 *
 * @param id 文章ID
 * @param url 在URL中显示的文章名
 * @return {string} URL中的Path部分。
 */
function articleLink({ id, urlTitle }) {
	return `/article/${id}/${urlTitle}`;
}

export default articleLink;
