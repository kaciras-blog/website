/**
 *
 */
export interface ListQueryView<T> {
	items: T[];
	total: number;
}

/**
 * 表示分页请求，包括起点、数量、排序三个属性。
 */
export interface Pageable {

	/** 分页的起点，默认为0 */
	start?: number;

	/** 数量没有默认值，应当始终指定该项 */
	count: number;

	/**
	 * 排序方式，格式 <字段>,<ASC | DESC>
	 * 例如："create_time,DESC"
	 * 如果没有指定则使用服务端的默认排序。
	 */
	sort?: string;
}
