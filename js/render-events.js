/**
 * Renders events and certificates from data/events.json into #events-list.
 *
 * Features:
 * - Dynamic event cards with images
 * - Popup functionality for certificates
 * - Category filtering
 * - Responsive design
 * - Intersection Observer for animations
 */

async function renderEvents() {
  const container = document.getElementById('events-list');
  if (!container) return;

  let events;
  try {
    const res = await fetch('data/events.json');
    if (!res.ok) throw new Error('Fetch failed');
    events = await res.json();
  } catch (err) {
    container.innerHTML = `
      <div style="padding: 32px; text-align: center; max-width: 600px; margin: 0 auto;">
        <h3 style="color: var(--brass); margin-bottom: 16px;">Events Preview</h3>
        <p style="font-family: var(--mono); font-size: 13px; color: var(--text-dim); margin-bottom: 20px;">
          <strong>Local Development Mode:</strong> Events require a local server to preview.
        </p>
        <div style="background: var(--ink-2); border: 1px solid var(--hairline); border-radius: 8px; padding: 16px; text-align: left;">
          <p style="font-size: 13px; margin-bottom: 12px;"><strong>Quick Fix:</strong></p>
          <code style="display: block; background: var(--ink); padding: 12px; border-radius: 6px; font-size: 12px; margin-bottom: 12px;">python -m http.server 8000</code>
          <p style="font-size: 12px; color: var(--text-faint);">Then visit: <a href="http://localhost:8000" target="_blank" style="color: var(--brass);">http://localhost:8000</a></p>
        </div>
        <p style="font-size: 12px; color: var(--text-faint); margin-top: 16px;">
          On GitHub Pages, events load automatically.
        </p>
      </div>`;
    return;
  }

  container.innerHTML = events.map((event, idx) => renderEventCard(event, idx)).join('');

  // Add click handlers for certificate popups
  container.querySelectorAll('[data-certificate]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openCertificatePopup(btn.getAttribute('data-certificate'), btn.getAttribute('data-event-title'));
    });
  });

  // Trigger animations
  document.dispatchEvent(new CustomEvent('events:rendered'));
}

function renderEventCard(event, idx) {
  const typeIcon = getTypeIcon(event.type);

  // Media block
  let mediaBlock = '';
  if (event.image) {
    mediaBlock = `<div class="event-media">
      <img src="${event.image}" alt="${escapeHtml(event.title)}" loading="lazy">
    </div>`;
  } else if (event.certificate) {
    mediaBlock = `<div class="event-media event-media--certificate">
      <div class="certificate-preview">
        <i class="fas fa-certificate"></i>
        <span>Certificate Available</span>
      </div>
    </div>`;
  } else {
    mediaBlock = `<div class="event-media event-media--placeholder">
      <div class="placeholder-icon"><i class="fas ${typeIcon}"></i></div>
      <span class="placeholder-hint">Add image in events.json</span>
    </div>`;
  }

  // Certificate button
  const certButton = event.certificate
    ? `<button class="cert-btn" data-certificate="${event.certificate}" data-event-title="${escapeHtml(event.title)}">
        <i class="fas fa-expand"></i> View Certificate
       </button>`
    : '';

  // External / anchor link button
  const linkButton = event.link
    ? `<a class="event-link-btn" href="${escapeHtml(event.link)}" ${event.link.startsWith('http') ? 'target="_blank" rel="noopener"' : ''}>
        <i class="fas fa-arrow-right"></i> Details
       </a>`
    : '';

  return `<article class="event-card reveal" data-event-id="${event.id}" style="animation-delay: ${idx * 100}ms">
    <div class="event-head">
      <div class="event-date">${formatDate(event.date)}</div>
      <div class="event-category">${escapeHtml(event.category)}</div>
    </div>
    ${mediaBlock}
    <div class="event-body">
      <h3>${escapeHtml(event.title)}</h3>
      <div class="event-meta">
        <span><i class="fas fa-building"></i> ${escapeHtml(event.organization)}</span>
        <span><i class="fas fa-map-marker-alt"></i> ${escapeHtml(event.location)}</span>
      </div>
      <p class="event-description">${escapeHtml(event.description)}</p>
      ${certButton}${linkButton}
    </div>
  </article>`;
}

function getTypeIcon(type) {
  const icons = {
    'achievement': 'fa-trophy',
    'presentation': 'fa-presentation',
    'service': 'fa-hands-helping',
    'teaching': 'fa-chalkboard-teacher',
    'competition': 'fa-code',
    'workshop': 'fa-users'
  };
  return icons[type] || 'fa-calendar-alt';
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  if (/^\d{4}$/.test(String(dateStr))) return String(dateStr); // year-only dates stay as-is
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return String(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str || '';
  return div.innerHTML;
}

function openCertificatePopup(certificateUrl, title) {
  let modal = document.getElementById('certificate-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'certificate-modal';
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-backdrop" data-close></div>
      <div class="modal-panel" role="dialog" aria-modal="true">
        <button class="modal-close" data-close aria-label="Close">
          <i class="fas fa-xmark"></i>
        </button>
        <div class="modal-content">
          <img src="" alt="${title}" id="certificate-image">
        </div>
      </div>`;
    document.body.appendChild(modal);

    // Close handlers
    modal.querySelectorAll('[data-close]').forEach(el => {
      el.addEventListener('click', closeCertificatePopup);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeCertificatePopup();
    });
  }

  const img = modal.querySelector('#certificate-image');
  img.src = certificateUrl;
  img.alt = title;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  if (window.__a11y) {
    window.__a11y.saveFocus();
    window.__a11y.focusFirst(modal.querySelector('.modal-panel'));
  }
}

function closeCertificatePopup() {
  const modal = document.getElementById('certificate-modal');
  if (!modal) return;
  modal.classList.remove('open');
  document.body.style.overflow = '';
  if (window.__a11y) window.__a11y.restoreFocus();
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderEvents);
} else {
  renderEvents();
}