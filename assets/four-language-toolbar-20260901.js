(() => {
  "use strict";
  if (window.__cpaFourLanguageToolbarReady) return;
  window.__cpaFourLanguageToolbarReady = true;
  window.__cpaFourLanguageToolbar = true;
  document.documentElement.classList.add("cpa-four-language-toolbar-active");

  const ROOT = "/child-advocacy-site/";
  const ROUTES_URL = `${ROOT}data/four-language-routes.json?v=20260901-1`;
  const ENGAGEMENT_API = "https://global-protection.jerryzuhow77.chatgpt.site/api/public/view-count";
  const WORKER_API = "https://sweet-art-bed8child-advocacy-page-views.jerryzuhow77.workers.dev/views";
  const localeNames = { "zh-Hant": "繁中", "zh-Hans": "简中", en: "EN", ja: "日本語" };
  const copy = {
    "zh-Hant": { brand: "護童行動聯盟", official: "官方網站", views: "瀏覽", unavailable: "尚未提供此語言版本", aria: "四語頂端工具列" },
    "zh-Hans": { brand: "护童行动联盟", official: "官方网站", views: "浏览", unavailable: "尚未提供此语言版本", aria: "四语顶端工具栏" },
    en: { brand: "Child Protection Action Alliance", official: "Official Site", views: "Views", unavailable: "This language edition is not available yet", aria: "Four-language top toolbar" },
    ja: { brand: "子ども保護行動連盟", official: "公式サイト", views: "閲覧", unavailable: "この言語版はまだ公開されていません", aria: "4言語トップツールバー" },
  };

  function clientId() {
    try {
      let value = localStorage.getItem("cpa_engagement_client_v1");
      if (!value) {
        value = crypto.randomUUID();
        localStorage.setItem("cpa_engagement_client_v1", value);
      }
      return value;
    } catch (_) {
      return "";
    }
  }

  function locale() {
    const requested = new URLSearchParams(location.search).get("lang")?.trim().toLowerCase();
    if (requested === "zh-hans" || requested === "zh-cn") return "zh-Hans";
    if (requested === "zh-hant" || requested === "zh-tw") return "zh-Hant";
    if (requested === "en") return "en";
    if (requested === "ja") return "ja";
    const value = (document.documentElement.lang || "zh-Hant").toLowerCase();
    if (value.startsWith("zh-hans") || value === "zh-cn") return "zh-Hans";
    if (value.startsWith("en")) return "en";
    if (value.startsWith("ja")) return "ja";
    return "zh-Hant";
  }

  function neutralRoute() {
    let path = location.pathname.replace(/^\/child-advocacy-site\/?/i, "").replace(/index\.html$/i, "").replace(/^\/+|\/+$/g, "");
    const parts = path.split("/").filter(Boolean);
    if (/^(?:en|ja|zh-hans|zh-hant)$/i.test(parts[0] || "")) parts.shift();
    const language = locale();
    if ((language === "en" || language === "ja") && parts[parts.length - 1]?.toLowerCase() === language) parts.pop();
    path = parts.filter((part) => !/^zh-hans$/i.test(part)).join("/");
    return path ? `${path}/` : "";
  }

  function articleKey(route) {
    const slug = route.replace(/\/+$/g, "").toLowerCase().replace(/[^a-z0-9_-]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
    return slug ? `official-${slug}` : "homepage-all-languages-v1";
  }

  function format(value) {
    const language = locale();
    const tag = language === "zh-Hans" ? "zh-CN" : language === "zh-Hant" ? "zh-TW" : language;
    try { return new Intl.NumberFormat(tag).format(value); } catch (_) { return String(value); }
  }

  async function recordOrReadView(route, element) {
    if (!route || document.querySelector("[data-home-view-counter]")) return;
    const key = articleKey(route);
    const seenKey = `cpa_article_viewed_${key}`;
    let increment = true;
    try { increment = !sessionStorage.getItem(seenKey); } catch (_) {}
    const payload = { channel: "official-article", articleKey: key, action: increment ? "view" : "read", clientId: clientId() };
    try {
      if (increment) sessionStorage.setItem(seenKey, "pending");
      const response = await fetch(ENGAGEMENT_API, { method: "POST", cache: "no-store", credentials: "omit", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
      if (!response.ok) throw new Error(`counter ${response.status}`);
      const data = await response.json();
      const value = Number(data.viewCount);
      if (!Number.isFinite(value) || value < 0) throw new Error("invalid counter");
      if (increment) sessionStorage.setItem(seenKey, "1");
      element.querySelector("b").textContent = format(value);
      element.hidden = false;
      return;
    } catch (_) {
      try { if (increment) sessionStorage.removeItem(seenKey); } catch (_) {}
    }

    try {
      const slug = key.replace(/^official-/, "");
      const url = `${WORKER_API}?page=${encodeURIComponent(`page-${slug}`)}&increment=0&ts=${Date.now()}`;
      const response = await fetch(url, { cache: "no-store", credentials: "omit" });
      const data = await response.json();
      const value = Number(data.count);
      if (!response.ok || !Number.isFinite(value) || value < 0) return;
      element.querySelector("b").textContent = format(value);
      element.hidden = false;
    } catch (_) {}
  }

  function render(manifest) {
    if (document.getElementById("cpa-four-language-toolbar")) return;
    const language = locale();
    const words = copy[language];
    const route = neutralRoute();
    const routes = manifest?.routes?.[route] || {};
    const toolbar = document.createElement("aside");
    toolbar.id = "cpa-four-language-toolbar";
    toolbar.setAttribute("aria-label", words.aria);
    const navigation = Object.keys(localeNames).map((key) => {
      const href = routes[key];
      if (!href) return `<span aria-disabled="true" title="${words.unavailable}">${localeNames[key]}</span>`;
      return `<a href="${href}" hreflang="${key}"${language === key ? ' aria-current="page"' : ""}>${localeNames[key]}</a>`;
    }).join("");
    toolbar.innerHTML = `<a class="cpa-four-language-brand" href="${ROOT}"><span aria-hidden="true">♥</span><b>${words.brand}</b><small>${words.official}</small></a><div class="cpa-four-language-actions"><span class="cpa-four-language-views" hidden aria-live="polite"><span>◉ ${words.views}</span><b>—</b></span><nav class="cpa-four-language-nav" aria-label="${words.aria}">${navigation}</nav></div>`;
    document.body.prepend(toolbar);
    document.querySelectorAll(".public-view-count-article,#cpa-page-views,[data-lx-counter],[data-km-view-counter]").forEach((node) => node.remove());
    recordOrReadView(route, toolbar.querySelector(".cpa-four-language-views"));
  }

  async function init() {
    let manifest = null;
    try {
      const response = await fetch(ROUTES_URL, { cache: "no-store" });
      if (response.ok) manifest = await response.json();
    } catch (_) {}
    render(manifest);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
