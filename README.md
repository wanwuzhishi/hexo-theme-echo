# Echo

> 一个自建的 Hexo 主题：**影视 / 游戏 / MOD / 汉化资源** 与 **技术文章** 双轨分流，三栏响应式布局，深浅色自适应，零前端框架、零构建步骤。

Echo 不是通用博客主题，它是为「资源站 + 博客」混合形态设计的：

- 写文章时它是博客 —— 目录、阅读进度、版权块、上下篇导航齐全；
- 在 front-matter 里加一行 `resource.enable: true`，这篇就会自动进资源库 —— 封面卡片、网盘直链、版本/平台/语言字段；
- 两条轨互不干扰：`/articles/` 只收普通文章，`/resources/` 只收资源帖。

---

## 特性

**双轨内容分流**

- `resource.enable: true` 的文章自动进入资源轨，其余进文章轨
- 资源库支持多类型独立分页：`/resources/movie/`、`/resources/game/`、`/resources/mod/` …
- 类型可自由增删，图标来自主题内置图标集
- 侧栏会**按页面类型自动过滤**：文章 / 资源详情页只保留统计与目录，其余页面显示全部启用组件

**三栏响应式布局**

- 左栏：个人名片 / 音乐播放器 / 分类 / 标签
- 中栏：正文，宽度自适应
- 右栏：站点统计 / 文章目录（文章页）或 日历 / 站点信息（列表页）
- 断点：`< 1280px` 收起右栏，目录转为正文内联；`< 1024px` 再收起左栏；`< 900px` 导航折叠为抽屉菜单
- 宽屏（≥ 1680px）中栏上限放宽到 `main_width_wide`（默认 1240px），随视口在 `main_width` ~ 该值之间伸缩

**阅读体验**

- 侧栏 `position: sticky` 常驻，目录不会随正文上滑被导航盖住
- 目录高亮跟随滚动，支持 1~3 级深度
- 代码块自带语言角标与一键复制

**其他**

- 深浅色双主题：跟随系统 + 手动切换 + 刷新不闪屏（`<head>` 内联防抖脚本）
- 浅色主题下顶部横幅自动换成明亮的浅蓝底、深色文字，不出现割裂感
- 站内搜索：`/search.json` 索引，无第三方服务
- 51 个自绘 SVG 图标（24 网格，stroke 1.7），无图标字体、无 CDN 图标依赖
- 首页 Hero 大图、页脚备案、内置 giscus 评论

---

## 安装

```bash
cd your-hexo-site
git clone https://github.com/wanwuzhishi/hexo-theme-echo.git themes/echo
```

在站点 `_config.yml` 里启用：

```yaml
theme: echo
```

安装依赖（站点级）：

```bash
npm i hexo-renderer-ejs hexo-pagination
```

> 主题的分页生成器依赖 `hexo-pagination`，缺失会直接报错。

---

## 站点级配置

两个内容轨在**站点** `_config.yml` 定义，不在主题配置里：

```yaml
# --- 资源板块 ---
resources:
  path: resources          # 资源库根路径
  per_page: 12
  types:
    - key: movie
      name: 影视资源
      icon: film
    - key: game
      name: 游戏资源
      icon: gamepad
    - key: mod
      name: 游戏 MOD
      icon: puzzle
    - key: translation
      name: MOD 汉化
      icon: language
    - key: software
      name: 软件工具
      icon: app
    - key: other
      name: 其他资源
      icon: box

# --- 文章板块 ---
articles:
  path: articles
  per_page: 12
```

生成的路由：

| 路径 | 说明 |
| --- | --- |
| `/resources/` | 全部资源（分页） |
| `/resources/<key>/` | 单个类型（分页） |
| `/articles/` | 普通文章列表（分页） |
| `/search.json` | 搜索索引 |

---

## 写一篇资源帖

在 front-matter 里打开 `resource` 即可：

```yaml
---
title: 某某游戏 中文汉化版
date: 2026-01-01 12:00:00
cover: /images/covers/xxx.jpg
tags: [汉化, 单机]
categories: [游戏]
resource:
  enable: true
  type: translation      # 对应 resources.types 里的 key
  version: v1.2.0
  platform: Windows
  size: 4.2 GB
  language: 简体中文
  updated: 2026-01-01
  poster: /images/covers/xxx.png   # 详情页左侧竖版海报，可选
  info:                  # 详情页「作品信息表」，渲染在海报右侧
    中文名: 某某游戏
    年份: 2026
    制作: 某某工作室
  password: ''           # 提取码，可选
  links:
    - name: 百度网盘
      url: https://pan.baidu.com/s/xxxx
    - name: 夸克网盘
      url: https://pan.quark.cn/s/xxxx
---
```

- `type` 写错或留空会落到 `other`
- `links` 第一个链接变成卡片上的主按钮，其余折叠成「全部 N 个链接」
- 卡片上显示哪些字段，由主题配置 `resource.show_fields` 控制
- 详情页是「左侧海报 + 右侧（字段摘要条 + 作品信息表）」双栏。没写 `poster`
  会回退用 `cover`（按原图比例显示）；两者都没写就只显示右栏内容。
  海报宽度与比例见主题配置 `resource.poster_enable` / `poster_width` / `poster_ratio`
- 作品信息写在 `resource.info`（键即行名，值支持字符串或数组），
  **不要写在正文里**——正文表格进不了双栏，用 JS 搬运会有布局闪帧

---

## 主题配置速览

完整注释见 [`_config.yml`](_config.yml)。常用项：

```yaml
color_scheme: auto        # auto / dark / light
radius: 14px              # 卡片圆角

# 配色：只填想改的项，其余由 accent 自动派生
colors:
  accent: '#5b8cff'       # 主色，改一处全站联动
  # banner_light: '#dbeafe'   # 浅色主题横幅底色

layout_width: 1440px      # 三栏总宽
layout_gap: 36px          # 栏间距
main_width: 820px         # 正文列宽
main_width_wide: 1240px   # ≥1680px 视口下正文的封顶宽度
rail_width: 240px         # 侧栏默认宽度

favicon: /images/favicon.svg   # 标签栏图标，站点 _config.yml 的 favicon 优先

hero:                     # 首页大图
  enable: true
  image: /images/hero.svg
  height: 520px
  overlay: 0.42

rail:
  enable: true
  left:  { enable: true, width: 260px }
  right: { enable: true, width: 260px }

toc:
  enable: true
  depth: 3
```

个人名片、社交图标、网盘配色等全部可配，详见 [`_config.yml`](_config.yml)（每项都带中文注释）。

> 提示：侧栏宽度以 `rail.left.width` / `rail.right.width` 为准（全局 `rail_width` 只作默认值）。

## 内容排序

在文章 / 资源的 front-matter 里加下面两个字段，即可自定义它们在列表中的顺序（数值越小越靠前）：

```yaml
order: 1          # 全局排序：在 /articles/ 或 /resources/ 总列表里优先置顶
category_order: 2 # 分类内排序：在所属分类页 / 资源类型页里优先置顶
```

规则：

- 设置了排序值的文章 / 资源排在最前（按数值升序），其余按时间倒序。
- `order` 作用于**全局总列表**；`category_order` 作用于**该内容所在的分类页 / 资源类型页**（文章分类页未设置 `category_order` 时回退到 `order`，再回退时间）。
- 两个字段都缺省时，维持默认的「时间倒序」。

---

## 相邻文章

主题自带上一篇 / 下一篇导航，**按内容轨分流**：文章只在文章轨内前后翻，
资源帖只在资源轨内前后翻，两边互不串联。排序规则与列表页一致
（先 `order` / `category_order`，未设置的按时间倒序）。

开关在主题配置 `post.prev_next`，单篇可在 front-matter 里覆盖。

---

## 目录结构

```
themes/echo/
├── _config.yml            主题配置（14 个功能区块，逐项带中文注释）
├── layout/
│   ├── layout.ejs         页面骨架（含主题属性输出）
│   ├── index.ejs          首页
│   ├── post.ejs           文章 / 资源详情（两者共用，靠 resource.enable 分流）
│   ├── page.ejs           独立页面
│   ├── archive.ejs        归档
│   ├── category.ejs       分类
│   ├── tag.ejs            标签
│   ├── article-index.ejs  文章轨列表
│   ├── resource-index.ejs 资源轨列表
│   ├── _partial/          头部、导航、页脚、卡片、分页、搜索、上下篇、作品信息、评论区
│   └── _rail/             侧栏组件：名片/音乐/统计/分类/标签/日历/站点信息/目录
├── scripts/
│   ├── helper.js          21 个 echo_* helper + 51 个内置 SVG 图标
│   ├── resource.js        资源轨 generator + search.json
│   ├── articles.js        文章轨 generator
│   └── category.js        分类页 generator
└── source/
    ├── css/echo.css       全部样式
    ├── js/echo.js         主题脚本（主题切换、目录高亮、搜索、播放器…）
    └── images/            avatar / favicon / hero
```

---

## 已知事项

- 字体走 Google Fonts CDN，国内环境建议自托管后替换 `head.ejs` 里的引用
- 音乐播放器未配置音源时整卡不渲染（不会出现按钮全灰的假播放器）
- 评论用 giscus，需先在自己指定的公开仓库装好 giscus app 并开启 Discussions，
  再把拿到的配置填进主题 `comments.giscus`；详细步骤见指南第六篇
- 主题仓库里是**通用默认值**，个人图片路径与站点信息建议写在站点 `_config.yml` 里覆盖，
  这样更新主题时不会冲突

---

## 使用指南

站内有一套完整的六篇指南（认识主题 / 安装配置 / 布局配色 / 资源帖 /
写作规范 / 侧栏与 FAQ），发布后位于站点的 `/categories/主题指南/`。

---

## 许可

[MIT](LICENSE) © 万物之时
