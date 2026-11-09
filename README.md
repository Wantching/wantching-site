# Wantching 网站更新说明

平时的流程是：**写内容 → 保存并预览 → 提交并上传 → GitHub 自动发布**。自动发布需要先完成本文末尾的一次性配置。

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

新增笔记目录的设置已经写好；如果你原来开着预览服务，这次先停止，再重新运行上面的命令。

## 图片、示例和时间线

- 图片放进 `assets/images/`，正文写 `![说明](/assets/images/图片文件名.jpg)`。
- 目前两篇博客、两篇笔记都是示例，可以直接改写，也可以删除对应文件。全部删掉后，列表会显示暂无内容。
- 更新博客或笔记不会自动修改时间线；时间线只编辑 `_data/timeline.yml`。
- 界面切换到英文时，文章标题和正文保持你写的语言。英文文章可在顶部另加 `content_language: en`，用于标记正文语言。

## 以后怎样发布更新

首次配置完成后，在 Windows PowerShell 里执行：

```powershell
cd E:\projects\wantching-site
git add .
git commit -m "更新网站内容"
git push
```

`add` 选中这次修改，`commit` 在电脑上存一个版本，`push` 把版本发送到 GitHub。提交说明可以换成“新增博客”“更新时间线”等。

上传后，到仓库的 Actions 页面查看结果。`Deploy Jekyll site to Pages` 显示绿色勾，表示这次网站更新已发布。只保存文件或只执行 `commit`，还没有上传。

## 第一次连接与发布（只做一次）

使用已经建好的公开空仓库：<https://github.com/Wantching/wantching-site>。

目前已验证能连接 GitHub 的密钥在 Windows 环境里，因此以下命令在 Windows PowerShell 执行；Ubuntu / WSL 继续用于本地预览。

1. 关联仓库地址（只执行一次）：

   ```powershell
   cd E:\projects\wantching-site
   git remote add origin git@github.com:Wantching/wantching-site.git
   git remote -v
   ```

2. 保存并首次上传：

   ```powershell
   git add .
   git commit -m "chore: prepare GitHub Pages deployment"
   git push -u origin main
   ```

3. 打开仓库的 `Settings → Pages`，把 `Build and deployment → Source` 设为 **GitHub Actions**。项目已有 `.github/workflows/deploy.yml`，直接使用这份配置。

4. 打开仓库的 `Actions`，选择 **Deploy Jekyll site to Pages → Run workflow → main → Run workflow**。如果首次推送时 Pages 尚未开启，先完成第 3 步，再运行一次即可。

5. 等 `build` 和 `deploy` 都显示绿色勾，从 Pages 设置页面打开生成的网址。绑定域名前通常是 <https://wantching.github.io/wantching-site/>。

自动发布的作用：GitHub 收到 `main` 分支的新版本后，在它的服务器上安装项目依赖、运行 Jekyll 生成网页，再交给 GitHub Pages 发布。这个过程在 GitHub 上运行，完成上传后电脑可以关机。

## 绑定腾讯云域名 wantching.site（只做一次）

1. 在 GitHub 账号的 `Settings → Pages` 中添加并验证 `wantching.site`。按页面提示，在腾讯云的域名解析中添加对应的 TXT 记录，名称和记录值照 GitHub 显示的填写。

2. 打开网站仓库的 `Settings → Pages → Custom domain`，填写 `wantching.site` 并保存。

3. 在腾讯云 **云解析 DNS / DNSPod → wantching.site → 记录管理** 添加以下记录，线路和 TTL 保持默认。表中每一行都是单独的一条记录：

   | 主机记录 | 记录类型 | 记录值 |
   | --- | --- | --- |
   | @ | A | 185.199.108.153 |
   | @ | A | 185.199.109.153 |
   | @ | A | 185.199.110.153 |
   | @ | A | 185.199.111.153 |
   | www | CNAME | wantching.github.io |

   `@` 表示 `wantching.site`，`www` 表示 `www.wantching.site`。若同名记录已经指向其他网站，应调整为这里的目标；保留域名验证用的 TXT 记录。

4. 再手动运行一次 **Deploy Jekyll site to Pages**。流程会根据 GitHub Pages 的域名设置，自动把网页链接从临时网址切换到正式域名。

5. 等域名检查和证书准备完成，在 GitHub Pages 设置中勾选 **Enforce HTTPS**，检查 <https://wantching.site> 能否正常访问。按上述配置，`www.wantching.site` 会转到 `wantching.site`。

以上是一次性设置。以后写文章、改笔记或更新时间线，只需要执行前面的日常发布命令。

官方参考：[GitHub 自动发布](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)、[自定义域名](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)、[腾讯云域名解析](https://cloud.tencent.com/document/product/302/3446)。
