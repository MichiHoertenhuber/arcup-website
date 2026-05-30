/* ArcUp — subtle motion: hero word rotator + scroll reveal.
 * Pure vanilla JS, no deps. Fully respects prefers-reduced-motion. */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── Hero word rotator ──────────────────────────────────────
  // Cycles the five life areas. Reads the active <html lang> on every
  // tick, so it follows live language switches without extra wiring.
  (function () {
    var el = document.getElementById('heroRotator');
    if (!el) return;
    var line = el.closest('.hero-rotator') || el.parentNode;

    var WORDS = {
      de: ['deinen Körper', 'deinen Geist', 'dein Wachstum', 'deine Beziehungen', 'deine Freizeit'],
      en: ['your body', 'your mind', 'your growth', 'your relationships', 'your leisure'],
      es: ['tu cuerpo', 'tu mente', 'tu crecimiento', 'tus relaciones', 'tu ocio'],
      fr: ['ton corps', 'ton esprit', 'ta croissance', 'tes relations', 'tes loisirs'],
      it: ['il tuo corpo', 'la tua mente', 'la tua crescita', 'le tue relazioni', 'il tuo tempo libero']
    };
    function words() { return WORDS[document.documentElement.lang] || WORDS.de; }

    var i = 0;
    el.textContent = words()[0];
    if (reduce) return;

    setInterval(function () {
      var w = words();
      i = (i + 1) % w.length;
      line.classList.add('swap');
      setTimeout(function () {
        el.textContent = w[i];
        line.classList.remove('swap');
      }, 300);
    }, 2800);
  })();

  // ── Scroll reveal ──────────────────────────────────────────
  // Fades + lifts content into view as it enters the viewport.
  // Siblings sharing a parent are staggered for a gentle cascade.
  (function () {
    if (reduce || !('IntersectionObserver' in window)) return;
    document.documentElement.classList.add('js-anim');

    var els = Array.prototype.slice.call(document.querySelectorAll(
      '.section-head, .compare-grid, .principle, .arc-example, .showcase, .area-card, .not-item, .plan'
    ));

    var seen = new WeakMap();
    els.forEach(function (el) {
      el.classList.add('reveal');
      var p = el.parentNode;
      var n = seen.get(p) || 0;
      el.style.transitionDelay = (Math.min(n, 5) * 0.07) + 's';
      seen.set(p, n + 1);
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });

    els.forEach(function (el) { io.observe(el); });
  })();
})();
