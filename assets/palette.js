/* Palette customizer and layout switcher. Lives top right on every page.
   State is stored in localStorage so the palette follows you across layouts. */
(function () {
  var KEY = 'menulytr.palette.v1';
  var PRESETS = {
    paper:  { bg: '#f4efe6', surface: '#fbf8f2', text: '#1c1a17', muted: '#6f675c', line: '#dcd3c5', accent: '#b5472b', accentInk: '#fbf8f2' },
    noir:   { bg: '#121110', surface: '#1b1917', text: '#f1ece3', muted: '#9a9288', line: '#2e2b27', accent: '#d9a441', accentInk: '#121110' },
    olive:  { bg: '#e9ebe0', surface: '#f3f4ec', text: '#1f2a1e', muted: '#5f6b5a', line: '#c9cfbb', accent: '#4c6b3c', accentInk: '#f3f4ec' },
    rosso:  { bg: '#fbf6f1', surface: '#ffffff', text: '#2a1b18', muted: '#7d6a64', line: '#ead9d2', accent: '#9e2a2b', accentInk: '#ffffff' },
    marine: { bg: '#0f1b2d', surface: '#16243a', text: '#e8eef7', muted: '#93a3b8', line: '#263853', accent: '#f2b880', accentInk: '#0f1b2d' },
    sorbet: { bg: '#fff1e6', surface: '#fff8f2', text: '#3a1f2b', muted: '#8a6b78', line: '#f1d8c9', accent: '#e6552c', accentInk: '#fff8f2' }
  };
  var VARS = [['bg', 'Background'], ['surface', 'Surface'], ['text', 'Text'], ['muted', 'Muted text'], ['line', 'Lines'], ['accent', 'Accent'], ['accentInk', 'Text on accent']];
  var LAYOUTS = [['01', 'Carta', '01-editorial.html', 'Editorial'], ['02', 'Mosaico', '02-gallery.html', 'Gallery'], ['03', 'Bottega', '03-split.html', 'Sidebar'], ['04', 'Tavola', '04-story.html', 'Story'], ['05', 'Lavagna', '05-board.html', 'Board']];
  var html = document.documentElement;
  var state = load();
  apply(state);

  function kebab(s) { return s.replace(/[A-Z]/g, function (m) { return '-' + m.toLowerCase(); }); }
  function lum(hex) {
    var m = /^#?([0-9a-f]{6})$/i.exec(hex); if (!m) return 1;
    var n = parseInt(m[1], 16), c = [n >> 16 & 255, n >> 8 & 255, n & 255].map(function (v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  }
  function defaults() {
    var p = html.getAttribute('data-preset') || 'paper';
    return { preset: p, colors: Object.assign({}, PRESETS[p] || PRESETS.paper), radius: 12, font: 'serif' };
  }
  function load() {
    try { var s = JSON.parse(localStorage.getItem(KEY)); if (s && s.colors && s.colors.bg) return s; } catch (e) {}
    return defaults();
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }
  function apply(s) {
    var st = html.style;
    VARS.forEach(function (v) { st.setProperty('--' + kebab(v[0]), s.colors[v[0]]); });
    st.setProperty('--radius', s.radius + 'px');
    html.setAttribute('data-font', s.font);
    html.setAttribute('data-scheme', lum(s.colors.bg) < 0.3 ? 'dark' : 'light');
    window.dispatchEvent(new CustomEvent('palette:change', { detail: s }));
  }

  function build() {
    var root = html.getAttribute('data-root') || '';
    var here = location.pathname.split('/').pop();
    var dock = document.createElement('div');
    dock.className = 'ml-dock';
    dock.innerHTML =
      '<button class="ml-btn" data-panel="layouts" type="button" aria-expanded="false" aria-controls="ml-layouts" title="Switch layout">' +
        '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="1.5" y="1.5" width="5" height="5" rx="1.2"/><rect x="9.5" y="1.5" width="5" height="5" rx="1.2"/><rect x="1.5" y="9.5" width="5" height="5" rx="1.2"/><rect x="9.5" y="9.5" width="5" height="5" rx="1.2"/></svg>' +
        '<span class="ml-label">Layouts</span><span class="ml-sr">Switch layout</span></button>' +
      '<button class="ml-btn" data-panel="palette" type="button" aria-expanded="false" aria-controls="ml-palette" title="Customize palette">' +
        '<span class="ml-dot" aria-hidden="true"></span><span class="ml-label">Palette</span><span class="ml-sr">Customize palette</span></button>';

    var layouts = document.createElement('div');
    layouts.className = 'ml-panel'; layouts.id = 'ml-layouts'; layouts.setAttribute('role', 'dialog'); layouts.setAttribute('aria-label', 'Layouts');
    layouts.innerHTML = '<div class="ml-panel-head"><strong>Layouts</strong><button class="ml-x" type="button" aria-label="Close">&times;</button></div><div class="ml-list">' +
      LAYOUTS.map(function (l) { return '<a href="' + root + 'variations/' + l[2] + '"' + (here === l[2] ? ' class="on" aria-current="page"' : '') + '><span class="ml-n">' + l[0] + '</span>' + l[1] + '<small>' + l[3] + '</small></a>'; }).join('') +
      '<a href="' + root + 'index.html"' + (here === 'index.html' || here === '' ? ' class="on"' : '') + '><span class="ml-n">&#8635;</span>Overview<small>All five</small></a></div>';

    var pal = document.createElement('div');
    pal.className = 'ml-panel'; pal.id = 'ml-palette'; pal.setAttribute('role', 'dialog'); pal.setAttribute('aria-label', 'Palette');
    pal.innerHTML = '<div class="ml-panel-head"><strong>Palette</strong><button class="ml-x" type="button" aria-label="Close">&times;</button></div>' +
      '<div class="ml-sec">Presets</div><div class="ml-presets">' +
      Object.keys(PRESETS).map(function (k) { var p = PRESETS[k]; return '<button type="button" class="ml-preset" data-preset="' + k + '" title="' + k + '" aria-label="' + k + ' preset" style="--a:' + p.accent + ';--b:' + p.bg + '"></button>'; }).join('') +
      '</div><div class="ml-sec">Colors</div><div class="ml-rows">' +
      VARS.map(function (v) { return '<label class="ml-row"><span>' + v[1] + '</span><span class="ml-swatch" style="background:' + state.colors[v[0]] + '"><input type="color" data-k="' + v[0] + '" value="' + state.colors[v[0]] + '" aria-label="' + v[1] + '"></span><input class="ml-hex" data-k="' + v[0] + '" value="' + state.colors[v[0]] + '" maxlength="7" spellcheck="false" aria-label="' + v[1] + ' hex"></label>'; }).join('') +
      '</div><div class="ml-sec">Shape and type</div>' +
      '<label class="ml-row"><span>Corners</span><input class="ml-range" type="range" min="0" max="28" step="2" value="' + state.radius + '" aria-label="Corner radius"></label>' +
      '<div class="ml-row"><span>Headings</span><div class="ml-seg" role="group" aria-label="Heading typeface"><button type="button" data-font="serif">Serif</button><button type="button" data-font="sans">Sans</button><button type="button" data-font="mono">Mono</button></div></div>' +
      '<div class="ml-panel-foot"><button type="button" class="ml-reset">Reset</button><button type="button" class="ml-copy">Copy CSS</button></div>';

    document.body.appendChild(dock); document.body.appendChild(layouts); document.body.appendChild(pal);
    var panels = { layouts: layouts, palette: pal };
    var btns = dock.querySelectorAll('.ml-btn');

    function openPanel(name) {
      Object.keys(panels).forEach(function (k) {
        var on = k === name && !panels[k].classList.contains('open');
        panels[k].classList.toggle('open', on);
        dock.querySelector('[data-panel="' + k + '"]').setAttribute('aria-expanded', on ? 'true' : 'false');
      });
    }
    function closeAll() { openPanel(null); }
    btns.forEach(function (b) { b.addEventListener('click', function () { openPanel(b.getAttribute('data-panel')); }); });
    document.querySelectorAll('.ml-x').forEach(function (x) { x.addEventListener('click', closeAll); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeAll(); });
    document.addEventListener('pointerdown', function (e) { if (!e.target.closest('.ml-panel, .ml-dock')) closeAll(); });

    function sync() {
      VARS.forEach(function (v) {
        var c = state.colors[v[0]];
        var sw = pal.querySelector('input[type=color][data-k="' + v[0] + '"]');
        sw.value = c; sw.parentNode.style.background = c;
        pal.querySelector('.ml-hex[data-k="' + v[0] + '"]').value = c;
      });
      pal.querySelectorAll('.ml-preset').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-preset') === state.preset); });
      pal.querySelectorAll('.ml-seg button').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-font') === state.font); });
      pal.querySelector('.ml-range').value = state.radius;
    }
    function commit() { apply(state); save(); sync(); }

    pal.querySelectorAll('.ml-preset').forEach(function (b) {
      b.addEventListener('click', function () { state.preset = b.getAttribute('data-preset'); state.colors = Object.assign({}, PRESETS[state.preset]); commit(); });
    });
    pal.querySelectorAll('input[type=color]').forEach(function (i) {
      i.addEventListener('input', function () { state.colors[i.getAttribute('data-k')] = i.value; state.preset = 'custom'; commit(); });
    });
    pal.querySelectorAll('.ml-hex').forEach(function (i) {
      i.addEventListener('change', function () {
        var v = i.value.trim(); if (v[0] !== '#') v = '#' + v;
        if (/^#[0-9a-f]{3}$/i.test(v)) v = '#' + v[1] + v[1] + v[2] + v[2] + v[3] + v[3];
        if (/^#[0-9a-f]{6}$/i.test(v)) { state.colors[i.getAttribute('data-k')] = v.toLowerCase(); state.preset = 'custom'; commit(); } else sync();
      });
    });
    pal.querySelector('.ml-range').addEventListener('input', function (e) { state.radius = +e.target.value; apply(state); save(); });
    pal.querySelectorAll('.ml-seg button').forEach(function (b) { b.addEventListener('click', function () { state.font = b.getAttribute('data-font'); commit(); }); });
    pal.querySelector('.ml-reset').addEventListener('click', function () { state = defaults(); commit(); });
    pal.querySelector('.ml-copy').addEventListener('click', function (e) {
      var css = ':root {\n' + VARS.map(function (v) { return '  --' + kebab(v[0]) + ': ' + state.colors[v[0]] + ';'; }).join('\n') + '\n  --radius: ' + state.radius + 'px;\n}';
      var b = e.currentTarget;
      (navigator.clipboard ? navigator.clipboard.writeText(css) : Promise.reject()).then(function () { b.textContent = 'Copied'; }, function () { b.textContent = 'Clipboard blocked'; });
      setTimeout(function () { b.textContent = 'Copy CSS'; }, 1400);
    });
    sync();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build); else build();
  window.MenuPalette = { get: function () { return state; }, presets: PRESETS };
})();
