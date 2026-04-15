/* main.js — mobile nav toggle + gallery lightbox */

'use strict';

/* ============================================================
   MOBILE NAV TOGGLE
   ============================================================ */
(function () {
  const toggle = document.getElementById('nav-toggle');
  const nav    = document.getElementById('site-nav');

  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
    nav.classList.toggle('is-open', !isOpen);
  });

  // Close when clicking outside the nav
  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !nav.contains(e.target)) {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open navigation');
      nav.classList.remove('is-open');
    }
  });
})();


/* ============================================================
   GALLERY LIGHTBOX
   ============================================================ */
(function () {
  const galleryGrid = document.getElementById('gallery-grid');
  if (!galleryGrid) return;

  const items       = Array.from(galleryGrid.querySelectorAll('.gallery-item'));
  if (items.length === 0) return;

  const lightbox    = document.getElementById('lightbox');
  const img         = document.getElementById('lightbox-img');
  const caption     = document.getElementById('lightbox-caption');
  const closeBtn    = document.getElementById('lightbox-close');
  const prevBtn     = document.getElementById('lightbox-prev');
  const nextBtn     = document.getElementById('lightbox-next');

  let current = 0;

  function open(index) {
    current = (index + items.length) % items.length;
    const item = items[current];
    img.src        = item.dataset.src || item.querySelector('img').src;
    img.alt        = item.dataset.caption || '';
    caption.textContent = item.dataset.caption || '';
    lightbox.hidden = false;
    document.body.classList.add('lightbox-open');
    closeBtn.focus();
  }

  function close() {
    lightbox.hidden = true;
    document.body.classList.remove('lightbox-open');
    items[current].focus();
  }

  // Open on item click
  items.forEach((item, i) => {
    item.addEventListener('click', () => open(i));
  });

  // Navigation
  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', () => open(current - 1));
  nextBtn.addEventListener('click', () => open(current + 1));

  // Keyboard — includes focus trap (Tab cycles within lightbox)
  lightbox.addEventListener('keydown', (e) => {
    switch (e.key) {
      case 'Escape':     close();             break;
      case 'ArrowLeft':  open(current - 1);   break;
      case 'ArrowRight': open(current + 1);   break;
      case 'Tab': {
        const focusable = [closeBtn, prevBtn, nextBtn];
        const first = focusable[0];
        const last  = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) { e.preventDefault(); last.focus(); }
        } else {
          if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
        }
        break;
      }
    }
  });

  // Close on backdrop click
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });
})();
