(()=>{
  const mount=()=>{
    if(document.querySelector('[data-who-was-deceived-home]'))return;
    const main=document.querySelector('main#main-content');
    if(!main)return;
    const hans=document.documentElement.lang==='zh-Hans';
    const path='/child-advocacy-site/news/who-was-deceived-20261120/'+(hans?'zh-Hans/':'');
    const copy=hans?{
      label:'首页置顶专题・案件信息时间线',title:'谁被骗？谁刻意隐瞒？',
      summary:'从额头大片瘀伤、接连掉牙，到延后告知外婆：把时间点排在一起，检视“遭欺骗、被隐瞒”的辩方主张。',
      cta:'阅读全文与近期庭期',alt:'谁被骗、谁刻意隐瞒案件时间线倡议图卡'
    }:{
      label:'首頁置頂專題・案件資訊時間線',title:'誰被騙？誰刻意隱瞞？',
      summary:'從額頭大片瘀傷、接連掉牙，到延後告知外婆：把時間點排在一起，檢視「遭欺騙、被隱瞞」的辯方主張。',
      cta:'閱讀全文與近期庭期',alt:'誰被騙、誰刻意隱瞞案件時間線倡議圖卡'
    };
    const section=document.createElement('section');
    section.dataset.whoWasDeceivedHome='';
    section.className='who-was-deceived-home';
    section.setAttribute('aria-label',copy.label);
    section.innerHTML='<a href="'+path+'"><img src="/child-advocacy-site/assets/images/news/who-was-deceived-20261120/who-was-deceived-hero.jpg" width="1199" height="1312" alt="'+copy.alt+'"><span class="who-was-deceived-copy"><small>'+copy.label+'</small><strong>'+copy.title+'</strong><span>'+copy.summary+'</span><b>'+copy.cta+'</b></span></a>';
    const latest=document.querySelector('#home-latest-25-20261118');
    latest?latest.before(section):main.prepend(section);
    const style=document.createElement('style');
    style.textContent='.who-was-deceived-home{margin:0 0 30px;padding:0;border:1px solid #6d231f;background:#241b18;box-shadow:0 14px 34px rgba(54,29,18,.16)}.who-was-deceived-home>a{display:grid;grid-template-columns:minmax(270px,.75fr) minmax(0,1.25fr);align-items:stretch;text-decoration:none;color:#fff}.who-was-deceived-home img{width:100%;height:100%;max-height:480px;object-fit:cover;object-position:center 12%}.who-was-deceived-copy{display:flex;flex-direction:column;justify-content:center;padding:clamp(28px,5vw,64px);background:radial-gradient(circle at 100% 0,#9b292a55,transparent 42%),linear-gradient(135deg,#211a17,#4a211e)}.who-was-deceived-copy small{color:#f2cc61;font-weight:900;letter-spacing:.1em}.who-was-deceived-copy strong{margin:10px 0 16px;color:#ffe34f;font:900 clamp(33px,5vw,62px)/1.1 "Noto Serif TC","Noto Serif SC",serif;letter-spacing:-.04em}.who-was-deceived-copy>span{max-width:38em;color:#f4e9df;font-size:clamp(16px,2vw,20px);line-height:1.75}.who-was-deceived-copy b{align-self:flex-start;margin-top:20px;padding:9px 14px;border:1px solid #f2cc61;color:#ffe58c;font-size:14px}.who-was-deceived-home a:hover b,.who-was-deceived-home a:focus-visible b{background:#f2cc61;color:#211a17}@media(max-width:760px){.who-was-deceived-home>a{grid-template-columns:1fr}.who-was-deceived-home img{max-height:none;aspect-ratio:1199/900;object-position:top}.who-was-deceived-copy{padding:24px}.who-was-deceived-copy strong{font-size:36px}.who-was-deceived-copy>span{font-size:15px}}';
    document.head.append(style);
  };
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',mount,{once:true}):mount();
})();
