/**
 * mundo/calle.js
 *
 * Construye la calle: casas, fachadas, jardín, montón de flores, la señora de las
 * frutas, el heladero y las montañas del fondo.
 *
 * Parte de la Galería de (Lu)ser. Los archivos se cargan en orden desde
 * index.html y comparten las mismas variables globales.
 */
"use strict";

/* textura de revoque (pared encalada), sutil */
(function () {
  const c = document.createElement("canvas"); c.width = c.height = 360;
  const g = c.getContext("2d");
  for (let k = 0; k < 60; k++) {
    const x = Math.random() * 360, y = Math.random() * 360, r = 20 + Math.random() * 70;
    const gr = g.createRadialGradient(x, y, 0, x, y, r);
    const dark = Math.random() < .5;
    gr.addColorStop(0, dark ? "rgba(60,40,20,.05)" : "rgba(255,255,255,.07)"); gr.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2);
  }
  for (let k = 0; k < 9000; k++) {
    g.fillStyle = Math.random() < .5 ? `rgba(0,0,0,${Math.random() * .07})` : `rgba(255,255,255,${Math.random() * .09})`;
    g.fillRect(Math.random() * 360, Math.random() * 360, 1 + Math.random(), 1 + Math.random());
  }
  for (let k = 0; k < 18; k++) { // grietas finas
    g.strokeStyle = "rgba(60,40,20,.08)"; g.lineWidth = .7; g.beginPath();
    let x = Math.random() * 360, y = Math.random() * 360; g.moveTo(x, y);
    for (let j = 0; j < 6; j++) { x += (Math.random() - .5) * 18; y += Math.random() * 10; g.lineTo(x, y); }
    g.stroke();
  }
  document.documentElement.style.setProperty("--brush", `url(${c.toDataURL("image/png")})`);
})();

/* ---------- calle colombiana: casas, árboles y montañas ---------- */
/* Fachadas inspiradas en tus fotos:
   "col"  = Colombia (pared encalada, zócalo de color, puerta o ventana de madera pintada)
   "azu"  = azulejos azules con puerta amarilla de arco
   "mal"  = Málaga: fachada estampada con ventana de piedra
   "ten"  = Tenerife / Cali: revoque de color con ventana de madera */
const FACADE = {"door1": "img/fachada-door1.jpg", "win1": "img/fachada-win1.jpg", "door2": "img/fachada-door2.jpg", "win3": "img/fachada-win3.jpg", "bay4": "img/fachada-bay4.jpg", "azulejo": "img/fachada-azulejo.jpg", "malaga": "img/fachada-malaga.jpg", "flw": "img/fachada-flw.png"};
const FACADE_SIZE = {"door1": [228, 408], "win1": [199, 260], "door2": [400, 684], "win3": [240, 317], "bay4": [105, 178], "flw": [72, 68]};
const TYPES = ["col", "ven", "azu", "ven", "mal", "col", "ven", "ven", "azu", "col", "mal", "ven"];
/* ventanas y puertas de colores: cada casa toma el color de la pared de su foto */
const VENTANAS = [{"src": "img/ventana-01.webp", "w": 206, "h": 214, "wall": "#cae3f9"}, {"src": "img/ventana-02.webp", "w": 218, "h": 310, "wall": "#fd3b1f", "door": 1}, {"src": "img/ventana-03.webp", "w": 203, "h": 305, "wall": "#f8883e"}, {"src": "img/ventana-04.webp", "w": 218, "h": 262, "wall": "#d9423a"}, {"src": "img/ventana-05.webp", "w": 206, "h": 303, "wall": "#f48899"}, {"src": "img/ventana-06.webp", "w": 218, "h": 305, "wall": "#3ca0f5"}, {"src": "img/ventana-07.webp", "w": 215, "h": 302, "wall": "#e53588"}, {"src": "img/ventana-08.webp", "w": 218, "h": 326, "wall": "#fc9c71", "door": 1}, {"src": "img/ventana-09.webp", "w": 206, "h": 266, "wall": "#f5dd59"}, {"src": "img/ventana-10.webp", "w": 168, "h": 290, "wall": "#fd8a3b"}, {"src": "img/ventana-11.webp", "w": 179, "h": 317, "wall": "#e9e9ea", "door": 1}, {"src": "img/ventana-12.webp", "w": 218, "h": 262, "wall": "#239b53"}, {"src": "img/ventana-13.webp", "w": 164, "h": 248, "wall": "#e83b6a"}, {"src": "img/ventana-14.webp", "w": 218, "h": 301, "wall": "#fdd003", "door": 1}, {"src": "img/ventana-15.webp", "w": 215, "h": 313, "wall": "#d8953a"}, {"src": "img/ventana-16.webp", "w": 218, "h": 325, "wall": "#f0cf3c"}];
VENTANAS.splice(0, 1); // la ventana de contraventanas verdes sobre pared celeste ya no se usa
let venN = 0;
const PLASTER = { col: ["#f3f0e6", "#f6f1e2", "#efe9dc"], ten: ["#e0865a", "#e6b043", "#dca660", "#e2d7ae", "#e9a07a", "#7fb0c9"] };
const ZOCALO_COL = ["#2f9e44", "#1f4fbf", "#b8322a", "#2f9e44", "#e0a21b", "#1b7f8c"];
const edges = [0, 620];
for (let i = 0; i < SONGS.length; i++) edges.push(FIRST + i * GAP + (i === SONGS.length - 1 ? 400 : GAP / 2));
edges.push(END);
const housesEl = $("houses");
/* Puertas y ventanas: todas las puertas miden lo mismo y las ventanas se centran a la altura
   del cuadro. Se colocan a la izquierda del marco, a una distancia fija de su borde (ver .lft en el CSS). */
const DOOR_H = 600, WIN_H = 400;
function opening(el, isDoor) {
  el.classList.add("lft", isDoor ? "door" : "win");
  el.style.setProperty("--h", isDoor ? DOOR_H : WIN_H);
  el.style.removeProperty("--b"); el.style.left = "";
}
function fx(house, key, leftPx, heightK, bottomK) {
  const im = document.createElement("img");
  const [w, h] = FACADE_SIZE[key];
  im.className = "fx"; im.src = FACADE[key]; im.alt = "";
  im.style.left = leftPx + "px";
  im.style.setProperty("--h", heightK); im.style.setProperty("--b", bottomK || 0); im.style.aspectRatio = w + " / " + h;
  house.appendChild(im);
  return im;
}
/* jardín: imágenes de Alejo repartidas por la calle */
const DECO = {"bush": "img/jardin-bush.webp", "meadow": "img/jardin-meadow.webp", "painted": "img/jardin-painted.webp", "colibri": "img/jardin-colibri.webp", "loros": "img/jardin-loros.webp", "tucan": "img/jardin-tucan.webp", "bf0": "img/jardin-bf0.webp", "bf2": "img/jardin-bf2.webp", "bf3": "img/jardin-bf3.webp", "bf5": "img/jardin-bf5.webp", "bf6": "img/jardin-bf6.webp"};
const DECO_SIZE = {"bush": [420, 274], "meadow": [700, 242], "painted": [700, 351], "colibri": [200, 157], "loros": [520, 326], "tucan": [420, 380], "bf0": [147, 127], "bf2": [79, 99], "bf3": [160, 147], "bf5": [160, 123], "bf6": [160, 131]};
Object.assign(DECO, {"glicina": "img/jardin-glicina.webp", "hiedra": "img/jardin-hiedra.webp", "musgo": "img/jardin-musgo.webp"});
Object.assign(DECO_SIZE, {"glicina": [420, 437], "hiedra": [300, 412], "musgo": [360, 482]});
Object.assign(DECO, {"pasto": "img/jardin-pasto.webp", "rocas": "img/jardin-rocas.webp", "rojo": "img/jardin-rojo.webp"});
Object.assign(DECO_SIZE, {"pasto": [460, 442], "rocas": [420, 348], "rojo": [520, 196]});
const BUTTERFLIES = ["bf0", "bf2", "bf3", "bf5", "bf6"];
function decoImg(house, key, cls, heightK) {
  const im = document.createElement("img");
  im.src = DECO[key]; im.alt = ""; im.className = "deco " + cls;
  const [w, hh] = DECO_SIZE[key];
  im.style.height = `calc(${heightK} * var(--sc, .5) * 1px)`;
  im.style.aspectRatio = w + " / " + hh;
  house.appendChild(im);
  return im;
}
function decorate(d, h, type, rel) {
  // 1) cantero de flores al pie de la pared, en la esquina entre casas
  const beds = [["bush", 290], ["pasto", 330], ["meadow", 200], ["rocas", 260], ["painted", 240], ["rojo", 190]];
  const branchHere = h % 7 === 6 && type !== "azu";
  const [bed, bh] = branchHere ? beds[0] : beds[h % beds.length];  // la rama siempre nace del arbusto
  const b = decoImg(d, bed, "bed" + (bed === "meadow" || bed === "painted" ? " fade" : ""), bh); b.style.left = "0px";
  // 2) mariposas revoloteando sobre el cantero
  for (let k = 0; k < 2; k++) {
    const key = BUTTERFLIES[(h * 2 + k) % BUTTERFLIES.length];
    const wrap = document.createElement("div");
    wrap.className = "bfly";
    wrap.style.left = (-60 + k * 90 + Math.random() * 30) + "px";
    wrap.style.bottom = `calc(${(bh * (0.9 + k * 0.5)).toFixed(0)} * var(--sc, .5) * 1px)`;
    wrap.style.setProperty("--dx", (40 + Math.random() * 50) * (k ? -1 : 1) + "px");
    wrap.style.setProperty("--dy", (20 + Math.random() * 30) + "px");
    wrap.style.setProperty("--d", (6 + Math.random() * 5).toFixed(1) + "s");
    wrap.style.setProperty("--f", (.14 + Math.random() * .12).toFixed(2) + "s");
    wrap.style.animationDelay = (-Math.random() * 8).toFixed(1) + "s";
    const im = document.createElement("img"); im.src = DECO[key]; im.alt = "";
    im.style.height = `calc(${46 + Math.random() * 18} * var(--sc, .5) * 1px)`;
    if (Math.random() < .5) im.style.scale = "-1 1";
    wrap.appendChild(im); d.appendChild(wrap);
  }
  // 3) colibrí cada 3 casas
  if (h % 3 === 1 && !branchHere) {
    const c = decoImg(d, "colibri", "colibri", 95);
    c.style.left = "40px"; c.style.bottom = `calc(${bh + 120} * var(--sc, .5) * 1px)`;
    c.style.animationDelay = (-Math.random() * 3).toFixed(1) + "s";
  }
  // 4) loros sobre el tejado cada 7 casas
  if (h % 7 === 3) {
    const l = decoImg(d, "loros", "loros", 240);
    l.style.left = (rel + 140) + "px"; l.style.top = `calc(-190 * var(--sc, .5) * 1px)`;
  }
  // 6) plantas colgando debajo del tejado (sin tapar el cuadro)
  if (h % 7 !== 6) {
    const kinds = [["glicina", 560, -40], ["hiedra", 520, -10], ["musgo", 470, -20]];
    const [kk, hk, lx] = kinds[h % 3];
    const g = decoImg(d, kk, "hang", hk);
    g.style.left = Math.max(-10, rel - 360 + lx) + "px"; g.style.top = "-16px";
    g.style.animationDelay = (-Math.random() * 5).toFixed(1) + "s";
  }
  if (h % 2 === 0) {
    const g2 = decoImg(d, h % 4 === 0 ? "hiedra" : "musgo", "hang small", 300);
    g2.style.right = "-40px"; g2.style.top = "-16px";
    g2.style.animationDelay = (-Math.random() * 5).toFixed(1) + "s";
  }
  // 5) rama con tucán y guacamayas colgando en la esquina, cada 7 casas
  if (h % 7 === 6 && type !== "azu") {
    // la rama sale del arbusto: el tronco termina dentro del follaje
    const t = decoImg(d, "tucan", "tucan", 470);
    t.style.left = "calc(30 * var(--sc, .5) * 1px)";
    t.style.bottom = "calc(150 * var(--sc, .5) * 1px)";
    t.style.zIndex = 1;
  }
}
for (let h = 0; h < edges.length - 1; h++) {
  const first = h === 0, last = h === edges.length - 2;
  const d = document.createElement("div");
  d.className = "house";
  const width = edges[h + 1] - edges[h];
  d.style.left = edges[h] + "px"; d.style.width = width + "px";
  d.style.top = `calc(${first || last ? 26 : 6 + (h % 3) * 3}% + 64px)`;
  const type = first || last ? "col" : TYPES[(h - 1) % TYPES.length];
  d.dataset.type = type;
  d.innerHTML = '<div class="roof"></div><div class="zocalo"></div>';
  const z = d.querySelector(".zocalo");
  const rel = FIRST + (h - 1) * GAP - edges[h];  // centro del cuadro dentro de la casa
  if (!first && !last) {
    const fr = FRAMES[FRAME_ORDER[(h - 1) % FRAME_ORDER.length]];
    d.style.setProperty("--rel", rel);
    d.style.setProperty("--fk", Math.min(fr.fk, 1.25, 1.15 * fr.ar).toFixed(3)); // mismo ancho de marco que usa cuadros.js
  }
  const left = rel - 330;                         // zona libre a la izquierda del cuadro
  if (type === "col") {
    d.style.backgroundColor = PLASTER.col[h % 3];
    const zc = ZOCALO_COL[h % ZOCALO_COL.length];
    z.style.backgroundColor = zc; z.style.borderTop = "7px solid #1f4fbf"; z.style.height = first || last ? "9%" : "30%";
    if (!first && !last) {
      if (h % 2) opening(fx(d, "door1", left, 560, 0), true); else opening(fx(d, "win1", left - 20, 360, 130), false);
      [rel - 70, rel + 70].forEach((fxl) => { const f = fx(d, "flw", fxl - 26, 70, 40); f.classList.add("relief"); });
    }
  } else if (type === "azu") {
    d.style.background = `url(${FACADE.azulejo}) 0 0 / 136px auto repeat`;
    z.style.backgroundColor = "#d8d2c4"; z.style.borderTop = "0"; z.style.height = "5%";
    opening(fx(d, "door2", left - 10, 640, 0), true);
  } else if (type === "mal") {
    d.style.background = `url(${FACADE.malaga}) 0 0 / 92px auto repeat`;
    z.style.backgroundColor = "#e6dcc8"; z.style.borderTop = "4px solid #d2c6ad"; z.style.height = "12%";
    // puerta amarilla de arco (reemplaza la ventana de piedra)
    const pm = document.createElement("img");
    pm.className = "fx tile-win"; pm.src = "img/ventana-pm.webp"; pm.alt = "";
    pm.style.aspectRatio = "300 / 513"; opening(pm, true);
    d.appendChild(pm);
  } else if (type === "ven") {
    const v = VENTANAS[(venN++ * 5) % VENTANAS.length];
    d.style.backgroundColor = v.wall;
    z.style.backgroundColor = "rgba(0,0,0,.1)"; z.style.borderTop = "0"; z.style.height = "7%";
    const im = document.createElement("img");
    im.className = "fx tile-win"; im.src = v.src; im.alt = "";
    im.style.aspectRatio = v.w + " / " + v.h; opening(im, !!v.door);
    d.appendChild(im);
  } else {
    const c = PLASTER.ten[h % PLASTER.ten.length];
    d.style.backgroundColor = c;
    z.style.backgroundColor = "rgba(0,0,0,.12)"; z.style.borderTop = "0"; z.style.height = "8%";
    // (ventana de balcón de madera retirada a pedido de Alejo)
  }
  if (!first && !last) decorate(d, h, type, rel);
  housesEl.appendChild(d);
}
// dos micos sentados en un tejado (solo una vez)
(function () {
  const h = housesEl.children[8];
  if (!h) return;
  const rel = LAST - edges[8];
  [["img/flor-relieve-1.png", rel - 300, 140, -92, ""], ["img/flor-relieve-2.png", rel + 230, 100, -74, " b"]].forEach(([src, left, height, top, cls]) => {
    const m = document.createElement("img");
    m.className = "mico" + cls; m.src = src; m.alt = "";
    m.style.left = left + "px"; m.style.top = top + "px"; m.style.height = height + "px";
    h.appendChild(m);
  });
})();

// montón de flores en el piso: salen volando cuando pasas
const petals = [];
const PILES = [];
for (let k = 1; k < SONGS.length - 1; k += 4) PILES.push(FIRST + GAP * (k + 0.5));
const PILE_X = PILES[0];
PILES.forEach((PX) => { if (Math.abs(PX - (FIRST + GAP * (Math.floor(SONGS.length / 2) - 0.5) + 80)) < 500) return;
for (let f = 0; f < 28; f++) {
  const PILE_X = PX;
  const depth = Math.random();                    // 0 = junto a la pared, 1 = cerca de la pantalla
  const el = document.createElement("div");
  el.className = "flower";
  const bx = PILE_X + (Math.random() - .5) * (260 + depth * 160);
  el.style.left = bx + "px";
  el.style.bottom = `calc(24% - ${(1 + depth * 13).toFixed(1)}vh)`;
  el.style.zIndex = depth > .55 ? 7 : 3;
  const img = document.createElement("img");
  img.src = FLOWERS[f % FLOWERS.length]; img.alt = "";
  const size = 34 + depth * 30 + Math.random() * 10;
  img.style.width = size + "px";
  el.appendChild(img);
  $("flowers").appendChild(el);
  const rot = (Math.random() - .5) * 120;
  petals.push({ el, img, bx, rot, state: "rest", t: 0, dx: 0, dy: 0, vx: 0, vy: 0, vr: 0, r: rot, o: 1, sway: Math.random() * 6 });
  img.style.transform = `translate(-50%, -70%) rotate(${rot}deg) scaleY(.75)`;
}
});
function updatePetals(dt, moving) {
  for (const p of petals) {
    if (p.state === "rest") {
      if (moving && Math.abs(x - p.bx) < 70) {
        p.state = "fly"; p.t = 0;
        p.vx = (Math.random() - .5) * 220 + dir * 120; p.vy = -(260 + Math.random() * 260); p.vr = (Math.random() - .5) * 540;
      }
      continue;
    }
    p.t += dt;
    if (p.state === "fly") {
      p.vy += 60 * dt;                     // el viento las sigue subiendo un rato
      p.dx += (p.vx + Math.sin(p.t * 4 + p.sway) * 70) * dt; p.dy += p.vy * dt; p.r += p.vr * dt;
      p.o = Math.max(0, 1 - Math.max(0, p.t - 1.6) / 1.4);
      if (p.o <= 0) { p.state = "gone"; p.t = 0; }
    } else if (p.state === "gone") {
      // vuelven a aparecer en el piso cuando el personaje está lejos
      if (p.t > 3 && Math.abs(x - p.bx) > 500) { p.state = "back"; p.t = 0; p.dx = p.dy = 0; p.r = p.rot; }
    } else if (p.state === "back") {
      p.o = Math.min(1, p.t / 1.2);
      if (p.o >= 1) p.state = "rest";
    }
    const lying = p.state === "rest" || p.state === "back";
    p.img.style.transform = `translate(calc(-50% + ${p.dx.toFixed(1)}px), calc(-70% + ${p.dy.toFixed(1)}px)) rotate(${p.r.toFixed(1)}deg) scaleY(${lying ? .75 : 1})`;
    p.img.style.opacity = p.o.toFixed(2);
  }
}

// la señora de las frutas: una sola vez, a mitad de la calle
const LADY_X = FIRST + GAP * (Math.floor(SONGS.length / 2) - 0.5) + 80;
$("lady").style.left = LADY_X + "px";
const HELADO_X = FIRST + GAP * (Math.floor(SONGS.length / 4) - 0.5) + 60;   // el heladero, a un cuarto de la calle
$("helado").style.left = HELADO_X + "px";
$("heladoImg").src = "img/heladero.webp";
$("ladyImg").src = "img/senora-frutas.png";
edges.slice(1, -1).forEach((ex, n) => {
  if (Math.abs(ex - LADY_X) < 120) return;
  const t = document.createElement("div");
  const palm = n % 2 === 0;
  t.className = "tree";
  t.style.left = ex + "px";
  t.style.width = palm ? "17vh" : "13vh"; t.style.height = palm ? "40vh" : "17vh";
  t.innerHTML = `<svg aria-hidden="true"><use href="#${palm ? "palm" : "bush"}"/></svg>`;
  housesEl.appendChild(t);
});
function hills(w, h, color, amp, base, seed) {
  let d = `M0 ${h}`;
  for (let x = 0; x <= w; x += 10) {
    const y = base - amp * (0.55 * Math.sin((x / w) * Math.PI * 2 * 2 + seed) + 0.3 * Math.sin((x / w) * Math.PI * 2 * 5 + seed * 2) + 0.15 * Math.sin((x / w) * Math.PI * 2 * 11 + seed));
    d += ` L${x} ${y.toFixed(1)}`;
  }
  d += ` L${w} ${h} Z`;
  return `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' viewBox='0 0 ${w} ${h}' preserveAspectRatio='none'><path d='${d}' fill='${color}'/></svg>`)}")`;
}
$("hillsFar").style.backgroundImage = hills(1600, 300, "#6aa7a0", 70, 130, 1.3);
$("hillsFar").style.backgroundSize = "1600px 100%";
$("hillsNear").style.backgroundImage = hills(1100, 200, "#3f8f55", 40, 80, 4.1);
$("hillsNear").style.backgroundSize = "1100px 100%";
$("skyDay").style.backgroundImage = "url(img/cielo-dia.jpg)";
$("skyNight").style.backgroundImage = "url(img/cielo-noche.jpg)";
const tilesEl = $("tiles"), farEl = $("hillsFar"), nearEl = $("hillsNear");
