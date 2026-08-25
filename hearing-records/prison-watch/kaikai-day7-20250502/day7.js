const day7DialogueSection=document.querySelector('#dialogue');
if(day7DialogueSection&&!day7DialogueSection.querySelector('.day7-pdf-source-figure')){
  const figure=document.createElement('figure');
  figure.className='day7-pdf-source-figure';
  figure.innerHTML='<img src="../../../assets/source/prison-watch-day7-special-issue-image-p52-20250502.png" alt="監所關注小組十天旁聽全紀錄特刊第52頁DAY7所附圖片" width="740" height="624" loading="lazy" decoding="async"><figcaption>原始特刊圖片｜第52頁（DAY7首頁）｜資料來源：監所關注小組</figcaption>';
  day7DialogueSection.querySelector(':scope > header')?.after(figure);
}

const crosschecks=[
 {t:'看見罰站與照顧頻率',a:'稱只有中午下樓，未叫A童罰站，也不知道Mira為何說A童由她照顧時不敢動、不敢玩。',b:'Mira證述A童經常未穿衣服整天罰站；檢方並主張劉若琳每天午餐時段在甲地，能看到大多數狀況。',f:'落差｜出入頻率、可見範圍，以及是否具有實際照顧或支配能力。'},
 {t:'「我放東西後再去揍」',a:'劉若琳解釋只是說說，實際沒有揍。',b:'提示乙證4對話：劉彩萱問「妳沒揍他？要揍啊」，劉若琳回覆「我放東西後再去揍」。',f:'落差｜訊息文字的通常語意，與當庭主張只是口頭說法之間。'},
 {t:'澡盆翻出幾次與是否持續放回',a:'稱「反ㄎ一ㄠ」指第三個往後仰動作，自己有扶護孩子；檢視筆錄後仍稱不是筆錄所寫的意思。',b:'113年2月6日偵訊筆錄記載「A出來我再讓他進去」及「他是掉出來三次」。',f:'落差｜當庭對用語的解釋，與先前筆錄所記動作次數及處置。'},
 {t:'孩子倒地後做了什麼',a:'稱曾問劉彩萱為何這樣，並叫她出來看；辯方另主張曾鬆綁、扶起、帶到客廳陪睡。',b:'Mira證述A童躺在地板、腳頂著門時，劉若琳只把孩子腳移開；檢方據此追問為何未讓孩子起身或坐下。',f:'落差｜當下處置究竟只有移腳、曾詢問，或已完整解除危險。'},
 {t:'頸部刮傷與孩子反應',a:'承認指甲較長，稱換衣時孩子沒哭，後來看到照片才發現；隔天有擦藥。',b:'國民法官提示照片與衣服血漬，追問若同樣傷勢發生在自己身上會如何；劉若琳答稱擔心機構不再讓她帶孩子。',f:'落差｜是否能在當下察覺明顯傷勢，以及第一反應偏向照護或資格風險。'},
 {t:'A童是否玩大便',a:'稱親眼看到A童手上有大便、已塗得到處都是。',b:'審判長追問時，劉若琳又稱劉彩萱只說過A童會脫尿布，不記得曾說會玩大便。',f:'核對點｜親眼見聞與「劉彩萱曾怎麼說」是不同命題，頁面分開保留。'},
 {t:'「今天沒吃東西、肚子不見了」',a:'稱只是看到肚子變小，推想是不是沒吃東西。',b:'檢方論告結合不正常餵食、隔夜食物與醫師對營養不良的意見，主張劉若琳知情卻未介入。',f:'落差｜看見外觀改變後，是否僅為觀察，或已足以促成詢問、通報與救助。'},
 {t:'自傷說法與跨專業證詞',a:'當庭對精神鑑定、法醫及兒童醫師意見表示沒有意見。',b:'前保母稱未見自傷；呂立醫師指傷勢位置不同於一般意外；丘彥南醫師稱嚴重自傷常見於嚴重神經發展障礙或嚴重受虐兒童。',f:'勾稽｜「自傷」不能只作替代解釋，仍需與既往照顧史、傷勢型態及精神鑑別合看。'}
];

const chapters=[
 {title:'01｜續行審理：檢察官訊問劉若琳',html:`
 <p>法院接續4月30日未完成事項，由檢察官訊問被告劉若琳。</p>
 <div class="qa"><div><b>檢察官</b>妳看A童站2、3小時，是否有帶他離開？</div><div><b>原始紀錄</b>回答欄空白；公開紀錄未載答案，不自行補答。</div></div>
 <div class="qa"><div><b>檢察官</b>Mira說劉彩萱單獨把A留給妳那次（提示乙證2-7，113年4月2日偵訊筆錄），筆錄記載「外傭說，A經常沒穿衣服整天罰站」、「對我有幫忙顧」。</div><div><b>劉若琳</b>我沒叫A罰站，不知Mira為何如此說。</div></div>
 <div class="qa"><div><b>檢察官</b>是否看過劉彩萱帶A童去廁所餵食？是否聽到哭聲、尖叫聲？</div><div><b>劉若琳</b>只看過一次，當時我幫忙顧另一個；哭聲也只聽過一次。</div></div>
 <div class="qa"><div><b>檢察官</b>妳說沒去過乙地，怎麼知道有綠色巧拼？</div><div><b>劉若琳</b>因為以前開過托兒所，所以知道有綠色巧拼。</div></div>
 <div class="qa"><div><b>檢察官</b>劉彩萱一手掰嘴、一手拿湯匙，妳有協助嗎？</div><div><b>劉若琳</b>不是我。</div></div>
 <p>劉若琳並說明日常：08:00左右到甲地上香、看父親，再上樓餵奶與準備孩子外出；13:00在甲地吃飯，之後回丙地休息。她承認A童曾在丙地洗澡、大小便。</p>
 <div class="qa"><div><b>檢察官</b>訊息中「我家被他臭」是什麼意思？</div><div><b>劉若琳</b>A童尿布打開一邊，用手抹大便在巧拼和牆壁。</div></div>
 <div class="qa"><div><b>檢察官</b>Mira說A童被妳照顧時不敢動、也不敢玩。</div><div><b>劉若琳</b>我都背對A童，Mira在房間，不知她為何這樣說。</div></div>
 <div class="qa"><div><b>檢察官</b>對話裡妳說「我放東西後再去揍」，為何這樣說？</div><div><b>劉若琳</b>我只是講，沒有揍。</div></div>
 <p>她否認隔離A童，也稱口罩是劉彩萱帶來時已戴著，理由是流鼻涕。</p>`},
 {title:'02｜頸部刮傷、澡盆與「裝死」',html:`
 <div class="qa"><div><b>檢察官</b>112年9月7日脖子後方劃傷，情況為何？</div><div><b>劉若琳</b>換衣時A童沒有哭，後來看到照片才發現；承認指甲較長。隔天有擦藥。</div></div>
 <div class="qa"><div><b>檢察官</b>那麼大的傷口，當下都未表現痛？</div><div><b>劉若琳</b>真的沒有。</div></div>
 <p>被問到凌晨四時的澡盆事件，她稱時間不記得。對「反ㄎ一ㄠ」的意思，稱是孩子腳撐著往後、自己有去扶。</p>
 <div class="qa"><div><b>檢察官</b>先前筆錄寫「A出來我再讓他進去」「他是掉出來三次」，是否表示掉出來三次？</div><div><b>劉若琳</b>聽不懂；當時有表達不是這個意思。檢視筆錄後仍稱真的不是此意，自己有護著A童。</div></div>
 <div class="qa"><div><b>檢察官</b>妳說解開束縛並唱歌，又稱A童「裝死」，是何意？</div><div><b>劉若琳</b>指A童掉出來，以「裝死」形容。</div></div>
 <div class="qa"><div><b>檢察官</b>Mira說A童躺地、腳頂著門，妳能移動腳，為何不讓他起來或坐下？</div><div><b>劉若琳</b>我有問劉彩萱為何這樣，也叫她出來看，她說好。</div></div>`},
 {title:'03｜照片、包裹與醫師意見',html:`
 <p>檢方以112年11月5日凌晨照片追問為何劉彩萱與A童在丙地。劉若琳辯護人異議，審判長認為單由照片無法看出拍攝時點，裁定異議成立。</p>
 <div class="qa"><div><b>檢察官</b>4月28日證述11月2日在丙地掰開A童嘴巴，為何需兩人？</div><div><b>劉若琳</b>劉彩萱請我拍照。</div></div>
 <div class="qa"><div><b>檢察官</b>甲證12-9顯示A童未穿衣服躺在磨石子地板，有無壓住使他不反抗？</div><div><b>劉若琳</b>沒有。</div></div>
 <div class="qa"><div><b>檢察官</b>為何在孩子清醒時包裹？</div><div><b>劉若琳</b>要下樓，怕他動而不安全。</div></div>
 <div class="qa"><div><b>檢察官</b>對精神鑑定、法醫、兒童醫師意見有無意見？</div><div><b>劉若琳</b>沒有。</div></div>
 <p>被問A童會說哪些話，她回答「阿嬤」、若干聲音，以及一句不雅語。09:55休庭，10:10入庭。</p>`},
 {title:'04｜國民法官詢問',html:`
 <p><strong>3號國民法官</strong>詢問托育年資、是否與社工討論A童異常，以及機構聯繫管道。劉若琳稱自112年4月開始承接兒福聯盟幼童；沒有就A童照顧方式與社工討論，只在劉彩萱請求時幫忙。她看過陳社工，但應未向其反映A童異狀；曾提醒劉彩萱反映，而自己的社工只討論自己帶的孩子，聯繫方式為LINE。</p>
 <p><strong>6號國民法官</strong>問是否害怕劉彩萱；劉若琳答：「她脾氣發起來很可怕。」</p>
 <p><strong>備位1號</strong>問是否親眼見過A童玩大便、為何先到丙地再去甲地；她稱看到A童手上有大便、已塗得到處都是，並稱劉彩萱持有丙地鑰匙，可隨時進出。</p>
 <p><strong>4號國民法官</strong>以頸部傷照及衣服血漬追問。劉若琳稱當時嚇到，怕兒福聯盟不再讓她帶孩子，隔天有擦藥；對「真的不能讓他太自由」解釋為建立規律、溝通與常規。</p>`},
 {title:'05｜審判長詢問與沉默',html:`
 <div class="qa"><div><b>審判長</b>何時搬到丙地？A童除劉彩萱外還有誰照顧？</div><div><b>劉若琳</b>約111年端午節後；主要是劉彩萱，我偶爾也會。</div></div>
 <div class="qa"><div><b>審判長</b>「一定會走樣」是何意？</div><div><b>劉若琳</b>因為去宮廟收驚等事，突然想到打上去。</div></div>
 <div class="qa"><div><b>審判長</b>「你玩不過他，他有政府認證」是何意？</div><div><b>原始紀錄</b>被告未答話，筆錄記載被告不語。</div></div>
 <div class="qa"><div><b>審判長</b>「今天沒吃東西」「肚子不見了」是何意？</div><div><b>劉若琳</b>A童看起來肚子較小，是不是沒吃東西才不見。</div></div>
 <div class="qa"><div><b>審判長</b>劉彩萱是否說過A童會玩大便？</div><div><b>劉若琳</b>只說過會脫尿布，不記得有說會玩大便。</div></div>
 <p>審判長請國民法官退庭，確認檢方事實及法律辯論所需時間，暫休至10:50。</p>`},
 {title:'06｜檢察官事實及法律辯論',html:`
 <p>檢方先以兒童脆弱性與受保護的普世價值為起點，提出四大爭點：A童為何死亡、兩名被告做了什麼、行為與死亡的因果關係，以及行為的法律評價。</p>
 <ol><li><strong>死因：</strong>主張低血容性休克、血管外組織液與血液淤積，營養不良導致血管塌陷。</li><li><strong>交接前狀態：</strong>A童先後由外婆、蕭保母、周保母照顧；交接前檢查無異狀、無傷。</li><li><strong>綑綁：</strong>列舉9月17日、10月1日等照片及對話，主張劉若琳知情、評論、追問工具與狀況而未救助。</li><li><strong>罰站：</strong>大量引用Mira證詞，主張其長時間在場、可信度高；並主張劉若琳每日午餐出入甲地，可看到狀況及追蹤乙地罰站策略。</li><li><strong>毆打與傷勢：</strong>包含推頭、拍打足底、長柄狀物及頸部刮傷；檢方主張兩人未即時通報並試圖掩蓋。</li><li><strong>不正常餐食：</strong>主張A童在廁所進食鍋巴泥、隔夜菜、被掰嘴灌食，與其他孩子不同。</li></ol>
 <p>檢方以許倬憲、呂立及丘彥南三位醫師意見，主張不當對待具有反覆、持續性並造成死亡結果；前保母未見自傷、傷勢位置與一般意外不同，嚴重自傷亦須置於嚴重受虐或神經發展障礙的鑑別脈絡。</p>
 <p>法律評價上，檢方主張兩人具犯意聯絡、行為分擔與保證人地位，消極不阻止亦可能構成共同正犯；又以共同托育經驗主張兩人對死亡結果具有較高預見可能性。以上均為檢方論告，非本頁認定。</p>`},
 {title:'07｜劉彩萱辯護人事實及法律辯論',html:`
 <p>辯方以「被無視的照顧現場／月球的背面」為題，主張劉彩萱並非孩子最熟悉的保母、交接資訊不足，且原申請照顧0歲幼兒，未被告知慢熟、陌生人焦慮、呼吸道感染、全身緊繃與說不雅語等情況。</p>
 <p>辯方依時間序列列出：9月1日發現異常、9月4日確認說不雅語、9月17日首次綁A童、9月下旬目擊向後倒、9月27日與10月1日再次綁、10月4日友人勸停、10月下旬訪視時表達無力、10月25日向社工求助等。</p>
 <p>辯方主張她曾以鼓勵進食、看影片、照護傷勢、詢問假牙與尋求宗教協助等方式嘗試照顧；但在無人接手下使用錯誤的「土法煉鋼」，越試越錯。最後要求法庭思考：她是做錯事、不專業的保母，但是否因此等同「邪惡」。以上均為辯方主張。</p>`},
 {title:'08｜劉若琳辯護人事實及法律辯論',html:`
 <p>辯方首先主張「信任蒙蔽她的雙眼」：兩人為親近姊妹，曾共同經營幼兒園、任職公托，過往未被投訴，劉彩萱亦照顧過劉若琳之子。因長期信任、觀察時點有限及對孩子異常狀況的理解，劉若琳未能看到甲地廁所與罰站全貌。</p>
 <p>辯方主張，訊息如同一般人在群組抱怨；劉若琳縱有不謹慎、不細心、不專業，也不應將劉彩萱行為全部歸責於她。</p>
 <p><strong>風險降低：</strong>辯方稱112年9月7日頸部刮傷僅成立過失傷害；11月2日曾扶起、護住、鬆綁、帶至客廳、蓋被並陪睡，屬降低風險。審判長提醒此概念不在審前說明指示內。</p>
 <p><strong>共同正犯：</strong>辯方主張欠缺事前共謀、犯意聯絡與行為分擔；審判長另提示，行為分擔由一人實行時，全體仍可能成立共同正犯。</p>
 <p><strong>保證人地位：</strong>辯方主張劉若琳不具法律義務、契約約定或事實承擔，因此不具保證人地位；原始紀錄亦載審判長提示此部分與審前說明不同。以上均屬辯方法律主張，最終由法院判斷。</p>`}
];

const crosscheckGrid=document.querySelector('#crosscheckGrid');if(crosscheckGrid&&!crosscheckGrid.children.length)crosscheckGrid.innerHTML=crosschecks.map((x,i)=>`<article class="cross-card"><header><b>${String(i+1).padStart(2,'0')}</b><div><h3>${x.t}</h3></div></header><div class="cross-sides"><section><strong>劉若琳當庭回答</strong>${x.a}</section><i>↔</i><section><strong>其他證述／紀錄／主張</strong>${x.b}</section></div><footer>${x.f}</footer></article>`).join('');
const recordList=document.querySelector('#recordList');if(recordList&&!recordList.children.length)recordList.innerHTML=chapters.map((x,i)=>`<details ${i===0?'open':''}><summary>${x.title}</summary><div class="record-content">${x.html}</div></details>`).join('');
document.querySelectorAll('[data-action]').forEach(b=>b.addEventListener('click',()=>document.querySelectorAll('#recordList details').forEach(d=>d.open=b.dataset.action==='open')));
const top=document.querySelector('.top'),menu=document.querySelector('#menu');menu.addEventListener('click',()=>{const open=top.classList.toggle('is-open');menu.setAttribute('aria-expanded',open)});document.querySelectorAll('.top nav a').forEach(a=>a.addEventListener('click',()=>top.classList.remove('is-open')));
if(!matchMedia('(prefers-reduced-motion:reduce)').matches&&'IntersectionObserver'in window){document.querySelectorAll('.section>header,.facts article,.cards article,.route article,.cross-card,.arguments article,.record details,.source-grid article').forEach(x=>x.classList.add('reveal'));const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.animate([{opacity:0,transform:'translateY(18px)'},{opacity:1,transform:'none'}],{duration:650,fill:'forwards',easing:'cubic-bezier(.2,.8,.2,1)'});io.unobserve(e.target)}}),{threshold:.08});document.querySelectorAll('.reveal').forEach(x=>io.observe(x));}
