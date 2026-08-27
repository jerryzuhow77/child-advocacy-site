(function () {
  'use strict';

  var locale = (document.documentElement.lang || '').toLowerCase().startsWith('ja') ? 'ja' : 'en';
  if (locale !== 'en' && locale !== 'ja') return;
  var current = document.currentScript && document.currentScript.src ? document.currentScript.src : location.href;
  var siteRoot = new URL('../', current).href;
  var section = document.getElementById('news-flash');
  if (!section) return;

  function local(path) { return new URL(path.replace(/^\//, ''), siteRoot).href; }
  function node(tag, className, text) {
    var element = document.createElement(tag);
    if (className) element.className = className;
    if (typeof text === 'string') element.textContent = text;
    return element;
  }
  function localizedPath(path) { return local(locale + '/' + path.replace(/^\//, '')); }

  var sharedPinned = [
    { className: 'is-luo-brothers', href: local('cases/luo-brothers/'), image: local('assets/art/luo-brothers-hearing-poster.webp') },
    { className: 'is-charity-donation', href: local('activity-records/20260825-111-surplus-donation/'), image: local('activity-records/20260825-111-surplus-donation/images/charity-paper-clay-visible-v2.jpg?v=20260825-card-repair-1') }
  ];
  var sharedItems = [
    { className: 'is-day9', href: local('hearing-records/prison-watch/kaikai-day9-20250506/'), imageByLocale: { en: local('assets/art/prison-watch-day9-kaikai-testimony-poster-en-20260827.svg'), ja: local('assets/art/prison-watch-day9-kaikai-testimony-poster-ja-20260827.svg') } },
    { className: 'is-jungein-korea', href: 'https://jungein-memory-door.jerryzuhow77.chatgpt.site/', image: local('assets/art/jungein-memory-door-home-20260826.webp'), external: true },
    { href: local('hearing-records/prison-watch/kaikai-day8-20250505/'), imageByLocale: { en: local('assets/art/prison-watch-day8-kaikai-evidence-poster-en-20260827.svg'), ja: local('assets/art/prison-watch-day8-kaikai-evidence-poster-ja-20260827.svg') } },
    { href: 'https://tainan-tom-bear-case.jerryzuhow77.chatgpt.site/', image: local('assets/art/tainan-tom-bear-home-hero-20260825.webp'), external: true },
    { className: 'is-tucheng-domestic-hearing', href: local('hearing-records/tucheng-domestic-violence-double-homicide-20260821/'), image: local('assets/images/tucheng-hearing-20260821-hero.jpg') },
    { className: 'is-tucheng-domestic-case', href: local('cases/tucheng-domestic-violence-double-homicide/'), image: local('assets/images/tucheng-family-feature-20260823.jpg') },
    { href: localizedPath('hearing-records/prison-watch/kaikai-day5-20250429/'), imageByLocale: { en: local('assets/art/prison-watch-day5-forensic-en-20260827.svg'), ja: local('assets/art/prison-watch-day5-forensic-ja-20260827.svg') } },
    { href: localizedPath('hearing-records/prison-watch/kaikai-day4-20250428/'), image: local('assets/art/prison-watch-day4-hearing-poster-clay-20260821-v2.webp') },
    { className: 'is-story-collection', href: localizedPath('activity-records/20260820-kaikai-story-collection/'), image: local('activity-records/20260820-kaikai-story-collection/images/kaikai-story-collection-hero.webp'), qa916: true },
    { href: localizedPath('activity-records/20260801-ketagal-rally/'), image: local('assets/art/rally-20260801-ai-poster.jpg') }
  ];

  var copy = {
    en: {
      eyebrow: 'LATEST REPORTS · RECENTLY UPDATED', title: 'Latest reports',
      intro: 'Two pinned reports loop horizontally while the 10 most recently published articles move gently around the children’s Ferris wheel.',
      all: 'View all documents →', pinned: 'Pinned reports', pinnedHint: 'Two important updates continue in a horizontal loop',
      listLabel: 'The 10 most recently published articles', wheel: 'Latest reports', wheelCount: '10 recent articles',
      previous: 'Previous report', next: 'Next report', help: 'The wheel turns slowly. Hover, touch, or drag to pause, then select a carriage to read the full article.',
      pinnedItems: [
        { meta: '08.26 · LATEST REPORT · PINNED', title: 'Luo Brothers Miscarriage-of-Justice Retrial', summary: 'Latest developments, case background, and complete documents', alt: 'Key visual for the Luo brothers miscarriage-of-justice retrial' },
        { meta: '08.25 · LATEST REPORT · PINNED', title: 'Continuing Our Shared Support as Another Act of Care', summary: 'The remaining NT$27,128 in public activity funds was donated in full', alt: 'Poster confirming the full donation of NT$27,128 remaining from the January 11 child-protection march' }
      ],
      items: [
        { meta: '08.26 · LATEST COURT RECORD', title: 'Ninth Trial Date', summary: 'Comparing the testimony of Liu Cai-Xuan and Liu Ruo-Lin', alt: 'Cover artwork for the ninth trial date and the testimony of two defendants' },
        { meta: '08.26 · NEW KOREAN HISTORICAL CASE', title: 'The Jeong-in Case | The Door Did Not Open', summary: 'Three reports did not become a path to safety', alt: 'Hanji paper-cut artwork with a half-open paper door, porcelain bowl, brass spoon, wrapping cloth and child socks; no injuries are depicted' },
        { meta: '08.26 · LATEST COURT RECORD', title: 'Eighth Trial Date', summary: 'Evidence review, closing arguments, and sentencing documents', alt: 'Cover artwork for the complete court record from the eighth trial date' },
        { meta: '08.25 · NEW TAIWAN HISTORICAL CASE', title: 'The Tainan Tom’s World Case', summary: 'He said there would be no death sentence—and there was not', alt: 'Paper-cut feature artwork for the Tainan Tom’s World case' },
        { meta: '08.23 · LATEST COURT RECORD', title: 'Tucheng Domestic-Violence Double Homicide', summary: 'First-instance judgment, sentencing arguments, and full court notes', alt: 'Cover artwork for the complete August 21, 2026 Tucheng court notes' },
        { meta: '08.23 · CASE FEATURE', title: 'Before the Fracture', summary: 'A family’s silence and collapse', alt: 'Cover artwork for the Tucheng family tragedy and institutional reflection feature' },
        { meta: '08.22 · COURT RECORD', title: 'Fifth Trial Date', summary: 'Two physicians’ testimony and the medical evidence compared', alt: 'Cover artwork for the fifth trial date medical evidence and complete court record' },
        { meta: '08.21 · COURT RECORD', title: 'Fourth Trial Date', summary: 'Two witnesses, three movement routes, and injury reporting', alt: 'Cover artwork for reconstructed editorial notes from the fourth trial date' },
        { meta: '08.20 · ACTION BEFORE THE 9/16 HEARING', title: 'Let Us Write Kai-Kai’s Story Together', summary: 'Share your feelings, questions, and hopes for change', alt: 'Paper-cut and clay campaign artwork inviting the public to write Kai-Kai’s story' },
        { meta: '08.20 · ACTIVITY RECORD UPDATE', title: 'Rally Against Drugged and Drunk Driving', summary: 'Support for victims’ families and child-protection advocacy', alt: 'Record of the August 1, 2026 Ketagalan Boulevard rally against drugged and drunk driving' }
      ]
    },
    ja: {
      eyebrow: 'LATEST REPORTS · RECENTLY UPDATED', title: '最新速報',
      intro: '2件の固定速報が横方向に循環し、最新公開10件の記事が子どもらしい観覧車に乗ってゆっくり回ります。',
      all: '資料一覧を見る →', pinned: '固定速報', pinnedHint: '重要な2件を横方向に繰り返し表示',
      listLabel: '最新公開の10記事', wheel: '最新速報', wheelCount: '最新10件',
      previous: '前の速報', next: '次の速報', help: '観覧車はゆっくり回転します。マウスを重ねる、触れる、またはドラッグすると停止し、ゴンドラを選ぶと記事全文を読めます。',
      pinnedItems: [
        { meta: '08.26・最新速報・固定', title: '羅兄弟冤罪事件の再審理', summary: '最新動向、事件の経緯、関連資料', alt: '羅兄弟冤罪事件の再審理を伝えるメインビジュアル' },
        { meta: '08.25・最新速報・固定', title: '皆さまの支援を、次の守りへ', summary: '活動公費の残額27,128元を全額寄付', alt: '1月11日の児童保護デモの残額27,128元を全額寄付したことを伝えるポスター' }
      ],
      items: [
        { meta: '08.26・最新傍聴記録', title: '第9回公判期日', summary: '劉彩萱と劉若琳の証言を比較', alt: '第9回公判期日における被告2人の証言を扱うメインビジュアル' },
        { meta: '08.26・韓国の歴史的事件・新着', title: '韓国チョンイン事件｜扉は開かなかった', summary: '3度の通報は安全への出口にならなかった', alt: '半開きの韓紙の扉、白磁の器、真鍮の匙、ポジャギ、子どもの靴下で構成した事件特集ビジュアル。傷害表現はありません' },
        { meta: '08.26・最新傍聴記録', title: '第8回公判期日', summary: '証拠調べ、論告、量刑資料の整理', alt: '第8回公判期日の完全傍聴記録メインビジュアル' },
        { meta: '08.25・台湾の歴史的事件・新着', title: '台南トムズ・ワールド男児殺害事件', summary: '「死刑にはならない」と語り、実際に死刑にはならなかった', alt: '台南トムズ・ワールド男児殺害事件の切り絵特集ビジュアル' },
        { meta: '08.23・最新傍聴記録', title: '土城DV二人死亡事件', summary: '一審判決、量刑をめぐる攻防、完全傍聴記録', alt: '2026年8月21日の土城事件完全傍聴記録のメインビジュアル' },
        { meta: '08.23・社会事件特集', title: '亀裂の前に', summary: 'ある家族の沈黙と崩壊', alt: '土城事件の家族悲劇と制度的省察を描く特集ビジュアル' },
        { meta: '08.22・傍聴記録', title: '第5回公判期日', summary: '2人の医師の証言と医学証拠を比較', alt: '第5回公判期日の医学証拠と完全傍聴記録のメインビジュアル' },
        { meta: '08.21・傍聴記録', title: '第4回公判期日', summary: '2人の証人、3つの動線、傷害の通報', alt: '第4回公判期日の再構成編集記録メインビジュアル' },
        { meta: '08.20・9/16公判前の行動', title: '一緒にカイカイの物語を書き残そう', summary: '感じたこと、疑問、変化への願いをお寄せください', alt: 'カイカイの物語を共に書き残す紙彫刻と陶土の投稿企画ビジュアル' },
        { meta: '08.20・活動記録更新', title: '薬物・飲酒運転に反対する大行進', summary: '被害者家族への支援と子どもの保護を訴える活動', alt: '2026年8月1日の薬物・飲酒運転反対ケタガラン大通り集会の記録' }
      ]
    }
  }[locale];

  var replacement = node('section', 'home-latest-flash home-document-disc-section');
  replacement.id = 'news-flash';
  replacement.setAttribute('aria-labelledby', 'newsFlashTitle');
  var container = node('div', 'container');
  var head = node('div', 'home-news-stream-head home-flash-head');
  var headCopy = node('div');
  headCopy.appendChild(node('div', 'art-eyebrow dark', copy.eyebrow));
  headCopy.appendChild(node('span', 'stream-icon', '✦'));
  var title = node('h2', '', copy.title); title.id = 'newsFlashTitle'; headCopy.appendChild(title);
  headCopy.appendChild(node('p', '', copy.intro));
  var allLink = node('a', '', copy.all); allLink.href = localizedPath('cases/');
  head.appendChild(headCopy); head.appendChild(allLink); container.appendChild(head);

  var pinned = node('section', 'home-pinned-reports');
  pinned.dataset.pinnedReports = '';
  pinned.setAttribute('aria-labelledby', 'homePinnedReportsTitle');
  var pinnedHead = node('header');
  pinnedHead.appendChild(node('span', '', 'PINNED REPORTS'));
  var pinnedTitle = node('h3', '', copy.pinned); pinnedTitle.id = 'homePinnedReportsTitle'; pinnedHead.appendChild(pinnedTitle);
  pinnedHead.appendChild(node('small', '', copy.pinnedHint)); pinned.appendChild(pinnedHead);
  var pinnedViewport = node('div', 'home-pinned-reports-viewport');
  var pinnedTrack = node('div', 'home-pinned-reports-track');
  sharedPinned.forEach(function (item, index) {
    var text = copy.pinnedItems[index];
    var card = node('a', 'home-pinned-report-card ' + item.className); card.href = item.href;
    var image = node('img'); image.src = item.image; image.alt = text.alt; image.loading = 'eager'; image.decoding = 'async';
    var cardCopy = node('span'); cardCopy.appendChild(node('small', '', text.meta)); cardCopy.appendChild(node('strong', '', text.title)); cardCopy.appendChild(node('em', '', text.summary));
    card.appendChild(image); card.appendChild(cardCopy); pinnedTrack.appendChild(card);
  });
  pinnedViewport.appendChild(pinnedTrack); pinned.appendChild(pinnedViewport); container.appendChild(pinned);

  var shell = node('div', 'home-document-disc-shell is-ferris-wheel'); shell.dataset.documentDisc = '';
  var sea = node('div', 'home-sea-art'); sea.setAttribute('aria-hidden', 'true');
  ['sea-horizon', 'sea-wave-layer sea-wave-far', 'sea-wave-layer sea-wave-near'].forEach(function (name) { sea.appendChild(node('span', name)); });
  var sailboat = node('span', 'sea-sailboat'); sailboat.appendChild(node('i')); sailboat.appendChild(node('b')); sea.appendChild(sailboat);
  sea.appendChild(node('span', 'sea-gulls', '⌒　⌒')); sea.appendChild(node('span', 'sea-fish fish-one', '◁')); sea.appendChild(node('span', 'sea-fish fish-two', '◁')); sea.appendChild(node('span', 'sea-pearls', '○ · ○')); shell.appendChild(sea);
  var cloudOne = node('div', 'home-ferris-cloud cloud-one'); cloudOne.setAttribute('aria-hidden', 'true'); shell.appendChild(cloudOne);
  var cloudTwo = node('div', 'home-ferris-cloud cloud-two'); cloudTwo.setAttribute('aria-hidden', 'true'); shell.appendChild(cloudTwo);
  var spokes = node('div', 'home-ferris-spokes'); spokes.setAttribute('aria-hidden', 'true'); for (var spoke = 0; spoke < 4; spoke += 1) spokes.appendChild(node('i')); shell.appendChild(spokes);
  var orbit = node('div', 'home-document-disc-orbit'); orbit.setAttribute('role', 'list'); orbit.setAttribute('aria-label', copy.listLabel);
  sharedItems.forEach(function (item, index) {
    var text = copy.items[index];
    var card = node('a', 'home-document-disc-card' + (item.className ? ' ' + item.className : '')); card.href = item.href; card.setAttribute('role', 'listitem');
    if (item.external) { card.target = '_blank'; card.rel = 'noopener noreferrer'; }
    if (item.qa916) card.dataset.qa916Card = 'true';
    var image = node('img'); image.src = item.imageByLocale ? item.imageByLocale[locale] : item.image; image.alt = text.alt; image.loading = 'lazy'; image.decoding = 'async'; if (item.qa916) image.dataset.qa916Image = '';
    var cardCopy = node('span'); cardCopy.appendChild(node('small', '', text.meta)); cardCopy.appendChild(node('strong', '', text.title)); cardCopy.appendChild(node('em', '', text.summary));
    card.appendChild(image); card.appendChild(cardCopy); orbit.appendChild(card);
  });
  shell.appendChild(orbit);
  var center = node('div', 'home-document-disc-center'); center.setAttribute('aria-hidden', 'true'); center.appendChild(node('span', '', "CHILDREN'S WHEEL")); center.appendChild(node('strong', '', copy.wheel)); center.appendChild(node('small', '', copy.wheelCount)); shell.appendChild(center);
  var stand = node('div', 'home-ferris-stand'); stand.setAttribute('aria-hidden', 'true'); stand.appendChild(node('i')); stand.appendChild(node('i')); stand.appendChild(node('b')); shell.appendChild(stand);
  var previous = node('button', 'home-document-disc-control is-prev', '‹'); previous.type = 'button'; previous.dataset.discPrev = ''; previous.setAttribute('aria-label', copy.previous); shell.appendChild(previous);
  var next = node('button', 'home-document-disc-control is-next', '›'); next.type = 'button'; next.dataset.discNext = ''; next.setAttribute('aria-label', copy.next); shell.appendChild(next);
  container.appendChild(shell); container.appendChild(node('p', 'home-document-disc-help', copy.help)); replacement.appendChild(container);
  section.replaceWith(replacement);
  document.dispatchEvent(new CustomEvent('cpa-home-latest-ready', { detail: { locale: locale, count: sharedItems.length } }));
}());
