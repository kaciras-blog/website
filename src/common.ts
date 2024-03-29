import { Article } from "@/api/index.ts";

import DEFAULT_AVATAR from "@/assets/img/akalin.jpg";
import DEFAULT_COVER from "@/assets/img/placeholder.png";
import CATEGORY_IMG from "@/assets/img/category.png";

export { DEFAULT_AVATAR, DEFAULT_COVER, CATEGORY_IMG };

export const USERNAME_LENGTH = 16;

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
