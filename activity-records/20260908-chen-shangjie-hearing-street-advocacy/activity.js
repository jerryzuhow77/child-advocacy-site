(() => {
  const base = document.body.dataset.assetBase || '.';
  const lang = document.querySelector('[data-campaign-gallery]')?.dataset.lang || 'zh-Hant';

  const captions = [
    {
      file: 'gallery-01.webp',
      zh: '臺北車站大廳｜四面倡議牌共同亮相',
      en: 'Taipei Main Station concourse | Four advocacy signs presented together',
      ja: '台北駅コンコース｜4枚のメッセージボードを掲げて'
    },
    {
      file: 'gallery-02.webp',
      zh: '臺北車站大廳｜讓案件與制度責任持續被看見',
      en: 'Taipei Main Station concourse | Keeping the case and institutional accountability visible',
      ja: '台北駅コンコース｜事件と制度的責任を可視化する'
    },
    {
      file: 'gallery-03.webp',
      zh: '臺北車站大廳｜公共倡議合影',
      en: 'Taipei Main Station concourse | Public advocacy group photo',
      ja: '台北駅コンコース｜啓発活動の集合写真'
    },
    {
      file: 'gallery-04.webp',
      zh: '臺北車站大廳｜在城市轉運節點留下守護訴求',
      en: 'Taipei Main Station concourse | A child-protection message at the city’s transit hub',
      ja: '台北駅コンコース｜都市の交通拠点から子どもの保護を訴える'
    },
    {
      file: 'gallery-05.webp',
      zh: '臺北車站北二門｜宣傳行動合影',
      en: 'Taipei Main Station North Gate 2 | Campaign group photo',
      ja: '台北駅北2門｜啓発活動の集合写真'
    },
    {
      file: 'gallery-06.webp',
      zh: '臺北車站北二門｜四項現場訴求',
      en: 'Taipei Main Station North Gate 2 | Four messages from the campaign',
      ja: '台北駅北2門｜現場で掲げた4つのメッセージ'
    },
    {
      file: 'gallery-07.webp',
      zh: '站前廣場｜願悲劇止於此刻，願孩子都能被接住',
      en: 'Station plaza | May the tragedy end here; may every child be protected',
      ja: '駅前広場｜悲劇をここで止め、すべての子どもが守られるように'
    },
    {
      file: 'gallery-08.webp',
      zh: '站前廣場｜「台灣不是失去一個孩子都無所謂的國家」',
      en: 'Station plaza | “Taiwan must never become a country indifferent to losing a child”',
      ja: '駅前広場｜「子どもを一人失っても構わない国にしてはならない」'
    },
    {
      file: 'gallery-09.webp',
      zh: '站前廣場｜希望每一個孩子都能平安長大',
      en: 'Station plaza | Hoping every child can grow up safely',
      ja: '駅前広場｜すべての子どもが安全に成長できるように'
    },
    {
      file: 'gallery-10.webp',
      zh: '站前廣場｜參與者手持現場訴求牌',
      en: 'Station plaza | A participant holding one of the campaign signs',
      ja: '駅前広場｜メッセージボードを掲げる参加者'
    },
    {
      file: 'gallery-11.webp',
      zh: '站前廣場｜參與者表達對機構責任與捐款選擇的質疑',
      en: 'Station plaza | A participant questions institutional accountability and donation choices',
      ja: '駅前広場｜組織の責任と寄付の選択について問いかける参加者'
    },
    {
      file: 'gallery-12.webp',
      zh: '站前廣場｜「他們本該長大」',
      en: 'Station plaza | “They should have had the chance to grow up”',
      ja: '駅前広場｜「この子たちは成長するはずだった」'
    },
    {
      file: 'gallery-13.webp',
      zh: '宣傳資料｜護童行動聯盟官方社群與網站資訊',
      en: 'Campaign handout | Alliance website and official social channels',
      ja: '配布資料｜連盟の公式サイトとSNS案内'
    },
    {
      file: 'gallery-14.webp',
      zh: '宣傳資料｜剴剴案進度與兒少保護重點',
      en: 'Campaign handout | Kaikai case update and child-protection issues',
      ja: '配布資料｜カイカイ事件の進捗と児童保護の論点'
    },
    {
      file: 'gallery-15.webp',
      zh: '站前廣場｜以四面訴求牌展開定點宣傳',
      en: 'Station plaza | A stationary campaign with four advocacy signs',
      ja: '駅前広場｜4枚のメッセージボードによる定点啓発'
    },
    {
      file: 'gallery-16.webp',
      zh: '臺北車站東一門｜向往來旅客傳遞兒少守護訊息',
      en: 'Taipei Main Station East Gate 1 | Sharing child-protection messages with travelers',
      ja: '台北駅東1門｜行き交う人々に児童保護のメッセージを届ける'
    },
    {
      file: 'gallery-17.webp',
      zh: '站前廣場｜移動宣傳紀錄',
      en: 'Station plaza | Mobile outreach in progress',
      ja: '駅前広場｜移動しながらの啓発活動'
    },
    {
      file: 'gallery-18.webp',
      zh: '臺北車站東一門｜定點宣傳與人流互動',
      en: 'Taipei Main Station East Gate 1 | Outreach amid the flow of travelers',
      ja: '台北駅東1門｜通行者に向けた定点啓発'
    },
    {
      file: 'gallery-19.webp',
      zh: '臺北車站東一門｜「台灣不是失去一個孩子都無所謂的國家」',
      en: 'Taipei Main Station East Gate 1 | Calling for a society that values every child',
      ja: '台北駅東1門｜一人ひとりの子どもを大切にする社会を求めて'
    },
    {
      file: 'gallery-20.webp',
      zh: '臺北車站周邊｜讓訴求在行走中被看見',
      en: 'Around Taipei Main Station | Making the message visible while moving through the station',
      ja: '台北駅周辺｜歩きながらメッセージを可視化する'
    },
    {
      file: 'gallery-21.webp',
      zh: '站前廣場｜兒少守護宣傳行動紀錄',
      en: 'Station plaza | Child-protection outreach record',
      ja: '駅前広場｜児童保護の啓発活動記録'
    }
  ];

  const key = lang === 'en' ? 'en' : lang === 'ja' ? 'ja' : 'zh';
  const gallery = document.querySelector('[data-campaign-gallery]');
  const dialog = document.querySelector('[data-campaign-lightbox]');
  const dialogImage = dialog?.querySelector('img');
  const dialogCaption = dialog?.querySelector('[data-lightbox-caption]');
  const closeButton = dialog?.querySelector('[data-lightbox-close]');

  if (gallery) {
    gallery.innerHTML = captions.map((item, index) => {
      const caption = item[key];
      return `
        <button class="campaign-photo campaign-reveal" type="button" data-photo-index="${index}" aria-label="${caption}">
          <img src="${base}/images/${item.file}" alt="${caption}" loading="lazy" decoding="async">
          <span>${caption}</span>
        </button>`;
    }).join('');

    gallery.addEventListener('click', event => {
      const button = event.target.closest('[data-photo-index]');
      if (!button || !dialog || !dialogImage || !dialogCaption) return;
      const item = captions[Number(button.dataset.photoIndex)];
      dialogImage.src = `${base}/images/${item.file}`;
      dialogImage.alt = item[key];
      dialogCaption.textContent = item[key];
      if (typeof dialog.showModal === 'function') dialog.showModal();
      else dialog.setAttribute('open', '');
    });
  }

  const closeDialog = () => {
    if (!dialog) return;
    if (typeof dialog.close === 'function') dialog.close();
    else dialog.removeAttribute('open');
  };

  closeButton?.addEventListener('click', closeDialog);
  dialog?.addEventListener('click', event => {
    if (event.target === dialog) closeDialog();
  });

  const reveal = document.querySelectorAll('.campaign-reveal');
  if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) {
    reveal.forEach(node => node.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: .08, rootMargin: '0px 0px -6% 0px' });
    reveal.forEach(node => observer.observe(node));
  }
})();
