export class VueMultiWatcher {

	constructor(vm, paths, callback, options) {
		this.vm = vm;
		this.callback = callback;
		this.once = options.once;
		this.unwatchs = paths.map(path => vm.$watch(path, () => this.handleEvent(), options));
	}

	handleEvent(newVal, oldVal) {
		const { vm, once, callback } = this;
		if (once) {
			this.unwatch();
		}
		callback.call(vm, newVal, oldVal);
	}

	unwatch() {
		this.unwatchs.forEach(unwatch => unwatch());
	}
}

/**
 * 元素拖动。
 *
 * @param el {Element} 元素
 * @param startX {number} 起始X坐标
 * @param startY {number} 起始Y坐标
 * @param onDragging {Function} 回调，在拖动中不断调用
 * @return {Promise} 在拖动结束后resolve
 */
export function drag(el, startX, startY, onDragging) {
	const clientRect = el.getBoundingClientRect();

	//按住时窗口的左上角坐标
	const originX = clientRect.left;
	const originY = clientRect.top;

	// 如果没有指定回调，则默认修改元素样式实现拖动
	if (!onDragging) {
		const { style } = el;

		onDragging = function (newX, newY) {
			style.left = newX + "px";
			style.top = newY + "px";
		};
		style.position = "absolute";
		style.top = originY + "px";
		style.left = originX + "px";
	}

	const onMove = event => {
		event.preventDefault();
		const { clientX, clientY } = event.touches && event.touches.length > 0
			? event.touches[0] : event;

		const newX = originX + clientX - startX;
		const newY = originY + clientY - startY;
		onDragging(newX, newY);
	};

	return new Promise(resolve => {
		const onUp = event => {
			event.preventDefault();
			document.removeEventListener("mousemove", onMove);
			document.removeEventListener("touchmove", onMove);
			document.removeEventListener("mouseup", onUp);
			document.removeEventListener("touchend", onUp);
			resolve();
		};
		document.addEventListener("mousemove", onMove);
		document.addEventListener("touchmove", onMove);
		document.addEventListener("mouseup", onUp);
		document.addEventListener("touchend", onUp);
	});
}
