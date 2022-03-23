export enum ViewMode {
	Split,
	Edit,
	Preview,
}

export interface AddonContext {
	content: string;
	selection: [number, number];
	viewMode: ViewMode;
	scrollSynced: boolean;
}

/**
 * 替换编辑器内一段区域内的文本，并选中替换的部分。
 *
 * @param context 编辑上下文
 * @param start 替换起点
 * @param end 替换终点
 * @param value 替换的文本
 */
export function overwrite(
	context: AddonContext,
	start: number,
	end: number,
	value: string,
) {
	const v = context.content;
	context.content = v.substring(0, start) + value + v.substring(end, v.length);
	context.selection = [start, start + value.length];
}
