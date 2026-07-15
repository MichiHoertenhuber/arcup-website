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

  // ── Sticky showcase stage ──────────────────────────────────
  // Desktop only: the feature steps scroll past a pinned phone whose
  // screenshot swaps with the active step. A step with data-shot-alt
  // alternates between its two shots while active (tab flip). The
  // stage is aria-hidden (decorative duplicates of the inline shots),
  // so rail buttons are pointer-only shortcuts.
  (function () {
    var stage  = document.querySelector('.showcase-stage');
    var device = document.getElementById('stageDevice');
    var numEl  = document.getElementById('stageNum');
    var rail   = document.getElementById('stageRail');
    if (!stage || !device || !('IntersectionObserver' in window)) return;
    if (!window.matchMedia('(min-width: 901px)').matches) return;

    var blocks = Array.prototype.slice.call(
      document.querySelectorAll('.showcase-steps .showcase[data-shot]')
    );
    if (!blocks.length) return;

    var shots = {};
    Array.prototype.forEach.call(device.querySelectorAll('.stage-shot'), function (img) {
      shots[img.getAttribute('data-shot')] = img;
    });

    var railBtns = blocks.map(function (block, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.tabIndex = -1;
      b.textContent = String(i + 1).padStart(2, '0');
      if (i === 0) b.classList.add('is-active');
      b.addEventListener('click', function () {
        block.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
      });
      if (rail) rail.appendChild(b);
      return b;
    });

    var activeIdx  = -1;
    var activeShot = 'home';
    var altTimer   = null;

    function swapTo(id) {
      if (!shots[id] || id === activeShot) return;
      Object.keys(shots).forEach(function (k) { shots[k].classList.remove('is-leaving'); });
      var prev = shots[activeShot];
      prev.classList.remove('is-active');
      if (!reduce) prev.classList.add('is-leaving');
      shots[id].classList.add('is-active');
      activeShot = id;
    }

    function setActive(i) {
      if (i === activeIdx) return;
      device.classList.toggle('dir-up', i < activeIdx);
      activeIdx = i;
      var block = blocks[i];

      if (numEl) {
        numEl.classList.add('is-swapping');
        setTimeout(function () {
          numEl.textContent = String(i + 1).padStart(2, '0');
          numEl.classList.remove('is-swapping');
        }, reduce ? 0 : 220);
      }
      railBtns.forEach(function (b, j) { b.classList.toggle('is-active', j === i); });

      clearInterval(altTimer);
      var main = block.getAttribute('data-shot');
      var alt  = block.getAttribute('data-shot-alt');
      swapTo(main);
      if (alt && !reduce) {
        var flipped = false;
        altTimer = setInterval(function () {
          flipped = !flipped;
          swapTo(flipped ? alt : main);
        }, 2800);
      }
    }

    // A narrow band around the viewport centre decides the active step.
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActive(blocks.indexOf(entry.target));
      });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
    blocks.forEach(function (b) { io.observe(b); });

    // Gentle 3D tilt toward the cursor, measured against the pinned
    // (viewport-height) frame, not the full-height stage column.
    var pin = stage.querySelector('.stage-pin') || stage;
    if (!reduce) {
      var raf = null;
      pin.addEventListener('mousemove', function (e) {
        if (raf) return;
        raf = requestAnimationFrame(function () {
          raf = null;
          var r = pin.getBoundingClientRect();
          var x = (e.clientX - r.left) / r.width  - 0.5;
          var y = (e.clientY - r.top)  / r.height - 0.5;
          device.style.transform =
            'rotateY(' + (x * 8).toFixed(2) + 'deg) rotateX(' + (-y * 6).toFixed(2) + 'deg)';
        });
      });
      pin.addEventListener('mouseleave', function () {
        device.style.transform = '';
      });
    }
  })();
})();
