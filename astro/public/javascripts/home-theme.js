(() => {
  const key = "hara-docs-theme";
  const root = document.documentElement;
  const preferred = () =>
    window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  const stored = localStorage.getItem(key);
  const setTheme = (theme) => {
    root.dataset.haraTheme = theme;
    root.dataset.haraHomeTheme = theme;
  };
  setTheme(stored === "light" || stored === "dark" ? stored : preferred());

  const currentSection = () => {
    const path = window.location.pathname.replace(/^\/+|\/+$/g, "");
    if (/^(reference|builtins)/.test(path)) return "reference";
    if (/^(start\/(clojure|web-developers|data-scientists|game-developers|react)|development|javadocs|foundation-porting|web-specific|walkthroughs|projects|create\/(chrome-project|vscode-project))/.test(path)) return "guides";
    if (/^(learn-programming|user-guide|namespaces)/.test(path)) return "learn";
    if (/^(start|create|getting-started)/.test(path)) return "start";
    return null;
  };

  window.addEventListener("DOMContentLoaded", () => {
    const button = document.querySelector("[data-hara-theme-toggle]");
    const menu = document.querySelector("[data-hara-home-menu]");
    const section = currentSection();
    document.querySelectorAll("[data-hara-section]").forEach((link) => {
      link.classList.toggle("is-section-active", link.dataset.haraSection === section);
    });
    const render = () => {
      const theme = root.dataset.haraTheme;
      button?.setAttribute("aria-label", `Switch to ${theme === "dark" ? "light" : "dark"} theme`);
    };
    button?.addEventListener("click", () => {
      const theme = root.dataset.haraTheme === "dark" ? "light" : "dark";
      setTheme(theme);
      localStorage.setItem(key, theme);
      render();
    });
    menu?.addEventListener("click", () => {
      const open = menu.getAttribute("aria-expanded") === "true";
      menu.setAttribute("aria-expanded", String(!open));
      document.querySelector(".hara-home-header")?.classList.toggle("is-menu-open", !open);
    });
    render();
  });
})();
