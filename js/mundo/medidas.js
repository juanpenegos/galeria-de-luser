/**
 * mundo/medidas.js
 *
 * Medidas de la calle: dónde empieza, cada cuánto va un cuadro y dónde termina.
 * Todo se calcula desde la cantidad de canciones, así la calle crece sola.
 *
 * Parte de la Galería de (Lu)ser. Los archivos se cargan en orden desde
 * index.html y comparten las mismas variables globales.
 */
"use strict";

/* ---------- medidas del mundo ---------- */
const START_X = 600;          // donde empieza el personaje
const FIRST = 1000;           // primer cuadro
const GAP = 900;              // distancia entre cuadros (nunca suenan dos a la vez)
const RANGE = 190;            // qué tan cerca hay que estar para que suene
const SPEED = 380;            // velocidad al caminar (px por segundo)
const LAST = FIRST + GAP * (SONGS.length - 1);
const END = LAST + 2800;     // la última pared (la de las fotos) empieza en LAST + 400 y llega hasta aquí
const FRIEND_X = LAST + 760;   // el amigo y su perro esperan al final

const $ = (id) => document.getElementById(id);
const world = $("world"), viewport = $("viewport"), walker = $("walker");
world.style.width = END + "px";
$("intro").style.left = "max(24px, calc(" + 40 + "px + env(safe-area-inset-left, 0px)))";
$("outro").style.left = (END - 345) + "px";
