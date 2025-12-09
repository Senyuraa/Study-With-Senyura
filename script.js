// -------- TIMER STATE --------
let settings = {
  pomodoro: 30,
  short: 5,
  long: 15,
  theme: "animescenary",
  showSpotify: true,
  notify: false,
};

let currentMode = "pomodoro";
let timeLeft = settings.pomodoro * 60;
let timerInterval = null;
let running = false;
let customBg = null; // holds uploaded image url

// DOM
const timerEl = document.getElementById("timer");
const startBtn = document.getElementById("start");

// ---------- TIMER FUNCTIONS ----------
function formatTime(sec) {
  const m = String(Math.floor(sec / 60)).padStart(2, "0");
  const s = String(sec % 60).padStart(2, "0");
  return `${m}:${s}`;
}

function renderTimer() {
  timerEl.textContent = formatTime(timeLeft);
}
renderTimer();

function startTimer() {
  if (running) return;
  running = true;
  startBtn.textContent = "pause";

  timerInterval = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      renderTimer();
    } else {
      pauseTimer();
    }
  }, 1000);
}

function pauseTimer() {
  running = false;
  startBtn.textContent = "start";
  clearInterval(timerInterval);
}

function resetTimerToCurrentMode() {
  if (currentMode === "pomodoro") timeLeft = settings.pomodoro * 60;
  if (currentMode === "short") timeLeft = settings.short * 60;
  if (currentMode === "long") timeLeft = settings.long * 60;
  renderTimer();
}

startBtn.onclick = () => running ? pauseTimer() : startTimer();

document.getElementById("reset").onclick = () => {
  pauseTimer();
  resetTimerToCurrentMode();
};

// Mode buttons
document.querySelectorAll(".mode").forEach((btn) => {
  btn.onclick = () => {
    document.querySelector(".mode.active")?.classList.remove("active");
    btn.classList.add("active");

    currentMode = btn.dataset.mode;
    resetTimerToCurrentMode();
  };
});

// ---------- SETTINGS ----------
const modal = document.getElementById("settings-modal");
const overlay = document.getElementById("settings-overlay");

document.getElementById("settings-btn").onclick = openSettings;
document.getElementById("close-settings").onclick = closeSettings;
overlay.onclick = closeSettings;

function openSettings() {
  document.getElementById("set-pomo").value = settings.pomodoro;
  document.getElementById("set-short").value = settings.short;
  document.getElementById("set-long").value = settings.long;

  document.getElementById("notify-toggle").checked = settings.notify;
  document.getElementById("show-spotify").checked = settings.showSpotify;
  document.getElementById("theme-select").value = settings.theme;

  overlay.style.display = "block";
  modal.style.opacity = "1";
  modal.style.transform = "scale(1)";
  modal.style.pointerEvents = "auto";
}

function closeSettings() {
  modal.style.opacity = "0";
  modal.style.transform = "scale(0.7)";
  modal.style.pointerEvents = "none";
  overlay.style.display = "none";
}

// Tabs
document.querySelectorAll(".tab").forEach((tab) => {
  tab.onclick = () => {
    document.querySelector(".tab.active")?.classList.remove("active");
    tab.classList.add("active");

    document.querySelector(".tab-content.active")?.classList.remove("active");
    document.getElementById(tab.dataset.tab).classList.add("active");
  };
});

// Save settings
document.getElementById("save-settings").onclick = () => {
  settings.pomodoro = +document.getElementById("set-pomo").value;
  settings.short = +document.getElementById("set-short").value;
  settings.long = +document.getElementById("set-long").value;

  settings.notify = document.getElementById("notify-toggle").checked;
  settings.showSpotify = document.getElementById("show-spotify").checked;

  settings.theme = document.getElementById("theme-select").value;

  if (!customBg) applyTheme(settings.theme);
  document.getElementById("spotify-box").style.display =
    settings.showSpotify ? "block" : "none";

  if (!running) resetTimerToCurrentMode();
  closeSettings();
};

// Reset All
document.getElementById("reset-all").onclick = () => {
  settings = {
    pomodoro: 30,
    short: 5,
    long: 15,
    theme: "animescenary",
    showSpotify: true,
    notify: false,
  };

  customBg = null;
  applyTheme("animescenary");

  document.getElementById("spotify-box").style.display = "block";

  currentMode = "pomodoro";
  document.querySelectorAll(".mode").forEach((b) => b.classList.remove("active"));
  document.querySelector('.mode[data-mode="pomodoro"]').classList.add("active");

  resetTimerToCurrentMode();
};

// ---------- THEMES (local files) ----------
const themes = {
  animescenary: "animescenary.png",
  chinaskyline: "chinaskyline.jpg",
  nycskyline: "nycskyline.jpg",
  shinchan: "shinchan.jpg",
  street: "street.webp"
};

// THEME APPLY FUNCTION
function applyTheme(key) {
  customBg = null; // disable custom BG when switching theme
  const img = themes[key] || themes["animescenary"];
  document.getElementById("bg").style.backgroundImage = `url("${img}")`;
}

// Load default
applyTheme("animescenary");

// ---------- CUSTOM BG UPLOAD ----------
document.getElementById("bg-upload").onchange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  customBg = URL.createObjectURL(file);
  document.getElementById("bg").style.backgroundImage = `url("${customBg}")`;
};

// ---------- SPOTIFY ----------
document.getElementById("load-spotify").onclick = () => {
  const url = document.getElementById("spotify-link").value.trim();
  if (!url.includes("spotify.com")) return alert("Invalid playlist");

  document.getElementById("spotify-iframe").src =
    url.replace("open.spotify.com", "open.spotify.com/embed");
};

// Live toggle
document.getElementById("show-spotify").onchange = function () {
  document.getElementById("spotify-box").style.display =
    this.checked ? "block" : "none";
};

// ---------- DRAG SPOTIFY ----------
function dragElement(el) {
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

  el.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDrag;
    document.onmousemove = drag;
  }

  function drag(e) {
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    el.style.top = el.offsetTop - pos2 + "px";
    el.style.left = el.offsetLeft - pos1 + "px";
  }

  function closeDrag() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
dragElement(document.getElementById("spotify-box"));

// ---------- FULLSCREEN ----------
document.getElementById("fullscreen-btn").onclick = () =>
  !document.fullscreenElement
    ? document.documentElement.requestFullscreen()
    : document.exitFullscreen();

// THEME SELECT LIVE CHANGE
document.getElementById("theme-select").addEventListener("change", () => {
  settings.theme = document.getElementById("theme-select").value;
  applyTheme(settings.theme);
});
