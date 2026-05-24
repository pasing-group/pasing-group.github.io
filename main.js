/* ─── Page Loader ───────────────────────────────────────────── */
const loader   = document.getElementById('loader');
const loaderTxt = document.querySelector('.loader-text');

// Stagger loader chars
const chars = 'PY.'.split('');
loaderTxt.innerHTML = chars.map((c, i) =>
  `<span style="animation-delay:${i * 0.1}s">${c}</span>`
).join('');

window.addEventListener('load', () => {
  setTimeout(() => loader.classList.add('hidden'), 1400);
});

/* ─── Custom Cursor ─────────────────────────────────────────── */
const dot  = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
const glow = document.getElementById('cursor-glow');

let mx = window.innerWidth / 2, my = window.innerHeight / 2;
let rx = mx, ry = my; // ring lags behind

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  dot.style.left  = mx + 'px';
  dot.style.top   = my + 'px';
  glow.style.left = mx + 'px';
  glow.style.top  = my + 'px';
});

// Ring lerps for smooth follow
(function animRing() {
  rx += (mx - rx) * 0.14;
  ry += (my - ry) * 0.14;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(animRing);
})();

// Hover state on interactive elements
document.querySelectorAll('a, button, .glass-card, .tag, .project-img-wrap, .social-card, .contact-link-pill, .hsocial-link').forEach(el => {
  el.addEventListener('mouseenter', () => ring.classList.add('hover'));
  el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
});

/* ─── Navbar Scroll ─────────────────────────────────────────── */
const navbar   = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// Active nav link tracking
const activeObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { threshold: 0.45 });
sections.forEach(s => activeObs.observe(s));

/* ─── Mobile Menu ───────────────────────────────────────────── */
const toggle     = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');

toggle.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  toggle.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
});
document.querySelectorAll('.mobile-link').forEach(l => {
  l.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    toggle.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ─── Hero Parallax ─────────────────────────────────────────── */
const heroBg = document.querySelector('.hero-bg');
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (y < window.innerHeight) {
    heroBg.style.transform = `translateY(${y * 0.28}px)`;
  }
}, { passive: true });

/* ─── Hero Mouse Depth ──────────────────────────────────────── */
const heroContent = document.querySelector('.hero-content');
document.querySelector('.hero').addEventListener('mousemove', e => {
  const { innerWidth: w, innerHeight: h } = window;
  const dx = (e.clientX / w - 0.5) * 2;
  const dy = (e.clientY / h - 0.5) * 2;
  heroContent.style.transform = `translate(${dx * 6}px, ${dy * 5}px)`;
  heroBg.style.transform = `translate(${dx * -12}px, ${dy * -8}px) translateY(${window.scrollY * 0.28}px)`;
});
document.querySelector('.hero').addEventListener('mouseleave', () => {
  heroContent.style.transform = '';
});

/* ─── Scroll Reveal ─────────────────────────────────────────── */
const reveals = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

reveals.forEach((el, i) => {
  el.style.transitionDelay = `${(i % 5) * 90}ms`;
  revealObs.observe(el);
});

// Section dividers
document.querySelectorAll('.section-divider').forEach(el => revealObs.observe(el));

/* ─── 3D Tilt — Cards ───────────────────────────────────────── */
function applyTilt(selector, strength = 12) {
  document.querySelectorAll(selector).forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transform = `
        perspective(600px)
        rotateY(${x * strength}deg)
        rotateX(${-y * strength}deg)
        translateZ(6px)
      `;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1)';
      setTimeout(() => { card.style.transition = ''; }, 500);
    });
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s linear';
    });
  });
}
applyTilt('.glass-card', 10);
applyTilt('.project-img-wrap', 7);

/* ─── Magnetic Buttons ──────────────────────────────────────── */
document.querySelectorAll('.btn-primary, .btn-ghost').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    const x = e.clientX - r.left - r.width  / 2;
    const y = e.clientY - r.top  - r.height / 2;
    btn.style.transform = `translate(${x * 0.22}px, ${y * 0.22}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
    btn.style.transition = 'transform 0.45s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s';
    setTimeout(() => { btn.style.transition = ''; }, 450);
  });
  btn.addEventListener('mouseenter', () => {
    btn.style.transition = 'transform 0.1s linear, box-shadow 0.3s';
  });
});

/* ─── Counter Animation ─────────────────────────────────────── */
const statNums = document.querySelectorAll('.stat-num');

function easeOutQuart(t) { return 1 - Math.pow(1 - t, 4); }

function animateCounter(el, target, suffix, duration = 1800) {
  const start = performance.now();
  const isNum = typeof target === 'number';

  (function tick(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeOutQuart(progress);
    if (isNum) {
      el.textContent = Math.round(eased * target) + suffix;
    }
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = target + suffix;
  })(start);
}

const counterObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const raw = el.dataset.count;
    const suffix = el.dataset.suffix || '';
    if (raw) {
      animateCounter(el, parseFloat(raw), suffix);
      counterObs.unobserve(el);
    }
  });
}, { threshold: 0.6 });

statNums.forEach(el => counterObs.observe(el));

/* ─── Skill items stagger on reveal ────────────────────────── */
document.querySelectorAll('.skill-group').forEach(group => {
  const items = group.querySelectorAll('.skill-item');
  const groupObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      items.forEach((item, i) => {
        setTimeout(() => {
          item.style.opacity = '1';
          item.style.transform = 'translateX(0)';
        }, i * 70);
      });
      groupObs.unobserve(entry.target);
    });
  }, { threshold: 0.3 });

  items.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-12px)';
    item.style.transition = 'opacity 0.5s cubic-bezier(0.16,1,0.3,1), transform 0.5s cubic-bezier(0.16,1,0.3,1)';
  });
  groupObs.observe(group);
});

/* ─── Tech tags wave stagger ────────────────────────────────── */
const tagsWrap = document.querySelector('.tech-tags');
const tags = tagsWrap ? tagsWrap.querySelectorAll('.tag') : [];
const tagsObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    tags.forEach((tag, i) => {
      setTimeout(() => {
        tag.style.opacity = '1';
        tag.style.transform = 'translateY(0) scale(1)';
      }, i * 45);
    });
    tagsObs.unobserve(entry.target);
  });
}, { threshold: 0.2 });

tags.forEach(tag => {
  tag.style.opacity = '0';
  tag.style.transform = 'translateY(10px) scale(0.92)';
  tag.style.transition = 'opacity 0.45s cubic-bezier(0.16,1,0.3,1), transform 0.45s cubic-bezier(0.16,1,0.3,1)';
});
if (tagsWrap) tagsObs.observe(tagsWrap);

/* ─── Smooth hash scroll ────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
