(()=> {
  const lang=document.documentElement.lang||'zh-Hant';
  const items={
    'zh-Hant':{
      brand:'護童行動聯盟', meta:'置頂護童快報｜2026.11.17',
      title:'球場之外，少年支持如何接力？',
      lead:'臺南地院公布觀護盃壘球賽已舉行。<strong>活動已舉行；它不是少年復歸成效的證明。</strong>',
      tags:['少年司法','支持網絡','制度追蹤'],
      verified:'已核實：活動已舉行、主辦與參與單位，以及法院所說明的陪伴與運動理念。',
      unknown:'尚不可推論：活動已降低再涉險或再犯、所有參與少年均取得後續資源，或活動等同個案處遇成果。',
      h1:'已核實：這場活動做了什麼？',
      p1:'臺南地方法院表示，臺南市觀護協會主辦的「115 年度台南觀護盃壘球賽」已舉行；參與者包括需要關懷支持的少年、司法與民間團體。活動以團隊運動、紀律與正向競賽作為陪伴的一環。',
      p2:'官方內容確認的是活動及其設計理念，並不涉及任何特定少年的身分、經歷或個案處遇評價。',
      h2:'值得肯定的，不該被誇大',
      p3:'非審判、非處分的場域，可能讓少年與支持者一起練習信任、規律與歸屬。少年司法不應只留下標籤，也要把支持接回生活、學校、家庭與社區。',
      p4:'但一次活動無法回答支持是否持續、是否可近，也不能證明再涉險或再犯已下降。<strong>尊重與鼓勵是起點；穩定的轉銜與服務才是制度要追問的後續。</strong>',
      h3:'接下來要看什麼？',
      p5:'主辦與司法網絡可在不揭露個資的前提下，說明是否有持續參與與後續陪伴、教育／就業／心理健康資源是否可近、參與是否自願，以及不同需求的少年能否平等進入支持網。',
      source:'臺灣臺南地方法院｜為青春搭建發光的舞台！「台南觀護盃壘球賽」熱血開打（2026.11.16）',
      back:'回首頁'
    },
    'zh-Hans':{
      brand:'护童行动联盟', meta:'置顶护童快报｜2026.11.17',
      title:'球场之外，少年支持如何接力？',
      lead:'台南地院公布观护杯垒球赛已经举行。<strong>活动已举行；它不是少年复归成效的证明。</strong>',
      tags:['少年司法','支持网络','制度追踪'],
      verified:'已核实：活动已举行、主办与参与单位，以及法院说明的陪伴与运动理念。',
      unknown:'尚不可推论：活动已降低再涉险或再犯、所有参与少年均取得后续资源，或活动等同个案处遇成果。',
      h1:'已核实：这场活动做了什么？',
      p1:'台南地方法院表示，台南市观护协会主办的“115 年度台南观护杯垒球赛”已经举行；参与者包括需要关怀支持的少年、司法与民间团体。活动以团队运动、纪律与正向竞赛作为陪伴的一环。',
      p2:'官方内容确认的是活动及其设计理念，并不涉及任何特定少年的身分、经历或个案处遇评价。',
      h2:'值得肯定的，不该被夸大',
      p3:'非审判、非处分的场域，可能让少年与支持者一起练习信任、规律与归属。少年司法不应只留下标签，也要把支持接回生活、学校、家庭与社区。',
      p4:'但一次活动无法回答支持是否持续、是否可及，也不能证明再涉险或再犯已经下降。<strong>尊重与鼓励是起点；稳定的转衔与服务才是制度要追问的后续。</strong>',
      h3:'接下来要看什么？',
      p5:'主办与司法网络可在不透露个人信息的前提下，说明是否有持续参与与后续陪伴、教育／就业／心理健康资源是否可及、参与是否自愿，以及不同需求的少年能否平等进入支持网。',
      source:'台湾台南地方法院｜为青春搭建发光的舞台！“台南观护杯垒球赛”热血开打（2026.11.16）',
      back:'回首页'
    },
    en:{
      brand:'Child Protection Action Alliance', meta:'PINNED CHILD-PROTECTION BRIEF · 17 NOV 2026',
      title:'Beyond the field: how does support stay with a young person?',
      lead:'Tainan District Court reported that a probation softball event took place. <strong>The event is verified; it is not proof of reintegration outcomes.</strong>',
      tags:['Youth justice','Support networks','Policy watch'],
      verified:'Confirmed: the event occurred, its host and participants, and the court’s stated rationale of accompaniment through sport.',
      unknown:'Not established: reduced future risk or reoffending, continuing services for every participant, or an individual outcome.',
      h1:'Verified: what happened?',
      p1:'Tainan District Court reported that the Tainan Probation Association held the 2026 Tainan Probation Cup softball event. The court described young people needing support, justice-sector colleagues and civil-society groups taking part; team sport, discipline and positive competition formed one part of accompaniment.',
      p2:'The official account verifies the event and its stated purpose. It does not identify any young person or establish an individual outcome.',
      h2:'A positive setting should not be overstated',
      p3:'A non-court, non-sanction setting can offer room to practise trust, routine and belonging with supportive adults. Youth justice should reconnect support with daily life, school, family and community—not leave only a label.',
      p4:'One event cannot show whether support continues or is accessible, nor whether future risk or reoffending has fallen. <strong>Respect and encouragement are a start; sustained transition support is the public question that follows.</strong>',
      h3:'What should be followed next?',
      p5:'Without identifying anyone, organisers and the justice network can explain whether participation and follow-up continue, whether education, employment and mental-health resources are accessible, whether participation is voluntary, and whether young people with different needs can enter support equitably.',
      source:'Tainan District Court | Building a stage for youth: the Tainan Probation Cup softball event (16 Nov 2026)',
      back:'Home'
    },
    ja:{
      brand:'子ども保護アクション連盟', meta:'固定・子ども保護速報｜2026年11月17日',
      title:'グラウンドの外で、少年への支援をどうつなぐか？',
      lead:'台南地方法院は観護杯ソフトボール大会が実施されたと公表しました。<strong>大会の実施は確認済みですが、社会復帰の成果を示すものではありません。</strong>',
      tags:['少年司法','支援ネットワーク','制度追跡'],
      verified:'確認済み：大会の実施、主催・参加団体、裁判所が説明したスポーツを通じた伴走の理念。',
      unknown:'確認できないこと：再リスク・再非行の低下、全参加者への継続支援、個別処遇の成果。',
      h1:'確認済み：何が行われたのか？',
      p1:'台南地方法院は、台南市観護協会が「115年度台南観護杯ソフトボール大会」を開催したと発表しました。支援を必要とする少年、司法関係者、民間団体が参加し、チームスポーツ、規律、前向きな競争を伴走の一部と位置付けています。',
      p2:'公式発表で確認できるのは大会とその理念です。特定の少年の身元、経歴、個別の処遇評価を示すものではありません。',
      h2:'前向きな場を過大評価しない',
      p3:'裁判や処分とは異なる場で、支援者と信頼、生活のリズム、居場所を学ぶ機会になり得ます。少年司法はラベルだけを残すのではなく、日常、学校、家族、地域へ支援をつなぐべきです。',
      p4:'一度の大会から支援の継続性や利用しやすさ、再リスク・再非行の低下は分かりません。<strong>尊重と励ましは出発点であり、安定した移行支援が次の制度課題です。</strong>',
      h3:'次に追跡すべきこと',
      p5:'個人を特定せず、主催者と司法ネットワークは参加・伴走が続くか、教育・就労・心の健康の資源にアクセスできるか、参加が自発的か、異なるニーズを持つ少年が公平に支援へ入れるかを示すことができます。',
      source:'台湾台南地方法院｜青春のための舞台づくり：「台南観護杯ソフトボール大会」開催（2026年11月16日）',
      back:'ホーム'
    }
  };
  const c=items[lang]||items['zh-Hant'];
  const root='/child-advocacy-site/';
  const heroImage='/child-advocacy-site/assets/art/tainan-probation-baseball-support-20261117.jpg?v=20261117-1';
  const base=root+'news/tainan-probation-baseball-support-20261116/';
  const routes={'zh-Hant':base,'zh-Hans':base+'zh-Hans/','en':base+'en/','ja':base+'ja/'};
  const labels={'zh-Hant':'繁中','zh-Hans':'简中','en':'EN','ja':'日本語'};
  document.title=c.title+'｜'+c.brand;
  document.head.insertAdjacentHTML('beforeend','<style>:root{--ink:#123f45;--paper:#fbf6ec;--clay:#a26349;--gold:#bd9253;--line:#d7c9ad}*{box-sizing:border-box}body{margin:0;background:radial-gradient(circle at 80% 5%,#e7eee2 0,transparent 30%),var(--paper);color:var(--ink);font:18px/1.9 system-ui,\"Noto Sans TC\",\"Noto Sans SC\",sans-serif}.wrap{width:min(980px,calc(100% - 36px));margin:auto}header{padding:18px 0;border-bottom:1px solid var(--line)}.brand{font-weight:850;color:var(--ink);text-decoration:none}.langs{display:flex;gap:7px;flex-wrap:wrap;margin-top:10px}.langs a{border:1px solid var(--line);padding:3px 9px;color:var(--ink);font-size:13px;text-decoration:none}.langs a[aria-current]{background:var(--ink);color:#fff}.hero{padding:52px 0 28px}.meta{font-weight:800;font-size:14px;letter-spacing:.05em;color:#83543f}.hero-grid{display:grid;grid-template-columns:1.1fr .9fr;gap:34px;align-items:center}.art{aspect-ratio:1.25;background:linear-gradient(145deg,#163f44,#255e61);border-radius:28px;overflow:hidden;box-shadow:0 18px 38px #173c3b33;position:relative}.art:before{content:\"\";position:absolute;inset:12%;border:2px solid #c99d5c;border-radius:48% 52% 42% 58%;transform:rotate(-10deg)}.art:after{content:\"\";position:absolute;width:180%;height:25%;left:-40%;bottom:22%;background:repeating-linear-gradient(90deg,transparent 0 32px,#e9dbc1 34px 37px,transparent 39px 67px);transform:rotate(-14deg);opacity:.85}.ball{position:absolute;width:88px;height:88px;border:3px solid #eddbbd;border-radius:50%;top:18%;right:19%;box-shadow:inset 0 0 0 10px #bb744e}.gold{position:absolute;width:2px;height:115%;background:#c99d5c;left:44%;top:-8%;transform:rotate(32deg)}h1{font-size:clamp(32px,5vw,58px);line-height:1.14;margin:10px 0 18px}h2{font-size:29px;line-height:1.3;margin-top:44px}h3{font-size:24px;margin-top:38px}.lead{font-size:21px}.tags{display:flex;gap:8px;flex-wrap:wrap}.tags span{padding:4px 11px;border-radius:999px;background:#e6eee6;font-size:14px;font-weight:750}strong{background:linear-gradient(transparent 58%,#f4ce73 58%)}.facts{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin:28px 0}.fact{border-left:5px solid var(--gold);background:#fffaf0;padding:16px;border-radius:0 12px 12px 0}.fact b{display:block;margin-bottom:5px}.source{margin:42px 0;padding:20px;border-top:1px solid var(--line);border-bottom:1px solid var(--line);font-size:15px}.source a{color:#754d34;font-weight:800}@media(max-width:700px){body{font-size:17px}.hero{padding-top:32px}.hero-grid,.facts{grid-template-columns:1fr}.art{max-width:430px;margin:auto}h1{font-size:38px}}</style>');
  document.head.insertAdjacentHTML('beforeend','<style>.art{margin:0;background:#d9c5a1}.art:before,.art:after{display:none}.art img{display:block;width:100%;height:100%;object-fit:cover;object-position:center;transform:scale(1.015);transition:transform .7s ease}.art:hover img{transform:scale(1.05)}</style>');
  const langLinks=Object.keys(routes).map(k=>'<a '+(k===lang?'aria-current=\"page\"':'')+' href=\"'+routes[k]+'\">'+labels[k]+'</a>').join('');
  document.body.innerHTML='<header><div class=\"wrap\"><a class=\"brand\" href=\"'+root+'\">'+c.brand+'</a><nav class=\"langs\" aria-label=\"Languages\">'+langLinks+'</nav></div></header><main class=\"wrap\"><section class=\"hero\"><div class=\"hero-grid\"><div><div class=\"meta\">'+c.meta+'</div><h1>'+c.title+'</h1><p class=\"lead\">'+c.lead+'</p><div class=\"tags\">'+c.tags.map(x=>'<span>'+x+'</span>').join('')+'</div></div><div class=\"art\" role=\"img\" aria-label=\"Abstract contemporary ink and paper illustration\"><i class=\"gold\"></i><i class=\"ball\"></i></div></div></section><section class=\"facts\"><div class=\"fact\"><b>✓</b>'+c.verified+'</div><div class=\"fact\"><b>!</b>'+c.unknown+'</div></section><article><h2>'+c.h1+'</h2><p>'+c.p1+'</p><p>'+c.p2+'</p><h2>'+c.h2+'</h2><p>'+c.p3+'</p><p>'+c.p4+'</p><h3>'+c.h3+'</h3><p>'+c.p5+'</p></article><footer class=\"source\"><b>Source</b><br><a href=\"https://tnd.judicial.gov.tw/\" rel=\"noopener noreferrer\">'+c.source+'</a><br><br><a href=\"'+root+'\">← '+c.back+'</a></footer></main>';
  const hero=document.querySelector('.art');
  hero.innerHTML='<img src=\"'+heroImage+'\" alt=\"'+c.title+'\">';
  hero.removeAttribute('role');
  hero.removeAttribute('aria-label');
})();
