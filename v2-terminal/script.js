/* V2 TERMINAL — script.js */
'use strict';

/* =============================================
   SPLASH BOOT SEQUENCE
   ============================================= */
(function () {
  const lines = ['sb1','sb2','sb3','sb4','sb5'];
  lines.forEach((id, i) => {
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.classList.add('visible');
    }, 400 + i * 480);
  });
  setTimeout(() => {
    const splash = document.getElementById('splash');
    if (splash) splash.classList.add('hidden');
    setTimeout(() => { if (splash) splash.style.display = 'none'; }, 700);
  }, 2800);
})();

/* =============================================
   LIVE CLOCK
   ============================================= */
function updateClocks() {
  const now = new Date();
  const t = now.toTimeString().slice(0, 8);
  const mbTime = document.getElementById('mb-time');
  const sfTime = document.getElementById('sf-time');
  if (mbTime) mbTime.textContent = t;
  if (sfTime) sfTime.textContent = t;
}
updateClocks();
setInterval(updateClocks, 1000);

/* =============================================
   LIVE FEED WINDOW
   ============================================= */
const SYMBOLS = ['EURUSD', 'GBPUSD', 'USDJPY', 'XAUUSD', 'BTCUSD', 'NASDAQ', 'SP500', 'CRUDE', 'AUDUSD', 'NZDUSD'];
const PRICES = {
  EURUSD: 1.0842, GBPUSD: 1.2630, USDJPY: 148.53, XAUUSD: 2034.20,
  BTCUSD: 52134.50, NASDAQ: 17482.30, SP500: 4982.12, CRUDE: 74.31,
  AUDUSD: 0.6521, NZDUSD: 0.6112
};
let feedInterval;

function buildFeedEntry() {
  const sym = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
  const type = Math.random() > 0.5 ? 'BUY' : 'SELL';
  const basePrice = PRICES[sym];
  const price = (basePrice + (Math.random() - 0.5) * basePrice * 0.001).toFixed(sym === 'USDJPY' ? 2 : sym === 'XAUUSD' || sym === 'BTCUSD' ? 2 : 4);
  const plVal = (Math.random() * 1800 - 400).toFixed(2);
  const pl = parseFloat(plVal) >= 0 ? `+$${plVal}` : `-$${Math.abs(plVal)}`;
  const plPos = parseFloat(plVal) >= 0;

  const now = new Date();
  const ts = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}:${now.getSeconds().toString().padStart(2,'0')}`;

  const div = document.createElement('div');
  div.className = 'feed-entry';
  div.innerHTML = `
    <span class="fe-ts">${ts}</span>
    <span class="fe-sym">${sym}</span>
    <span class="fe-type ${type.toLowerCase()}">${type}</span>
    <span class="fe-price">${price}</span>
    <span class="fe-pl ${plPos ? 'pos' : 'neg'}">${pl}</span>
  `;
  return div;
}

function startFeed() {
  const body = document.getElementById('feed-body');
  if (!body) return;
  for (let i = 0; i < 8; i++) body.appendChild(buildFeedEntry());
  feedInterval = setInterval(() => {
    const newEntry = buildFeedEntry();
    body.insertBefore(newEntry, body.firstChild);
    const entries = body.querySelectorAll('.feed-entry');
    if (entries.length > 30) body.removeChild(body.lastChild);
  }, 1400);
}
startFeed();

/* =============================================
   EQUITY DATA (REAL MYFXBOOK)
   ============================================= */
const equityData = [0,-5,-14,-25,-40,-50,10,60,110,105,120,100,90,82,98,175,215,210,195,172,180,168,152,148,155,210,297];
const equityLabels = ['Nov 25','Nov 28','Dec 01','Dec 04','Dec 07','Dec 10','Dec 13','Dec 16','Dec 19','Dec 22','Dec 25','Dec 28','Dec 31','Jan 03','Jan 06','Jan 09','Jan 12','Jan 15','Jan 18','Jan 21','Jan 24','Jan 27','Jan 29','Jan 31','Feb 01','Feb 02'];

function makeChart(ctxId, mini) {
  const el = document.getElementById(ctxId);
  if (!el) return;
  const labels = mini ? equityLabels.filter((_, i) => i % 3 === 0) : equityLabels;
  const data = mini ? equityData.filter((_, i) => i % 3 === 0) : equityData;
  const gradient = el.getContext('2d').createLinearGradient(0, 0, 0, el.offsetHeight || 200);
  gradient.addColorStop(0, 'rgba(0,255,65,0.3)');
  gradient.addColorStop(1, 'rgba(0,255,65,0)');
  return new Chart(el, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        data,
        borderColor: '#00FF41',
        borderWidth: mini ? 1.5 : 2,
        fill: true,
        backgroundColor: gradient,
        tension: 0.3,
        pointRadius: 0,
        pointHoverRadius: 4,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => ` ${ctx.parsed.y >= 0 ? '+' : ''}${ctx.parsed.y.toFixed(2)}%`
          },
          backgroundColor: '#111',
          borderColor: '#00FF41',
          borderWidth: 1,
          titleColor: '#00FF41',
          bodyColor: '#C8C8C8',
          titleFont: { family: "'Roboto Mono'" },
          bodyFont: { family: "'Roboto Mono'" },
        }
      },
      scales: {
        x: {
          display: !mini,
          ticks: { color: '#555', font: { family: "'Roboto Mono'", size: 9 }, maxTicksLimit: 6 },
          grid: { color: 'rgba(0,255,65,0.05)' }
        },
        y: {
          display: !mini,
          ticks: {
            color: '#555',
            font: { family: "'Roboto Mono'", size: 9 },
            callback: v => v + '%'
          },
          grid: { color: 'rgba(0,255,65,0.05)' }
        }
      }
    }
  });
}

window.addEventListener('DOMContentLoaded', () => {
  makeChart('equity-chart', true);
  makeChart('equity-chart-proof', false);
});

/* =============================================
   SWIPER TESTIMONIALS
   ============================================= */
window.addEventListener('DOMContentLoaded', () => {
  if (typeof Swiper !== 'undefined') {
    new Swiper('.testimonials-swiper', {
      loop: true,
      autoplay: { delay: 6000, disableOnInteraction: false },
      pagination: { el: '.swiper-pagination', clickable: true },
      navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
    });
  }
});

/* =============================================
   SCROLL REVEAL
   ============================================= */
window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.section-win, .json-card, .ft-item, .psp-row, .as-item').forEach(el => {
    el.classList.add('reveal');
  });
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
});

/* =============================================
   COUNTER ANIMATION
   ============================================= */
function animateCount(el) {
  const target = parseFloat(el.dataset.target);
  const isFloat = String(el.dataset.target).includes('.');
  const dec = isFloat ? (String(el.dataset.target).split('.')[1] || '').length : 0;
  const dur = 1800;
  const step = 16;
  const steps = dur / step;
  let cur = 0;
  const inc = target / steps;
  const timer = setInterval(() => {
    cur = Math.min(cur + inc, target);
    el.textContent = (el.dataset.prefix || '') + cur.toFixed(dec) + (el.dataset.suffix || '');
    if (cur >= target) clearInterval(timer);
  }, step);
}

const countObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting && !e.target.dataset.counted) {
      e.target.dataset.counted = '1';
      animateCount(e.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-target]').forEach(el => countObs.observe(el));
