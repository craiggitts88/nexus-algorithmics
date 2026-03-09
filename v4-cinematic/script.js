/* V4 CINEMATIC — script.js */

/* ===== SPLASH ===== */
(function() {
  document.body.style.overflow = 'hidden';
  setTimeout(() => {
    const splash = document.getElementById('splash');
    if (splash) { splash.classList.add('fade-out'); }
    document.body.style.overflow = '';
  }, 2700);
})();

/* ===== NAVBAR SCROLL ===== */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ===== HAMBURGER ===== */
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => navLinks.classList.toggle('nav-open'));
}

/* ===== GRID CANVAS ===== */
(function() {
  const canvas = document.getElementById('grid-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h;
  function resize() {
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);
  let t = 0;
  function draw() {
    ctx.clearRect(0, 0, w, h);
    const CELL = 80;
    ctx.strokeStyle = 'rgba(123,47,190,0.08)';
    ctx.lineWidth = 0.8;
    for (let x = 0; x < w; x += CELL) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
    for (let y = 0; y < h; y += CELL) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
    // Pulsing nodes
    for (let x = 0; x < w; x += CELL) {
      for (let y = 0; y < h; y += CELL) {
        const pulse = Math.sin(t * 0.01 + x * 0.01 + y * 0.01) * 0.5 + 0.5;
        ctx.fillStyle = `rgba(168,85,247,${pulse * 0.15})`;
        ctx.beginPath(); ctx.arc(x, y, 2 + pulse * 2, 0, Math.PI * 2); ctx.fill();
      }
    }
    t++;
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ===== HERO CHART ===== */
function buildHeroChart() {
  const canvas = document.getElementById('hero-chart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const pts = 60;
  const data = [];
  let v = 100;
  for (let i = 0; i < pts; i++) {
    v += (Math.random() - 0.35) * 6.5;
    v = Math.max(68, v);
    data.push(v);
  }
  const grad = ctx.createLinearGradient(0, 0, 0, 180);
  grad.addColorStop(0, 'rgba(168,85,247,0.35)');
  grad.addColorStop(1, 'rgba(168,85,247,0)');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.map(() => ''),
      datasets: [{ data, borderColor: '#A855F7', borderWidth: 2.5, backgroundColor: grad, fill: true, tension: 0.4, pointRadius: 0 }]
    },
    options: {
      animation: false, maintainAspectRatio: false, responsive: true,
      plugins: { legend: { display: false }, tooltip: { enabled: false } },
      scales: { x: { display: false }, y: { display: false } }
    }
  });
}

/* ===== EQUITY CHART (REAL DATA) ===== */
function buildEquityChart() {
  const canvas = document.getElementById('equity-chart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const labels = ['Nov 25','Nov 28','Dec 01','Dec 04','Dec 07','Dec 10','Dec 13','Dec 16','Dec 19','Dec 22','Dec 25','Dec 28','Dec 31','Jan 03','Jan 06','Jan 09','Jan 12','Jan 15','Jan 18','Jan 21','Jan 24','Jan 27','Jan 29','Jan 31','Feb 01','Feb 02'];
  const growthPct = [0,-5,-14,-25,-40,-50,10,60,110,105,120,100,90,82,98,175,215,210,195,172,180,168,152,148,155,210,297];
  const grad = ctx.createLinearGradient(0, 0, 0, 300);
  grad.addColorStop(0, 'rgba(168,85,247,0.4)');
  grad.addColorStop(1, 'rgba(168,85,247,0)');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: growthPct.map((_, i) => labels[i] || ''),
      datasets: [{
        label: 'Gain %',
        data: growthPct,
        borderColor: '#A855F7', borderWidth: 3,
        backgroundColor: grad, fill: true, tension: 0.4, pointRadius: 0,
        pointHoverRadius: 5, pointHoverBackgroundColor: '#A855F7'
      }]
    },
    options: {
      maintainAspectRatio: false, responsive: true,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(13,9,24,0.98)', borderColor: 'rgba(123,47,190,0.3)', borderWidth: 1,
          titleColor: '#7A6B9A', bodyColor: '#A855F7',
          callbacks: {
            title: ctx => ctx[0].label,
            label: ctx => ` +${ctx.parsed.y.toFixed(1)}% gain`
          }
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(123,47,190,0.07)' },
          ticks: { color: '#7A6B9A', font: { family: 'Inter', size: 10 }, maxTicksLimit: 7, maxRotation: 0 }
        },
        y: {
          grid: { color: 'rgba(123,47,190,0.07)' },
          ticks: {
            color: '#7A6B9A', font: { family: "'Roboto Mono', monospace", size: 10 },
            callback: v => '+' + v + '%'
          }
        }
      }
    }
  });
}

/* ===== SWIPER ===== */
function initSwiper() {
  new Swiper('.testimonials-swiper', {
    loop: true, autoplay: { delay: 5500, disableOnInteraction: false },
    pagination: { el: '.swiper-pagination', clickable: true },
    navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
    breakpoints: { 0: { slidesPerView: 1, spaceBetween: 16 }, 768: { slidesPerView: 1, spaceBetween: 24 }, 1024: { slidesPerView: 1, spaceBetween: 32 } }
  });
}

/* ===== SCROLL REVEAL ===== */
function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach((el, i) => {
    el.style.transitionDelay = (i % 6) * 0.08 + 's';
    obs.observe(el);
  });
}

/* ===== COUNTER ===== */
function animateCounters() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const text = el.textContent;
      const num = parseFloat(text.replace(/[^0-9.]/g, ''));
      if (isNaN(num)) return;
      const prefix = text.match(/^[^0-9]*/)?.[0] || '';
      const suffix = text.match(/[^0-9.]+$/)?.[0] || '';
      const dur = 1800, start = performance.now();
      function step(now) {
        const p = Math.min((now - start) / dur, 1);
        const ease = p < 0.5 ? 2*p*p : -1+(4-2*p)*p;
        el.textContent = prefix + (num * ease).toFixed(num % 1 !== 0 ? 2 : 0) + suffix;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.sv').forEach(el => obs.observe(el));
}

/* ===== SMOOTH SCROLL ===== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const t = document.querySelector(a.getAttribute('href'));
    if (t) t.scrollIntoView({ behavior: 'smooth' });
    navLinks?.classList.remove('nav-open');
  });
});

/* ===== INIT ===== */
document.addEventListener('DOMContentLoaded', () => {
  buildHeroChart();
  buildEquityChart();
  initSwiper();
  initReveal();
  animateCounters();
});
