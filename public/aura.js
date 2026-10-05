/**
 * Aura motion on existing Wix/Astro stack — no new framework.
 */
(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const header = document.querySelector('[data-site-header]');
  if (header) {
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  document.addEventListener('click', (e) => {
    document.querySelectorAll('details.lang-dropdown[open]').forEach((el) => {
      if (!el.contains(e.target)) el.removeAttribute('open');
    });
  });

  document.querySelectorAll('[data-split]').forEach((el, blockIndex) => {
    if (el.querySelector('.aura-word')) return;
    const text = el.textContent || '';
    const words = text.trim().split(/\s+/);
    el.textContent = '';
    words.forEach((word, i) => {
      const span = document.createElement('span');
      span.className = 'aura-word';
      span.style.animationDelay = `${blockIndex * 80 + i * 55}ms`;
      if (reduce) {
        span.style.animation = 'none';
        span.style.opacity = '1';
        span.style.filter = 'none';
        span.style.transform = 'none';
      }
      span.textContent = word;
      el.appendChild(span);
      if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
    });
  });

  const revealEls = document.querySelectorAll('[data-reveal]');
  if (revealEls.length && !reduce) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-in'));
  }

  const parallax = document.querySelector('[data-parallax]');
  if (parallax && !reduce) {
    const onParallax = () => {
      const rect = parallax.getBoundingClientRect();
      const view = window.innerHeight || 1;
      const progress = 1 - Math.min(Math.max(rect.bottom / (view + rect.height), 0), 1);
      parallax.style.backgroundPosition = `center ${40 + progress * 4}%`;
      parallax.style.transform = `translate3d(0, ${progress * 18}px, 0)`;
    };
    onParallax();
    window.addEventListener('scroll', onParallax, { passive: true });
  }

  const stacks = Array.from(document.querySelectorAll('[data-stack]'));
  function stackScroll() {
    if (!stacks.length) return;
    const vh = window.innerHeight;
    stacks.forEach((card) => {
      const r = card.getBoundingClientRect();
      const denom = Math.max(r.height - vh * 0.8, 1);
      let t = -r.top / denom;
      t = Math.min(Math.max(t, 0), 1);
      card.style.transform = `scale(${1 - t * 0.08})`;
      card.style.filter = `blur(${t * 4}px)`;
      card.style.opacity = String(1 - t * 0.35);
    });
  }
  if (stacks.length && !reduce) {
    stackScroll();
    window.addEventListener('scroll', stackScroll, { passive: true });
    window.addEventListener('resize', stackScroll);
  }

  document.querySelectorAll('[data-marquee]').forEach((track) => {
    if (reduce) return;
    const duration = Number(track.getAttribute('data-duration') || 28) * 1000;
    const parent = track.parentElement;
    if (!parent) return;
    const clone = track.cloneNode(true);
    parent.appendChild(clone);
    parent.style.display = 'flex';
    parent.style.width = 'max-content';
    parent.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-50%)' }], {
      duration,
      iterations: Infinity,
      easing: 'linear',
    });
  });
})();
