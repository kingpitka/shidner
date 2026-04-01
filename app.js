// ── SHIDNER APP.JS ────────────────────────────────────────────────────────────
// Hash-based router. Routes: #/ (home), #/about, #/project/:slug

const app = document.getElementById('app');

// Accent colors cycled per card
const ACCENTS = ['#ff3c00', '#0057ff', '#c8ff00', '#ff0090', '#0057ff', '#ff3c00'];

// ── ROUTER ────────────────────────────────────────────────────────────────────
function router() {
  const hash = window.location.hash || '#/';
  const [, route, ...rest] = hash.split('/');

  if (hash === '#/' || hash === '#') {
    renderHome();
  } else if (hash === '#/about') {
    renderAbout();
  } else if (hash.startsWith('#/project/')) {
    const slug = rest.join('/');
    renderProject(slug);
  } else {
    renderNotFound();
  }
}

window.addEventListener('hashchange', router);
window.addEventListener('DOMContentLoaded', router);

// ── FETCH PROJECTS ─────────────────────────────────────────────────────────────
async function fetchProjects() {
  const res = await fetch('projects.json?v=' + Date.now());
  if (!res.ok) throw new Error('Could not load projects.json');
  return res.json();
}

// ── HOME ───────────────────────────────────────────────────────────────────────
async function renderHome() {
  app.innerHTML = `
    <section class="hero animate-in">
      <p class="hero-eyebrow">A lab for code, tools & demos</p>
      <h1 class="hero-title">
        SHID<span class="accent-r">N</span>E<span class="accent-b">R</span>
      </h1>
      <p class="hero-sub">Experimental projects built in the margins of the wilderness.</p>
      <div class="hero-badge">Open&nbsp;Lab ✦ Live&nbsp;Demos</div>
    </section>
    <p class="section-label">All projects</p>
    <div class="project-grid" id="grid">
      <div class="loading">Loading projects…</div>
    </div>
  `;

  const grid = document.getElementById('grid');

  try {
    const projects = await fetchProjects();

    if (!projects.length) {
      grid.innerHTML = `
        <div class="empty-state">
          <p>No projects yet — check back soon.</p>
        </div>`;
      return;
    }

    grid.innerHTML = projects.map((p, i) => `
      <a class="card" href="#/project/${p.slug}"
         style="--card-accent: ${ACCENTS[i % ACCENTS.length]}">
        <div class="card-header">
          <span class="card-num">${String(i + 1).padStart(2, '0')}</span>
          <span class="card-arrow">↗</span>
        </div>
        <h2 class="card-title">${p.title}</h2>
        <p class="card-desc">${p.description}</p>
        <div class="card-footer">
          ${p.tags.map(t => `<span class="card-tag">${t}</span>`).join('')}
        </div>
      </a>
    `).join('');

  } catch (err) {
    grid.innerHTML = `
      <div class="empty-state">
        <p>Could not load projects. Check that projects.json exists.</p>
      </div>`;
    console.error(err);
  }
}

// ── PROJECT PAGE ───────────────────────────────────────────────────────────────
async function renderProject(slug) {
  app.innerHTML = `<div class="loading">Loading…</div>`;

  let projects;
  try {
    projects = await fetchProjects();
  } catch {
    renderNotFound();
    return;
  }

  const project = projects.find(p => p.slug === slug);
  if (!project) { renderNotFound(); return; }

  const tagsHtml = project.tags
    .map(t => `<span class="card-tag">${t}</span>`)
    .join('');

  const embedHtml = project.embed_url
    ? `<iframe class="project-embed" src="${project.embed_url}" title="${project.title}" frameborder="0" allowfullscreen></iframe>`
    : `<div class="project-embed" style="display:flex;align-items:center;justify-content:center;color:#6b6456;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;">No demo available</div>`;

  app.innerHTML = `
    <div class="project-page animate-in">
      <a class="project-back" href="#/">← All projects</a>
      <header class="project-header">
        <h1 class="project-page-title">${project.title}</h1>
        <div class="project-meta">
          ${project.date ? `<div class="meta-item"><span class="meta-label">Date</span><span class="meta-value">${project.date}</span></div>` : ''}
          ${project.status ? `<div class="meta-item"><span class="meta-label">Status</span><span class="meta-value">${project.status}</span></div>` : ''}
        </div>
        <div class="project-tags">${tagsHtml}</div>
      </header>
      ${embedHtml}
      ${project.long_description ? `<p class="project-description">${project.long_description}</p>` : ''}
    </div>
  `;
}

// ── ABOUT ──────────────────────────────────────────────────────────────────────
function renderAbout() {
  app.innerHTML = `
    <div class="about-page animate-in">
      <h1 class="about-title">ABOUT<br>THIS LAB</h1>
      <div class="about-body">
        <p>Shidner is a personal sketchbook for code — <span class="about-accent">a place to build, break, and share experiments</span> without the overhead of a polished product.</p>
        <p>Projects here are Claude-powered tools, interactive demos, and utilities built in McCarthy, Alaska, where the winters are long and the side projects are plentiful.</p>
        <p>Nothing here is meant to be finished. Everything here is meant to be useful.</p>
      </div>
    </div>
  `;
}

// ── 404 ────────────────────────────────────────────────────────────────────────
function renderNotFound() {
  app.innerHTML = `
    <div class="not-found animate-in">
      <h2>404</h2>
      <p>Nothing here. <a href="#/">Back to projects →</a></p>
    </div>
  `;
}
