const topbar=document.querySelector('.top');
const menu=document.querySelector('#menu');
menu?.addEventListener('click',()=>{const open=topbar.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));});
document.querySelectorAll('.top a').forEach(a=>a.addEventListener('click',()=>topbar.classList.remove('open')));
const day6RecordSection=document.querySelector('#reconstructed-record');
if(day6RecordSection&&!day6RecordSection.querySelector('.day6-pdf-source-figure')){
  const figure=document.createElement('figure');
  figure.className='day6-pdf-source-figure';
  figure.innerHTML='<img src="/child-advocacy-site/assets/source/prison-watch-day6-pdf-image-p1-20250430.png" alt="DAY6原始PDF第1页所附图片" width="740" height="680" loading="lazy" decoding="async"><figcaption>原始 PDF 图片｜第1页｜资料来源：监所关注小组</figcaption>';
  day6RecordSection.querySelector(':scope > header')?.after(figure);
}
const recordChapters=[
  {n:'01',time:'09:07',title:'续行审理｜鉴定程序与资料基础',intro:'检察官欲提示周保母拍摄之甲证85照片并描述衣服等，审判长制止，改由鉴定人说明。丘彦南医师以鉴定人身分具结。',points:[
    '丘医师于2022年退休，为台湾儿童青少年精神医学会顾问、前理事长，曾成立司法精神鉴定委员会，主责儿少司法精神鉴定逾百例。',
    '鉴定程序包含113年12月13日伤势鉴定讨论、全侦查卷宗、影音及相关资料。',
    '精神鉴定结果：A童受凌虐均符合，并高度怀疑有性虐待。鉴定同时说明疏忽、性虐待与儿少身体虐待的工作定义。'
  ]},
  {n:'02',time:'解说先行',title:'精神虐待、严重疏忽与回溯性诊断',points:[
    '精神虐待样态包括：隔离、威胁、长时间罚站、限制行动、体罚、不让A童与他人沟通互动；捆绑身体躯干及四肢并置于磨石子地板；A童闭眼或神情无神。',
    '严重疏忽包括危险环境、冷漠对待、不拥抱、不安抚、不提供适足玩具与互动游戏、洗冷水及不能睡等；资料来源包括Mira证词、手机内容及被告社群媒体对话。',
    'A童于1岁6个月至1岁10个月期间出现恐惧、空洞及悲伤表情；资料亦包含阴茎照片、哭声相关证述、Mira证词及其与友人传讯纪录。',
    '对于「自残、骂脏话、撞头」说法，鉴定认为可信度仍待证；若确实存在，在排除神经发展障碍与脑神经病变后，反而支持严重多重虐待及疏忽。',
    '回溯性诊断暂给「非特定的忧郁症」，至少达「适应障碍并发忧郁症」；反应性依附障碍及创伤后压力症因资料不足，以「很可能符合」呈现。'
  ]},
  {n:'03',time:'影音资料',title:'创伤判断的影像基础与鉴定总结',points:[
    '5秒罚站影片；6秒影片中A童未穿衣服、另一名儿童穿长袖；IMG-463影片中两童玩摇摇马，A童持续淡漠、落寞、缺乏笑容并数次疑惧看向拍摄者。',
    '另有由钢琴上往下拍摄的5秒影片、A童戴黑色口罩独坐墙面与衣柜间角落的41秒影片，以及两童坐在床上愉悦互动、身体发育均匀且未见疤痕的9秒影片。',
    '鉴定总结：大量多方人证、物证支持A童在被告全时照顾期间遭受长期、严重、多重虐待；生前精神诊断至少达适应障碍并发忧郁症，并诊断非特定忧郁症。'
  ]},
  {n:'04',time:'09:50',title:'检察官主诘问',qa:[
    ['是否亲自撰写并看过录影等资料？','是。报告由本人撰写并获中心认可；幼儿愈小愈难表达，临床须依发展阶段并透过亲近照顾者及间接资料评估。'],
    ['A童先前是否可能已有精神症状、自闭症或脑神经病变？','资料不支持。不是自闭症，也不是智能障碍。'],
    ['A童说脏话是否可能是模仿或仿音？','此发展阶段大约只能讲两个字；不一定要一直处于该环境才会学到，但须综合资料判断。'],
    ['是否参考Mira证词与喂食、威胁等内容？','包括但不限于Mira证词。身体伤势鉴定、工具与待遇均会综合判断；庭上提示证词前仍须遵守诘问规则。'],
    ['没有适当喂食会如何影响发展？','依年龄与长牙阶段，应吃固体食物练习咀嚼；笔录记载A童食物被打成泥。'],
    ['吹风机吹脸是否属正常育儿方式？','不是正常育儿方式。'],
    ['对鉴定报告是否确定？两名被告责任能否区分？','对鉴定非常确定；无法百分之百区分任何一人如何虐待，但有「共同知情」，部分可略微区分、部分无法分开。'],
    ['鉴定结果为何？','至少达适应障碍，但不只如此；另有忧郁症，并高度怀疑反应性依附障碍及创伤后症候群。']
  ]},
  {n:'05',time:'10:27',title:'刘彩萱辩护人反诘问与覆诘问',qa:[
    ['1至2岁幼儿是否正在发展依附关系？更换照顾者有何影响？','依附不限于2岁前；关系改变都可能有影响。1岁半至2岁幼儿可能有分离焦虑，转换与衔接须良好，但孩子适应差异很大。'],
    ['什么是好的交接？','充分交接个性、健康纪录等，不一定要孩子在场；媒合者很重要，且以孩子为中心是不变法则。'],
    ['周保母照顾期间与A童的关系如何？','由资料推论，该期间发展良好并有依附关系；仅带去看一小时是否足够，目前资讯不足。'],
    ['好的照顾者能否降低分离焦虑？刘彩萱的照顾有降低吗？','好的照顾者可以降低；本案照顾没有降低。'],
    ['分离焦虑会不会造成病变或撞头？','不会造成病变；一般上学、幼儿园或托育哭泣可能是分离焦虑，但不会造成所述撞头情形。']
  ]},
  {n:'06',time:'11:13',title:'国民法官询问',qa:[
    ['自伤是否就等于遭受虐待？','不能直接画上等号。幼儿入睡阶段可能轻微撞头，通常不严重并会慢慢改善；严重自闭症、智能障碍等情形则不同。若自伤严重，应优先考虑不当对待。'],
    ['如何从A童忧伤面容判断成因？','单一照片很难判断，必须比对多个时间点与多种资料；这不是单一事件，一定是持续性的事情。'],
    ['适应障碍症是什么？','照顾者、学校等压力事件可能造成焦虑、不安、忧伤、焦躁或偏差行为；症状与事件相关，压力移除后可能于六个月内缓解，未改善则须另作判断。'],
    ['反应性依附障碍是什么？','常见表现包括对成人照顾者一贯压抑、情感退缩；苦恼时极少寻求安慰，或不回应安慰，并持续出现社交及情绪困扰。'],
    ['幼儿创伤后压力症的判断重点？','包括直接经历或目击死亡、重伤或性暴力，以及侵入性回忆、梦境、解离反应、逃避刺激、显著警醒与反应改变等；须依六岁以下儿童准则整体评估。']
  ]},
  {n:'07',time:'陪席、受命及审判长',title:'职业法官询问与上午程序结束',qa:[
    ['摇摇马影片记载「无明显回避动作」是什么意思？','如觉察危险通常会有反应，但A童很安静；安静、缓慢可能来自体能不足或忧郁症，成人类似表现可称动作缓慢与社会退缩。'],
    ['如果孩子仍在世，会如何评估与处置？','可运用游戏评估、建立关系、观察与熟悉照顾者互动及日常录影等。搓手、抠手是否表示心理障碍，仍须参考全部资料。'],
    ['回溯性诊断是否常见？','临床上常见。除问卷外，也会询问照顾家长、熟悉孩子的人，并运用幼儿园辅导纪录等资料研判。'],
    ['施暴行为对儿童有何影响？','会不断造成明显影响。'],
    ['上午程序何时结束？','12:10退庭；国民法官退席，法院处理保留证据裁定及后续讯问、辩论时间安排。']
  ]},
  {n:'08',time:'13:32',title:'下午续行｜书证与犯罪事实证据调查',points:[
    '检察官调查甲证38鉴定报告。',
    '法院函询问答包括：伤势及缺牙（牙齿与口腔）、伤势成因、医学用语与判断标准释疑，以及死亡与存活个案伤势的不同。',
    '结论与说明记载A童遭受多重、严重不当对待；精神鉴定报告整理排斥贬损、隔离、威胁恐吓、忽视及拒绝给予等精神虐待。',
    '112年9月至12月可能出现的情绪、行为症状，资料来源包括房客所述三楼长时间哭声、11月28日情形，以及Mira等证述。',
    '原PDF在「就犯罪事实之证据调查」标题后结束；本页不以其他来源擅自补写当日下午未收录的内容。'
  ]}
];

const recordRoot=document.querySelector('#day6Record');
if(recordRoot){
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const hi=s=>esc(s)
    .replace(/(长期、严重、多重虐待|至少达(?:到)?「?适应障碍并发忧郁症」?|非特定的?忧郁症|共同知情|对鉴定非常确定)/g,'<mark class="record-mark is-certain">$1</mark>')
    .replace(/(高度怀疑|很可能符合)/g,'<mark class="record-mark is-probable">$1</mark>')
    .replace(/(资料不足|资讯不足|无法判断|无法百分之百区分|无法百分之百分开)/g,'<mark class="record-mark is-limit">$1</mark>');
  recordRoot.innerHTML=recordChapters.map((chapter,index)=>{
    const body=chapter.points?`<ul>${chapter.points.map(p=>`<li>${hi(p)}</li>`).join('')}</ul>`:`<div class="qa-list">${chapter.qa.map(([q,a])=>`<article><div class="q"><small>提问</small><p>${hi(q)}</p></div><div class="a"><small>丘彦南医师回答</small><p>${hi(a)}</p></div></article>`).join('')}</div>`;
    return `<details class="record-chapter" ${index<3?'open':''}><summary><b>${chapter.n}</b><span><small>${esc(chapter.time)}</small><strong>${esc(chapter.title)}</strong></span><i aria-hidden="true">＋</i></summary><div class="record-body">${chapter.intro?`<p class="record-intro">${esc(chapter.intro)}</p>`:''}${body}<p class="record-source">资料来源｜监所关注小组 DAY6 PDF</p></div></details>`;
  }).join('');
  document.querySelectorAll('[data-record-action]').forEach(button=>button.addEventListener('click',()=>{
    const open=button.dataset.recordAction==='open';
    recordRoot.querySelectorAll('details').forEach(item=>item.open=open);
  }));
  recordRoot.addEventListener('toggle',event=>{if(event.target.matches('details'))event.target.querySelector('summary i').textContent=event.target.open?'−':'＋';},true);
}
