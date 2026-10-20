const topbar=document.querySelector('.top');
const menu=document.querySelector('#menu');
menu?.addEventListener('click',()=>{const open=topbar.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));});
document.querySelectorAll('.top a').forEach(a=>a.addEventListener('click',()=>topbar.classList.remove('open')));
const day6RecordSection=document.querySelector('#reconstructed-record');
if(day6RecordSection&&!day6RecordSection.querySelector('.day6-pdf-source-figure')){
  const figure=document.createElement('figure');
  figure.className='day6-pdf-source-figure';
  figure.innerHTML='<img src="/child-advocacy-site/assets/source/prison-watch-day6-pdf-image-p1-20250430.png" alt="Image included on page 1 of the original DAY6 PDF" width="740" height="680" loading="lazy" decoding="async"><figcaption>Original PDF image | Page 1 | Source: Prison Watch</figcaption>';
  day6RecordSection.querySelector(':scope > header')?.after(figure);
}
const recordChapters=[
  {
    "n": "01",
    "time": "09:07",
    "title": "Hearing resumes | Assessment procedure and evidence base",
    "intro": "The prosecutor sought to display Prosecution Exhibit 85, a photograph taken by childminder Zhou, and describe clothing and other details. The presiding judge stopped this and had the expert explain instead. Dr. Qiu Yan-nan took the oath as an expert.",
    "points": [
      "Dr. Qiu retired in 2022. He is an adviser and former president of the Taiwanese Society of Child and Adolescent Psychiatry, established a forensic psychiatric assessment committee, and has led over one hundred child and adolescent forensic psychiatric assessments.",
      "The assessment process included the December 13, 2024 discussion of injury assessment, all investigation files, audiovisual material and related information.",
      "Psychiatric assessment: Child A’s circumstances met the criteria for abuse, and sexual abuse was strongly suspected. The assessment also explained working definitions of neglect, sexual abuse and physical abuse of children."
    ]
  },
  {
    "n": "02",
    "time": "Preliminary explanation",
    "title": "Psychological abuse, severe neglect and retrospective diagnosis",
    "points": [
      "Forms of psychological abuse included isolation, threats, prolonged punitive standing, restricted movement, corporal punishment and preventing Child A from communicating or interacting with others; binding his torso and limbs and placing him on a terrazzo floor; and observations of his closed eyes or vacant expression.",
      "Severe neglect included a dangerous environment, indifference, not hugging or comforting him, not providing adequate toys and interactive play, washing him with cold water and preventing sleep. Sources included Mira’s testimony, phone content and the defendants’ social-media conversations.",
      "Between one year six months and one year ten months of age, Child A showed fearful, empty and sad expressions. The material also included photographs of his penis, evidence concerning crying, Mira’s testimony and her messages to friends.",
      "The assessment considered that the credibility of claims of “self-harm, swearing and head-banging” remained to be established. If those behaviors did occur, excluding neurodevelopmental disorders and neurological disease would instead support severe multiple abuse and neglect.",
      "The retrospective diagnosis provisionally given was “unspecified depressive disorder,” with at least “adjustment disorder with depression.” Reactive attachment disorder and post-traumatic stress disorder were described as “very likely to meet the criteria” because information was insufficient."
    ]
  },
  {
    "n": "03",
    "time": "Audiovisual material",
    "title": "Visual basis for assessing trauma and assessment conclusions",
    "points": [
      "A five-second punitive-standing video; a six-second video in which Child A was unclothed while another child wore long sleeves; and video IMG-463, showing two children playing on a rocking horse while Child A remained apathetic, lonely and unsmiling, repeatedly looking apprehensively toward the person filming.",
      "Other material included a five-second video filmed downward from a piano; a 41-second video of Child A wearing a black mask and sitting alone in a corner between a wall and a wardrobe; and a nine-second video of two children interacting happily on a bed, with proportionate physical development and no visible scars.",
      "Assessment conclusion: Extensive witness and physical evidence from multiple sources supported prolonged, severe and multiple abuse during the defendants’ full-time care. His psychiatric condition before death met at least adjustment disorder with depression, and unspecified depressive disorder was diagnosed."
    ]
  },
  {
    "n": "04",
    "time": "09:50",
    "title": "Prosecution direct examination",
    "qa": [
      [
        "Did you personally write the report and review videos and other material?",
        "Yes. I wrote the report and the center approved it. The younger a child is, the harder it is for them to express themselves. Clinical assessment must reflect their developmental stage and use close caregivers and indirect material."
      ],
      [
        "Could Child A previously have had psychiatric symptoms, autism or neurological disease?",
        "The information does not support that. It was not autism or intellectual disability."
      ],
      [
        "Could Child A’s swearing have been imitation or imitation of sounds?",
        "At this developmental stage, he could probably only say about two words. A child does not have to remain in an environment continuously to learn something, but the information must be assessed together."
      ],
      [
        "Did you consider Mira’s testimony and material about feeding, threats and other matters?",
        "Mira’s testimony was included but was not the only source. Injury assessment, implements and treatment were considered together. The rules of examination still apply before testimony is displayed in court."
      ],
      [
        "How would inadequate feeding affect development?",
        "Depending on age and tooth development, children should eat solid food to practice chewing. The record states that Child A’s food was blended into puree."
      ],
      [
        "Is blowing a hairdryer at a child’s face normal childcare?",
        "No, it is not normal childcare."
      ],
      [
        "Are you certain about the assessment? Can the two defendants’ responsibilities be distinguished?",
        "I am very certain about the assessment. I cannot distinguish one hundred percent how either individual abused him, but there was “shared awareness.” Some parts can be distinguished to a limited extent; others cannot be separated."
      ],
      [
        "What was the assessment result?",
        "At least adjustment disorder, but not only that: there was also depression, with strong suspicion of reactive attachment disorder and post-traumatic stress syndrome."
      ]
    ]
  },
  {
    "n": "05",
    "time": "10:27",
    "title": "Cross-examination and further examination by Liu Cai-xuan’s defense",
    "qa": [
      [
        "Are children aged one to two developing attachments? How does a change of caregiver affect them?",
        "Attachment is not limited to the period before age two; changes in relationships can have an effect at any age. Children aged one and a half to two may have separation anxiety. Transition and handover must be handled well, but children vary greatly in adaptation."
      ],
      [
        "What is a good handover?",
        "Adequate transfer of information about personality, health records and other matters; the child need not necessarily be present. The person arranging the placement is important, and centering the child is an unchanging principle."
      ],
      [
        "What was the relationship between Child A and childminder Zhou during her care?",
        "The material suggests good development and an attachment during that period. There is currently insufficient information to decide whether taking the child for only a one-hour visit was enough."
      ],
      [
        "Can good caregivers reduce separation anxiety? Did Liu Cai-xuan’s care do so?",
        "A good caregiver can reduce it. The care in this case did not."
      ],
      [
        "Can separation anxiety cause pathology or head-banging?",
        "It does not cause pathology. Crying at school, kindergarten or childcare may be separation anxiety, but it would not cause the head-banging described."
      ]
    ]
  },
  {
    "n": "06",
    "time": "11:13",
    "title": "Questions from citizen judges",
    "qa": [
      [
        "Does self-injury necessarily mean a child is being abused?",
        "They cannot simply be equated. Toddlers may mildly bang their heads when falling asleep; it is usually not serious and gradually improves. Severe autism or intellectual disability is different. Where self-injury is severe, mistreatment should be considered first."
      ],
      [
        "How can the cause be assessed from Child A’s sad expression?",
        "A single photograph is difficult to interpret. Multiple times and types of material must be compared. This was not a single event; it must have been something ongoing."
      ],
      [
        "What is adjustment disorder?",
        "Stressful events involving caregivers, school and other circumstances may cause anxiety, unease, sadness, agitation or behavioral disturbance. Symptoms are related to the event and may ease within six months after the stressor is removed; if they do not improve, a different assessment is needed."
      ],
      [
        "What is reactive attachment disorder?",
        "Common features include consistently inhibited, emotionally withdrawn behavior toward adult caregivers; rarely seeking comfort when distressed or failing to respond to comfort; and persistent social and emotional disturbance."
      ],
      [
        "What matters in assessing post-traumatic stress disorder in a young child?",
        "Directly experiencing or witnessing death, serious injury or sexual violence; intrusive memories, dreams, dissociative reactions, avoidance of stimuli and marked changes in arousal and reactivity, among other features. A comprehensive assessment must use the criteria for children aged six and under."
      ]
    ]
  },
  {
    "n": "07",
    "time": "Associate, commissioned and presiding judges",
    "title": "Professional judges’ questions and end of the morning session",
    "qa": [
      [
        "What does “no obvious avoidance movement” in the rocking-horse video mean?",
        "One would usually react on perceiving danger, but Child A was very quiet. Quietness and slowness can reflect low physical capacity or depression. Similar adult manifestations may be termed slowed movement and social withdrawal."
      ],
      [
        "If the child were alive, how would you assess and manage the situation?",
        "Play-based assessment, relationship-building, observing interaction with familiar caregivers and everyday video could be used. Whether rubbing or picking at the hands indicates a psychological disorder still requires all the information to be considered."
      ],
      [
        "Is retrospective diagnosis common?",
        "It is common clinically. In addition to questionnaires, caregivers and people familiar with the child are asked, and kindergarten counseling records and other information are used."
      ],
      [
        "How does violence affect a child?",
        "It continually has a marked effect."
      ],
      [
        "When did the morning session end?",
        "The court adjourned at 12:10. The citizen judges left, and the court dealt with reserved evidentiary rulings and scheduling for further questioning and argument."
      ]
    ]
  },
  {
    "n": "08",
    "time": "13:32",
    "title": "Afternoon resumes | Documentary evidence and evidence on the alleged criminal facts",
    "points": [
      "The prosecutor examined the assessment report, Prosecution Exhibit 38.",
      "Questions and answers in correspondence with the court covered injuries and missing teeth (teeth and mouth), causes of injury, clarification of medical terminology and assessment standards, and differences between injuries in deceased and surviving patients.",
      "The conclusions and explanations recorded multiple forms of severe mistreatment of Child A. The psychiatric report organized psychological abuse into rejection and denigration, isolation, threats and intimidation, ignoring, and refusal to provide.",
      "Sources for possible emotional and behavioral symptoms from September through December 2023 included the tenant’s account of prolonged crying from the third floor, the situation on November 28 and testimony from Mira and others.",
      "The original PDF ends after the heading “Examination of evidence concerning the criminal facts.” This page does not use other sources to invent or supplement afternoon proceedings not included in that PDF."
    ]
  }
];

const recordRoot=document.querySelector('#day6Record');
if(recordRoot){
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const hi=s=>esc(s)
    .replace(/(prolonged, severe and multiple abuse|adjustment disorder with depression|unspecified depressive disorder|shared awareness|very certain about the assessment)/g,'<mark class="record-mark is-certain">$1</mark>')
    .replace(/(strongly suspected|strong suspicion|very likely to meet the criteria)/g,'<mark class="record-mark is-probable">$1</mark>')
    .replace(/(insufficient information|information was insufficient|cannot distinguish one hundred percent)/g,'<mark class="record-mark is-limit">$1</mark>');
  recordRoot.innerHTML=recordChapters.map((chapter,index)=>{
    const body=chapter.points?`<ul>${chapter.points.map(p=>`<li>${hi(p)}</li>`).join('')}</ul>`:`<div class="qa-list">${chapter.qa.map(([q,a])=>`<article><div class="q"><small>Question</small><p>${hi(q)}</p></div><div class="a"><small>Dr. Qiu Yan-nan’s answer</small><p>${hi(a)}</p></div></article>`).join('')}</div>`;
    return `<details class="record-chapter" ${index<3?'open':''}><summary><b>${chapter.n}</b><span><small>${esc(chapter.time)}</small><strong>${esc(chapter.title)}</strong></span><i aria-hidden="true">＋</i></summary><div class="record-body">${chapter.intro?`<p class="record-intro">${esc(chapter.intro)}</p>`:''}${body}<p class="record-source">Source | Prison Watch DAY6 PDF</p></div></details>`;
  }).join('');
  document.querySelectorAll('[data-record-action]').forEach(button=>button.addEventListener('click',()=>{
    const open=button.dataset.recordAction==='open';
    recordRoot.querySelectorAll('details').forEach(item=>item.open=open);
  }));
  recordRoot.addEventListener('toggle',event=>{if(event.target.matches('details'))event.target.querySelector('summary i').textContent=event.target.open?'−':'＋';},true);
}
