(() => {
  'use strict';

  const copyForPage = () => {
    const lang = (document.documentElement.lang || 'zh-Hant').toLowerCase();
    if (lang.startsWith('en')) return { asker: 'Questioner', answerer: 'Respondent', record: 'Court record', unrecorded: 'not identified in source' };
    if (lang.startsWith('ja')) return { asker: '質問者', answerer: '回答者', record: '法廷記録', unrecorded: '原記録に記載なし' };
    if (lang.includes('hans') || lang.startsWith('zh-cn')) return { asker: '提问者', answerer: '回答者', record: '庭审记录', unrecorded: '原始记录未载明' };
    return { asker: '提問者', answerer: '回答者', record: '庭審紀錄', unrecorded: '原始紀錄未載明' };
  };
  const tidy = (value) => (value || '').replace(/\s+/g, ' ').trim();
  const questionerFrom = (value) => {
    const match = tidy(value).match(/(?:^|[。；;])\s*((?:檢察官|检察官|審判長|审判长|陪席法官|受命法官|國民法官(?:（[^）]+）)?|国民法官(?:（[^）]+）)?|[^。；;]{1,24}?辯護人|[^。；;]{1,24}?辩护人|Prosecutor|Presiding Judge|Associate Judge|Commissioned Judge|Citizen Judge(?:\s*\([^)]*\))?|[^.;]{1,40}?counsel|検察官|裁判長|陪席裁判官|受命裁判官|国民裁判官(?:（[^）]+）)?|[^。；;]{1,24}?弁護人)(?:主詰問|反詰問|覆主詰問|詢問|询问|訊問|讯问|質問|尋問| examination| asks?))/i);
    return match ? match[1].replace(/(?:主詰問|反詰問|覆主詰問|詢問|询问|訊問|讯问|質問|尋問| examination| asks?).*$/i, '').trim() : '';
  };
  const respondentFrom = (value) => {
    const match = tidy(value).match(/^((?:證人|证人|被告|鑑定人|鉴定人|Witness|Defendant|Expert witness|証人|被告人|鑑定人)\s*[^。；;]{0,40}?)(?:回答|答复|答覆| answers?| responds?|が回答)(?:\s|$)/i);
    return match ? match[1].trim() : '';
  };
  const labelSpeakers = (section) => {
    const copy = copyForPage();
    let questioner = '';
    let respondent = '';
    section.querySelectorAll('.pw-verbatim-rows').forEach((group) => {
      group.querySelectorAll(':scope > .pw-verbatim-row').forEach((row) => {
        const left = row.querySelector('.pw-verbatim-left');
        const right = row.querySelector('.pw-verbatim-right');
        if (!left || !right) return;
        const leftText = left.querySelector('p')?.innerText || '';
        const nextQuestioner = questionerFrom(leftText);
        const leftRespondent = (leftText.match(/訊問〔(被告[^〕]+)〕|讯问〔(被告[^〕]+)〕/) || []).slice(1).find(Boolean) || '';
        const nextRespondent = respondentFrom(right.querySelector('p')?.innerText || '') || leftRespondent;
        if (leftRespondent) questioner = '';
        if (nextQuestioner) questioner = nextQuestioner;
        if (nextRespondent) respondent = nextRespondent;
        const procedural = (!questioner && !respondent) || (!nextQuestioner && !nextRespondent && /休庭|入庭|退庭|異議|异议|裁定|程序|recess|adjourn|objection|休廷|入廷|退廷/.test(leftText));
        const leftLabel = left.querySelector('small');
        const rightLabel = right.querySelector('small');
        if (leftLabel) { leftLabel.classList.add('pw-speaker-label'); leftLabel.textContent = procedural ? copy.record : `${copy.asker}｜${questioner || copy.unrecorded}`; }
        if (rightLabel) { rightLabel.classList.add('pw-speaker-label'); rightLabel.textContent = procedural ? copy.record : `${copy.answerer}｜${respondent || copy.unrecorded}`; }
      });
    });
  };

  document.querySelectorAll('.pw-verbatim-source').forEach((section) => {
    labelSpeakers(section);
    section.querySelectorAll('[data-pw-action]').forEach((button) => {
      button.addEventListener('click', () => {
        const open = button.dataset.pwAction === 'open';
        section.querySelectorAll('.pw-verbatim-table').forEach((table) => {
          table.open = open;
        });
      });
    });
  });
})();
