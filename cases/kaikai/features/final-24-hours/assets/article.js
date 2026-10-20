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
  qa(".day-stream").forEach((stream) => {
    let group = null;
    [...stream.children].forEach((item) => {
      if (item.classList.contains("date-divider")) {
        group = document.createElement("details");
        group.className = "dialogue-date-group";
        const summary = document.createElement("summary");
        summary.innerHTML =
          '<span class="date-group-date">' +
          item.textContent.trim() +
          '</span><span class="date-group-count"></span><span class="date-group-hint">展開對話</span>';
        const content = document.createElement("div");
        content.className = "date-group-content";
        group.append(summary, content);
        stream.insertBefore(group, item);
        item.remove();
      } else if (group) {
        q(".date-group-content", group).append(item);
      }
    });
  });
  const rows = qa(".message-row");
  const notes = qa(".evidence-note");
  const controls = qa("[data-dialogue-filter]");
  const monthPicker = q("#dialogueMonth");
  const status = q("#dialogueSearchStatus");
  let dialogueFilter = "all";
  qa(".dialogue-date-group").forEach((group) => {
    const date = q(".date-group-date", group).textContent.trim();
    const dayRows = qa(".message-row", group);
    dayRows.forEach((row) => (row.dataset.date = date));
    q(".date-group-count", group).textContent = dayRows.length + " 筆";
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
    qa(".dialogue-date-group").forEach((group) => {
      const shown = qa(".message-row", group).filter((row) => !row.hidden);
      group.hidden = shown.length === 0;
      q(".date-group-count", group).textContent =
        shown.length + "／" + qa(".message-row", group).length + " 筆";
      if ((term || dialogueFilter !== "all" || month !== "all") && shown.length)
        group.open = true;
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
const highlightPhrase = (root, phrase, tone, label) => {
  if (!root || !phrase) return false;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (
        !node.nodeValue.includes(phrase) ||
        node.parentElement.closest("mark,.highlight-comment,.copy-evidence")
      )
        return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  const node = walker.nextNode();
  if (!node) return false;
  const start = node.nodeValue.indexOf(phrase);
  const after = node.splitText(start);
  const tail = after.splitText(phrase.length);
  const mark = document.createElement("mark");
  mark.className = "evidence-highlight highlight-" + tone;
  mark.title = label;
  mark.textContent = after.nodeValue;
  after.replaceWith(mark);
  if (!tail.nodeValue) tail.remove();
  return true;
};
const addHighlightComment = (root, note) => {
  if (!root || !note?.text || q(":scope > .highlight-comment", root)) return;
  const comment = document.createElement("div");
  comment.className =
    "highlight-comment " +
    (note.tone === "verify"
      ? "verify-note"
      : note.tone === "boundary"
        ? "boundary-note"
        : "dispute-note");
  const label = document.createElement("strong");
  label.textContent = note.label + "：";
  comment.append(label, document.createTextNode(note.text));
  root.append(comment);
};
const findDialogueRow = (section, row) =>
  qa("#" + section + " .message-row").find(
    (item) => q(".row-number", item)?.textContent.trim() === row,
  );
const dialogueHighlights = [
  {
    section: "chen-liu",
    row: "100",
    marks: [["前保姆應該是嚴厲的，可能有打過他", "dispute", "未證實歸因"]],
    note: { label: "疑點", text: "這是照顧者的推測；該段訊息未附影像，也未見向前保母交叉查證。" },
  },
  {
    section: "chen-liu",
    row: "101",
    marks: [["可能是用比較傳統的方式", "dispute", "附和推測"]],
    note: { label: "爭點", text: "未經查證的推測被附和後，是否逐漸成為解釋後續異常的固定框架？" },
  },
  {
    section: "chen-liu",
    row: "324",
    marks: [["有繼續發燒嗎？他狀況還好嗎", "verify", "有追問但仍待核實處置"]],
    note: { label: "爭點", tone: "verify", text: "訊息顯示有追問；仍需核對是否取得診斷、治療與複診結果。" },
  },
  {
    section: "chen-liu",
    row: "325",
    marks: [
      ["鼻涕從來到現在沒有停過", "signal", "持續身體症狀"],
      ["應該是有過敏體質的問題吧", "dispute", "照顧者自行歸因"],
    ],
    note: { label: "疑點", text: "持續症狀是事實回報；「過敏體質」則是尚待醫療確認的歸因。" },
  },
  {
    section: "chen-liu",
    row: "372",
    marks: [
      ["把牙都磨掉了", "dispute", "掉牙原因尚待醫療查證"],
      ["牙已經找不到了", "signal", "重大牙齒警訊"],
    ],
    note: { label: "重大爭點", text: "掉牙是可確認的重大警訊；是否由磨牙造成，不能只依照顧者說法判定。" },
  },
  {
    section: "chen-liu",
    row: "376",
    marks: [["還不至於磨到掉牙", "signal", "照顧者也認為情況異常"]],
  },
  {
    section: "chen-liu",
    row: "382",
    marks: [["可能它牙齒本身比較脆弱", "dispute", "沒有醫療根據的推測"]],
    note: { label: "疑點", text: "「牙齒較脆弱」在對話中沒有診斷或病歷佐證。" },
  },
  {
    section: "chen-liu",
    row: "405",
    marks: [["要等到他後面的大臼齒長出來才可以做", "verify", "轉述醫囑待核實"]],
    note: { label: "待查證", tone: "verify", text: "應與牙醫病歷、轉診建議及當日陪診者說法核對，而非只保留單一轉述。" },
  },
  {
    section: "chen-liu",
    row: "406",
    marks: [["所以目前就是先等等囉", "dispute", "處置停在等待"]],
    note: { label: "爭點", text: "等待假牙與追查短期大量掉牙的傷勢原因，是兩個不同問題。" },
  },
  {
    section: "chen-liu",
    row: "409",
    marks: [["可能是他之前曾經受到什麼刺激或不平等待遇", "dispute", "與牙醫證詞有落差的轉述"]],
    note: { label: "直接矛盾", text: "牙醫庭上證稱，已告知磨牙不太可能造成如此嚴重掉牙，並建議轉醫院檢查。" },
  },
  {
    section: "chen-liu",
    row: "493",
    marks: [["把第四顆咬加磨給弄掉了", "signal", "第四顆牙齒掉落"]],
    note: { label: "爭點", text: "在已知前三顆異常掉落後，第四顆掉落是否觸發立即醫療、傷勢查核或通報？" },
  },
  {
    section: "chen-liu",
    row: "496",
    marks: [["有記得上個月您有說第四顆也在搖", "verify", "已知持續性牙齒警訊"]],
  },
  {
    section: "chen-grandmother",
    row: "023",
    marks: [
      ["額頭有瘀青", "signal", "可見身體警訊"],
      ["跑跑的時候撞到的", "dispute", "照顧者說法尚待驗證"],
      ["食慾比較不好", "signal", "飲食與外觀警訊"],
      ["想睡覺了，所以表情看起來很無辜", "dispute", "對照片外觀的解釋"],
    ],
    note: { label: "爭點", text: "外婆收到的是瘀青、消瘦與表情變化的成因解釋；法院對同組照片的判讀則列為可察覺異常。" },
  },
  {
    section: "chen-grandmother",
    row: "040",
    marks: [
      ["目前有四顆牙齒掉下來了", "signal", "重大牙齒警訊"],
      ["可能是他之前曾經受到什麼刺激或不平等待遇", "dispute", "成因歸向前段照顧"],
      ["很可能是這些因素導致的", "dispute", "結論式歸因"],
    ],
    note: { label: "疑點", text: "外婆接收到的是結論式轉述；未同時看到牙醫否定磨牙致嚴重掉牙及建議轉診的證詞內容。" },
  },
  {
    section: "chen-grandmother",
    row: "084",
    marks: [["現階段還不合適跟前保母討論這件事情", "verify", "延後獨立資訊來源"]],
    note: { label: "證據界限", tone: "boundary", text: "這句不能單獨證明阻撓；爭點是前保母作為獨立資訊來源，何時才被詢問。" },
  },
  {
    section: "chen-liu",
    row: "541",
    marks: [["您還好嗎", "verify", "死亡後關注順序"]],
    note: { label: "證據界限", tone: "boundary", text: "可討論問候與聯繫順序，但不能只憑一句話推定冷漠、共謀或故意。" },
  },
];
dialogueHighlights.forEach((item) => {
  const row = findDialogueRow(item.section, item.row);
  if (!row) return;
  let marked = false;
  item.marks.forEach(([phrase, tone, label]) => {
    marked = highlightPhrase(q("p", row), phrase, tone, label) || marked;
  });
  if (marked) {
    row.classList.add("key-message");
    addHighlightComment(row, item.note);
  }
});
const treatmentHighlights = [
  { id: "record-17", marks: [["猜測前一個保母可能較嚴厲", "dispute", "未查證的前手歸因"]], note: { label: "疑點", text: "此為推測；判決對讀顯示陳尚潔未親見，也未看到照片或影片佐證。" } },
  { id: "record-21", marks: [["猜想過往劉童可能活動量不足", "dispute", "未查證的前手歸因"]], note: { label: "疑點", text: "推測再次指向過往照顧，但節錄內容未呈現向前保母或客觀紀錄查證。" } },
  { id: "record-24", marks: [["瘀青一大塊", "signal", "親見大片瘀青"], ["先前是不是有經歷什麼樣的事", "dispute", "傷勢被導向前段經歷"]], note: { label: "核心爭點", text: "已親見大片瘀青後，是否取得照片、就醫資料並提高訪視或通報層級？" } },
  { id: "record-26", marks: [["其餘沒有特殊狀況", "dispute", "與未釐清傷勢形成張力"]], note: { label: "矛盾／張力", text: "9月大片瘀青仍待追蹤，10月紀錄卻以「其餘沒有特殊狀況」收束。" } },
  { id: "record-28", marks: [["先讓他泡澡，多喝水，看是否能自然降溫", "verify", "發燒處置待追蹤"]], note: { label: "待查證", tone: "verify", text: "是否量測體溫、督促就醫並取得診斷與後續結果，節錄中未見完整閉環。" } },
  { id: "record-29", marks: [["牙齒有長滿了", "signal", "10月23日牙齒狀態"], ["看起來還是不太有精神", "signal", "訪視可見警訊"]], note: { label: "時間爭點", text: "10月23日仍記載牙齒長滿；11月19日即回報三顆掉落、另一顆搖晃。" } },
  { id: "record-31", marks: [["體溫偏高", "signal", "發燒警訊"], ["口鼻處有膿痂疹、喉嚨有點紅", "signal", "感染與身體症狀"], ["還沒有打預防針", "verify", "醫療後續待確認"]], note: { label: "待查證", tone: "verify", text: "是否取得用藥、複診、疫苗與診斷資料，並據此更新風險評估？" } },
  { id: "record-34", marks: [["三顆牙齒掉下來了，另外旁邊還有一顆牙齒也在晃", "signal", "短期大量掉牙"]], note: { label: "重大爭點", text: "短期大量掉牙屬異常傷勢警訊；不能只以磨牙解釋，應立即核實醫療與傷勢成因。" } },
  { id: "record-35", marks: [["掉了三顆牙齒，另外還有一顆牙已經在搖了", "signal", "連續牙齒警訊"], ["不確定是否是因為劉童經歷了什麼樣的事情", "dispute", "再次歸向過往經歷"], ["感謝劉彩萱細心照顧", "dispute", "與照片外觀判讀形成張力"]], note: { label: "說法存疑", text: "本筆把掉牙等異常再次連向過往經歷，並以「細心照顧」作結；但法院對同日照片的判讀包括更削瘦、額頭再有瘀青與頭髮稀疏。存疑的是紀錄的解釋與評價是否完整反映可見警訊，不是否定訪視曾發生。" } },
  { id: "record-36", marks: [["先等待劉童長牙", "verify", "處置停在等待"], ["受到什麼刺激或不平等待遇", "dispute", "與牙醫證詞相反的轉述"], ["例如癲癇", "dispute", "未見診斷佐證"]], note: { label: "直接矛盾", text: "處遇紀錄轉述牙醫把掉牙連向嚴重磨牙與過往刺激；蔡函妤牙醫庭上則明確否定磨牙足以造成嚴重掉牙，並證稱曾建議轉醫院檢查。" } },
  { id: "record-38", marks: [["約月中的時間訪視", "verify", "訪視延後"]], note: { label: "爭點", tone: "verify", text: "在已出現大量掉牙後，延後訪視是否符合當時風險程度？" } },
  { id: "record-39", marks: [["把第四顆牙齒咬加磨給弄掉了", "signal", "第四顆牙齒掉落"]], note: { label: "重大爭點", text: "第四顆牙再度掉落後，紀錄未顯示立即醫療、傷勢調查或責任通報。" } },
  { id: "record-40", marks: [["因磨牙很嚴重而掉了四顆牙", "dispute", "掉牙原因的結論式轉述"], ["可能是有經歷特別的刺激或是不平等的待遇", "dispute", "成因再次指向前段照顧"]], note: { label: "疑點", text: "向外婆轉述時，事實警訊與尚未證實的成因推測被連在一起。" } },
  { id: "record-43", marks: [["看起來像是創傷反應", "dispute", "心理成因假說"], ["進行遊戲治療的可能", "verify", "處置轉向諮商"]], note: { label: "核心爭點", text: "心理創傷假說與遊戲治療，是否取代了對連續掉牙及身體傷勢的急迫查核？" } },
  { id: "record-44", marks: [["一整天活動力低、沒有食慾，幾乎沒有吃東西和喝水", "signal", "死亡當日重大生命警訊"], ["有點強迫讓劉童喝完配方奶", "signal", "死亡前照顧者陳述"], ["晚上12點要幫劉童更換尿布時發現劉童不對勁", "verify", "時間點來自照顧者陳述"]], note: { label: "來源衝突", text: "本筆時間軸主要來自劉彩萱事後陳述，不能直接視為醫療死因或完整客觀時間線；須與急救紀錄、鑑定及其他供述分開核對。" } },
];
treatmentHighlights.forEach((item) => {
  const entry = q("#" + item.id);
  const body = q(".record-body", entry);
  if (!body) return;
  const focus = [];
  item.marks.forEach(([phrase, tone, label]) => {
    if (highlightPhrase(body, phrase, tone, label)) focus.push(label);
  });
  if (focus.length) {
    const line = document.createElement("div");
    line.className = "record-focus-line";
    line.innerHTML = "<b>本筆重點</b>" + focus.map((label) => "<span>" + label + "</span>").join("");
    body.prepend(line);
  }
  if (item.note) {
    const isVerificationGap = item.note.tone === "verify";
    addHighlightComment(body, {
      ...item.note,
      label: isVerificationGap ? "查證不足" : "說法存疑",
    });
    const summary = q("summary", entry);
    const badge = document.createElement("em");
    badge.className = "record-doubt-badge" + (isVerificationGap ? " verify" : "");
    badge.textContent = isVerificationGap ? "查證不足" : "說法存疑";
    summary?.append(badge);
  }
});
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
