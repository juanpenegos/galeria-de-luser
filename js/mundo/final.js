/**
 * mundo/final.js
 *
 * Lo que va al final y a lo largo de la calle: fotos de la última pared,
 * animales de la selva con sus frases, y el amigo verde con su perro.
 *
 * Parte de la Galería de (Lu)ser. Los archivos se cargan en orden desde
 * index.html y comparten las mismas variables globales.
 */
"use strict";

let cullT = 0;
const cullList = [];

/* ---------- fotos en la última pared (4 cuadros de distintos tamaños) ----------
   photo: pon aquí la foto de cada cuadro (vacío = imagen de ejemplo) */
const END_PHOTOS = [
  { photo: "img/foto-final-01.webp", frame: "pintado", dx: 350, size: 0.82, lift: 0, pos: "50% 50%" },
  { photo: "img/foto-final-02.webp", frame: "oro2", dx: 560, size: 0.95, lift: 0.1, pos: "50% 40%" },
  { photo: "img/foto-final-03.webp", frame: "azul", dx: 760, size: 0.78, lift: -0.08, pos: "50% 75%" },
  { photo: "img/foto-final-04.webp", frame: "oro2", dx: 950, size: 0.8, lift: 0.06, pos: "50% 45%" },
  { photo: "img/foto-final-05.webp", frame: "azul", dx: 1140, size: 0.9, lift: -0.02, pos: "50% 85%" },
  { photo: "img/foto-final-06.webp", frame: "oro", dx: 1370, size: 1.05, lift: 0.1, pos: "50% 35%" },
];
END_PHOTOS.forEach((p, n) => {
  const fr = FRAMES[p.frame], el = document.createElement("div");
  el.className = "wallpic"; el.style.left = (LAST + p.dx) + "px";
  el.style.setProperty("--fk", (Math.min(fr.fk, 1.25, 1.15 * fr.ar) * p.size).toFixed(3));
  el.style.setProperty("--far", fr.ar); el.style.setProperty("--lift", p.lift);
  ["--w0", "--w1", "--w2", "--w3"].forEach((v, k) => el.style.setProperty(v, fr.win[k]));
  el.innerHTML = '<div class="art"><img class="pic" alt="Foto de Luisa y Alejo ' + (n + 1) + '"><img class="frame" alt=""></div>';
  el.querySelector(".pic").src = p.photo || samplePhoto(30 + n * 17);
  if (p.pos) el.querySelector(".pic").style.objectPosition = p.pos;
  el.querySelector(".frame").src = fr.src;
  $("pieces").appendChild(el);
  cullList.push({ el, x0: LAST + p.dx - 400, x1: LAST + p.dx + 400, on: true });
});

/* ---------- animales de la selva: cada uno dice algo cuando te acercas ---------- */
const ANIMALS = [
  { src: "img/animal-perezoso.webp", i: 7, place: "colgado", h: 380, text: "Sin afán, Luisa. Lo bonito se disfruta despacito, <b>como tú.</b>" },
  { src: "img/animal-flamenco.webp", i: 15, place: "suelo", h: 430, text: "Aunque estés lejos, <b>aquí siempre va a haber un lugar para ti.</b>" },
  { src: "img/animal-guacamaya.webp", i: 31, place: "techo", h: 330, text: "Siempre vas a poder contar conmigo, <b>sin importar qué tan lejos o cerca estemos.</b>" },
  { src: "img/animal-tucan.webp", i: 39, place: "techo", h: 300, text: "El mundo es más bonito <b>desde que tú estás en él.</b>" },
  { src: "img/animal-jaguar.webp", i: 55, place: "suelo", h: 220, text: "Eres mucho más valiente <b>de lo que tú misma crees.</b>" },
  { src: "img/animal-colibri.webp", i: 63, place: "vuela", h: 190, text: "Vuelve pronto, <b>que las flores de aquí te extrañan.</b>" },
  { src: "img/animal-mono.webp", i: 71, place: "suelo", h: 250, text: "Cada cosa que haces me inspira a ser un mejor hombre <b>y a poder estar juntos algún día.</b>" },
  { src: "img/animal-flamenco-2.webp", i: 87, place: "suelo", h: 400, text: "Todavía tenemos una vida juntos esperándonos por delante <b>para recorrer todo el mundo.</b>" },
];
const npcs = ANIMALS.filter((a) => a.i < SONGS.length - 1).map((a, k) => {
  const x = FIRST + GAP * (a.i + 0.5);
  const el = document.createElement("div");
  el.className = "npc " + a.place + (k % 2 ? " y" : "");
  el.style.left = x + "px"; el.style.setProperty("--h", a.h);
  el.innerHTML = '<div class="shadow"></div><div class="bubble" role="status"></div><img alt="">';
  el.querySelector(".bubble").innerHTML = a.text;
  el.querySelector("img").src = a.src;
  $("pieces").appendChild(el);
  cullList.push({ el, x0: x - 500, x1: x + 500, on: true });
  return { el, x };
});
Array.from(housesEl.children).forEach((el) => { const l = parseFloat(el.style.left) || 0, w = parseFloat(el.style.width) || 0; if (el.classList.contains("house")) cullList.push({ el, x0: l - 200, x1: l + w + 200, on: true }); });
pieces.forEach((p) => cullList.push({ el: p.el, x0: p.x - 700, x1: p.x + 700, on: true }));
petals.forEach((p) => cullList.push({ el: p.el, x0: p.bx - 400, x1: p.bx + 400, on: true }));

/* el amigo verde y su perro: caminan de lado a lado al final de la calle */
const FRIEND = { s: ["img/amigo-lado-1.webp", "img/amigo-lado-2.webp"], b: ["img/amigo-espalda-1.webp", "img/amigo-espalda-2.webp"] };
const FDOG = { s: ["img/perro-pastor-lado-1.webp", "img/perro-pastor-lado-2.webp"], b: ["img/perro-pastor-espalda-1.webp", "img/perro-pastor-espalda-2.webp"] };
const friendEl = $("friend"), fdogEl = $("fdog"), friendImg = $("friendImg"), fdogImg = $("fdogImg");
let fT = 0, fdX = FRIEND_X - 140;
setSrc(friendImg, FRIEND.s[0]); setSrc(fdogImg, FDOG.s[0]);
friendEl.style.left = FRIEND_X + "px"; fdogEl.style.left = fdX + "px";
function updateFriend(dt) {
  const near = Math.abs(x - FRIEND_X) < 420;
  if (Math.abs(x - FRIEND_X) > 2500) return;
  fT += dt;
  let fx, fdir, walking;
  if (near) {
    // cuando llegas, se acerca a tu lado y se queda mirándote
    const cur = parseFloat(friendEl.style.left) || FRIEND_X;
    const spot = x + Math.min(250, viewport.clientWidth * 0.3), d = spot - cur;
    walking = Math.abs(d) > 4;
    fx = walking ? cur + Math.sign(d) * Math.min(Math.abs(d), 170 * dt) : cur;
    fdir = walking && Math.abs(d) > 30 ? Math.sign(d) : (x < fx ? -1 : 1);
  } else {
    // va y viene ±170px (sigue desde donde quedó)
    const cur = parseFloat(friendEl.style.left) || FRIEND_X;
    if (!friendEl.dataset.dir) friendEl.dataset.dir = "1";
    let dd = +friendEl.dataset.dir;
    if (cur > FRIEND_X + 170) dd = -1; else if (cur < FRIEND_X - 170) dd = 1;
    friendEl.dataset.dir = dd;
    fx = cur + dd * 75 * dt; fdir = dd; walking = true;
  }
  friendEl.style.left = fx + "px";
  friendEl.classList.toggle("left", fdir < 0);
  friendEl.classList.toggle("walking", walking);
  friendEl.classList.toggle("talk", near);
  const fr = walking ? Math.floor(fT / 0.16) % 2 : 0;
  setSrc(friendImg, FRIEND.s[fr]);
  // el perro lo sigue un poquito atrás
  const want = fx - fdir * 120 * friendSc;
  const g = want - fdX, dmove = Math.abs(g) > 4;
  if (dmove) fdX += Math.sign(g) * Math.min(Math.abs(g), 260 * dt);
  fdogEl.style.left = fdX + "px";
  fdogEl.classList.toggle("left", near ? x < fdX : (dmove ? g < 0 : fdir < 0));
  fdogEl.classList.toggle("walking", dmove);
  setSrc(fdogImg, FDOG.s[dmove ? Math.floor(fT / 0.12) % 2 : 0]);
}
