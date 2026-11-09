/**
 * juego/pantalla.js
 *
 * Adapta tamaños a la pantalla (computador o celular) y actualiza la barra
 * de "Sonando" y la tarjeta del celular.
 *
 * Parte de la Galería de (Lu)ser. Los archivos se cargan en orden desde
 * index.html y comparten las mismas variables globales.
 */
"use strict";

/* tamaños según la pantalla */
let friendSc = .5;
function sizes() {
  const h = viewport.clientHeight, w = viewport.clientWidth;
  const art = w < 720 ? Math.max(110, Math.min(150, h * 0.19, w * 0.36)) : Math.max(130, Math.min(250, h * 0.26, w * 0.46));
  world.style.setProperty("--size", art + "px");
  world.style.setProperty("--cy", (h * 0.38 - art * 0.08) + "px"); // altura del centro del cuadro sobre el piso
  const sc = Math.max(0.3, Math.min(0.62, h * 0.30 / 400));
  walker.style.setProperty("--s", sc); world.style.setProperty("--s", sc);
  world.style.setProperty("--sc", sc);
  dogEl.style.setProperty("--ds", sc * 0.36);
  $("lady").style.setProperty("--s", sc); $("helado").style.setProperty("--s", sc);
  $("friend").style.setProperty("--s", sc); $("fdog").style.setProperty("--s", sc); friendSc = sc;
  dogGap = 150 * sc;
}
addEventListener("resize", sizes); sizes();

function setNow(i) {
  const now = $("now");
  pieces.forEach((p) => { p.el.classList.toggle("on", p.i === i); p.dot.classList.toggle("on", p.i === i); });
  if (i < 0) {
    now.classList.remove("playing"); now.classList.add("idle");
    $("nowLbl").textContent = "En silencio"; $("nowTtl").textContent = "Párate frente a un cuadro";
    $("sheet").classList.remove("show");
  } else {
    const s = SONGS[i];
    now.classList.add("playing"); now.classList.remove("idle");
    $("nowLbl").textContent = (spTrack(s) && SP.ready) ? spLabel() : s.audio ? "Sonando" : "Sonando · ejemplo";
    $("nowTtl").textContent = s.title + " — " + s.artist;
    const sh = $("sheet"), pl = pieces[i].el.querySelector(".plaque");
    sh.innerHTML = "";
    [".num", "h3", ".artist", ".desc", ".links"].forEach((q) => sh.appendChild(pl.querySelector(q).cloneNode(true)));
    sh.classList.add("show");
  }
}

/* evita que el navegador desplace la sala por su cuenta (al enfocar un cuadro) */
["app", "viewport"].forEach((id) => $(id).addEventListener("scroll", (e) => { e.target.scrollLeft = 0; e.target.scrollTop = 0; }));
