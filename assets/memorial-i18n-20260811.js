/* 2026-08-11 — Force the shared memorial banner to match EN / JA pages. */
(() => {
  const copies = {
    en: {
      title: 'Remembering him means remembering more than a tragedy.',
      lead: 'May someone reach out and protect the next child before harm occurs.',
      note: 'We continue to document cases, explain judicial proceedings, and attend to every overlooked cry for help, so that children’s suffering and silence are not seen only briefly while a story is in the news.',
      brand: 'Child Protection Action Alliance',
      focus: 'Case Records｜Court Observation｜Child Protection Advocacy',
      imageAlt: 'Memorial illustration of Kaikai: a little boy in a blue striped shirt'
    },
    ja: {
      title: '彼を記憶することは、一つの悲劇だけを記憶することではありません。',
      lead: '次の子どもが傷つけられる前に、誰かが手を差し伸べ、受け止めてくれますように。',
      note: '私たちは、事件の記録を残し、司法手続きを整理し、見過ごされてきた一つひとつの救いを求めるサインを見つめ続けます。子どもの傷と沈黙が、ニュースの関心の中で一時的に注目されるだけで終わらないように。',
      brand: '子供保護行動連盟',
      focus: '事件記録｜司法傍聴｜児童保護の提言',
      imageAlt: 'カイカイを偲ぶイラスト：青いボーダーシャツを着た男の子'
    }
  };

  const lang = (document.documentElement.lang || '').toLowerCase().startsWith('ja')
    ? 'ja'
    : (document.documentElement.lang || '').toLowerCase().startsWith('en')
      ? 'en'
      : '';
  const copy = copies[lang];
  if (!copy) return;

  const applyCopy = () => {
    const section = document.querySelector('.global-memorial-section');
    if (!section) return false;

    const title = section.querySelector('#globalMemorialTitle');
    const lead = section.querySelector('.global-memorial-lead');
    const note = section.querySelector('.global-memorial-note');
    const brand = section.querySelector('.global-memorial-signoff strong');
    const focus = section.querySelector('.global-memorial-signoff span');
    const image = section.querySelector('.global-memorial-media img');

    if (title) title.textContent = copy.title;
    if (lead) lead.textContent = copy.lead;
    if (note) note.textContent = copy.note;
    if (brand) brand.textContent = copy.brand;
    if (focus) focus.textContent = copy.focus;
    if (image) image.alt = copy.imageAlt;
    return true;
  };

  const start = () => {
    if (applyCopy()) return;

    const observer = new MutationObserver(() => {
      if (applyCopy()) observer.disconnect();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
    window.setTimeout(() => observer.disconnect(), 5000);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
