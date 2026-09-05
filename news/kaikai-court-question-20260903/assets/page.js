document.documentElement.classList.add("js");

// Reading aids preserve the original wording and sequence of all speaker turns.
const readingLabels = {
  'zh-Hant': ['訓練與辨識經驗','訪視與安全評估','三次警訊與通報門檻','訪視權限與保護義務','疑似，還是先確定？','釐清警訊的時機'],
  'zh-Hans': ['训练与辨识经验','访视与安全评估','三次警讯与通报门槛','访视权限与保护义务','疑似，还是先确定？','厘清警讯的时机'],
  en: ['Training and recognition experience','Visits and safety assessment','Three warning signs and the reporting threshold','Visiting authority and protective duties','Suspicion, or confirmation first?','When should warning signs be clarified?'],
  ja: ['研修と虐待認識の経験','訪問と安全評価','三つの警告と通報の基準','訪問の権限と保護義務','疑いか、先に確定が必要か','警告を確認する時機']
};
const readingLanguage = new URLSearchParams(location.search).get('lang') === 'zh-Hans' ? 'zh-Hans' : document.documentElement.lang;
const readingTurns = [...document.querySelectorAll('.exchange')];
[0,20,26,46,54,64].forEach((index, group) => {
  if (!readingTurns[index]) return;
  const heading = document.createElement('h3');
  heading.className = 'testimony-topic';
  heading.textContent = (readingLabels[readingLanguage] || readingLabels['zh-Hant'])[group];
  readingTurns[index].before(heading);
});
for (const paragraph of document.querySelectorAll('.exchange p')) {
  const text = paragraph.textContent;
  const pattern = /（[^）]*(?:沉默|聽不清楚|听不清楚)[^）]*）|\([^)]*(?:silence|inaudible|could not be heard)[^)]*\)|［[^］]*沈黙[^］]*］|（[^）]*沈黙[^）]*）/gi;
  const matches = [...text.matchAll(pattern)];
  if (!matches.length || paragraph.children.length) continue;
  paragraph.textContent = '';
  let start = 0;
  for (const match of matches) {
    paragraph.append(document.createTextNode(text.slice(start, match.index)));
    const note = document.createElement('span');
    note.className = 'testimony-annotation';
    note.textContent = match[0];
    paragraph.append(note);
    start = match.index + match[0].length;
  }
  paragraph.append(document.createTextNode(text.slice(start)));
}

const readingEmphasis = {
  'zh-Hant': ['明確證據','是疑似','請回答是或不是'],
  'zh-Hans': ['明确证据','是疑似','请回答是或不是'],
  en: ['clear evidence','suspected abuse','yes or no'],
  ja: ['明確な証拠','疑い','はい、いいえ']
};
for (const paragraph of document.querySelectorAll('.exchange p')) {
  for (const node of [...paragraph.childNodes]) {
    if (node.nodeType !== Node.TEXT_NODE) continue;
    const phrase = (readingEmphasis[readingLanguage] || readingEmphasis['zh-Hant']).find(word => node.textContent.includes(word));
    if (!phrase) continue;
    const index = node.textContent.indexOf(phrase);
    const strong = document.createElement('strong');
    strong.textContent = phrase;
    node.replaceWith(document.createTextNode(node.textContent.slice(0,index)),strong,document.createTextNode(node.textContent.slice(index+phrase.length)));
    break;
  }
}

// Persist the language chosen in the shared toolbar before navigation. Without
// this, a previously stored Simplified Chinese preference can immediately
// convert the physical Traditional Chinese page back to Simplified Chinese.
document.addEventListener(
  "click",
  (event) => {
    const link = event.target.closest("#cpa-four-language-toolbar a[hreflang]");
    if (!link) return;
    try {
      localStorage.setItem("siteLang", link.getAttribute("hreflang"));
    } catch (_) {}
  },
  { capture: true },
);

const progressBar = document.querySelector(".reading-progress span");

function updateProgress() {
  const root = document.documentElement;
  const distance = root.scrollHeight - root.clientHeight;
  const progress = distance > 0 ? Math.min(root.scrollTop / distance, 1) : 0;
  progressBar.style.width = `${progress * 100}%`;
}

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealItems = document.querySelectorAll(".reveal");

if (reduceMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8%", threshold: 0.08 },
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

window.addEventListener("scroll", updateProgress, { passive: true });
window.addEventListener("resize", updateProgress);
updateProgress();
