# Wantching 网站更新说明

网站已经上线：<https://wantching.site>。平时的流程是：**在 Ubuntu 写内容 → 保存并预览 → 提交并上传 → GitHub 自动发布**。

从零建站的完整通用流程与本次问题记录，见 [建站笔记](_notes/build-personal-site-with-jekyll-github-pages.md)。

## 文件放在哪里

```text
_posts/          博客文章
_notes/          笔记
_data/timeline.yml  自己选择的时间线事件
assets/images/  正文里的图片（需要时再创建）
```

`_pages/blog.md` 和 `_pages/notes.md` 是列表页面，平时不用改。也不要修改 `_site/`，那是自动生成的预览结果。

## 写一篇博客

复制 `_posts/` 中的一篇文件，改成这样的名字：

```text
2026-11-09-my-first-post.md
```

前面是日期，后面是简短的英文文件名。同一天可以写多篇，文件名不同即可。

文件内容照着写：

```markdown
---
title: "我的第一篇文章"
date: 2026-11-09
excerpt: "这里写一两句话，作为列表中的简介。"
---

从这里开始写正文。

## 一个小标题

段落之间空一行就好。
```

把示例日期换成文章的日期，并让它与文件名一致。博客日期写到未来时，默认不会显示。文件名用英文，页面显示的中文标题由 `title` 决定。

## 写一篇笔记

同样复制 `_notes/` 中的一篇，文件名写成 `my-note.md` 就行，不用在前面加日期。顶部仍然填写 `title`、`date` 和 `excerpt`，下面写正文。

博客和笔记都按日期从新到旧排列。`excerpt` 是可选的；不写时，列表会取正文开头作为简介。改旧内容时，直接编辑原文件即可。

## 本地看效果

在 Ubuntu / WSL 终端里运行：

```bash
cd /mnt/e/projects/wantching-site
bundle exec jekyll serve
```

然后打开 <http://localhost:4000>。保存文章后，等终端重新生成页面，再刷新浏览器即可。停止预览按 `Ctrl+C`。

修改 `_config.yml` 等全局配置后，先停止预览，再重新启动。

## 图片、示例和时间线

- 图片放进 `assets/images/`，正文写 `![说明](/assets/images/图片文件名.jpg)`。
- 目前两篇博客、两篇笔记都是示例，可以直接改写，也可以删除对应文件。全部删掉后，列表会显示暂无内容。
- 更新博客或笔记不会自动修改时间线；时间线只编辑 `_data/timeline.yml`，页面按日期从早到晚排列，新事件接在下方。
- 界面切换到英文时，文章标题和正文保持你写的语言。英文文章可在顶部另加 `content_language: en`，用于标记正文语言。

## 以后怎样发布更新

现在 Ubuntu 的 SSH 已经配置好，可以在 Ubuntu 终端直接执行：

```bash
cd /mnt/e/projects/wantching-site
git add .
git commit -m "更新网站内容"
git push
```

`add` 选中这次修改，`commit` 在电脑上存一个版本，`push` 把版本发送到 GitHub。提交说明可以换成“新增博客”“更新时间线”等。

上传后，到仓库的 Actions 页面查看结果。`Deploy Jekyll site to Pages` 显示绿色勾，表示这次网站更新已发布。只保存文件或只执行 `commit`，还没有上传。

## 第一次连接与发布（已完成，重建时参考）

当前公开仓库：<https://github.com/Wantching/wantching-site>。已经首次上传，`main` 跟踪 `origin/main`。

Windows 与 Ubuntu 的 SSH 配置彼此独立。本次已经在 Ubuntu 完成密钥配置、权限设置和 GitHub 服务器指纹核对，`ssh -T git@github.com` 已验证成功，后续预览与上传都可以在 Ubuntu 进行。

1. 下面的关联操作只适用于尚未设置 `origin` 的新本地仓库；当前项目已经完成：

   ```bash
   cd /mnt/e/projects/wantching-site
   git remote add origin git@github.com:Wantching/wantching-site.git
   git remote -v
   ```

2. 保存并首次上传：

   ```bash
   git add .
   git commit -m "chore: prepare GitHub Pages deployment"
   git push -u origin main
   ```

3. 打开仓库的 `Settings → Pages`，把 `Build and deployment → Source` 设为 **GitHub Actions**。项目已有 `.github/workflows/deploy.yml`，直接使用这份配置。

4. 打开仓库的 `Actions`，选择 **Deploy Jekyll site to Pages → Run workflow → main → Run workflow**。如果首次推送时 Pages 尚未开启，先完成第 3 步，再运行一次即可。

5. 等 `build` 和 `deploy` 都显示绿色勾，从 Pages 设置页面打开生成的网址。绑定域名前通常是 <https://wantching.github.io/wantching-site/>。

自动发布的作用：GitHub 收到 `main` 分支的新版本后，在它的服务器上安装项目依赖、运行 Jekyll 生成网页，再交给 GitHub Pages 发布。这个过程在 GitHub 上运行，完成上传后电脑可以关机。

## 腾讯云域名 wantching.site（已完成，当前记录）

1. 在 GitHub 账号的 `Settings → Pages` 中添加并验证 `wantching.site`。验证已完成，对应 TXT 记录继续保留。GitHub 给出完整名称时，腾讯云“主机记录”只填自动补全域名前面的部分；记录类型选 TXT，记录值填 GitHub 给出的验证码。

2. 打开网站仓库的 `Settings → Pages → Custom domain`，填写 `wantching.site` 并保存。

3. 腾讯云 **云解析 DNS / DNSPod → wantching.site → 记录管理** 当前使用以下记录，线路和 TTL 保持默认：

   | 主机记录 | 记录类型 | 记录值 |
   | --- | --- | --- |
   | @ | A | 185.199.108.153 |
   | @ | A | 185.199.109.153 |
   | www | CNAME | wantching.github.io |
   | _github-pages-challenge-Wantching | TXT | GitHub 提供的验证值，继续保留 |

   `@` 表示 `wantching.site`，`www` 表示 `www.wantching.site`。本次 DNSPod 免费版对同主机、同类型、同线路的 A 记录限制为两条，因此实际保留上表两条，已经通过 GitHub 的 DNS 检查。

   GitHub 官方还公布了 `185.199.110.153` 和 `185.199.111.153`。这里记录的是本项目在当前套餐下的实际配置，不能把两条写成所有 DNS 服务商通用的要求。

4. 绑定域名后已手动运行 **Deploy Jekyll site to Pages**，第 3 次运行成功。流程根据 GitHub Pages 的域名设置，把网页链接从临时网址切换到正式域名。以后修改域名设置时，再手动运行一次；日常文章更新由推送自动触发。

5. 2026-11-09 复核：**Enforce HTTPS 已开启**；<https://wantching.site> 和笔记页通过 HTTPS 正常返回，`https://www.wantching.site` 会跳转到主域名。无需再重复执行首次验证和绑定步骤。

以上是一次性设置。以后写文章、改笔记或更新时间线，只需要执行前面的日常发布命令。

官方参考：[GitHub 自动发布](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)、[自定义域名](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)、[腾讯云域名解析](https://cloud.tencent.com/document/product/302/3446)。
