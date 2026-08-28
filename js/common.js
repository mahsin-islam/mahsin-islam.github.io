/**
 * Common utilities shared by every page (zero dependencies, safe no-ops):
 *   - footer year (#year)
 *   - theme init + toggle (#themeToggle) on <html data-theme>
 *   - mobile nav (#mobileToggle / #navLinks)
 *   - modal focus helpers (window.__a11y)
 * Load on every page. Keep this file framework-free and tiny.
 */
(function () {
  /* footer year */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* theme */
  var rootEl = document.documentElement;
  function applyTheme(t) {
    rootEl.setAttribute("data-theme", t);
    try {
      localStorage.setItem("theme", t);
    } catch (e) {}
  }
  var saved = null;
  try {
    saved = localStorage.getItem("theme");
  } catch (e) {}
  if (saved === "light" || saved === "dark") applyTheme(saved);

  var themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      applyTheme(rootEl.getAttribute("data-theme") === "dark" ? "light" : "dark");
    });
  }

  /* mobile nav */
  var mtoggle = document.getElementById("mobileToggle");
  var navLinks = document.getElementById("navLinks");
  if (mtoggle && navLinks) {
    mtoggle.addEventListener("click", function () {
      var open = navLinks.classList.toggle("open");
      mtoggle.setAttribute("aria-expanded", String(open));
    });
    navLinks.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        navLinks.classList.remove("open");
        mtoggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* modal focus management (used by modals/lightboxes site-wide) */
  window.__a11y = {
    lastFocus: null,
    saveFocus: function () {
      this.lastFocus = document.activeElement;
    },
    focusFirst: function (container) {
      if (!container) return;
      var el = container.querySelector('button, a[href], [tabindex]:not([tabindex="-1"])');
      if (el) el.focus();
    },
    restoreFocus: function () {
      if (this.lastFocus && typeof this.lastFocus.focus === "function") {
        this.lastFocus.focus();
      }
      this.lastFocus = null;
    }
  };
})();
