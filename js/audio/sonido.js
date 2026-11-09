/**
 * audio/sonido.js
 *
 * Motores de sonido: la melodía de ejemplo (sintetizador) y la reproducción de MP3.
 * Cada motor expone la misma "interfaz": start(), stop() y setMuted().
 *
 * Parte de la Galería de (Lu)ser. Los archivos se cargan en orden desde
 * index.html y comparten las mismas variables globales.
 */
"use strict";

/* ---------- sonido ---------- */
let ctx = null, master = null, muted = false;
function unlockAudio() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC(); master = ctx.createGain(); master.gain.value = muted ? 0 : 1; master.connect(ctx.destination);
  }
  if (ctx.state === "suspended") ctx.resume();
}

const SCALES = [[0,2,4,7,9],[0,3,5,7,10],[0,2,4,5,7,9,11],[0,2,3,7,8],[0,4,7,9,11],[0,2,5,7,9],[0,3,5,6,7,10],[0,2,4,7,11]];
function makeSynth(i) {
  // melodía de ejemplo distinta para cada cuadro
  const scale = SCALES[i % SCALES.length], root = 48 + (i * 5) % 12, tempo = 92 + (i * 13) % 40;
  const wave = ["triangle", "sine", "square", "sawtooth"][i % 4];
  let seed = i * 9301 + 49297; const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  const melody = Array.from({ length: 16 }, () => rnd() < .2 ? null : scale[Math.floor(rnd() * scale.length)] + (rnd() < .3 ? 12 : 0));
  const bass = [0, 0, scale[Math.min(3, scale.length - 1)], scale[Math.min(4, scale.length - 1)]];
  const out = ctx.createGain(); out.gain.value = 0; out.connect(master);
  const step = 60 / tempo / 2; let n = 0, next = ctx.currentTime + .05, timer = null;
  const hz = (m) => 440 * Math.pow(2, (m - 69) / 12);
  function note(m, t, len, type, vol) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.value = hz(m);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + .02); g.gain.exponentialRampToValueAtTime(.0001, t + len);
    o.connect(g); g.connect(out); o.start(t); o.stop(t + len + .05);
  }
  function tick() {
    while (next < ctx.currentTime + .25) {
      const m = melody[n % 16];
      if (m !== null) note(root + 12 + m, next, step * 1.6, wave, wave === "square" || wave === "sawtooth" ? .05 : .12);
      if (n % 4 === 0) note(root - 12 + bass[(n / 4) % 4], next, step * 3.5, "sine", .2);
      next += step; n++;
    }
  }
  return {
    start() { tick(); timer = setInterval(tick, 60); out.gain.cancelScheduledValues(ctx.currentTime); out.gain.linearRampToValueAtTime(.9, ctx.currentTime + .6); },
    stop() {
      const t = ctx.currentTime; out.gain.cancelScheduledValues(t); out.gain.setValueAtTime(out.gain.value, t); out.gain.linearRampToValueAtTime(0, t + .8);
      setTimeout(() => { clearInterval(timer); out.disconnect(); }, 900);
    },
  };
}
function makeFile(url) {
  const a = new Audio(url); a.loop = false; a.preload = "auto"; a.volume = 0; let fade = null;
  const ramp = (to, done) => { clearInterval(fade); fade = setInterval(() => {
    const v = a.volume + (to > a.volume ? .05 : -.05);
    if ((to > a.volume && v >= to) || (to <= a.volume && v <= to)) { a.volume = to; clearInterval(fade); done && done(); } else a.volume = Math.max(0, Math.min(1, v));
  }, 40); };
  return {
    start() { a.currentTime = 0; a.muted = muted; a.play().catch(() => {}); ramp(1); },
    stop() { ramp(0, () => a.pause()); },
    setMuted(m) { a.muted = m; },
  };
}
let player = null, active = -1;
