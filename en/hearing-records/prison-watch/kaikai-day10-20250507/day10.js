document.documentElement.classList.add('js-ready');

document.addEventListener('DOMContentLoaded', () => {
  const menuButton = document.getElementById('menuButton');
  const siteNav = document.getElementById('siteNav');
  if (menuButton && siteNav) {
    menuButton.addEventListener('click', () => {
      const open = siteNav.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(open));
    });
    siteNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      siteNav.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
    }));
  }

  const revealNodes = [...document.querySelectorAll('.reveal')];
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealNodes.forEach(node => observer.observe(node));
  } else {
    revealNodes.forEach(node => node.classList.add('in-view'));
  }

  initFullRecord();
});


const copy={"loading":"Loading complete sentencing record…","shown":"sections shown","empty":"No matching sections.","failed":"The complete record could not be loaded. Please use the original source link above.","search":"Search","titles":["Prosecution sentencing arguments","Citizen judges’ questions and morning procedure","Liu Cai-xuan’s sentencing arguments","Prosecution clarification","Liu Ruo-lin’s sentencing arguments","Additional prosecution arguments","Liu Cai-xuan: additional arguments and webpage supplement","Liu Ruo-lin: additional arguments","The defendants’ final statements","Victim participant and end of hearing"],"labels":["Prosecutor","Court / presiding judge","Liu Cai-xuan’s counsel","Liu Ruo-lin’s counsel","Defense counsel","Defendant Liu Cai-xuan","Defendant Liu Ruo-lin","Victim participant’s representative"],"supplement":{"label":"Webpage supplement","speaker":"Liu Cai-xuan’s counsel","text":"1. Taiwan New Taipei District Court criminal judgment 109年度訴字第137號: abuse impairing a young child’s development and resulting in death; life imprisonment and lifelong deprivation of civil rights. The facts differ greatly. Punishment must be proportionate.","boundary":"This passage appears on Prison Watch’s original webpage but not in the seven-page PDF retained by this site. It is translated and separately added here, not mislabeled as part of the PDF text layer.","link":"View original webpage ↗"}};

async function initFullRecord() {
 const host=document.getElementById('recordSections'), status=document.getElementById('recordStatus'), search=document.getElementById('recordSearch'), speaker=document.getElementById('recordSpeaker');
 if(!host||!status||!search||!speaker)return;
 const roles=[['prosecutor'],['court','prosecutor'],['caixuan'],['court','prosecutor'],['ruolin'],['prosecutor'],['caixuan'],['ruolin'],['caixuan','ruolin'],['court']];
 const primary=[0,1,2,0,3,0,2,3,5,7];
 const actorKeys=['prosecutor','court','caixuan-defense','ruolin-defense','defense','caixuan-defendant','ruolin-defendant','participant'];
 const actorSide=i=>[0,1,7].includes(i)?'left':'right';
 const sourceUrl='https://www.prisonwatch-tw.org/post/day10-2025%E5%B9%B45%E6%9C%887%E6%97%A5%EF%BC%88%E4%B8%89%EF%BC%89%E7%AC%AC%E5%8D%81%E6%AC%A1%E5%AF%A9%E5%88%A4%E6%9C%9F%E6%97%A5';
 const highlightNodes=[];
 const paragraph=(text,cls)=>{const e=document.createElement('p');if(cls)e.className=cls;e.textContent=text;e.dataset.sourceText=text;highlightNodes.push(e);return e;};
 const highlightQuery=q=>{for(const e of highlightNodes){const source=e.dataset.sourceText; e.replaceChildren();if(!q){e.textContent=source;continue;}const lower=source.toLocaleLowerCase();let cursor=0,index=lower.indexOf(q);while(index!==-1){if(index>cursor)e.append(document.createTextNode(source.slice(cursor,index)));const mark=document.createElement('mark');mark.textContent=source.slice(index,index+q.length);e.append(mark);cursor=index+q.length;index=lower.indexOf(q,cursor);}if(cursor<source.length)e.append(document.createTextNode(source.slice(cursor)));}};
 function getActor(line,current){
  if(/^(?:Presiding judge|裁判長)/.test(line))return 1;
  if(/^(?:Prosecutor|検察官)(?::| objects|が異議|：)/.test(line))return 0;
  if(/^(?:Liu Cai-xuan’s counsel|劉彩萱の弁護人)[:：]/.test(line))return 2;
  if(/^(?:Liu Ruo-lin’s counsel|劉若琳の弁護人)[:：]/.test(line))return 3;
  if(/^(?:Defense counsel|弁護人)[:：]/.test(line))return [2,3].includes(current)?current:4;
  if(/(?:IX\. Defendant Liu Ruo-lin|九、被告劉若琳)/.test(line))return 6;
  return current;
 }
 function renderText(text,initial){
  const result=document.createElement('div');result.className='record-transcript';let current=initial;
  for(const block of text.split(/\n\s*\n/)){
   current=initial;const lines=block.trim().split('\n');if(!block.trim())continue;
   let chunk=[];
   const flush=()=>{if(!chunk.length)return;const speech=document.createElement('article');speech.className='record-speech is-'+actorSide(current)+' speaker-'+actorKeys[current];speech.setAttribute('aria-label',copy.labels[current]);const h=document.createElement('header');h.className='record-speaker';const n=document.createElement('strong');n.textContent=copy.labels[current];h.append(n);const bubble=document.createElement('div');bubble.className='record-speech-bubble';const text=paragraph(chunk.join('\n'));text.style.whiteSpace='pre-line';bubble.append(text);speech.append(h,bubble);result.append(speech);chunk=[];};
   for(const line of lines){const next=getActor(line,current);if(next!==current){flush();current=next;}
    if(/^(?:\d{1,2}:\d{2}|\d{1,2}時\d{1,2}分|→|\[Applause|〔中継)/.test(line)){flush();const e=document.createElement('aside');e.className='record-stage-note';e.textContent=line;result.append(e);}
    else chunk.push(line);
   }flush();
  }return result;
 }
 try{
  const response=await fetch(document.body.dataset.textSource,{cache:'no-cache'});if(!response.ok)throw Error('HTTP '+response.status);
  const raw=(await response.text()).replace(/\r/g,'');const parts=raw.split(/^@SECTION (\d+)\s*$/m);if(parts.length!==21)throw Error('Expected ten complete translated sections');
  const entries=[];
  for(let i=0;i<10;i++){
   if(Number(parts[1+i*2])!==i+1)throw Error('Section sequence mismatch');
   const text=(i===0?parts[0].trim()+'\n\n':'')+parts[2+i*2].trim();
   const details=document.createElement('details');details.className='record-section';details.id='record-section-'+(i+1);details.dataset.roles=roles[i].join(' ');details.dataset.search=(copy.titles[i]+'\n'+text+(i===6?'\n'+Object.values(copy.supplement).join('\n'):'')).toLocaleLowerCase();details.open=i===0;
   const summary=document.createElement('summary');const number=document.createElement('span');number.textContent=String(i+1).padStart(2,'0');const title=document.createElement('b');title.textContent=copy.titles[i];summary.append(number,title);details.append(summary,renderText(text,primary[i]));
   if(i===6){const aside=document.createElement('aside');aside.className='record-source-supplement';aside.setAttribute('aria-label',copy.supplement.label);const header=document.createElement('header');header.textContent=copy.supplement.label;const link=document.createElement('a');link.href=sourceUrl;link.target='_blank';link.rel='noopener';link.textContent=copy.supplement.link;aside.append(header,paragraph(copy.supplement.speaker),paragraph(copy.supplement.text),paragraph(copy.supplement.boundary),link);details.append(aside);}
   entries.push(details);
  }
  host.replaceChildren(...entries);
  const filter=()=>{const q=search.value.trim().toLocaleLowerCase(),r=speaker.value;let count=0;for(const e of entries){const show=(!q||e.dataset.search.includes(q))&&(r==='all'||e.dataset.roles.split(' ').includes(r));e.hidden=!show;if(show){count++;if(q)e.open=true;}}highlightQuery(q);status.textContent=count+'/10 '+copy.shown+(count===0?' — '+copy.empty:'');};
  search.addEventListener('input',filter);speaker.addEventListener('change',filter);
  document.getElementById('expandAll')?.addEventListener('click',()=>entries.forEach(e=>{if(!e.hidden)e.open=true;}));document.getElementById('collapseAll')?.addEventListener('click',()=>entries.forEach(e=>e.open=false));filter();
 }catch(error){status.textContent=copy.failed;host.replaceChildren(paragraph(copy.failed,'load-error'));console.error('Day 10 translated record:',error);}
}
