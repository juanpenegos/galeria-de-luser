/**
 * mundo/fauna.js
 *
 * Animalitos animados: pajaritos de día y mariposas-luciérnaga de noche.
 *
 * Parte de la Galería de (Lu)ser. Los archivos se cargan en orden desde
 * index.html y comparten las mismas variables globales.
 */
"use strict";

/* pajaritos: contorno marrón, cuerpo crema, gafitas rojas, como el perrito */
const BIRD_SVG = (body, belly) => `
<svg viewBox="0 0 120 90" aria-hidden="true">
  <g class="bob" stroke="#3b2516" stroke-width="4" stroke-linejoin="round" stroke-linecap="round">
    <path d="M14 46 L2 40 L6 52 L0 60 L18 56 Z" fill="${body}"/>
    <path class="wing-down" d="M50 50 C44 66 34 78 22 82 C40 84 56 74 64 56 Z" fill="${body}"/>
    <ellipse cx="54" cy="50" rx="38" ry="22" fill="${body}"/>
    <path d="M36 58 C46 70 70 70 80 58" fill="${belly}" stroke-width="3"/>
    <circle cx="86" cy="36" r="20" fill="${body}"/>
    <path d="M102 34 L118 40 L102 46 Z" fill="#f2a23a"/>
    <path d="M60 30 C70 34 84 34 92 26" fill="none" stroke-width="3"/>
    <g fill="#d8332a" stroke-width="3"><circle cx="82" cy="32" r="7"/><circle cx="97" cy="31" r="5.5"/></g>
    <path d="M89 32 L92 32" fill="none" stroke-width="3"/>
    <path class="wing-up" d="M48 42 C42 24 34 10 18 4 C26 22 36 38 62 44 Z" fill="${body}"/>
    <path d="M84 56 L82 64 M92 54 L92 62" fill="none" stroke-width="3"/>
  </g>
  <g fill="#fff" opacity=".6"><circle cx="79" cy="29" r="2"/><circle cx="95" cy="29" r="1.6"/></g>
</svg>`;
const BIRD_COLORS = [["#f2d79a", "#fbeccb"], ["#f6c6a5", "#fde3d0"], ["#cfe1b0", "#ecf5dc"], ["#f2d79a", "#fbeccb"], ["#c9dcef", "#e9f2fb"]];
const birds = [];
for (let b = 0; b < 6; b++) {
  const el = document.createElement("div");
  el.className = "bird";
  const [c1, c2] = BIRD_COLORS[b % BIRD_COLORS.length];
  el.innerHTML = BIRD_SVG(c1, c2);
  el.style.setProperty("--flap", (.26 + Math.random() * .14).toFixed(2) + "s");
  $("birds").appendChild(el);
  birds.push({ el, x: Math.random() * innerWidth, y: 0, dir: Math.random() < .5 ? 1 : -1, speed: 0, base: 0, phase: Math.random() * 6, size: 0 });
}
function resetBird(bd, fromEdge) {
  const w = viewport.clientWidth, h = viewport.clientHeight;
  bd.dir = Math.random() < .5 ? 1 : -1;
  bd.size = 40 + Math.random() * 30;
  bd.speed = 50 + Math.random() * 70;
  bd.base = h * (0.07 + Math.random() * 0.13);
  bd.x = fromEdge ? (bd.dir > 0 ? -bd.size - Math.random() * 400 : w + Math.random() * 400) : Math.random() * w;
  bd.el.style.setProperty("--bw", bd.size + "px");
}
birds.forEach((bd) => resetBird(bd, false));
let lastCam = null;
function updateBirds(dt, cam) {
  const w = viewport.clientWidth;
  const camDx = lastCam === null ? 0 : cam - lastCam; lastCam = cam;
  updateFlies(dt, camDx);
  for (const bd of birds) {
    bd.phase += dt;
    bd.x += bd.dir * bd.speed * dt - camDx * 0.35;   // se mueven un poco con la cámara (están lejos)
    const y = bd.base + Math.sin(bd.phase * 1.3) * 10;
    if (bd.x < -bd.size - 500 || bd.x > w + 500) resetBird(bd, true);
    bd.el.style.transform = `translate(${bd.x.toFixed(1)}px, ${y.toFixed(1)}px) scaleX(${bd.dir})`;
  }
}

/* mariposas brillantes: solo se ven con las luces apagadas */
const FLY_SVG = (w1, w2) => `
<svg viewBox="0 0 100 90" aria-hidden="true">
  <g stroke="#3b2516" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round">
    <g class="wl">
      <path d="M48 42 C36 14 12 6 6 18 C0 32 18 46 46 48 Z" fill="${w1}"/>
      <path d="M47 50 C30 52 14 64 20 76 C26 86 42 76 48 58 Z" fill="${w2}"/>
      <circle cx="24" cy="26" r="5" fill="${w2}" stroke-width="2.5"/>
    </g>
    <g class="wr">
      <path d="M52 42 C64 14 88 6 94 18 C100 32 82 46 54 48 Z" fill="${w1}"/>
      <path d="M53 50 C70 52 86 64 80 76 C74 86 58 76 52 58 Z" fill="${w2}"/>
      <circle cx="76" cy="26" r="5" fill="${w2}" stroke-width="2.5"/>
    </g>
    <ellipse cx="50" cy="54" rx="5" ry="20" fill="#f2d79a"/>
    <circle cx="50" cy="30" r="8" fill="#f2d79a"/>
    <path d="M47 23 C44 12 38 8 34 10 M53 23 C56 12 62 8 66 10" fill="none" stroke-width="2.5"/>
    <g fill="#d8332a" stroke-width="2.2"><circle cx="46" cy="30" r="3.6"/><circle cx="54.5" cy="30" r="3.6"/></g>
  </g>
  <g fill="#fff" opacity=".65"><circle cx="45" cy="29" r="1.1"/><circle cx="53.5" cy="29" r="1.1"/></g>
</svg>`;
const FLY_COLORS = [["#fff1a8", "#ffd36b", "#ffe680"], ["#bfe8ff", "#8fd0ff", "#9fe0ff"], ["#ffc9e6", "#ff9fd0", "#ffb3dd"], ["#d5f5b8", "#a8e88a", "#c4ff9a"], ["#e5d4ff", "#c4a8ff", "#d3bcff"]];
const flies = [];
for (let k = 0; k < 9; k++) {
  const el = document.createElement("div");
  el.className = "fly";
  const [w1, w2, gc] = FLY_COLORS[k % FLY_COLORS.length];
  el.innerHTML = FLY_SVG(w1, w2) + '<i class="spark"></i>';
  el.style.setProperty("--gc", gc);
  el.style.setProperty("--ft", (.16 + Math.random() * .1).toFixed(2) + "s");
  el.style.setProperty("--gl", (1.8 + Math.random() * 1.8).toFixed(2) + "s");
  el.style.setProperty("--gd", (-Math.random() * 3).toFixed(2) + "s");
  el.querySelector(".spark").style.setProperty("--sx", (Math.random() * 40 - 20).toFixed(0) + "px");
  el.querySelector(".spark").style.animationDelay = (-Math.random() * 1.6).toFixed(2) + "s";
  $("flies").appendChild(el);
  flies.push({ el, x: Math.random(), y: .15 + Math.random() * .55, vx: 0, vy: 0, ph: Math.random() * 9, sz: 30 + Math.random() * 22, dir: 1 });
}
flies.forEach((f) => f.el.style.setProperty("--fw", f.sz + "px"));
function updateFlies(dt, camDx) {
  if (root.getAttribute("data-lights") !== "off") return;
  const w = viewport.clientWidth, h = viewport.clientHeight;
  for (const f of flies) {
    f.ph += dt;
    // vuelo errático y suave, como de mariposa
    f.vx += (Math.sin(f.ph * 0.7 + f.sz) * 40 - f.vx) * dt * .8;
    f.vy += (Math.cos(f.ph * 1.1 + f.sz) * 26 - f.vy) * dt * .8;
    f.x += (f.vx * dt - camDx * 0.6) / w;
    f.y += f.vy * dt / h;
    if (f.x < -.08) f.x = 1.05; else if (f.x > 1.08) f.x = -.05;
    f.y = Math.max(.1, Math.min(.72, f.y));
    if (Math.abs(f.vx) > 4) f.dir = Math.sign(f.vx);
    const bob = Math.sin(f.ph * 5) * 4;
    f.el.style.transform = `translate(${(f.x * w).toFixed(1)}px, ${(f.y * h + bob).toFixed(1)}px) rotate(${(f.vx * .25).toFixed(1)}deg) scaleX(${f.dir})`;
  }
}
