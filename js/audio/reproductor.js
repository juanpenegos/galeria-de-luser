/**
 * audio/reproductor.js
 *
 * Decide QUÉ suena en cada cuadro (Spotify, MP3 o melodía de ejemplo)
 * usando cualquiera de los motores con la misma interfaz.
 *
 * Parte de la Galería de (Lu)ser. Los archivos se cargan en orden desde
 * index.html y comparten las mismas variables globales.
 */
"use strict";

function play(i) {
  stopPlayer();
  unlockAudio();
  const s = SONGS[i];
  if (spTrack(s) && SP.ready) { player = spPlayer(spTrack(s)); player.start(); return; }
  if (s.audio) player = makeFile(s.audio);
  else if (ctx) player = makeSynth(i);
  if (player) player.start();
}
function stopPlayer() { if (player) { player.stop(); player = null; } }

$("mute").addEventListener("click", () => {
  muted = !muted; $("mute").textContent = muted ? "Activar sonido" : "Silenciar";
  if (master) master.gain.value = muted ? 0 : 1;
  if (player && player.setMuted) player.setMuted(muted);
});
