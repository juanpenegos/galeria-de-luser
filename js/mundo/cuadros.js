/**
 * mundo/cuadros.js
 *
 * Construye los cuadros de las canciones (foto, marco y placa de azulejo)
 * y el mapa de la sala.
 *
 * Parte de la Galería de (Lu)ser. Los archivos se cargan en orden desde
 * index.html y comparten las mismas variables globales.
 */
"use strict";

/* ---------- imágenes de ejemplo (dibujadas en un canvas) ---------- */
const photoCache = {};
function samplePhoto(i) {
  i = i % 24;
  if (photoCache[i]) return photoCache[i];
  const c = document.createElement("canvas"); c.width = c.height = 480;
  const g = c.getContext("2d");
  const palettes = [
    ["#f6c28b", "#e5734a", "#5a2a3b", "#ffe9b0"], ["#9ec5d6", "#4a6fa5", "#1c2541", "#f5d76e"],
    ["#a8dadc", "#457b9d", "#1d3557", "#f1faee"], ["#2b2d42", "#5c4d7d", "#120f1f", "#f8c26a"],
    ["#b7d3a8", "#5f8a54", "#22351f", "#efe6c7"], ["#f2d0a4", "#c96f53", "#3b2f2f", "#fff1d6"],
    ["#c9d6df", "#7d8ea0", "#2e3a46", "#e9eef2"], ["#ffb4a2", "#b5838d", "#3d2c3e", "#ffe5d9"],
  ];
  const p = palettes[i % palettes.length];
  const sky = g.createLinearGradient(0, 0, 0, 480); sky.addColorStop(0, p[0]); sky.addColorStop(1, p[1]);
  g.fillStyle = sky; g.fillRect(0, 0, 480, 480);
  g.fillStyle = p[3]; g.globalAlpha = .9; g.beginPath(); g.arc(150 + (i * 70) % 220, 170 - (i % 3) * 30, 54 + (i % 4) * 8, 0, Math.PI * 2); g.fill();
  g.globalAlpha = 1;
  for (let l = 0; l < 3; l++) {
    g.fillStyle = l === 2 ? p[2] : `rgba(0,0,0,${0.12 + l * 0.12})`;
    g.beginPath(); g.moveTo(0, 480);
    for (let x = 0; x <= 480; x += 20) g.lineTo(x, 300 + l * 50 + Math.sin(x / (40 + l * 25) + i * 1.7 + l) * (34 - l * 8));
    g.lineTo(480, 480); g.closePath(); g.fill();
  }
  g.fillStyle = "rgba(255,255,255,.06)";
  for (let k = 0; k < 2500; k++) g.fillRect(Math.random() * 480, Math.random() * 480, 1, 1);
  return (photoCache[i] = c.toDataURL("image/jpeg", .82));
}

/* ---------- construir los cuadros ---------- */
const pieces = SONGS.map((s, i) => {
  const x = FIRST + i * GAP;
  const el = document.createElement("div");
  el.className = "piece"; el.style.left = x + "px";
  const num = String(i + 1).padStart(2, "0");
  el.innerHTML = `
    <div class="spot"></div>
    <div class="arch"></div><div class="garland"></div><div class="balcony"></div><div class="flag" title="Colombia"></div>
    <button class="art" type="button" aria-label="Caminar hasta ${s.title}"><img class="pic" alt="${s.title}"><img class="frame" alt=""></button>
    <div class="notes" aria-hidden="true"><span>♪</span><span>♫</span><span>♪</span></div>
    <div class="plaque">
      <div class="num"><span>Nº ${num}</span><span>${s.year || ""}</span></div>
      <h3></h3><div class="artist"></div>
      <p class="desc"></p>
      <div class="links"></div>
      <div class="state"><i></i><span>Sonando</span></div>
    </div>`;
  el.querySelector("h3").textContent = s.title;
  el.querySelector(".artist").textContent = s.artist;
  el.querySelector(".desc").textContent = s.desc;
  const pic = el.querySelector(".pic");
  pic.onerror = () => { pic.onerror = null; pic.src = samplePhoto(i); }; // si la portada falla, se usa el dibujo de ejemplo
  pic.src = s.photo || samplePhoto(i);
  const fr = FRAMES[FRAME_ORDER[i % FRAME_ORDER.length]];
  el.querySelector(".frame").src = fr.src;
  // tamaño contenido: ningún marco pasa de 1,25× el ancho ni 1,15× el alto de la foto base
  el.style.setProperty("--fk", Math.min(fr.fk, 1.25, 1.15 * fr.ar).toFixed(3)); el.style.setProperty("--far", fr.ar);
  ["--w0", "--w1", "--w2", "--w3"].forEach((v, n) => el.style.setProperty(v, fr.win[n]));
  const links = el.querySelector(".links");
  const all = (s.youtube ? [{ label: "Ver en YouTube", url: s.youtube, yt: true }] : []).concat(s.links || []);
  all.forEach((l) => {
    const a = document.createElement("a"); a.href = l.url; a.target = "_blank"; a.rel = "noopener";
    a.textContent = l.label; if (l.yt) a.className = "yt"; links.appendChild(a);
  });
  el.querySelector(".state span").textContent = "Sonando";
  el.querySelector(".art").addEventListener("click", () => { target = x; unlockAudio(); });
  $("pieces").appendChild(el);
  return { x, el, song: s, i };
});

/* mapa de la sala */
const map = $("map");
if (SONGS.length > 30) map.classList.add("dense");
pieces.forEach((p) => {
  const d = document.createElement("button");
  d.className = "dot"; d.type = "button"; d.style.left = (p.x / END * 100) + "%";
  d.setAttribute("aria-label", "Ir a " + p.song.title);
  d.addEventListener("click", () => { target = p.x; unlockAudio(); });
  map.appendChild(d); p.dot = d;
});
