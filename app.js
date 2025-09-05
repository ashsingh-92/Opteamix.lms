// app.js — simple front-end LMS logic (localStorage-backed)

const demoCourses = [
  { id: 'c1', icon: '🤖', title: 'AI Basics', desc: 'Intro to AI concepts for beginners', progress: 0 },
  { id: 'c2', icon: '⚡', title: 'Agile Foundations', desc: 'Agile principles & ceremonies', progress: 40 },
  { id: 'c3', icon: '💬', title: 'Communication', desc: 'Improve workplace communication', progress: 10 },
  { id: 'c4', icon: '🔒', title: 'Data Security', desc: 'Security best practices', progress: 0 },
  { id: 'c5', icon: '🧠', title: 'Emotional IQ', desc: 'Emotional intelligence at work', progress: 0 }
];

const $q = s => document.querySelector(s);
const $qa = s => Array.from(document.querySelectorAll(s));

// Ensure demo data is stored if not already
let courses = JSON.parse(localStorage.getItem('lms_demo_courses')) || demoCourses;
if (!localStorage.getItem('lms_demo_courses')) {
  localStorage.setItem('lms_demo_courses', JSON.stringify(courses));
}

// Show welcome text using stored email
const email = localStorage.getItem('lms_user_email') || 'Learner';
$q('#welcomeText') && ($q('#welcomeText').textContent = `Hello, ${email}! Ready to learn today?`);

// Render square cards
function renderCards(list) {
  const grid = $q('#cardsGrid');
  if (!grid) return;
  grid.innerHTML = '';
  (list || []).forEach(c => {
    const div = document.createElement('div');
    div.className = 'card-square';
    div.tabIndex = 0;
    div.dataset.id = c.id;
    div.innerHTML = `
      <div class="card-icon" aria-hidden="true">${c.icon}</div>
      <div class="card-title">${c.title}</div>
    `;
    grid.appendChild(div);
  });
}

renderCards(courses);

// Search functionality
$q('#courseSearch')?.addEventListener('input', (e) => {
  const q = e.target.value.trim().toLowerCase();
  const filtered = courses.filter(c => c.title.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q));
  renderCards(filtered);
});

// Modal controls
const modal = $q('#detailModal');
const modalBody = $q('#modalBody');
const modalClose = $q('#modalClose');
const modalStart = $q('#modalStart');
const modalBack = $q('#modalBack');
let activeCourseId = null;

function openModal(id) {
  activeCourseId = id;
  const c = courses.find(x => x.id === id);
  if (!c) return;
  modalBody.innerHTML = `<h2 id="modalTitle" style="margin-top:0">${c.icon} ${c.title}</h2>
    <p style="color:var(--muted)">${c.desc}</p>
    <p><strong>Progress:</strong> ${c.progress}%</p>`;
  modal.setAttribute('aria-hidden', 'false');
  // focus management
  modalClose?.focus();
}

function closeModal() {
  activeCourseId = null;
  modal.setAttribute('aria-hidden', 'true');
}

// Delegate click to open modal
document.addEventListener('click', (e) => {
  const card = e.target.closest('.card-square');
  if (card) {
    openModal(card.dataset.id);
  }
});

// Keyboard escape to close
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

modalClose?.addEventListener('click', closeModal);
modalBack?.addEventListener('click', closeModal);

// Start learning increments progress (demo)
modalStart?.addEventListener('click', () => {
  if (!activeCourseId) return;
  courses = courses.map(c => c.id === activeCourseId ? { ...c, progress: Math.min(100, c.progress + 20) } : c);
  localStorage.setItem('lms_demo_courses', JSON.stringify(courses));
  closeModal();
  renderCards(courses);
});

// Logout button
$q('#logoutBtn')?.addEventListener('click', () => {
  try { localStorage.removeItem('lms_user_email'); } catch (e) {}
  window.location.href = 'index.html';
});
