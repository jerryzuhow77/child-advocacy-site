(() => {
  "use strict";
  if (window.__cpaPostEngagement) return;
  window.__cpaPostEngagement = true;

  const API = "https://global-protection.jerryzuhow77.chatgpt.site/api/public/view-count";
  const CLIENT_KEY = "cpa_engagement_client_v1";
  const LIKED_KEY = "cpa_engagement_liked_v1";
  const readCache = new Map();
  const legacyViewCache = new Map();
  const barsByKey = new Map();
  const metricObservers = new WeakMap();
  const LEGACY_COUNTER_NS = "jerryzuhow77.github.io-child-advocacy-site";
  const LEGACY_COUNTER_ACTION = "view";

  const targetDefinitions = [
    { selector: ".home-priority-links a.is-hearing", layout: "priority" },
    { selector: "#news-flash a.home-pinned-report-card:not([data-pinned-clone])", layout: "pinned" },
    { selector: "#news-flash a.home-document-disc-card", layout: "disc" },
    { selector: "#news-hearing a.home-news-card.is-hearing" },
    {
      selector: "#news-hearing-notes .home-hearing-zone-feature",
      layout: "standalone",
      resolve: (feature) => ({
        link: feature.querySelector("a.home-hearing-zone-primary") || feature.querySelector("a.home-hearing-zone-poster"),
        host: feature.querySelector(".home-hearing-zone-copy") || feature,
      }),
    },
    { selector: "#news-hearing-notes a.home-hearing-compact-card" },
    { selector: "#news-hearing-notes .home-hearing-archive-links > a:not(.is-all)", layout: "archive" },
    { selector: "#news-hearing-notes a.qa916-hearing-mini", layout: "mini" },
    { selector: "#home-special-features a.home-crafted-card" },
    { selector: "a.home-case-reel-card" },
    {
      selector: "#home-historical-cases a.home-historical-card",
      layout: "historical",
      resolve: (card) => ({
        link: card,
        host: card.querySelector(":scope > span:last-of-type") || card,
      }),
    },
    {
      selector: "#news-activity .home-activity-feature",
      layout: "standalone",
      resolve: (feature) => ({
        link: feature.querySelector("a.home-activity-primary") || feature.querySelector("a.home-story-campaign-visual") || feature.querySelector("a.home-activity-image-main"),
        host: feature.querySelector(".home-activity-copy") || feature,
      }),
    },
    { selector: "a.activity-impact-card" },
    {
      selector: ".remember-kaikai-card",
      layout: "standalone",
      resolve: (card) => ({
        link: card.querySelector("a.remember-kaikai-visual"),
        host: card.querySelector(".remember-kaikai-copy") || card,
      }),
    },
  ];

  const translations = {
    "zh-Hant": {
      like: "按讚", comment: "留言", view: "瀏覽", share: "分享", close: "關閉",
      barAria: "文章按讚、留言、分享與累計瀏覽",
      commentsEyebrow: "COMMENTS · 官網文章留言", displayName: "顯示名稱", visitor: "訪客",
      commentContent: "留言內容", commentPlaceholder: "留下祝福、關心或倡議……",
      moderation: "留言送出後，須經全球守護留言牆後台審核通過才會公開。",
      submit: "送交審核", loadingComments: "讀取公開留言中…", noComments: "目前尚無公開留言。",
      commentsUnavailable: "公開留言暫時無法讀取。", submitting: "送出中…",
      submitted: "已送交審核；通過後會顯示在這篇文章。", actionUnavailable: "目前暫時無法完成操作。",
      shareEyebrow: "SHARE THIS ARTICLE", shareTitle: "分享這篇文章", shareHint: "可直接分享，或複製文章文字與連結後貼到社群 App。",
      directShare: "直接分享", copyShare: "複製後貼上", nativeShare: "使用裝置分享", more: "更多",
      copied: "已複製文章文字與連結，可貼到", copyError: "無法自動複製，請稍後再試。",
    },
    "zh-Hans": {
      like: "点赞", comment: "留言", view: "浏览", share: "分享", close: "关闭",
      barAria: "文章点赞、留言、分享与累计浏览",
      commentsEyebrow: "COMMENTS · 官网文章留言", displayName: "显示名称", visitor: "访客",
      commentContent: "留言内容", commentPlaceholder: "留下祝福、关心或倡议……",
      moderation: "留言送出后，须经全球守护留言墙后台审核通过才会公开。",
      submit: "送交审核", loadingComments: "读取公开留言中…", noComments: "目前尚无公开留言。",
      commentsUnavailable: "公开留言暂时无法读取。", submitting: "送出中…",
      submitted: "已送交审核；通过后会显示在这篇文章。", actionUnavailable: "目前暂时无法完成操作。",
      shareEyebrow: "SHARE THIS ARTICLE", shareTitle: "分享这篇文章", shareHint: "可直接分享，或复制文章文字与链接后粘贴到社交 App。",
      directShare: "直接分享", copyShare: "复制后粘贴", nativeShare: "使用设备分享", more: "更多",
      copied: "已复制文章文字与链接，可粘贴到", copyError: "无法自动复制，请稍后再试。",
    },
    en: {
      like: "Like", comment: "Comments", view: "Views", share: "Share", close: "Close",
      barAria: "Article likes, comments, sharing, and cumulative views",
      commentsEyebrow: "COMMENTS · OFFICIAL ARTICLE", displayName: "Display name", visitor: "Visitor",
      commentContent: "Comment", commentPlaceholder: "Leave a message of care, support, or advocacy…",
      moderation: "Comments become public after moderation by the Global Protection Wall team.",
      submit: "Submit for review", loadingComments: "Loading public comments…", noComments: "No public comments yet.",
      commentsUnavailable: "Public comments are temporarily unavailable.", submitting: "Submitting…",
      submitted: "Submitted for review. It will appear here after approval.", actionUnavailable: "This action is temporarily unavailable.",
      shareEyebrow: "SHARE THIS ARTICLE", shareTitle: "Share this article", shareHint: "Share directly or copy the article text and link into a social app.",
      directShare: "Direct share", copyShare: "Copy and paste", nativeShare: "Device sharing", more: "More",
      copied: "Article text and link copied for", copyError: "Unable to copy automatically. Please try again.",
    },
    ja: {
      like: "いいね", comment: "コメント", view: "閲覧", share: "共有", close: "閉じる",
      barAria: "記事のいいね、コメント、共有、累計閲覧数",
      commentsEyebrow: "COMMENTS · 公式サイト記事", displayName: "表示名", visitor: "訪問者",
      commentContent: "コメント", commentPlaceholder: "応援、関心、提案のメッセージを残してください……",
      moderation: "コメントはグローバル保護メッセージウォールの審査後に公開されます。",
      submit: "審査へ送信", loadingComments: "公開コメントを読み込み中…", noComments: "公開コメントはまだありません。",
      commentsUnavailable: "公開コメントを一時的に読み込めません。", submitting: "送信中…",
      submitted: "審査へ送信しました。承認後にこの記事へ表示されます。", actionUnavailable: "現在この操作を完了できません。",
      shareEyebrow: "SHARE THIS ARTICLE", shareTitle: "この記事を共有", shareHint: "直接共有するか、記事の文章とリンクをコピーしてソーシャルアプリへ貼り付けられます。",
      directShare: "直接共有", copyShare: "コピーして貼り付け", nativeShare: "端末の共有機能", more: "その他",
      copied: "記事の文章とリンクをコピーしました：", copyError: "自動コピーできませんでした。もう一度お試しください。",
    },
  };

  function ui() {
    const language = (document.documentElement.lang || "zh-Hant").toLowerCase();
    if (language.startsWith("zh-hans") || language.startsWith("zh-cn")) return translations["zh-Hans"];
    if (language.startsWith("en")) return translations.en;
    if (language.startsWith("ja")) return translations.ja;
    return translations["zh-Hant"];
  }

  function locale() {
    const language = (document.documentElement.lang || "zh-Hant").toLowerCase();
    if (language.startsWith("zh-hans") || language.startsWith("zh-cn")) return "zh-CN";
    if (language.startsWith("en")) return "en";
    if (language.startsWith("ja")) return "ja";
    return "zh-TW";
  }

  function clientId() {
    try {
      let value = localStorage.getItem(CLIENT_KEY);
      if (!value) {
        value = crypto.randomUUID();
        localStorage.setItem(CLIENT_KEY, value);
      }
      return value;
    } catch (_) {
      return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    }
  }

  function likedArticles() {
    try {
      const parsed = JSON.parse(localStorage.getItem(LIKED_KEY) || "[]");
      return new Set(Array.isArray(parsed) ? parsed : []);
    } catch (_) {
      return new Set();
    }
  }

  function rememberLiked(key) {
    try {
      const values = likedArticles();
      values.add(key);
      localStorage.setItem(LIKED_KEY, JSON.stringify([...values].slice(-240)));
    } catch (_) { /* The server still keeps the like even when storage is unavailable. */ }
  }

  function article(link, host) {
    const url = new URL(link.href, location.href);
    const isOfficialSite = url.origin === location.origin;
    // GitHub Pages projects share the same origin. Only pages inside this
    // repository run the arrival counter; sibling projects (for example
    // Justice-For-Kaikai) must record the view before navigation instead.
    const countsOnArrival = isOfficialSite && /^\/child-advocacy-site(?:\/|$)/i.test(url.pathname);
    const isOfficialFeature = url.hostname.endsWith(".jerryzuhow77.chatgpt.site");
    const isGuardianWallFeature = url.hostname === "cn.globalprotectionwall.com";
    if (!/^https?:$/.test(url.protocol) || (!isOfficialSite && !isOfficialFeature && !isGuardianWallFeature)) return null;
    const path = url.pathname.replace(/^\/child-advocacy-site\/?/, "").replace(/\/$/, "") || "home";
    // The translated pages are alternate presentations of the same article.
    // Keep their engagement and view totals on the canonical, locale-neutral key.
    const sharedPath = isOfficialSite ? path.replace(/^(?:en|ja|zh-hant|zh-hans)(?:\/|$)/, "") || "home" : path;
    const titleSource = link.querySelector("[data-engagement-title-source],strong,h3,h2")
      || host?.querySelector("[data-engagement-title-source],h2,h3,strong")
      || link;
    const title = (titleSource.textContent || link.getAttribute("aria-label") || link.textContent || "官網文章").trim().replace(/\s+/g, " ").slice(0, 160);
    const articleHost = isOfficialSite
      ? "official"
      : isGuardianWallFeature
        ? "global-protection-wall"
        : url.hostname.replace(/\.jerryzuhow77\.chatgpt\.site$/, "");
    return {
      key: `${articleHost}-${sharedPath.toLowerCase().replace(/[^a-z0-9_-]+/g, "-").replace(/-+/g, "-")}`,
      legacyViewKey: link.dataset.viewCounterKey || legacyViewKey(url),
      countsOnArrival,
      title,
      url: url.href,
    };
  }

  function legacyViewKey(url) {
    const parts = url.pathname.split("/").filter(Boolean);
    const siteIndex = parts.indexOf("child-advocacy-site");
    const routeParts = siteIndex >= 0 ? parts.slice(siteIndex + 1) : parts;
    if (routeParts[routeParts.length - 1] === "index.html") routeParts.pop();
    const route = routeParts.join("/").replace(/\/+$/, "").replace(/^(?:en|ja)(?:\/|$)/, "");
    if (!route) return "";
    const sharedKeys = {
      "features/social-observation/see-hear-after": "feature-see-hear-after-shared",
      "cases/lin-xinci/features/missing-four-days": "case-lin-xinci-missing-four-days-shared",
      "historical-cases/regions/japan/kurihara-mia": "historical-kurihara-mia-shared",
      "historical-cases/regions/mainland-china/fujian-qiqi": "historical-fujian-qiqi-shared",
      "historical-cases/regions/mainland-china/tian-tian": "historical-tian-tian-shared",
      "cases/xuanxuan": "case-xuanxuan-shared",
      "historical-cases/regions/taiwan/wanghao": "historical-wanghao-shared",
      "historical-cases/regions/taiwan/fu-junxiang": "historical-fu-junxiang-shared",
    };
    return sharedKeys[route] || route.replace(/[^a-zA-Z0-9_-]+/g, "-").replace(/^-+|-+$/g, "").toLowerCase();
  }

  function legacyCounterUrl(key, callbackName = "") {
    const base = `https://counterapi.com/api/${encodeURIComponent(LEGACY_COUNTER_NS)}/${encodeURIComponent(LEGACY_COUNTER_ACTION)}/${encodeURIComponent(key)}`;
    const params = new URLSearchParams({ readOnly: "true" });
    if (callbackName) params.set("callback", callbackName);
    return `${base}?${params}`;
  }

  async function fetchLegacyView(key) {
    const controller = typeof AbortController === "function" ? new AbortController() : null;
    const timer = window.setTimeout(() => controller?.abort(), 6500);
    try {
      const response = await fetch(legacyCounterUrl(key), {
        method: "GET", mode: "cors", cache: "no-store", credentials: "omit",
        headers: { Accept: "application/json" }, signal: controller?.signal,
      });
      if (!response.ok) throw new Error(`Legacy counter ${response.status}`);
      const result = await response.json();
      const value = Number(result?.value);
      if (!Number.isFinite(value) || value < 0) throw new Error("Invalid legacy counter value");
      return value;
    } finally {
      window.clearTimeout(timer);
    }
  }

  function jsonpLegacyView(key) {
    return new Promise((resolve, reject) => {
      const callbackName = `__cpaLegacyView_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      const script = document.createElement("script");
      const cleanup = () => {
        window.clearTimeout(timer);
        try { delete window[callbackName]; } catch (_) { window[callbackName] = undefined; }
        script.remove();
      };
      window[callbackName] = (result) => {
        const value = Number(result?.value);
        cleanup();
        if (Number.isFinite(value) && value >= 0) resolve(value);
        else reject(new Error("Invalid legacy counter value"));
      };
      script.async = true;
      script.src = legacyCounterUrl(key, callbackName);
      script.onerror = () => { cleanup(); reject(new Error("Legacy counter JSONP failed")); };
      const timer = window.setTimeout(() => { cleanup(); reject(new Error("Legacy counter timeout")); }, 6500);
      document.head.appendChild(script);
    });
  }

  function initialLegacyView(item) {
    if (!item.legacyViewKey) return Promise.resolve(null);
    if (!legacyViewCache.has(item.legacyViewKey)) {
      legacyViewCache.set(item.legacyViewKey, fetchLegacyView(item.legacyViewKey).catch(() => jsonpLegacyView(item.legacyViewKey)).catch(() => null));
    }
    return legacyViewCache.get(item.legacyViewKey);
  }

  async function request(item, payload = { action: "read" }) {
    const response = await fetch(API, {
      method: "POST",
      cache: "no-store",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...payload, channel: "official-article", articleKey: item.key }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || ui().actionUnavailable);
    return result;
  }

  function initialRead(item) {
    if (!readCache.has(item.key)) {
      const pending = request(item).catch((error) => {
        readCache.delete(item.key);
        throw error;
      });
      readCache.set(item.key, pending);
    }
    return readCache.get(item.key);
  }

  function format(value) {
    return Number.isFinite(Number(value)) ? new Intl.NumberFormat(locale()).format(Number(value)) : "—";
  }

  function registerBar(item, bar) {
    const bars = barsByKey.get(item.key) || new Set();
    bars.add(bar);
    barsByKey.set(item.key, bars);
  }

  function updateMetric(item, metric, value) {
    const selector = metric === "like" ? ".is-like b" : metric === "comment" ? ".is-comment b" : ".is-view b";
    (barsByKey.get(item.key) || []).forEach((bar) => {
      const field = bar.querySelector(selector);
      if (field) field.textContent = format(value);
    });
  }

  function updateLiked(item) {
    (barsByKey.get(item.key) || []).forEach((bar) => {
      const like = bar.querySelector(".is-like");
      const icon = like?.querySelector("[data-like-icon]");
      like?.classList.add("is-liked");
      if (icon) icon.textContent = "♥";
    });
  }

  function commentsModal() {
    let dialog = document.querySelector("[data-post-engagement-dialog]");
    if (dialog) return dialog;
    const copy = ui();
    dialog = document.createElement("dialog");
    dialog.className = "post-engagement-dialog";
    dialog.dataset.postEngagementDialog = "";
    dialog.innerHTML = `<form method="dialog" class="post-engagement-card"><button class="post-engagement-close" type="button" aria-label="${copy.close}">×</button><small>${copy.commentsEyebrow}</small><h2 data-engagement-title></h2><div class="post-engagement-comments" data-engagement-comments></div><label>${copy.displayName}<input name="nickname" maxlength="24" placeholder="${copy.visitor}" required></label><label>${copy.commentContent}<textarea name="content" minlength="2" maxlength="500" rows="4" required placeholder="${copy.commentPlaceholder}"></textarea></label><label class="post-engagement-hp" aria-hidden="true">Website<input name="website" tabindex="-1" autocomplete="off"></label><p>${copy.moderation}</p><button type="submit" value="submit">${copy.submit}</button><output aria-live="polite"></output></form>`;
    dialog.querySelector(".post-engagement-close").addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
    document.body.appendChild(dialog);
    return dialog;
  }

  async function openComments(item) {
    const copy = ui();
    const dialog = commentsModal();
    const form = dialog.querySelector("form");
    const list = dialog.querySelector("[data-engagement-comments]");
    const output = dialog.querySelector("output");
    dialog.querySelector("[data-engagement-title]").textContent = item.title;
    list.textContent = copy.loadingComments;
    output.textContent = "";
    dialog.showModal();
    try {
      const data = await request(item);
      list.replaceChildren(...(data.comments?.length ? data.comments.map((comment) => {
        const entry = document.createElement("article");
        const name = document.createElement("b");
        const content = document.createElement("p");
        name.textContent = comment.nickname;
        content.textContent = comment.content;
        entry.append(name, content);
        return entry;
      }) : [Object.assign(document.createElement("p"), { textContent: copy.noComments })]));
    } catch (_) {
      list.textContent = copy.commentsUnavailable;
    }
    form.onsubmit = async (event) => {
      const submitter = event.submitter;
      if (!submitter || submitter.value !== "submit") return;
      event.preventDefault();
      output.textContent = copy.submitting;
      const data = new FormData(form);
      try {
        await request(item, {
          action: "comment",
          nickname: data.get("nickname"),
          content: data.get("content"),
          website: data.get("website"),
          title: item.title,
          url: item.url,
        });
        form.reset();
        output.textContent = copy.submitted;
      } catch (error) {
        output.textContent = error.message || copy.actionUnavailable;
      }
    };
  }

  function shareModal() {
    let dialog = document.querySelector("[data-post-share-dialog]");
    if (dialog) return dialog;
    const copy = ui();
    const platforms = [
      ["X", "X", copy.directShare], ["Threads", "@", copy.directShare],
      ["Instagram", "◎", copy.copyShare], ["Facebook", "f", copy.directShare],
      ["抖音", "♪", copy.copyShare], ["小紅書", "小紅", copy.copyShare],
      ["微博", "微", copy.directShare], ["更多", "⋯", copy.nativeShare],
    ];
    dialog = document.createElement("dialog");
    dialog.className = "post-share-dialog";
    dialog.dataset.postShareDialog = "";
    dialog.innerHTML = `<section class="post-share-card"><button class="post-share-close" type="button" aria-label="${copy.close}">×</button><small>${copy.shareEyebrow}</small><h2>${copy.shareTitle}</h2><p data-share-article-title></p><div class="post-share-platforms">${platforms.map(([name, mark, mode]) => `<button type="button" data-share-platform="${name}"><i>${mark}</i><span><b>${name === "更多" ? copy.more : name}</b><small>${mode}</small></span></button>`).join("")}</div><p class="post-share-hint">${copy.shareHint}</p><output data-share-status aria-live="polite"></output></section>`;
    dialog.querySelector(".post-share-close").addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
    document.body.appendChild(dialog);
    return dialog;
  }

  async function copyText(value) {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return;
    }
    const field = document.createElement("textarea");
    field.value = value;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.appendChild(field);
    field.select();
    const copied = document.execCommand("copy");
    field.remove();
    if (!copied) throw new Error("copy failed");
  }

  async function shareToPlatform(item, platform, dialog) {
    const copy = ui();
    const status = dialog.querySelector("[data-share-status]");
    const shareText = item.title;
    const textWithUrl = `${shareText}\n${item.url}`;
    const encodedText = encodeURIComponent(textWithUrl);
    const directTargets = {
      X: `https://x.com/intent/post?text=${encodedText}`,
      Threads: `https://www.threads.net/intent/post?text=${encodedText}`,
      Facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(item.url)}`,
      微博: `https://service.weibo.com/share/share.php?url=${encodeURIComponent(item.url)}&title=${encodeURIComponent(shareText)}`,
    };
    if (directTargets[platform]) {
      window.open(directTargets[platform], "_blank", "noopener,noreferrer,width=720,height=680");
      dialog.close();
      return;
    }
    if (platform === "更多" && typeof navigator.share === "function") {
      try {
        await navigator.share({ title: item.title, text: item.title, url: item.url });
        dialog.close();
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }
    try {
      await copyText(textWithUrl);
      status.textContent = `${copy.copied} ${platform === "更多" ? copy.more : platform}`;
    } catch (_) {
      status.textContent = copy.copyError;
    }
  }

  function openShare(item) {
    const dialog = shareModal();
    dialog.querySelector("[data-share-article-title]").textContent = item.title;
    dialog.querySelector("[data-share-status]").textContent = "";
    dialog.querySelectorAll("[data-share-platform]").forEach((button) => {
      button.onclick = () => shareToPlatform(item, button.dataset.sharePlatform, dialog);
    });
    dialog.showModal();
  }

  function mount(link, host = link, layout = "card") {
    if (!link || !host) return;
    host.querySelectorAll(".public-view-count-card").forEach((badge) => badge.remove());
    if (link.hasAttribute("data-engagement-ready")) return;
    const item = article(link, host);
    if (!item) return;
    const copy = ui();
    link.dataset.engagementReady = "true";
    host.dataset.engagementHost = "true";
    const bar = document.createElement("span");
    bar.className = "home-post-engagement";
    bar.dataset.articleKey = item.key;
    bar.dataset.engagementLayout = layout;
    bar.setAttribute("aria-label", copy.barAria);
    bar.innerHTML = `<span class="home-post-stat is-like" role="button" tabindex="0" aria-label="${copy.like}"><span class="home-post-stat-icon" data-like-icon aria-hidden="true">♡</span><span class="home-post-stat-label">${copy.like}</span><b>…</b></span><span class="home-post-stat is-comment" role="button" tabindex="0" aria-label="${copy.comment}"><span class="home-post-stat-icon" aria-hidden="true">✎</span><span class="home-post-stat-label">${copy.comment}</span><b>…</b></span><span class="home-post-stat is-view" aria-label="${copy.view}"><span class="home-post-stat-icon" aria-hidden="true">◉</span><span class="home-post-stat-label">${copy.view}</span><b>…</b></span><span class="home-post-stat is-share" role="button" tabindex="0" aria-label="${copy.share}"><span class="home-post-stat-icon" aria-hidden="true">↗</span><span class="home-post-stat-label">${copy.share}</span></span>`;
    host.appendChild(bar);
    registerBar(item, bar);
    if (likedArticles().has(item.key)) updateLiked(item);

    const like = bar.querySelector(".is-like");
    const comment = bar.querySelector(".is-comment");
    const share = bar.querySelector(".is-share");
    const loadMetrics = () => {
      if (bar.dataset.loadState === "loading" || bar.dataset.loadState === "ready") return;
      bar.dataset.loadState = "loading";
      initialRead(item).then((data) => {
        updateMetric(item, "like", data.likeCount);
        updateMetric(item, "comment", data.commentCount);
        updateMetric(item, "view", data.viewCount);
        bar.dataset.loadState = "ready";

        // Render the live engagement total immediately. The legacy service is
        // only a background migration source and must never keep new articles
        // stuck on the loading placeholder after a reload.
        initialLegacyView(item).then((legacyView) => {
          const confirmedViews = [legacyView, data.viewCount]
            .map(Number)
            .filter((value) => Number.isFinite(value) && value >= 0);
          if (confirmedViews.length) updateMetric(item, "view", Math.max(...confirmedViews));
        }).catch(() => { /* Keep the live engagement total visible. */ });
      }).catch(() => {
        bar.querySelectorAll("b").forEach((field) => { field.textContent = "—"; });
        bar.dataset.loadState = "unavailable";
      });
    };
    if ("IntersectionObserver" in window) {
      const metricObserver = new IntersectionObserver((entries, observer) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        metricObservers.delete(bar);
        loadMetrics();
      }, { rootMargin: "500px 0px", threshold: 0 });
      metricObservers.set(bar, metricObserver);
      metricObserver.observe(host);
    } else {
      loadMetrics();
    }

    // English and Japanese homepages replace the report section with localized
    // cards during startup. Those cards can remain outside the initial viewport,
    // so IntersectionObserver alone leaves every metric on the loading glyph.
    // Prime their deduplicated reads during idle time while keeping the observer
    // as the fast path for cards that are already visible.
    if (/^(?:en|ja)(?:-|$)/i.test(document.documentElement.lang || "")) {
      const primeLocalizedMetrics = () => loadMetrics();
      if ("requestIdleCallback" in window) requestIdleCallback(primeLocalizedMetrics, { timeout: 1500 });
      else window.setTimeout(primeLocalizedMetrics, 300);
    }

    const stop = (action) => (event) => {
      event.preventDefault();
      event.stopPropagation();
      action();
    };
    like.addEventListener("click", stop(async () => {
      if (like.getAttribute("aria-busy") === "true") return;
      like.setAttribute("aria-busy", "true");
      try {
        const data = await request(item, { action: "like", clientId: clientId() });
        rememberLiked(item.key);
        updateLiked(item);
        updateMetric(item, "like", data.likeCount);
      } catch (_) { /* Keep the last confirmed count visible. */ }
      finally { like.removeAttribute("aria-busy"); }
    }));
    comment.addEventListener("click", stop(() => openComments(item)));
    share.addEventListener("click", stop(() => openShare(item)));
    [like, comment, share].forEach((control) => control.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        control.click();
      }
    }));
    link.addEventListener("click", (event) => {
      if (event.target.closest(".home-post-engagement")) return;
      // Official article pages record the confirmed arrival themselves. This
      // avoids counting one navigation both here and again on the destination.
      if (item.countsOnArrival) return;
      const payload = JSON.stringify({ channel: "official-article", articleKey: item.key, action: "view" });
      try {
        if (!navigator.sendBeacon(API, new Blob([payload], { type: "application/json" }))) {
          fetch(API, { method: "POST", headers: { "content-type": "application/json" }, body: payload, keepalive: true });
        }
      } catch (_) { /* Navigation should never be blocked by counting. */ }
    }, { capture: true });
  }

  function init() {
    targetDefinitions.forEach((definition) => {
      document.querySelectorAll(definition.selector).forEach((element) => {
        const resolved = definition.resolve ? definition.resolve(element) : { link: element, host: element };
        mount(resolved?.link, resolved?.host || resolved?.link, definition.layout || "card");
      });
    });
  }

  function start() {
    init();
    // Cards are server-rendered. Avoid rescanning the whole document after
    // every carousel/counter DOM mutation; one deferred pass covers scripts
    // that append a card during startup.
    const deferredInit = () => init();
    if ("requestIdleCallback" in window) requestIdleCallback(deferredInit, { timeout: 1500 });
    else window.setTimeout(deferredInit, 600);
  }

  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", start, { once: true }) : start();
})();
