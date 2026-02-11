let audioStarted = false;
let questStep = 0;
let questIntroText = "";
let typeInterval = null;

/* =====================
   AUDIO
===================== */
const vinylStart = document.getElementById("vinylStart");
const music      = document.getElementById("bgMusic");
const vinylStop  = document.getElementById("vinylStop");

vinylStart.volume = 0.8;
music.volume = 0.35;
vinylStop.volume = 0.8;

/* =====================
   AUDIO FADE
===================== */
function fadeAudio(audio, targetVolume = 0.08, duration = 2500) {
  const startVolume = audio.volume;
  const steps = 30;
  const stepTime = duration / steps;
  let step = 0;

  const fade = setInterval(() => {
    step++;
    audio.volume =
      startVolume + (targetVolume - startVolume) * (step / steps);

    if (step >= steps) clearInterval(fade);
  }, stepTime);
}

/* =====================
   MAIN RAIN (INTRO)
===================== */
let rainIntervalIntro = null;

function startMainRain() {
  stopMainRain();
  rainIntervalIntro = setInterval(createIntroRain, 280);
}

function stopMainRain() {
  if (rainIntervalIntro) {
    clearInterval(rainIntervalIntro);
    rainIntervalIntro = null;
  }
}

function createIntroRain() {
  const emojis = ["❤️", "🌸", "🐾", "🤘🏼", "😺", "🏍", "♎", "🎸", "🎶"];
  createRainItem(emojis);
}

/* =====================
   VALENTINE RAIN
===================== */
let rainIntervalFinal = null;

function startValentineRain() {
  if (rainIntervalFinal) clearInterval(rainIntervalFinal);
  rainIntervalFinal = setInterval(() => {
    createRainItem(["❤️", "🌸"]);
  }, 280);
}

function createRainItem(pool) {
  const item = document.createElement("div");
  item.className = "fall";
  item.textContent = pool[Math.floor(Math.random() * pool.length)];

  item.style.left = Math.random() * 100 + "vw";
  item.style.animationDuration = 3 + Math.random() * 6 + "s";
  item.style.fontSize = 18 + Math.random() * 22 + "px";
  item.style.opacity = 0.6 + Math.random() * 0.4;

  document.body.appendChild(item);
  item.addEventListener("animationend", () => item.remove());
}

/* =====================
   DIALOG DATA
===================== */
const dialog = [
  { text: "Hey du… ja genau du 👀", buttons: [{ label: "Okay?", next: 1 }] },
  { text: "Wie ich sehe, hat der QR-Code funktioniert 😏", buttons: [{ label: "Sehr gut!", next: 2 }] },
  {
    text: "Ich wette, du fragst dich, was hier gerade passiert.",
    buttons: [
      { label: "Ja", next: "soft" },
      { label: "Nein", next: "tease" }
    ]
  },
  { text: "Gut. Bist du bereit?.", buttons: [{ label: "Ich bin bereit ❤️", next: "gift" }] }
];

const dialogEl = document.getElementById("dialog");
const buttonsEl = document.getElementById("buttons");

/* =====================
   TYPEWRITER
===================== */
function typeText(text, el) {
  if (typeInterval) clearInterval(typeInterval);
  el.textContent = "";
  let i = 0;

  typeInterval = setInterval(() => {
    el.textContent += text[i++];
    if (i >= text.length) clearInterval(typeInterval);
  }, 35);
}

/* =====================
   DIALOG FLOW
===================== */
function renderStep(index) {
  if (index === 0) startMainRain();

  const step = dialog[index];
  buttonsEl.innerHTML = "";
  typeText(step.text, dialogEl);

  step.buttons.forEach(b => {
    const btn = document.createElement("button");
    btn.textContent = b.label;

    btn.onclick = () => {
      if (!audioStarted) {
        audioStarted = true;
        vinylStart.play().catch(() => {});
        setTimeout(() => music.play().catch(() => {}), 700);
      }

      if (b.next === "soft") return startMiniQuest("soft");
      if (b.next === "tease") return startMiniQuest("tease");
      if (b.next === "gift") return startGift();

      renderStep(b.next);
    };

    buttonsEl.appendChild(btn);
  });
}

/* =====================
   MINI QUEST
===================== */
function startMiniQuest(mode) {
  questStep = 0;
  questIntroText =
    mode === "soft"
      ? "Ich will dich nämlich was fragen 😌 Hast du kurz Zeit?"
      : "Ach ja? 😏 Dann lass uns das testen.";
  showQuestPopup();
}

function showQuestPopup() {
  const box = document.createElement("div");
  box.className = "quest";
  box.innerHTML = `
    <p>${questIntroText}</p>
    <button>Okay 😌</button>
  `;
  box.querySelector("button").onclick = () => {
    box.remove();
    renderStep(3);
  };
  document.body.appendChild(box);
}

/* =====================
   GIFT
===================== */
function startGift() {
  document.getElementById("game").remove();

  const box = document.createElement("div");
  box.className = "gift";

  let clicks = 0;
  const gift = document.createElement("div");
  gift.className = "gift-box";
  gift.textContent = "🎁";

  gift.onclick = () => {
    clicks++;
    gift.classList.add("shake");
    if (clicks >= 5) showFinalScreen();
  };

  box.appendChild(gift);
  document.body.appendChild(box);
}

/* =====================
   FINAL
===================== */
function showFinalScreen() {
  stopMainRain();
  fadeAudio(music, 0.08, 2500);

  const app = document.getElementById("app");
  app.innerHTML = `
    <div class="final">
      <h1 class="pulse">Happy Valentinstag ❤️</h1>
      <p>Liebe Hannah, möchtest du den Tag mit mir verbringen?</p>
    </div>
  `;

  startValentineRain();
}

/* =====================
   START
===================== */
renderStep(0);
