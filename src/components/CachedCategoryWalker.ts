import api, { Category } from "@/api";

interface CategoryWithChildren extends Category {
	children: Category[];
}

/**
 * 在浏览分类树时经常要在各个节点之间切换，故做一个缓存提升流畅性。
 */
export default class CachedCategoryWalker {

	current: Category | null = null;

	children: Category[] | null = null;

	private readonly cache = new Map<number, CategoryWithChildren>();

	// 因为父分类的 children 属性包含了该分类所以也要删除
	invalidCache(category: Category) {
		this.cache.delete(category.id);
		this.cache.delete(category.parent);
	}

	gotoParent() {
		return this.gotoId(this.current!.parent);
	}

	goto(category: Category | CategoryWithChildren | number) {
		return typeof category === "number" ? this.gotoId(category) : this.gotoObject(category);
	}

	private async gotoId(id: number) {
		let category = this.cache.get(id);

		if (!category) {
			category = await api.category.findById(id, true) as CategoryWithChildren;
			this.cache.set(0, category);
		}

		this.current = category;
		this.children = category.children;
	}

	private async gotoObject(category: Category | CategoryWithChildren) {
		this.current = category;

		if ("children" in category) {
			this.children = category.children;
		} else {
			const children = await api.category.getChildren(category.id);
			this.children = children;
			(category as CategoryWithChildren).children = children;
		}

		this.cache.set(category.id, category as CategoryWithChildren);
	}
}
