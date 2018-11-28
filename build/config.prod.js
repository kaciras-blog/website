const base = require("./config.dev");

base.mode = "production";

base.client.devtool = false;
base.server.devtool = false;

module.exports = base;
