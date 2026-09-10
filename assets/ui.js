/* Small shared helpers used by every layout. */
window.ML = {
  price: function (n) { return MENU.currency + ' ' + n; },
  esc: function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); },
  isPick: function (item) { return item.tags.indexOf('pick') > -1; },
  tags: function (item, cls) {
    return item.tags.filter(function (t) { return t !== 'pick'; }).map(function (t) {
      return '<span class="' + (cls || 'tag') + '" title="' + MENU.tagLabel[t] + '">' + MENU.tagShort[t] + '</span>';
    }).join('');
  },
  img: function (item, w, sizes, cls) {
    return '<img class="' + (cls || '') + '" src="' + MENU.img(item.img, w || 800) + '" srcset="' + MENU.srcset(item.img) + '" sizes="' + (sizes || '(max-width: 720px) 100vw, 50vw') + '" alt="' + ML.esc(item.name) + '" loading="lazy" decoding="async">';
  },
  reveal: function (sel, root) {
    var els = [].slice.call((root || document).querySelectorAll(sel));
    if (!('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.02 });
    els.forEach(function (e, i) { if (!e.style.getPropertyValue('--i')) e.style.setProperty('--i', i % 8); io.observe(e); });
  },
  spy: function (sections, onChange, offset) {
    var current = null;
    function check() {
      var best = null;
      sections.forEach(function (s) { if (s.getBoundingClientRect().top - (offset || 0) <= window.innerHeight * 0.38) best = s; });
      var id = best ? best.id : sections[0].id;
      if (id !== current) { current = id; onChange(id); }
    }
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check);
    check();
    return check;
  },
  scrollChipIntoView: function (container, el) {
    if (!container || !el) return;
    var left = el.offsetLeft - container.clientWidth / 2 + el.offsetWidth / 2;
    container.scrollTo({ left: left, behavior: 'smooth' });
  }
};
