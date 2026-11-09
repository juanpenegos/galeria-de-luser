/**
 * juego/bucle.js
 *
 * Ciclo principal: se repite unas 60 veces por segundo. Mueve al personaje,
 * al perrito y a los demás, decide qué cuadro suena y mueve la cámara.
 *
 * Parte de la Galería de (Lu)ser. Los archivos se cargan en orden desde
 * index.html y comparten las mismas variables globales.
 */
"use strict";

let last = performance.now();
function frame(t) {
  const dt = Math.max(0, Math.min(.05, (t - last) / 1000)); last = t;
  let move = 0;
  if (keys.left !== keys.right) move = keys.left ? -1 : 1;
  else if (target !== null) {
    const d = target - x;
    if (Math.abs(d) < 6) { x = target; target = null; } else move = Math.sign(d);
  }
  if (move) {
    // cuanto más tiempo caminas (o más lejos vas), más rápido: la calle es muy larga
    holdT += dt;
    let speed = SPEED * Math.min(4, 1 + Math.max(0, holdT - 1) * 0.8);
    if (target !== null) speed = Math.max(SPEED, Math.min(20000, Math.abs(target - x) * 1.6));
    lastSpeed = speed;
    let nx = x + move * speed * dt;
    if (target !== null && Math.sign(target - nx) !== move) nx = target;
    x = Math.max(120, Math.min(END - 120, nx));
    dir = move; still = 0;
  } else { still += dt; holdT = 0; }
  if (move && move !== lastMove) holdT = 0;
  lastMove = move;

  walker.classList.toggle("walking", !!move);
  walker.classList.toggle("left", dir < 0);
  walker.style.left = x + "px";

  // ¿delante de qué cuadro está?
  let near = -1;
  pieces.forEach((p) => { if (Math.abs(p.x - x) < RANGE) near = p.i; });
  if (near !== active) {
    if (near === -1) { active = -1; stopPlayer(); setNow(-1); }
    else if (!move && still > .25) { active = near; play(near); setNow(near); }
  }
  const listening = active >= 0 && !move;
  walker.classList.toggle("back", listening);
  const bodySrc = listening ? SPRITES.back : SPRITES.front;
  if (bodyImg.dataset.k !== (listening ? "b" : "f")) { bodyImg.src = bodySrc; bodyImg.dataset.k = listening ? "b" : "f"; }
  walkT = move ? walkT + dt : 0;
  const legFrame = move ? WALK[Math.floor(walkT / (0.13 * Math.max(.45, SPEED / Math.max(SPEED, lastSpeed)))) % WALK.length] : STAND;
  if (legsImg.dataset.f !== String(legFrame)) { legsImg.src = SPRITES.legs[legFrame]; legsImg.dataset.f = legFrame; }

  // perrito: camina detrás del personaje (o se sienta a su lado cuando escucha)
  const dogTarget = listening ? x + dogGap * 0.9 : x - dir * dogGap;
  const gap = dogTarget - dogX;
  let dogMove = 0;
  if (Math.abs(gap) > 6) {
    const sp = Math.min(Math.max(SPEED * 1.3, lastSpeed * 1.15), Math.abs(gap) * 5);
    if (Math.abs(gap) > 1500) dogX = dogTarget - Math.sign(gap) * 1500;
    dogMove = Math.sign(gap); dogX += dogMove * Math.min(Math.abs(gap), sp * dt);
    if (sp > 40) dogDir = dogMove; else { dogMove = 0; if (move) dogDir = dir; }
  } else if (!listening) dogDir = dir;
  const dogBack = listening && !dogMove;
  dogT = dogMove ? dogT + dt : 0;
  const dl = dogMove ? Math.floor(dogT / 0.12) % 2 : 0;
  dogEl.classList.toggle("walking", !!dogMove);
  dogEl.classList.toggle("left", dogDir < 0);
  dogEl.classList.toggle("back", dogBack);
  dogEl.classList.toggle("l2", !dogBack && dl === 1);
  dogEl.classList.toggle("l3", false);
  setSrc(dogBody, dogBack ? DOG.back : DOG.front);
  setSrc(dogLegs, dogBack ? DOG.legs.back[1] : DOG.legs.side[dl]);
  dogEl.style.left = dogX + "px";

  updatePetals(dt, !!move);
  updateFriend(dt);

  // la señora habla cuando el personaje se acerca
  $("lady").classList.toggle("talk", Math.abs(x - LADY_X) < 300);
  $("helado").classList.toggle("talk", Math.abs(x - HELADO_X) < 300);
  for (const n of npcs) n.el.classList.toggle("talk", Math.abs(x - n.x) < 260);

  // solo se dibuja lo que está cerca de la pantalla (la calle es larguísima)
  cullT -= dt;
  if (cullT <= 0) {
    cullT = .2;
    const vw0 = viewport.clientWidth, c0 = x - vw0 * 1.5, c1 = x + vw0 * 1.5;
    for (const it of cullList) { const show = it.x1 > c0 && it.x0 < c1; if (it.on !== show) { it.on = show; it.el.style.display = show ? "" : "none"; } }
  }

  // cámara
  const vw = viewport.clientWidth;
  const cam = Math.max(0, Math.min(END - vw, x - vw / 2));
  world.style.transform = `translateX(${-cam}px)`;
  updateBirds(dt, cam);
  tilesEl.style.backgroundPositionX = `${-cam}px`;
  farEl.style.backgroundPositionX = `${-cam * 0.12}px`;
  nearEl.style.backgroundPositionX = `${-cam * 0.25}px`;
  $("you").style.left = (x / END * 100) + "%";
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
