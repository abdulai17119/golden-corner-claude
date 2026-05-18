/* ============================================================
   Golden Corner Printing Press LLC — Main JavaScript v4.0
   Handles: nav, slideshow, fade-in, tabs, filter, form, stats
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

  // Highlight active nav link based on current page
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
  const mobileNav = document.getElementById('mobileNav');
  const overlay   = document.getElementById('overlay');
  const closeNav  = document.getElementById('closeNav');

  function openMenu()  { mobileNav.classList.add('open'); overlay.classList.add('open'); document.body.style.overflow = 'hidden'; }
  function closeMenu() { mobileNav.classList.remove('open'); overlay.classList.remove('open'); document.body.style.overflow = ''; }

  if (hamburger) hamburger.addEventListener('click', openMenu);
  if (closeNav)  closeNav.addEventListener('click', closeMenu);
  if (overlay)   overlay.addEventListener('click', closeMenu);
  document.querySelectorAll('.mobile-nav a').forEach(a => a.addEventListener('click', closeMenu));

  /* ══════════════════════════════════
     HERO SLIDESHOW (home page only)
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
      void slides[current].offsetWidth; // force reflow to restart CSS animation
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
    // Support hash-based activation: services.html#packaging
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
     QUOTE FORM — success state
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
     SMOOTH SCROLL (same-page anchors)
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

});