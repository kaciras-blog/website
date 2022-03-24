# Kaciras Blog

![Screenshot](https://github.com/kaciras-blog/website/raw/master/screenshot.png)

简洁、美观、流畅的个人网站：[https://blog.kaciras.com](https://blog.kaciras.com)

# 特性

📝  使用 Markdown 编写文章，支持图片、视频、KaTeX。

🚀  支持 PWA，页面加载丝滑顺畅，还能离线访问。

🌱  支持 Vue 的服务端渲染，SEO 友好，首次访问无白屏。

🔧  自带后台和 Markdown 编辑器。

🎬  支持存储媒体文件，能够自动优化上传的图片。

# 使用

**TODO: 本项目启动复杂，需要简化**

系统需求：

* NodeJS >= 17.0.0
* 运行时需要和后端服务通信，故先要运行[content-server](https://github.com/kaciras-blog/content-server)

浏览器支持：

* Microsoft Edge >= 80
* Firefox >= 74
* Chrome >= 80
* Safari >= 13.1
* IOS >= 13.4
* IE 全部都不支持

安装并启动具有热重载的服务器

```shell script
pnpm install
pnpm serve
```

构建

```shell script
pnpm build
```

启动服务器，生产模式

```shell script
pnpm start
```

`serve`, `build` 和 `start`, 默认使用 config/index.js 作为配置，可使用 `--profile=prod` 参数来指定配置文件为 config/prod.js
