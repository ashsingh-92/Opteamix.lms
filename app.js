// app.js — full LMS front-end logic including cards, available list, suggestions (no-key fallback)

// Demo course data (stored in localStorage for persistence)
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

// show welcome text using stored email
const email = localStorage.getItem('lms_user_email') || 'Learner';
$q('#welcomeText') && ($q('#welcomeText').textContent = `Hello, ${email}! Ready to learn today?`);

// helper for badge class
function badgeClassFor(progress){
  if(progress >= 80) return 'progress-badge high';
  if(progress >= 30) return 'progress-badge mid';
  return 'progress-badge low';
}

// render square cards (Progress Tracker)
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
    div.title = c.desc || '';

    // compute ring degrees
    const deg = Math.round((c.progress/100)*360);
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

    // keyboard: Enter / Space to open modal
    div.addEventListener('keydown', (ev) => {
      if(ev.key === 'Enter' || ev.key === ' ') {
        ev.preventDefault();
        openModal(c.id);
      }
    });
  });
}

renderCards(courses);

// search in-progress courses on dashboard
$q('#courseSearch')?.addEventListener('input', (e) => {
  const q = e.target.value.trim().toLowerCase();
  const filtered = courses.filter(c => c.title.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q));
  renderCards(filtered);
});

/* Available Training rendering */
function renderAvailableTrainings() {
  const el = document.getElementById('availableList');
  if(!el) return;
  el.innerHTML = '';
  courses.forEach(c => {
    const row = document.createElement('div');
    row.className = 'available-item';
    row.innerHTML = `
      <div class="left">
        <div style="width:44px;height:44px;border-radius:8px;background:#fbfdff;display:flex;align-items:center;justify-content:center;font-size:20px">
          ${svgs[c.svg] ? '' : '📘'}
        </div>
        <div>
          <div class="title">${c.title}</div>
          <div class="meta">${c.desc}</div>
        </div>
      </div>
      <div class="right">
        <button class="btn-ghost enroll-btn" data-id="${c.id}">${c.progress>0 ? 'Continue' : 'Enroll'}</button>
      </div>
    `;
    el.appendChild(row);
  });

  // hook enroll buttons
  document.querySelectorAll('.enroll-btn').forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      const id = e.currentTarget.dataset.id;
      openModal(id);
    });
  });
}

/* ---------------------- Course Suggestions (no-API fallback + live search links) ---------------------- */

// CONFIG: provide a YouTube API key to enable live YouTube searches (optional)
const YOUTUBE_API_KEY = ''; // keep empty if you don't have a key

// Demo static suggestions (used if no API key / as fallback)
const demoSuggestions = [
  { title: 'Python for Everybody (Coursera)', source: 'Coursera', desc: 'Beginner Python course covering basics to web scraping', url: 'https://www.coursera.org' },
  { title: 'Learning How to Learn', source: 'Coursera', desc: 'Popular course on learning techniques', url: 'https://www.coursera.org' },
  { title: 'Communication Skills - YouTube Playlist', source: 'YouTube', desc: 'Short videos covering workplace communication', url: 'https://www.youtube.com' },
  { title: 'Agile Crash Course', source: 'LinkedIn Learning', desc: 'Agile principles & ceremonies', url: 'https://www.linkedin.com/learning' }
];

// Utility: open a target url in new tab (used by search buttons)
function openInNewTab(url){
  window.open(url, '_blank', 'noopener,noreferrer');
}

// Render suggestions array to DOM (unchanged demo/live results)
function renderSuggestions(list, query = '') {
  const out = document.getElementById('suggestionsResults');
  if(!out) return;
  out.innerHTML = '';
  if(!list || !list.length){
    out.innerHTML = '<div class="muted">No suggestions found.</div>';
  } else {
    list.forEach(s => {
      const card = document.createElement('div');
      card.className = 'suggestion-card';
      card.innerHTML = `
        <div class="sugg-title">${s.title}</div>
        <div class="sugg-source">${s.source || 'Web'}</div>
        <div class="sugg-desc">${s.desc || ''}</div>
        <a class="sugg-link" href="${s.url || '#'}" target="_blank" rel="noopener">Open course</a>
      `;
      out.appendChild(card);
    });
  }

  // ALWAYS append a "Search live on" helper card (works without API keys)
  const helper = document.createElement('div');
  helper.className = 'suggestion-card';
  helper.innerHTML = `
    <div class="sugg-title">Search live on platforms</div>
    <div class="sugg-desc">Open full search results on popular platforms for: <strong>${escapeHtml(query || '')}</strong></div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px">
      <button id="search_youtube" class="btn-ghost">YouTube</button>
      <button id="search_coursera" class="btn-ghost">Coursera</button>
      <button id="search_linkedin" class="btn-ghost">LinkedIn Learning</button>
      <button id="search_google" class="btn-ghost">Google (site:coursera.org)</button>
    </div>
  `;
  out.appendChild(helper);

  // Hook up buttons
  helper.querySelector('#search_youtube')?.addEventListener('click', ()=> {
    const q = encodeURIComponent(query || '');
    if(!q) return;
    openInNewTab(`https://www.youtube.com/results?search_query=${q}`);
  });
  helper.querySelector('#search_coursera')?.addEventListener('click', ()=> {
    const q = encodeURIComponent(query || '');
    if(!q) return;
    openInNewTab(`https://www.coursera.org/search?query=${q}`);
  });
  helper.querySelector('#search_linkedin')?.addEventListener('click', ()=> {
    const q = encodeURIComponent(query || '');
    if(!q) return;
    openInNewTab(`https://www.linkedin.com/learning/search?keywords=${q}`);
  });
  helper.querySelector('#search_google')?.addEventListener('click', ()=> {
    const q = encodeURIComponent(query || '');
    if(!q) return;
    openInNewTab(`https://www.google.com/search?q=site:coursera.org+${q}`);
  });
}

// Simple YouTube search (returns Promise of results) — uses YouTube Data API v3 if key provided
async function searchYouTube(q, maxResults=6) {
  if(!YOUTUBE_API_KEY) return [];
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=${maxResults}&q=${encodeURIComponent(q)}&key=${YOUTUBE_API_KEY}`;
  try {
    const r = await fetch(url);
    if(!r.ok){ console.warn('YouTube API error', r.statusText); return []; }
    const data = await r.json();
    return data.items.map(it => ({
      title: it.snippet.title,
      source: 'YouTube',
      desc: it.snippet.channelTitle,
      url: `https://www.youtube.com/watch?v=${it.id.videoId}`
    }));
  } catch(e){
    console.error('YouTube search failed', e);
    return [];
  }
}

// Master search orchestration: uses demo suggestions and optionally live YouTube results,
// and always appends the "search live on platforms" helper card.
async function searchSuggestions(query) {
  const q = (query || '').trim();
  if(!q) {
    renderSuggestions([], '');
    return;
  }

  // 1) show filtered demo suggestions quickly
  const quick = demoSuggestions.filter(d => d.title.toLowerCase().includes(q.toLowerCase()) || (d.desc && d.desc.toLowerCase().includes(q.toLowerCase())));
  renderSuggestions(quick, q);

  // 2) if YOUTUBE key present, fetch YouTube and show merged results
  if(YOUTUBE_API_KEY){
    const yt = await searchYouTube(q, 6);
    const merged = [...yt];
    const final = merged.length ? merged : quick;
    renderSuggestions(final, q);
    return;
  }

  // 3) no API keys — we've already shown demo results; user can click "Search live on platforms"
  return;
}

/* Utility: escape HTML for safe innerHTML usage in helper text */
function escapeHtml(str){
  if(!str) return '';
  return str.replace(/[&<>"']/g, function(m){ return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]); });
}

/* ----------------- Modal controls & interactions ----------------- */
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
  renderAvailableTrainings();
});

// enroll/continue from available list handled in renderAvailableTrainings

/* ----------------- Hook up new UI on DOMContentLoaded ----------------- */
document.addEventListener('DOMContentLoaded', ()=>{
  // initial renders
  renderCards(courses);
  renderAvailableTrainings();

  // suggestion search handlers
  const searchInput = document.getElementById('suggestSearchInput');
  const searchBtn = document.getElementById('suggestSearchBtn');

  if(searchBtn){
    searchBtn.addEventListener('click', ()=> searchSuggestions(searchInput.value));
  }
  if(searchInput){
    searchInput.addEventListener('keyup', (e)=>{
      if(e.key === 'Enter') searchSuggestions(searchInput.value);
    });
  }

  // logout
  $q('#logoutBtn')?.addEventListener('click', ()=>{
    try { localStorage.removeItem('lms_user_email'); } catch(e) {}
    window.location.href = 'index.html';
  });
});
