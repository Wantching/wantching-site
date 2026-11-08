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
