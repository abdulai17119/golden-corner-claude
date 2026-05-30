/* ============================================================
   Group of Companies — anime.js v4 createLayout animation
   Clicking any company card moves it to the front smoothly
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // Only run on pages that have the group logo grid
  const grid = document.querySelector('.group-logo-grid');
  if (!grid) return;

  // Load anime.js v4 if not already loaded
  function initGroupLayout() {
    if (!window.anime || !window.anime.createLayout) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/animejs@4.0.0/lib/anime.iife.min.js';
      script.onload = setupLayout;
      document.head.appendChild(script);
    } else {
      setupLayout();
    }
  }

  function setupLayout() {
    const { createLayout, utils } = window.anime;
    if (!createLayout) { console.warn('anime.js createLayout not available'); return; }

    // Give the grid an ID for the layout selector
    grid.id = 'group-logo-layout';

    // Wrap each card so anime can track positions
    const layout = createLayout('#group-logo-layout');

    // Add a visible "click to bring forward" hint on hover
    const cards = grid.querySelectorAll('.group-logo-card');
    cards.forEach((card, index) => {

      // Add click cursor and hint
      card.style.cursor = 'pointer';

      // Tooltip hint on first load
      if (index === 0) {
        const hint = document.createElement('div');
        hint.id = 'group-hint';
        hint.textContent = '✦ Click any company to bring it forward';
        hint.style.cssText = `
          text-align:center;
          font-size:11px;
          letter-spacing:0.15em;
          text-transform:uppercase;
          color:rgba(201,168,76,0.6);
          margin-bottom:1.5rem;
          font-family:'DM Sans',sans-serif;
          font-weight:500;
          opacity:0;
          transition:opacity 0.6s ease;
        `;
        grid.parentNode.insertBefore(hint, grid);
        setTimeout(() => { hint.style.opacity = '1'; }, 800);
        // Hide hint after 5s
        setTimeout(() => { hint.style.opacity = '0'; }, 5000);
      }

      card.addEventListener('click', () => {
        // Don't animate if already first
        const allCards = Array.from(grid.children);
        if (allCards.indexOf(card) === 0) return;

        // Record current layout positions
        layout.record();

        // Move clicked card to the front (first position)
        grid.prepend(card);

        // Remove active class from all, add to clicked
        allCards.forEach(c => c.classList.remove('group-logo-card--active'));
        card.classList.add('group-logo-card--active');

        // Animate all cards from their old positions to new positions
        layout.animate({
          duration: 750,
          ease: 'out(4)',
        });

        // Hide hint once user has interacted
        const hint = document.getElementById('group-hint');
        if (hint) { hint.style.opacity = '0'; }
      });
    });
  }

  initGroupLayout();
});
