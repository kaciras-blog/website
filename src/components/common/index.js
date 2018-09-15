/**
 * 自动注册目录下的Vue组件。
 *
 * @param Vue Vue类型，使用Vue.use()来注册该插件
 */
export default function install(Vue) {
	const requireContext = require.context(".", false,  /.vue$/);
	requireContext.keys().forEach(file => {
		const component = requireContext(file).default;
		Vue.component(component.name, component);
	});
}
