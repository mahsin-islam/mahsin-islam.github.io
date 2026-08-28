/**
 * Shared site search (framework-free). Load on any page that has the
 * .search-wrap markup (toggle / box / input / close / results), then:
 *
 *   initSiteSearch({
 *     seeds: [{ type, title, detail, url, tags }],            // static entries
 *     dataFiles: [{ file: 'data/….json', map: fn }]           // JSON → entries
 *   });
 *
 * Debounced (180 ms), index built lazily once, results escaped, aria-live list.
 */
(function () {
  var idx = [];
  var built = false;

  function esc(s) {
    var d = document.createElement('div');
    d.textContent = s == null ? '' : String(s);
    return d.innerHTML;
  }

  function buildIdx(o) {
    if (built) return Promise.resolve();
    built = true;
    idx = (o && o.seeds ? o.seeds : []).slice();
    var jobs = [];
    if (o && o.dataFiles) {
      o.dataFiles.forEach(function (spec) {
        var file = typeof spec === 'string' ? spec : spec.file;
        var map = typeof spec === 'string' ? null : spec.map;
        jobs.push(
          fetch(file)
            .then(function (r) {
              if (!r.ok) throw new Error('HTTP ' + r.status);
              return r.json();
            })
            .then(function (data) {
              if (map) idx = idx.concat(data.map(map));
            })
            .catch(function () {})
        );
      });
    }
    return Promise.all(jobs);
  }

  window.initSiteSearch = function (opts) {
    var wrap = document.querySelector('.search-wrap');
    if (!wrap) return;
    var toggle = wrap.querySelector('.search-toggle');
    var box = wrap.querySelector('.search-box');
    var input = wrap.querySelector('.search-box input');
    var close = wrap.querySelector('.search-close');
    var results = wrap.querySelector('.search-results');
    if (!toggle || !box || !input || !close || !results) return;

    var debounceTimer = null;

    toggle.addEventListener('click', function () {
      box.classList.add('open');
      input.focus();
    });
    close.addEventListener('click', function () {
      box.classList.remove('open');
      results.classList.remove('show');
      input.value = '';
    });
    input.addEventListener('input', function () {
      var q = input.value.trim().toLowerCase();
      clearTimeout(debounceTimer);
      if (q.length < 2) {
        results.classList.remove('show');
        return;
      }
      debounceTimer = setTimeout(function () {
        buildIdx(opts).then(function () {
          var matches = idx
            .filter(function (item) {
              return (
                (item.title || '').toLowerCase().indexOf(q) !== -1 ||
                (item.detail || '').toLowerCase().indexOf(q) !== -1 ||
                (item.tags || []).some(function (t) {
                  return t.toLowerCase().indexOf(q) !== -1;
                })
              );
            })
            .slice(0, 6);
          results.innerHTML = matches.length
            ? matches
                .map(function (m) {
                  return (
                    '<a href="' + esc(m.url) + '" class="search-item">' +
                    '<div class="sr-type">' + esc(m.type) + '</div>' +
                    '<div class="sr-title">' + esc(m.title) + '</div>' +
                    (m.detail ? '<div class="sr-detail">' + esc(m.detail) + '</div>' : '') +
                    '</a>'
                  );
                })
                .join('')
            : '<div class="no-results">Nothing found</div>';
          results.classList.add('show');
        });
      }, 180);
    });
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.search-wrap')) results.classList.remove('show');
    });
  };
})();
