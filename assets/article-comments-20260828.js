(() => {
  "use strict";
  if (window.__cpaArticleComments) return;
  window.__cpaArticleComments = true;

  const API = "https://global-protection.jerryzuhow77.chatgpt.site/api/public/view-count";
  const path = location.pathname.replace(/^\/child-advocacy-site\/?/, "").replace(/index\.html$/, "").replace(/^\/+|\/+$/g, "");
  const neutralPath = path.replace(/^(?:en|ja)\//, "");
  const indexRoutes = new Set(["", "about", "social", "cases", "hearing-records", "activity-records", "activity-records/albums", "court-comics", "global-protection-wall"]);
  const articleRoute = /^(?:cases|hearing-records|activity-records|features|historical-cases)\//.test(neutralPath);
  const articleMetadata = document.querySelector('meta[property="og:type"][content="article"],script[type="application/ld+json"]');
  if (indexRoutes.has(neutralPath) || (!articleRoute && !articleMetadata)) return;

  const language = (document.documentElement.lang || "zh-Hant").toLowerCase();
  const locale = language.startsWith("zh-hans") || language.startsWith("zh-cn") ? "zh-Hans" : language.startsWith("en") ? "en" : language.startsWith("ja") ? "ja" : "zh-Hant";
  const words = {
    "zh-Hant": { eyebrow: "ARTICLE COMMENTS · 文章留言", title: "留下你的想法", intro: "歡迎留下祝福、觀點或制度建議。為保護當事人與兒少隱私，留言經人工審核後公開。", list: "已公開留言", loading: "讀取留言中…", empty: "目前尚無公開留言，歡迎留下第一則訊息。", unavailable: "留言暫時無法讀取，請稍後再試。", name: "顯示名稱", visitor: "訪客", content: "留言內容", placeholder: "請輸入想留下的話……", note: "請勿留下電話、地址、兒少姓名等敏感個資。", submit: "送交審核", submitting: "送出中…", success: "已送交審核；通過後會顯示在本頁。", error: "目前暫時無法送出，請稍後再試。" },
    "zh-Hans": { eyebrow: "ARTICLE COMMENTS · 文章留言", title: "留下你的想法", intro: "欢迎留下祝福、观点或制度建议。为保护当事人与儿童隐私，留言经人工审核后公开。", list: "已公开留言", loading: "读取留言中…", empty: "目前尚无公开留言，欢迎留下第一条信息。", unavailable: "留言暂时无法读取，请稍后再试。", name: "显示名称", visitor: "访客", content: "留言内容", placeholder: "请输入想留下的话……", note: "请勿留下电话、地址、儿童姓名等敏感个人信息。", submit: "送交审核", submitting: "提交中…", success: "已送交审核；通过后会显示在本页。", error: "目前暂时无法提交，请稍后再试。" },
    en: { eyebrow: "ARTICLE COMMENTS", title: "Join the conversation", intro: "Share a message of support, a perspective, or a policy suggestion. Comments are moderated before publication to protect children and the people involved.", list: "Published comments", loading: "Loading comments…", empty: "No public comments yet. You can leave the first message.", unavailable: "Comments are temporarily unavailable. Please try again later.", name: "Display name", visitor: "Visitor", content: "Comment", placeholder: "Write your message…", note: "Do not include phone numbers, addresses, children's names, or other sensitive personal information.", submit: "Submit for review", submitting: "Submitting…", success: "Submitted for review. It will appear here after approval.", error: "Unable to submit right now. Please try again later." },
    ja: { eyebrow: "ARTICLE COMMENTS · 記事コメント", title: "あなたの声をお寄せください", intro: "応援の言葉、意見、制度への提案をお寄せください。子どもと関係者のプライバシーを守るため、審査後に公開します。", list: "公開コメント", loading: "コメントを読み込み中…", empty: "公開コメントはまだありません。最初のメッセージをお寄せください。", unavailable: "コメントを一時的に読み込めません。しばらくしてからお試しください。", name: "表示名", visitor: "訪問者", content: "コメント", placeholder: "メッセージを入力してください……", note: "電話番号、住所、子どもの氏名などの個人情報は入力しないでください。", submit: "審査へ送信", submitting: "送信中…", success: "審査へ送信しました。承認後、このページに表示されます。", error: "現在送信できません。しばらくしてからお試しください。" },
  }[locale];

  const canonical = document.querySelector('link[rel="canonical"]')?.href || location.href.split("#")[0];
  // Keep locale-prefixed routes aligned with the keys already used by homepage cards.
  const routeKey = neutralPath.toLowerCase().replace(/[^a-z0-9_-]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  const item = {
    key: `official-${routeKey || "home"}`,
    title: (document.querySelector("h1")?.textContent || document.title || "官網文章").trim().replace(/\s+/g, " ").slice(0, 160),
    url: canonical,
  };

  const ownScript = document.querySelector('script[data-cpa-site-layer="article-comments"]');
  const assetBase = ownScript?.src ? ownScript.src.slice(0, ownScript.src.lastIndexOf("/") + 1) : "/child-advocacy-site/assets/";
  if (!document.querySelector('link[data-cpa-article-comments-style]')) {
    const stylesheet = document.createElement("link");
    stylesheet.rel = "stylesheet";
    stylesheet.href = `${assetBase}article-comments-20260828.css?v=20260828-1`;
    stylesheet.dataset.cpaArticleCommentsStyle = "";
    document.head.appendChild(stylesheet);
  }

  function request(payload = { action: "read" }) {
    let viewClientId = "";
    try {
      viewClientId = localStorage.getItem("cpa_engagement_client_v1") || crypto.randomUUID();
      localStorage.setItem("cpa_engagement_client_v1", viewClientId);
    } catch (_) {}
    return fetch(API, { method: "POST", cache: "no-store", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...payload, clientId: payload.clientId || viewClientId, channel: "official-article", articleKey: item.key }) })
      .then(async response => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || words.error);
        return result;
      });
  }

  function recordView() {
    if (window.__cpaFourLanguageToolbar) return;
    const seenKey = `cpa_article_viewed_${item.key}`;
    try {
      if (sessionStorage.getItem(seenKey)) return;
    } catch (_) { /* Count the view when session storage is unavailable. */ }

    let viewClientId = "";
    try {
      viewClientId = localStorage.getItem("cpa_engagement_client_v1") || crypto.randomUUID();
      localStorage.setItem("cpa_engagement_client_v1", viewClientId);
    } catch (_) {}
    const payload = JSON.stringify({ action: "view", clientId: viewClientId, channel: "official-article", articleKey: item.key });
    try { sessionStorage.setItem(seenKey, "pending"); } catch (_) {}
    fetch(API, {
      method: "POST",
      cache: "no-store",
      headers: { "content-type": "application/json" },
      body: payload,
      keepalive: true,
    }).then(response => {
      if (!response.ok) throw new Error(`View counter returned ${response.status}`);
      try { sessionStorage.setItem(seenKey, "1"); } catch (_) {}
    }).catch(() => {
      // Do not permanently suppress a retry when the cross-origin request fails.
      try { sessionStorage.removeItem(seenKey); } catch (_) {}
    });
  }

  function commentNode(comment) {
    const article = document.createElement("article");
    const avatar = document.createElement("span");
    const body = document.createElement("div");
    const name = document.createElement("strong");
    const content = document.createElement("p");
    avatar.textContent = (comment.nickname || words.visitor).trim().slice(0, 1).toUpperCase() || "♡";
    name.textContent = comment.nickname || words.visitor;
    content.textContent = comment.content || "";
    body.append(name, content);
    article.append(avatar, body);
    return article;
  }

  function mount() {
    recordView();
    if (document.querySelector("[data-article-comments]")) return;
    const section = document.createElement("section");
    section.className = "cpa-article-comments";
    section.dataset.articleComments = "";
    section.setAttribute("aria-labelledby", "articleCommentsTitle");
    section.innerHTML = `<div class="cpa-article-comments__inner"><header><small>${words.eyebrow}</small><h2 id="articleCommentsTitle">${words.title}</h2><p>${words.intro}</p></header><div class="cpa-article-comments__layout"><section class="cpa-comment-list" aria-labelledby="publishedCommentsTitle"><div class="cpa-comment-list__heading"><h3 id="publishedCommentsTitle">${words.list}</h3><span data-comment-count>—</span></div><div class="cpa-comment-list__items" data-comment-list aria-live="polite"><p class="cpa-comment-state">${words.loading}</p></div></section><form class="cpa-comment-form"><label><span>${words.name}</span><input name="nickname" maxlength="24" autocomplete="nickname" placeholder="${words.visitor}" required></label><label><span>${words.content}</span><textarea name="content" minlength="2" maxlength="500" rows="5" placeholder="${words.placeholder}" required></textarea></label><label class="cpa-comment-hp" aria-hidden="true">Website<input name="website" tabindex="-1" autocomplete="off"></label><p class="cpa-comment-note"><span aria-hidden="true">♡</span>${words.note}</p><button type="submit">${words.submit}<span aria-hidden="true">→</span></button><output aria-live="polite"></output></form></div></div>`;
    const footer = document.querySelector("body > footer, footer");
    if (footer) footer.before(section); else document.body.appendChild(section);

    const list = section.querySelector("[data-comment-list]");
    const count = section.querySelector("[data-comment-count]");
    request().then(data => {
      const comments = Array.isArray(data.comments) ? data.comments : [];
      count.textContent = new Intl.NumberFormat(locale === "zh-Hans" ? "zh-CN" : locale === "zh-Hant" ? "zh-TW" : locale).format(comments.length);
      list.replaceChildren(...(comments.length ? comments.map(commentNode) : [Object.assign(document.createElement("p"), { className: "cpa-comment-state", textContent: words.empty })]));
    }).catch(() => { count.textContent = "—"; list.innerHTML = `<p class="cpa-comment-state">${words.unavailable}</p>`; });

    const form = section.querySelector("form");
    form.addEventListener("submit", async event => {
      event.preventDefault();
      const button = form.querySelector("button");
      const output = form.querySelector("output");
      const data = new FormData(form);
      button.disabled = true;
      output.textContent = words.submitting;
      try {
        await request({ action: "comment", nickname: data.get("nickname"), content: data.get("content"), website: data.get("website"), title: item.title, url: item.url });
        form.reset();
        output.textContent = words.success;
        output.dataset.state = "success";
      } catch (_) {
        output.textContent = words.error;
        output.dataset.state = "error";
      } finally { button.disabled = false; }
    });
  }

  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", mount, { once: true }) : mount();
})();
