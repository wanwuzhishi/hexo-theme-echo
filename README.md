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

**三栏响应式布局**

- 左栏：个人名片 / 音乐播放器 / 分类 / 标签
- 中栏：正文，宽度自适应
- 右栏：站点统计 / 文章目录（文章页）或 日历 / 站点信息（列表页）
- 断点：`< 1280px` 收起右栏，目录转为正文内联；`< 1024px` 再收起左栏
- 宽屏（≥ 1680px）布局上限放宽到 `min(92vw, 1840px)`，多出的空间摊进栏距，不留大片空边

**阅读体验**

- 侧栏 `position: sticky` 常驻，目录不会随正文上滑被导航盖住
- 目录高亮跟随滚动，支持 1~3 级深度
- 代码块支持 mac 三色圆点 / 纯色 / 无边框三种风格，带复制按钮与语言角标

**其他**

- 深浅色双主题：跟随系统 + 手动切换 + 刷新不闪屏（`<head>` 内联防抖脚本）
- 站内搜索：`/search.json` 索引，无第三方服务
- 40+ 自绘 SVG 图标（24 网格，stroke 1.7），无图标字体、无 CDN 图标依赖
- 顶部导航横幅、首页 Hero 大图、页脚备案、评论位（默认关闭）

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

---

## 主题配置速览

完整注释见 [`_config.yml`](_config.yml)。常用项：

```yaml
color_scheme: auto        # auto / dark / light
accent: '#5b8cff'         # 主色，改一处全站生效
radius: 14px              # 卡片圆角

layout_width: 1440px      # 三栏总宽（≥1680px 视口会被 92vw 覆盖）
layout_gap: 36px          # 栏间距
main_width: 820px         # 正文列宽
rail_width: 240px         # 侧栏宽度

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

> 提示：侧栏宽度以 `rail.left.width` / `rail.right.width` 为准（全局 `rail_width` 只作默认值）；
> 代码块样式（mac 三色圆点窗口、复制按钮、语言角标）由主题内置，无需配置。

---

## 目录结构

```
themes/echo/
├── _config.yml            主题配置
├── layout/
│   ├── layout.ejs         页面骨架（含 body class 分流）
│   ├── index.ejs          首页
│   ├── post.ejs           文章 / 资源详情
│   ├── page.ejs           独立页面
│   ├── archive.ejs        归档
│   ├── category.ejs       分类
│   ├── tag.ejs            标签
│   ├── article-index.ejs  文章轨列表
│   ├── resource-index.ejs 资源轨列表
│   ├── _partial/          头部、导航、页脚、卡片、分页、搜索、左右栏容器
│   └── _rail/             侧栏组件：名片/音乐/统计/分类/标签/日历/站点信息/目录
├── scripts/
│   ├── helper.js          20 个 echo_* helper + 内置 SVG 图标表
│   ├── resource.js        资源轨 generator + search.json
│   └── articles.js        文章轨 generator
└── source/
    ├── css/echo.css       全部样式
    ├── js/echo.js         主题脚本（主题切换、目录高亮、搜索、播放器…）
    └── images/            avatar / favicon / hero
```

---

## 已知事项

- 字体走 Google Fonts CDN，国内环境建议自托管后替换 `head.ejs` 里的引用
- 音乐播放器未配置音源时整卡不渲染（不会出现按钮全灰的假播放器）
- 未内置评论服务，需要的话在 `layout/_partial/` 下加组件并在 `post.ejs` 引入

---

## 许可

[MIT](LICENSE) © 万物之时
