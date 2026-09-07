const buttons=[...document.querySelectorAll('[data-filter]')];
const records=[...document.querySelectorAll('.record')];
const search=document.querySelector('#search');
let filter='all';
function update(){
  const query=search.value.trim().toLowerCase();
  records.forEach(record=>{
    const tags=record.dataset.tags||'';
    const haystack=(record.dataset.search+' '+record.textContent).toLowerCase();
    record.classList.toggle('is-hidden',!(filter==='all'||tags.includes(filter))||!haystack.includes(query));
  });
}
buttons.forEach(button=>button.addEventListener('click',()=>{
  filter=button.dataset.filter;
  buttons.forEach(item=>item.classList.toggle('active',item===button));
  update();
}));
search.addEventListener('input',update);
