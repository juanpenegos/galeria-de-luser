/**
 * datos/configuracion.js
 *
 * Configuración que tú puedes cambiar: Client ID de Spotify, ID de la playlist,
 * fotos propias para algunos cuadros (MY_PHOTOS) y la caché local de la playlist.
 *
 * Parte de la Galería de (Lu)ser. Los archivos se cargan en orden desde
 * index.html y comparten las mismas variables globales.
 */
"use strict";

/* Total de cuadros en la calle: uno por canción de la playlist. */
/* ---------- conexión con la playlist de Spotify ----------
   Pega aquí el Client ID de tu app de Spotify for Developers.
   Con él, la página lee la playlist cada vez que se abre y agrega
   sola las canciones nuevas (con su link y la portada del disco). */
const SPOTIFY_CLIENT_ID = "";
const PLAYLIST_ID = "0wC7mgNCP0vItU6zhKxjc6";
const LS = {
  get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
  del(k) { try { localStorage.removeItem(k); } catch (e) {} },
};
// si ya se leyó la playlist antes, la calle se arma con esa lista
(function () {
  try {
    const cached = JSON.parse(LS.get("gs_songs") || "null");
    if (Array.isArray(cached) && cached.length) { SONGS.length = 0; cached.forEach((x) => SONGS.push(x)); }
  } catch (e) {}
})();
/* ---------- tus fotos para algunos cuadros ----------
   Por defecto cada cuadro usa la portada del álbum que trae Spotify.
   Para poner una foto tuya en un cuadro, agrégala aquí con el nombre
   exacto de la canción:   "Flores": "foto.jpg",                       */
const MY_PHOTOS = {
};
const norm = (t) => (t || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
const MY_PHOTOS_N = {};
Object.keys(MY_PHOTOS).forEach((k) => { MY_PHOTOS_N[norm(k)] = MY_PHOTOS[k]; });
SONGS.forEach((s) => { const mine = MY_PHOTOS_N[norm(s.title)]; if (mine) s.photo = mine; });
const TOTAL = SONGS.length;
