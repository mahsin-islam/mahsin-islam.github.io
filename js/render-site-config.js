/**
 * Renders settings-driven UI from data/site-config.json:
 *   - dismissible notice / announcement bar (date-windowed)
 *   - featured video facade (click-to-play, privacy-enhanced embed)
 *
 * Edit data/site-config.json to change anything. No HTML edits needed.
 * Safe no-op if the JSON is missing or invalid.
 */
(async function () {
  let cfg = null;
  try {
    const res = await fetch('data/site-config.json');
    if (res.ok) cfg = await res.json();
  } catch (err) {
    console.warn('site-config.json not loaded:', err);
  }

  /* ---- Notice bar ---- */
  if (cfg && cfg.notice && cfg.notice.enabled !== false) {
    const n = cfg.notice;
    const now = Date.now();
    const start = n.start ? new Date(n.start).getTime() : 0;
    const end = n.end ? new Date(n.end).getTime() : Infinity;
    let dismissed = '';
    try {
      dismissed = localStorage.getItem('site-notice-dismissed') || '';
    } catch (e) {}
    if (now >= start && now <= end && dismissed !== (n.id || n.text)) {
      const bar = document.createElement('div');
      bar.className = 'site-notice notice-' + (n.severity || 'info');
      bar.setAttribute('role', 'status');
      bar.innerHTML =
        '<span>' +
        esc(n.text || '') +
        (n.link
          ? ' <a href="' + escAttr(n.link) + '">' + esc(n.linkLabel || 'Learn more') + '</a>'
          : '') +
        '</span>' +
        (n.dismissible !== false
          ? '<button class="notice-close" aria-label="Dismiss notice">&times;</button>'
          : '');
      document.body.insertBefore(bar, document.body.firstChild);
      const closeBtn = bar.querySelector('.notice-close');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          bar.remove();
          try {
            localStorage.setItem('site-notice-dismissed', n.id || n.text || 'notice');
          } catch (e) {}
        });
      }
    }
  }

  /* ---- Featured video facade (index #video-editing slot) ---- */
  const slot = document.querySelector('[data-config="featuredVideo"]');
  if (slot && cfg && cfg.featuredVideo) {
    const v = cfg.featuredVideo;
    if (v.id) {
      const facade = document.createElement('div');
      facade.className = 'video-facade';
      facade.setAttribute('role', 'button');
      facade.setAttribute('tabindex', '0');
      facade.setAttribute('aria-label', 'Play video: ' + (v.title || 'featured video'));
      facade.innerHTML =
        '<img src="https://i.ytimg.com/vi/' +
        escAttr(v.id) +
        '/hqdefault.jpg" alt="' +
        esc(v.title || 'Video thumbnail') +
        '" loading="lazy">' +
        '<div class="facade-play"><span><i class="fas fa-play"></i></span></div>';
      const play = () => {
        facade.innerHTML =
          '<iframe src="https://www.youtube-nocookie.com/embed/' +
          escAttr(v.id) +
          '?autoplay=1" title="' +
          esc(v.title || 'Video') +
          '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
      };
      facade.addEventListener('click', play);
      facade.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          play();
        }
      });
      slot.innerHTML = '';
      slot.appendChild(facade);
    }
    // If no id is set, the static fallback (channel link card) already in the HTML stays.
  }

  /* ---- Lifestyle section (hidden until data exists in site-config.json) ---- */
  const lifeSection = document.querySelector('[data-config-section="lifestyle"]');
  const lifeBox = document.querySelector('[data-config="lifestyle"]');
  if (lifeSection && lifeBox && cfg && Array.isArray(cfg.lifestyle) && cfg.lifestyle.length) {
    lifeSection.style.display = '';
    lifeBox.innerHTML = cfg.lifestyle
      .map(
        (item) =>
          '<div class="cap-cell">' +
          '<h3><i class="fas ' +
          escAttr(item.icon || 'fa-star') +
          '" style="color:var(--brass); margin-right:8px;"></i>' +
          esc(item.title) +
          '</h3>' +
          (item.detail
            ? '<p style="color:var(--text-dim); font-size:13.5px; line-height:1.6; margin-bottom:12px;">' +
              esc(item.detail) +
              '</p>'
            : '') +
          '<div class="cap-tags">' +
          (item.tags || []).map((t) => '<span>' + esc(t) + '</span>').join('') +
          '</div>' +
          '</div>'
      )
      .join('');
  }

  /* ---- Courses / YouTube feed (settings-driven) ----
     1. Prebuilt data/youtube.json (future GitHub Action) wins.
     2. Else live channel RSS when youtube.channelId is set.
     3. Else the static fallback card already in the HTML stays. */
  const courseBox = document.querySelector('[data-config="courses"]');
  if (courseBox) {
    loadCourses(cfg && cfg.youtube);
  }

  async function loadCourses(yt) {
    let videos = null;
    try {
      const r = await fetch('data/youtube.json');
      if (r.ok) {
        const d = await r.json();
        if (Array.isArray(d.videos) && d.videos.length) videos = d.videos;
      }
    } catch (e) {}
    if (!videos && yt && yt.channelId) {
      try {
        const res = await fetch(
          'https://www.youtube.com/feeds/videos.xml?channel_id=' +
            encodeURIComponent(yt.channelId)
        );
        if (res.ok) {
          const xml = await res.text();
          const doc = new DOMParser().parseFromString(xml, 'text/xml');
          const entries = doc.querySelectorAll('entry');
          videos = Array.from(entries)
            .slice(0, 6)
            .map(function (en) {
              const idEl = en.querySelector('yt\\:videoId') || en.querySelector('videoId');
              const vid = idEl ? (idEl.textContent || '').trim() : '';
              const titleEl = en.querySelector('title');
              const statEl = en.querySelector('media\\:statistics') || en.querySelector('statistics');
              const pubEl = en.querySelector('published');
              return {
                id: vid,
                title: titleEl ? titleEl.textContent : 'Untitled',
                url: 'https://www.youtube.com/watch?v=' + vid,
                thumbnail: vid ? 'https://i.ytimg.com/vi/' + vid + '/hqdefault.jpg' : '',
                views: statEl ? parseInt(statEl.getAttribute('views'), 10) || 0 : 0,
                published: pubEl ? pubEl.textContent : ''
              };
            })
            .filter(function (v) {
              return v.id;
            });
        }
      } catch (e) {
        console.warn('YouTube RSS fetch failed:', e);
      }
    }
    if (videos && videos.length) {
      courseBox.innerHTML = videos
        .map(function (v) {
          return (
            '<a class="yt-card" href="' + escAttr(v.url) + '" target="_blank" rel="noopener">' +
            '<div class="yt-thumb"><img src="' + escAttr(v.thumbnail) + '" alt="' + esc(v.title) + '" loading="lazy">' +
            '<span class="yt-duration">▶</span></div>' +
            '<div class="yt-body"><h4>' + esc(v.title) + '</h4>' +
            '<div class="yt-meta"><span>' + (v.views ? formatViews(v.views) + ' views' : 'New') + '</span><span>Watch →</span></div>' +
            '</div></a>'
          );
        })
        .join('');
    }
  }

  function formatViews(n) {
    if (n >= 1000000) return (n / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    return String(n);
  }

  function esc(s) {
    const d = document.createElement('div');
    d.textContent = s == null ? '' : String(s);
    return d.innerHTML;
  }
  function escAttr(s) {
    return esc(s).replace(/"/g, '&quot;');
  }
})();
