/* =============================================
   ABUSALEEM PORTFOLIO — PROFESSIONAL EDITION
   Clean · Refined · Performant JavaScript
   ============================================= */

/* ── UTILITIES ── */
const Utils = {
  throttle(fn, ms) {
    let t;
    return (...a) => { if (!t) { fn(...a); t = setTimeout(() => t = null, ms); } };
  },
  debounce(fn, ms) {
    let t;
    return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
  },
  lerp: (a, b, t) => a + (b - a) * t,
};

/* ── DOM CACHE ── */
const DOM = {};
function cacheDOM() {
  DOM.navbar     = document.querySelector('.navbar');
  DOM.navToggle  = document.getElementById('nav-toggle');
  DOM.navMenu    = document.getElementById('nav-menu');
  DOM.navLinks   = document.querySelectorAll('.nav-link');
  DOM.sections   = document.querySelectorAll('.section');
  DOM.typingEl   = document.getElementById('typing-text');
  DOM.particles  = document.getElementById('particles');
  DOM.hero       = document.querySelector('.hero');
  DOM.codeWindow = document.querySelector('.code-window');
  DOM.cursor     = document.querySelector('.custom-cursor');
  DOM.cursorGlow = document.querySelector('.cursor-glow');

  // Create nav overlay for mobile backdrop
  const overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  overlay.id = 'nav-overlay';
  document.body.appendChild(overlay);
  DOM.navOverlay = overlay;
}

/* ── STATE ── */
const S = {
  mouseX: 0, mouseY: 0,
  cursorX: 0, cursorY: 0,
  cursorRunning: false,
  lenis: null,
};

/* ── BOOT ── */
document.addEventListener('DOMContentLoaded', () => {
  cacheDOM();
  document.body.classList.add('js-loaded');
  initPreloader();
  initLenis();
  initNavigation();
  initTyping();
  initObservers();
  initScrollHandler();
  initScrollProgress();
  initMouseEffects();
  initProjectFilters();
  initCounters();
  initContactForm();
  initTestimonialsSlider();
  initBackToTop();
  initThemeToggle();
  initCardTilt();
  /* ── NEW ANIMATIONS ── */
  initHeroCanvas();
  initNameReveal();
  initMagneticButtons();
  initSectionReveal();
  initParallaxDotGrid();
  initSkillBars();
  initHeroParallax();
  initTerminal();
});

/* ══════════════════════════════
   PRELOADER
   ══════════════════════════════ */
function initPreloader() {
  const el  = document.getElementById('preloader');
  const bar = document.getElementById('preloader-progress');
  const txt = document.getElementById('preloader-status');
  if (!el) return;
  document.body.style.overflow = 'hidden';

  const msgs = ['Loading...', 'Preparing...', 'Almost ready...', 'Welcome.'];
  let pct = 0;

  const tick = setInterval(() => {
    pct = Math.min(100, pct + Math.random() * 28 + 8);
    if (bar) bar.style.width = pct + '%';
    if (txt) txt.textContent = msgs[Math.min(3, Math.floor(pct / 25))];
    if (pct >= 100) {
      clearInterval(tick);
      setTimeout(() => {
        el.classList.add('loaded');
        document.body.style.overflow = '';
      }, 250);
    }
  }, 160);

  setTimeout(() => {
    clearInterval(tick);
    el.classList.add('loaded');
    document.body.style.overflow = '';
  }, 3200);
}

/* ══════════════════════════════
   LENIS SMOOTH SCROLL
   ══════════════════════════════ */
function initLenis() {
  if (typeof Lenis === 'undefined') return;
  S.lenis = new Lenis({
    duration: 1.3,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 0.85,
    smoothTouch: false,
  });
  const loop = t => { S.lenis.raf(t); requestAnimationFrame(loop); };
  requestAnimationFrame(loop);
}

/* ══════════════════════════════
   NAVIGATION
   ══════════════════════════════ */
function initNavigation() {
  const openNav = () => {
    DOM.navToggle?.classList.add('active');
    DOM.navMenu?.classList.add('active');
    DOM.navOverlay?.classList.add('active');
    document.body.style.overflow = 'hidden'; // prevent background scroll
  };
  const closeNav = () => {
    DOM.navToggle?.classList.remove('active');
    DOM.navMenu?.classList.remove('active');
    DOM.navOverlay?.classList.remove('active');
    document.body.style.overflow = '';
  };

  DOM.navToggle?.addEventListener('click', () => {
    DOM.navMenu?.classList.contains('active') ? closeNav() : openNav();
  });

  // Close on overlay tap
  DOM.navOverlay?.addEventListener('click', closeNav);

  // Close on outside click
  document.addEventListener('click', e => {
    if (DOM.navMenu?.classList.contains('active') &&
        !e.target.closest('.nav-menu') &&
        !e.target.closest('.nav-toggle')) {
      closeNav();
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeNav();
  });

  DOM.navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      closeNav();
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      if (S.lenis) S.lenis.scrollTo(target, { offset: -80, duration: 1.5 });
      else target.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

/* ══════════════════════════════
   SCROLL HANDLER
   ══════════════════════════════ */
function initScrollHandler() {
  window.addEventListener('scroll', Utils.throttle(() => {
    const y = window.scrollY;
    DOM.navbar?.classList.toggle('scrolled', y > 50);
    updateNavActive(y);
  }, 30), { passive: true });
}

function updateNavActive(y) {
  document.querySelectorAll('section[id]').forEach(sec => {
    const top = sec.offsetTop - 130;
    const bot = top + sec.offsetHeight;
    if (y >= top && y < bot) {
      const id = sec.getAttribute('id');
      DOM.navLinks.forEach(l =>
        l.classList.toggle('active', l.getAttribute('href') === `#${id}`)
      );
    }
  });
}

/* ══════════════════════════════
   TYPING EFFECT
   ══════════════════════════════ */
function initTyping() {
  const el = DOM.typingEl;
  if (!el) return;

  const words = ['App Developer', 'Flutter Expert', 'Kotlin Engineer', 'Web Developer', 'UI/UX Designer'];
  let wi = 0, ci = 0, del = false;

  function type() {
    const word = words[wi];
    el.textContent = del ? word.slice(0, --ci) : word.slice(0, ++ci);
    let delay = del ? 40 : 90;
    if (!del && ci === word.length) { del = true; delay = 2200; }
    else if (del && ci === 0) { del = false; wi = (wi + 1) % words.length; delay = 500; }
    setTimeout(type, delay);
  }
  type();
}

/* ══════════════════════════════
   INTERSECTION OBSERVERS
   ══════════════════════════════ */
function initObservers() {
  // Section reveal
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('visible');
        // Stagger children
        en.target.querySelectorAll('.glass-card, .skill-item, .project-card, .highlight, .timeline-content, .funfact-item, .achievement-card, .service-card, .experience-card, .contact-card')
          .forEach((el, i) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = `opacity 0.5s ease ${i*0.07}s, transform 0.5s ease ${i*0.07}s`;
            setTimeout(() => {
              el.style.opacity = '1';
              el.style.transform = 'translateY(0)';
            }, 50 + i * 70);
          });
      }
    });
  }, { rootMargin: '-50px', threshold: 0.07 });

  DOM.sections.forEach(s => io.observe(s));

  // Skill bars
  const skillIO = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('animate');
        skillIO.unobserve(en.target);
      }
    });
  }, { threshold: 0.4 });
  document.querySelectorAll('.skill-item').forEach(el => skillIO.observe(el));
}

/* ══════════════════════════════
   COUNTERS
   ══════════════════════════════ */
function initCounters() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) { countUp(en.target); io.unobserve(en.target); }
    });
  }, { threshold: 0.5 });
  // Target both old stat-number and new hs-num elements
  document.querySelectorAll('[data-count]').forEach(el => io.observe(el));
}

function countUp(el) {
  const target = parseInt(el.dataset.count);
  let start = null;
  const dur = 1600;
  const ease = t => 1 - Math.pow(1 - t, 3); // cubic ease-out

  function step(ts) {
    if (!start) start = ts;
    const pct = Math.min((ts - start) / dur, 1);
    el.textContent = Math.floor(ease(pct) * target);
    if (pct < 1) requestAnimationFrame(step);
    else el.textContent = target;
  }
  requestAnimationFrame(step);
}

/* ══════════════════════════════
   SUBTLE PARTICLES
   ══════════════════════════════ */

/* ══════════════════════════════
   CURSOR
   ══════════════════════════════ */
function initMouseEffects() {
  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  if (isTouch) return;

  /* Cursor lerp */
  function cursorLoop() {
    S.cursorX = Utils.lerp(S.cursorX, S.mouseX, 0.14);
    S.cursorY = Utils.lerp(S.cursorY, S.mouseY, 0.14);

    if (DOM.cursor) {
      DOM.cursor.style.left = S.cursorX + 'px';
      DOM.cursor.style.top  = S.cursorY + 'px';
    }
    if (DOM.cursorGlow) {
      DOM.cursorGlow.style.left = S.cursorX + 'px';
      DOM.cursorGlow.style.top  = S.cursorY + 'px';
    }

    if (Math.abs(S.mouseX - S.cursorX) < 0.3 && Math.abs(S.mouseY - S.cursorY) < 0.3) {
      S.cursorRunning = false;
    } else {
      requestAnimationFrame(cursorLoop);
    }
  }

  window.addEventListener('mousemove', e => {
    S.mouseX = e.clientX;
    S.mouseY = e.clientY;
    if (!S.cursorRunning) {
      S.cursorRunning = true;
      requestAnimationFrame(cursorLoop);
    }
  }, { passive: true });

  /* Scale on hover */
  document.addEventListener('mouseover', e => {
    if (e.target.closest('a, button, .project-card, .filter-btn')) {
      DOM.cursor?.style.setProperty('width', '28px');
      DOM.cursor?.style.setProperty('height', '28px');
      DOM.cursor?.style.setProperty('opacity', '0.5');
      DOM.cursorGlow?.style.setProperty('width', '56px');
      DOM.cursorGlow?.style.setProperty('height', '56px');
      DOM.cursorGlow?.style.setProperty('border-color', 'rgba(201,168,76,0.6)');
    }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest('a, button, .project-card, .filter-btn')) {
      DOM.cursor?.style.setProperty('width', '12px');
      DOM.cursor?.style.setProperty('height', '12px');
      DOM.cursor?.style.setProperty('opacity', '1');
      DOM.cursorGlow?.style.setProperty('width', '36px');
      DOM.cursorGlow?.style.setProperty('height', '36px');
      DOM.cursorGlow?.style.setProperty('border-color', 'rgba(201,168,76,0.35)');
    }
  });

  /* Code window gentle parallax */
  if (DOM.hero && DOM.codeWindow) {
    DOM.hero.addEventListener('mousemove', Utils.throttle(e => {
      const r = DOM.hero.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width/2) / r.width;
      const y = (e.clientY - r.top  - r.height/2) / r.height;
      DOM.codeWindow.style.transform =
        `perspective(1200px) rotateY(${x*8}deg) rotateX(${-y*5}deg)`;
    }, 16));
    DOM.hero.addEventListener('mouseleave', () => {
      DOM.codeWindow.style.transform = '';
    });
  }

  /* Subtle magnetic on buttons */
  document.querySelectorAll('.btn').forEach(el => {
    el.addEventListener('mousemove', function(e) {
      const r = this.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width/2) * 0.18;
      const y = (e.clientY - r.top  - r.height/2) * 0.18;
      this.style.transform = `translate(${x}px, ${y}px)`;
    });
    el.addEventListener('mouseleave', function() {
      this.style.transform = '';
    });
  });

  /* Click ripple */
  document.addEventListener('click', e => {
    const target = e.target.closest('.btn, .filter-btn, .social-link, .project-link, .nav-link, .testimonial-btn');
    if (!target) return;
    const ripple = document.createElement('span');
    ripple.className = 'ripple-effect';
    const r = target.getBoundingClientRect();
    ripple.style.left = (e.clientX - r.left) + 'px';
    ripple.style.top  = (e.clientY - r.top) + 'px';
    target.style.position = 'relative';
    target.style.overflow = 'hidden';
    target.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
}

/* ══════════════════════════════
   CARD TILT (subtle, professional)
   ══════════════════════════════ */
function initCardTilt() {
  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  if (isTouch) return;

  document.querySelectorAll('.project-card, .service-card').forEach(card => {
    card.addEventListener('mousemove', Utils.throttle(e => {
      const r = card.getBoundingClientRect();
      const cx = r.left + r.width/2;
      const cy = r.top  + r.height/2;
      const rx = ((e.clientY - cy) / (r.height/2)) * -4; // subtle max 4deg
      const ry = ((e.clientX - cx) / (r.width/2))  *  4;
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
    }, 20));
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ══════════════════════════════
   SCROLL PROGRESS
   ══════════════════════════════ */
function initScrollProgress() {
  const bar = document.createElement('div');
  bar.className = 'scroll-progress-3d';
  document.body.appendChild(bar);

  window.addEventListener('scroll', Utils.throttle(() => {
    const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    bar.style.transform = `scaleX(${pct})`;
  }, 16), { passive: true });
}

/* ══════════════════════════════
   PROJECT FILTERS
   ══════════════════════════════ */
function initProjectFilters() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      document.querySelectorAll('.project-card').forEach((card, i) => {
        const match = filter === 'all' || card.dataset.category === filter;
        if (match) {
          card.style.display = 'block';
          card.style.opacity = '0';
          card.style.transform = 'translateY(16px)';
          setTimeout(() => {
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, i * 55);
        } else {
          card.style.transition = 'opacity 0.28s ease, transform 0.28s ease';
          card.style.opacity = '0';
          card.style.transform = 'translateY(12px)';
          setTimeout(() => { card.style.display = 'none'; }, 300);
        }
      });
    });
  });
}

/* ══════════════════════════════
   CONTACT FORM
   ══════════════════════════════ */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    if (!data.name || !data.email || !data.message) {
      showToast('Please fill all required fields.', 'error');
      return;
    }
    const btn = form.querySelector('button[type="submit"]');
    const orig = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    btn.disabled = true;

    setTimeout(() => {
      showToast('Message sent successfully!', 'success');
      form.reset();
      btn.innerHTML = orig;
      btn.disabled = false;
    }, 1500);
  });

  document.getElementById('newsletter-form')?.addEventListener('submit', e => {
    e.preventDefault();
    showToast('Successfully subscribed!', 'success');
    e.target.reset();
  });
}

function showToast(msg, type) {
  document.querySelector('.notification')?.remove();
  const el = document.createElement('div');
  el.className = `notification ${type}`;
  el.innerHTML = `<i class="fas fa-${type==='success'?'check-circle':'exclamation-circle'}"></i><span>${msg}</span>`;
  document.body.appendChild(el);
  setTimeout(() => {
    el.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
    el.style.opacity = '0';
    el.style.transform = 'translateX(60px)';
    setTimeout(() => el.remove(), 380);
  }, 4000);
}

/* ══════════════════════════════
   TESTIMONIALS
   ══════════════════════════════ */
function initTestimonialsSlider() {
  const track  = document.getElementById('testimonial-track');
  const prev   = document.getElementById('testimonial-prev');
  const next   = document.getElementById('testimonial-next');
  const dotsEl = document.getElementById('testimonial-dots');
  if (!track) return;

  const cards = track.querySelectorAll('.testimonial-card');
  const dots  = dotsEl?.querySelectorAll('.dot') || [];
  let idx = 0, auto;

  function go(i) {
    idx = (i + cards.length) % cards.length;
    track.style.transform = `translateX(-${idx * 100}%)`;
    dots.forEach((d, j) => d.classList.toggle('active', j === idx));
  }

  const startAuto = () => { auto = setInterval(() => go(idx + 1), 5000); };
  const stopAuto  = () => clearInterval(auto);

  prev?.addEventListener('click', () => { stopAuto(); go(idx-1); startAuto(); });
  next?.addEventListener('click', () => { stopAuto(); go(idx+1); startAuto(); });
  dots.forEach((d, i) => d.addEventListener('click', () => { stopAuto(); go(i); startAuto(); }));

  let tx = 0;
  track.addEventListener('touchstart', e => { tx = e.touches[0].clientX; stopAuto(); }, {passive:true});
  track.addEventListener('touchend',   e => {
    if (Math.abs(tx - e.changedTouches[0].clientX) > 50) go(tx > e.changedTouches[0].clientX ? idx+1 : idx-1);
    startAuto();
  });

  startAuto();
}

/* ══════════════════════════════
   BACK TO TOP
   ══════════════════════════════ */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', Utils.throttle(() => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, 100), { passive: true });

  btn.addEventListener('click', () => {
    if (S.lenis) S.lenis.scrollTo(0, { duration: 1.6 });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ══════════════════════════════
   THEME TOGGLE
   ══════════════════════════════ */
function initThemeToggle() {
  const btn  = document.getElementById('theme-toggle');
  const icon = document.getElementById('theme-icon');
  if (!btn) return;

  const saved = localStorage.getItem('portfolio-theme');
  if (saved === 'light') {
    document.body.classList.add('light-theme');
    icon?.classList.replace('fa-moon', 'fa-sun');
  }

  btn.addEventListener('click', () => {
    const isLight = document.body.classList.toggle('light-theme');
    icon?.classList.replace(isLight ? 'fa-moon' : 'fa-sun', isLight ? 'fa-sun' : 'fa-moon');
    localStorage.setItem('portfolio-theme', isLight ? 'light' : 'dark');
  });
}

/* ══════════════════════════════════════════════
   HERO CANVAS — Floating particle constellation
   ══════════════════════════════════════════════ */
function initHeroCanvas() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const canvas = document.createElement('canvas');
  canvas.className = 'hero-canvas';
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:0;opacity:0.5;';
  hero.prepend(canvas);

  const ctx = canvas.getContext('2d');
  let W, H, particles, animId;
  const COUNT = 55;
  const MAX_DIST = 130;

  function resize() {
    W = canvas.width  = hero.offsetWidth;
    H = canvas.height = hero.offsetHeight;
  }

  function mkParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.5 + 0.2,
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: COUNT }, mkParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;

      // Draw dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201,168,76,${p.alpha})`;
      ctx.fill();
    });

    // Draw connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d = Math.sqrt(dx*dx + dy*dy);
        if (d < MAX_DIST) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(201,168,76,${0.12 * (1 - d / MAX_DIST)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
    animId = requestAnimationFrame(draw);
  }

  init();
  draw();
  window.addEventListener('resize', Utils.debounce(() => { init(); }, 200));

  // Pause when tab hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(animId);
    else draw();
  });
}

/* ══════════════════════════════════════════════
   NAME REVEAL — Split letters, staggered slide-up
   ══════════════════════════════════════════════ */
function initNameReveal() {
  const el = document.querySelector('.hero-name-pro');
  if (!el) return;

  const text = el.textContent.trim();
  el.innerHTML = text.split('').map((ch, i) =>
    `<span class="char" style="--ci:${i};display:inline-block;opacity:0;transform:translateY(40px) rotateX(-40deg);transition:opacity 0.5s cubic-bezier(0.25,0.46,0.45,0.94) calc(${i}*0.04s + 0.3s), transform 0.5s cubic-bezier(0.34,1.56,0.64,1) calc(${i}*0.04s + 0.3s);">${ch === ' ' ? '&nbsp;' : ch}</span>`
  ).join('');

  // Trigger after a short delay
  requestAnimationFrame(() => {
    setTimeout(() => {
      el.querySelectorAll('.char').forEach(c => {
        c.style.opacity = '1';
        c.style.transform = 'translateY(0) rotateX(0)';
      });
    }, 100);
  });
}

/* ══════════════════════════════════════════════
   MAGNETIC BUTTONS — Subtle magnet pull on hover
   ══════════════════════════════════════════════ */
function initMagneticButtons() {
  // Only on non-touch
  if (window.matchMedia('(pointer: coarse)').matches) return;

  document.querySelectorAll('.btn-primary, .btn-secondary-pro, .hc-social, .hs-social').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const cx = r.left + r.width  / 2;
      const cy = r.top  + r.height / 2;
      const dx = (e.clientX - cx) * 0.25;
      const dy = (e.clientY - cy) * 0.25;
      btn.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
      btn.style.transition = 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)';
      setTimeout(() => btn.style.transition = '', 400);
    });
  });
}

/* ══════════════════════════════════════════════
   SECTION REVEAL — Clip-path wipe + fade
   ══════════════════════════════════════════════ */
function initSectionReveal() {
  // Targets to animate on scroll
  const selectors = [
    '.section-header',
    '.about-text h3, .about-text p, .about-text .btn',
    '.service-card',
    '.skill-category',
    '.experience-card',
    '.achievement-card',
    '.project-card',
    '.testimonial-card',
    '.contact-card',
    '.highlight',
    '.timeline-item',
    '.funfact-item',
    '.footer-col',
  ];

  const all = document.querySelectorAll(selectors.join(','));

  all.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition =
      `opacity 0.6s ease ${(i % 6) * 0.07}s, ` +
      `transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94) ${(i % 6) * 0.07}s`;
  });

  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.style.opacity = '1';
        en.target.style.transform = 'translateY(0)';
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  all.forEach(el => io.observe(el));

  // Gold underline on section titles when they scroll into view
  const titleIO = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('revealed');
        titleIO.unobserve(en.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.section-title').forEach(t => titleIO.observe(t));
}


/* ══════════════════════════════════════════════
   PARALLAX — Hero dot grid moves at half scroll speed
   ══════════════════════════════════════════════ */
function initParallaxDotGrid() {
  const grid = document.querySelector('.hero-dotgrid');
  const glow = document.querySelector('.hero-accent-glow');
  if (!grid) return;

  window.addEventListener('scroll', Utils.throttle(() => {
    const y = window.scrollY;
    grid.style.transform = `translateY(${y * 0.25}px)`;
    if (glow) glow.style.transform = `translateY(${y * 0.15}px)`;
  }, 16), { passive: true });
}

/* ══════════════════════════════════════════════
   SKILL BARS — Animate width on scroll-in
   ══════════════════════════════════════════════ */
function initSkillBars() {
  const bars = document.querySelectorAll('.skill-fill, .skill-level');
  if (!bars.length) return;

  // Save target width and reset to 0
  bars.forEach(bar => {
    const target = bar.style.width || bar.getAttribute('data-width') || '0%';
    bar.setAttribute('data-width', target);
    bar.style.width = '0%';
    bar.style.transition = 'width 1s cubic-bezier(0.25,0.46,0.45,0.94)';
  });

  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        const target = en.target.getAttribute('data-width');
        en.target.style.width = target;
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(b => io.observe(b));
}

/* ══════════════════════════════════════════════
   TERMINAL — Animated typewriter engine
   ══════════════════════════════════════════════ */
function initTerminal() {
  const body = document.getElementById('term-body');
  if (!body) return;

  // Terminal script: each entry is either a command or output
  const SCRIPT = [
    { type: 'prompt', text: 'whoami' },
    { type: 'out',    text: '<span class="term-green">abusaleem</span>  <span class="term-muted"># Full-Stack & Mobile Dev</span>' },
    { type: 'blank' },
    { type: 'prompt', text: 'cat ./skills.json' },
    { type: 'out',    text: '<span class="term-muted">{</span>' },
    { type: 'out',    text: '  <span class="term-blue">"mobile"</span><span class="term-muted">:</span>  <span class="term-gold">["Flutter", "Kotlin", "Android"]</span><span class="term-muted">,</span>' },
    { type: 'out',    text: '  <span class="term-blue">"web"</span><span class="term-muted">:</span>     <span class="term-gold">["JavaScript", "HTML", "CSS"]</span><span class="term-muted">,</span>' },
    { type: 'out',    text: '  <span class="term-blue">"tools"</span><span class="term-muted">:</span>   <span class="term-gold">["Firebase", "Git", "Figma"]</span>' },
    { type: 'out',    text: '<span class="term-muted">}</span>' },
    { type: 'blank' },
    { type: 'prompt', text: 'git log --oneline -3' },
    { type: 'out',    text: '<span class="term-gold">a3f9c12</span> <span class="term-white">feat: launch CareerGuidance.me</span>' },
    { type: 'out',    text: '<span class="term-gold">d8e1a04</span> <span class="term-white">fix: Flutter performance on iOS</span>' },
    { type: 'out',    text: '<span class="term-gold">b2c5f71</span> <span class="term-white">refactor: clean architecture</span>' },
    { type: 'blank' },
    { type: 'prompt', text: 'echo $STATUS' },
    { type: 'out',    text: '<span class="term-cyan">✓ Open to work  ·  Available now  ·  Remote OK</span>' },
    { type: 'blank' },
    { type: 'prompt', text: '' },   // final blinking cursor
  ];

  const CHAR_DELAY   = 40;   // ms per character for commands
  const LINE_PAUSE   = 320;  // ms pause after each output line
  const CMD_PAUSE    = 600;  // ms pause before showing output
  const LOOP_DELAY   = 4000; // ms before restarting

  let lineIndex = 0;
  let timeout;

  function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
  }

  function makePromptLine(partial, showCursor) {
    return `<span class="term-prompt">❯</span> <span class="term-cmd">${partial}</span>${showCursor ? '<span class="term-cursor"></span>' : ''}`;
  }

  async function typeCommand(text) {
    const line = document.createElement('span');
    line.className = 'term-line';
    line.innerHTML = makePromptLine('', true);
    body.appendChild(line);
    scrollToBottom();

    for (let i = 0; i <= text.length; i++) {
      line.innerHTML = makePromptLine(text.slice(0, i), true);
      await sleep(CHAR_DELAY + Math.random() * 20);
    }
    // Remove cursor after typing
    line.innerHTML = makePromptLine(text, false);
    await sleep(CMD_PAUSE);
  }

  function addOutputLine(html) {
    const line = document.createElement('span');
    line.className = 'term-line';
    line.innerHTML = html;
    body.appendChild(line);
    scrollToBottom();
  }

  function addBlank() {
    const line = document.createElement('span');
    line.className = 'term-line';
    line.innerHTML = ' ';
    body.appendChild(line);
  }

  function addFinalPrompt() {
    const line = document.createElement('span');
    line.className = 'term-line';
    line.innerHTML = makePromptLine('', true);
    body.appendChild(line);
    scrollToBottom();
  }

  function scrollToBottom() {
    body.scrollTop = body.scrollHeight;
  }

  async function runScript() {
    body.innerHTML = '';
    for (const step of SCRIPT) {
      if (step.type === 'prompt') {
        if (step.text === '') {
          addFinalPrompt();
          break;
        }
        await typeCommand(step.text);
      } else if (step.type === 'out') {
        addOutputLine(step.html || step.text);
        await sleep(LINE_PAUSE);
      } else if (step.type === 'blank') {
        addBlank();
        await sleep(100);
      }
    }
    // Auto-restart after delay
    timeout = setTimeout(runScript, LOOP_DELAY);
  }

  // Start when terminal enters viewport
  const io = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      runScript();
      io.disconnect();
    }
  }, { threshold: 0.3 });
  io.observe(body);

  // Also init counters for tc-num elements
  document.querySelectorAll('.tc-num[data-count]').forEach(el => {
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        countUp(el);
        obs.unobserve(el);
      }
    }, { threshold: 0.5 });
    obs.observe(el);
  });
}

/* ══════════════════════════════════════════════
   HERO PARALLAX — Mouse-move depth engine
   ══════════════════════════════════════════════ */
function initHeroParallax() {
  const wrapper = document.getElementById('hero-parallax');
  if (!wrapper) return;
  // Don't run on touch devices
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const layers = wrapper.querySelectorAll('.hv-layer[data-depth]');
  let targetX = 0, targetY = 0;
  let currentX = 0, currentY = 0;
  let rafId;
  const STRENGTH = 28; // max px offset at depth 1

  function lerp(a, b, t) { return a + (b - a) * t; }

  function onMouseMove(e) {
    const rect = wrapper.getBoundingClientRect();
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;
    targetX = (e.clientX - cx) / (rect.width  / 2);  // -1 to +1
    targetY = (e.clientY - cy) / (rect.height / 2);
  }

  function animate() {
    currentX = lerp(currentX, targetX, 0.07);
    currentY = lerp(currentY, targetY, 0.07);

    layers.forEach(layer => {
      const depth  = parseFloat(layer.dataset.depth) || 0;
      const tx = currentX * STRENGTH * depth;
      const ty = currentY * STRENGTH * depth;
      layer.style.transform = `translate(${tx}px, ${ty}px)`;
    });

    rafId = requestAnimationFrame(animate);
  }

  function onLeave() {
    targetX = 0; targetY = 0;
  }

  wrapper.addEventListener('mousemove', onMouseMove);
  wrapper.addEventListener('mouseleave', onLeave);
  animate();

  // Also init counters for hv-stat-n elements
  document.querySelectorAll('.hv-stat-n[data-count]').forEach(el => {
    const io = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        countUp(el);
        io.unobserve(el);
      }
    }, { threshold: 0.5 });
    io.observe(el);
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(rafId);
    else animate();
  });
}
