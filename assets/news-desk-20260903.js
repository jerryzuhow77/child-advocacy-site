(() => {
  'use strict';

  const ROOT = '/child-advocacy-site/';
  const reports = {
    dailyBrief20260913: { date:'2026-09-13', priority:-8, publisher:{'zh-Hant':'每日護童總報','zh-Hans':'每日护童总报',en:'Daily Child Protection Brief',ja:'子ども保護デイリーブリーフ'}, title:{'zh-Hant':'當制度尚未定案，先守住孩子的最佳利益','zh-Hans':'当制度尚未定案，先守住孩子的最佳利益',en:"When the rules are unsettled, protect the child's best interests first",ja:'制度が定まらない時こそ、子どもの最善の利益を先に守る'}, summary:{'zh-Hant':'美國跨州代理孕產醫療爭議與匈牙利收養改革宣示：把兒童最佳利益轉化為可稽核程序。','zh-Hans':'美国跨州代理孕产医疗争议与匈牙利收养改革宣示：把儿童最佳利益转化为可核查程序。',en:"A US cross-state neonatal-care dispute and Hungary's adoption announcement test auditable best-interests procedure.",ja:'米国の州間新生児医療紛争とハンガリーの養子改革表明から、監査可能な最善の利益を問う。'}, article:{'zh-Hant':`${ROOT}news/daily-child-protection-brief-20260913/`,'zh-Hans':`${ROOT}news/daily-child-protection-brief-20260913/zh-Hans/`,en:`${ROOT}en/news/daily-child-protection-brief-20260913/`,ja:`${ROOT}ja/news/daily-child-protection-brief-20260913/`}, source:'https://www.supremecourt.gov/docket/docketfiles/html/public/26a325.html', image:`${ROOT}assets/images/daily-child-protection-brief-autumn-20260913.webp`, credit:{'zh-Hant':'AI秋季寫意花鳥水墨意象，非事件現場、非齊白石原作','zh-Hans':'AI秋季写意花鸟水墨意象，并非事件现场或齐白石原作',en:'AI autumn flower-and-bird ink-wash concept; not an event photo or a Qi Baishi original',ja:'AI秋景花鳥水墨イメージ。現場写真・斉白石の原作ではありません'}, alt:{'zh-Hant':'秋柿、紅楓、菊花、雙雀與河流構成的繽紛寫意水墨守護意象','zh-Hans':'秋柿、红枫、菊花、双雀与河流构成的彩色写意水墨守护意象',en:'Colorful autumn ink painting with persimmons, red maples, chrysanthemums, two sparrows and a river',ja:'柿、紅葉、菊、二羽の雀、川を描いた色彩豊かな秋の写意水墨画'} },
    dailyBrief20260912: { date:'2026-09-12', priority:-7, publisher:{'zh-Hant':'每日護童總報','zh-Hans':'每日护童总报',en:'Daily Child Protection Brief',ja:'子ども保護デイリーブリーフ'}, title:{'zh-Hant':'從成癮設計到安全宣傳責任','zh-Hans':'从成瘾设计到安全宣传责任',en:'From addictive design to accountable safety claims',ja:'依存を促す設計から、安全表示の責任へ'}, summary:{'zh-Hant':'加州十三項兒少網路安全法律與德州TikTok裁定：平台必須證明安全功能真正有效。','zh-Hans':'加州十三项儿童网络安全法律与德州TikTok裁定：平台必须证明安全功能真正有效。',en:'California legislation and a Texas TikTok ruling demand verifiable safety outcomes.',ja:'カリフォルニア州法とテキサス州のTikTok判断から、検証可能な安全を問う。'}, article:{'zh-Hant':`${ROOT}news/daily-child-protection-brief-20260912/`,'zh-Hans':`${ROOT}news/daily-child-protection-brief-20260912/zh-Hans/`,en:`${ROOT}en/news/daily-child-protection-brief-20260912/`,ja:`${ROOT}ja/news/daily-child-protection-brief-20260912/`}, source:'https://www.gov.ca.gov/2026/09/10/governor-newsom-signs-the-strongest-child-safety-chatbot-and-social-media-laws-in-the-nation/', image:`${ROOT}assets/images/daily-child-protection-brief-autumn-20260912.webp`, credit:{'zh-Hant':'AI秋季寫意花鳥水墨意象，非事件現場、非畫家原作','zh-Hans':'AI秋季写意花鸟水墨意象，并非事件现场或画家原作',en:'AI autumn flower-and-bird ink-wash concept; not an event photo or artist original',ja:'AI秋景花鳥水墨イメージ。現場写真・画家の原作ではありません'}, alt:{'zh-Hant':'秋柿、菊花與雙雀構成的繽紛寫意水墨守護意象','zh-Hans':'秋柿、菊花与双雀构成的彩色写意水墨守护意象',en:'Expressive autumn ink painting with persimmons, chrysanthemums and two sparrows',ja:'柿、菊、二羽の雀を描いた色彩豊かな秋の写意水墨画'} },
    dailyBrief20260911: { date:'2026-09-11', priority:-6, publisher:{'zh-Hant':'每日護童總報','zh-Hans':'每日护童总报',en:'Daily Child Protection Brief',ja:'子ども保護デイリーブリーフ'}, title:{'zh-Hant':'保護不只防止虐待，也要讓孩子安全離開教室','zh-Hans':'保护不只防止虐待，也要让孩子安全离开教室',en:'Protection must also help children leave classrooms safely',ja:'保護とは、子どもが教室から安全に避難できること'}, summary:{'zh-Hant':'剛果民主共和國校園火災與美國兒少死亡案程序：校舍安全、心理支持及司法界限。','zh-Hans':'刚果民主共和国校园火灾与美国儿童死亡案程序：校舍安全、心理支持及司法边界。',en:'School safety in DR Congo and procedural safeguards in a US child-death case.',ja:'コンゴ民主共和国の学校火災と米国の児童死亡事件の司法手続。'}, article:{'zh-Hant':`${ROOT}news/daily-child-protection-brief-20260911/`,'zh-Hans':`${ROOT}news/daily-child-protection-brief-20260911/zh-Hans/`,en:`${ROOT}en/news/daily-child-protection-brief-20260911/`,ja:`${ROOT}ja/news/daily-child-protection-brief-20260911/`}, source:'https://www.reuters.com/world/africa/school-fire-congos-rebel-controlled-city-bukavu-kills-least-17-sources-say-2026-09-10/', image:`${ROOT}assets/images/daily-child-protection-brief-autumn-20260911.png`, credit:{'zh-Hant':'AI秋季水墨藝術意象，非事件現場、非畫家原作','zh-Hans':'AI秋季水墨艺术意象，并非事件现场或画家原作',en:'AI autumn ink-wash concept; not an event photo or artist original',ja:'AI秋景水墨イメージ。現場写真・画家の原作ではありません'}, alt:{'zh-Hant':'楓葉、秋菊、蓮葉、守護燈與安全路徑的繽紛水墨意象','zh-Hans':'枫叶、秋菊、莲叶、守护灯与安全路径的彩色水墨意象',en:'Autumn ink painting with maple leaves, chrysanthemums, lotus leaves, lantern and safe path',ja:'紅葉、菊、蓮、灯籠、安全な道を描いた秋の水墨画'} },
    dailyBrief20260910: { date:'2026-09-10', priority:-5, publisher:{'zh-Hant':'每日護童總報','zh-Hans':'每日护童总报',en:'Daily Child Protection Brief',ja:'子ども保護デイリーブリーフ'}, title:{'zh-Hant':'警訊不能在換校、換人、換機構後歸零','zh-Hans':'警讯不能在转校、换人、换机构后归零',en:'Warnings must not reset across institutions',ja:'警告を施設間でリセットさせない'}, summary:{'zh-Hant':'英國校園信任侵害與澳洲少年機構歷史指控，追問跨機構風險紀錄。','zh-Hans':'英国校园信任侵害与澳大利亚少年机构历史指控，追问跨机构风险记录。',en:'UK and Australian cases raise questions about durable cross-institution risk records.',ja:'英国と豪州の事例から、施設を越えたリスク記録を検証。'}, article:{'zh-Hant':`${ROOT}news/daily-child-protection-brief-20260910/`,'zh-Hans':`${ROOT}news/daily-child-protection-brief-20260910/zh-Hans/`,en:`${ROOT}en/news/daily-child-protection-brief-20260910/`,ja:`${ROOT}ja/news/daily-child-protection-brief-20260910/`}, source:'https://www.theguardian.com/uk-news/2026/sep/10/former-pe-teacher-bronwen-james-faces-lengthy-jail-term-sexually-abusing-pupils-wiltshire-hampshire', image:`${ROOT}assets/images/daily-child-protection-brief-autumn-20260910.png`, credit:{'zh-Hant':'AI秋季水墨藝術意象，非事件現場、非畫家原作','zh-Hans':'AI秋季水墨艺术意象，并非事件现场或画家原作',en:'AI autumn ink-wash concept; not an event photo or artist original',ja:'AI秋景水墨イメージ。現場写真・画家の原作ではありません'}, alt:{'zh-Hant':'秋柿、菊花、麻雀、門與紅線構成的繽紛水墨意象','zh-Hans':'秋柿、菊花、麻雀、门与红线构成的彩色水墨意象',en:'Autumn ink painting with persimmons, chrysanthemums, sparrows, a gate and red thread',ja:'柿、菊、雀、門、赤い糸を描いた秋の水墨画'} },
    koreaPlacement20260909: { date:'2026-09-09', priority:-3, publisher:{'zh-Hant':'跨國兒少保護觀察','zh-Hans':'跨国儿童保护观察',en:'Cross-border child protection',ja:'国際子ども保護比較'}, title:{'zh-Hant':'通報增加，孩子仍未被帶離','zh-Hans':'通报增加，孩子仍未被带离',en:'More reports, but children still left in danger',ja:'通報が増えても、子どもは危険から離されない'}, summary:{'zh-Hant':'南韓38名兒虐死亡兒童與8.6%分離保護數據，對照台灣家外安置的五個制度漏接點。','zh-Hans':'韩国38名受虐死亡儿童与8.6%分离保护数据，对照台湾家外安置的五个制度漏接点。',en:'South Korea’s 38 child-abuse deaths and 8.6% separation figure, compared with five auditable gaps in Taiwan.',ja:'韓国の虐待死38人と分離保護8.6％から、台湾の五つの制度接続を検証。'}, article:{'zh-Hant':`${ROOT}news/korea-placement-warning-20260909/`,'zh-Hans':`${ROOT}news/korea-placement-warning-20260909/zh-Hans/`,en:`${ROOT}en/news/korea-placement-warning-20260909/`,ja:`${ROOT}ja/news/korea-placement-warning-20260909/`}, source:'https://www.mohw.go.kr/board.es?act=view&bid=0027&list_no=1491788&mid=a10503010100', image:`${ROOT}assets/art/korea-placement-warning-autumn-20260909.webp`, credit:{'zh-Hant':'AI秋日水墨意象，非事件現場、非畫家原作','zh-Hans':'AI秋日水墨意象，非事件现场、非画家原作',en:'AI autumn ink-wash concept; not an event photo or artist original',ja:'AI秋景水墨イメージ。現場写真・画家の原作ではありません'}, alt:{'zh-Hant':'秋柿、菊花、麻雀與守護燈籠構成的繽紛水墨意象','zh-Hans':'秋柿、菊花、麻雀与守护灯笼构成的彩色水墨意象',en:'Colorful autumn ink painting with persimmons, chrysanthemums, sparrows and a protected lantern',ja:'秋柿、菊、雀、守られた灯籠の色彩豊かな水墨画'} },
    dailyBrief20260909: { date:'2026-09-09', priority:-2, publisher:{'zh-Hant':'每日護童總報','zh-Hans':'每日护童总报',en:'Daily Child Protection Brief',ja:'子ども保護デイリーブリーフ'}, title:{'zh-Hant':'安全網不能只列措施，更要交出安全結果','zh-Hans':'安全网不能只列措施，更要交出安全结果',en:'A safety net must show outcomes, not just measures',ja:'安全網は施策だけでなく結果を示すべきだ'}, summary:{'zh-Hant':'高雄拒訪與傷勢諮詢、候選政策及UNICEF網路性剝削研究的證據分層分析。','zh-Hans':'高雄拒访与伤势咨询、候选政策及UNICEF网络性剥削研究的证据分层分析。',en:'Evidence-layered analysis of Kaohsiung measures, a campaign proposal and UNICEF online-abuse research.',ja:'高雄市の施策、選挙公約、UNICEFのオンライン被害研究を証拠段階別に検証。'}, article:{'zh-Hant':`${ROOT}news/daily-child-protection-brief-20260909/`,'zh-Hans':`${ROOT}news/daily-child-protection-brief-20260909/zh-Hans/`,en:`${ROOT}en/news/daily-child-protection-brief-20260909/`,ja:`${ROOT}ja/news/daily-child-protection-brief-20260909/`}, source:'https://newtalk.tw/news/view/2026-09-08/1058352', image:`${ROOT}assets/images/daily-child-protection-brief-qi-baishi-autumn-20260909-v2.webp`, credit:{'zh-Hant':'AI水墨藝術意象，非事件現場、非畫家原作','zh-Hans':'AI水墨艺术意象，非事件现场、非画家原作',en:'AI ink-wash concept; not an event photo or an artist’s original',ja:'AI水墨イメージ。現場写真・画家の原作ではありません'}, alt:{'zh-Hant':'秋柿、紅楓、秋菊、殘荷、守護鳥與開門的秋季花鳥水墨意象','zh-Hans':'秋柿、红枫、秋菊、残荷、守护鸟与开门的秋季花鸟水墨意象',en:'Autumn flower-and-bird ink painting with persimmons, maples, chrysanthemums, lotus leaves, guardian birds and an open gate',ja:'秋柿、紅葉、菊、枯れ蓮、守護する鳥と開いた門の秋の花鳥水墨画'} },
    dailyBrief: { date:'2026-09-08', priority:-1, publisher:{'zh-Hant':'每日護童總報','zh-Hans':'每日护童总报',en:'Daily Child Protection Brief',ja:'子ども保護デイリーブリーフ'}, title:{'zh-Hant':'通報前的黑數，通報後的等待','zh-Hans':'通报前的黑数，通报后的等待',en:'Invisible before reporting, waiting after',ja:'通報前の死角、通報後の待機'}, summary:{'zh-Hant':'審計原文61.90%–92.86%區間、台北女童安置爭議與十二道門比較。','zh-Hans':'审计原文61.90%–92.86%区间、台北女童安置争议与十二道门比较。',en:'The audited 61.90%–92.86% range, a reported placement delay and a Twelve Doors comparison.',ja:'監査原文の61.90%～92.86%、保護遅延報道、十二の扉の比較。'}, article:{'zh-Hant':`${ROOT}news/daily-child-protection-brief-20260908/`,'zh-Hans':`${ROOT}news/daily-child-protection-brief-20260908/zh-Hans/`,en:`${ROOT}en/news/daily-child-protection-brief-20260908/`,ja:`${ROOT}ja/news/daily-child-protection-brief-20260908/`}, source:'https://auditreport.audit.gov.tw/ServerFile/Get/639214348006366730563d2c6b94bb4609880a1f3fffa531a6', image:`${ROOT}assets/images/daily-child-protection-brief-ink-autumn-20260908.webp`, alt:{'zh-Hant':'秋柿、荷塘、守護鳥、燈籠與開門的繽紛大寫意水墨畫','zh-Hans':'秋柿、荷塘、守护鸟、灯笼与开门的彩色写意水墨画',en:'Expressive ink painting of persimmons, lotus pond, guardian birds, lantern and open gate',ja:'秋の柿、蓮池、守護する鳥、灯籠と開いた門の写意水墨画'} },
    audit20260908: { date:'2026-09-08', priority:0, publisher:{'zh-Hant':'護童行動聯盟・獨立報導','zh-Hans':'护童行动联盟・独立报道',en:'Child Protection Action Alliance',ja:'子ども保護行動連盟'}, title:{'zh-Hant':'七成背後：讓早期警訊走進保護網','zh-Hans':'七成背后：让早期警讯走进保护网',en:'Beyond 70%: bringing early warnings into protection',ja:'「約7割」の先へ：早期の兆候を保護につなぐ'}, summary:{'zh-Hant':'核對46／65與70.77%的審計原文，提出可追蹤、可稽核的早期保護門檻。','zh-Hans':'核对46／65与70.77%的审计原文，提出可追踪、可核查的早期保护门槛。',en:'A primary-source check of 46/65 and 70.77%, with traceable early-protection thresholds.',ja:'46／65と70.77％を一次資料で確認し、追跡可能な早期保護基準を問います。'}, article:{'zh-Hant':`${ROOT}news/early-warning-audit-20260908/`,'zh-Hans':`${ROOT}news/early-warning-audit-20260908/zh-Hans/`,en:`${ROOT}en/news/early-warning-audit-20260908/`,ja:`${ROOT}ja/news/early-warning-audit-20260908/`}, source:'https://auditreport.audit.gov.tw/ServerFile/Get/639214349060550306d207244944914f72b7bddfc8f0a7268f#page=2', image:`${ROOT}assets/art/early-warning-audit-20260908.webp`, alt:{'zh-Hant':'荷葉守護新芽的中國水墨藝術意象，非事件現場','zh-Hans':'荷叶守护新芽的中国水墨艺术意象，并非事件现场',en:'Chinese ink-wash artwork of lotus leaves sheltering new buds; not an event photograph',ja:'蓮の葉が若い芽を守る中国水墨画のイメージ。現場写真ではありません'} },
    dailyBrief20260907: { date:'2026-09-07', priority:0, publisher:{'zh-Hant':'每日護童總報','zh-Hans':'每日护童总报',en:'Daily Child Protection Brief',ja:'子ども保護デイリーブリーフ'}, title:{'zh-Hant':'早期警訊，如何真正啟動保護？','zh-Hans':'早期警讯，如何真正启动保护？',en:'How should early warnings trigger protection?',ja:'早期警告を、どう保護につなげるか'}, summary:{'zh-Hant':'憲法第156條、46／65審計原文、24小時責任通報與可稽核早期保護門檻。','zh-Hans':'宪法第156条、46／65审计原文、24小时责任通报与可核查保护门槛。',en:'Article 156, verified audit data, the 24-hour reporting duty and auditable protection thresholds.',ja:'憲法第156条、確認済み監査資料、24時間以内の通報義務、監査可能な保護基準。'}, article:{'zh-Hant':`${ROOT}news/daily-child-protection-brief-20260907/`,'zh-Hans':`${ROOT}news/daily-child-protection-brief-20260907/zh-Hans/`,en:`${ROOT}en/news/daily-child-protection-brief-20260907/`,ja:`${ROOT}ja/news/daily-child-protection-brief-20260907/`}, source:'https://auditreport.audit.gov.tw/ServerFile/Get/639214349060550306d207244944914f72b7bddfc8f0a7268f#page=2', image:`${ROOT}assets/images/daily-child-protection-brief-paper-clay-20260907.webp`, alt:{'zh-Hant':'守護兒少、早期警訊與保護門檻的紙雕陶土藝術意象','zh-Hans':'守护儿童、早期警讯与保护门槛的纸雕陶土艺术意象',en:'Paper-and-clay artwork symbolising early warnings and child-protection thresholds',ja:'早期警告と子ども保護基準を象徴する紙彫刻と粘土のアート'} },
    sportsSafeguarding: { date: '2026-09-04', priority: 0, publisher: { 'zh-Hant':'行政院／運動部','zh-Hans':'台灣行政院／運動部',en:'Taiwan Executive Yuan',ja:'台湾行政院／運動部' }, title: { 'zh-Hant':'把不適任者擋在運動場外','zh-Hans':'把不适任者挡在运动场外',en:'Keeping unsuitable personnel out of youth sport',ja:'不適格者を子どものスポーツ現場に入れない' }, summary: { 'zh-Hant':'《國民運動法》修正草案提出不適任教練退場、公開查詢與兒少保護培訓；行政院版已通過，尚待立法院審議。','zh-Hans':'《国民运动法》修正草案提出不适任教练退出、公开查询与儿童保护培训；行政部门版本已通过，尚待立法审议。',en:'The Executive Yuan bill proposes exclusion, registry checks and safeguarding training. It is not yet law.',ja:'不適格指導者の排除、照会、子ども保護研修を盛り込む行政院案。まだ法律ではありません。' }, article: { 'zh-Hant':`${ROOT}news/national-sports-act-child-protection-20260904/`,'zh-Hans':`${ROOT}news/national-sports-act-child-protection-20260904/zh-Hans/`,en:`${ROOT}en/news/national-sports-act-child-protection-20260904/`,ja:`${ROOT}ja/news/national-sports-act-child-protection-20260904/` }, source:'https://www.ey.gov.tw/Page/9277F759E41CCD91/d0eb8192-299e-4522-a74d-23435408aed2', image:`${ROOT}assets/images/national-sports-act-ink-20260904.webp`, alt:{'zh-Hant':'水墨圓環守護運動衣、球場與制度查核名冊的意象','zh-Hans':'水墨圆环守护运动衣、球场与制度查核名册的意象',en:'Ink-wash circle protecting a sports jersey, school track and safeguarding registry',ja:'運動着、学校のトラック、保護照会名簿を守る水墨の円'} },
    oversight: { date: '2026-09-04', priority: 1, publisher: { 'zh-Hant':'立法院專題研究','zh-Hans':'台湾立法机构研究',en:'Taiwan Legislative Yuan study',ja:'台湾・立法院調査' }, title: { 'zh-Hant':'通報增加六成，安全網真的更安全了嗎？','zh-Hans':'通报增加六成，安全网真的更安全吗？',en:'Reports rose 60%. Is the safety net safer?',ja:'通報が6割増えて、安全網は強くなったのか' }, summary: { 'zh-Hant':'從通報量、預算、法醫鑑驗到司法及早介入，追問兒少保護不能只計算入口，更要公開處理速度與安全結果。','zh-Hans':'从通报量、预算、法医鉴定到司法及早介入，追问儿童保护不能只计算入口，更要公开处理速度与安全结果。',en:'A closer look at reporting volume, budgets, forensic capacity and early judicial intervention—and the outcome data still missing.',ja:'通報件数、予算、法医学、司法の早期関与を一体で検証し、処理速度と安全結果の公開を求めます。' }, article:`${ROOT}news/child-protection-oversight-202608/`, source:'https://www.ly.gov.tw/Pages/List.aspx?nodeid=56705', image:`${ROOT}assets/images/child-protection-oversight-paper-clay-20260904.webp`, alt:{'zh-Hant':'陶土孩子、守護之手、法院與紙雕安全網意象','zh-Hans':'陶土儿童、守护之手、法院与纸雕安全网意象',en:'Clay child, protective hands, courthouse and layered paper safety net',ja:'粘土の子ども、守る手、裁判所と紙彫刻の安全網'} },
    reporting: { date: '2026-09-04', priority: 2, publisher: { 'zh-Hant':'衛福部書面報告','zh-Hans':'台湾卫福部门书面报告',en:'Taiwan MOHW report',ja:'台湾・衛生福利部報告' }, title: { 'zh-Hant':'十三萬件通報之後，安全措施落實了多少？','zh-Hans':'十三万件通报之后，安全措施落实了多少？',en:'After 130,000 reports, what was actually implemented?',ja:'13万件の通報後、安全措置はどこまで実行されたか' }, summary: { 'zh-Hant':'檢視 24 小時責任通報、不預約訪視、證據保全與跨部會合作，並提出六組應公開的執行數據。','zh-Hans':'检视24小时责任通报、不预约访视、证据保全与跨部门合作，并提出六组应公开的执行数据。',en:'Six accountability datasets for mandatory reporting, unannounced visits, evidence preservation and inter-agency work.',ja:'24時間以内の義務通報、抜き打ち訪問、証拠保全、部門間連携について、公開すべき六つの実績指標を提示します。' }, article:`${ROOT}news/mandatory-reporting-visits-20260730/`, source:'https://www.mohw.gov.tw/dl-101863-ab884f32-81dd-4a19-82f2-3ccab843eb94.html', image:`${ROOT}assets/images/mandatory-reporting-visits-paper-clay-20260904.webp`, alt:{'zh-Hant':'訪視員、托育門口與教育醫療警政社福連結的紙雕陶土意象','zh-Hans':'访视员、托育门口与教育医疗警政社福连接的纸雕陶土意象',en:'Paper-and-clay scene linking a childcare visit with education, health, police and social services',ja:'保育訪問と教育・医療・警察・福祉を結ぶ紙彫刻と粘土の情景'} },
    lin: { date:'2026-09-02', priority:3, publisher:{'zh-Hant':'壹電視','zh-Hans':'壹电视',en:'Next TV',ja:'壹電視'}, title:{'zh-Hant':'林心慈案首度開庭','zh-Hans':'林心慈案首次开庭',en:'First hearing in the Lin Hsin-tzu case',ja:'林心慈事件、初公判'}, summary:{'zh-Hant':'從訪視紀錄與日期登載爭議出發，整理媒體報導、檢方指控、辯方主張與尚待法院審酌的事項。','zh-Hans':'从访视记录与日期登记争议出发，整理媒体报道、检方指控、辩方主张及尚待法院审酌的事项。',en:'A source-attributed review of the disputed visit records, the prosecution account, the defense position, and matters still for the court.',ja:'訪問記録と日付記載をめぐる争点について、報道、検察側の説明、弁護側の主張を整理します。'}, article:{'zh-Hant':`${ROOT}news/lin-xinci-nexttv-20260902/`,'zh-Hans':`${ROOT}news/lin-xinci-nexttv-20260902/zh-Hans/`,en:`${ROOT}en/news/lin-xinci-nexttv-20260902/`,ja:`${ROOT}ja/news/lin-xinci-nexttv-20260902/`}, source:'https://www.nexttv.com.tw/NextTV/News/Home/Society/m/2026-09-02/2455025.html', image:`${ROOT}assets/images/lin-xinci-inkwash-hero-20260903.png`, alt:{'zh-Hant':'中國傳統水墨山景與訪視紀錄意象','zh-Hans':'中国传统水墨山景与访视记录意象',en:'Traditional Chinese ink-wash landscape and visit-record imagery',ja:'中国伝統水墨の山景と訪問記録のイメージ'} }
  };

  const localeCopy = {
    'zh-Hant': {
      source: '原始資料',
      read: '閱讀本站整理',
      original: '原始報導',
      unavailable: '圖片暫時無法載入。', items: Object.values(reports)
    },
    'zh-Hans': {
      source: '原始资料',
      read: '阅读本站整理',
      original: '原始报道',
      unavailable: '图片暂时无法载入。', items: Object.values(reports)
    },
    en: {
      source: 'Original source',
      read: 'Read our brief',
      original: 'Original report',
      unavailable: 'The image is temporarily unavailable.', items: Object.values(reports)
    },
    ja: {
      source: '原資料',
      read: '本サイトの整理を読む',
      original: '元の報道',
      unavailable: '画像を読み込めません。', items: Object.values(reports)
    }
  };

  function locale() {
    const declared = (document.documentElement.lang || 'zh-Hant').toLowerCase();
    if (declared.startsWith('zh-hans') || declared.startsWith('zh-cn')) return 'zh-Hans';
    if (declared.startsWith('en')) return 'en';
    if (declared.startsWith('ja')) return 'ja';
    return 'zh-Hant';
  }

  function formatDate(value, language) {
    const tag = language === 'zh-Hant' ? 'zh-TW' : language === 'zh-Hans' ? 'zh-CN' : language;
    try {
      return new Intl.DateTimeFormat(tag, { year: 'numeric', month: '2-digit', day: '2-digit' })
        .format(new Date(`${value}T12:00:00+08:00`));
    } catch (_) {
      return value.replaceAll('-', '.');
    }
  }

  function makeLink(className, href, text, external = false) {
    const link = document.createElement('a');
    link.className = className;
    link.href = href;
    link.textContent = text;
    if (external) {
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    }
    return link;
  }

  function renderCard(item, words, language, index) {
    const article = document.createElement('article');
    article.className = 'news-card';
    article.dataset.date = item.date;
    article.style.setProperty('--news-order', String(index + 1));

    const figure = document.createElement('figure');
    figure.className = 'news-card-media';
    const photo = document.createElement('img');
    photo.src = item.image;
    photo.alt = item.alt[language];
    photo.loading = index === 0 ? 'eager' : 'lazy';
    photo.decoding = 'async';
    const credit = document.createElement('figcaption');
    credit.className = 'news-photo-credit';
    credit.textContent = item.credit?.[language] || (language === 'zh-Hant' ? '紙雕與陶土藝術意象，非事件現場' : language === 'zh-Hans' ? '纸雕与陶土艺术意象，非事件现场' : language === 'ja' ? '紙彫刻と粘土のイメージ（現場写真ではありません）' : 'Paper-and-clay artwork; not an event photograph');
    photo.addEventListener('error', () => {
      photo.hidden = true;
      figure.classList.add('is-photo-unavailable');
      credit.textContent = words.unavailable;
    }, { once: true });
    figure.append(photo, credit);

    const body = document.createElement('div');
    body.className = 'news-card-body';
    const meta = document.createElement('div');
    meta.className = 'news-card-meta';
    const time = document.createElement('time');
    time.dateTime = item.date;
    time.textContent = formatDate(item.date, language);
    const publisher = document.createElement('span');
    publisher.textContent = item.publisher[language];
    meta.append(time, publisher);

    const title = document.createElement('h3');
    const articleUrl = typeof item.article === 'string' ? item.article : item.article[language];
    const titleLink = makeLink('', articleUrl, item.title[language]);
    title.appendChild(titleLink);
    const summary = document.createElement('p');
    summary.textContent = item.summary[language];

    const actions = document.createElement('div');
    actions.className = 'news-card-actions';
    actions.append(
      makeLink('news-read-link', articleUrl, `${words.read} →`),
      makeLink('news-source-link', item.source, `${words.original} ↗`, true)
    );

    body.append(meta, title, summary, actions);
    article.append(figure, body);
    return article;
  }

  function init() {
    const grid = document.getElementById('newsDeskGrid');
    if (!grid || grid.dataset.rendered === 'true') return;
    const language = locale();
    const words = localeCopy[language] || localeCopy['zh-Hant'];
    const items = [...words.items].sort((a, b) => {
      const dateDifference = Date.parse(`${b.date}T12:00:00+08:00`) - Date.parse(`${a.date}T12:00:00+08:00`);
      return dateDifference || a.priority - b.priority;
    });
    grid.replaceChildren(...items.map((item, index) => renderCard(item, words, language, index)));
    grid.dataset.rendered = 'true';
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
