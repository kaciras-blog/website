const base = require("./config.dev");

base.webpack.mode = "production";

base.webpack.client.devtool = false;
base.webpack.client.cssSourceMap = false;
base.webpack.server.devtool = false;

module.exports = base;
