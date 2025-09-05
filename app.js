// Updated front-end logic: compact square cards + modal details
const demoCourses = [
  { id: 'c1', icon: '🤖', title: 'AI Basics', desc: 'Intro to AI concepts for beginners', progress: 0 },
  { id: 'c2', icon: '⚡', title: 'Agile Foundations', desc: 'Agile principles & ceremonies', progress: 40 },
  { id: 'c3', icon: '💬', title: 'Communication', desc: 'Improve workplace communication', progress: 10 },
  { id: 'c4', icon: '🔒', title: 'Data Security', desc: 'Security best practices', progress: 0 },
  { id: 'c5', icon: '🧠', title: 'Emotional IQ', desc: 'Emotional intelligence at work', progress: 0 }
];

function $q(sel){ return document.querySelector(sel); }
function $qa(sel){ return Array.from(document.querySelectorAll(sel)); }

// welcome
const email = localStorage.getItem('lms_user_email') || 'Learner';
$q('#welcomeText')?.textContent && ($q('#welcomeText').textContent = `Hello, ${email}! Ready to learn today?`);

// load courses
let courses = JSON.parse(localStorage.getItem('lms_demo_courses')) || demoCourses;

function renderCards(list){
  const grid = $q('#cardsGrid');
  if(!grid) return;
  grid.innerHTML = '';
  const items = list.length ? list : [];
  items.forEach(c=>{
    const div = document.createElement('div');
    div.className = 'card-square';
    div.tabIndex = 0;
    div.dataset.id = c.id;
    div.innerHTML = `
      <div class="card-icon">${c.icon}</div>
      <div class="card-title">${c.title}</div>
    `;
    grid.appendChild(div);
  });
}

renderCards(courses);

// Search
$q('#courseSearch')?.addEventListener('input', (e)=>{
  const q = e.target.value.trim().toLowerCase();
  const filtered = courses.filter(c => c.title.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q));
  renderCards(filtered);
});

// Card click -> modal details
const modal = $q('#detailModal');
const modalBody = $q('#modalBody');
const modalClose = $q('#modalClose');
const modalStart = $q('#modalStart');
const modalBack = $q('#modalBack');
let activeCourseId = null;

document.addEventListener('click', (e)=>{
  const card = e.target.closest('.card-square');
  if(card){
    const id = card.dataset.id;
    openModal(id);
  }
});

document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') closeModal(); });
modalClose?.addEventListener('click', closeModal);
modalBack?.addEventListener('click', closeModal);
modalStart?.addEventListener('click', ()=>{
  if(!activeCourseId) return;
  // simulate progress increment
  courses = courses.map(c=> c.id===activeCourseId ? {...c, progress: Math.min(100,c.progress+20)} : c);
  localStorage.setItem('lms_demo_courses', JSON.stringify(courses));
  closeModal();
  renderCards(courses);
});

function openModal(id){
  activeCourseId = id;
  const c = courses.find(x=>x.id===id);
  modalBody.innerHTML = `<h2 style="margin-top:0">${c.icon} ${c.title}</h2>
    <p style="color:var(--muted)">${c.desc}</p>
    <p><strong>Progress:</strong> ${c.progress}%</p>`;
  modal.setAttribute('aria-hidden','false');
}
function closeModal(){
  activeCourseId = null;
  modal.setAttribute('aria-hidden','true');
}

// logout
$q('#logoutBtn')?.addEventListener('click', ()=>{
  localStorage.removeItem('lms_user_email');
  window.location.href='index.html';
});

// initial save if not present
if(!localStorage.getItem('lms_demo_courses')){
  localStorage.setItem('lms_demo_courses', JSON.stringify(courses));
}
