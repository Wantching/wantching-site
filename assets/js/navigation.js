(() => {
  "use strict";

  // The theme caches the masthead across pages. Keep page-specific state here.
  const page = document.querySelector('meta[name="navigation-page"]')?.content;
  const section = document.querySelector('meta[name="navigation-section"]')?.content;
  const home = document.querySelector("#site-nav .site-title")?.getAttribute("href");
  if (!page || !section || !home) return;

  document.querySelectorAll("#site-nav .masthead__menu-item > a").forEach((link) => {
    const path = link.getAttribute("href");
    link.removeAttribute("aria-current");
    if (!path) return;

    if (path === page) {
      link.setAttribute("aria-current", "page");
    } else if (path !== home && section.startsWith(path)) {
      link.setAttribute("aria-current", "location");
    }
  });
})();
