/* =============================================
   NEXUS ALGORITHMICS — SCRIPT.JS
   ============================================= */

'use strict';

// ── Splash screen ─────────────────────────────
(function initSplash() {
  const splash = document.getElementById('splash');
  if (!splash) return;

  // Prevent scroll while splash is visible
  document.body.style.overflow = 'hidden';

  // After 2.6s start fade out, then hide completely
  setTimeout(() => {
    splash.classList.add('fade-out');
    document.body.style.overflow = '';

    splash.addEventListener('transitionend', () => {
      splash.classList.add('hidden');
    }, { once: true });
  }, 2600);
})();

// ── Navbar scroll effect ──────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ── Mobile hamburger menu ─────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  spans[0].style.transform = navLinks.classList.contains('open') ? 'translateY(7px) rotate(45deg)' : '';
  spans[1].style.opacity   = navLinks.classList.contains('open') ? '0' : '1';
  spans[2].style.transform = navLinks.classList.contains('open') ? 'translateY(-7px) rotate(-45deg)' : '';
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = '1'; });
  });
});

// ── Scroll reveal (Intersection Observer) ────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Stagger siblings inside grids
      const parent = entry.target.parentElement;
      if (parent && (parent.classList.contains('edge-grid') || parent.classList.contains('team-grid'))) {
        const siblings = Array.from(parent.querySelectorAll('.reveal'));
        const idx = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = `${idx * 0.1}s`;
      }
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Hero background grid canvas ──────────────
(function initGridCanvas() {
  const canvas = document.getElementById('grid-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, animId;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function drawGrid(t) {
    ctx.clearRect(0, 0, W, H);

    const cellSize = 52;
    const cols = Math.ceil(W / cellSize) + 1;
    const rows = Math.ceil(H / cellSize) + 1;

    // Scrolling offset for subtle movement
    const offsetX = (t * 0.008) % cellSize;
    const offsetY = (t * 0.004) % cellSize;

    ctx.strokeStyle = 'rgba(0, 212, 255, 0.07)';
    ctx.lineWidth = 1;

    // Vertical lines
    for (let c = 0; c <= cols; c++) {
      const x = c * cellSize - offsetX;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.stroke();
    }

    // Horizontal lines
    for (let r = 0; r <= rows; r++) {
      const y = r * cellSize - offsetY;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }

    // Glowing dots at intersections (sparse)
    for (let c = 0; c <= cols; c++) {
      for (let r = 0; r <= rows; r++) {
        if ((c + r) % 4 !== 0) continue;
        const x = c * cellSize - offsetX;
        const y = r * cellSize - offsetY;
        const pulse = 0.3 + 0.2 * Math.sin(t * 0.002 + c * 0.5 + r * 0.7);
        ctx.beginPath();
        ctx.arc(x, y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 212, 255, ${pulse})`;
        ctx.fill();
      }
    }

    // Trendline SVG-style polyline across hero
    const points = [];
    const steps = 22;
    const baseY = H * 0.62;
    for (let i = 0; i <= steps; i++) {
      const x = (i / steps) * W;
      const noise = Math.sin(t * 0.0012 + i * 0.9) * 18
                  + Math.sin(t * 0.0008 + i * 1.7) * 12
                  - i * (H * 0.0028); // overall upward drift
      points.push({ x, y: baseY + noise });
    }

    // Glow
    ctx.shadowColor = '#00D4FF';
    ctx.shadowBlur = 12;
    ctx.strokeStyle = 'rgba(0, 212, 255, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Area fill under trendline
    const grad = ctx.createLinearGradient(0, baseY - 40, 0, H);
    grad.addColorStop(0, 'rgba(0, 212, 255, 0.06)');
    grad.addColorStop(1, 'rgba(0, 212, 255, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(points[0].x, H);
    ctx.lineTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
    ctx.lineTo(points[points.length - 1].x, H);
    ctx.closePath();
    ctx.fill();
  }

  let start = null;
  function loop(ts) {
    if (!start) start = ts;
    drawGrid(ts - start);
    animId = requestAnimationFrame(loop);
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });
  animId = requestAnimationFrame(loop);
})();

// ── Hero mini-chart (top-right card) ─────────
function buildHeroChart() {
  const canvas = document.getElementById('hero-chart');
  if (!canvas || typeof Chart === 'undefined') return;

  // Generate a realistic upward equity curve
  function generateEquity(steps, startVal, volatility, drift) {
    const values = [startVal];
    for (let i = 1; i < steps; i++) {
      const change = drift + (Math.random() - 0.47) * volatility;
      values.push(Math.max(values[i - 1] * (1 + change), startVal * 0.5));
    }
    return values;
  }

  const labels = Array.from({ length: 60 }, (_, i) => i + 1);
  const data   = generateEquity(60, 100, 0.035, 0.008);

  new Chart(canvas, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        data,
        borderColor: '#00D4FF',
        borderWidth: 2,
        pointRadius: 0,
        fill: true,
        backgroundColor: (ctx) => {
          const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 200);
          g.addColorStop(0, 'rgba(0,212,255,0.18)');
          g.addColorStop(1, 'rgba(0,212,255,0.01)');
          return g;
        },
        tension: 0.4,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 1200, easing: 'easeInOutQuart' },
      plugins: { legend: { display: false }, tooltip: { enabled: false } },
      scales: {
        x: { display: false },
        y: { display: false },
      },
      interaction: { mode: 'none' },
    },
  });
}

// ── Proof section equity curve chart ─────────
function buildEquityChart() {
  const canvas = document.getElementById('equity-chart');
  if (!canvas || typeof Chart === 'undefined') return;

  // Real verified data — Myfxbook, Nov 25 2025 – Feb 02 2026
  // Growth % converted to account value starting at $100,000
  const labels = [
    'Nov 25', 'Nov 28', 'Dec 01', 'Dec 03', 'Dec 05',
    'Dec 09', 'Dec 12', 'Dec 15', 'Dec 17', 'Dec 19',
    'Dec 22', 'Dec 26', 'Dec 29', 'Jan 02', 'Jan 05',
    'Jan 07', 'Jan 09', 'Jan 12', 'Jan 14', 'Jan 16',
    'Jan 19', 'Jan 21', 'Jan 23', 'Jan 26', 'Jan 28',
    'Jan 30', 'Feb 02'
  ];

  // Derived from the Myfxbook Growth chart (% gain × $100k base)
  const growthPct = [
     0, -5, -14, -25, -40,
    -50,  10,  60, 110, 105,
    120, 100,  90,  82,  98,
    175, 215, 210, 195, 172,
    180, 168, 152, 148, 155,
    210, 297
  ];

  const equity = growthPct.map(p => Math.round(100000 * (1 + p / 100)));

  new Chart(canvas, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Nexus Flagship Strategy',
          data: equity,
          borderColor: '#00D4FF',
          borderWidth: 2.5,
          pointRadius: 0,
          fill: true,
          backgroundColor: (ctx) => {
            const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 320);
            g.addColorStop(0, 'rgba(0,212,255,0.2)');
            g.addColorStop(1, 'rgba(0,212,255,0.01)');
            return g;
          },
          tension: 0.4,
          order: 0,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 1600, easing: 'easeInOutQuart' },
      plugins: {
        legend: {
          display: true,
          labels: {
            color: '#9BA3B8',
            font: { family: "'Roboto Mono', monospace", size: 11 },
            boxWidth: 24,
            boxHeight: 2,
            usePointStyle: false,
          },
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          backgroundColor: 'rgba(10, 14, 23, 0.95)',
          borderColor: 'rgba(0,212,255,0.3)',
          borderWidth: 1,
          titleColor: '#00D4FF',
          bodyColor: '#9BA3B8',
          titleFont: { family: "'Roboto Mono', monospace", size: 11 },
          bodyFont: { family: "'Roboto Mono', monospace", size: 11 },
          callbacks: {
            label: ctx => {
              const pct = ((ctx.parsed.y - 100000) / 100000 * 100).toFixed(1);
              return ` ${ctx.dataset.label}: ${pct >= 0 ? '+' : ''}${pct}%`;
            },
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: '#5C6478',
            font: { family: "'Roboto Mono', monospace", size: 10 },
            maxTicksLimit: 7,
            maxRotation: 0,
          },
          grid: { color: 'rgba(255,255,255,0.04)' },
          border: { color: 'rgba(255,255,255,0.07)' },
        },
        y: {
          ticks: {
            color: '#5C6478',
            font: { family: "'Roboto Mono', monospace", size: 10 },
            callback: v => {
              const pct = Math.round((v - 100000) / 100000 * 100);
              return (pct >= 0 ? '+' : '') + pct + '%';
            },
          },
          grid: { color: 'rgba(255,255,255,0.04)' },
          border: { color: 'rgba(255,255,255,0.07)' },
        },
      },
      interaction: { mode: 'index', intersect: false },
    },
  });
}

// ── Swiper Testimonials Carousel ──────────────
function initSwiper() {
  if (typeof Swiper === 'undefined') return;
  new Swiper('.testimonials-swiper', {
    slidesPerView: 1,
    spaceBetween: 24,
    loop: true,
    autoplay: { delay: 5500, disableOnInteraction: false, pauseOnMouseEnter: true },
    pagination: { el: '.swiper-pagination', clickable: true },
    navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
    breakpoints: {
      640:  { slidesPerView: 1 },
      900:  { slidesPerView: 2 },
      1200: { slidesPerView: 3 },
    },
    grabCursor: true,
    effect: 'slide',
  });
}

// ── Smooth active nav link highlighting ───────
function initActiveNav() {
  const sections = document.querySelectorAll('section[id], div[id="apply"]');
  const links    = document.querySelectorAll('.nav-links a[href^="#"]');

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => obs.observe(s));
}

// ── Typed counter animation for stat values ──
function animateCounters() {
  const counters = document.querySelectorAll('.stat-value.mono, .ps-value.mono');

  counters.forEach(el => {
    const raw = el.textContent.trim();
    const num = parseFloat(raw.replace(/[^0-9.]/g, ''));
    if (isNaN(num)) return;

    const prefix = raw.match(/^[^0-9]*/)[0];
    const suffix = raw.match(/[^0-9.]*$/)[0];
    const decimals = (raw.split('.')[1] || '').replace(/[^0-9]/g, '').length;
    const duration = 1200;
    const start = performance.now();

    const obs = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;
      obs.disconnect();

      function step(ts) {
        const elapsed = ts - start;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        el.textContent = prefix + (num * ease).toFixed(decimals) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }, { threshold: 0.5 });

    obs.observe(el);
  });
}

// ── Wait for all deps to load then init ───────
function init() {
  initSwiper();
  buildHeroChart();
  buildEquityChart();
  initActiveNav();
  animateCounters();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  // If Chart.js/Swiper are still loading via CDN, wait a tick
  setTimeout(init, 0);
}
