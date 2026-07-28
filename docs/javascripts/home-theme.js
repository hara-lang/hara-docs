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

  window.addEventListener("DOMContentLoaded", () => {
    const button = document.querySelector("[data-hara-theme-toggle]");
    const menu = document.querySelector("[data-hara-home-menu]");
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
