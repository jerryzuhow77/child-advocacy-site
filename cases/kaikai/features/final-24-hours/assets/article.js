const q = (selector, root = document) => root.querySelector(selector);
const qa = (selector, root = document) => [...root.querySelectorAll(selector)];
const filterButtons = qa("[data-filter]");
const events = qa(".event");
const empty = q(".empty");
let activeView = "event";
let activeFilter = "all";
const refreshTimeline = () => {
  if (!events.length) return;
  let visible = 0;
  events.forEach((event) => {
    const show =
      event.dataset.view === activeView &&
      (activeFilter === "all" || event.dataset.status === activeFilter);
    event.hidden = !show;
    if (show) visible++;
  });
  if (empty) empty.hidden = visible > 0;
};
filterButtons.forEach((button) =>
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    activeFilter = button.dataset.filter;
    refreshTimeline();
  }),
);
qa("[data-view-button]").forEach((button) =>
  button.addEventListener("click", () => {
    qa("[data-view-button]").forEach((item) => {
      item.classList.remove("active");
      item.setAttribute("aria-selected", "false");
    });
    button.classList.add("active");
    button.setAttribute("aria-selected", "true");
    activeView = button.dataset.viewButton;
    refreshTimeline();
  }),
);
q("#sectionJump")?.addEventListener("change", (event) => {
  if (event.target.value)
    q("#" + CSS.escape(event.target.value))?.scrollIntoView({
      behavior: "smooth",
    });
});
const uiTranslations = {
  "zh-Hans": {
    title: "最后24小时：谁知道了什么？",
    eyebrow: "剀剀案・证据重建专题",
    dek: "不以推测填满空白，而是把已知、转述与待查事项放回正确的证据位置。",
    start: "沿时间轴阅读 ↓",
  },
  ja: {
    title: "最後の24時間：誰が何を知っていたのか",
    eyebrow: "剴剴事件・証拠再構成特集",
    dek: "空白を推測で埋めず、確認事項、伝聞、未解明事項を本来の証拠レベルに戻します。",
    start: "時系列を読む ↓",
  },
  en: {
    title: "The Final 24 Hours: Who Knew What?",
    eyebrow: "Kaikai case · evidence reconstruction",
    dek: "This record separates what is confirmed, reported, disputed, and still unknown.",
    start: "Read the timeline ↓",
  },
};
const lang = new URLSearchParams(location.search).get("lang");
if (uiTranslations[lang] && q(".hero h1")) {
  const t = uiTranslations[lang];
  document.documentElement.lang = lang;
  document.title = t.title;
  const split = t.title.split(/[:：]/);
  q(".hero h1").innerHTML =
    split.length > 1
      ? split[0] + "<br><span>" + split.slice(1).join(":") + "</span>"
      : t.title;
  q(".eyebrow").textContent = t.eyebrow;
  q(".dek").textContent = t.dek;
  q(".start").textContent = t.start;
  qa(".languages a").forEach((a) => {
    const current = a.getAttribute("lang") === lang;
    a.classList.toggle("current", current);
    if (current) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
}
const marks = q(".hour-marks");
if (marks)
  marks.innerHTML = Array.from(
    { length: 24 },
    (_, index) => '<i title="' + String(index).padStart(2, "0") + ':00"></i>',
  ).join("");
const normalize = (value) =>
  value.toLocaleLowerCase("zh-Hant").replace(/\s+/g, "");
const articleSearch = q("#articleSearch");
if (articleSearch) {
  const results = q("#articleSearchResults");
  const status = q("#articleSearchStatus");
  const searchable = qa(
    ".event,.dossier-grid article,.matrix-section tbody tr,.conflict-grid article,.questions li,.sources li",
  );
  searchable.forEach((item, index) => {
    if (!item.id) item.id = "search-item-" + (index + 1);
  });
  const run = () => {
    const term = normalize(articleSearch.value);
    results.innerHTML = "";
    if (!term) {
      status.textContent = "尚未搜尋";
      return;
    }
    const matches = searchable.filter((item) =>
      normalize(item.textContent).includes(term),
    );
    status.textContent = "找到 " + matches.length + " 個相關位置";
    matches.slice(0, 20).forEach((item) => {
      const a = document.createElement("a");
      a.href = "#" + item.id;
      a.textContent = (q("h3,h4,th,b", item)?.textContent || item.textContent)
        .trim()
        .slice(0, 52);
      results.append(a);
    });
  };
  articleSearch.addEventListener("input", run);
  q(".reader-tools [data-clear-search]")?.addEventListener("click", () => {
    articleSearch.value = "";
    run();
    articleSearch.focus();
  });
}
const dialogueSearch = q("#dialogueSearch");
if (dialogueSearch) {
  const rows = qa(".message-row");
  const notes = qa(".evidence-note");
  const controls = qa("[data-dialogue-filter]");
  const monthPicker = q("#dialogueMonth");
  const status = q("#dialogueSearchStatus");
  let dialogueFilter = "all";
  qa(".day-stream").forEach((stream) => {
    let date = "";
    qa(":scope > *", stream).forEach((item) => {
      if (item.classList.contains("date-divider"))
        date = item.textContent.trim();
      else if (item.classList.contains("message-row")) item.dataset.date = date;
    });
  });
  const categories = {
    warning:
      /瘀青|受傷|傷勢|發燒|感冒|過敏|鼻涕|磨牙|牙齒|掉牙|食慾|消瘦|就醫|醫生|醫師|急診|急救/,
    framing: /前保[母姆]|以前|刺激|不平等待遇|傳統的方式|衣架|惶恐|創傷/,
    visit: /訪視|查證|確認|紀錄|照片|影片|醫院|診所|評估|追蹤/,
    family: /外婆|嚴小姐|祖母/,
    after: /急診|急救|警察|派出所|衣物|走了|死亡|後事|告別式/,
  };
  const apply = () => {
    const term = normalize(dialogueSearch.value);
    const month = monthPicker.value;
    let visible = 0;
    rows.forEach((row) => {
      const text = row.textContent;
      const section = row.closest("#chen-grandmother") ? "外婆" : "";
      const issueMatch =
        dialogueFilter === "all" ||
        (dialogueFilter === "key" && row.classList.contains("key-message")) ||
        categories[dialogueFilter]?.test(text + section);
      const show =
        issueMatch &&
        (!term || normalize(text).includes(term)) &&
        (month === "all" || row.dataset.date.startsWith(month));
      row.hidden = !show;
      if (show) visible++;
    });
    notes.forEach((note) => {
      note.hidden = dialogueFilter !== "all" && dialogueFilter !== "key";
    });
    qa(".date-divider").forEach((divider) => {
      let sibling = divider.nextElementSibling;
      let any = false;
      while (sibling && !sibling.classList.contains("date-divider")) {
        if (sibling.classList.contains("message-row") && !sibling.hidden)
          any = true;
        sibling = sibling.nextElementSibling;
      }
      divider.hidden = !any;
    });
    status.textContent = "目前顯示 " + visible + " 筆訊息";
  };
  dialogueSearch.addEventListener("input", apply);
  monthPicker.addEventListener("change", apply);
  controls.forEach((button) =>
    button.addEventListener("click", () => {
      controls.forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      dialogueFilter = button.dataset.dialogueFilter;
      apply();
    }),
  );
  q(".dialogue-tools [data-clear-search]")?.addEventListener("click", () => {
    dialogueSearch.value = "";
    dialogueFilter = "all";
    monthPicker.value = "all";
    controls.forEach((item) =>
      item.classList.toggle("active", item.dataset.dialogueFilter === "all"),
    );
    apply();
    dialogueSearch.focus();
  });
  apply();
}
const recordSearch = q("#recordSearch");
if (recordSearch) {
  const entries = qa(".treatment-entry");
  const status = q("#recordSearchStatus");
  const apply = () => {
    const term = normalize(recordSearch.value);
    let visible = 0;
    entries.forEach((entry) => {
      const show = !term || normalize(entry.textContent).includes(term);
      entry.hidden = !show;
      if (show) {
        visible++;
        if (term) entry.open = true;
      }
    });
    status.textContent = term
      ? "找到 " + visible + " 筆處遇紀錄"
      : "目前顯示 " + visible + " 筆";
  };
  recordSearch.addEventListener("input", apply);
  q("[data-clear-record-search]")?.addEventListener("click", () => {
    recordSearch.value = "";
    apply();
    recordSearch.focus();
  });
  qa("[data-record-toggle]").forEach((button) =>
    button.addEventListener("click", () => {
      const shouldOpen = button.dataset.recordToggle === "expand";
      entries.forEach((entry) => {
        if (!entry.hidden) entry.open = shouldOpen;
      });
    }),
  );
  apply();
}
qa(".message-row,.timeline-excerpt,.record-quote,.record-body").forEach((block) => {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "copy-evidence";
  button.textContent = "複製引用";
  button.setAttribute("aria-label", "複製這段內容與來源位置");
  button.addEventListener("click", async () => {
    const entry = block.closest(".treatment-entry");
    const row = q(".row-number", block)?.textContent;
    const speaker = q(".message-meta b", block)?.textContent;
    const time = entry
      ? q("summary time", entry)?.textContent
      : q("time", block)?.textContent;
    const serial = entry ? q("summary span", entry)?.textContent : "";
    const paragraphs = block.classList.contains("record-body")
      ? qa(":scope > p", block).map((item) => item.innerText).join("\n")
      : "";
    const body =
      paragraphs || q("p,q,blockquote", block)?.innerText || block.innerText;
    const citation = entry
      ? ["工作處遇紀錄序號" + serial, time].filter(Boolean).join("｜")
      : [speaker, time, row ? "第" + row + "列" : ""]
          .filter(Boolean)
          .join("｜");
    try {
      await navigator.clipboard.writeText(
        (citation ? citation + "\n" : "") +
          body.trim() +
          "\n來源：" +
          location.href.split("#")[0],
      );
      button.textContent = "已複製";
      setTimeout(() => (button.textContent = "複製引用"), 1600);
    } catch {
      button.textContent = "請手動複製";
    }
  });
  block.append(button);
});
refreshTimeline();
