const config = require("./webserver");

const { webpack, blog } = config;
webpack.mode = "production";
webpack.client.devtool = "source-map";
webpack.client.cssSourceMap = false;

config.server = {
	tls: {
		certFile: "/etc/letsencrypt/live/blog.kaciras.net/cert.pem",
		keyFile: "/etc/letsencrypt/live/blog.kaciras.net/privkey.pem",
	},
	httpRedirect: true,
};

blog.imageRoot = "./image";

module.exports = config;
