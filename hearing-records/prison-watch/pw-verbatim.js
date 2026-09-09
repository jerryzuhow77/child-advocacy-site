document.querySelectorAll('.pw-verbatim-source').forEach(section=>{
  const nav=document.querySelector('header nav, nav[aria-label], nav');
  if(nav&&!nav.querySelector('a[href="#verbatim-source"]')){
    const link=document.createElement('a');
    link.href='#verbatim-source';
    link.textContent='原始全文';
    nav.append(link);
  }
  section.querySelectorAll('[data-pw-action]').forEach(button=>{
    button.addEventListener('click',()=>{
      const open=button.dataset.pwAction==='open';
      section.querySelectorAll('.pw-verbatim-table').forEach(item=>{item.open=open;});
    });
  });
});
