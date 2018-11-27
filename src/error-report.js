if (process.env.NODE_ENV === "production") {

	self.addEventListener("error", event => {
		// 上报错误信息
		// 常用的属性：
		// event.message
		// event.filename
		// event.lineno
		// event.colno
		// event.error.stack
	});

	self.addEventListener("unhandledrejection", event => {
		// 上报错误信息
		// 常用的属性：
		// event.reason
	});
}
