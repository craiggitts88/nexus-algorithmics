/* V4 CINEMATIC — script.js */
'use strict';

/* SPLASH */
setTimeout(() => {
  const s = document.getElementById('splash');
  if (s) { s.classList.add('hidden'); setTimeout(() => { s.style.display = 'none'; }, 700); }
}, 1800);

/* NAVBAR SCROLL */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 60);
});

/* HERO BG CANVAS — particle field */
(function () {
  const canvas = document.getElementById('hero-bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, particles;
  function resize() {
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
  }
  function makeParticle() {
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.2 + 0.3,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      alpha: Math.random() * 0.25 + 0.05
    };
  }
  function init() {
    resize();
    particles = Array.from({ length: 80 }, makeParticle);
  }
  function draw() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(168,85,247,${p.alpha})`;
      ctx.fill();
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
    });
    // draw faint connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(168,85,247,${0.06 * (1 - d / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  window.addEventListener('resize', () => { resize(); });
  init();
  draw();
})();

/* EQUITY DATA */
const equityData = [0,-5,-14,-25,-40,-50,10,60,110,105,120,100,90,82,98,175,215,210,195,172,180,168,152,148,155,210,297];
const equityLabels = ['Nov 25','Nov 28','Dec 01','Dec 04','Dec 07','Dec 10','Dec 13','Dec 16','Dec 19','Dec 22','Dec 25','Dec 28','Dec 31','Jan 03','Jan 06','Jan 09','Jan 12','Jan 15','Jan 18','Jan 21','Jan 24','Jan 27','Jan 29','Jan 31','Feb 01','Feb 02'];

function makeChart(ctxId, mini) {
  const el = document.getElementById(ctxId);
  if (!el) return;
  const ctx = el.getContext('2d');
  const h = el.offsetHeight || 280;
  const gradient = ctx.createLinearGradient(0, 0, 0, h);
  gradient.addColorStop(0, 'rgba(168,85,247,0.35)');
  gradient.addColorStop(1, 'rgba(168,85,247,0)');
  const labels = mini ? equityLabels.filter((_, i) => i % 3 === 0) : equityLabels;
  const data = mini ? equityData.filter((_, i) => i % 3 === 0) : equityData;
  new Chart(el, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        data,
        borderColor: '#A855F7',
        borderWidth: mini ? 1.5 : 2,
        fill: true,
        backgroundColor: gradient,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 5,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: { label: ctx => ` ${ctx.parsed.y >= 0 ? '+' : ''}${ctx.parsed.y.toFixed(2)}%` },
          backgroundColor: '#111',
          borderColor: '#A855F7',
          borderWidth: 1,
          titleColor: '#A855F7',
          bodyColor: '#E8E8E8',
          titleFont: { family: "'Roboto Mono'" },
          bodyFont: { family: "'Roboto Mono'" },
        }
      },
      scales: {
        x: {
          display: !mini,
          ticks: { color: '#555', font: { family: "'Roboto Mono'", size: 10 }, maxTicksLimit: 6 },
          grid: { color: 'rgba(168,85,247,0.06)' }
        },
        y: {
          display: !mini,
          ticks: { color: '#555', font: { family: "'Roboto Mono'", size: 10 }, callback: v => v + '%' },
          grid: { color: 'rgba(168,85,247,0.06)' }
        }
      }
    }
  });
}

window.addEventListener('DOMContentLoaded', () => {
  makeChart('equity-chart', true);
  makeChart('equity-chart-proof', false);

  if (typeof Swiper !== 'undefined') {
    new Swiper('.pq-swiper', {
      loop: true,
      autoplay: { delay: 6500, disableOnInteraction: false },
      pagination: { el: '.swiper-pagination', clickable: true },
      navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
    });
  }

  // Scroll reveal
  document.querySelectorAll('.phase-item, .edge-item, .pbn-item, .psg-item, .team-member, .pull-quote').forEach(el => el.classList.add('reveal'));
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
});

/* COUNTER ANIMATION */
function animateCount(el) {
  const target = parseFloat(el.dataset.target);
  const isFloat = String(el.dataset.target).includes('.');
  const dec = isFloat ? (String(el.dataset.target).split('.')[1] || '').length : 0;
  const dur = 1600; const step = 16; const steps = dur / step;
  let cur = 0; const inc = target / steps;
  const timer = setInterval(() => {
    cur = Math.min(cur + inc, target);
    el.textContent = (el.dataset.prefix || '') + cur.toFixed(dec) + (el.dataset.suffix || '');
    if (cur >= target) clearInterval(timer);
  }, step);
}
const countObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting && !e.target.dataset.counted) {
      e.target.dataset.counted = '1'; animateCount(e.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-target]').forEach(el => countObs.observe(el));
