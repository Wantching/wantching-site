---
layout: listing
title: "笔记"
ui_title: "nav.notes"
permalink: /notes/
author_profile: false
classes: content-page
page_css:
  - /assets/css/card-fonts.css
  - /assets/css/blog.css
---

{% assign notes = site.notes | sort: "date" | reverse %}
{% if notes.size > 0 %}

<div class="blog-list">
{% for note in notes %}
  <article class="blog-entry"{% if note.content_language %} lang="{{ note.content_language | escape }}"{% endif %}>
    <a class="blog-entry__link" href="{{ note.url | relative_url }}" aria-labelledby="note-entry-{{ forloop.index }}">
    <h2 class="blog-entry__title" id="note-entry-{{ forloop.index }}">{{ note.title | escape }}</h2>
    {% if note.excerpt %}
      <p class="blog-entry__excerpt">{{ note.excerpt | markdownify | strip_html | normalize_whitespace | truncate: 180 | escape }}</p>
    {% endif %}
    <p class="blog-entry__meta"><time datetime="{{ note.date | date_to_xmlschema }}">{{ note.date | date: "%Y-%m-%d" }}</time></p>
    </a>
  </article>
{% endfor %}
</div>

{% else %}

<p data-i18n="notes.intro">目前还没有发布笔记。</p>

{% endif %}
