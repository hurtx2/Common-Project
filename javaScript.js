// app.js
const userTarget = 294625965; // target from mockup
const COUNTER_DURATION = 2400; // ms

document.addEventListener('DOMContentLoaded', () => {
  animateCounter('userCounter', userTarget, COUNTER_DURATION);
  loadMarketData();
  loadNews();
  setupSignupButtons();
  setupThemeToggle();
});

/* ----- animated counter ----- */
function animateCounter(id, target, duration) {
  const el = document.getElementById(id);
  if (!el) return;
  const start = 0;
  const range = target - start;
  let startTime = null;
  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const eased = easeOutCubic(progress);
    const current = Math.floor(start + range * eased);
    el.textContent = current.toLocaleString('en-US');
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  }
  window.requestAnimationFrame(step);
}
function easeOutCubic(t) { return (--t) * t * t + 1; }

/* ----- fetch market data from CoinGecko ----- */
/* Uses public CoinGecko API — no key required */
async function loadMarketData() {
  const marketList = document.getElementById('marketList');
  try {
    // get top 6 coins by market cap in USD
    const resp = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=6&page=1&sparkline=false&price_change_percentage=24h');
    if (!resp.ok) throw new Error('CoinGecko fetch failed');
    const data = await resp.json();
    marketList.innerHTML = '';
    data.forEach(coin => {
      const li = document.createElement('li');
      li.innerHTML = `
        <div class="coin">
          <img src="${coin.image}" alt="${coin.name} logo" />
          <div>
            <div class="coin-name">${coin.name}</div>
            <div class="coin-symbol">${coin.symbol.toUpperCase()}</div>
          </div>
        </div>
        <div style="text-align:right">
          <div class="price">$${formatNumber(coin.current_price)}</div>
          <div class="${coin.price_change_percentage_24h >= 0 ? 'change-pos' : 'change-neg'}">
            ${coin.price_change_percentage_24h ? coin.price_change_percentage_24h.toFixed(2) : '0.00'}%
          </div>
        </div>
      `;
      marketList.appendChild(li);
    });
  } catch (err) {
    console.error(err);
    marketList.innerHTML = `<li class="muted">Не удалось загрузить данные рынка. Попробуйте позже.</li>`;
  }
}

/* ----- fetch news/status updates from CoinGecko ----- */
async function loadNews() {
  const newsList = document.getElementById('newsList');
  try {
    const resp = await fetch('https://api.coingecko.com/api/v3/status_updates?per_page=5&page=1');
    if (!resp.ok) throw new Error('News fetch failed');
    const json = await resp.json();
    const updates = json.status_updates || [];
    newsList.innerHTML = '';
    if (updates.length === 0) {
      newsList.innerHTML = `<div class="muted">Нет новостей.</div>`;
      return;
    }
    updates.forEach(u => {
      const div = document.createElement('div');
      div.className = 'news-item';
      const title = u.description || u.title || 'Update';
      const time = new Date(u.created_at).toLocaleString();
      div.innerHTML = `
        <a href="${u.project ? u.project.website_url || '#' : '#'}" target="_blank" rel="noopener noreferrer">
          ${truncate(title, 110)}
        </a>
        <div class="muted" style="font-size:12px; margin-top:6px">${time}</div>
      `;
      newsList.appendChild(div);
    });
  } catch (err) {
    console.error(err);
    newsList.innerHTML = `<div class="muted">Не удалось загрузить новости.</div>`;
  }
}

/* ----- utilities ----- */
function formatNumber(n) {
  if (n >= 1000) return n.toLocaleString('en-US', {maximumFractionDigits:2});
  return n.toFixed(2);
}
function truncate(s, n) { return s.length > n ? s.slice(0,n-1) + '…' : s; }

/* ----- signup behavior (simple modal stub) ----- */
function setupSignupButtons() {
  const openBtns = [document.getElementById('signupMain'), document.getElementById('signupHeader')];
  openBtns.forEach(b => {
    if (!b) return;
    b.addEventListener('click', () => {
      alert('Sign up flow — здесь можно подключить форму регистрации.');
    });
  });
}

/* ----- theme toggle (simple, persists) ----- */
function setupThemeToggle() {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;
  const stored = localStorage.getItem('theme') || 'dark';
  applyTheme(stored);
  btn.addEventListener('click', () => {
    const t = document.documentElement.classList.contains('light') ? 'dark' : 'light';
    applyTheme(t);
  });
}
function applyTheme(theme) {
  if (theme === 'light') {
    document.documentElement.classList.add('light');
    document.documentElement.style.setProperty('--bg','#f7f9fb');
    document.documentElement.style.setProperty('--panel','#ffffff');
    document.documentElement.style.setProperty('--muted','#5b6a73');
    document.documentElement.style.setProperty('--accent','#1f7fff');
  } else {
    document.documentElement.classList.remove('light');
    document.documentElement.style.removeProperty('--bg');
    document.documentElement.style.removeProperty('--panel');
    document.documentElement.style.removeProperty('--muted');
    document.documentElement.style.removeProperty('--accent');
  }
  localStorage.setItem('theme', theme);
}
