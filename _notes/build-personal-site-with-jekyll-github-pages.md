---
title: "从零搭建个人网站：Jekyll、GitHub Pages 与自定义域名"
date: 2026-11-09
excerpt: "从本地环境、页面与内容组织，到 Git、SSH、自动发布、域名解析和 HTTPS。通用操作放在前面，本次建站遇到的问题与实际配置集中记录在文末。"
content_language: zh-CN
---

{% raw %}

这篇笔记整理一条适合个人博客、学习笔记和个人主页的建站路线：**在本地用 Markdown 写内容，由 Jekyll 生成网页，通过 GitHub Actions 自动发布到 GitHub Pages，再绑定自己的域名。**

本文以 Windows、WSL Ubuntu、Jekyll 和 Minimal Mistakes 为例。已有 Linux 环境时，可以从安装 Ruby 开始。文中的 `YOUR_USER`、`personal-site` 和 `example.com` 是示例，操作时分别换成自己的 GitHub 用户名、项目名和实际注册的域名。平台菜单、套餐限制和依赖版本可能变化，遇到不一致时核对文中的官方资料。

## 目录

- [一、先理解每个部分的作用](#overview)
- [二、准备本地开发环境](#environment)
- [三、建立最小可运行项目](#bootstrap)
- [四、组织首页、博客、笔记与时间线](#content)
- [五、逐步定制页面与交互](#design)
- [六、预览、检查与本地版本管理](#local-git)
- [七、通过 SSH 连接 GitHub 并首次上传](#ssh-upload)
- [八、配置 GitHub 自动生成和发布网页](#deployment)
- [九、绑定域名、配置 DNS 和 HTTPS](#domain)
- [十、以后怎样更新内容](#daily)
- [十一、上线验收与长期维护](#maintenance)
- [十二、官方参考资料](#references)
- [十三、本次建站的实际配置与个人问题](#experience)

## 一、先理解每个部分的作用
{: #overview}

| 部分 | 负责什么 | 典型文件或操作 |
| --- | --- | --- |
| Markdown | 保存文章正文 | `.md` 文件 |
| YAML | 保存配置、导航和事件数据 | `_config.yml`、`_data/*.yml` |
| Jekyll | 把内容、模板和样式组合成静态网页 | `bundle exec jekyll build` |
| Minimal Mistakes | 提供基础主题和通用页面布局 | Gemfile 中的主题依赖 |
| Git | 在电脑上记录项目版本 | `add`、`commit` |
| GitHub 仓库 | 保存上传的项目源码和版本 | `push`、`pull` |
| GitHub Actions | 在 GitHub 的临时环境中运行生成和发布任务 | `.github/workflows/deploy.yml` |
| GitHub Pages | 向访问者提供生成后的网页 | 仓库的 Pages 设置 |
| 域名注册商 | 管理域名的注册、归属和续费 | 购买自己的域名 |
| DNS 服务商 | 告诉浏览器去哪里找这个域名的网站 | A、CNAME、TXT 记录 |
| HTTPS | 让浏览器与网站加密通信 | 证书与 Enforce HTTPS |

注册商和 DNS 服务商可以是同一家，也可以分开选择。网站放在 GitHub Pages 上，并不要求域名也在 GitHub 购买。

日常发布的顺序是：

```text
在电脑上写内容并保存
        ↓
Git 提交版本，再 push 到 GitHub
        ↓
Actions 按配置运行 Jekyll，生成 HTML、CSS 等文件
        ↓
Pages 发布生成结果
        ↓
访客通过正式域名访问
```

本地按 `Ctrl+S` 是保存文件，`commit` 是保存版本，`push` 才是把版本传到 GitHub。只有配置了对应的自动流程，上传才会继续触发网页生成与发布。这个过程在 GitHub 上运行，完成上传后不需要让自己的电脑一直开着。

## 二、准备本地开发环境
{: #environment}

### 2.1 Windows 与 Ubuntu 的分工

Windows 可以负责编辑文件、打开浏览器；WSL Ubuntu 可以负责运行 Ruby、Jekyll 和 Git。建议尽量在同一套终端环境里完成预览和 Git 操作，减少路径、密钥和依赖环境混用。

安装新的 WSL 发行版时，可以在 Windows 管理员 PowerShell 中先查看可安装名称，再指定安装位置：

```powershell
wsl --list --online
wsl --install --distribution Ubuntu-24.04 --location D:\WSL\Ubuntu
```

`Ubuntu-24.04` 应以第一条命令列出的实际名称为准。按系统提示完成重启、首次启动、Linux 用户名和密码设置。`--location` 用于指定发行版位置；较旧的 WSL 若不支持，应先查看 `wsl --help` 和官方更新说明。已有可用 Ubuntu 时，直接使用原来的环境即可。[WSL 命令说明](https://learn.microsoft.com/en-us/windows/wsl/basic-commands)

Windows 与 WSL 看到的是同一份挂载文件，例如：

```text
Windows：E:\projects\personal-site
Ubuntu： /mnt/e/projects/personal-site
```

但是，它们默认拥有各自的用户目录、SSH 配置和软件环境。Windows 的 `~/.ssh` 与 Ubuntu 的 `~/.ssh` 不是同一个目录。

### 2.2 在 Ubuntu 中安装 Ruby 和基础工具

以下命令在 Ubuntu 终端运行：

```bash
sudo apt update
sudo apt install ruby-full build-essential zlib1g-dev git

ruby --version
gem --version
git --version
```

Ruby 运行 Jekyll；RubyGems 管理 Ruby 软件包；编译工具用于安装部分依赖。Bundler 会根据项目的 Gemfile 安装依赖，并参考 Gemfile.lock 使用已锁定的版本。

把用户安装的 gems 放在用户目录中。首次配置时，可把下面两行追加到 `~/.bashrc`，已有相同设置时保留一份即可：

```bash
export GEM_HOME="$HOME/gems"
export PATH="$HOME/gems/bin:$PATH"
```

再执行：

```bash
source ~/.bashrc
gem install bundler
bundle --version
```

这种做法不需要使用 `sudo gem install`。[Jekyll Ubuntu 安装说明](https://jekyllrb.com/docs/installation/ubuntu/)

Ruby、RubyGems 与 Bundler 要相互兼容。例如，Bundler 4.0 要求 Ruby 至少 3.2、RubyGems 至少 3.4.1。恢复已有项目时，先看 Gemfile.lock 末尾的 `BUNDLED WITH`，再核对所用版本；不要一遇到错误就直接更新所有依赖。[Bundler 兼容要求](https://github.com/rubygems/guides/blob/main/bundler-compatibility.md)

### 2.3 创建并打开项目目录

```bash
mkdir -p /mnt/e/projects/personal-site
cd /mnt/e/projects/personal-site
```

使用 VS Code 等编辑器打开这个目录。后续所有相对路径和 Git 命令，都以项目根目录为起点。

## 三、建立最小可运行项目
{: #bootstrap}

### 3.1 用 Gemfile 声明依赖

在根目录建立 `Gemfile`：

```ruby
source "https://rubygems.org"

gem "jekyll", "~> 4.4"
gem "minimal-mistakes-jekyll"
gem "jekyll-include-cache"
gem "webrick"
```

执行：

```bash
bundle install
```

Minimal Mistakes 的 Gem 安装方式需要在配置中指定主题，并启用 `jekyll-include-cache`。主题的基础布局、样式和包含文件保存在已安装的 gem 中，因此项目根目录不一定能看到完整主题源码。[主题安装说明](https://mmistakes.github.io/minimal-mistakes/docs/quick-start-guide/)

成功后会生成 `Gemfile.lock`。它应当跟随源码一起提交，以便其他电脑和 GitHub 使用一致的依赖版本。平时安装已有依赖用 `bundle install`；`bundle update` 是主动升级依赖，不是日常发布步骤。

### 3.2 建立基础配置与首页

最初的 `_config.yml` 可以先写成：

```yaml
title: "My Personal Site"
description: "Writing, notes and personal records"
url: ""
baseurl: ""
timezone: "Asia/Shanghai"
locale: "zh-CN"

theme: minimal-mistakes-jekyll
minimal_mistakes_skin: "default"

plugins:
  - jekyll-include-cache

markdown: kramdown

include:
  - _pages

exclude:
  - README.md
```

建立 `index.md`：

```markdown
---
layout: single
title: "你好，欢迎来到我的网站"
permalink: /
author_profile: false
---

这是网站首页。
```

文件开头两行 `---` 之间称为 **Front Matter**，用于填写标题、布局和网址等信息；第二条 `---` 后面才是正文。一个文件只需要一组有效的顶部 Front Matter。

### 3.3 先生成并预览一次

```bash
bundle exec jekyll build
bundle exec jekyll serve
```

浏览器打开 `http://localhost:4000`。能看到首页后，基础环境才算跑通。先验证最小页面，再逐步增加栏目，比一次加入全部功能更容易判断问题来自哪里。

`build` 只生成文件；`serve` 会生成文件并启动本地预览。生成结果在 `_site/` 中，这个目录里的内容会被后续构建重新生成。

## 四、组织首页、博客、笔记与时间线
{: #content}

一个便于长期维护的目录可以这样安排：

```text
personal-site/
├── Gemfile
├── Gemfile.lock
├── _config.yml
├── index.md
├── _pages/                 栏目页面
│   ├── blog.md
│   ├── notes.md
│   ├── timeline.md
│   └── guestbook.md
├── _posts/                 博客文章
├── _notes/                 独立笔记集合
├── _drafts/                博客草稿
├── _data/                  结构化数据
│   ├── navigation.yml
│   ├── timeline.yml
│   └── i18n.yml            需要界面翻译时添加
├── _layouts/               自定义布局，需要时添加
├── _includes/              模板片段，需要时添加
├── assets/
│   ├── css/
│   ├── js/
│   ├── fonts/
│   └── images/
├── .github/workflows/
│   └── deploy.yml
└── _site/                  自动生成的网页
```

物理文件夹按什么顺序显示，不决定网站的导航顺序。导航顺序由 `_data/navigation.yml` 等实际读取它的模板决定。例如：

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

### 4.1 博客：使用内置的 posts

文章放进 `_posts/`，文件名采用：

```text
2026-11-09-my-first-post.md
```

正文示例：

```markdown
---
title: "我的第一篇文章"
date: 2026-11-09
excerpt: "这篇文章在列表中显示的一两句话简介。"
---

这里开始写正文。

## 一个小标题

这是另一个自然段。
```

日期换成文章的实际日期，尽量与文件名一致。列表标题来自 `title`，所以可以使用简短英文文件名，同时显示中文标题。日期在未来的文章，默认构建可能不会发布。[文章规则](https://jekyllrb.com/docs/posts/)

可以在 `_config.yml` 添加默认设置，减少每篇文章重复填写的字段：

```yaml
defaults:
  - scope:
      path: ""
      type: posts
    values:
      layout: single
      author_profile: false
      permalink: /blog/:title/
```

`_pages/blog.md` 负责显示列表。一个最简单的版本是：

```liquid
---
layout: archive
title: "博客"
permalink: /blog/
---

{% for post in site.posts %}
  <article>
    <h2><a href="{{ post.url | relative_url }}">{{ post.title | escape }}</a></h2>
    <p>{{ post.excerpt | strip_html | escape }}</p>
    <time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%Y-%m-%d" }}</time>
  </article>
{% endfor %}
```

这里的 Liquid 循环只会在生成网页时执行。访客访问时，收到的已经是生成好的 HTML。

### 4.2 笔记：使用独立的 collection

笔记可以建立为自己的集合，和博客分开维护。在 `_config.yml` 中添加：

```yaml
collections:
  notes:
    output: true
    permalink: /notes/:name/
```

把下面这项追加到已有的 `defaults` 列表中，而不是再建立第二个同名 `defaults`：

```yaml
  - scope:
      path: ""
      type: notes
    values:
      layout: single
      author_profile: false
```

`_notes/markdown-basics.md` 可以采用与博客相同的 Front Matter：标题、日期、简介和正文。笔记文件名不用增加日期前缀。

列表中可以这样排序和读取：

```liquid
{% assign notes = site.notes | sort: "date" | reverse %}
{% for note in notes %}
  <a href="{{ note.url | relative_url }}">{{ note.title | escape }}</a>
{% endfor %}
```

集合目录名要与配置对应：配置项是 `notes`，实际目录就是 `_notes/`。`output: true` 用来让每条笔记生成自己的网页。[集合说明](https://jekyllrb.com/docs/collections/)

### 4.3 时间线：使用手动维护的数据

如果时间线记录的是自己挑选的重要事件，可以把数据放进 `_data/timeline.yml`：

```yaml
- date: "2026-11-09"
  title: "发布第一篇文章"

- date: "2026-11-08"
  title: "开始搭建个人网站"
```

模板只读取这份数据，按日期倒序并按年份分组；页面再显示月日和事件标题。核心排序可以写成：

```liquid
{% assign events = site.data.timeline | sort: "date" | reverse %}
{% assign years = events | group_by_exp: "event", "event.date | date: '%Y'" %}
```

这里的事件独立于 `site.posts` 和 `site.notes`。这样，新增博客会更新博客列表，新增笔记会更新笔记列表，时间线则由作者单独决定。

### 4.4 页面、布局与包含文件的区别

| 文件位置 | 适合放什么 |
| --- | --- |
| `_pages/*.md` | 某个栏目的网址和页面内容 |
| `_layouts/*.html` | 一类页面共用的整体结构 |
| `_includes/*.html` | 导航、页脚、时间线等可复用片段 |
| `_data/*.yml` | 内容数据、界面词典和导航配置 |
| `assets/css/` | 字体、配色、间距、卡片和响应式规则 |

自定义 `entry`、`listing` 等布局名时，必须提供对应的 `_layouts/entry.html`、`_layouts/listing.html`。这些名字属于项目自己的约定，不是 Jekyll 自带的布局。

## 五、逐步定制页面与交互
{: #design}

### 5.1 先确定信息结构，再调整外观

先确定栏目、内容来源、网址和阅读方式，再调整字体、配色和间距。这样，内容与视觉可以分别维护。

对于极简网站，通常先检查阅读宽度、段落行距、标题大小、导航状态、页脚位置，以及手机上的换行。可以用一个统一的内容宽度控制正文，再用较淡的灰色区分辅助信息。

Gem 主题的定制原则是：在项目中放入需要覆盖的同名模板，保留确实有用途的局部修改。没有必要把主题的全部文件复制进项目。

### 5.2 整张卡片可点击

用原生链接包住卡片里的标题、简介和日期：

```html
<article class="entry-card">
  <a class="entry-card__link" href="/blog/example/" aria-labelledby="entry-title">
    <h2 id="entry-title">文章标题</h2>
    <p>文章简介。</p>
    <time datetime="2026-11-09">2026-11-09</time>
  </a>
</article>
```

```css
.entry-card__link {
  display: block;
  padding: 1.5rem;
  border: 1px solid #eceef0;
  border-radius: 4px;
  color: inherit;
  text-decoration: none;
}

.entry-card__link:hover {
  background: #f8f9fa;
}

.entry-card__link:focus-visible {
  outline: 2px solid #7a838e;
  outline-offset: 3px;
}
```

链接内部不再嵌套另一个链接或按钮。重复生成卡片时，给每个标题使用不同的 ID。原生链接同时支持鼠标、触屏、键盘和在新标签页中打开。

### 5.3 字体、数字与配色分开检查

中文字体、英文字体和数字字形可能来自不同字体。设置字体栈后，要检查标题是否又被主题的标题字体覆盖；必要时给标题加 `font-family: inherit`。

日期的效果还会受到字号、字重和 `font-variant-numeric` 影响。改字体时，应在字体实际加载完成后判断效果，不能只看样式表里写了什么名称。

需要网页字体时，把字体文件和授权文件一起保存，使用 `@font-face` 引用，按需设置 `font-display: swap`。中文字体可以按 Unicode 分片，浏览器按页面所需字符加载对应片段。图片和字体都属于网站资源，不需要安装到访客电脑里。

### 5.4 首页居中、列表标题与页脚

首页问候语水平居中用 `text-align: center`；如果还要在导航与页脚之间垂直居中，需要给正文区域分配剩余高度，例如通过 flex 布局实现。仅给标题增加一个很大的上边距，通常无法同时适应手机和电脑。

栏目名称已经在顶部导航中清楚显示时，列表布局可以省略重复的大标题，同时给 `main` 保留描述性的可访问名称。文章详情页则继续显示文章自己的标题。

页脚可以在短页面中位于底部，在长页面中跟随正文；避免使用覆盖正文的固定定位。使用白色背景、合适的留白和较淡的文字，就可以形成安静的底部区域。

### 5.5 中英文界面与文章内容分开处理

如果提供界面语言切换，可以把导航、按钮、空状态等文案集中存进词典，并只翻译明确标记过的元素：

```html
<span data-i18n="nav.blog">博客</span>
```

文章标题和正文保留作者写作时的语言。浏览器标签标题、菜单的可访问名称和返回链接，也应跟随界面语言。语言偏好可以保存在 `localStorage` 中。

## 六、预览、检查与本地版本管理
{: #local-git}

预览时在项目目录运行：

```bash
bundle exec jekyll serve
```

保存正文后，等待终端完成重新生成，再刷新浏览器。修改 `_config.yml`、新增集合等全局设置后，先按 `Ctrl+C` 停止服务，再重新启动。需要先看草稿时，可以使用 `bundle exec jekyll serve --drafts`。

### 6.1 Git 第一次设置

```bash
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"
git init -b main
```

用户名和邮箱是提交署名；访问 GitHub 仓库的身份认证由后面的 SSH 负责。若只想给当前项目设置署名，省略 `--global`。

### 6.2 先忽略生成目录

在项目根目录建立 `.gitignore`：

```gitignore
/_site/
/.jekyll-cache/
/.sass-cache/
/.jekyll-metadata
/.bundle/
/vendor/
```

提交的是源文件和 Gemfile.lock。`_site/` 是生成结果，交给自动发布流程生成即可。已经被 Git 跟踪的文件，不会因为后来写进 `.gitignore` 就自动取消跟踪。

### 6.3 保存第一个本地版本

```bash
git status --short
git add .
git diff --cached --stat
git commit -m "chore: initialize personal site"
```

| 动作 | 实际发生了什么 | 是否上传到 GitHub |
| --- | --- | --- |
| 编辑并保存文件 | 改变工作目录中的文件 | 否 |
| `git add` | 选中本次准备提交的修改 | 否 |
| `git commit` | 在本地保存一个版本 | 否 |
| `git push` | 将本地提交发送到远程仓库 | 是 |

## 七、通过 SSH 连接 GitHub 并首次上传
{: #ssh-upload}

### 7.1 在实际使用 Git 的环境中配置密钥

以下命令在 Ubuntu 中执行。先检查有没有已有密钥：

```bash
ls -la ~/.ssh
```

如果已经有正在使用的密钥，先确认用途和是否绑定 GitHub，再决定复用或新增。新建密钥时可以运行：

```bash
ssh-keygen -t ed25519 -C "your-email@example.com"
```

按提示选择保存路径与密钥口令。默认生成的两个文件分别是：

- `id_ed25519`：私钥，保存在自己的设备中。
- `id_ed25519.pub`：公钥，用于添加到 GitHub。

查看公钥：

```bash
cat ~/.ssh/id_ed25519.pub
```

在 GitHub 头像下的 `Settings → SSH and GPG keys → New SSH key` 中添加这段公钥。若密钥设置了口令，可以使用 SSH agent 管理当前会话中的解锁：

```bash
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
```

### 7.2 验证连接

```bash
ssh -T git@github.com
```

首次连接时，核对提示中的服务器指纹与 [GitHub 官方指纹](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/githubs-ssh-key-fingerprints)，一致后再完成首次信任。

正常情况下会显示类似：

```text
Hi YOUR_USER! You've successfully authenticated, but GitHub does not provide shell access.
```

这表示认证成功，后半句说明 GitHub 不提供交互式终端。此测试的退出码可以是 `1`，应结合成功信息判断。[连接测试说明](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/testing-your-ssh-connection)

密钥和仓库关联通常配置一次即可。每次 `push` 时，Git 自动建立连接并验证；重启后可能需要重新解锁带口令的密钥，但无需每次重新生成密钥或添加公钥。

### 7.3 建立远程仓库并关联

在 GitHub 新建一个空仓库，例如 `personal-site`。已有本地项目时，创建远程仓库时保持为空，不自动添加 README、`.gitignore` 或其他文件。公开仓库可以使用 GitHub Free 的 Pages，源码也会公开。

在本地项目目录执行：

```bash
git remote add origin git@github.com:YOUR_USER/personal-site.git
git remote -v
```

`origin` 是远程地址的简称。查看结果应能看到同一个 SSH 地址对应的 `fetch` 和 `push`。

首次上传：

```bash
git push -u origin main
```

`-u` 保存本地 `main` 与远程分支的跟踪关系，后续可以直接 `git push`。如果刚刚还有新修改，先 `add` 和 `commit`，再上传。[已有项目上传说明](https://docs.github.com/en/migrations/importing-source-code/using-the-command-line-to-import-source-code/adding-locally-hosted-code-to-github)

成功标志是：GitHub 仓库中能够看到源码，本地 `git branch -vv` 中能看到 `origin/main` 的跟踪关系。上传源码与发布网站是两个步骤，下一节负责把两者连接起来。

## 八、配置 GitHub 自动生成和发布网页
{: #deployment}

### 8.1 放入自动发布文件

在项目中建立 `.github/workflows/deploy.yml`。下面是一份使用 Gemfile 依赖、同时兼容项目临时网址和自定义域名的配置：

```yaml
name: Deploy Jekyll site to Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-24.04
    timeout-minutes: 15
    steps:
      - name: Check out website
        uses: actions/checkout@v6

      - name: Read Pages address
        id: pages
        uses: actions/configure-pages@v5

      - name: Set up Ruby and install gems
        uses: ruby/setup-ruby@v1
        with:
          ruby-version: '3.3'
          bundler-cache: true

      - name: Build website
        env:
          JEKYLL_ENV: production
          PAGES_ORIGIN: ${{ steps.pages.outputs.origin }}
          PAGES_BASE_PATH: ${{ steps.pages.outputs.base_path }}
        run: |
          ruby -ryaml -e 'File.write("_config.pages.yml", {"url" => ENV.fetch("PAGES_ORIGIN"), "baseurl" => ENV.fetch("PAGES_BASE_PATH")}.to_yaml)'
          bundle exec jekyll build --config _config.yml,_config.pages.yml --trace

      - name: Upload generated pages
        uses: actions/upload-pages-artifact@v4
        with:
          path: _site

  deploy:
    needs: build
    runs-on: ubuntu-24.04
    timeout-minutes: 10
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Publish website
        id: deployment
        uses: actions/deploy-pages@v4
```

Ruby 版本应当与项目依赖兼容；Bundler 的版本可以由 Gemfile.lock 决定。Action 的版本号也应在后续维护时对照官方支持情况检查。

`build` 获取源码、安装依赖、运行 Jekyll，并上传 `_site/`；`deploy` 等待构建成功后，发布生成结果。它不读取个人电脑上尚未上传的内容，也不需要把个人 SSH 私钥放入工作流。[Pages 工作流说明](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)

### 8.2 为什么要处理 url 与 baseurl

两种常见访问方式的路径不同：

| 访问方式 | `url` | `baseurl` |
| --- | --- | --- |
| 项目临时网址 | `https://YOUR_USER.github.io` | `/personal-site` |
| 自定义域名根目录 | `https://example.com` | 空字符串 |

`url` 是站点来源地址，`baseurl` 是站点挂载的路径。模板里的内部链接和资源路径使用 `relative_url`，可以自动适配前缀。

上述流程读取 Pages 当前的 `origin` 与 `base_path`，写入仅在本次构建中使用的 `_config.pages.yml`。多个配置文件按顺序合并，后一个文件覆盖前一个文件里的同名设置。[Pages 输出参数](https://github.com/actions/configure-pages/blob/v5/action.yml)

因此，切换域名后要重新生成一次网页。正式配置文件也应填写正确的域名，临时覆盖机制不能代替源配置的长期维护。

### 8.3 在 GitHub 开启 Pages 并运行一次

把工作流文件提交并推送后，在仓库打开：

```text
Settings → Pages → Build and deployment → Source → GitHub Actions
```

项目已有配置时，直接使用它。然后打开：

```text
Actions → Deploy Jekyll site to Pages → Run workflow → main → Run workflow
```

等待 `build` 和 `deploy` 都成功，再从 Pages 设置页面打开部署地址。若首次推送发生在 Pages 启用之前，可以在启用后重新运行流程。

临时网址以 Pages 页面显示的结果为准；普通项目站点通常带有仓库名称作为路径。确认这个地址能够打开、文章详情能够访问，再绑定自定义域名。[发布源设置](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

## 九、绑定域名、配置 DNS 和 HTTPS
{: #domain}

### 9.1 注册域名与选择 DNS

注册域名后，确认域名管理与解析服务可以正常使用，并留意续费日期。域名注册是取得这个名字的使用权；解析则是填写这个名字指向哪里。

在腾讯云注册的域名通常已出现在云解析 DNS 的域名列表中。进入记录管理前，应确认域名实际使用的 DNS 服务器属于你正在操作的解析服务。只有在有效的权威 DNS 服务中添加记录，外部查询才会看到这些变化。[腾讯云解析入门](https://cloud.tencent.com/document/product/302/3446)

DNS 解析、GitHub 域名归属验证、仓库的自定义域名设置，分别承担不同任务：

| 设置 | 作用 |
| --- | --- |
| TXT 验证记录 | 向 GitHub 证明域名归自己所有 |
| 仓库 Pages 的 Custom domain | 告诉 GitHub，这个域名对应哪个网站 |
| A / CNAME 等网站解析 | 告诉浏览器，去哪里寻找网站 |
| HTTPS 证书与强制 HTTPS | 让访客安全访问，并将普通 HTTP 请求转到 HTTPS |

### 9.2 先完成 GitHub 账号层面的 TXT 验证

从 GitHub 头像进入账号设置：

```text
Settings → Pages → Add a domain
```

填写实际域名，例如 `example.com`。GitHub 会生成验证记录的名称和验证码。

在 DNS 控制台添加一条 TXT 记录：

| 字段 | 示例填写方式 |
| --- | --- |
| 主机记录 | GitHub 给出的记录名称前缀，例如 `_github-pages-challenge-YOUR_USER` |
| 记录类型 | TXT |
| 记录值 | GitHub 生成的完整验证字符串 |
| 线路、TTL | 使用适用的默认值 |

如果 GitHub 显示完整名称 `_github-pages-challenge-YOUR_USER.example.com`，而解析控制台会自动补域名，主机记录就只填 `_github-pages-challenge-YOUR_USER`。不要在会自动补全域名的输入框里再重复填写域名后缀。

保存记录后，等待外部 DNS 能查询到结果，再回 GitHub 点击 `Verify`。成功后保留 TXT 记录，避免失去归属验证。这个入口位于账号设置中，与仓库的 Pages 设置不同。[域名验证说明](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages)

### 9.3 在网站仓库中保存自定义域名

进入网站仓库：

```text
Settings → Pages → Custom domain
```

填写域名本身，例如 `example.com`，并保存。然后配置网站指向的 DNS 记录。GitHub 建议先在 Pages 中登记自定义域名，再设置对应的网站解析。

使用自定义 Actions 工作流发布时，Pages 的这个设置才是域名配置入口；不需要另外依赖源码中的 `CNAME` 文件。

### 9.4 添加网站的解析记录

下面列出 GitHub 官方文档中的 IPv4 目标地址与常用的 `www` 配置：

| 主机记录 | 类型 | 记录值 | 用途 |
| --- | --- | --- | --- |
| @ | A | 185.199.108.153 | 根域名指向 GitHub Pages |
| @ | A | 185.199.109.153 | 同上 |
| @ | A | 185.199.110.153 | 同上 |
| @ | A | 185.199.111.153 | 同上 |
| www | CNAME | YOUR_USER.github.io | 带 www 的地址 |

`@` 表示根域名 `example.com`；`www` 表示 `www.example.com`。CNAME 的记录值填域名，不附加协议、仓库名或网页路径。GitHub 也支持通过服务商提供的 ALIAS / ANAME 配置根域名，具体需要看服务商能力。

表中四个 IP 是 GitHub 公布的目标。DNS 服务商的套餐可能限制相同主机记录、类型和线路下的记录数量，因此实际操作还要核对控制台支持情况。数量受限时的本次实际处理记录在文末，不能把单个账户的配置结果当成所有人的统一规则。[GitHub 自定义域名说明](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)

常见记录类型可以这样理解：

- **A**：把域名指向一个 IPv4 地址。
- **AAAA**：把域名指向一个 IPv6 地址。
- **CNAME**：把一个名字指向另一个域名。
- **TXT**：保存文字信息，例如域名归属验证码。

服务商控制台的“主机记录”是域名前缀，“记录类型”是 A、CNAME、TXT 等分类，“记录值”才是目标地址或验证内容。三个字段不能互相替代。

保存后可以检查解析：

```bash
dig example.com A +short
dig www.example.com CNAME +short
```

Ubuntu 中没有 `dig` 时，可以按需安装 `dnsutils`。也可以在 Windows PowerShell 使用：

```powershell
Resolve-DnsName example.com -Type A
Resolve-DnsName www.example.com -Type CNAME
```

### 9.5 重新构建，让链接切换到新域名

保存自定义域名后，手动运行一次发布流程。此时工作流读取到的正式域名和路径前缀会发生变化。

同时把源配置维护正确：

```yaml
url: "https://example.com"
baseurl: ""
```

在前面给出的流程中，线上构建会生成临时配置来覆盖这两项；但源配置仍会被本地构建、其他发布方式或后续维护使用。

### 9.6 等待证书并启用 HTTPS

DNS 配置正确后，GitHub 会检查域名并申请证书。等 Pages 设置中的 `Enforce HTTPS` 可以操作时，勾选它。

域名检查成功、证书准备完成和网页成功发布是不同的状态，应分别确认。DNS 与证书的准备需要一定时间；GitHub 文档说明，部分操作可能需要等待最长 24 小时。若更换了 DNS 服务器，还要考虑服务商说明的生效时间。[HTTPS 说明](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https)

完成后检查：

```bash
curl -I https://example.com
curl -I https://www.example.com
```

以根域名为正式地址，并且 `www` 配置正确时，GitHub Pages 可以把 `www` 地址重定向到根域名。浏览器中应当能够正常打开页面，证书有效，正文、图片和样式都完整加载。

## 十、以后怎样更新内容
{: #daily}

首次配置完成后，日常无需重新注册域名、重新添加密钥、重新关联仓库或反复配置 DNS。

### 10.1 写博客

复制 `_posts/` 中的一篇文件，改成当天日期和新的文件名，修改 `title`、`date`、`excerpt` 和正文。文件名尽量在发布后保持稳定，因为它可能影响文章网址。

### 10.2 写笔记

复制 `_notes/` 中的一篇文件，使用简短的文件名，例如 `reading-notes.md`。修改顶部信息和正文，列表会在下次生成时自动更新。

已有正文就编辑原文件；想新增一篇内容再新建文件。暂时不准备公开的材料，可以先保存在项目之外。Jekyll 是否输出某页，只控制网页生成；公开仓库里已提交的源文件仍然可以被看到。

### 10.3 更新时间线

在 `_data/timeline.yml` 追加：

```yaml
- date: "2026-11-09"
  title: "完成一件想记下来的事情"
```

按已有格式保留缩进，日期统一写成带引号的 `YYYY-MM-DD`。模板可以自动排序，所以数据不必手工插到某个展示位置。

### 10.4 加入图片

把图片放进 `assets/images/`。需要同时适配临时项目路径和域名根路径时，可以这样写：

```markdown
![图片说明]({{ '/assets/images/example.jpg' | relative_url }})
```

实际文件名、大小写和引用路径保持一致。图片保存到网站目录后，再与文章一起提交。

### 10.5 本地预览，再提交和上传

```bash
cd /mnt/e/projects/personal-site
bundle exec jekyll serve
```

保存后刷新本地页面，确认内容满意。另开一个 Ubuntu 终端用于 Git 操作：

```bash
cd /mnt/e/projects/personal-site
git status --short
git add .
git diff --cached --stat
git commit -m "新增一篇笔记"
git push
```

`git status` 和 `git diff --cached --stat` 用于核对这次准备发布的文件；`add` 选中修改；`commit` 保存版本；`push` 上传提交。

上传成功后，在 Actions 页面等待这次运行变绿，再打开正式网站刷新检查。日常由 `push` 自动触发，手动 `Run workflow` 主要用于首次配置、修改域名设置后或需要重试时。

如果使用多台电脑编辑，同步远程的新版本后再开始改动：

```bash
git pull --ff-only
```

遇到分支分歧或本地修改冲突时，先理解哪些版本需要保留，再处理同步；不要把强制推送当成日常更新步骤。

## 十一、上线验收与长期维护
{: #maintenance}

### 11.1 逐层验收

| 检查层次 | 怎么检查 | 通过的表现 |
| --- | --- | --- |
| 本地源码 | 查看文章、配置和数据文件 | 内容、日期、路径正确 |
| 本地构建 | `bundle exec jekyll build` | 正常完成，没有构建错误 |
| 远程源码 | 刷新 GitHub 仓库 | 能看到本次提交和新文件 |
| 自动生成 | 查看 Actions 的 build | 构建成功，上传生成结果 |
| 网页发布 | 查看 Actions 的 deploy | 部署成功，有部署地址 |
| 域名指向 | 查看 DNS 与 Pages 检查 | 指向预期的平台 |
| HTTPS | 用浏览器正常访问正式地址 | 证书有效，Pages 强制 HTTPS 已启用 |
| 内容与交互 | 打开博客、笔记、时间线和详情页 | 标题、日期、返回入口和资源正常 |
| 手机布局 | 使用手机或窄屏预览 | 文字可读，页面整体不横向溢出 |

自动流程出现黄色警告时，先区分提示与真正的失败步骤。某个 Action 的运行时兼容警告，和 Jekyll 构建出错，不是同一类问题。排查应从失败的步骤及其错误信息入手。

### 11.2 保持可维护

日常主要修改内容文件；布局、样式、翻译和发布配置按需要单独维护。需要调整视觉时，尽量只修改对应区域，避免全局选择器影响导航或正文。

定期检查域名续费、依赖兼容与 Action 官方支持情况。升级依赖后先本地构建，再检查远程发布和正式页面。Git 历史能帮助追溯修改，但尚未提交的文件和放在项目外的材料仍需要自己的备份方式。

公开发布长篇技术笔记时，还要注意代码围栏中的 Liquid 或 `${{ ... }}`。Jekyll 会先处理 Liquid，再处理 Markdown，普通代码围栏并不阻止 Liquid 执行。需要展示这类源码时，应使用 Liquid 的原样输出机制，并在生成后核对代码是否完整。

## 十二、官方参考资料
{: #references}

- [WSL 基础命令与安装位置](https://learn.microsoft.com/en-us/windows/wsl/basic-commands)
- [Jekyll 在 Ubuntu 上安装](https://jekyllrb.com/docs/installation/ubuntu/)
- [Jekyll 项目目录](https://jekyllrb.com/docs/structure/)
- [Jekyll 文章](https://jekyllrb.com/docs/posts/)
- [Jekyll 集合](https://jekyllrb.com/docs/collections/)
- [Minimal Mistakes 快速开始](https://mmistakes.github.io/minimal-mistakes/docs/quick-start-guide/)
- [Bundler 与 Ruby 兼容要求](https://github.com/rubygems/guides/blob/main/bundler-compatibility.md)
- [GitHub SSH 连接测试](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/testing-your-ssh-connection)
- [GitHub Pages 自动发布流程](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
- [GitHub Pages 自定义域名](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)
- [腾讯云 DNS 解析入门](https://cloud.tencent.com/document/product/302/3446)
- [DNSPod 负载均衡记录数量说明](https://docs.dnspod.cn/dns/other-faqs/)

## 十三、本次建站的实际配置与个人问题
{: #experience}

前面的内容是可以复用的操作路线。下面集中记录这一次的选择、遇到的问题、解决办法和最终核验结果，避免把个人路径、域名和套餐限制混入通用步骤。

### 13.1 最终方案与项目位置

| 项目 | 本次使用的值 |
| --- | --- |
| 正式网址 | `https://wantching.site` |
| 域名注册与 DNS | 腾讯云注册，腾讯云 DNSPod 解析 |
| 托管方式 | GitHub 公开仓库与 GitHub Pages |
| 仓库 | `Wantching/wantching-site` |
| Windows 项目目录 | `E:\projects\wantching-site` |
| Ubuntu 项目目录 | `/mnt/e/projects/wantching-site` |
| 内容与主题 | Jekyll、Minimal Mistakes |
| 本地 Ruby | 本次检测为 3.2.3 |
| 发布环境 | 工作流中的 Ubuntu 24.04、Ruby 3.3，Bundler 版本由项目锁文件确定 |
| 发布流程 | `Deploy Jekyll site to Pages` |

本次最终没有采用 Cloudflare Pages。网站结构为 Home、Blog、Notes、Timeline 和 Guestbook；留言板目前是页面入口与占位内容，真正的留言系统需要另行实现。

### 13.2 Git 第一次提交提示 Author identity unknown

开始保存项目版本时，Git 因缺少提交署名而拒绝提交。设置 `user.name` 与 `user.email` 后，再次执行提交即可。

这里配置的是提交作者信息，不是 GitHub 登录。文件已经暂存时，不需要因为这个错误重新初始化仓库。

### 13.3 Windows 的 SSH 成功，不代表 Ubuntu 已配置

最初验证成功的是 Windows SSH。后来在 Ubuntu 检查时，默认密钥目录与首次信任信息尚未准备好，所以不能直接把 Windows 的成功结果当作 Ubuntu 的状态。

这次选择复用已经绑定 GitHub 的密钥，将 Windows 的 `id_ed25519` 和公钥复制到 Ubuntu 用户的 `~/.ssh/`，并设置权限：

```bash
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# 将 <Windows用户名> 换成实际值；目标目录中已有同名密钥时先确认用途。
cp "/mnt/c/Users/<Windows用户名>/.ssh/id_ed25519" ~/.ssh/
cp "/mnt/c/Users/<Windows用户名>/.ssh/id_ed25519.pub" ~/.ssh/

chmod 600 ~/.ssh/id_ed25519
chmod 644 ~/.ssh/id_ed25519.pub
ssh -T git@github.com
```

核对 GitHub 官方指纹并完成首次信任后，Ubuntu 显示：

```text
Hi Wantching! You've successfully authenticated, but GitHub does not provide shell access.
```

现在 Ubuntu 可以直接进行 Git 操作，日常不必再切到 PowerShell。新设备也可以选择单独生成自己的密钥，而不是必须复制旧设备的密钥。

### 13.4 域名曾被误记成 wantching.com

最终注册的是 **wantching.site**。`.com` 是前期沟通中的错误信息，不是这个网站最终使用的域名。

本次重新核对时，实际 `_config.yml` 已经是：

```yaml
url: "https://wantching.site"
baseurl: ""
timezone: "Asia/Shanghai"
```

交接摘要中“配置仍是 `.com`”的说法与当前文件不一致，因此以实际文件为准。README 中的终端用法和解析步骤则需要按最终情况更新。

线上构建会读取 Pages 的实际域名并生成临时覆盖配置，所以“某次发布成功”和“源码配置已经维护正确”需要分别核对。

### 13.5 第一次发布失败：Pages 尚未开启

读取第一次运行的失败日志，错误出现在 `Read Pages address`：

```text
Get Pages site failed.
Please verify that the repository has Pages enabled
and configured to build using GitHub Actions.
Error: Not Found
```

这是流程读取 Pages 设置时遇到的 404，不是文章正文或主题样式的问题。把仓库 Pages 的发布源设为 GitHub Actions，再运行流程后，后续发布成功。

当前可核对到的运行记录是：

| 运行编号 | 结果 | 说明 |
| --- | --- | --- |
| #1 | 失败 | Pages 设置读取失败 |
| #2 | 成功 | 初次网站发布跑通 |
| #3 | 成功 | 绑定域名后重新生成并部署 |

三次运行对应的提交为 `31401d4`，提交说明是 `chore: prepare website publishing`。绑定域名后的成功记录可以在 [第 3 次发布](https://github.com/Wantching/wantching-site/actions/runs/42595826091) 中查看。

成功运行仍出现过 Node.js 20 兼容性警告：部分 Action 以 Node.js 20 为目标，由 GitHub 兼容运行到 Node.js 24。这次没有因为警告改动已经跑通的发布流程；后续维护时再对照 Action 官方说明升级和验证。

### 13.6 TXT 曾填进“主机记录”，类型仍是 A

进行域名归属验证时，DNSPod 新增行里的主机记录一度填成 `TXT`，而记录类型仍为 `A`。这混淆了字段名称。

正确填写是：

| 字段 | 本次对应内容 |
| --- | --- |
| 主机记录 | `_github-pages-challenge-Wantching` |
| 记录类型 | TXT |
| 记录值 | GitHub 当时给出的验证字符串 |
| 自动补全的域名后缀 | `.wantching.site` |

保存并等待生效后，回到 GitHub 点击 Verify。本次已经完成归属验证，验证用的 TXT 记录继续保留。验证码应从自己的 GitHub 页面复制，不套用别人笔记里的字符串。

### 13.7 DNSPod 免费版只允许本次同类 A 记录保留两条

最初照 GitHub 的四个 IPv4 目标逐条添加时，控制台提示相同主机记录、类型和线路下数量受限。这次实际使用的免费版限制为两条；DNSPod 的中文 FAQ 也列出了免费版 A 记录负载均衡的两条限制。不同地区站点和套餐资料可能不同，仍应以实际控制台与当前套餐为准。[DNSPod 说明](https://docs.dnspod.cn/dns/other-faqs/)

最终没有升级套餐，保留了以下记录：

| 主机记录 | 类型 | 记录值 |
| --- | --- | --- |
| @ | A | 185.199.108.153 |
| @ | A | 185.199.109.153 |
| www | CNAME | wantching.github.io |
| _github-pages-challenge-Wantching | TXT | GitHub 提供的验证值，继续保留 |

这两条 A 记录都是 GitHub 公布的目标，当前已经通过 GitHub 的 DNS 检查，外部查询也返回这两个地址。这是本次套餐限制下验证可用的配置；GitHub 公布的完整目标仍是前面列出的四个，不能把本次两条记录写成 GitHub 对所有人的统一要求。

### 13.8 绑定域名后，重新生成网页路径

临时项目网址可能带有 `/wantching-site` 前缀，正式域名则从根路径访问。只改域名设置，不重新生成网页，旧的资源前缀可能仍留在页面里。

本次工作流会读取 Pages 的实际网址并覆盖构建配置，因此在保存正式域名后，再手动运行一次流程。第 3 次运行的 build、deploy 均成功，部署地址已显示为 `wantching.site`。

### 13.9 页面定制中的选择与修正

这次设计最后采用了以下做法：

- 首页只保留一句问候，放在导航与页脚之间居中。
- 博客和笔记使用整块可点击的简洁卡片；列表顶部不再重复显示栏目大标题。
- 时间线参考归档的年份与月日排版，但数据由作者手动选择。
- 前期曾把“参考归档布局”理解为新增博客归档，后来撤掉了这个额外入口。
- 笔记不增加花哨的分类，正文内容优先。
- 中英文切换只改变界面，文章和笔记标题保留写作语言。
- 卡片使用 EB Garamond 与 Noto Serif SC，日期数字也随字体改变；字体和授权保存在项目中。
- 页脚使用淡灰色并居中排列。

技术上还处理了主题的导航缓存与菜单宽度问题：当前栏目状态按实际页面设置，菜单为两种语言预留宽度，避免切换语言后发生挤压。主题自动标题和自定义首页问候也需要协调，才能避免出现两个重复的大标题。

### 13.10 最终状态复核

2026-11-09，在本篇笔记提交之前，对实际项目、公开发布记录和线上访问重新检查，结果如下：

| 核对项 | 结果 |
| --- | --- |
| 本地分支 | `main`，跟踪 `origin/main` |
| 远程仓库 | `git@github.com:Wantching/wantching-site.git` |
| Ubuntu SSH | 成功识别账号 Wantching |
| 根域名 A 记录 | 返回 `185.199.108.153` 与 `185.199.109.153` |
| www CNAME | 指向 `wantching.github.io` |
| 撰写时最近的发布 | 第 3 次运行成功，提交 `31401d4` |
| Pages 自定义域名 | `wantching.site` |
| 强制 HTTPS | GitHub Pages 设置接口返回已启用 |
| HTTPS 首页 | 正常证书校验下返回 HTTP 200 |
| HTTPS 笔记列表 | 正常证书校验下返回 HTTP 200 |
| HTTPS www 地址 | 跳转到 `https://wantching.site/`，最终返回 HTTP 200 |

因此，侧边交接时尚未独立实测的 HTTPS 状态，本次已经补充核实。以后在 Ubuntu 项目目录中更新内容即可：

```bash
cd /mnt/e/projects/wantching-site
git add .
git commit -m "更新网站内容"
git push
```

日常上传后等待自动发布成功即可；时间线上是否新增事件，仍然由自己单独决定。

{% endraw %}
