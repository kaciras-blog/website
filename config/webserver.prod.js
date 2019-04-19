const config = require("./webserver");

const { webpack, server, blog } = config;
webpack.mode = "production";
webpack.client.devtool = "source-map";
webpack.client.cssSourceMap = false;

delete server.httpsPort;
server.certificate = "/etc/letsencrypt/live/blog.kaciras.net/cert.pem";
server.privatekey = "/etc/letsencrypt/live/blog.kaciras.net/privkey.pem";

blog.imageRoot = "./image";

module.exports = config;
