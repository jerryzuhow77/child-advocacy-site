from __future__ import annotations

import re
from pathlib import Path

ROOT = Path('hearing-records/prison-watch/kaikai-final-chapter')
HTML_MARKER = '<!-- OUT-OF-HOME-CARE-FAILURES-20260829 -->'
CSS_MARKER = '/* OUT-OF-HOME-CARE-FAILURES-20260829 */'


def find_balanced(text: str, start_pattern: str, tag: str, label: str) -> tuple[int, int, str]:
    start_match = re.search(start_pattern, text, flags=re.I | re.S)
    if not start_match:
        raise SystemExit(f'{label}: start tag not found')
    depth = 0
    token_pattern = re.compile(rf'</?{tag}\b[^>]*>', flags=re.I | re.S)
    for token in token_pattern.finditer(text, start_match.start()):
        raw = token.group(0).lower()
        if raw.startswith(f'</{tag}'):
            depth -= 1
        elif not raw.rstrip().endswith('/>'):
            depth += 1
        if depth == 0:
            return start_match.start(), token.end(), text[start_match.start():token.end()]
    raise SystemExit(f'{label}: unclosed {tag}')


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise SystemExit(f'{label}: expected one match, found {count}')
    return text.replace(old, new, 1)


TRAD_STATE_DUTY = '''<!-- OUT-OF-HOME-CARE-FAILURES-20260829 -->
      <aside class="placement-state-duty" id="placement-state-duty" aria-labelledby="placementStateDutyTitle">
        <div><small>STATE DUTY AFTER REMOVAL</small><h4 id="placementStateDutyTitle">不是換一個地址，而是國家接手一條持續保護鏈</h4></div>
        <p>孩子一旦由政府安排、核准，或在制度運作下實質交付替代性照顧，國家義務就不只剩「找到一張床」。必須持續確認安置必要性、照顧適配、身心與醫療連續、兒童表意與求助、跨網絡主責、返家準備及長期穩定關係；任何一段無人負責，保護措施本身就可能變成新的風險場域。</p>
        <ul><li>先支持家庭，避免可預防的分離</li><li>依孩子需求配對，而非依剩餘床位</li><li>有獨立親見、申訴與吹哨管道</li><li>一名公部門主責串起所有資訊</li><li>返家前、中、後均須分級複核</li><li>無法返家時及早建立永續安排</li></ul>
      </aside>'''

HANS_STATE_DUTY = '''<!-- OUT-OF-HOME-CARE-FAILURES-20260829 -->
      <aside class="placement-state-duty" id="placement-state-duty" aria-labelledby="placementStateDutyTitleHans">
        <div><small>STATE DUTY AFTER REMOVAL</small><h4 id="placementStateDutyTitleHans">不是换一个地址，而是国家接手一条持续保护链</h4></div>
        <p>孩子一旦由政府安排、核准，或在制度运作下实质交付替代性照顾，国家义务就不只剩“找到一张床”。必须持续确认安置必要性、照顾适配、身心与医疗连续、儿童表达与求助、跨网络主责、返家准备及长期稳定关系；任何一段无人负责，保护措施本身就可能变成新的风险场域。</p>
        <ul><li>先支持家庭，避免可预防的分离</li><li>依孩子需求配对，而非依剩余床位</li><li>有独立亲见、申诉与吹哨渠道</li><li>一名公部门主责串起所有资讯</li><li>返家前、中、后均须分级复核</li><li>无法返家时及早建立永续安排</li></ul>
      </aside>'''

TRAD_FAILURES = '''<section class="placement-failures" id="placement-failures" aria-labelledby="placementFailuresTitle">
        <header><small>WHEN PROTECTION BECOMES ANOTHER RISK</small><h4 id="placementFailuresTitle">八個制度缺陷，會讓家外安置從保護措施變成新的風險場域</h4><p>這些缺陷不是在否定寄養家庭、親屬照顧或第一線工作者的努力，而是提醒：只要權限、資源、親見與複核沒有一起到位，孩子雖離開原本的危險，仍可能在制度交界再次失去保護。</p></header>
        <div class="placement-failure-grid">
          <article><span>01｜分離前</span><b>家庭支持太晚，出養或安置先於支持</b><p>經濟、托育、心理、照顧喘息與親職支持若未先到位，制度可能把可改善的家庭困境過早轉化為親子分離。</p><small>檢驗：是否完整提供維持原生家庭的替代方案與書面紀錄。</small></article>
          <article><span>02｜法律門檻</span><b>同是離家照顧，審查與權利保障不一</b><p>委託安置、保護安置、出養前照顧與一般托育，法院角色、決定者、探視及複核程序不同；名稱差異可能遮住相同的生活風險。</p><small>檢驗：是否依「生活實質」啟動同等安全保障。</small></article>
          <article><span>03｜資源配置</span><b>家庭式與特殊需求量能不足，去處被可用資源牽引</b><p>當在地寄養、親屬支持、醫療型照顧與小規模家庭式資源不足，孩子的去處容易受可用床位與跨縣市量能限制，而非完全依個別需求決定。</p><small>檢驗：媒合理由、替代方案及跨轄原因是否公開可追溯。</small></article>
          <article><span>04｜灰色橋接</span><b>一般托育承接實質替代照顧，支持卻沒有同步升級</b><p>待出養或脆弱家庭幼童若由居家托育人員24小時照顧，生活實質已接近家外安置；訓練、喘息、共訪、醫療與危機退場不能仍停在一般托育等級。</p><small>檢驗：是否適用家外安置兒童的專門原則與加密訪視。</small></article>
          <article><span>05｜治理</span><b>兒籍地、安置地與民間機構分段，沒有單一安全責任人</b><p>家庭資訊、照顧現場、醫療、學校與機構督導各握一段；若沒有公部門主責彙整、召集與追蹤，異常會被切碎成互不相連的片段。</p><small>檢驗：每名孩子是否有可點名的主責、期限與回報閉環。</small></article>
          <article><span>06｜監督</span><b>訪視、評鑑與紀錄偏紙本，兒童缺少獨立求助出口</b><p>完成表格、達到次數或機構評鑑合格，不等於孩子能安全說出遭遇。訪視須能排除照顧者控制，並保護揭弊者、同儕與第一線人員免受報復。</p><small>檢驗：不預約親見、獨立訪談、申訴及外部調查是否可用。</small></article>
          <article><span>07｜返家</span><b>返家準備與追蹤不足，團聚可能成為下一個高風險轉折</b><p>返家不只是行政結案；家庭重整、漸進返家、外部審查、服務強度及一年追蹤若未分級，孩子可能在風險尚未下降時被送回。</p><small>檢驗：返家決策是否有跨專業證據與再通報升級標準。</small></article>
          <article><span>08｜永續與轉銜</span><b>短期安置拖成多年，特殊需求兒少被留在不適配場域</b><p>沒有及早決定安全返家、收養、監護或其他穩定關係，孩子會反覆移動或長期停留；身心障礙與高度醫療需求兒少更可能被安置在成人機構。</p><small>檢驗：每次複核是否重新評估發展、教育、語言與長期關係。</small></article>
        </div>
        <div class="placement-system-sources"><a href="https://www.mohw.gov.tw/cp-2704-78052-1.html" target="_blank" rel="noopener">衛福部剴剴案檢討與精進作為 ↗</a><a href="https://www.mohw.gov.tw/cp-16-82575-1.html" target="_blank" rel="noopener">居托分級與不預約訪視指引 ↗</a><a href="https://www.cy.gov.tw/News_Content.aspx?n=125&amp;s=24201" target="_blank" rel="noopener">監察院返家機制調查 ↗</a><a href="https://www.cy.gov.tw/News_Content.aspx?n=213&amp;s=32249" target="_blank" rel="noopener">特殊需求兒少安置調查 ↗</a></div>
      </section>'''

HANS_FAILURES = '''<section class="placement-failures" id="placement-failures" aria-labelledby="placementFailuresTitleHans">
        <header><small>WHEN PROTECTION BECOMES ANOTHER RISK</small><h4 id="placementFailuresTitleHans">八个制度缺陷，会让家外安置从保护措施变成新的风险场域</h4><p>这些缺陷不是在否定寄养家庭、亲属照顾或一线工作者的努力，而是提醒：只要权限、资源、亲见与复核没有一起到位，孩子虽离开原本的危险，仍可能在制度交界再次失去保护。</p></header>
        <div class="placement-failure-grid">
          <article><span>01｜分离前</span><b>家庭支持太晚，出养或安置先于支持</b><p>经济、托育、心理、照顾喘息与亲职支持若未先到位，制度可能把可改善的家庭困境过早转化为亲子分离。</p><small>检验：是否完整提供维持原生家庭的替代方案与书面纪录。</small></article>
          <article><span>02｜法律门槛</span><b>同是离家照顾，审查与权利保障不一</b><p>委托安置、保护安置、出养前照顾与一般托育，法院角色、决定者、探视及复核程序不同；名称差异可能遮住相同的生活风险。</p><small>检验：是否依“生活实质”启动同等安全保障。</small></article>
          <article><span>03｜资源配置</span><b>家庭式与特殊需求量能不足，去处被可用资源牵引</b><p>当在地寄养、亲属支持、医疗型照顾与小规模家庭式资源不足，孩子的去处容易受可用床位与跨县市量能限制，而非完全依个别需求决定。</p><small>检验：媒合理由、替代方案及跨辖原因是否公开可追溯。</small></article>
          <article><span>04｜灰色桥接</span><b>一般托育承接实质替代照顾，支持却没有同步升级</b><p>待出养或脆弱家庭幼童若由居家托育人员24小时照顾，生活实质已接近家外安置；训练、喘息、共访、医疗与危机退场不能仍停在一般托育等级。</p><small>检验：是否适用家外安置儿童的专门原则与加密访视。</small></article>
          <article><span>05｜治理</span><b>儿籍地、安置地与民间机构分段，没有单一安全责任人</b><p>家庭资讯、照顾现场、医疗、学校与机构督导各握一段；若没有公部门主责汇整、召集与追踪，异常会被切碎成互不相连的片段。</p><small>检验：每名孩子是否有可点名的主责、期限与回报闭环。</small></article>
          <article><span>06｜监督</span><b>访视、评鉴与纪录偏纸本，儿童缺少独立求助出口</b><p>完成表格、达到次数或机构评鉴合格，不等于孩子能安全说出遭遇。访视须能排除照顾者控制，并保护揭弊者、同伴与一线人员免受报复。</p><small>检验：不预约亲见、独立访谈、申诉及外部调查是否可用。</small></article>
          <article><span>07｜返家</span><b>返家准备与追踪不足，团聚可能成为下一个高风险转折</b><p>返家不只是行政结案；家庭重整、渐进返家、外部审查、服务强度及一年追踪若未分级，孩子可能在风险尚未下降时被送回。</p><small>检验：返家决策是否有跨专业证据与再通报升级标准。</small></article>
          <article><span>08｜永续与转衔</span><b>短期安置拖成多年，特殊需求儿少被留在不适配场域</b><p>没有及早决定安全返家、收养、监护或其他稳定关系，孩子会反复移动或长期停留；身心障碍与高度医疗需求儿少更可能被安置在成人机构。</p><small>检验：每次复核是否重新评估发展、教育、语言与长期关系。</small></article>
        </div>
        <div class="placement-system-sources"><a href="https://www.mohw.gov.tw/cp-2704-78052-1.html" target="_blank" rel="noopener">卫福部剀剀案检讨与精进作为 ↗</a><a href="https://www.mohw.gov.tw/cp-16-82575-1.html" target="_blank" rel="noopener">居托分级与不预约访视指引 ↗</a><a href="https://www.cy.gov.tw/News_Content.aspx?n=125&amp;s=24201" target="_blank" rel="noopener">监察院返家机制调查 ↗</a><a href="https://www.cy.gov.tw/News_Content.aspx?n=213&amp;s=32249" target="_blank" rel="noopener">特殊需求儿童安置调查 ↗</a></div>
      </section>'''

TRAD_CASES = '''<section class="placement-cases placement-harm-cases" id="placement-harm-cases" aria-labelledby="placementHarmCasesTitle">
        <header><small>REAL HARM INSIDE OR AFTER ALTERNATIVE CARE</small><h4 id="placementHarmCasesTitle">安置不是安全保證：三起具體傷害事件與一組系統性性暴力證據</h4><p>這些事件不代表每一個寄養家庭或安置機構都不安全；它們揭露的是不同失效模式——灰色安置、返家失準、機構監督失靈，以及兒少或揭弊者說出傷害後仍無法被接住。</p></header>
        <aside class="placement-case-rule"><b>尊重兒童，不獵奇呈現</b><p>本區只保留理解制度所必需的事實，不公開兒少姓名、影像或可識別細節；個案用來檢驗國家保護義務，不把受害經歷當成視覺消費。</p></aside>
        <div class="placement-harm-case-grid">
          <article class="placement-harm-card case-kaikai"><span>2023｜剴剴案</span><h5>待出養全日照顧期間死亡：名稱是托育，實質已是家外安置</h5><p>剴剴在出養前由兒盟合作保母提供24小時全日照顧，最終遭虐死亡。監察院調查指出，媒合機構、新北脆弱家庭服務、臺北居托監督及中央制度之間，未形成跨縣市親見、共訪與資訊閉環。</p><dl><div><dt>暴露的缺陷</dt><dd>一般托育承接替代照顧、主責分散、傷勢與醫療警訊未升級。</dd></div><div><dt>責任界線</dt><dd>直接行為人刑責已定讞；其他層級依行政調查、查核及個別司法程序分開。</dd></div></dl><a href="https://cybsbox.cy.gov.tw/CYBSBoxSSL/edoc/download/76497" target="_blank" rel="noopener">監察院調查報告 ↗</a></article>
          <article class="placement-harm-card case-return"><span>高雄｜返家後再受虐</span><h5>2歲返家不到一年再遭嚴重虐待，被迫再次安置</h5><p>監察院調查一名出生不久即由父母委託安置於寄養家庭的女童；2歲返家後不到一年，再因父母嚴重虐待而重新安置。案件顯示返家準備、家庭支持、外部審查與返家後追蹤不足。</p><dl><div><dt>暴露的缺陷</dt><dd>返家被當成終點，而非一段需要加密支持與分級監測的高風險轉換。</dd></div><div><dt>制度數據</dt><dd>該調查同時指出，返家後一年內仍有一定比例再通報或再列保護個案。</dd></div></dl><a href="https://www.cy.gov.tw/News_Content.aspx?n=125&amp;s=24201" target="_blank" rel="noopener">監察院返家機制調查 ↗</a></article>
          <article class="placement-harm-card case-institution"><span>花蓮｜禪光育幼院</span><h5>不當「輪椅體驗」、求助無門與長期監督失靈</h5><p>監察院糾正案指出，花蓮縣政府未妥善調查育幼院對院生的不當對待，工作人員欠缺專業敏感度並誤判輕縱，亦未掌握性平事件、院長資格、人力吃緊與長期專業知能不足等問題。</p><dl><div><dt>暴露的缺陷</dt><dd>地方監督依賴機構說法、調查不獨立、評鑑與公文往返未轉化為保護。</dd></div><div><dt>官方狀態</dt><dd>監察院114社正0010糾正花蓮縣政府，案件已結案並附改善資料。</dd></div></dl><a href="https://www.cy.gov.tw/CyBsBoxContent.aspx?n=133&amp;s=49298" target="_blank" rel="noopener">監察院糾正案文 ↗</a></article>
          <article class="placement-harm-card case-sexual-violence"><span>國家人權委員會｜系統性訪查</span><h5>多起安置機構兒少性侵害：隱匿、未通報與揭弊者保護不足</h5><p>人權會整理多起或集體兒少性侵事件，指出部分機構曾有多年隱匿未通報、毀損證據或調查不積極。政策建議要求調查獨立、避免二度傷害、支持機構員工，並補強揭弊者保護。</p><dl><div><dt>暴露的缺陷</dt><dd>兒少表意與身體自主不足，權力封閉環境欠缺可信賴的外部申訴與調查。</dd></div><div><dt>呈現界線</dt><dd>本站不重述可識別受害細節，聚焦系統如何預防、辨認、處理與舉報。</dd></div></dl><a href="https://nhrc.cy.gov.tw/News_Content.aspx?n=7460&amp;s=2171&amp;sms=12390" target="_blank" rel="noopener">國家人權委員會專案報告 ↗</a></article>
        </div>
        <section class="placement-data-panel" aria-labelledby="placementDataTitle">
          <header><small>OFFICIAL DATA SNAPSHOTS</small><h5 id="placementDataTitle">個案背後的制度數字：長期安置、返家再風險與不適配場域</h5><p>不同年份、不同母體不能直接相加；以下均保留原始調查時間標籤，避免把歷史快照冒充現況。</p></header>
          <div class="placement-data-groups">
            <article><h6>監察院2022年返家機制調查｜資料截至2021年底</h6><div class="placement-data-grid"><div><strong>逾5成</strong><span>地方社政家外安置超過2年</span></div><div><strong>逾3成</strong><span>為學齡前兒童</span></div><div><strong>7.7%–10%</strong><span>近3年返家後1年內再被通報</span></div><div><strong>5.4%–6.4%</strong><span>返家後1年內再列保護個案</span></div></div><a href="https://www.cy.gov.tw/News_Content.aspx?n=125&amp;s=24201" target="_blank" rel="noopener">查看原始調查 ↗</a></article>
            <article><h6>監察院2024年特殊需求兒少調查｜112年資料</h6><div class="placement-data-grid"><div><strong>176人</strong><span>特殊需求兒少安置於成人機構</span></div><div><strong>約4成</strong><span>安置達5年以上</span></div><div><strong>45%</strong><span>未滿12歲</span></div><div><strong>約1/3</strong><span>沒有口語能力</span></div></div><a href="https://www.cy.gov.tw/News_Content.aspx?n=213&amp;s=32249" target="_blank" rel="noopener">查看原始調查 ↗</a></article>
          </div>
        </section>
      </section>'''

HANS_CASES = '''<section class="placement-cases placement-harm-cases" id="placement-harm-cases" aria-labelledby="placementHarmCasesTitleHans">
        <header><small>REAL HARM INSIDE OR AFTER ALTERNATIVE CARE</small><h4 id="placementHarmCasesTitleHans">安置不是安全保证：三起具体伤害事件与一组系统性性暴力证据</h4><p>这些事件不代表每一个寄养家庭或安置机构都不安全；它们揭露的是不同失效模式——灰色安置、返家失准、机构监督失灵，以及儿童或揭弊者说出伤害后仍无法被接住。</p></header>
        <aside class="placement-case-rule"><b>尊重儿童，不猎奇呈现</b><p>本区只保留理解制度所必需的事实，不公开儿童姓名、影像或可识别细节；个案用来检验国家保护义务，不把受害经历当成视觉消费。</p></aside>
        <div class="placement-harm-case-grid">
          <article class="placement-harm-card case-kaikai"><span>2023｜剀剀案</span><h5>待出养全日照顾期间死亡：名称是托育，实质已是家外安置</h5><p>剀剀在出养前由儿盟合作保母提供24小时全日照顾，最终遭虐死亡。监察院调查指出，媒合机构、新北脆弱家庭服务、台北居托监督及中央制度之间，未形成跨县市亲见、共访与资讯闭环。</p><dl><div><dt>暴露的缺陷</dt><dd>一般托育承接替代照顾、主责分散、伤势与医疗警讯未升级。</dd></div><div><dt>责任界线</dt><dd>直接行为人刑责已确定；其他层级依行政调查、查核及个别司法程序分开。</dd></div></dl><a href="https://cybsbox.cy.gov.tw/CYBSBoxSSL/edoc/download/76497" target="_blank" rel="noopener">监察院调查报告 ↗</a></article>
          <article class="placement-harm-card case-return"><span>高雄｜返家后再受虐</span><h5>2岁返家不到一年再遭严重虐待，被迫再次安置</h5><p>监察院调查一名出生不久即由父母委托安置于寄养家庭的女童；2岁返家后不到一年，再因父母严重虐待而重新安置。案件显示返家准备、家庭支持、外部审查与返家后追踪不足。</p><dl><div><dt>暴露的缺陷</dt><dd>返家被当成终点，而非一段需要加密支持与分级监测的高风险转换。</dd></div><div><dt>制度数据</dt><dd>该调查同时指出，返家后一年内仍有一定比例再次通报或再列保护个案。</dd></div></dl><a href="https://www.cy.gov.tw/News_Content.aspx?n=125&amp;s=24201" target="_blank" rel="noopener">监察院返家机制调查 ↗</a></article>
          <article class="placement-harm-card case-institution"><span>花莲｜禅光育幼院</span><h5>不当“轮椅体验”、求助无门与长期监督失灵</h5><p>监察院纠正案指出，花莲县政府未妥善调查育幼院对院生的不当对待，工作人员欠缺专业敏感度并误判轻纵，也未掌握性别平等事件、院长资格、人力吃紧与长期专业知能不足等问题。</p><dl><div><dt>暴露的缺陷</dt><dd>地方监督依赖机构说法、调查不独立、评鉴与公文往返未转化为保护。</dd></div><div><dt>官方状态</dt><dd>监察院114社正0010纠正花莲县政府，案件已结案并附改善资料。</dd></div></dl><a href="https://www.cy.gov.tw/CyBsBoxContent.aspx?n=133&amp;s=49298" target="_blank" rel="noopener">监察院纠正案文 ↗</a></article>
          <article class="placement-harm-card case-sexual-violence"><span>国家人权委员会｜系统性访查</span><h5>多起安置机构儿童性侵害：隐匿、未通报与揭弊者保护不足</h5><p>人权会整理多起或集体儿童性侵事件，指出部分机构曾有多年隐匿未通报、毁损证据或调查不积极。政策建议要求调查独立、避免二度伤害、支持机构员工，并补强揭弊者保护。</p><dl><div><dt>暴露的缺陷</dt><dd>儿童表达与身体自主不足，权力封闭环境欠缺可信赖的外部申诉与调查。</dd></div><div><dt>呈现界线</dt><dd>本站不重述可识别受害细节，聚焦系统如何预防、辨认、处理与举报。</dd></div></dl><a href="https://nhrc.cy.gov.tw/News_Content.aspx?n=7460&amp;s=2171&amp;sms=12390" target="_blank" rel="noopener">国家人权委员会专案报告 ↗</a></article>
        </div>
        <section class="placement-data-panel" aria-labelledby="placementDataTitleHans">
          <header><small>OFFICIAL DATA SNAPSHOTS</small><h5 id="placementDataTitleHans">个案背后的制度数字：长期安置、返家再风险与不适配场域</h5><p>不同年份、不同母体不能直接相加；以下均保留原始调查时间标签，避免把历史快照冒充现况。</p></header>
          <div class="placement-data-groups">
            <article><h6>监察院2022年返家机制调查｜资料截至2021年底</h6><div class="placement-data-grid"><div><strong>逾5成</strong><span>地方社政家外安置超过2年</span></div><div><strong>逾3成</strong><span>为学龄前儿童</span></div><div><strong>7.7%–10%</strong><span>近3年返家后1年内再次通报</span></div><div><strong>5.4%–6.4%</strong><span>返家后1年内再列保护个案</span></div></div><a href="https://www.cy.gov.tw/News_Content.aspx?n=125&amp;s=24201" target="_blank" rel="noopener">查看原始调查 ↗</a></article>
            <article><h6>监察院2024年特殊需求儿童调查｜112年资料</h6><div class="placement-data-grid"><div><strong>176人</strong><span>特殊需求儿童安置于成人机构</span></div><div><strong>约4成</strong><span>安置达5年以上</span></div><div><strong>45%</strong><span>未满12岁</span></div><div><strong>约1/3</strong><span>没有口语能力</span></div></div><a href="https://www.cy.gov.tw/News_Content.aspx?n=213&amp;s=32249" target="_blank" rel="noopener">查看原始调查 ↗</a></article>
          </div>
        </section>
      </section>'''

TRAD_BOUNDARY = '''<footer class="placement-boundary"><b>判讀界線</b><p>上述事件與數據證明的是制度曾在不同環節造成真實傷害，不等於所有寄養家庭、親屬照顧或安置機構都不安全。問責應同時檢驗國家資源、法定權限、機構治理與個案執行，不能只責怪單一第一線、原生家庭或受害兒童，也不能以「已離家」推定風險自然消失。</p></footer>'''
HANS_BOUNDARY = '''<footer class="placement-boundary"><b>判读界线</b><p>上述事件与数据证明的是制度曾在不同环节造成真实伤害，不等于所有寄养家庭、亲属照顾或安置机构都不安全。问责应同时检验国家资源、法定权限、机构治理与个案执行，不能只责怪单一一线人员、原生家庭或受害儿童，也不能以“已离家”推定风险自然消失。</p></footer>'''

CONFIGS = [
    {
        'path': ROOT / 'index.html',
        'state': TRAD_STATE_DUTY,
        'failures': TRAD_FAILURES,
        'cases': TRAD_CASES,
        'boundary': TRAD_BOUNDARY,
        'nav_old': '<a href="#placement-spectrum">家外安置</a>',
        'nav_new': '<a href="#placement-spectrum">家外安置制度</a><a href="#placement-harm-cases">實際傷害案例</a>',
        'required': ['八個制度缺陷', '安置不是安全保證', '花蓮｜禪光育幼院', '176人', '7.7%–10%'],
    },
    {
        'path': ROOT / 'zh-Hans' / 'index.html',
        'state': HANS_STATE_DUTY,
        'failures': HANS_FAILURES,
        'cases': HANS_CASES,
        'boundary': HANS_BOUNDARY,
        'nav_old': '<a href="#placement-spectrum">家外安置</a>',
        'nav_new': '<a href="#placement-spectrum">家外安置制度</a><a href="#placement-harm-cases">实际伤害案例</a>',
        'required': ['八个制度缺陷', '安置不是安全保证', '花莲｜禅光育幼院', '176人', '7.7%–10%'],
    },
]

versions: list[int] = []
for config in CONFIGS:
    path = config['path']
    text = path.read_text(encoding='utf-8')
    version_match = re.search(r'final-chapter\.css\?v=20260829-(\d+)', text)
    if not version_match:
        raise SystemExit(f'{path}: CSS version not found')
    versions.append(int(version_match.group(1)))

next_version = max(max(versions) + 1, 30)

for config in CONFIGS:
    path = config['path']
    text = path.read_text(encoding='utf-8')
    text = re.sub(r'final-chapter\.css\?v=20260829-\d+', f'final-chapter.css?v=20260829-{next_version}', text, count=1)

    if config['nav_new'] not in text:
        text = replace_once(text, config['nav_old'], config['nav_new'], f'{path} placement navigation')

    if HTML_MARKER not in text:
        rule_start, rule_end, _ = find_balanced(
            text,
            r'<aside\b[^>]*\bclass="[^"]*placement-rule[^"]*"[^>]*>',
            'aside',
            f'{path} placement rule',
        )
        text = text[:rule_end] + '\n' + config['state'] + text[rule_end:]

    failure_start, failure_end, _ = find_balanced(
        text,
        r'<section\b[^>]*\bclass="[^"]*placement-grey[^"]*"[^>]*>',
        'section',
        f'{path} old placement grey section',
    )
    text = text[:failure_start] + config['failures'] + text[failure_end:]

    cases_start, cases_end, _ = find_balanced(
        text,
        r'<section\b[^>]*\bclass="[^"]*placement-cases[^"]*"[^>]*>',
        'section',
        f'{path} old placement cases section',
    )
    text = text[:cases_start] + config['cases'] + text[cases_end:]

    boundary_start, boundary_end, _ = find_balanced(
        text,
        r'<footer\b[^>]*\bclass="[^"]*placement-boundary[^"]*"[^>]*>',
        'footer',
        f'{path} placement boundary',
    )
    text = text[:boundary_start] + config['boundary'] + text[boundary_end:]

    for section_id in ['placement-spectrum', 'placement-state-duty', 'placement-failures', 'placement-harm-cases']:
        if text.count(f'id="{section_id}"') != 1:
            raise SystemExit(f'{path}: #{section_id} count is not one')
    if text.count('class="placement-failure-grid"') != 1 or text.count('class="placement-harm-case-grid"') != 1:
        raise SystemExit(f'{path}: new placement grids missing or duplicated')
    if text.count('class="placement-harm-card') != 4:
        raise SystemExit(f'{path}: expected four harm cards')
    if text.count('class="placement-data-grid"') != 2:
        raise SystemExit(f'{path}: expected two official data grids')
    for phrase in config['required']:
        if phrase not in text:
            raise SystemExit(f'{path}: missing required phrase {phrase}')
    path.write_text('\n'.join(line.rstrip() for line in text.splitlines()) + '\n', encoding='utf-8')

css_path = ROOT / 'final-chapter.css'
css = css_path.read_text(encoding='utf-8')
if CSS_MARKER not in css:
    css += r'''

/* OUT-OF-HOME-CARE-FAILURES-20260829 */
.placement-state-duty{display:grid;grid-template-columns:minmax(240px,.65fr) minmax(0,1.35fr);gap:22px;align-items:start;margin:18px 0;padding:24px 27px;background:linear-gradient(145deg,#173d4e,#0a2d40);color:#fff;border-left:8px solid var(--gold);box-shadow:0 14px 34px rgba(7,35,48,.18)}.placement-state-duty>div small{color:#efc77d;font-size:9px;font-weight:950;letter-spacing:.13em}.placement-state-duty h4{margin:5px 0 0;color:#fff;font:900 clamp(23px,3vw,35px)/1.36 var(--serif)}.placement-state-duty>p{margin:0;color:#d3e0dc;font-size:12px;line-height:1.82}.placement-state-duty ul{grid-column:1/-1;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin:0;padding:0;list-style:none}.placement-state-duty li{position:relative;padding:11px 12px 11px 35px;background:rgba(255,255,255,.08);color:#f5f0e5;font-size:10px;font-weight:850;line-height:1.58}.placement-state-duty li:before{position:absolute;top:10px;left:11px;display:grid;place-items:center;width:17px;height:17px;border-radius:50%;background:var(--gold);color:var(--navy);font-size:10px;font-weight:950;content:'✓'}
.placement-failures{scroll-margin-top:90px;margin-top:19px;padding:clamp(22px,3vw,32px);background:radial-gradient(circle at 8% 4%,rgba(210,160,82,.17),transparent 27%),linear-gradient(145deg,#082b3e,#123f4d);color:#fff}.placement-failures>header,.placement-harm-cases>header{max-width:920px;margin:0 auto 23px;text-align:center}.placement-failures>header small,.placement-harm-cases>header small{color:#efc77d;font-size:9px;font-weight:950;letter-spacing:.14em}.placement-failures>header h4,.placement-harm-cases>header h4{margin:6px 0 9px;color:#fff;font:900 clamp(25px,3.4vw,39px)/1.34 var(--serif)}.placement-failures>header p,.placement-harm-cases>header p{margin:0;color:#cedbd7;font-size:12px;line-height:1.8}.placement-failure-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}.placement-failure-grid article{display:flex;min-width:0;min-height:260px;flex-direction:column;padding:18px 16px;background:#fffaf0;color:var(--text);border-top:6px solid var(--red);box-shadow:0 9px 22px rgba(0,0,0,.12)}.placement-failure-grid article:nth-child(2n){border-top-color:var(--gold)}.placement-failure-grid article:nth-child(3n){border-top-color:var(--teal)}.placement-failure-grid span{color:var(--red-dark);font-size:8px;font-weight:950;letter-spacing:.065em}.placement-failure-grid b{display:block;margin:7px 0;color:var(--ink);font:900 16px/1.45 var(--serif)}.placement-failure-grid p{margin:0;color:#53615e;font-size:10px;line-height:1.68}.placement-failure-grid small{display:block;margin-top:auto;padding-top:10px;border-top:1px dashed #d8c7a6;color:#765128;font-size:8px;font-weight:850;line-height:1.55}.placement-system-sources{display:flex;flex-wrap:wrap;justify-content:center;gap:7px;margin-top:17px}.placement-system-sources a{display:inline-flex;min-height:32px;align-items:center;padding:5px 9px;border:1px solid rgba(255,255,255,.38);border-radius:999px;color:#f1d08f;text-decoration:none;font-size:9px;font-weight:900}.placement-system-sources a:hover,.placement-system-sources a:focus-visible{background:#fff;color:var(--navy);outline:2px solid var(--gold);outline-offset:2px}
.placement-harm-cases{scroll-margin-top:90px;background:linear-gradient(145deg,#e7d8b8,#f5ecdb);color:var(--text)}.placement-harm-cases>header small{color:var(--red)}.placement-harm-cases>header h4{color:var(--ink)}.placement-harm-cases>header p{color:#53615e}.placement-case-rule{display:grid;grid-template-columns:190px 1fr;gap:18px;align-items:center;margin-bottom:15px;padding:15px 18px;background:#173d4e;color:#fff;border-left:7px solid var(--gold)}.placement-case-rule b{color:#f0ca84;font:900 16px/1.42 var(--serif)}.placement-case-rule p{margin:0;color:#d2ded9;font-size:10px;line-height:1.7}.placement-harm-case-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:13px}.placement-harm-card{display:flex;min-width:0;min-height:470px;flex-direction:column;padding:22px 20px;background:#fffdf7;border:1px solid rgba(72,77,63,.16);border-top:7px solid var(--red);box-shadow:0 11px 27px rgba(35,42,39,.11)}.placement-harm-card.case-return{border-top-color:var(--gold)}.placement-harm-card.case-institution{border-top-color:#6e5579}.placement-harm-card.case-sexual-violence{border-top-color:var(--teal)}.placement-harm-card>span{color:var(--red-dark);font-size:9px;font-weight:950;letter-spacing:.06em}.placement-harm-card h5{margin:7px 0 10px;color:var(--ink);font:900 21px/1.43 var(--serif)}.placement-harm-card>p{margin:0;color:#53615e;font-size:11px;line-height:1.76}.placement-harm-card dl{display:grid;gap:7px;margin:15px 0}.placement-harm-card dl div{display:grid;grid-template-columns:95px 1fr;gap:9px;padding:10px 11px;background:#f1e5ce}.placement-harm-card dt{color:var(--red-dark);font-size:9px;font-weight:950}.placement-harm-card dd{margin:0;color:#53615e;font-size:9px;line-height:1.62}.placement-harm-card>a{align-self:flex-start;margin-top:auto;padding:6px 10px;border-radius:999px;background:var(--navy);color:#fff;text-decoration:none;font-size:9px;font-weight:900}.placement-harm-card>a:hover,.placement-harm-card>a:focus-visible{background:var(--red);outline:2px solid var(--gold);outline-offset:2px}
.placement-data-panel{margin-top:18px;padding:22px;background:#fffaf0;border:1px solid #d2bd92}.placement-data-panel>header{max-width:850px;margin:0 auto 18px;text-align:center}.placement-data-panel>header small{color:var(--red);font-size:9px;font-weight:950;letter-spacing:.13em}.placement-data-panel>header h5{margin:5px 0 7px;color:var(--ink);font:900 clamp(22px,2.8vw,32px)/1.4 var(--serif)}.placement-data-panel>header p{margin:0;color:#596866;font-size:10px;line-height:1.68}.placement-data-groups{display:grid;grid-template-columns:1fr 1fr;gap:12px}.placement-data-groups>article{padding:17px;background:#173d4e;color:#fff}.placement-data-groups h6{margin:0 0 11px;color:#f0ca84;font:900 14px/1.45 var(--serif)}.placement-data-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px}.placement-data-grid div{min-width:0;padding:12px 10px;background:rgba(255,255,255,.08)}.placement-data-grid strong{display:block;color:#fff;font:900 clamp(22px,2.7vw,34px)/1.1 var(--serif)}.placement-data-grid span{display:block;margin-top:5px;color:#ccdad5;font-size:8px;line-height:1.55}.placement-data-groups>article>a{display:inline-flex;margin-top:11px;color:#f0ca84;font-size:9px;font-weight:900;text-decoration:none}.placement-data-groups>article>a:hover,.placement-data-groups>article>a:focus-visible{text-decoration:underline;text-underline-offset:3px}.placement-harm-cases+.placement-boundary{border-left-color:var(--red)}
@media(max-width:1100px){.placement-state-duty ul{grid-template-columns:repeat(2,minmax(0,1fr))}.placement-failure-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.placement-harm-card{min-height:0}}
@media(max-width:720px){.placement-state-duty,.placement-case-rule{grid-template-columns:1fr}.placement-state-duty{padding:20px 16px}.placement-state-duty ul,.placement-failure-grid,.placement-harm-case-grid,.placement-data-groups,.placement-data-grid{grid-template-columns:1fr}.placement-failures,.placement-harm-cases{padding:21px 14px}.placement-failure-grid article{min-height:0}.placement-harm-card{padding:19px 16px}.placement-harm-card dl div{grid-template-columns:1fr;gap:3px}.placement-data-panel{padding:18px 12px}}
@media print{.placement-state-duty,.placement-failures,.placement-data-groups>article{background:#fff!important;color:#111!important;box-shadow:none}.placement-state-duty h4,.placement-failures>header h4,.placement-failures>header p,.placement-data-groups h6,.placement-data-grid strong,.placement-data-grid span{color:#111!important}.placement-failure-grid,.placement-harm-case-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.placement-harm-card,.placement-data-panel{break-inside:avoid}}
'''

if css.count(CSS_MARKER) != 1:
    raise SystemExit(f'CSS marker count is {css.count(CSS_MARKER)}')
css_path.write_text('\n'.join(line.rstrip() for line in css.splitlines()) + '\n', encoding='utf-8')

print(f'Expanded out-of-home care section and bumped CSS to 20260829-{next_version}.')
