/* ============================================================
   Golden Corner Printing Press LLC — Main JavaScript v5.0
   Handles: nav, slideshow, fade-in, tabs, filter, form, stats
   + anime.js v4 character animation on hero headline
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ══════════════════════════════════
     NAVIGATION — scroll + active link
  ══════════════════════════════════ */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(link => {
    const href = link.getAttribute('href').split('/').pop().split('#')[0];
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active-link');
    }
  });

  /* ══════════════════════════════════
     MOBILE NAV DRAWER
  ══════════════════════════════════ */
  const hamburger = document.getElementById('hamburger');
  const mobileNav  = document.getElementById('mobileNav');
  const overlay    = document.getElementById('overlay');
  const closeNav   = document.getElementById('closeNav');

  function openMenu()  { mobileNav.classList.add('open'); overlay.classList.add('open'); document.body.style.overflow = 'hidden'; }
  function closeMenu() { mobileNav.classList.remove('open'); overlay.classList.remove('open'); document.body.style.overflow = ''; }

  if (hamburger) hamburger.addEventListener('click', openMenu);
  if (closeNav)  closeNav.addEventListener('click', closeMenu);
  if (overlay)   overlay.addEventListener('click', closeMenu);
  document.querySelectorAll('.mobile-nav a').forEach(a => a.addEventListener('click', closeMenu));

  /* ══════════════════════════════════
     HERO SLIDESHOW
  ══════════════════════════════════ */
  const slides = document.querySelectorAll('.hero-slide');
  const dots   = document.querySelectorAll('.hero-dot');

  if (slides.length > 0) {
    let current = 0;
    let timer   = null;

    function goToSlide(index) {
      slides[current].classList.remove('active');
      slides[current].classList.add('exit');
      if (dots[current]) dots[current].classList.remove('active');
      const prev = current;
      setTimeout(() => { slides[prev].classList.remove('exit'); }, 1500);
      current = (index + slides.length) % slides.length;
      void slides[current].offsetWidth;
      slides[current].classList.add('active');
      if (dots[current]) dots[current].classList.add('active');
    }

    function startTimer() {
      clearInterval(timer);
      timer = setInterval(() => goToSlide(current + 1), 6000);
    }

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        if (i === current) return;
        goToSlide(i);
        startTimer();
      });
    });

    startTimer();
  }

  /* ══════════════════════════════════
     SCROLL FADE-IN
  ══════════════════════════════════ */
  const fadeEls = document.querySelectorAll('.fade-in');
  if (fadeEls.length > 0) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
    fadeEls.forEach(el => io.observe(el));
  }

  /* ══════════════════════════════════
     SERVICES TABS
  ══════════════════════════════════ */
  const stabs  = document.querySelectorAll('.stab');
  const panels = document.querySelectorAll('.service-panel');

  if (stabs.length > 0) {
    const hash = window.location.hash.replace('#', '');
    if (hash && document.getElementById('panel-' + hash)) {
      stabs.forEach(s => s.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      const t = document.querySelector(`.stab[data-panel="${hash}"]`);
      const p = document.getElementById('panel-' + hash);
      if (t) t.classList.add('active');
      if (p) p.classList.add('active');
    }
    stabs.forEach(stab => {
      stab.addEventListener('click', () => {
        stabs.forEach(s => s.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        stab.classList.add('active');
        const panel = document.getElementById('panel-' + stab.dataset.panel);
        if (panel) panel.classList.add('active');
      });
    });
  }

  /* ══════════════════════════════════
     PORTFOLIO FILTER
  ══════════════════════════════════ */
  const ptabs  = document.querySelectorAll('.ptab');
  const pitems = document.querySelectorAll('.portfolio-item[data-category]');

  if (ptabs.length > 0) {
    ptabs.forEach(tab => {
      tab.addEventListener('click', () => {
        ptabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const filter = tab.dataset.filter;
        pitems.forEach(item => {
          item.classList.toggle('hidden', filter !== 'all' && item.dataset.category !== filter);
        });
      });
    });
  }

  /* ══════════════════════════════════
     QUOTE FORM
  ══════════════════════════════════ */
  const quoteForm = document.getElementById('quoteForm');
  if (quoteForm) {
    quoteForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const btn = this.querySelector('button[type="submit"]');
      btn.textContent = "✓ Sent! We'll be in touch shortly.";
      btn.style.background = '#2E7D32';
      btn.style.color = '#fff';
      btn.disabled = true;
    });
  }

  /* ══════════════════════════════════
     SMOOTH SCROLL
  ══════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.getBoundingClientRect().top + window.pageYOffset - 80, behavior: 'smooth' });
      }
    });
  });

  /* ══════════════════════════════════
     ANIMATED STAT COUNTERS
  ══════════════════════════════════ */
  const stats = document.querySelectorAll('.stat-num[data-target]');
  if (stats.length > 0) {
    let animated = false;
    const easeOut = t => 1 - Math.pow(1 - t, 3);

    function animateCounters() {
      if (animated) return;
      animated = true;
      stats.forEach((el, i) => {
        const target   = parseFloat(el.dataset.target);
        const suffix   = el.dataset.suffix || '';
        const duration = 1800 + i * 150;
        const startAt  = performance.now() + i * 120;
        el.closest('.stat-item') && el.closest('.stat-item').classList.add('counted');
        (function tick(now) {
          const progress = Math.min(Math.max(0, now - startAt) / duration, 1);
          el.textContent = (target < 2 ? (easeOut(progress) * target).toFixed(1) : Math.floor(easeOut(progress) * target)) + suffix;
          if (progress < 1) requestAnimationFrame(tick);
          else el.textContent = (Number.isInteger(target) ? target : target.toFixed(1)) + suffix;
        })(performance.now());
      });
    }

    const statsEl = document.getElementById('heroStats');
    if (statsEl) {
      const obs = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) { animateCounters(); obs.disconnect(); }
      }, { threshold: 0.4 });
      obs.observe(statsEl);
    }
  }

  /* ══════════════════════════════════
     ANIME.JS v4 — SECTION TITLE CHAR ANIMATION
     Targets .section-title elements as they scroll into view.
     Each character bounces + rotates in, then loops.
  ══════════════════════════════════ */
  if (typeof animate !== 'undefined' && typeof splitText !== 'undefined') {
    initAnimeTextAnimations();
  } else {
    // Dynamically load anime.js v4 from CDN then init
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/animejs@4.0.0/lib/anime.iife.min.js';
    script.onload = () => {
      // anime v4 IIFE exposes window.anime — destructure what we need
      if (window.anime) {
        window._animeAnimate  = window.anime.animate;
        window._animeStagger  = window.anime.stagger;
        window._animeSplit    = window.anime.utils && window.anime.utils.splitText
                                ? window.anime.utils.splitText
                                : null;
        initAnimeTextAnimations();
      }
    };
    document.head.appendChild(script);
  }

  function initAnimeTextAnimations() {

    // We'll animate section titles when they enter the viewport
    const sectionTitles = document.querySelectorAll('.section-title');
    if (!sectionTitles.length) return;

    // Helper: get animate + stagger + splitText from wherever they landed
    function getAnime() {
      if (typeof animate !== 'undefined')       return { animate, stagger, splitText };
      if (window._animeAnimate)                 return { animate: window._animeAnimate, stagger: window._animeStagger, splitText: window._animeSplit };
      if (window.anime) {
        return {
          animate:   window.anime.animate   || window.anime,
          stagger:   window.anime.stagger,
          splitText: window.anime.utils?.splitText || null,
        };
      }
      return null;
    }

    const io2 = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        io2.unobserve(entry.target);

        const el = entry.target;
        const lib = getAnime();
        if (!lib || !lib.animate) return;

        // Mark as animated so it won't re-run
        if (el.dataset.charAnimated) return;
        el.dataset.charAnimated = '1';

        // If splitText is available use it, otherwise manually wrap chars
        let chars;
        if (lib.splitText) {
          try {
            const result = lib.splitText(el, { words: false, chars: true });
            chars = result.chars;
          } catch(e) { chars = null; }
        }

        if (!chars || !chars.length) {
          // Manual char split fallback
          const text = el.textContent;
          el.textContent = '';
          el.style.overflow = 'hidden';
          chars = text.split('').map(ch => {
            const span = document.createElement('span');
            span.textContent = ch === ' ' ? '\u00A0' : ch;
            span.style.display = 'inline-block';
            span.style.willChange = 'transform, opacity';
            el.appendChild(span);
            return span;
          });
        }

        // Run the animation — chars fly up with bounce + rotate, loop
        lib.animate(chars, {
          y: [
            { to: '-0.6em', ease: 'outExpo',   duration: 500 },
            { to: 0,        ease: 'outBounce',  duration: 700, delay: 80 }
          ],
          rotate: {
            from: '-0.5turn',
            delay: 0,
          },
          opacity: [
            { to: 1, duration: 200 }
          ],
          delay: lib.stagger ? lib.stagger(45) : (el, i) => i * 45,
          ease: 'inOutCirc',
          loopDelay: 3500,
          loop: true,
        });
      });
    }, { threshold: 0.5 });

    sectionTitles.forEach(el => {
      el.style.overflow = 'visible';
      io2.observe(el);
    });
  }

});
