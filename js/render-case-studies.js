/**
 * Renders case studies from data/case-studies.json into #case-study-list.
 *
 * Enhanced v2 — supports:
 *   - gallery (array of images → mini carousel)
 *   - image (single image, still works)
 *   - impact { before, after } (before/after comparison bars)
 *   - diagram (architecture diagram image path)
 *   - metrics with optional impact values
 *   - count-up animation triggered by IntersectionObserver
 *
 * TO ADD A NEW CASE STUDY: edit data/case-studies.json only.
 * Full field guide: see HOW_TO_ADD_CASE_STUDIES.md
 */

async function renderCaseStudies() {
  const container = document.getElementById('case-study-list');
  if (!container) return;

  let entries;
  try {
    const res = await fetch('data/case-studies.json');
    if (!res.ok) throw new Error('Fetch failed');
    entries = await res.json();
  } catch (err) {
    container.innerHTML = `
      <div class="entry" style="padding:32px; text-align:center;">
        <p style="font-family:var(--mono); font-size:13px; color:var(--text-faint);">
          Case studies couldn't load. If you're testing locally, run a local server
          (e.g. <code>python -m http.server</code>) — the browser blocks direct file:// fetches.
          On GitHub Pages this loads automatically.
        </p>
      </div>`;
    return;
  }

  container.innerHTML = entries.map((entry, idx) => renderEntry(entry, idx)).join('');

  // ---- wire up video lightbox triggers
  container.querySelectorAll('[data-video-id]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      openVideoLightbox(btn.getAttribute('data-video-id'));
    });
  });

  // ---- image gallery carousel controls
  container.querySelectorAll('.gallery-prev, .gallery-next').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const wrap = btn.closest('.entry-media');
      const images = JSON.parse(wrap.getAttribute('data-gallery'));
      let idx = parseInt(wrap.getAttribute('data-active'));
      idx = btn.classList.contains('gallery-next') ? (idx + 1) % images.length : (idx - 1 + images.length) % images.length;
      wrap.querySelector('.gallery-img').src = images[idx];
      wrap.setAttribute('data-active', idx);
      wrap.querySelector('.gallery-counter').textContent = (idx + 1) + ' / ' + images.length;
    });
  });

  // ---- metric count-up animation (IntersectionObserver)
  const counterEls = container.querySelectorAll('[data-count-to]');
  if (counterEls.length && 'IntersectionObserver' in window) {
    const countObserver = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = parseFloat(el.getAttribute('data-count-to'));
        if (!Number.isFinite(target)) {
          countObserver.unobserve(el);
          return;
        }
        const duration = 1400;
        const start = performance.now();
        function tick(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = el.getAttribute('data-prefix') + Math.round(eased * target) + (el.getAttribute('data-suffix') || '');
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        countObserver.unobserve(el);
      });
    }, { threshold: 0.4 });
    counterEls.forEach(el => countObserver.observe(el));
  }

  // Let the caller (main script) know new .reveal elements exist
  document.dispatchEvent(new CustomEvent('case-studies:rendered'));
}

function renderEntry(entry, idx) {
  // --- media block: gallery > single image > placeholder
  let mediaBlock = '';
  if (entry.gallery && entry.gallery.length) {
    const g = entry.gallery;
    mediaBlock = `
      <div class="entry-media entry-media--gallery" data-gallery='${JSON.stringify(g)}' data-active="0" data-index="${idx}">
        <img src="${g[0]}" alt="${escapeHtml(entry.title)}" class="gallery-img" loading="lazy">
        <button class="gallery-prev" aria-label="Previous image"><i class="fas fa-chevron-left"></i></button>
        <button class="gallery-next" aria-label="Next image"><i class="fas fa-chevron-right"></i></button>
        <span class="gallery-counter">1 / ${g.length}</span>
      </div>`;
  } else if (entry.image) {
    mediaBlock = `<div class="entry-media"><img src="${entry.image}" alt="${escapeHtml(entry.title)}" loading="lazy"></div>`;
  } else {
    const catIcon = entry.categoryIcon || 'fa-folder';
    mediaBlock = `<div class="entry-media entry-media--placeholder">
      <div class="entry-media__icon-wrap"><i class="fas ${catIcon}"></i></div>
      <span class="entry-media__add-hint">Add image or gallery in case-studies.json</span>
    </div>`;
  }

  // --- metrics with optional count-up (numeric values only — never clobber text)
  const metricsHtml = entry.metrics.map(m => {
    const isPlaceholder = m.placeholder;
    const prefix = m.prefix || '';
    const suffix = m.suffix || '';
    const raw = String(m.value == null ? '' : m.value).replace(/,/g, '');
    const isNumeric = /^-?\d+(\.\d+)?$/.test(raw.trim());
    if (isPlaceholder || !isNumeric) {
      const display = isPlaceholder
        ? `— ${escapeHtml(m.value)} —`
        : `${escapeHtml(prefix)}${escapeHtml(m.value)}${escapeHtml(suffix)}`;
      return `<div class="metric"><div class="m-label">${escapeHtml(m.label)}</div><span class="m-value${isPlaceholder ? ' placeholder-note' : ''}">${display}</span></div>`;
    }
    return `<div class="metric"><div class="m-label">${escapeHtml(m.label)}</div><span class="m-value" data-count-to="${parseFloat(raw)}" data-prefix="${escapeHtml(prefix)}" data-suffix="${escapeHtml(suffix)}">${escapeHtml(prefix)}${escapeHtml(m.value)}${escapeHtml(suffix)}</span></div>`;
  }).join('');

  // --- before/after impact bar
  let impactBar = '';
  if (entry.impact) {
    const beforeLabel = entry.impact.before || 'Before';
    const afterLabel = entry.impact.after || 'After';
    const improvement = entry.impact.improvement || 'Significant improvement';
    impactBar = `
      <div class="impact-bar">
        <div class="impact-node impact-node--before">
          <div class="impact-node__label">BEFORE</div>
          <div class="impact-node__value">${escapeHtml(beforeLabel)}</div>
        </div>
        <div class="impact-arrow">
          <div class="impact-arrow__line"></div>
          <div class="impact-arrow__improvement">${escapeHtml(improvement)}</div>
        </div>
        <div class="impact-node impact-node--after">
          <div class="impact-node__label">AFTER</div>
          <div class="impact-node__value">${escapeHtml(afterLabel)}</div>
        </div>
      </div>`;
  }

  // --- tech tags with staggered animation
  const techHtml = entry.tech.map((t, ti) =>
    `<span class="tech-tag" style="animation-delay:${ti * 50}ms">${escapeHtml(t)}</span>`
  ).join('');

  // --- video link
  const videoLink = entry.video
    ? `<a href="#" class="entry-video-link" data-video-id="${entry.video}"><i class="fab fa-youtube"></i> Watch the walkthrough</a>`
    : '';

  // --- links
  const linksHtml = entry.links.map(l => {
    const icon = l.icon && l.icon.startsWith('fa') && !l.icon.includes(' ') ? `fas ${l.icon}` : (l.icon || 'fas fa-arrow-right');
    const external = l.href.startsWith('http');
    return `<a href="${l.href}" ${external ? 'target="_blank" rel="noopener"' : ''} class="entry-link"><i class="${icon}"></i> ${escapeHtml(l.label)}</a>`;
  }).join('');

  // --- architecture diagram
  let diagramBlock = '';
  if (entry.diagram) {
    diagramBlock = `
      <details class="arch-details">
        <summary class="arch-summary">
          <span><i class="fas fa-project-diagram"></i> Architecture diagram</span>
        </summary>
        <div class="arch-diagram">
          <img src="${entry.diagram}" alt="Architecture diagram for ${escapeHtml(entry.title)}" loading="lazy">
        </div>
      </details>`;
  }

  // --- category icon for head
  const headIcon = entry.categoryIcon
    ? `<span class="entry-head-icon"><i class="fas ${entry.categoryIcon}"></i></span>`
    : '';

  return `
    <article class="entry reveal" data-entry-id="${entry.id}" style="cursor:pointer">
      <div class="entry-head">
        ${headIcon}
        <div class="entry-head-info">
          <div class="entry-code">ENTRY / ${entry.number} — ${escapeHtml(entry.category.toUpperCase())}</div>
          <h3 class="entry-title">${escapeHtml(entry.title)}</h3>
          <div class="entry-role">${escapeHtml(entry.role)}</div>
        </div>
        <span class="entry-status">${escapeHtml(entry.status)}</span>
      </div>
      ${mediaBlock}
      ${impactBar}
      <div class="entry-body">
        <div class="entry-grid">
          <div class="entry-block"><h4><i class="fas fa-circle-exclamation"></i> The problem</h4><p>${escapeHtml(entry.problem)}</p></div>
          <div class="entry-block"><h4><i class="fas fa-lightbulb"></i> The approach</h4><p>${escapeHtml(entry.approach)}</p></div>
        </div>
        <div class="metric-row">${metricsHtml}</div>
        <div class="tech-row">${techHtml}</div>
        <div class="entry-links">${videoLink}${linksHtml}</div>
        ${diagramBlock}
      </div>
    </article>`;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str || '';
  return div.innerHTML;
}

function openVideoLightbox(videoId) {
  let modal = document.getElementById('video-lightbox');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'video-lightbox';
    modal.className = 'lightbox';
    modal.innerHTML = `
      <div class="lightbox-backdrop" data-close></div>
      <div class="lightbox-panel" role="dialog" aria-modal="true" aria-label="Video player">
        <button class="lightbox-close" data-close aria-label="Close video"><i class="fas fa-xmark"></i></button>
        <div class="lightbox-frame"></div>
      </div>`;
    document.body.appendChild(modal);
    modal.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', closeVideoLightbox));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeVideoLightbox(); });
  }
  modal.querySelector('.lightbox-frame').innerHTML =
    `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/${videoId}?autoplay=1" title="Video" frameborder="0" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
  modal.classList.add('open');
  if (window.__a11y) {
    window.__a11y.saveFocus();
    window.__a11y.focusFirst(modal.querySelector('.lightbox-panel'));
  }
}

function closeVideoLightbox() {
  const modal = document.getElementById('video-lightbox');
  if (!modal) return;
  modal.classList.remove('open');
  modal.querySelector('.lightbox-frame').innerHTML = '';
  if (window.__a11y) window.__a11y.restoreFocus();
}

document.addEventListener('DOMContentLoaded', renderCaseStudies);
