/**
 * datos/recursos.js
 *
 * Rutas de las imágenes de personajes, flores y marcos.
 * Si cambias un dibujo, solo tocas este archivo (y la carpeta img/).
 *
 * Parte de la Galería de (Lu)ser. Los archivos se cargan en orden desde
 * index.html y comparten las mismas variables globales.
 */
"use strict";

/* ---------- dibujos del personaje (de frente, de espaldas y 4 piernas) ---------- */
const SPRITES = {
  front: "img/personaje-frente.png",
  back: "img/personaje-espalda.png",
  legs: ["img/personaje-piernas-1.png", "img/personaje-piernas-2.png", "img/personaje-piernas-3.png", "img/personaje-piernas-4.png"],
};
const DOG = {
  front: "img/pug-lado.png",
  back: "img/pug-espalda.png",
  legs: { side: ["img/pug-piernas-lado-1.png", "img/pug-piernas-lado-2.png"], back: ["img/pug-piernas-espalda-1.png", "img/pug-piernas-espalda-2.png"] },
};
const WALK = [1, 0, 2, 0]; // orden de las piernas al caminar
const STAND = 3;          // piernas cuando está quieto

const FLOWERS = [
  "img/orquidea-01.png",
  "img/orquidea-02.png",
  "img/orquidea-03.png",
  "img/orquidea-04.png",
  "img/orquidea-05.png",
  "img/orquidea-06.png",
  "img/orquidea-07.png",
  "img/orquidea-08.png",
  "img/orquidea-09.png"
];

/* el borde de azulejo de las placas está en css/estilos.css (--azulejo-border) */

/* marcos de los cuadros (recortados de las fotos de Alejo) */
const FRAMES = {"oro": {"src": "img/marco-oro.webp", "ar": 1.4857, "fk": 1.55, "win": [0.1152, 0.1595, 0.8819, 0.842]}, "pintado": {"src": "img/marco-pintado.webp", "ar": 0.7865, "fk": 1.489, "win": [0.2511, 0.3006, 0.8002, 0.8472]}, "azul": {"src": "img/marco-azul.webp", "ar": 0.6673, "fk": 0.985, "win": [0.1399, 0.1069, 0.8913, 0.8813]}, "acuarela1": {"src": "img/marco-acuarela1.webp", "ar": 1.1915, "fk": 1.478, "win": [0.0893, 0.2723, 0.875, 0.8596]}, "acuarela2": {"src": "img/marco-acuarela2.webp", "ar": 1.3368, "fk": 1.899, "win": [0.2008, 0.2526, 0.8346, 0.7474]}, "acuarela3": {"src": "img/marco-acuarela3.webp", "ar": 1.1865, "fk": 1.43, "win": [0.1441, 0.1554, 0.8734, 0.829]}, "acuarela4": {"src": "img/marco-acuarela4.webp", "ar": 1.1212, "fk": 1.182, "win": [0.0757, 0.1212, 0.9189, 0.9273]}};
FRAMES.oro2 = {"src": "img/marco-oro2.webp", "ar": 0.6462, "fk": 0.978, "win": [0.1431, 0.1019, 0.8585, 0.9012]};
FRAMES.oro3 = {"src": "img/marco-oro3.webp", "ar": 1.1268, "fk": 1.352, "win": [0.1343, 0.1417, 0.8633, 0.857]};
const FRAME_ORDER = ["oro", "pintado", "acuarela1", "azul", "oro3", "oro", "oro2", "pintado", "azul", "acuarela1"];
