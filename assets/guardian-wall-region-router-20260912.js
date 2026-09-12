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

  function wallUrl(section = "home") {
    const useTaiwan = location.hostname !== "cn.globalprotectionwall.com" || isTaiwanAudience();
    const language = languageKey();
    if (!useTaiwan) {
      const target = new URL(HONG_KONG_WALL);
      if (section !== "home") target.searchParams.set("section", section);
      if (language !== "zh-Hans") target.searchParams.set("lang", language);
      return target.href;
    }
    const target = new URL(section === "member-submit" ? "submit/" : "", TAIWAN_WALL);
    target.searchParams.set("region", "tw");
    if (language !== "zh-Hant") target.searchParams.set("lang", language);
    if (section === "bulletins") target.hash = "bulletins";
    if (section === "guest-message") target.hash = "guest-message";
    return target.href;
  }

  function updateLink(link, section) {
    const target = wallUrl(section);
    if (link.href !== target) link.href = target;
    link.dataset.guardianWallRegion = link.hostname === "cn.globalprotectionwall.com" ? "hk" : "tw";
  }

  function updateGuardianLinks() {
    let updated = false;
    const menu = document.getElementById("cpa-mobile-menu");
    const wallLink = menu && [...menu.querySelectorAll("a[href]")].find(link =>
      /全球守護留言牆|全球守护留言墙|Global Protection Wall|グローバル保護メッセージウォール/.test(link.textContent || "")
    );
    if (wallLink) {
      updateLink(wallLink, "home");
      updated = true;
    }
    document.querySelectorAll(".guardian-action-nav").forEach(group => {
      const links = [...group.querySelectorAll("a[href]")];
      links.forEach((link, index) => {
        const section = link.classList.contains("is-wall-home") ? "home"
          : link.classList.contains("guest-message-nav-link") ? "guest-message"
          : index === links.length - 1 ? "member-submit"
          : "bulletins";
        updateLink(link, section);
        updated = true;
      });
    });
    return updated;
  }

  function init() {
    updateGuardianLinks();
    const observer = new MutationObserver(updateGuardianLinks);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["href"] });
    window.setTimeout(() => observer.disconnect(), 15000);
  }

  document.addEventListener("cpa-language-change", updateGuardianLinks);
  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", init, { once: true })
    : init();
})();
