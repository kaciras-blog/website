# Kaciras Flavored Markdown

该页面是 Kaciras Flavored Markdown (KFM) 的演示，所有插入的图片和视频等均保存在内存中。

[https://github.com/kaciras-blog/markdown](https://github.com/kaciras-blog/markdown)

Markdown 是一种轻量级的标记语言，可用于将格式设置元素添加到纯文本文档中。Markdown 由John Gruber 于 2004 年创建，如今已成为世界上最受欢迎的标记语言之一，特别是程序员喜欢使用。

# 标准 Markdown 语法

## 换行

在 Markdown 中，使用一个以上的空行来表示换行，即按两下回车。

## 标题

使用 # 创建标题可以支持最多 6 级标题。你需要几级标题就输入几个 # 号，然后再输入一个空格。

不建议使用 5 级和 6 级标题，层次太深会影响阅读，如果遇到需要的情况应考虑调整文章结构。

# h1 Heading
## h2 Heading
### h3 Heading
#### h4 Heading
##### h5 Heading
###### h6 Heading

## 横线

___

---

***

## 字体效果

**两个星号表示加粗。**

__两个下划线也表示加粗。__

*单个星号表示斜体，注意斜体是拉丁字母的形变，不适合方块字。*

_单个下划线也表示斜体。_

***三个星号或下划线包围的文本又粗又斜。***

~~两个波浪号表示删除。~~

## 引用块

在段落的开头添加一个 >, 然后再键入一个空格。块引用可以嵌套。

> Blockquotes can also be nested...
>> ...by using additional greater-than signs right next to each other...
> > > ...or with spaces between arrows.

## 列表

+ 以 `+`、 `-` 或 `*` 开头的行是无序列表。
+ 用至少两个空格缩进来表示下级项：
    - 同一级的项必须具有相同的缩进。
        * 项目 1
        + 项目 2
        - 项目 3
+ Very easy!

1. 以数字加点加空格（如 `1. `）开头的行是有序列表。
2. Consectetur adipiscing elit
3. Integer molestie lorem at massa

## 链接

创建链接时。首先再方括号中填写链接文本（例如[链接名称]），然后再紧跟方括号的括号（例如(https://www.baidu.com/)）中填写链接地址URL。

[这个链接指向本项目的 GitHub 仓库](https://github.com/kaciras-blog/markdown)

## 图片

要添加图片，请在链接的前面添加感叹号（!），然后在括号中添加替代文本，并在括号中添加图片资源的路径或URL。

KFM 为图片添加了额外的参数 `vw` 和 `vh` 分别设置图片缩放的宽高，同时依靠它们预先分配位置避免布局抖动。

![这是图片的标签](./image.png?vw=400&vh=400)

## 脚注

脚注使您可以添加注释和参考，而不会使文档正文混乱。创建脚注时，带有脚注引用的链接将出现带有链接的上标编号。读者可以单击链接跳至页面底部的脚注内容。

这是测试脚注[^标识符]。

这是数字脚注[^1]。这是文字脚注[^文本脚注]

[^标识符]: 标识符可以是数字或文本。但不能包含空格或制表符。
[^1]: [脚注通常是一个链接](https://example.com)。
[^文本脚注]: Gruber, John (8 January 2014). [The Markdown File Extension](https://daringfireball.net/linked/2014/01/08/markdown-extension)

## 表格

要添加表格，请使用三个或多个连字符 — 创建每列的标题，并使用竖线 | 分隔每列。表格语法较为复杂，建议先用支持补全的 IDE 或是使用生成器写好，然后再复制过来。

| 编码                             |   体积    | Butteraugli |
|--------------------------------|:-------:|-------------|
| 原图                             | 68.7 KB | 0           |
| MozJPEG                        | 109 KB  | 15.00       |
| pngquant                       | 29.6 KB | 0.621       |
| WebP                           | 84.9 KB | 7.60        |
| AVIF                           | 19.5KB  | 13.55       |
| AVIF 无损                        | 44.2KB  | 0           |
| AVIF + YUV444                  | 19.7KB  | 4.45        | 
| [内层支持行内语法](http://example.com) | 24.2 KB | 0           |

## 行内代码

要将段落中的函数或其他表达式表示为代码，请将其括在反引号 ` 中，当然也可以用它来高亮单词。

`main()` 函数中调用 `printf()` 函数。

## 代码块

多行代码可以使用代码块进行展示。在需要展示的代码之前和之后的行上使用三个反引号 ``` ；如果需要高亮显示，请指定对应的语言，诸如C、typescript、JAVA、Python 等等。

标准的 Markdown 还支持以缩进表示的代码块，但由于其容易混淆，这里并不建议使用。

```typescript
/**
 * 激活 Markdown 元素，返回一个清理函数，卸载组件后记得调用哦。
 */
export function activate(el: HTMLElement) {
	activateCopyButtons(el);
	return observeLazyLoad(el);
}
```

## 转义

Markdown 使用很多字符表示特定的意思，要显示原义字符，请在字符的前面添加反斜杠 \ ,这样就可以转义字符了。

\#### 使用反斜杠，这就是 4 个 # 号而不是 4 级标题。

# KFM 额外支持的语法

## 大纲

单独一行仅包含 `[[TOC]]` 表示在此处插入大纲，大纲是以列表形式展示的标题链接。

[[TOC]]

## 更多的媒体类型

标准的 Markdown 并不支持视频音频等媒体元素，KFM 中使用了自定义的语法来表示它们。

### 视频

方括号内是视频的封面，如果留空则由浏览器自动选择。视频无法自动播放，只能由用户点击开始。

@video[./poster.png](./video.mp4)

### 视频作为动态图

传统的 GIF 图片算法落后，很多平台已经用视频来替换它们，KFM 也支持这种做法。GIF 视频默认是静音的，且会自动播放。

GIF 和普通的图片一样，支持用 `vw` 和 `vh` URL 参数设置尺寸。

@gif[GIF 视频](./gif-video.mp4?vw=420&vh=420)

### 音频

@audio[](./audio.mp3)
