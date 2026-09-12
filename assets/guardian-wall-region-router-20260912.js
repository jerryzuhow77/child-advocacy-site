(() => {
  "use strict";

  const TAIWAN_WALL = "https://global-protection.jerryzuhow77.chatgpt.site/";
  const HONG_KONG_WALL = "https://cn.globalprotectionwall.com/";

  function languageKey() {
    const query = (new URLSearchParams(location.search).get("lang") || "").toLowerCase();
    if (query === "zh-hans" || query === "zh-cn") return "zh-Hans";
    if (query === "en") return "en";
    if (query === "ja") return "ja";
    const declared = (document.documentElement.lang || "zh-Hant").toLowerCase();
    if (declared.startsWith("zh-hans") || declared === "zh-cn") return "zh-Hans";
    if (declared.startsWith("en")) return "en";
    if (declared.startsWith("ja")) return "ja";
    return "zh-Hant";
  }

  function isTaiwanAudience() {
    if (languageKey() === "zh-Hant") return true;
    const languages = [...(navigator.languages || []), navigator.language || ""].map(value => String(value).toLowerCase());
    if (languages.some(value => value === "zh-tw" || value.startsWith("zh-hant"))) return true;
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone === "Asia/Taipei";
    } catch (_) {
      return false;
    }
  }

  function wallUrl() {
    const useTaiwan = location.hostname !== "cn.globalprotectionwall.com" || isTaiwanAudience();
    if (!useTaiwan) return HONG_KONG_WALL;
    const target = new URL(TAIWAN_WALL);
    const language = languageKey();
    target.searchParams.set("region", "tw");
    if (language !== "zh-Hant") target.searchParams.set("lang", language);
    return target.href;
  }

  function updateMobileWallLink() {
    const menu = document.getElementById("cpa-mobile-menu");
    if (!menu) return false;
    const wallLink = [...menu.querySelectorAll("a[href]")].find(link =>
      /全球守護留言牆|全球守护留言墙|Global Protection Wall|グローバル保護メッセージウォール/.test(link.textContent || "")
    );
    if (!wallLink) return false;
    wallLink.href = wallUrl();
    wallLink.dataset.guardianWallRegion = wallLink.hostname === "cn.globalprotectionwall.com" ? "hk" : "tw";
    return true;
  }

  function init() {
    if (updateMobileWallLink()) return;
    const observer = new MutationObserver(() => {
      if (updateMobileWallLink()) observer.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    window.setTimeout(() => observer.disconnect(), 15000);
  }

  document.addEventListener("cpa-language-change", updateMobileWallLink);
  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", init, { once: true })
    : init();
})();
