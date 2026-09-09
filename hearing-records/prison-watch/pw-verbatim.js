(()=>{
  const selectors=['.day1-transcript > article','.day2-transcript > article','.day3-transcript > article','.dialogue-list > details','.qa-list > article','#day6Record > article','#day6Record > details','#recordSections > article','#recordSections > details'];
  const normalized=value=>(value||'').replace(/\s+/g,'').replace(/[｜：:，。、「」『』（）()·]/g,'');
  const grams=value=>{const text=normalized(value),result=new Set();for(let i=0;i<text.length-1;i+=1)result.add(text.slice(i,i+2));return result;};
  const score=(row,box)=>{const a=grams(row),b=grams(box);let hits=0;a.forEach(value=>{if(b.has(value))hits+=1;});return a.size?hits/a.size:0;};
  const findBoxes=scope=>{for(const selector of selectors){const boxes=[...scope.querySelectorAll(selector)].filter(box=>!box.closest('.pw-verbatim-source'));if(boxes.length)return boxes;}return [];};
  const integrate=(section,attempt=0)=>{
    const scope=section.parentElement,boxes=findBoxes(scope);
    if(!boxes.length&&attempt<120){requestAnimationFrame(()=>integrate(section,attempt+1));return;}
    if(!boxes.length)return;
    const rows=[...section.querySelectorAll('.pw-verbatim-row')],boxTexts=boxes.map(box=>box.innerText);
    rows.forEach((row,index)=>{
      let best=-1,bestScore=0;
      boxTexts.forEach((text,boxIndex)=>{const value=score(row.innerText,text);if(value>bestScore){bestScore=value;best=boxIndex;}});
      if(bestScore<.12)best=Math.min(boxes.length-1,Math.floor(index*boxes.length/Math.max(rows.length,1)));
      let inline=boxes[best].querySelector(':scope > .pw-inline-source');
      if(!inline){inline=document.createElement('div');inline.className='pw-inline-source';inline.innerHTML='<div class="pw-inline-head"><small>ORIGINAL RECORD · UNABRIDGED</small><h4>原始紀錄逐列全文</h4><p>本章原始問答完整收錄；編輯文字僅供導讀。</p></div>';boxes[best].append(inline);}
      inline.append(row);
    });
    scope.querySelectorAll(':scope > .pw-editorial-label').forEach(node=>node.remove());
    document.querySelectorAll('a[href="#verbatim-source"]').forEach(link=>link.remove());
    section.remove();
  };
  document.querySelectorAll('.pw-verbatim-source').forEach(section=>integrate(section));
})();
