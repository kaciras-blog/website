const base = require("./config.dev");

base.mode = "production";

base.client.devtool = false;
base.client.cssSourceMap = false;
base.server.devtool = false;

module.exports = base;
