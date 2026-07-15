/* ArcUp — subtle motion: hero word rotator + scroll reveal.
 * Pure vanilla JS, no deps. Fully respects prefers-reduced-motion. */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── Hero word rotator ──────────────────────────────────────
  // Cycles the six life areas. Reads the active <html lang> on every
  // tick, so it follows live language switches without extra wiring.
  (function () {
    var el = document.getElementById('heroRotator');
    if (!el) return;
    var line = el.closest('.hero-rotator') || el.parentNode;

    var WORDS = {
      de: ['deinen Körper', 'deinen Geist', 'deine Karriere', 'deine Beziehungen', 'deinen Lebensstil', 'deine Ernährung'],
      en: ['your body', 'your mind', 'your career', 'your relationships', 'your lifestyle', 'your nutrition'],
      es: ['tu cuerpo', 'tu mente', 'tu carrera', 'tus relaciones', 'tu estilo de vida', 'tu nutrición'],
      fr: ['ton corps', 'ton esprit', 'ta carrière', 'tes relations', 'ton style de vie', 'ta nutrition'],
      it: ['il tuo corpo', 'la tua mente', 'la tua carriera', 'le tue relazioni', 'il tuo stile di vita', 'la tua alimentazione']
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

  // ── Hero stage tilt ────────────────────────────────────────
  // The three phones share one 3D space (preserve-3d + translateZ),
  // so gently tilting the stage toward the pointer yields real depth
  // parallax. Desktop pointers only; eased via rAF lerp.
  (function () {
    var stage = document.getElementById('heroStage');
    if (!stage || reduce) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;
    var hero = stage.closest('.hero');
    if (!hero) return;

    var targetX = 0, targetY = 0, curX = 0, curY = 0, raf = null;

    function loop() {
      curX += (targetX - curX) * 0.08;
      curY += (targetY - curY) * 0.08;
      stage.style.setProperty('--tilt-x', curX.toFixed(3) + 'deg');
      stage.style.setProperty('--tilt-y', curY.toFixed(3) + 'deg');
      if (Math.abs(targetX - curX) + Math.abs(targetY - curY) > 0.005) {
        raf = requestAnimationFrame(loop);
      } else {
        raf = null;
      }
    }
    function kick() { if (!raf) raf = requestAnimationFrame(loop); }

    hero.addEventListener('mousemove', function (e) {
      var r = stage.getBoundingClientRect();
      var nx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      var ny = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
      targetY = Math.max(-1, Math.min(1, nx)) * 5;    /* rotateY follows x */
      targetX = Math.max(-1, Math.min(1, ny)) * -3.5; /* rotateX counters y */
      kick();
    });
    hero.addEventListener('mouseleave', function () {
      targetX = 0; targetY = 0;
      kick();
    });
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
