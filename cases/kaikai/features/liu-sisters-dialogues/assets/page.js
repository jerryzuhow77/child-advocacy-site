const buttons=[...document.querySelectorAll('[data-filter]')];
const records=[...document.querySelectorAll('.record')];
const recipientCards=[...document.querySelectorAll('[data-recipient-card]')];
const search=document.querySelector('#search');
const recipient=document.querySelector('#recipient');
let filter='all';
function update(){
  const query=search.value.trim().toLowerCase();
  records.forEach(record=>{
    const tags=record.dataset.tags||'';
    const relation=record.dataset.recipient||'';
    const haystack=(record.dataset.search+' '+record.textContent).toLowerCase();
    const relationMatch=recipient.value==='all'||relation===recipient.value;
    record.classList.toggle('is-hidden',!(filter==='all'||tags.includes(filter))||!haystack.includes(query)||!relationMatch);
  });
  recipientCards.forEach(card=>card.classList.toggle('is-hidden',recipient.value!=='all'&&card.dataset.recipientCard!==recipient.value));
}
buttons.forEach(button=>button.addEventListener('click',()=>{
  filter=button.dataset.filter;
  buttons.forEach(item=>item.classList.toggle('active',item===button));
  update();
}));
search.addEventListener('input',update);
recipient.addEventListener('change',update);
