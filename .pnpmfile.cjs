function readPackage(packageJson) {
	const { dependencies, peerDependencies } = packageJson;

	if (dependencies["vue-router"]) {
		dependencies["vue-router"] = "4.0.16"
	}

	// https://github.com/vuejs/core/issues/6651
	if (dependencies["vue"]) {
		dependencies["vue"] = "3.2.37"
	}
	if (dependencies["@vue/server-renderer"]) {
		dependencies["@vue/server-renderer"] = "3.2.37"
	}
	return packageJson;
}

module.exports = { hooks: { readPackage } };
