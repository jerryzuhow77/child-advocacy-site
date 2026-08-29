from __future__ import annotations

import re
from pathlib import Path

ROOT = Path('hearing-records/prison-watch/kaikai-final-chapter')
HTML_MARKER = '<!-- READER-OPTIMIZATIONS-20260829 -->'
CSS_MARKER = '/* READER-OPTIMIZATIONS-20260829 */'
JS_MARKER = '// READER-OPTIMIZATIONS-20260829'


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise SystemExit(f'{label}: expected exactly one match, found {count}')
    return text.replace(old, new, 1)


def replace_regex_once(text: str, pattern: str, replacement: str, label: str) -> str:
    updated, count = re.subn(pattern, replacement, text, count=1, flags=re.S)
    if count != 1:
        raise SystemExit(f'{label}: expected exactly one regex match, found {count}')
    return updated


def set_section_attributes(text: str, section_id: str, reading_level: str | None, heavy: bool) -> str:
    pattern = re.compile(rf'<section\b(?P<attrs>[^>]*\bid="{re.escape(section_id)}"[^>]*)>', re.S)
    match = pattern.search(text)
    if not match:
        return text
    attrs = match.group('attrs')
    attrs = re.sub(r'\sdata-reading-level="[^"]*"', '', attrs)
    attrs = re.sub(r'\sdata-heavy="[^"]*"', '', attrs)
    if reading_level:
        attrs += f' data-reading-level="{reading_level}"'
    if heavy:
        attrs += ' data-heavy="true"'
    return text[:match.start()] + f'<section{attrs}>' + text[match.end():]


TRAD_LOOP = '''<!-- READER-OPTIMIZATIONS-20260829 -->
        <section class="medical-alert-loop" aria-labelledby="medicalLoopTitle">
          <header><small>CLOSED-LOOP CHECK</small><h5 id="medicalLoopTitle">醫療警訊閉環圖｜看見之後，還要完成七個動作</h5><p>下列節點把「當時看見什麼、誰掌握、應做什麼、公開資料目前看見什麼」放在同一條線上。紅色中斷線表示公開資料尚未呈現已完成的閉環，不等同認定某一人必然違法。</p></header>
          <ol>
            <li class="loop-record"><time datetime="2023-11-07">11.07</time><b>第一次兒科接觸</b><dl><div><dt>看見</dt><dd>體溫偏高、口鼻膿痂疹</dd></div><div><dt>掌握</dt><dd>照顧者與看診醫師</dd></div><div><dt>應做</dt><dd>病歷化、評估是否與年齡及病史相符</dd></div><div><dt>公開資料</dt><dd>記載拿藥；診所名稱待核實</dd></div></dl></li>
            <li class="loop-record"><time datetime="2023-11-09">11.09</time><b>再次兒科就醫</b><dl><div><dt>看見</dt><dd>短期內再次看診</dd></div><div><dt>掌握</dt><dd>照顧者與兒科端</dd></div><div><dt>應做</dt><dd>比對前次症狀、成長與反覆就醫</dd></div><div><dt>公開資料</dt><dd>僅見再診節點，未見完整病歷</dd></div></dl></li>
            <li class="loop-official"><time datetime="2023-11-23">11.23</time><b>牙科明顯異常</b><dl><div><dt>看見</dt><dd>3顆乳牙脫落、大塊口腔潰瘍</dd></div><div><dt>掌握</dt><dd>牙醫、照顧者</dd></div><div><dt>應做</dt><dd>辨識外力風險、依法通報並轉完整評估</dd></div><div><dt>監察院</dt><dd>認定錯失辨識與通報時機</dd></div></dl></li>
            <li class="loop-break"><time>轉診</time><b>確認大醫院評估</b><dl><div><dt>應做</dt><dd>取得轉診單、完成日期與診療結果</dd></div><div><dt>閉環</dt><dd>不是只「建議去」，而是確認真的去了</dd></div><div><dt>公開資料</dt><dd>未見轉診完成的可回查紀錄</dd></div></dl></li>
            <li class="loop-break"><time>社福</time><b>把醫療結果帶回風險圖</b><dl><div><dt>應做</dt><dd>核實診所說法、病歷與照顧者解釋</dd></div><div><dt>比對</dt><dd>照片、體重、訪視、前保母與其他警訊</dd></div><div><dt>公開資料</dt><dd>未見完成跨次、跨來源勾稽</dd></div></dl></li>
            <li class="loop-break"><time>通報</time><b>啟動法定保護程序</b><dl><div><dt>門檻</dt><dd>知悉或合理懷疑受虐，不必等到確診</dd></div><div><dt>應做</dt><dd>責任通報、兒保醫療或跨網絡共訪</dd></div><div><dt>公開資料</dt><dd>未見本警訊形成正式通報</dd></div></dl></li>
            <li class="loop-goal"><time>閉環</time><b>孩子安全被重新確認</b><dl><div><dt>完成條件</dt><dd>醫療、社福、照顧現場相互驗證</dd></div><div><dt>保護結果</dt><dd>風險升級、增加訪視或立即移離危險</dd></div><div><dt>核心</dt><dd>每一步都有負責人、期限與可追溯紀錄</dd></div></dl></li>
          </ol>
        </section>'''

HANS_LOOP = '''<!-- READER-OPTIMIZATIONS-20260829 -->
        <section class="medical-alert-loop" aria-labelledby="medicalLoopTitle">
          <header><small>CLOSED-LOOP CHECK</small><h5 id="medicalLoopTitle">医疗警讯闭环图｜看见之后，还要完成七个动作</h5><p>下列节点把“当时看见什么、谁掌握、应做什么、公开资料目前看见什么”放在同一条线上。红色中断线表示公开资料尚未呈现已完成的闭环，不等同认定某一人必然违法。</p></header>
          <ol>
            <li class="loop-record"><time datetime="2023-11-07">11.07</time><b>第一次儿科接触</b><dl><div><dt>看见</dt><dd>体温偏高、口鼻脓痂疹</dd></div><div><dt>掌握</dt><dd>照顾者与看诊医师</dd></div><div><dt>应做</dt><dd>病历化、评估是否与年龄及病史相符</dd></div><div><dt>公开资料</dt><dd>记载拿药；诊所名称待核实</dd></div></dl></li>
            <li class="loop-record"><time datetime="2023-11-09">11.09</time><b>再次儿科就医</b><dl><div><dt>看见</dt><dd>短期内再次看诊</dd></div><div><dt>掌握</dt><dd>照顾者与儿科端</dd></div><div><dt>应做</dt><dd>比对前次症状、成长与反复就医</dd></div><div><dt>公开资料</dt><dd>仅见再诊节点，未见完整病历</dd></div></dl></li>
            <li class="loop-official"><time datetime="2023-11-23">11.23</time><b>牙科明显异常</b><dl><div><dt>看见</dt><dd>3颗乳牙脱落、大块口腔溃疡</dd></div><div><dt>掌握</dt><dd>牙医、照顾者</dd></div><div><dt>应做</dt><dd>辨识外力风险、依法通报并转完整评估</dd></div><div><dt>监察院</dt><dd>认定错失辨识与通报时机</dd></div></dl></li>
            <li class="loop-break"><time>转诊</time><b>确认大医院评估</b><dl><div><dt>应做</dt><dd>取得转诊单、完成日期与诊疗结果</dd></div><div><dt>闭环</dt><dd>不是只“建议去”，而是确认真的去了</dd></div><div><dt>公开资料</dt><dd>未见转诊完成的可回查纪录</dd></div></dl></li>
            <li class="loop-break"><time>社福</time><b>把医疗结果带回风险图</b><dl><div><dt>应做</dt><dd>核实诊所说法、病历与照顾者解释</dd></div><div><dt>比对</dt><dd>照片、体重、访视、前保母与其他警讯</dd></div><div><dt>公开资料</dt><dd>未见完成跨次、跨来源勾稽</dd></div></dl></li>
            <li class="loop-break"><time>通报</time><b>启动法定保护程序</b><dl><div><dt>门槛</dt><dd>知悉或合理怀疑受虐，不必等到确诊</dd></div><div><dt>应做</dt><dd>责任通报、儿保医疗或跨网络共访</dd></div><div><dt>公开资料</dt><dd>未见本警讯形成正式通报</dd></div></dl></li>
            <li class="loop-goal"><time>闭环</time><b>孩子安全被重新确认</b><dl><div><dt>完成条件</dt><dd>医疗、社福、照顾现场相互验证</dd></div><div><dt>保护结果</dt><dd>风险升级、增加访视或立即移离危险</dd></div><div><dt>核心</dt><dd>每一步都有负责人、期限与可追溯纪录</dd></div></dl></li>
          </ol>
        </section>'''

TRAD_ROUTE = '''<aside class="brief-route reveal" aria-labelledby="briefRouteTitle"><b id="briefRouteTitle">三條閱讀路線</b><div class="brief-route-grid"><a class="reading-route-card route-quick" href="#chapter-brief" data-reading-route="quick"><strong>5分鐘｜只看法院與監察院認定</strong><span>核心結論、行政認定、證據界線與改革檢驗。</span></a><a class="reading-route-card route-guided" href="#medical-network-omissions" data-reading-route="guided"><strong>15分鐘｜看人物、機構與醫療警訊</strong><span>加入照顧路徑、證詞、醫療閉環與115天責任圖。</span></a><a class="reading-route-card route-full" href="#sources" data-reading-route="full"><strong>完整閱讀｜展開全部卷證導讀</strong><span>顯示DAY1—10、宮廟／睡眠爭點與完整來源索引。</span></a></div></aside>'''
HANS_ROUTE = '''<aside class="brief-route reveal" aria-labelledby="briefRouteTitle"><b id="briefRouteTitle">三条阅读路线</b><div class="brief-route-grid"><a class="reading-route-card route-quick" href="#chapter-brief" data-reading-route="quick"><strong>5分钟｜只看法院与监察院认定</strong><span>核心结论、行政认定、证据界线与改革检验。</span></a><a class="reading-route-card route-guided" href="#medical-network-omissions" data-reading-route="guided"><strong>15分钟｜看人物、机构与医疗警讯</strong><span>加入照顾路径、证词、医疗闭环与115天责任图。</span></a><a class="reading-route-card route-full" href="#sources" data-reading-route="full"><strong>完整阅读｜展开全部卷证导读</strong><span>显示DAY1—10、宫庙／睡眠争点与完整来源索引。</span></a></div></aside>'''

TRAD_CONFIG = {
    'path': ROOT / 'index.html', 'loop': TRAD_LOOP, 'route': TRAD_ROUTE,
    'audio_collapse': '收合配樂控制器',
    'guided_old': '<b>30分鐘</b><span>主線、證詞與責任</span>',
    'guided_new': '<b>15分鐘</b><span>人物、機構與醫療警訊</span>',
    'status_old': '三十分鐘模式：顯示三層證據狀態、四階段形成圖與十項跨日勾稽。',
    'status_new': '十五分鐘模式：顯示人物、機構、醫療警訊與責任閉環。',
    'takeaways': [
        ('<h5>興隆內科小兒科診所（名稱待核實）</h5>', '<h5>興隆內科小兒科診所（名稱待核實）</h5><p class="medical-card-takeaway"><b>一句結論</b>確有兩次兒科就醫節點，但公開資料尚不足以核實診所名稱，也不能直接認定個別違失。</p>'),
        ('<h5>牙醫診所：3顆乳牙脫落與大塊口腔潰瘍</h5>', '<h5>牙醫診所：3顆乳牙脫落與大塊口腔潰瘍</h5><p class="medical-card-takeaway"><b>一句結論</b>掉牙與口腔潰瘍已構成明顯異常；監察院認定醫療端錯失辨識與通報時機。</p>'),
        ('<h5>基層診所是第一線，但資訊沒有自動進入兒保系統</h5>', '<h5>基層診所是第一線，但資訊沒有自動進入兒保系統</h5><p class="medical-card-takeaway"><b>一句結論</b>單次看診若未被帶入跨次、跨專業風險圖，就不會自動形成安全閉環。</p>'),
    ],
    'drawers': [
        ('<div class="source-chips"><a href="https://judgment.judicial.gov.tw/FJUD/data.aspx?ty=JD&amp;id=TPDM%2c114%2c%e8%a8%b4%2c51%2c20260416%2c2&amp;ot=in" target="_blank" rel="noopener">一審判決全文 ↗</a><a href="https://www.children.org.tw/news/news_detail/kaikai-case-timeline" target="_blank" rel="noopener">兒盟公開時間軸｜機構來源 ↗</a></div>', '<details class="evidence-source-drawer"><summary>查看證據、直接性與限制</summary><div class="source-drawer-body"><dl><div><dt>來源性質</dt><dd>法院裁判全文、機構公開時間軸</dd></div><div><dt>可直接支持</dt><dd>11月7日與11月9日曾有兒科就醫節點</dd></div><div><dt>不能直接支持</dt><dd>公開來源未揭露診所名稱，亦非監察院個別違失認定</dd></div><div><dt>最後核對</dt><dd>2026.08.29</dd></div></dl><div class="source-chips"><a href="https://judgment.judicial.gov.tw/FJUD/data.aspx?ty=JD&amp;id=TPDM%2c114%2c%e8%a8%b4%2c51%2c20260416%2c2&amp;ot=in" target="_blank" rel="noopener">一審判決全文 ↗</a><a href="https://www.children.org.tw/news/news_detail/kaikai-case-timeline" target="_blank" rel="noopener">兒盟公開時間軸｜機構來源 ↗</a></div></div></details>'),
        ('<div class="source-chips"><a href="https://cybsbox.cy.gov.tw/CYBSBoxSSL/edoc/download/76497" target="_blank" rel="noopener">監察院調查報告 P.45–48 ↗</a></div>', '<details class="evidence-source-drawer"><summary>查看證據、頁碼與限制</summary><div class="source-drawer-body"><dl><div><dt>來源性質</dt><dd>監察院正式調查報告</dd></div><div><dt>文件位置</dt><dd>調查報告第45—48頁</dd></div><div><dt>可直接支持</dt><dd>牙科病歷、轉大醫院建議及監察院的行政判斷</dd></div><div><dt>法律界線</dt><dd>行政調查不直接替代刑事責任判斷</dd></div></dl><div class="source-chips"><a href="https://cybsbox.cy.gov.tw/CYBSBoxSSL/edoc/download/76497" target="_blank" rel="noopener">監察院調查報告 P.45–48 ↗</a></div></div></details>'),
    ],
    'system_drawer_anchor': '<aside><b>要形成安全閉環</b><p>醫療端須能辨識與年齡不符的傷勢並依法通報；社福端須取得就醫結果、核實轉診是否完成、把跨次看診與照片、體重、行為變化放在同一張風險圖上。</p></aside>',
    'system_drawer': '<aside><b>要形成安全閉環</b><p>醫療端須能辨識與年齡不符的傷勢並依法通報；社福端須取得就醫結果、核實轉診是否完成、把跨次看診與照片、體重、行為變化放在同一張風險圖上。</p></aside><details class="evidence-source-drawer"><summary>查看制度來源與限制</summary><div class="source-drawer-body"><dl><div><dt>來源性質</dt><dd>監察院調查報告與調查新聞稿</dd></div><div><dt>可直接支持</dt><dd>基層醫療辨識、責任通報與幼兒專責醫師制度限制</dd></div><div><dt>本站整理</dt><dd>「安全閉環」是跨來源的流程化呈現，不是官方原圖</dd></div><div><dt>最後核對</dt><dd>2026.08.29</dd></div></dl><div class="source-chips"><a href="https://cybsbox.cy.gov.tw/CYBSBoxSSL/edoc/download/76497" target="_blank" rel="noopener">監察院調查報告 ↗</a><a href="https://www.cy.gov.tw/News_Content.aspx?Create=1&amp;n=125&amp;s=34118" target="_blank" rel="noopener">監察院新聞稿 ↗</a></div></div></details>',
    'section_source_old': '<div class="source-chips"><a href="https://www.cy.gov.tw/News_Content.aspx?Create=1&amp;n=125&amp;s=34118" target="_blank" rel="noopener">監察院新聞稿 ↗</a><a href="https://cybsbox.cy.gov.tw/CYBSBoxSSL/edoc/download/76497" target="_blank" rel="noopener">監察院調查報告 ↗</a><a href="https://www.judicial.gov.tw/tw/cp-1888-1528027-1ee8d-1.html" target="_blank" rel="noopener">臺北地院一審新聞稿 ↗</a></div>',
    'section_source_new': '<details class="evidence-source-drawer section-source-drawer"><summary>本區來源索引與更新紀錄</summary><div class="source-drawer-body"><dl><div><dt>主要依據</dt><dd>監察院調查報告、調查新聞稿、法院裁判與機構時間軸</dd></div><div><dt>狀態規則</dt><dd>行政認定、法院裁判、機構紀錄與待核實名稱分開標示</dd></div><div><dt>更新方式</dt><dd>原始病歷或新裁判出現時，先修正證據狀態，再更新結論</dd></div><div><dt>最後核對</dt><dd>2026.08.29</dd></div></dl><div class="source-chips"><a href="https://www.cy.gov.tw/News_Content.aspx?Create=1&amp;n=125&amp;s=34118" target="_blank" rel="noopener">監察院新聞稿 ↗</a><a href="https://cybsbox.cy.gov.tw/CYBSBoxSSL/edoc/download/76497" target="_blank" rel="noopener">監察院調查報告 ↗</a><a href="https://www.judicial.gov.tw/tw/cp-1888-1528027-1ee8d-1.html" target="_blank" rel="noopener">臺北地院一審新聞稿 ↗</a></div></div></details>',
}

HANS_CONFIG = {
    'path': ROOT / 'zh-Hans' / 'index.html', 'loop': HANS_LOOP, 'route': HANS_ROUTE,
    'audio_collapse': '收合配乐控制器',
    'guided_old': '<b>30分钟</b><span>主线、证词与责任</span>',
    'guided_new': '<b>15分钟</b><span>人物、机构与医疗警讯</span>',
    'status_old': '三十分钟模式：显示三层证据状态、四阶段形成图与十项跨日勾稽。',
    'status_new': '十五分钟模式：显示人物、机构、医疗警讯与责任闭环。',
    'takeaways': [
        ('<h5>兴隆内科小儿科诊所（名称待核实）</h5>', '<h5>兴隆内科小儿科诊所（名称待核实）</h5><p class="medical-card-takeaway"><b>一句结论</b>确有两次儿科就医节点，但公开资料尚不足以核实诊所名称，也不能直接认定个别失职。</p>'),
        ('<h5>牙医诊所：3颗乳牙脱落与大块口腔溃疡</h5>', '<h5>牙医诊所：3颗乳牙脱落与大块口腔溃疡</h5><p class="medical-card-takeaway"><b>一句结论</b>掉牙与口腔溃疡已构成明显异常；监察院认定医疗端错失辨识与通报时机。</p>'),
        ('<h5>基层诊所是第一线，但资讯没有自动进入儿保系统</h5>', '<h5>基层诊所是第一线，但资讯没有自动进入儿保系统</h5><p class="medical-card-takeaway"><b>一句结论</b>单次看诊若未被带入跨次、跨专业风险图，就不会自动形成安全闭环。</p>'),
    ],
    'drawers': [
        ('<div class="source-chips"><a href="https://judgment.judicial.gov.tw/FJUD/data.aspx?ty=JD&amp;id=TPDM%2c114%2c%e8%a8%b4%2c51%2c20260416%2c2&amp;ot=in" target="_blank" rel="noopener">一审判决全文 ↗</a><a href="https://www.children.org.tw/news/news_detail/kaikai-case-timeline" target="_blank" rel="noopener">儿盟公开时间轴｜机构来源 ↗</a></div>', '<details class="evidence-source-drawer"><summary>查看证据、直接性与限制</summary><div class="source-drawer-body"><dl><div><dt>来源性质</dt><dd>法院裁判全文、机构公开时间轴</dd></div><div><dt>可直接支持</dt><dd>11月7日与11月9日曾有儿科就医节点</dd></div><div><dt>不能直接支持</dt><dd>公开来源未披露诊所名称，也非监察院个别失职认定</dd></div><div><dt>最后核对</dt><dd>2026.08.29</dd></div></dl><div class="source-chips"><a href="https://judgment.judicial.gov.tw/FJUD/data.aspx?ty=JD&amp;id=TPDM%2c114%2c%e8%a8%b4%2c51%2c20260416%2c2&amp;ot=in" target="_blank" rel="noopener">一审判决全文 ↗</a><a href="https://www.children.org.tw/news/news_detail/kaikai-case-timeline" target="_blank" rel="noopener">儿盟公开时间轴｜机构来源 ↗</a></div></div></details>'),
        ('<div class="source-chips"><a href="https://cybsbox.cy.gov.tw/CYBSBoxSSL/edoc/download/76497" target="_blank" rel="noopener">监察院调查报告 P.45–48 ↗</a></div>', '<details class="evidence-source-drawer"><summary>查看证据、页码与限制</summary><div class="source-drawer-body"><dl><div><dt>来源性质</dt><dd>监察院正式调查报告</dd></div><div><dt>文件位置</dt><dd>调查报告第45—48页</dd></div><div><dt>可直接支持</dt><dd>牙科病历、转大医院建议及监察院的行政判断</dd></div><div><dt>法律界线</dt><dd>行政调查不直接替代刑事责任判断</dd></div></dl><div class="source-chips"><a href="https://cybsbox.cy.gov.tw/CYBSBoxSSL/edoc/download/76497" target="_blank" rel="noopener">监察院调查报告 P.45–48 ↗</a></div></div></details>'),
    ],
    'system_drawer_anchor': '<aside><b>要形成安全闭环</b><p>医疗端须能辨识与年龄不符的伤势并依法通报；社福端须取得就医结果、核实转诊是否完成，把跨次看诊与照片、体重、行为变化放在同一张风险图上。</p></aside>',
    'system_drawer': '<aside><b>要形成安全闭环</b><p>医疗端须能辨识与年龄不符的伤势并依法通报；社福端须取得就医结果、核实转诊是否完成，把跨次看诊与照片、体重、行为变化放在同一张风险图上。</p></aside><details class="evidence-source-drawer"><summary>查看制度来源与限制</summary><div class="source-drawer-body"><dl><div><dt>来源性质</dt><dd>监察院调查报告与调查新闻稿</dd></div><div><dt>可直接支持</dt><dd>基层医疗辨识、责任通报与幼儿专责医师制度限制</dd></div><div><dt>本站整理</dt><dd>“安全闭环”是跨来源的流程化呈现，不是官方原图</dd></div><div><dt>最后核对</dt><dd>2026.08.29</dd></div></dl><div class="source-chips"><a href="https://cybsbox.cy.gov.tw/CYBSBoxSSL/edoc/download/76497" target="_blank" rel="noopener">监察院调查报告 ↗</a><a href="https://www.cy.gov.tw/News_Content.aspx?Create=1&amp;n=125&amp;s=34118" target="_blank" rel="noopener">监察院新闻稿 ↗</a></div></div></details>',
    'section_source_old': '<div class="source-chips"><a href="https://www.cy.gov.tw/News_Content.aspx?Create=1&amp;n=125&amp;s=34118" target="_blank" rel="noopener">监察院新闻稿 ↗</a><a href="https://cybsbox.cy.gov.tw/CYBSBoxSSL/edoc/download/76497" target="_blank" rel="noopener">监察院调查报告 ↗</a><a href="https://www.judicial.gov.tw/tw/cp-1888-1528027-1ee8d-1.html" target="_blank" rel="noopener">台北地院一审新闻稿 ↗</a></div>',
    'section_source_new': '<details class="evidence-source-drawer section-source-drawer"><summary>本区来源索引与更新纪录</summary><div class="source-drawer-body"><dl><div><dt>主要依据</dt><dd>监察院调查报告、调查新闻稿、法院裁判与机构时间轴</dd></div><div><dt>状态规则</dt><dd>行政认定、法院裁判、机构纪录与待核实名称分开标示</dd></div><div><dt>更新方式</dt><dd>原始病历或新裁判出现时，先修正证据状态，再更新结论</dd></div><div><dt>最后核对</dt><dd>2026.08.29</dd></div></dl><div class="source-chips"><a href="https://www.cy.gov.tw/News_Content.aspx?Create=1&amp;n=125&amp;s=34118" target="_blank" rel="noopener">监察院新闻稿 ↗</a><a href="https://cybsbox.cy.gov.tw/CYBSBoxSSL/edoc/download/76497" target="_blank" rel="noopener">监察院调查报告 ↗</a><a href="https://www.judicial.gov.tw/tw/cp-1888-1528027-1ee8d-1.html" target="_blank" rel="noopener">台北地院一审新闻稿 ↗</a></div></div></details>',
}

for config in (TRAD_CONFIG, HANS_CONFIG):
    path = config['path']
    text = path.read_text(encoding='utf-8')
    text = text.replace('final-chapter.css?v=20260829-21', 'final-chapter.css?v=20260829-22')
    text = text.replace('final-chapter.js?v=20260829-8', 'final-chapter.js?v=20260829-9')
    if 'data-audio-collapse' not in text:
        text = replace_once(text, '</label>\n</div>\n\n<main id="main">', f'</label>\n  <button class="audio-collapse" type="button" data-audio-collapse aria-expanded="true" aria-label="{config["audio_collapse"]}" title="{config["audio_collapse"]}"><span aria-hidden="true">⌄</span></button>\n</div>\n\n<main id="main">', f'{path} audio collapse button')
    if config['guided_old'] in text:
        text = replace_once(text, config['guided_old'], config['guided_new'], f'{path} guided button')
    if config['status_old'] in text:
        text = replace_once(text, config['status_old'], config['status_new'], f'{path} reading status')
    if 'data-reading-route="quick"' not in text:
        text = replace_regex_once(text, r'<aside class="brief-route reveal">.*?</aside>', config['route'], f'{path} reading route')
    if HTML_MARKER not in text:
        text = replace_regex_once(text, r'(<div class="medical-status-legend"[^>]*>.*?</div>)\s*(<div class="medical-contact-cascade">)', r'\1\n' + config['loop'] + r'\n        \2', f'{path} medical closed loop')
    for old, new in config['takeaways']:
        if new not in text:
            text = replace_once(text, old, new, f'{path} takeaway')
    for old, new in config['drawers']:
        if new not in text:
            text = replace_once(text, old, new, f'{path} source drawer')
    if config['system_drawer'] not in text:
        text = replace_once(text, config['system_drawer_anchor'], config['system_drawer'], f'{path} system source drawer')
    if config['section_source_new'] not in text:
        text = replace_once(text, config['section_source_old'], config['section_source_new'], f'{path} section source drawer')
    quick_ids = ['chapter-brief', 'method', 'adoption-bridge', 'dental-warning', 'medical-network-omissions', 'reform', 'page-actions']
    guided_ids = ['puppet-theatre', 'life', 'last-day', 'injuries', 'voices', 'chen-trial', 'unresolved', 'people-network', 'placement-spectrum', 'system', 'gaps']
    full_ids = ['ten-days', 'temple', 'sources']
    heavy_ids = set(guided_ids + full_ids + ['dental-warning', 'medical-network-omissions', 'reform'])
    for section_id in quick_ids:
        text = set_section_attributes(text, section_id, 'quick', section_id in heavy_ids)
    for section_id in guided_ids:
        text = set_section_attributes(text, section_id, 'guided', True)
    for section_id in full_ids:
        text = set_section_attributes(text, section_id, 'full', True)
    for phrase in [HTML_MARKER, 'data-audio-collapse', 'data-reading-route="quick"', 'data-reading-route="guided"', 'data-reading-route="full"', 'class="medical-card-takeaway"', 'class="evidence-source-drawer"', 'class="medical-alert-loop"', 'final-chapter.css?v=20260829-22', 'final-chapter.js?v=20260829-9']:
        if phrase not in text:
            raise SystemExit(f'{path}: missing required phrase {phrase}')
    if text.count('id="medicalLoopTitle"') != 1 or text.count('data-audio-collapse') != 1:
        raise SystemExit(f'{path}: duplicate medical loop or audio collapse control')
    path.write_text(text, encoding='utf-8')

css_path = ROOT / 'final-chapter.css'
css = css_path.read_text(encoding='utf-8')
if CSS_MARKER not in css:
    css += r'''

/* READER-OPTIMIZATIONS-20260829 */
.chapter-audio{transition:width .24s ease,transform .24s ease,opacity .2s ease,padding .24s ease,border-radius .24s ease;bottom:calc(16px + env(safe-area-inset-bottom,0px))}
.audio-collapse{position:absolute;top:-10px;right:-8px;display:none;place-items:center;width:30px;height:30px;padding:0;border:1px solid rgba(255,255,255,.55);border-radius:50%;background:#173d4e;color:#fff;box-shadow:0 7px 18px rgba(0,0,0,.28);font-weight:950;cursor:pointer;transition:transform .2s ease,background .2s ease}.audio-collapse:hover,.audio-collapse:focus-visible{background:var(--red);outline:3px solid rgba(210,160,82,.4);outline-offset:2px}.chapter-audio.is-collapsed .audio-collapse{transform:rotate(180deg)}
.brief-route{display:grid!important;grid-template-columns:180px minmax(0,1fr)!important;gap:18px!important;align-items:start}.brief-route>b{padding-top:13px;color:var(--ink);font:900 19px/1.45 var(--serif)}.brief-route-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}.reading-route-card{display:flex;flex-direction:column;gap:6px;min-height:132px;padding:16px 17px;border:1px solid rgba(36,95,97,.27);border-top:5px solid var(--teal);background:#fffaf0;color:var(--text);text-decoration:none;box-shadow:0 8px 22px rgba(8,37,48,.06);transition:transform .18s ease,box-shadow .18s ease}.reading-route-card strong{color:var(--ink);font:900 15px/1.5 var(--serif)}.reading-route-card span{color:#5e6e6a;font-size:11px;line-height:1.7}.reading-route-card.route-guided{border-top-color:var(--gold)}.reading-route-card.route-full{border-top-color:var(--red)}.reading-route-card:hover,.reading-route-card:focus-visible{transform:translateY(-3px);box-shadow:0 13px 28px rgba(8,37,48,.13);outline:3px solid rgba(210,160,82,.32);outline-offset:2px}
.medical-alert-loop{margin:4px 0 20px;padding:20px;background:#0d3141;color:#fff;border:1px solid rgba(255,255,255,.16);border-top:7px solid var(--gold);box-shadow:0 14px 34px rgba(8,37,48,.18)}.medical-alert-loop>header{max-width:920px;margin:0 auto 18px;text-align:center}.medical-alert-loop>header small{color:#efc77d;font-size:9px;font-weight:950;letter-spacing:.14em}.medical-alert-loop>header h5{margin:5px 0 7px;color:#fff;font:900 clamp(21px,2.8vw,32px)/1.42 var(--serif)}.medical-alert-loop>header p{margin:0;color:#cad9d4;font-size:11px;line-height:1.72}.medical-alert-loop ol{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:8px;margin:0;padding:0;list-style:none}.medical-alert-loop li{position:relative;min-width:0;padding:15px 12px;background:#fffaf0;color:var(--text);border-top:5px solid #355f78}.medical-alert-loop li:not(:last-child):after{position:absolute;z-index:2;top:34px;right:-9px;color:#efc77d;font-size:17px;font-weight:950;content:'›'}.medical-alert-loop li.loop-official{border-top-color:var(--red)}.medical-alert-loop li.loop-break{border-top-color:#b34b42;background:#fff4e8}.medical-alert-loop li.loop-goal{border-top-color:var(--gold);background:#f1e4c5}.medical-alert-loop time{display:inline-flex;margin-bottom:8px;padding:3px 7px;border-radius:999px;background:#173d4e;color:#fff;font-size:9px;font-weight:950;letter-spacing:.06em}.medical-alert-loop li>b{display:block;min-height:48px;color:var(--ink);font:900 14px/1.45 var(--serif)}.medical-alert-loop dl{display:grid;gap:7px;margin:10px 0 0}.medical-alert-loop dl div{padding-top:7px;border-top:1px solid rgba(53,75,76,.16)}.medical-alert-loop dt{color:var(--red-dark);font-size:8px;font-weight:950;letter-spacing:.05em}.medical-alert-loop dd{margin:2px 0 0;color:#5a6966;font-size:9px;line-height:1.55}
.medical-card-takeaway{margin:0 0 12px!important;padding:11px 12px;background:#173d4e!important;color:#fff!important;border-left:5px solid var(--gold);font-size:11px!important;line-height:1.65!important}.medical-card-takeaway b{display:block;margin-bottom:2px;color:#efc77d;font:900 12px/1.4 var(--serif)}
.evidence-source-drawer{margin-top:14px;border:1px solid #cdbb97;background:#fffdf7}.evidence-source-drawer>summary{display:flex;align-items:center;justify-content:space-between;gap:12px;min-height:43px;padding:9px 12px;color:var(--ink);font-size:10px;font-weight:950;cursor:pointer;list-style:none}.evidence-source-drawer>summary::-webkit-details-marker{display:none}.evidence-source-drawer>summary:after{content:'＋';display:grid;place-items:center;width:23px;height:23px;border-radius:50%;background:#173d4e;color:#fff}.evidence-source-drawer[open]>summary:after{content:'−'}.source-drawer-body{padding:0 12px 12px;border-top:1px solid #d8c9ab}.source-drawer-body dl{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1px;margin:12px 0;background:#d8c9ab}.source-drawer-body dl div{padding:10px;background:#fffaf0}.source-drawer-body dt{color:var(--red-dark);font-size:8px;font-weight:950;letter-spacing:.05em}.source-drawer-body dd{margin:3px 0 0;color:#566562;font-size:9px;line-height:1.6}.source-drawer-body .source-chips{margin-top:8px}.section-source-drawer{margin-top:15px;background:#f7ecd6}.section-source-drawer>summary{font-size:11px}
@supports(content-visibility:auto){section[data-heavy="true"]{content-visibility:auto;contain-intrinsic-size:auto 1100px}section[data-heavy="true"][data-depth-reveal="true"],section[data-heavy="true"]:target{content-visibility:visible}}
@media(max-width:1100px){.medical-alert-loop ol{grid-template-columns:repeat(4,minmax(0,1fr))}.medical-alert-loop li:not(:last-child):after{display:none}.brief-route-grid{grid-template-columns:1fr 1fr}.reading-route-card:last-child{grid-column:1/-1}}
@media(max-width:760px){.audio-collapse{display:grid}.chapter-audio{right:8px;bottom:calc(8px + env(safe-area-inset-bottom,0px));left:8px}.chapter-audio.is-collapsed{right:10px;left:auto;display:grid;width:58px;height:58px;max-width:58px;padding:0;border-radius:50%;grid-template-columns:1fr;gap:0}.chapter-audio.is-collapsed .audio-toggle{display:grid;place-items:center;width:56px;height:56px;padding:0;border-radius:50%}.chapter-audio.is-collapsed .audio-toggle span{font-size:23px}.chapter-audio.is-collapsed .audio-toggle b{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}.chapter-audio.is-collapsed time,.chapter-audio.is-collapsed label{display:none}.chapter-audio.is-collapsed .audio-collapse{top:-7px;right:-5px;width:24px;height:24px;font-size:12px}body:has(.chapter-audio){padding-bottom:calc(116px + env(safe-area-inset-bottom,0px))}body:has(.chapter-audio.is-collapsed){padding-bottom:calc(70px + env(safe-area-inset-bottom,0px))}body:has(.chapter-audio:not(.is-collapsed)) .back-to-top{bottom:calc(128px + env(safe-area-inset-bottom,0px))}body:has(.chapter-audio.is-collapsed) .back-to-top{right:76px;bottom:calc(12px + env(safe-area-inset-bottom,0px))}body:has(.chapter-audio:not(.is-collapsed)) .chapter-toast{bottom:calc(182px + env(safe-area-inset-bottom,0px))}body:has(.chapter-audio.is-collapsed) .chapter-toast{bottom:calc(76px + env(safe-area-inset-bottom,0px))}.brief-route{grid-template-columns:1fr!important}.brief-route>b{padding-top:0}.brief-route-grid{grid-template-columns:1fr}.reading-route-card:last-child{grid-column:auto}.reading-route-card{min-height:auto}.medical-alert-loop{padding:16px 12px}.medical-alert-loop ol{grid-template-columns:1fr;gap:9px}.medical-alert-loop li{padding:14px 13px;border-top:0;border-left:6px solid #355f78}.medical-alert-loop li.loop-official{border-left-color:var(--red)}.medical-alert-loop li.loop-break{border-left-color:#b34b42}.medical-alert-loop li.loop-goal{border-left-color:var(--gold)}.medical-alert-loop li>b{min-height:0}.source-drawer-body dl{grid-template-columns:1fr}}
@media(prefers-reduced-motion:reduce){.chapter-audio,.audio-collapse,.reading-route-card{transition:none}}@media print{.audio-collapse{display:none!important}.medical-alert-loop{background:#fff;color:#111;box-shadow:none}.medical-alert-loop>header h5,.medical-alert-loop>header p{color:#111}.medical-alert-loop ol{grid-template-columns:repeat(2,minmax(0,1fr))}.evidence-source-drawer:not([open])>.source-drawer-body{display:block!important}.reading-route-card{box-shadow:none}}
'''
css_path.write_text(css, encoding='utf-8')

js_path = ROOT / 'final-chapter.js'
js = js_path.read_text(encoding='utf-8')
js = js.replace("guided: '三十分钟模式：显示三层证据状态、四阶段形成图与十项跨日勾稽。'", "guided: '十五分钟模式：显示人物、机构、医疗警讯与责任闭环。'")
js = js.replace("guided: '三十分鐘模式：顯示三層證據狀態、四階段形成圖與十項跨日勾稽。'", "guided: '十五分鐘模式：顯示人物、機構、醫療警訊與責任閉環。'")
if JS_MARKER not in js:
    audio_anchor = "\n  const theatre = document.querySelector('[data-puppet-theatre]');"
    audio_code = r'''

  // READER-OPTIMIZATIONS-20260829
  const audioController = document.querySelector('[data-audio-controller]');
  const audioCollapse = document.querySelector('[data-audio-collapse]');
  const mobileAudio = window.matchMedia('(max-width: 760px)');
  const audioPanelCopy = locale === 'zh-Hans' ? { expand: '展开配乐控制器', collapse: '收合配乐控制器' } : { expand: '展開配樂控制器', collapse: '收合配樂控制器' };
  let audioManualOpenAt = -1;
  const setAudioCollapsed = (collapsed, reason = 'auto') => {
    if (!audioController || !audioCollapse) return;
    const next = mobileAudio.matches ? Boolean(collapsed) : false;
    audioController.classList.toggle('is-collapsed', next);
    audioCollapse.setAttribute('aria-expanded', String(!next));
    audioCollapse.setAttribute('aria-label', next ? audioPanelCopy.expand : audioPanelCopy.collapse);
    audioCollapse.title = next ? audioPanelCopy.expand : audioPanelCopy.collapse;
    if (!next && reason === 'manual') audioManualOpenAt = window.scrollY;
    if (next) audioManualOpenAt = -1;
  };
  audioCollapse?.addEventListener('click', () => setAudioCollapsed(!audioController?.classList.contains('is-collapsed'), 'manual'));
  let audioScrollTicking = false;
  const syncAudioPanelWithScroll = () => {
    audioScrollTicking = false;
    if (!audioController || !mobileAudio.matches) return;
    if (window.scrollY < 120) { setAudioCollapsed(false, 'auto'); return; }
    if (audioManualOpenAt >= 0 && window.scrollY - audioManualOpenAt < 280) return;
    setAudioCollapsed(true, 'auto');
  };
  window.addEventListener('scroll', () => { if (!audioScrollTicking) { audioScrollTicking = true; requestAnimationFrame(syncAudioPanelWithScroll); } }, { passive: true });
  mobileAudio.addEventListener?.('change', () => { audioManualOpenAt = -1; setAudioCollapsed(mobileAudio.matches && window.scrollY >= 120, 'auto'); });
  document.addEventListener('click', (event) => { if (event.target.closest('a[href^="#"]') && mobileAudio.matches) setAudioCollapsed(true, 'anchor'); }, { capture: true });
  window.addEventListener('hashchange', () => { if (mobileAudio.matches) setAudioCollapsed(true, 'anchor'); });
  setAudioCollapsed(mobileAudio.matches && window.scrollY >= 120, 'auto');
'''
    if audio_anchor not in js:
        raise SystemExit('JS audio insertion anchor missing')
    js = js.replace(audio_anchor, audio_code + audio_anchor, 1)
    js = replace_once(js, "    audioToggle.setAttribute('aria-pressed', String(playing));\n    audioLabel.textContent = playing ? audioCopy.pause : (audio.ended ? audioCopy.replay : audioCopy.play);", "    audioToggle.setAttribute('aria-pressed', String(playing));\n    audioController?.classList.toggle('is-playing', playing);\n    audioLabel.textContent = playing ? audioCopy.pause : (audio.ended ? audioCopy.replay : audioCopy.play);", 'JS audio playing state')
    js = replace_once(js, "  readingDepthButtons.forEach((button) => {\n    button.addEventListener('click', () => setReadingDepth(button.dataset.readingDepth));\n  });", "  readingDepthButtons.forEach((button) => {\n    button.addEventListener('click', () => setReadingDepth(button.dataset.readingDepth));\n  });\n  document.querySelectorAll('[data-reading-route]').forEach((link) => {\n    link.addEventListener('click', () => {\n      const depth = link.dataset.readingRoute;\n      const button = document.querySelector(`[data-reading-depth=\"${depth}\"]`);\n      button?.click();\n    });\n  });", 'JS reading route listeners')
    js = replace_once(js, "  const theatre = document.querySelector('[data-puppet-theatre]');\n  if (theatre) {", "  const theatre = document.querySelector('[data-puppet-theatre]');\n  const initPuppetTheatre = () => {\n    if (!theatre || theatre.dataset.runtimeReady === 'true') return;\n    theatre.dataset.runtimeReady = 'true';", 'JS lazy puppet start')
    old_tail = "      skipLink?.addEventListener('click', () => {\n        timeline.pause(0);\n        audio?.pause();\n        if (audio) audio.currentTime = 0;\n        setStaticFinalState();\n        if (transcript) transcript.open = true;\n        if (playButton) {\n          playButton.textContent = theatreCopy.replay;\n          playButton.disabled = false;\n        }\n        if (pauseButton) pauseButton.disabled = true;\n      });\n    }\n  }\n})();\n\n// 2026-08-28 · chapter 2 reader-first UX"
    new_tail = "      skipLink?.addEventListener('click', () => {\n        timeline.pause(0);\n        audio?.pause();\n        if (audio) audio.currentTime = 0;\n        setStaticFinalState();\n        if (transcript) transcript.open = true;\n        if (playButton) {\n          playButton.textContent = theatreCopy.replay;\n          playButton.disabled = false;\n        }\n        if (pauseButton) pauseButton.disabled = true;\n      });\n    }\n  };\n  if (theatre) {\n    if ('IntersectionObserver' in window) {\n      const theatreObserver = new IntersectionObserver((entries, observer) => {\n        if (!entries.some((entry) => entry.isIntersecting)) return;\n        initPuppetTheatre();\n        observer.disconnect();\n      }, { rootMargin: '800px 0px 800px 0px', threshold: 0.01 });\n      theatreObserver.observe(theatre);\n    } else { initPuppetTheatre(); }\n  }\n})();\n\n// 2026-08-28 · chapter 2 reader-first UX"
    js = replace_once(js, old_tail, new_tail, 'JS lazy puppet tail')
    js = replace_once(js, "  const revealTargetForNavigation = (target) => {\n    if (!target) return;\n    let node = target;", "  const revealTargetForNavigation = (target) => {\n    if (!target) return;\n    let disclosure = target.closest?.('details');\n    while (disclosure) {\n      disclosure.open = true;\n      disclosure = disclosure.parentElement?.closest('details') || null;\n    }\n    let node = target;", 'JS open disclosure on deep link')
if JS_MARKER not in js:
    raise SystemExit('JS marker missing after patch')
for phrase in ['data-reading-route', 'data-audio-collapse', 'initPuppetTheatre', "rootMargin: '800px 0px 800px 0px'", "target.closest?.('details')"]:
    if phrase not in js:
        raise SystemExit(f'JS missing {phrase}')
js_path.write_text(js, encoding='utf-8')
print('Patched all reader optimizations.')
