const base = require("./config.dev");

base.webpack.mode = "production";
base.webpack.client.devtool = false;
base.webpack.client.cssSourceMap = false;
base.webpack.server.devtool = false;

base.server.certificate = "/etc/letsencrypt/live/blog.kaciras.net/cert.pem";
base.server.privatekey = "/etc/letsencrypt/live/blog.kaciras.net/privkey.pem";

base.blog.imageRoot = "./image";

module.exports = base;
