/**
 * juego/controles.js
 *
 * Estado del personaje y controles: teclado, botones táctiles y luces.
 *
 * Parte de la Galería de (Lu)ser. Los archivos se cargan en orden desde
 * index.html y comparten las mismas variables globales.
 */
"use strict";

/* ---------- movimiento ---------- */
let x = Math.min(START_X, Math.max(160, viewport.clientWidth / 2)), dir = 1, target = null, still = 0, walkT = 0, holdT = 0, lastSpeed = 0, lastMove = 0;
const bodyImg = $("bodyImg"), legsImg = $("legs");
const dogEl = $("dog"), dogBody = $("dbody"), dogLegs = $("dlegs");
let dogX = START_X - 120, dogDir = 1, dogT = 0, dogGap = 80;
function setSrc(img, src) { if (img.getAttribute("src") !== src) img.src = src; }
const keys = { left: false, right: false };
function key(e, down) {
  if (down && !spModal.hidden) return; // con la tarjeta abierta no se camina
  const k = e.key.toLowerCase();
  if (k === "arrowleft" || k === "a") { keys.left = down; target = null; e.preventDefault(); }
  if (k === "arrowright" || k === "d") { keys.right = down; target = null; e.preventDefault(); }
  if (down) unlockAudio();
}
addEventListener("keydown", (e) => key(e, true));
addEventListener("keyup", (e) => key(e, false));
addEventListener("blur", () => { keys.left = keys.right = false; });

function hold(btn, side) {
  const on = (e) => { e.preventDefault(); keys[side] = true; target = null; unlockAudio(); };
  const off = () => { keys[side] = false; };
  btn.addEventListener("pointerdown", on);
  ["pointerup", "pointerleave", "pointercancel"].forEach((ev) => btn.addEventListener(ev, off));
}
hold($("goL"), "left"); hold($("goR"), "right");
$("toEnd").addEventListener("click", () => {
  unlockAudio();
  const atEnd = x > LAST + 400;
  target = atEnd ? START_X : FRIEND_X - 240;
});

/* luces */
const root = document.documentElement;
// la galería ignora el modo oscuro del dispositivo: siempre empieza de día
function isDark() { return root.getAttribute("data-lights") === "off"; }
function paintLightsBtn() { $("lights").textContent = isDark() ? "Encender luces" : "Apagar luces"; }
$("lights").addEventListener("click", () => { root.setAttribute("data-lights", isDark() ? "on" : "off"); paintLightsBtn(); });
root.setAttribute("data-lights", "on");
paintLightsBtn();
