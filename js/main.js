/* ================================================================
   SERENOVA — Vanilla JS v4
   ================================================================ */

/* ── 1. NAVBAR SCROLL ───────────────────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ── 2. HERO PILLS — staggered fade in on load ──────────────── */
window.addEventListener('load', () => {
  [1, 2, 3].forEach((n, i) => {
    const pill = document.getElementById('pill-' + n);
    if (!pill) return;
    setTimeout(() => pill.classList.add('visible'), 800 + i * 180);
  });
});

/* ── 3. INTERSECTION OBSERVER — reveal on scroll ────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── 4. MOBILE HAMBURGER ────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on mobile link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

/* ── 5. SMOOTH ANCHOR SCROLLING ─────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const id = anchor.getAttribute('href');
    if (!id || id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - (navbar ? navbar.offsetHeight : 0) - 8;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ── 6. TREATMENT FILTER ────────────────────────────────────── */
const filterBtns = document.querySelectorAll('.filter-btn');
const treatmentCards = document.querySelectorAll('.treatment-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // update active state
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    treatmentCards.forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      if (match) {
        card.classList.remove('hidden');
        // small fade-in
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            card.style.transition = 'opacity .35s ease, transform .35s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          });
        });
      } else {
        card.style.opacity = '0';
        card.style.transform = 'translateY(10px)';
        setTimeout(() => card.classList.add('hidden'), 350);
      }
    });
  });
});

/* ── 7. BOOKING MODAL ───────────────────────────────────────── */
const modalOverlay = document.getElementById('bookingModal');
const modalClose = document.getElementById('modalClose');
const bookingForm = document.getElementById('bookingForm');
const modalSuccess = document.getElementById('modalSuccess');
const formContent = document.getElementById('modalFormContent');
const closeSuccess = document.getElementById('closeSuccess');
const dateInput = document.getElementById('date');

// Set minimum date to today
if (dateInput) {
  const today = new Date().toISOString().split('T')[0];
  dateInput.min = today;
}

function openModal() {
  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  // focus first focusable element
  setTimeout(() => {
    const first = modalOverlay.querySelector('input, select, button');
    if (first) first.focus();
  }, 100);
}

function closeModal() {
  modalOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

// Open triggers
document.querySelectorAll('.open-modal, .nav-cta').forEach(btn => {
  btn.addEventListener('click', openModal);
});

modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', e => {
  if (e.target === modalOverlay) closeModal();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && modalOverlay.classList.contains('open')) closeModal();
});

// Form submit → show success
bookingForm.addEventListener('submit', e => {
  e.preventDefault();
  formContent.style.display = 'none';
  modalSuccess.classList.add('visible');
});

// Close success
closeSuccess.addEventListener('click', () => {
  closeModal();
  setTimeout(() => {
    formContent.style.display = '';
    modalSuccess.classList.remove('visible');
    bookingForm.reset();
  }, 420);
});

/* ── 8. FLOWING MENU (Signature Rituals) ─────────────────────── */
function initFlowingMenu() {
  const menuItems = document.querySelectorAll('.menu__item');
  if (!menuItems.length) return;

  const animationDefaults = { duration: 0.6, ease: 'expo.out' };
  const speed = 15; // Loop duration in seconds

  const distMetric = (x, y, x2, y2) => {
    const xDiff = x - x2;
    const yDiff = y - y2;
    return xDiff * xDiff + yDiff * yDiff;
  };

  const findClosestEdge = (mouseX, mouseY, width, height) => {
    const topEdgeDist = distMetric(mouseX, mouseY, width / 2, 0);
    const bottomEdgeDist = distMetric(mouseX, mouseY, width / 2, height);
    return topEdgeDist < bottomEdgeDist ? 'top' : 'bottom';
  };

  menuItems.forEach(item => {
    const text = item.querySelector('.menu__item-link').textContent;
    const image = item.dataset.image;
    const marquee = item.querySelector('.marquee');
    const marqueeInner = item.querySelector('.marquee__inner');
    const link = item.querySelector('.menu__item-link');

    // 1. Calculate and add repetitions
    const calculateRepetitions = () => {
      const viewportWidth = window.innerWidth;
      // Temp measure width of one part
      const tempPart = document.createElement('div');
      tempPart.className = 'marquee__part';
      tempPart.innerHTML = `<span>${text}</span><div class="marquee__img" style="background-image:url(${image})"></div>`;
      document.body.appendChild(tempPart);
      const contentWidth = tempPart.offsetWidth;
      document.body.removeChild(tempPart);

      if (contentWidth === 0) return;
      const needed = Math.ceil(viewportWidth / contentWidth) + 2;
      const count = Math.max(4, needed);

      let html = '';
      for (let i = 0; i < count; i++) {
        html += `<div class="marquee__part">
          <span>${text}</span>
          <div class="marquee__img" style="background-image: url(${image})"></div>
        </div>`;
      }
      marqueeInner.innerHTML = html;

      // Start GSAP Loop
      gsap.to(marqueeInner, {
        x: -contentWidth,
        duration: speed,
        ease: 'none',
        repeat: -1
      });
    };

    calculateRepetitions();
    window.addEventListener('resize', calculateRepetitions);

    // 2. Hover logic
    link.addEventListener('mouseenter', ev => {
      const rect = item.getBoundingClientRect();
      const x = ev.clientX - rect.left;
      const y = ev.clientY - rect.top;
      const edge = findClosestEdge(x, y, rect.width, rect.height);

      gsap.timeline({ defaults: animationDefaults })
        .set(marquee, { y: edge === 'top' ? '-101%' : '101%' }, 0)
        .set(marqueeInner, { y: edge === 'top' ? '101%' : '-101%' }, 0)
        .to([marquee, marqueeInner], { y: '0%' }, 0);
    });

    link.addEventListener('mouseleave', ev => {
      const rect = item.getBoundingClientRect();
      const x = ev.clientX - rect.left;
      const y = ev.clientY - rect.top;
      const edge = findClosestEdge(x, y, rect.width, rect.height);

      gsap.timeline({ defaults: animationDefaults })
        .to(marquee, { y: edge === 'top' ? '-101%' : '101%' }, 0)
        .to(marqueeInner, { y: edge === 'top' ? '101%' : '-101%' }, 0);
    });
  });
}

// Update initialization
window.addEventListener('load', () => {
  document.documentElement.style.transition = 'opacity .5s ease';
  document.documentElement.style.opacity = '1';
  initFlowingMenu();
});
