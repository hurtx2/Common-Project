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

function easeOutCubic(t) {
  return (--t) * t * t + 1;
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
