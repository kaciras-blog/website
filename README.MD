# Kaciras Blog

![Screenshot](https://github.com/kaciras-blog/website/raw/master/screenshot.png)

简洁、美观、流畅的个人网站：[https://blog.kaciras.com](https://blog.kaciras.com)

# 特性

📝  使用Markdown编写文章，支持上传图片、上传视频、LaTeX

🚀  支持PWA技术，页面加载丝滑顺畅

🌱  支持Vue的服务端渲染，SEO友好，首屏无白屏

🔧 自带后台和Markdown编辑器

# 使用

系统需求：

* NodeJS >= 14.0.0
* 运行时需要和后端服务通信，故先要启动 [content-server](https://github.com/kaciras-blog/content-server)

浏览器支持：
* MicrosoftEdge >= 16
* Firefox >= 52
* Chrome >= 57
* Safari >= 10.3
* Opera >= 44
* IE 全部不支持

安装并启动具有热重载的服务器

```shell script
yarn install
yarn serve
```

构建

```shell script
yarn build
```

启动服务器，生产模式

```shell script
yarn start
```

`serve`, `build` 和 `start`, 默认使用 config/index.js 作为配置，可使用 `--profile=prod` 参数来指定配置文件为 config/prod.js
