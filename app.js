// app.js — updated: svg icons, keyboard accessible cards, tooltips, progress ring

const demoCourses = [
  { id: 'c1', svg: 'robot', title: 'AI Basics', desc: 'Intro to AI concepts for beginners', progress: 0 },
  { id: 'c2', svg: 'bolt', title: 'Agile Foundations', desc: 'Agile principles & ceremonies', progress: 40 },
  { id: 'c3', svg: 'chat', title: 'Communication', desc: 'Improve workplace communication', progress: 10 },
  { id: 'c4', svg: 'lock', title: 'Data Security', desc: 'Security best practices', progress: 0 },
  { id: 'c5', svg: 'brain', title: 'Emotional IQ', desc: 'Emotional intelligence at work', progress: 75 }
];

const $q = s => document.querySelector(s);
const $qa = s => Array.from(document.querySelectorAll(s));

// tiny inline SVG icon set
const svgs = {
  robot: `<svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="4" fill="#fff"/><path d="M8 11h8M7 7v2M17 7v2M9 17h6" stroke="#0b3a66" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/><rect x="8.5" y="12.5" width="1.6" height="1.6" rx="0.3" fill="#0b3a66"/><rect x="14" y="12.5" width="1.6" height="1.6" rx="0.3" fill="#0b3a66"/></svg>`,
  bolt: `<svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" fill="#f99a3c"/></svg>`,
  chat: `<svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="4" fill="#fff"/><path d="M8 10h8M8 13h6" stroke="#7a6cf0" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  lock: `<svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="4" fill="#fff"/><path d="M7 10V8a5 5 0 0110 0v2" stroke="#f3a764" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/><rect x="6" y="10" width="12" height="8" rx="2" stroke="#f3a764" stroke-width="1.4"/></svg>`,
  brain:`<svg width="36" height="36" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="4" fill="#fff"/><path d="M8 9c0-1 1-3 4-3s4 2 4 3c0 0 2 0 2 2v3a3 3 0 01-3 3h-9a3 3 0 01-3-3v-2c0-2 2-3 3-3" fill="#ff8bdc"/></svg>`
};

// save/load demo courses
let courses = JSON.parse(localStorage.getItem('lms_demo_courses')) || demoCourses;
if (!localStorage.getItem('lms_demo_courses')) {
  localStorage.setItem('lms_demo_courses', JSON.stringify(courses));
}

// show welcome
const email = localStorage.getItem('lms_user_email') || 'Learner';
$q('#welcomeText') && ($q('#welcomeText').textContent = `Hello, ${email}! Ready to learn today?`);

// helper for badge class
function badgeClassFor(progress){
  if(progress >= 80) return 'progress-badge high';
  if(progress >= 30) return 'progress-badge mid';
  return 'progress-badge low';
}

// build and render cards
function renderCards(list){
  const grid = $q('#cardsGrid');
  if(!grid) return;
  grid.innerHTML = '';
  (list || []).forEach(c => {
    const div = document.createElement('div');
    div.className = 'card-square';
    div.tabIndex = 0;
    div.setAttribute('role','button');
    div.setAttribute('aria-pressed','false');
    div.dataset.id = c.id;
    div.title = c.desc; // tooltip

    // compute ring degrees
    const deg = Math.round((c.progress/100)*360);
    // create ring style using conic-gradient; fallback if 0%
    const ringBg = `conic-gradient(var(--blue) ${deg}deg, #eef5fb ${deg}deg)`;

    const iconSvg = svgs[c.svg] || `<div class="card-icon" aria-hidden="true">🔹</div>`;

    div.innerHTML = `
      <div class="progress-badge ${badgeClassFor(c.progress).split(' ').slice(1).join(' ')}">${c.progress}%</div>

      <div class="card-top" aria-hidden="true">
        <div class="progress-ring" style="background:${ringBg};border-radius:999px;position:absolute;inset:0;"></div>
        <div class="progress-ring-inner" aria-hidden="true">${c.progress}%</div>
        <div style="position:relative;z-index:2">${iconSvg}</div>
      </div>

      <div class="card-title">${c.title}</div>

      <div class="card-progress" aria-hidden="true"><span style="width:${c.progress}%"></span></div>
    `;

    grid.appendChild(div);

    // keyboard: Enter / Space to open
    div.addEventListener('keydown', (ev) => {
      if(ev.key === 'Enter' || ev.key === ' ') {
        ev.preventDefault();
        openModal(c.id);
      }
    });
  });
}

renderCards(courses);

// search
$q('#courseSearch')?.addEventListener('input', (e) => {
  const q = e.target.value.trim().toLowerCase();
  const filtered = courses.filter(c => c.title.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q));
  renderCards(filtered);
});

// Modal controls (same as before)
const modal = $q('#detailModal');
const modalBody = $q('#modalBody');
const modalClose = $q('#modalClose');
const modalStart = $q('#modalStart');
const modalBack = $q('#modalBack');
let activeCourseId = null;

function openModal(id){
  activeCourseId = id;
  const c = courses.find(x => x.id === id);
  if(!c) return;
  modalBody.innerHTML = `<h2 id="modalTitle" style="margin-top:0">${svgs[c.svg] || ''} ${c.title}</h2>
    <p style="color:var(--muted)">${c.desc}</p>
    <p><strong>Progress:</strong> ${c.progress}%</p>`;
  modal.setAttribute('aria-hidden','false');
  modalClose?.focus();
}

function closeModal(){
  activeCourseId = null;
  modal.setAttribute('aria-hidden','true');
}

document.addEventListener('click', (e) => {
  const card = e.target.closest('.card-square');
  if(card){
    openModal(card.dataset.id);
  }
});
document.addEventListener('keydown', (e) => { if(e.key === 'Escape') closeModal(); });
modalClose?.addEventListener('click', closeModal);
modalBack?.addEventListener('click', closeModal);

// start learning increments progress
modalStart?.addEventListener('click', () => {
  if(!activeCourseId) return;
  courses = courses.map(c => c.id === activeCourseId ? { ...c, progress: Math.min(100, c.progress + 20) } : c);
  localStorage.setItem('lms_demo_courses', JSON.stringify(courses));
  closeModal();
  renderCards(courses);
});

// logout
$q('#logoutBtn')?.addEventListener('click', () => {
  try { localStorage.removeItem('lms_user_email'); } catch (e) {}
  window.location.href = 'index.html';
});
