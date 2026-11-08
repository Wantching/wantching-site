# Wantching 个人网站建设项目——完整上下文与工作交接

核对日期：2026-11-08（北京时间）  
项目目录：`E:\projects\wantching-site`  
文档状态：已依据本地实际目录、源码、依赖锁定文件及现有构建产物更新。

本文件保留原交接材料中的项目目标、审美偏好和后续需求，同时用本次检查结果更新当前状态。**当前文件事实以本地项目为准；后续规划不代表已经实现。**

本次工作是重新整理交接文档。网站源码保持原样，包括已发现的 Notes 重复内容；本文件单独保存在新增的 `_handoff` 目录中。

## 一、项目背景与最终目标

我正在从零搭建一个打算长期使用的个人网站，未来可能绑定自己的独立域名 `wantching.com`。

此前已有的网站和仓库为：

- 网站：[https://wantching.github.io/](https://wantching.github.io/)
- GitHub 仓库：[Wantching/Wantching.github.io](https://github.com/Wantching/Wantching.github.io)

以上地址来自原交接材料，本次没有联网核验线上状态。

旧网站基于 AcademicPages，而 AcademicPages 衍生自 Minimal Mistakes，底层使用 Jekyll。我喜欢旧网站的部分视觉风格，但不希望继续继承它的大量学术页面、占位内容、示例和自定义配置。

已经确定的技术路线是：

**使用 Jekyll + 官方 Minimal Mistakes 主题，在现有的干净项目上继续建设。**

旧网站暂时保留。等新网站完成并验收后，再考虑替换原 GitHub Pages 网站；不要直接修改、删除或覆盖旧网站的仓库和线上内容。

### 网站定位

这是一个**以个人博客为核心，兼顾知识记录、个人时间线和访客交流的长期个人网站**。

主要目标：

1. 长期发表中文和英文博客文章。
2. 记录学习、生活、想法与思考。
3. 整理学习笔记，暂不优先建设复杂知识库。
4. 通过 Timeline 记录人生经历与重要事件。
5. 设置能够实际留言的 Guestbook。
6. 支持网站界面中英文切换。
7. 保持设计简洁、维护方便、发布文章步骤少。

不再建设独立的 About 和 Projects 一级栏目。个人介绍由首页承担，技术项目和研究成果可以通过 Blog 或 Notes 展示。

## 二、实际目录结构与文件顺序

### 项目位置

Windows 路径：

```text
E:\projects\wantching-site
```

对应的 WSL 路径：

```text
/mnt/e/projects/wantching-site
```

父目录实际是 `projects`，不是 `project`。

### 当前目录树

下列结构依据本地目录整理。`_site` 仅展开主要构建产物；`_handoff` 是本次生成文档时新增的目录。

```text
wantching-site/
├── _data/
│   └── navigation.yml
├── _drafts/                         # 空目录
├── _handoff/                        # 本次新增：交接文档
│   └── 2026-11-08-Wantching-项目上下文与工作交接.md
├── _includes/                       # 空目录
├── _layouts/                        # 空目录
├── _pages/
│   ├── blog.md
│   ├── guestbook.md
│   ├── notes.md
│   └── timeline.md
├── _posts/                          # 空目录，尚未发布文章
├── _sass/                           # 空目录
├── _site/                           # 已有的自动生成结果
│   ├── assets/
│   │   ├── css/
│   │   └── js/
│   ├── blog/
│   │   └── index.html
│   ├── guestbook/
│   │   └── index.html
│   ├── notes/
│   │   └── index.html
│   ├── timeline/
│   │   └── index.html
│   ├── feed.xml
│   ├── index.html
│   ├── robots.txt
│   └── sitemap.xml
├── .jekyll-cache/                   # 已有构建缓存，内部未展开
├── assets/
│   └── css/                         # 空目录
├── _config.yml
├── Gemfile
├── Gemfile.lock
└── index.md
```

需要区分三种顺序：

- **目录展示顺序**：`_pages` 中的文件按名称排列为 `blog.md`、`guestbook.md`、`notes.md`、`timeline.md`。
- **网站导航顺序**：由 `_data/navigation.yml` 决定，当前是 **Home → Blog → Notes → Timeline → Guestbook**。
- **功能建设优先级**：Blog、Home、Timeline、Guestbook、Notes；这是需求优先级，不等于导航排列顺序。

原交接文本写过 `Home → Blog → Timeline → Notes → Guestbook`。本版已依据实际导航配置更新为 **Notes 在 Timeline 前面**。

### 已确认不存在的项目文件或目录

本次检查时：

- 没有 `_pages/about.md`、`_pages/projects.md`。
- 没有 `_data/timeline.yml`。
- 没有 `_includes/footer/custom.html`。
- 没有 `assets/js/`，因此没有 `assets/js/language.js`。
- 没有项目自定义 CSS、Sass 或布局文件；对应源码目录目前为空。
- 没有 `.git`、`.gitignore`、`.github/workflows/`、`CNAME`。

`_site/assets/` 中虽然有 CSS、JavaScript 和搜索相关脚本，但这些是已有构建输出，不能据此认定项目已经编写了自定义样式、实现界面语言切换或启用了完整搜索功能。

## 三、当前栏目、导航与页面状态

目前保留五个一级栏目，顺序以实际导航配置为准：

| 顺序 | 英文 | 中文 | URL | 源文件 |
|---|---|---|---|---|
| 1 | Home | 首页 | `/` | `index.md` |
| 2 | Blog | 博客 | `/blog/` | `_pages/blog.md` |
| 3 | Notes | 笔记 | `/notes/` | `_pages/notes.md` |
| 4 | Timeline | 时间线 | `/timeline/` | `_pages/timeline.md` |
| 5 | Guestbook | 留言板 | `/guestbook/` | `_pages/guestbook.md` |

### 当前 `_data/navigation.yml` 的实际内容

以下保留配置项和排列顺序，省略文件最前面的空行：

```yaml
main:
  - title: "Home"
    url: /

  - title: "Blog"
    url: /blog/

  - title: "Notes"
    url: /notes/

  - title: "Timeline"
    url: /timeline/

  - title: "Guestbook"
    url: /guestbook/
```

当前导航文字仍然是英文，**没有 `中文 / EN` 切换入口**。

### 已有构建产物

以下文件均已存在：

```text
_site/index.html
_site/blog/index.html
_site/notes/index.html
_site/timeline/index.html
_site/guestbook/index.html
```

现有 HTML 中的导航顺序与 `_data/navigation.yml` 一致。这证明上述页面曾经生成，但本次没有重新启动服务器，也没有完成浏览器访问验收，不能把文件存在等同于当前服务正在运行。

## 四、视觉设计偏好

我明确偏好：

**极简主义、黑白灰配色、简洁、克制、内容优先。**

具体要求：

- 白色或接近白色的背景。
- 黑色标题、深灰正文、浅灰辅助文字。
- 不使用大面积渐变、彩色背景或夸张动画。
- 不喜欢过多卡片。
- 重视字体、行距、留白和内容宽度。
- 顶部导航简洁。
- 首页不需要常驻头像侧栏。
- 以文字与文章为主要视觉元素。
- 希望设计适合长期使用，不容易过时。
- 希望以后支持深色模式，但它不是当前首要任务。

之前参考和讨论过 Astro Nano、AstroPaper、Astro Cactus、Minimal Mistakes 和 AcademicPages，最终决定继续采用 **Jekyll + Minimal Mistakes**。

首页最终希望呈现：

1. 简洁的网站名称与导航。
2. 简短的个人介绍。
3. 自动生成的近期文章列表。
4. 必要的其他栏目入口。

首页应当以阅读和写作为中心，不需要堆叠重复的栏目介绍卡片。

## 五、开发环境与本次核验范围

### 已有的开发方式

根据原交接材料，我使用 Windows、VS Code 和 WSL Ubuntu 开发网站，曾通过 VS Code Remote WSL 打开项目，左下角显示 `WSL: Ubuntu`。

网站源码继续保存在 E 盘。Ruby、Jekyll 等 Linux 工具继续使用现有 Ubuntu 环境，不要无故迁移 WSL 或重新安装开发环境。

原材料提到 Ubuntu 可能位于 `D:\WSL\Ubuntu`，这个位置此前就没有严格确认，**本次也没有核实**。

### 版本与证据

| 软件 | 版本 | 当前证据 |
|---|---|---|
| Ruby | 3.2.3 | 原交接材料记录；本次未重新执行验证 |
| RubyGems | 3.4.20 | 原交接材料记录；本次未重新执行验证 |
| Jekyll | 4.4.1 | 当前 `Gemfile.lock` 锁定此版本；本次未重新运行 |
| Bundler | 4.0.24 | 当前 `Gemfile.lock` 的 `BUNDLED WITH` 为此版本；本次未重新运行 |
| Git（Ubuntu） | 2.43.0 | 原交接材料记录；本次未验证 Ubuntu 中的版本 |
| Minimal Mistakes | 4.28.1 | 当前 `Gemfile.lock` 锁定此版本 |

原交接材料还记录：

```text
Ruby Gems： /home/wantching/gems
Jekyll：    /home/wantching/gems/bin/jekyll
Bundler：   /home/wantching/gems/bin/bundle
```

以上 Linux 安装路径本次没有重新验证。

### 本次检查的限制

本次可以正常读取 Windows 项目文件，并执行 Git 仓库检查；但运行 `wsl.exe --list --verbose` 返回了 `Wsl/E_ACCESSDENIED`。

因此，本次未重新检查 Ubuntu 中的软件版本，未执行 `bundle install`、`jekyll build` 或 `jekyll serve`，也未确认本地服务是否正在运行。这个访问限制本身不能证明用户原有的 WSL 环境损坏。

后续继续开发时，应优先使用已有 Ubuntu 环境核验工具和构建，不应直接重新安装。

### 用户的安装与连接偏好

- 允许选择安装位置时，软件、外部工具和运行时默认安装到 D 盘。
- 大型或独立软件各自放在独立文件夹。
- 小脚本和次一级工具统一放在 `D:\codex-tools\`。
- 只有必须安装在 C 盘才能正常运行时才使用 C 盘。
- 安装位置拿不准时先询问。
- Git/GitHub 优先使用 SSH；用户提供的偏好说明 `~/.ssh/id_ed25519` 已绑定 GitHub，`gh` 应保持 `git_protocol ssh`。本次没有读取密钥或检查账号连接状态。

## 六、当前 Jekyll 配置与项目依赖

### 项目创建背景

原交接材料记录的创建命令为：

```bash
cd /mnt/e/projects
jekyll new wantching-site --blank --skip-bundle
```

选择 `--blank` 是为了减少示例内容。这是历史记录，不需要重新执行。

### 当前 `Gemfile` 的实际内容

```ruby
source "https://rubygems.org"

gem "jekyll", "~> 4.4"
gem "minimal-mistakes-jekyll"
gem "jekyll-include-cache"
gem "webrick"
```

`Gemfile.lock` 已存在，锁定的核心版本为 Jekyll `4.4.1`、Minimal Mistakes `4.28.1`，Bundler 记录为 `4.0.24`。

原材料记录过 `bundle install` 成功，日志为：

```text
Bundle complete!
4 Gemfile dependencies, 49 gems now installed.
```

这是此前安装时的日志，本次没有重新安装或复核已安装 Gem 数量。

### 当前 `_config.yml` 的实际内容

```yaml
title: "Wantching"
description: "My personal website"

url: ""
baseurl: ""

locale: "zh-CN"
minimal_mistakes_skin: "default"

theme: minimal-mistakes-jekyll

plugins:
  - jekyll-include-cache

markdown: kramdown

include:
  - _pages
```

当前可以确认：

- 主题使用 `minimal-mistakes-jekyll`，皮肤为 `default`。
- `locale` 设置为 `zh-CN`，现有 HTML 的 `lang` 也为 `zh-CN`。
- `_pages` 已加入 `include`。
- `url` 和 `baseurl` 都为空，尚未在此配置生产站点地址。
- 项目显式列出的插件只有 `jekyll-include-cache`。
- 没有在此配置文章默认 Front Matter、分页、搜索、数学公式或评论。

依赖锁定文件包含 `jekyll-feed`、`jekyll-sitemap`、`jekyll-paginate` 等主题相关依赖；这些依赖存在，不等于站点相应功能已经配置和验收完毕。

`_includes`、`_layouts`、`_sass` 为空，说明当前没有在这些项目目录中覆盖主题模板。后续尽量使用配置和必要的本地扩展，避免直接修改主题 Gem 安装目录里的源码。

## 七、各页面的实际实现

以下按当前网站导航顺序说明。

### 1. Home：`index.md`

实际内容为：

```markdown
---
layout: single

permalink: /
author_profile: false
---

# Hello, I'm Wantching.

Welcome to my personal website.
```

与原交接文本相比，当前首页：

- Front Matter 没有 `title: "Wantching"`。
- 已经没有 `This is a space for my projects, notes, and writing.` 这句旧文字。
- 没有 Notes、Blog、Timeline、Guestbook 四个栏目介绍区块。
- 没有近期文章列表。
- 使用 `single` 布局，关闭作者资料侧栏。

后续仍希望改为：**简洁的个人介绍 + 自动生成的近期博客文章列表**。

需要理解各文件的职责：

- `_data/navigation.yml`：控制顶部导航。
- `index.md`：控制首页正文。
- `_pages/*.md`：控制独立栏目页面。
- Minimal Mistakes：提供布局并组合生成网页。

即使首页正文没有栏目链接，顶部导航仍可正常显示。

### 2. Blog：`_pages/blog.md`

当前已经实现基础自动文章列表，实际内容为：

```liquid
---
layout: archive
title: "Blog"
permalink: /blog/
author_profile: false
---

{% if site.posts.size > 0 %}

<ul>
{% for post in site.posts %}
  <li>
    <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
    <span> · {{ post.date | date: "%Y-%m-%d" }}</span>
  </li>
{% endfor %}
</ul>

{% else %}

目前还没有发布文章。

{% endif %}
```

已实现的部分：

- 通过 `site.posts` 自动读取文章，列表不需要逐篇手写。
- 列出文章标题、链接和 `%Y-%m-%d` 格式的日期。
- 没有按语言过滤文章的代码。
- 无文章时显示“目前还没有发布文章。”。

当前 `_posts` 为空，现有 `_site/blog/index.html` 中确实显示无文章提示。因此当前 Blog 是**基础列表已写好、实际文章尚未加入**，不能再描述为完全没有文章列表，也不能说完整博客系统已经完成。

目前未建立文章分类/标签页面、分页、年份/月度归档，也未验证真实文章阅读页。

### 3. Notes：`_pages/notes.md`

采用 `single` 布局，标题为 `Notes`，URL 为 `/notes/`，关闭作者资料侧栏。

预期正文是：

```markdown
这里用于长期整理学习笔记。

## Mathematics

## Computer Science

## Quantitative Research

## Other Subjects
```

**本次发现的实际问题：该文件从 Front Matter 到正文重复粘贴了两遍。**

第二套 `---`、`layout`、`title`、`permalink` 等文本出现在正文中，不会成为另一份有效的页面 Front Matter。现有 `_site/notes/index.html` 中已经能看到重复的分类标题，以及被渲染到正文里的配置文字。

本次仅将问题记录到交接文档，尚未修复。后续应保留文件开头的一套 Front Matter 和一份正文，删除重复块后重新构建验收。

当前四个分类只是标题，没有实际笔记列表、分类链接或知识库系统。

### 4. Timeline：`_pages/timeline.md`

采用 `single` 布局，标题为 `Timeline`，URL 为 `/timeline/`，关闭作者资料侧栏。

实际正文为：

```markdown
这里记录我学习、生活与成长中的一些重要时刻。

## 2026

**2026-11-08**

开始搭建自己的个人网站。
```

当前是手写 Markdown 文字记录，已经有一条事件。尚未实现纵向时间轴、事件数据文件、自动排序、图片或文章链接渲染。

### 5. Guestbook：`_pages/guestbook.md`

采用 `single` 布局，标题为 `Guestbook`，URL 为 `/guestbook/`，关闭作者资料侧栏。

实际正文为：

```markdown
欢迎来到我的留言板。

如果你有什么想法、建议，或者只是想打个招呼，都欢迎在这里留下文字。

留言功能即将开放。
```

当前只有占位说明，没有接入评论或留言服务，访客还不能通过这个页面提交留言。

## 八、中英文界面切换：需求已确定，实现尚未开始

### 已选择方案 B

已经确定：

**只切换网站界面语言，不翻译博客文章的标题和正文。**

不维护两套文章，不建立 `/zh/` 和 `/en/` 两套完整网站。同一篇文章始终只有一个 URL。

例如，无论使用中文还是英文界面，《为什么我开始写博客》和 *Some Thoughts on Learning* 都保留原始标题与正文，并一起出现在同一个博客列表中。

### 语言切换规则

1. 默认中文界面。
2. 顶部右侧提供 `中文 / EN` 入口。
3. 切换导航、按钮、页面界面说明等文字。
4. 不改动文章标题、摘要中的内容文字和文章正文。
5. 记住访客选择的语言。
6. 刷新、跨页面访问、打开另一篇文章后，继续使用所选界面语言。
7. 中英文文章统一显示，切换界面语言不隐藏文章。
8. 继续使用 `/`、`/blog/`、`/notes/`、`/timeline/`、`/guestbook/` 这一套 URL。

导航翻译应保持当前顺序：

| 中文界面 | 英文界面 |
|---|---|
| 首页 | Home |
| 博客 | Blog |
| 笔记 | Notes |
| 时间线 | Timeline |
| 留言板 | Guestbook |
| 最近文章 | Recent Posts |
| 阅读全文 | Read More |
| 上一篇 / 下一篇 | Previous / Next |

### 本次确认的实际状态

- 没有语言切换导航项。
- 没有 `assets/js/language.js`，甚至还没有源码 `assets/js/` 目录。
- `_includes` 为空，没有 `_includes/footer/custom.html`。
- 没有项目翻译字典或 `localStorage` 语言偏好逻辑。
- `locale: "zh-CN"` 已配置，但当前导航和栏目标题仍为英文。

因此应明确记录为：**界面切换需求已确定，项目中尚未实现。**

### 之前提出过的技术方向

```text
Jekyll + Minimal Mistakes + 少量原生 JavaScript + localStorage
```

分工设想为：Jekyll 生成静态页面，Minimal Mistakes 提供布局，JavaScript 切换界面文字，`localStorage` 保存偏好。

主题的 `locale` 属于构建时语言配置，不能单独完成浏览器内实时切换全部界面文字。后续应检查当前主题模板和生成 HTML，再确定具体扩展点。

曾建议过的文件路径为：

```text
_data/navigation.yml              # 已存在，但目前只有英文导航
_includes/footer/custom.html     # 尚不存在
assets/js/language.js            # 尚不存在
```

这只是此前的实现设想，不是已经完成的文件安排。可以在理解现有主题后调整方案。

实现时需要考虑：

- 使用清晰的翻译字典和必要的 `data-i18n` 标记。
- 覆盖导航、栏目页面界面文案、列表空状态、分页、文章导航、日期相关标签、搜索和页脚等界面。
- 明确区分界面文案与文章内容，避免整页替换文字误伤文章。
- 处理主题导航折叠后的语言入口和移动端表现。
- 维护 HTML `lang`、文章内容语言标记、可访问性和无 JavaScript 回退。
- 处理本地存储不可用时的回退，以及刷新时的语言显示。
- 尽量减少主题模板覆盖，保持升级可维护。

以上是后续实现与验收要求，本次未编写或测试相关代码。

## 九、Blog 的后续建设需求

Blog 是网站核心，也是最高建设优先级。应在已有基础列表上完善，而不是重新创建整个项目。

### 文章组织

继续使用 Jekyll 的 `_posts`，每篇文章使用 Markdown。

未来可能的文件示例：

```text
_posts/
├── 2026-11-08-first-post.md
└── 2026-11-15-another-post.md
```

上述文件是示例，当前目录里没有这些文章。

建议的文章 Front Matter 示例：

```yaml
---
layout: single
title: "文章标题"
date: 2026-11-08
categories:
  - Essays
tags:
  - Writing
content_language: zh
---
```

`content_language` 是计划采用的自定义内容语言字段，用来标识文章语言，不负责翻译；当前尚未建立文章模板或使用该字段。

### 希望逐步拥有的功能

- 按日期自动排列文章。
- 显示标题、发表日期和分类。
- 中文和英文文章混排。
- 分类与标签。
- 年份或月份归档。
- 分页浏览。
- 站内搜索。
- 代码高亮。
- LaTeX 数学公式。
- 文章目录 TOC。
- 上一篇 / 下一篇导航。
- 长文章阅读排版。
- 移动端适配。
- 尽可能少的发布操作。

主题或依赖可能提供其中部分能力，但当前没有真实文章用于验证，不能把上述清单整体标为已完成。后续应通过实际测试文章检查代码块、公式、目录、标签、导航和中英内容混排。

### 理想写作流程

**VS Code → 新建 Markdown → 写作 → 本地预览 → Git commit / push → GitHub Pages 自动更新。**

以后发布文章不应手动修改导航或逐篇更新文章列表。

当前文章列表代码已具备自动读取 `_posts` 的基础，Git、远程仓库和自动部署仍未建立。

## 十、Timeline 与 Notes 的后续规划

### Timeline

目标是真正的纵向时间轴，而不是目前的普通文字记录。

每个事件希望支持：

- 日期。
- 事件标题。
- 简短说明。
- 可选图片。
- 可选详细文章链接。

此前建议用 `_data/timeline.yml` 存储事件，以模板统一渲染并按时间排序。**当前该数据文件不存在**。

添加事件时应尽量只维护数据，避免每次修改大量 HTML。事件内容是否需要完整双语可以以后讨论，当前只强制要求界面语言切换。

### Notes

当前保留简洁的笔记栏目，分类标题为 Mathematics、Computer Science、Quantitative Research、Other Subjects。

近期先修复重复内容，之后再按实际写作需要组织笔记。Notes 的建设优先级较低，不急于引入复杂知识图谱、关系网络或大型知识库架构。

## 十一、Guestbook 的后续规划

留言板英文名称确定为 **Guestbook**。

目标是让访客能够实际留言。当前“留言功能即将开放”只是说明文案。

此前推荐候选方案为 [Giscus](https://giscus.app/zh-CN)。原材料将其描述为基于 GitHub Discussions、可嵌入静态网站、无需自建数据库并支持主题切换的开源留言方案，留言需要 GitHub 账号授权。

这些属于此前的选型背景，本次没有联网复核服务现状，也没有完成接入。正式配置时应重新确认官方要求、仓库权限、Discussions 分类和主题/语言设置。

原计划是在 GitHub 仓库与部署配置明确后再接入，当前不需要优先开发独立后端。如果比较其他方案，应结合个人博客维护成本和访客使用体验判断。

## 十二、Git、GitHub 与部署的实际状态

### 本地 Git

本次在 `E:\projects\wantching-site` 执行 Git 检查，返回：

```text
fatal: not a git repository (or any of the parent directories): .git
```

目录中也没有 `.git`。因此可以确认：**当前工作目录尚未建立 Git 仓库**。

这比原交接材料中的“没有确认是否初始化”更明确。当前没有可用的项目分支、提交记录或远程配置可供检查。

本次没有初始化 Git，也没有创建或连接远程仓库。

### GitHub 与旧站

用户 GitHub 账号为 `Wantching`，旧站仓库地址见第一节。本地没有 Git 仓库，不能把这个新项目视为已经连接旧站或任何新远程仓库。

仍需遵守：

1. 为新项目建立 Git 版本管理与 `.gitignore`。
2. 将新网站和旧网站隔离。
3. 检查哪些构建产物、缓存和本地依赖应排除在提交之外。
4. 确定远程仓库及 Pages 部署方式。
5. 新站验收后再考虑替换旧站。
6. 将来再处理 `wantching.com` 域名绑定。

连接 GitHub 时优先采用 SSH。

### 部署配置

当前项目中没有 `.github/workflows/`、没有 `CNAME`；`_config.yml` 的 `url`、`baseurl` 都为空。

因此，不能把 GitHub Pages、GitHub Actions 或自定义域名标为已配置。

原交接材料提醒过 Jekyll 4、主题 Gem 与 GitHub Pages 默认构建环境的兼容性。正式部署前应核验当时的平台支持情况，必要时用 GitHub Actions 自定义构建，而不是未经测试就沿用默认构建。

当前 `_site` 已有 `feed.xml`、`sitemap.xml` 和 `robots.txt`，说明这些文件曾生成；其生产 URL、内容正确性和公开部署后的可用性尚未验收，不能再笼统地说它们“完全没有”，也不能认定已经完成上线配置。

## 十三、历史问题与当前待修问题

### 历史问题：来自原交接材料

以下用于保留排查背景，不代表本次重新复现或验证。

| 问题 | 此前结论 |
|---|---|
| WSL 路径误写为 `project` | 实际为 `projects`，此前已解决 |
| Ubuntu 中没有正确使用 Ruby / Jekyll / Bundler | 此前安装并检查 Linux 工具路径后已解决 |
| VS Code Server 自动下载或更新 | 此前已成功通过 Remote WSL 连接 |
| `/about/` 返回 Not Found | 此前因 Markdown 文件第一行前有空行导致 Front Matter 未识别，修正后解决 |
| Sass 大量弃用警告 | 此前仍能成功构建，暂未修改主题 Gem 内部代码 |
| `/favicon.ico` not found | 此前尚未设置图标，不影响当时的基本页面构建 |

About 页面现在已经不在项目中，不需要为了复现历史问题重新创建它。

### 本次确认的当前问题

1. **Notes 内容重复**：`_pages/notes.md` 有两套配置和正文，现有 HTML 已显示重复内容。
2. **界面语言尚未统一**：配置是中文 locale，导航与栏目标题是英文，页面部分说明是中文；没有运行时语言切换。
3. **尚无文章**：`_posts` 为空，完整文章阅读体验未验证。
4. **留言不可用**：只有占位文字。
5. **Timeline 仍为手写文字**：未实现数据驱动时间轴。
6. **版本管理和部署未建立**：没有 Git 仓库、忽略规则或部署工作流。

### Front Matter 的当前状态

本次检查到 `index.md` 和四个 `_pages/*.md` 文件都直接以 `---` 开头，没有最前面空行的问题。

仍应遵守：Markdown 页面的 YAML Front Matter 应从文件第一行开始。Notes 的问题是正文中重复了一整块内容，和文件第一行前有空行是两种不同的问题。

### Sass 与 favicon 的当前核验范围

本次未运行构建，因此没有重新确认 Sass 警告是否仍出现。项目源码中没有发现 favicon 文件，但没有重新通过浏览器检查对应请求。

## 十四、本地运行与验证方式

### 此前成功使用的启动方式

在 VS Code 的 Ubuntu 终端执行：

```bash
cd /mnt/e/projects/wantching-site
bundle exec jekyll serve
```

然后访问：

```text
http://localhost:4000/
```

原材料记录过如下成功日志：

```text
Generating...
done in 0.715 seconds.

Server address: http://127.0.0.1:4000/
Server running...
```

以上是历史运行记录，不是本次执行结果。

### 使用时需要理解的区别

- `bundle exec jekyll build`：构建静态网站，不启动服务器。
- `bundle exec jekyll serve`：构建并启动本地预览服务。
- 在服务器终端按 `Ctrl + C` 停止服务。
- 关闭浏览器标签页不等于停止服务器。
- 修改 `_config.yml` 后一般需要重启服务。
- `_site` 是自动生成结果，不应直接编辑它来实现网站功能。
- 服务启动成功后，仍应逐一检查页面与资源是否正确。

### 后续每阶段的基本验收

在已有环境可以正常访问后，重新构建并检查首页、Blog、Notes、Timeline、Guestbook 五个地址，以及后续新增的实际文章页。

界面切换实现后，应进一步检查默认中文、英文切换、刷新保留、跨页保留、中英文章混排、文章内容不被改写，以及移动端导航。

本次仅做文件、配置和现有 HTML 核对，没有执行上述运行验收。

## 十五、建议的后续开发顺序

不需要重新从零搭建 Jekyll。后续工作应围绕现有项目展开，并以开始实施时再次读取到的文件为准。

### 阶段 1：清理与建立可回溯基础

- 修复 `_pages/notes.md` 的重复内容。
- 使用现有 Ubuntu 环境确认依赖和构建。
- 逐一访问五个栏目。
- 保留当前实际导航顺序：Home → Blog → Notes → Timeline → Guestbook。
- 建立 `.gitignore` 和本地 Git，记录初始状态。
- 维持新旧网站隔离。

### 阶段 2：正式实现中英文界面切换

- 先确定主题扩展方式、翻译字典和界面标记。
- 默认中文，顶部提供 `中文 / EN`。
- 保存语言偏好，刷新与跨页保持。
- 覆盖现有导航、栏目界面和列表空状态。
- 随博客能力加入，再补齐分页、文章导航、日期和搜索等界面翻译。
- 保持文章内容和文章列表完整。

### 阶段 3：完善博客核心

- 在现有自动列表上扩展。
- 建立文章模板和必要的默认配置。
- 用实际或经用户认可的测试文章验证中英文混排。
- 完善分类、标签、归档、分页和搜索。
- 检查目录、公式、代码高亮、文章导航与阅读排版。

### 阶段 4：完善首页

- 保持简洁自我介绍。
- 自动展示近期文章。
- 采用黑白灰排版。
- 避免大量重复栏目卡片。
- 继续关闭常驻作者侧栏。

### 阶段 5：建设 Timeline 与 Notes

- 确定时间轴事件数据结构。
- 实现纵向时间轴和自动排序。
- 按实际内容补充 Notes 的组织与索引。
- 暂不建设复杂知识图谱。

### 阶段 6：统一视觉与交互

- 字体、行距、留白、内容宽度。
- 导航、链接与页脚。
- 移动端适配。
- 视需求加入深色模式。

### 阶段 7：发布、留言与上线完善

- 配置独立的新站仓库和部署流程。
- 验证 GitHub Pages / GitHub Actions。
- 接入并测试 Guestbook。
- 添加网站图标。
- 核验 SEO、RSS、站点地图和生产 URL。
- 新站验收后再讨论旧站替换及自定义域名。

这些阶段是后续工作建议，本次没有开始执行网站开发或部署。

## 十六、后续协作要求与当前交接结论

希望接手的助手遵守以下原则：

1. 先检查现有项目，不重新创建网站。
2. 优先读取 `E:\projects\wantching-site`，WSL 对应 `/mnt/e/projects/wantching-site`。
3. 检查实际文件、依赖、目录与 Git 状态，不把旧建议当作已完成事实。
4. 保留 Jekyll + Minimal Mistakes 路线，不复制旧 AcademicPages 站点。
5. 尽量避免直接修改主题 Gem 源码。
6. 不未经授权覆盖、删除或发布到旧站。
7. 优先推进博客与界面切换，降低复杂知识库优先级。
8. 讲解操作时说明原理，不仅给复制命令。
9. 需要修改多处代码时可以在授权范围内直接操作，并说明文件、原因和验证结果。
10. 每完成一阶段，核对构建与浏览器实际表现。
11. 使用成熟、便于长期维护的方案。
12. 涉及安装或 GitHub 连接时遵守第五节的 D 盘与 SSH 偏好。

如果后续任务在 Plan 模式中确认计划并要求实施，应先把最终确认版计划完整保存到项目的 `plans/` 目录，使用 `YYYY-MM-DD-简短主题.md`，不覆盖旧计划，并保留目标、范围、结构、步骤、验收标准、假设和边界。当前这次任务是交接文档整理，没有经过 Plan 模式确认实施，因此本文件存放在 `_handoff/`。

### 当前已完成与未完成的边界

| 项目 | 当前状态 |
|---|---|
| Jekyll + Minimal Mistakes 基础项目 | 已有源码、锁定依赖及历史构建产物 |
| 五个一级栏目 | 源文件和现有生成页面均存在 |
| 导航顺序 | Home → Blog → Notes → Timeline → Guestbook |
| About / Projects | 不在当前页面文件和导航中 |
| 首页 | 简短英文自我介绍，没有近期文章列表 |
| Blog | 已有自动列表代码，尚无实际文章 |
| Notes | 已有分类标题，但整块内容重复，待修复 |
| Timeline | 一条手写事件，尚无纵向时间轴 |
| Guestbook | 占位说明，尚不能留言 |
| 中文 / EN | 需求已确定，尚未实现 |
| 自定义样式 / 脚本 | 对应源码尚未编写 |
| Git 与远程 | 当前目录不是 Git 仓库 |
| 自动部署与域名 | 项目中尚无相应配置 |
| 本次运行验证 | 未重新构建或访问浏览器；WSL 命令被拒绝访问 |

### 下一轮开发的起点

**先核验现有环境并修复 Notes 重复内容，再在现有项目上正式实现“中文 / EN 界面切换”，同时完善适合长期写作的 Blog 基础结构。**

开始大量修改之前，先依据当时的实际文件确认整体架构、代码状态与实现方案。

最终目标仍然是：一个适合长期写作、维护简便、简洁美观、支持中英文界面的个人博客。
