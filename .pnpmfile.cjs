function readPackage(packageJson) {
	const { dependencies, peerDependencies } = packageJson;

	if (dependencies["vue-router"]) {
		dependencies["vue-router"] = "4.0.16"
	}
	return packageJson;
}

module.exports = { hooks: { readPackage } };
