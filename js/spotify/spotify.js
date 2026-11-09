/**
 * spotify/spotify.js
 *
 * Todo lo de Spotify: reproductor oficial (iFrame API), inicio de sesión (PKCE)
 * y lectura de la playlist para actualizar la calle sola.
 *
 * Parte de la Galería de (Lu)ser. Los archivos se cargan en orden desde
 * index.html y comparten las mismas variables globales.
 */
"use strict";

/* ---------- Spotify ----------
   Cada canción con link de Spotify (open.spotify.com/track/...) suena en el
   reproductor oficial de Spotify: completa si hay sesión abierta, 30 s si no. */
const SP = { ready: false, ctl: null, want: null, failed: false };
function spTrack(s) {
  const m = /track[/:]([A-Za-z0-9]{22})/.exec(s.spotify || "");
  return m ? "spotify:track:" + m[1] : null;
}
function spPlayer(uri) {
  return {
    start() {
      if (muted) return;
      SP.want = uri; $("spdock").classList.add("show");
      SP.ctl.loadUri(uri); // siempre empieza desde el inicio
    },
    stop() { SP.want = null; try { SP.ctl.pause(); } catch (e) {} $("spdock").classList.remove("show"); },
    setMuted(m) { if (m) { try { SP.ctl.pause(); } catch (e) {} } else this.start(); },
  };
}
window.onSpotifyIframeApiReady = (API) => {
  API.createController($("spEmbed"), { uri: "spotify:playlist:0wC7mgNCP0vItU6zhKxjc6", width: "100%", height: 80 }, (ctl) => {
    SP.ctl = ctl; SP.ready = true;
    ctl.addListener("ready", () => { if (SP.want) ctl.play(); });
    if (active >= 0) play(active);
  });
};
(function () {
  const sc = document.createElement("script");
  sc.src = "https://open.spotify.com/embed/iframe-api/v1"; sc.async = true;
  sc.onerror = () => { SP.failed = true; spNote("En esta vista previa Spotify no puede cargar. En la página publicada las canciones suenan desde Spotify."); };
  document.head.appendChild(sc);
  setTimeout(() => { if (!SP.ready && !SP.failed) spNote("Spotify está tardando en cargar. Revisa tu conexión y recarga la página."); }, 8000);
})();
function spNote(t) { const n = $("spNote"); n.textContent = t; n.hidden = false; }
$("spReload").addEventListener("click", () => location.reload());

/* Mensaje discreto en la tarjeta de Spotify (la que está en la entrada de la calle). */
const SP_TEXT_OFF = "Así las canciones suenan completas.";
function spStatus(t) { const e = document.querySelector(".spshort"); if (e) e.textContent = t; }

/* sessionStorage puede no existir (navegación privada estricta): se usa sin romper nada */
const SS = {
  get(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
  set(k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} },
};

/* ---- inicio de sesión con Spotify (PKCE: sin contraseñas ni claves secretas en la página) ---- */
/* La Redirect URI debe ser IDÉNTICA a la registrada en Spotify: sin "index.html" y con "/" al final. */
const SP_REDIRECT = (function () {
  let path = location.pathname.replace(/index\.html$/, "");
  if (!path.endsWith("/")) path += "/";
  return location.origin + path;
})();
const b64url = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
async function spLogin() {
  try {
    const verifier = b64url(crypto.getRandomValues(new Uint8Array(48)));
    const state = b64url(crypto.getRandomValues(new Uint8Array(16)));
    LS.set("gs_pkce", verifier); LS.set("gs_state", state);
    SS.set("gs_pkce", verifier); SS.set("gs_state", state); // respaldo si localStorage no está disponible
    const challenge = b64url(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier)));
    const q = new URLSearchParams({ client_id: SPOTIFY_CLIENT_ID, response_type: "code", redirect_uri: SP_REDIRECT, state,
      code_challenge_method: "S256", code_challenge: challenge, scope: "playlist-read-private playlist-read-collaborative" });
    location.href = "https://accounts.spotify.com/authorize?" + q;
  } catch (e) { spNote("Este navegador no permite iniciar sesión aquí. Prueba con otro o abre la página con https."); }
}
async function spTokenRequest(body) {
  const r = await fetch("https://accounts.spotify.com/api/token", { method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams(body) });
  if (!r.ok) throw new Error("token " + r.status);
  const t = await r.json();
  const prev = JSON.parse(LS.get("gs_token") || "{}");
  LS.set("gs_token", JSON.stringify({ access: t.access_token, refresh: t.refresh_token || prev.refresh, exp: Date.now() + (t.expires_in - 60) * 1000 }));
  SS.set("gs_access", t.access_token); // por si localStorage no guarda
  return t.access_token;
}
/* Devuelve un token válido, lo renueva si venció, o null si hay que iniciar sesión otra vez. */
async function spAccess() {
  const t = JSON.parse(LS.get("gs_token") || "null");
  if (!t) return SS.get("gs_access");
  if (Date.now() < t.exp) return t.access;
  if (!t.refresh) { spLoggedOut(); return null; }
  try { return await spTokenRequest({ grant_type: "refresh_token", refresh_token: t.refresh, client_id: SPOTIFY_CLIENT_ID }); }
  catch (e) { spLoggedOut(); return null; }
}
/* Sin sesión válida: se borra el token y vuelve el botón de iniciar sesión. */
function spLoggedOut() {
  LS.del("gs_token");
  $("spOpen").textContent = "Iniciar sesión en Spotify";
  spStatus(SP_TEXT_OFF);
}
function songFromTrack(tr) {
  const artists = (tr.artists || []).map((a) => a.name).join(", ");
  const q = encodeURIComponent(tr.name + " " + ((tr.artists && tr.artists[0] && tr.artists[0].name) || ""));
  const imgs = (tr.album && tr.album.images) || [];
  const img = imgs.find((i) => i.width && i.width <= 640 && i.width >= 250) || imgs[0];
  return { title: tr.name, artist: artists, year: ((tr.album && tr.album.release_date) || "").slice(0, 4), desc: "",
    youtube: "https://www.youtube.com/results?search_query=" + q,
    links: [{ label: "Escuchar en Spotify", url: "https://open.spotify.com/track/" + tr.id }],
    spotify: "https://open.spotify.com/track/" + tr.id, photo: img ? img.url : "", audio: "" };
}

/* GET con reintentos: si Spotify dice 429 (muchas peticiones) espera lo que pide en Retry-After. */
async function spFetch(url, token) {
  for (let intento = 0; intento < 3; intento++) {
    const r = await fetch(url, { headers: { Authorization: "Bearer " + token } });
    if (r.status !== 429) return r;
    const espera = Math.min(parseInt(r.headers.get("Retry-After"), 10) || 2, 30);
    await new Promise((ok) => setTimeout(ok, espera * 1000));
  }
  return null;
}
/* Mensaje claro según el código de error. Devuelve true si vale la pena reintentar con otro token. */
function spExplain(status) {
  if (status === 403) return "Tu cuenta aún no está autorizada en la app de Spotify. Pídele a Juan que te agregue.";
  if (status === 404) return "No se encontró la playlist. Se muestran las canciones guardadas.";
  if (status === 429) return "Spotify está recibiendo muchas peticiones. Se muestran las canciones guardadas.";
  return "No se pudo leer la playlist (" + status + "). Se muestran las canciones guardadas.";
}
async function spSyncPlaylist() {
  let token = await spAccess();
  if (!token) return;
  spStatus("Actualizando playlist…");
  const list = [];
  // Endpoint /items (el antiguo /tracks está deprecado). Se piden "item" y "track" por si acaso.
  let url = "https://api.spotify.com/v1/playlists/" + PLAYLIST_ID + "/items?limit=50&fields=next,items(is_local,item(id,name,type,artists(name),album(release_date,images)),track(id,name,type,artists(name),album(release_date,images)))";
  let renovado = false;
  while (url) {
    let r;
    try { r = await spFetch(url, token); }
    catch (e) { spStatus("Sin conexión: se muestran las canciones guardadas."); return; } // error de red
    if (!r) { spStatus(spExplain(429)); return; }
    if (r.status === 401 && !renovado) { // el token ya no sirve: se intenta renovar una vez
      renovado = true; LS.del("gs_token"); SS.set("gs_access", "");
      token = await spAccess();
      if (!token) return;
      continue;
    }
    if (!r.ok) {
      if (r.status === 401) spLoggedOut();
      spNote(spExplain(r.status)); spStatus(r.status === 401 ? SP_TEXT_OFF : spExplain(r.status));
      return;
    }
    const d = await r.json();
    if (!Array.isArray(d.items)) { // playlist ajena: Spotify solo da los datos, sin canciones
      spStatus("Para actualizar la playlist, tu cuenta debe ser dueña o colaboradora de ella."); return;
    }
    d.items.forEach((it) => {
      const tr = it && (it.item || it.track);
      if (it && !it.is_local && tr && tr.id && tr.type === "track") list.push(songFromTrack(tr)); // sin nulos, locales ni podcasts
    });
    url = d.next;
  }
  if (!list.length) { spStatus("La playlist llegó vacía: se muestran las canciones guardadas."); return; }
  spStatus("La playlist se actualiza sola.");
  const sig = (arr) => arr.map((x) => x.spotify || x.title).join("|");
  if (sig(list) !== sig(SONGS)) {
    LS.set("gs_songs", JSON.stringify(list));
    // Máximo una recarga por visita, para no entrar en bucle
    if (!SS.get("gs_reloaded")) { SS.set("gs_reloaded", "1"); location.reload(); }
  }
}
function spConnectedUI() {
  if (!LS.get("gs_token") && !SS.get("gs_access")) return;
  $("spOpen").textContent = "Conectada a Spotify ✓";
  spStatus("La playlist se actualiza sola.");
}
(async function () {
  if (!SPOTIFY_CLIENT_ID) return;
  const p = new URLSearchParams(location.search);
  if (p.get("code") || p.get("error")) {
    const state = LS.get("gs_state") || SS.get("gs_state");
    const verifier = LS.get("gs_pkce") || SS.get("gs_pkce");
    if (p.get("error")) {
      // Si cancela (access_denied) no es un error: la galería sigue con las canciones guardadas.
      if (p.get("error") !== "access_denied") spNote("Spotify no pudo iniciar la sesión. Intenta de nuevo más tarde.");
    } else if (!state || p.get("state") !== state || !verifier) {
      spNote("El inicio de sesión no se pudo verificar y se descartó. Intenta de nuevo.");
    } else {
      try { await spTokenRequest({ grant_type: "authorization_code", code: p.get("code"), redirect_uri: SP_REDIRECT, client_id: SPOTIFY_CLIENT_ID, code_verifier: verifier }); }
      catch (e) { spNote("No se pudo completar el inicio de sesión. Intenta de nuevo."); }
    }
    LS.del("gs_pkce"); LS.del("gs_state");
    history.replaceState(null, "", SP_REDIRECT); // limpia ?code, ?state y ?error de la barra
  }
  spConnectedUI();
  spSyncPlaylist().catch(() => spStatus("No se pudo actualizar la playlist. Se muestran las canciones guardadas."));
})();
/* Con Client ID, el botón inicia el login con la app; sin él, abre el login normal de Spotify. */
/* Sin app propia, "Ir a Spotify" abre el login normal en esta misma pestaña y pide volver a la galería (continue). */
$("spGo").href = "https://accounts.spotify.com/login?continue=" + encodeURIComponent(SP_REDIRECT);
$("spGo").addEventListener("click", (e) => { if (SPOTIFY_CLIENT_ID) { e.preventDefault(); spLogin(); } });
const spModal = $("spmodal");
document.body.appendChild(spModal); // fuera de la escena 3D para que se pueda tocar
function spShow(on) { spModal.hidden = !on; if (on) $("spClose").focus(); else $("spOpen").focus(); }
$("spOpen").addEventListener("click", () => spShow(true));
$("spClose").addEventListener("click", () => spShow(false));
spModal.addEventListener("click", (e) => { if (e.target === spModal) spShow(false); });
addEventListener("keydown", (e) => { if (e.key === "Escape" && !spModal.hidden) spShow(false); });
