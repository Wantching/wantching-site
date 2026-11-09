---
layout: listing
title: "博客"
ui_title: "nav.blog"
permalink: /blog/
author_profile: false
classes: content-page
page_css:
  - /assets/css/card-fonts.css
  - /assets/css/blog.css
---

{% if site.posts.size > 0 %}

<div class="blog-list">
{% for post in site.posts %}
  <article class="blog-entry"{% if post.content_language %} lang="{{ post.content_language | escape }}"{% endif %}>
    <a class="blog-entry__link" href="{{ post.url | relative_url }}" aria-labelledby="blog-entry-{{ forloop.index }}">
    <h2 class="blog-entry__title" id="blog-entry-{{ forloop.index }}">{{ post.title | escape }}</h2>
    {% if post.excerpt %}
      <p class="blog-entry__excerpt">{{ post.excerpt | markdownify | strip_html | normalize_whitespace | truncate: 180 | escape }}</p>
    {% endif %}
    <p class="blog-entry__meta">
      <time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%Y-%m-%d" }}</time>
      {% if post.categories.size > 0 %}<span aria-hidden="true"> · </span><span>{{ post.categories | join: " / " | escape }}</span>{% endif %}
    </p>
    </a>
  </article>
{% endfor %}
</div>

{% else %}

<p class="blog-empty" data-i18n="ui.no_posts">目前还没有发布文章。</p>

{% endif %}
