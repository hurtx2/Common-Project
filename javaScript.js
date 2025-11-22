/* === ОБЩИЕ НАСТРОЙКИ === */
const userTarget = 294625965;
const COUNTER_DURATION = 2400;

/* === ПРИ ЗАГРУЗКЕ === */
document.addEventListener("DOMContentLoaded", () => {
  animateCounter("userCounter", userTarget, COUNTER_DURATION);
  setupSignupButtons();
  setupThemeToggle();
  createToastContainer();
});

/* === АНИМАЦИЯ ЧИСЛА === */
function animateCounter(id, target, duration) {
  const el = document.getElementById(id);
  const startTime = performance.now();
  const start = 0;

  function update(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = easeOutCubic(progress);
    const value = Math.floor(start + (target - start) * eased);
    el.textContent = value.toLocaleString("en-US");
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

function easeOutCubic(t) {
  return (--t) * t * t + 1;
}

/* === TOAST === */
function createToastContainer() {
  const div = document.createElement("div");
  div.id = "toastContainer";
  div.style.position = "fixed";
  div.style.bottom = "20px";
  div.style.right = "20px";
  div.style.zIndex = "9999";
  document.body.appendChild(div);
}

function showToast(msg, duration = 3000) {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.textContent = msg;
  toast.style.background = "rgba(0,0,0,0.8)";
  toast.style.padding = "10px 16px";
  toast.style.color = "#fff";
  toast.style.borderRadius = "8px";
  toast.style.marginTop = "8px";
  toast.style.opacity = "0";
  toast.style.transition = "opacity .3s, transform .3s";
  toast.style.transform = "translateY(10px)";

  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateY(0)";
  });

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/* === SIGNUP/SIGNIN === */
function setupSignupButtons() {
  document.getElementById("signupHeader").onclick =
    () => showToast("Неть,<:");

  document.getElementById("signupMain").onclick =
    () => showToast("Неть,<:");

  document.getElementById("signinHeader").onclick =
    () => showToast("Вы кто такие, я вас не звал...");
}

/* === ТЕМНАЯ ТЕМА === */
function setupThemeToggle() {
  const btn = document.getElementById("themeToggle");
  btn.addEventListener("click", () => {
    document.body.classList.toggle("light-theme");
  });
}
