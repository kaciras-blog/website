# Kaciras Blog 评论说明

# 编辑器

为了适配不同的设备和场景，本站拥有 3 种编辑器：

![简易编辑框](/editor-demo/embed.webp)

![移动端编页面](/editor-demo/mobile.webp?vw=257&vh=450)

![完整版编辑器](/editor-demo/standalone.webp)

评论区默认的编辑器在宽屏下是一个简易的编辑框，在移动端会弹出编辑页面，这两种编辑器较简单，适用于短评论。

在宽屏下点击`完整版编辑器`按钮将加载功能更丰富的编辑器，适用于写较长的评论。因为该编辑器体积较大，所以没有作为首选。

关于编辑器以及扩展语法的实现见 [https://github.com/kaciras-blog/markdown](https://github.com/kaciras-blog/markdown)。

# 扩展的 Markdown

本站使用了自定义的 Markdown，下称 KFM（Kaciras Flavored Markdown），兼容标准的 Markdown 语法，同时添加了一些新的功能，以下仅介绍自定义的部分。

## 禁止 HTML

KFM 不支持在 Markdown 里直接写 HTML，虽然某些功能的语法与 HTML 相似。

## 更多的媒体类型

标准的 Markdown 并不支持视频音频等媒体元素，KFM 中使用了自定义的语法来表示它们。

### 视频

方括号内是视频的封面图的 URL，如果留空则由浏览器自动选择。视频无法自动播放，只能由用户点击开始。

@video[](/editor-demo/video.mp4)

### 视频作为动态图

传统的 GIF 图片算法落后，很多平台已经用视频来替换它们，KFM 也支持这种做法。GIF 视频默认是静音的，且会自动播放。

GIF 和普通的图片都可以在 URL 参数种使用 `vw` 和 `vh` 设置尺寸，从而避免布局抖动。

@gif[GIF 视频](/editor-demo/video.mp4?vw=420&vh=420)

### 音频

@audio[音频标签](/editor-demo/audio.mp3)

## 折叠块

折叠块使用与 HTML 相似的语法，不过要求 `<summary>` 必须在第一行。该功能是由单独的解析器实现，而非开启了 HTML 功能。

<details>
<summary>
点击折叠块的标题部分切换开关。
</summary>
里头是内容。
</details>
