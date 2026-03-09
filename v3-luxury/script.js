/* V3 LUXURY — script.js */
'use strict';

/* SPLASH */
setTimeout(() => {
  const s = document.getElementById('splash');
  if (s) { s.classList.add('hidden'); setTimeout(() => { s.style.display = 'none'; }, 900); }
}, 2000);

/* NAVBAR SCROLL */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 40);
});

/* EQUITY DATA */
const equityData = [0,-5,-14,-25,-40,-50,10,60,110,105,120,100,90,82,98,175,215,210,195,172,180,168,152,148,155,210,297];
const equityLabels = ['Nov 25','Nov 28','Dec 01','Dec 04','Dec 07','Dec 10','Dec 13','Dec 16','Dec 19','Dec 22','Dec 25','Dec 28','Dec 31','Jan 03','Jan 06','Jan 09','Jan 12','Jan 15','Jan 18','Jan 21','Jan 24','Jan 27','Jan 29','Jan 31','Feb 01','Feb 02'];

function makeChart(ctxId, mini) {
  const el = document.getElementById(ctxId);
  if (!el) return;
  const ctx = el.getContext('2d');
  const h = el.offsetHeight || 280;
  const gradient = ctx.createLinearGradient(0, 0, 0, h);
  gradient.addColorStop(0, 'rgba(201,168,76,0.35)');
  gradient.addColorStop(1, 'rgba(201,168,76,0)');
  const labels = mini ? equityLabels.filter((_, i) => i % 3 === 0) : equityLabels;
  const data = mini ? equityData.filter((_, i) => i % 3 === 0) : equityData;
  new Chart(el, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        data,
        borderColor: '#C9A84C',
        borderWidth: 1.5,
        fill: true,
        backgroundColor: gradient,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 4,
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
          borderColor: '#C9A84C',
          borderWidth: 1,
          titleColor: '#C9A84C',
          bodyColor: '#D8D0C4',
          titleFont: { family: "'Roboto Mono'" },
          bodyFont: { family: "'Roboto Mono'" },
        }
      },
      scales: {
        x: {
          display: !mini,
          ticks: { color: '#6B6560', font: { family: "'Roboto Mono'", size: 10 }, maxTicksLimit: 6 },
          grid: { color: 'rgba(201,168,76,0.06)' }
        },
        y: {
          display: !mini,
          ticks: { color: '#6B6560', font: { family: "'Roboto Mono'", size: 10 }, callback: v => v + '%' },
          grid: { color: 'rgba(201,168,76,0.06)' }
        }
      }
    }
  });
}

window.addEventListener('DOMContentLoaded', () => {
  makeChart('equity-chart', true);
  makeChart('equity-chart-proof', false);
  if (typeof Swiper !== 'undefined') {
    new Swiper('.testimonials-swiper', {
      loop: true,
      autoplay: { delay: 5500, disableOnInteraction: false },
      pagination: { el: '.swiper-pagination', clickable: true },
      navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
    });
  }
  document.querySelectorAll('.luxury-card,.phase-card,.team-card,.ts-card').forEach(el => el.classList.add('reveal'));
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
});

/* COUNTER ANIMATION */
function animateCount(el) {
  const target = parseFloat(el.dataset.target);
  const isFloat = String(el.dataset.target).includes('.');
  const dec = isFloat ? (String(el.dataset.target).split('.')[1] || '').length : 0;
  const dur = 1800; const step = 16; const steps = dur / step;
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
