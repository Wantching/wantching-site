(() => {
  "use strict";

  const source = document.getElementById("site-translations");
  if (!source) return;

  let dictionary;
  try {
    dictionary = JSON.parse(source.textContent);
  } catch (error) {
    console.error("无法读取界面翻译字典。", error);
    return;
  }

  const languages = ["zh-CN", "en"];
  if (!languages.every((language) => dictionary?.[language])) return;

  const storageKey = "wantching.uiLanguage";
  const buttons = document.querySelectorAll("[data-set-language]");
  const titleKey = document.querySelector('meta[name="ui-title-key"]')?.content;
  const siteTitle = document.querySelector('meta[name="ui-site-title"]')?.content;
  const contentLanguage = document.querySelector('meta[name="page-content-language"]')?.content;

  // Only explicitly marked interface pages opt into heading translation.
  if (titleKey) {
    const heading = document.getElementById("page-title");
    const titleTarget = heading?.querySelector("a") || heading;
    if (titleTarget) titleTarget.setAttribute("data-i18n", titleKey);
  }

  // Content keeps its own language when the surrounding interface changes.
  if (contentLanguage) {
    const content = document.querySelector(".page__content");
    if (content) content.setAttribute("lang", contentLanguage);
  }

  function lookup(language, key) {
    return key.split(".").reduce(
      (value, part) => value?.[part],
      dictionary[language]
    );
  }

  function applyLanguage(language) {
    if (!languages.includes(language)) return;

    document.documentElement.lang = language;

    document.querySelectorAll("[data-i18n]").forEach((element) => {
      const text = lookup(language, element.getAttribute("data-i18n"));
      if (typeof text === "string") {
        element.textContent = text;
        element.setAttribute("lang", language);
      }
    });

    if (titleKey) {
      const title = lookup(language, titleKey);
      if (typeof title === "string") {
        document.title = siteTitle ? title + " - " + siteTitle : title;
      }
    }

    const attributes = [
      ["data-i18n-aria-label", "aria-label"],
      ["data-i18n-placeholder", "placeholder"]
    ];

    attributes.forEach(([keyAttribute, targetAttribute]) => {
      document.querySelectorAll("[" + keyAttribute + "]").forEach((element) => {
        const text = lookup(language, element.getAttribute(keyAttribute));
        if (typeof text === "string") {
          element.setAttribute(targetAttribute, text);
        }
      });
    });

    buttons.forEach((button) => {
      const active = button.getAttribute("data-set-language") === language;
      button.setAttribute("aria-pressed", String(active));
    });

    window.dispatchEvent(new Event("resize"));
  }

  let initialLanguage = "zh-CN";
  try {
    const saved = window.localStorage.getItem(storageKey);
    if (languages.includes(saved)) initialLanguage = saved;
  } catch {
    // 本地存储不可用时，仍允许当前页面切换语言。
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const language = button.getAttribute("data-set-language");
      applyLanguage(language);
      try {
        window.localStorage.setItem(storageKey, language);
      } catch {
        // 保存失败不影响当前页面。
      }
    });
  });

  applyLanguage(initialLanguage);
  document.querySelectorAll("[data-language-switcher]").forEach((element) => {
    element.hidden = false;
  });
  window.dispatchEvent(new Event("resize"));

  window.addEventListener("storage", (event) => {
    if (event.key === storageKey || event.key === null) {
      applyLanguage(languages.includes(event.newValue) ? event.newValue : "zh-CN");
    }
  });
})();
