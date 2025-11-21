// app.js
const userTarget = 294625965; // цільове число
const COUNTER_DURATION = 2400; // ms
const MARKET_REFRESH_INTERVAL = 60 * 1000; // 1 хвилина

document.addEventListener('DOMContentLoaded', () => {
  animateCounter('userCounter', userTarget, COUNTER_DURATION);
  loadMarketData();
  loadNews();
  setupSignupButtons();
  setupThemeToggle();
  createToastContainer();

  // автооновлення ринку
  setInterval(loadMarketData, MARKET_REFRESH_INTERVAL);
});

/* ---------- АНІМОВАНИЙ ЛІЧИЛЬНИК ---------- */
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
function easeOutCubic(t) {
  return (--t) * t * t + 1;
}

/* ---------- ЗАВАНТАЖЕННЯ РИНКОВИХ ДАНИХ ---------- */
async function loadMarketData() {
  const marketList = document.getElementById('marketList');
  if (!marketList) return;
  showLoading(marketList);

  try {
    const resp = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=6&page=1&sparkline=false&price_change_percentage=24h'
    );
    if (!resp.ok) throw new Error('Помилка запиту CoinGecko');
    const data = await resp.json();

    marketList.innerHTML = '';
    data.forEach((coin) => {
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
            ${coin.price_change_percentage_24h?.toFixed(2) ?? '0.00'}%
          </div>
        </div>
      `;
      marketList.appendChild(li);
    });
    showToast('✅ Дані ринку оновлено');
  } catch (err) {
    console.error(err);
    marketList.innerHTML = `<li class="muted">⚠️ Не вдалося завантажити дані ринку.</li>`;
    showToast('❌ Помилка при отриманні даних ринку');
  }
}

/* ---------- НОВИНИ З COINGECKO ---------- */
async function loadNews() {
  const newsList = document.getElementById('newsList');
  if (!newsList) return;
  showLoading(newsList);

  try {
    const resp = await fetch('https://api.coingecko.com/api/v3/status_updates?per_page=5&page=1');
    if (!resp.ok) throw new Error('Помилка запиту новин');
    const json = await resp.json();
    const updates = json.status_updates || [];
    newsList.innerHTML = '';

    if (updates.length === 0) {
      newsList.innerHTML = `<div class="muted">Новин поки що немає.</div>`;
      return;
    }

    updates.forEach((u) => {
      const div = document.createElement('div');
      div.className = 'news-item';
      const title = u.description || u.title || 'Update';
      const time = new Date(u.created_at).toLocaleString('uk-UA');
      div.innerHTML = `
        <a href="${u.project?.website_url || '#'}" target="_blank" rel="noopener noreferrer">
          ${truncate(title, 110)}
        </a>
        <div class="muted" style="font-size:12px; margin-top:6px">${time}</div>
      `;
      newsList.appendChild(div);
    });
  } catch (err) {
    console.error(err);
    newsList.innerHTML = `<div class="muted">❌ Не вдалося завантажити новини.</div>`;
    showToast('⚠️ Помилка при завантаженні новин');
  }
}
/* ---------- ДОПОМІЖНІ ФУНКЦІЇ ---------- */
function formatNumber(n) {
  if (n >= 1000) return n.toLocaleString('en-US', { maximumFractionDigits: 2 });
  return n.toFixed(2);
}
function truncate(s, n) {
  return s.length > n ? s.slice(0, n - 1) + '…' : s;
}

function showLoading(container) {
  container.innerHTML = `<div class="muted" style="padding:8px;text-align:center;">⏳ Завантаження...</div>`;
}

/* ---------- SIGNUP / REGISTER BUTTONS ---------- */
function setupSignupButtons() {
  const openBtns = [document.getElementById('signupMain'), document.getElementById('signupHeader')];
  openBtns.forEach((b) => {
    if (!b) return;
    b.addEventListener('click', () => {
      showToast('📝 Форма реєстрації — тут можна підключити реальний бекенд.');
    });
  });
}

/* ---------- ПЕРЕМИКАЧ ТЕМИ ---------- */
function setupThemeToggle() {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;
  const stored = localStorage.getItem('theme') || 'dark';
  applyTheme(stored);
  btn.addEventListener('click', () => {
    const next = document.documentElement.classList.contains('light') ? 'dark' : 'light';
    applyTheme(next);
    showToast(next === 'light' ? '🌞 Світла тема' : '🌙 Темна тема');
  });
}

function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === 'light') {
    root.classList.add('light');
    root.style.setProperty('--bg', '#f7f9fb');
    root.style.setProperty('--panel', '#ffffff');
    root.style.setProperty('--muted', '#5b6a73');
    root.style.setProperty('--accent', '#1f7fff');
  } else {
    root.classList.remove('light');
    root.style.removeProperty('--bg');
    root.style.removeProperty('--panel');
    root.style.removeProperty('--muted');
    root.style.removeProperty('--accent');
  }
  localStorage.setItem('theme', theme);
}

/* ---------- TOAST ПОВІДОМЛЕННЯ ---------- */
function createToastContainer() {
  const div = document.createElement('div');
  div.id = 'toastContainer';
  div.style.position = 'fixed';
  div.style.bottom = '20px';
  div.style.right = '20px';
  div.style.zIndex = '9999';
  document.body.appendChild(div);
}

function showToast(msg, duration = 3000) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.textContent = msg;
  toast.style.background = 'rgba(0,0,0,0.7)';
  toast.style.color = '#fff';
  toast.style.padding = '10px 16px';
  toast.style.borderRadius = '8px';
  toast.style.marginTop = '8px';
  toast.style.fontSize = '14px';
  toast.style.opacity = '0';
  toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  toast.style.transform = 'translateY(10px)';

  container.appendChild(toast);
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

