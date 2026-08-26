(() => {
  "use strict";
  if (window.__cpaPostEngagement) return;
  window.__cpaPostEngagement = true;
  const API = "https://wall.globalprotectionwall.com/api/public/view-count";
  const CLIENT_KEY = "cpa_engagement_client_v1";
  const selectors = [
    "#news-flash a[href]", "#news-activity a.home-activity-primary", "#news-hearing a.home-news-card",
    "#news-hearing-notes a.home-hearing-zone-primary", "#news-hearing-notes a.home-hearing-compact-card",
    "#home-special-features a.home-crafted-card", "#home-historical-cases a.home-historical-card"
  ].join(",");

  function clientId() {
    try {
      let value = localStorage.getItem(CLIENT_KEY);
      if (!value) { value = crypto.randomUUID(); localStorage.setItem(CLIENT_KEY, value); }
      return value;
    } catch (_) { return `${Date.now()}-${Math.random().toString(36).slice(2)}`; }
  }
  function article(link) {
    const url = new URL(link.href, location.href);
    const path = url.pathname.replace(/^\/child-advocacy-site\/?/, "").replace(/\/$/, "") || "home";
    const title = (link.querySelector("strong,h3")?.textContent || link.getAttribute("aria-label") || link.textContent || "官網文章").trim().replace(/\s+/g, " ").slice(0, 160);
    return { key: `official-${path.toLowerCase().replace(/[^a-z0-9_-]+/g, "-").replace(/-+/g, "-")}`, title, url: url.href };
  }
  async function request(item, options) {
    const payload = options?.body ? JSON.parse(options.body) : { action: "read" };
    const response = await fetch(API, { method: "POST", cache: "no-store", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...payload, channel: "official-article", articleKey: item.key }) });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "暫時無法完成操作");
    return result;
  }
  function format(value) { return Number.isFinite(Number(value)) ? new Intl.NumberFormat("zh-TW").format(Number(value)) : "—"; }
  function modal() {
    let dialog = document.querySelector("[data-post-engagement-dialog]");
    if (dialog) return dialog;
    dialog = document.createElement("dialog"); dialog.className = "post-engagement-dialog"; dialog.dataset.postEngagementDialog = "";
    dialog.innerHTML = `<form method="dialog" class="post-engagement-card"><button class="post-engagement-close" value="cancel" aria-label="關閉">×</button><small>COMMENTS · 官網文章留言</small><h2 data-engagement-title></h2><div class="post-engagement-comments" data-engagement-comments></div><label>顯示名稱<input name="nickname" maxlength="24" placeholder="訪客" required></label><label>留言內容<textarea name="content" minlength="2" maxlength="500" rows="4" required placeholder="留下祝福、關心或倡議……"></textarea></label><label class="post-engagement-hp" aria-hidden="true">網站<input name="website" tabindex="-1" autocomplete="off"></label><p>留言送出後，須經全球守護留言牆後台審核通過才會公開。</p><button type="submit" value="submit">送交審核</button><output aria-live="polite"></output></form>`;
    document.body.appendChild(dialog); return dialog;
  }
  async function openComments(item) {
    const dialog = modal(), form = dialog.querySelector("form"), list = dialog.querySelector("[data-engagement-comments]"), output = dialog.querySelector("output");
    dialog.querySelector("[data-engagement-title]").textContent = item.title; list.textContent = "讀取公開留言中…"; output.textContent = "";
    dialog.showModal();
    try { const data = await request(item); list.replaceChildren(...(data.comments?.length ? data.comments.map(c => { const el=document.createElement("article"); const b=document.createElement("b"),p=document.createElement("p"); b.textContent=c.nickname; p.textContent=c.content; el.append(b,p); return el; }) : [Object.assign(document.createElement("p"),{textContent:"目前尚無公開留言。"})])); } catch (_) { list.textContent = "公開留言暫時無法讀取。"; }
    form.onsubmit = async (event) => {
      const submitter = event.submitter;
      if (!submitter || submitter.value !== "submit") return;
      event.preventDefault(); output.textContent = "送出中…";
      const data = new FormData(form);
      try { await request(item, { method:"POST", headers:{"content-type":"application/json"}, body:JSON.stringify({ action:"comment", nickname:data.get("nickname"), content:data.get("content"), website:data.get("website"), title:item.title, url:item.url }) }); form.reset(); output.textContent = "已送交審核；通過後會顯示在這篇文章。"; }
      catch (error) { output.textContent = error.message; }
    };
  }
  function mount(link) {
    if (link.dataset.engagementReady || link.origin !== location.origin) return;
    link.dataset.engagementReady = ""; const item = article(link);
    const bar = document.createElement("span"); bar.className = "home-post-engagement"; bar.setAttribute("aria-label", "文章互動與累計瀏覽");
    bar.innerHTML = `<span class="home-post-stat is-like" role="button" tabindex="0" aria-label="愛心點讚">♡ <b>…</b></span><span class="home-post-stat is-comment" role="button" tabindex="0" aria-label="查看或新增留言">留言 <b>…</b></span><span class="home-post-stat is-view" aria-label="累計瀏覽">◉ <b>…</b></span>`;
    link.appendChild(bar);
    const like = bar.querySelector(".is-like"), comment = bar.querySelector(".is-comment");
    request(item).then(data => { like.querySelector("b").textContent=format(data.likeCount); comment.querySelector("b").textContent=format(data.commentCount); bar.querySelector(".is-view b").textContent=format(data.viewCount); }).catch(()=>bar.remove());
    const stop = (fn) => (event) => { event.preventDefault(); event.stopPropagation(); fn(); };
    like.addEventListener("click", stop(async () => { try { const data=await request(item,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({action:"like",clientId:clientId()})}); like.classList.add("is-liked"); like.firstChild.textContent="♥ "; like.querySelector("b").textContent=format(data.likeCount); } catch(_){} }));
    comment.addEventListener("click", stop(() => openComments(item)));
    [like,comment].forEach(el=>el.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();el.click();}}));
    link.addEventListener("click", () => { try { navigator.sendBeacon(API, new Blob([JSON.stringify({channel:"official-article",articleKey:item.key,action:"view"})],{type:"application/json"})); } catch(_){} }, { capture:true });
  }
  function init(){ document.querySelectorAll(selectors).forEach(mount); }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded",init,{once:true}) : init();
})();
