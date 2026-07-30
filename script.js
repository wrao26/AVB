/* ============================================================
   AVB IMOBILIÁRIA — shared interaction layer
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }

  /* ---------- Sticky nav solidify ---------- */
  const nav = document.getElementById('site-nav');
  const onScroll = () => {
    if (!nav) return;
    if (window.scrollY > 40) nav.classList.add('is-solid');
    else nav.classList.remove('is-solid');

    const prog = document.getElementById('scroll-progress');
    if (prog) {
      const h = document.documentElement;
      const pct = (h.scrollTop || document.body.scrollTop) / ((h.scrollHeight || document.body.scrollHeight) - h.clientHeight) * 100;
      prog.style.width = pct + '%';
    }
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      menuBtn.classList.toggle('is-open');
      mobileMenu.classList.toggle('is-open');
      document.body.style.overflow = mobileMenu.classList.contains('is-open') ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      menuBtn.classList.remove('is-open');
      mobileMenu.classList.remove('is-open');
      document.body.style.overflow = '';
    }));
  }

  /* ---------- Scroll reveals ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if (window.gsap && !reduceMotion) {
    revealEls.forEach((el) => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          once: true
        }
      });
    });

    /* Stagger groups */
    document.querySelectorAll('[data-stagger]').forEach((group) => {
      const items = group.querySelectorAll('.reveal');
      gsap.to(items, {
        opacity: 1, y: 0, filter: 'blur(0px)',
        duration: 1, ease: 'power3.out', stagger: 0.12,
        scrollTrigger: { trigger: group, start: 'top 85%', once: true }
      });
    });

    /* Hero-style immediate reveals */
    document.querySelectorAll('[data-reveal-on-load]').forEach((group) => {
      const items = group.querySelectorAll('.reveal');
      gsap.to(items, {
        opacity: 1, y: 0, filter: 'blur(0px)',
        duration: 1.2, ease: 'power3.out', stagger: 0.1, delay: 0.15
      });
    });

  } else {
    revealEls.forEach((el) => {
      el.style.opacity = 1;
      el.style.transform = 'none';
      el.style.filter = 'none';
    });
  }

  /* ---------- Animated counters ---------- */
  document.querySelectorAll('[data-counter]').forEach((el) => {
    const target = parseFloat(el.getAttribute('data-counter'));
    const suffix = el.getAttribute('data-suffix') || '';
    const decimals = el.getAttribute('data-decimals') ? parseInt(el.getAttribute('data-decimals')) : 0;
    const obj = { val: 0 };
    const run = () => {
      if (window.gsap && !reduceMotion) {
        gsap.to(obj, {
          val: target, duration: 2, ease: 'power2.out',
          onUpdate: () => { el.textContent = obj.val.toFixed(decimals) + suffix; }
        });
      } else {
        el.textContent = target.toFixed(decimals) + suffix;
      }
    };
    if (window.ScrollTrigger) {
      ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: run });
    } else {
      run();
    }
  });

  /* ---------- Magnetic buttons ---------- */
  if (!reduceMotion && window.gsap) {
    document.querySelectorAll('.magnetic').forEach((el) => {
      const strength = 18;
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        gsap.to(el, { x: (x / r.width) * strength, y: (y / r.height) * strength, duration: 0.5, ease: 'power3.out' });
      });
      el.addEventListener('mouseleave', () => {
        gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
      });
    });
  }

  /* ---------- Filter chips (search + property list) ---------- */
  document.querySelectorAll('[data-chip-group]').forEach((group) => {
    const chips = group.querySelectorAll('.chip');
    chips.forEach((chip) => {
      chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('is-active'));
        chip.classList.add('is-active');
      });
    });
  });

  /* ---------- Property grid filter (properties page) ---------- */
  const filterBar = document.getElementById('property-filters');
  if (filterBar) {
    const cards = document.querySelectorAll('[data-property-card]');
    filterBar.querySelectorAll('.chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        filterBar.querySelectorAll('.chip').forEach(c => c.classList.remove('is-active'));
        chip.classList.add('is-active');
        const type = chip.getAttribute('data-filter');
        cards.forEach((card) => {
          const match = type === 'all' || card.getAttribute('data-type') === type;
          if (window.gsap) {
            gsap.to(card, { opacity: match ? 1 : 0, scale: match ? 1 : 0.96, duration: 0.35, ease: 'power2.out' });
            card.style.pointerEvents = match ? 'auto' : 'none';
            if (match) card.style.display = '';
            else setTimeout(() => { if (!match) card.style.display = 'none'; }, 350);
            if (match) card.style.display = 'block';
          } else {
            card.style.display = match ? '' : 'none';
          }
        });
      });
    });
  }

  /* ---------- Current year in footer ---------- */
  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

  /* ---------- Active nav link highlight ---------- */
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach((a) => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) a.classList.add('is-active');
  });

});
