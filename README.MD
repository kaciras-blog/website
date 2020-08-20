# Kaciras Blog

![Screenshot](https://github.com/kaciras-blog/website/raw/master/screenshot.png)

简洁、美观、流畅的个人网站：[https://blog.kaciras.com](https://blog.kaciras.com)

# 特性

📝  使用Markdown编写文章，支持图片、视频、KaTeX

🚀  支持PWA技术，页面加载丝滑顺畅，还能离线访问

🌱  支持Vue的服务端渲染，SEO友好，首屏无白屏

🔧  自带后台和Markdown编辑器

🎬  支持存储媒体文件，能够自动优化上传的图片

# 使用

**TODO: 本项目启动复杂，需要简化**

系统需求：

* NodeJS >= 14.0.0
* 运行时需要和后端服务通信，故先要运行[content-server](https://github.com/kaciras-blog/content-server)

浏览器支持：
* Firefox >= 52
* Chrome >= 57
* Safari >= 10.3
* Opera >= 44
* MicrosoftEdge >= 79
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
