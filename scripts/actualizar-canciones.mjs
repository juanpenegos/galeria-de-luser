/**
 * scripts/actualizar-canciones.mjs
 *
 * Lee la playlist pública de Spotify (sin iniciar sesión) y reescribe js/datos/canciones.js
 * con las canciones y portadas actuales. Lo ejecuta GitHub cada cierto tiempo.
 * Si algo sale mal (Spotify no responde, la lista llega vacía o muy corta), NO toca el archivo.
 */
import fs from "node:fs";
import vm from "node:vm";

const PLAYLIST_ID = "0wC7mgNCP0vItU6zhKxjc6";
const ARCHIVO = "js/datos/canciones.js";
const UA = { "User-Agent": "Mozilla/5.0" };

async function main() {
const html = await (await fetch("https://open.spotify.com/embed/playlist/" + PLAYLIST_ID, { headers: UA })).text();
const m = /<script id="__NEXT_DATA__"[^>]*>([^<]*)<\/script>/.exec(html);
if (!m) { console.log("Spotify no devolvió la lista. No se cambia nada."); return; }
const tl = JSON.parse(m[1]).props.pageProps.state.data.entity.trackList || [];
if (tl.length < 10) { console.log("La lista llegó con solo " + tl.length + " canciones. No se cambia nada."); return; }

// lo que ya estaba escrito a mano (descripción, año, audio) se conserva
const viejo = fs.readFileSync(ARCHIVO, "utf8");
const ctx = {}; vm.runInNewContext(viejo.replace("const SONGS", "this.SONGS"), ctx);
const previas = new Map((ctx.SONGS || []).map((s) => [s.spotify, s]));

const canciones = [];
for (let i = 0; i < tl.length; i += 8) {
  const lote = await Promise.all(tl.slice(i, i + 8).map(async (t) => {
    const id = t.uri.split(":")[2], link = "https://open.spotify.com/track/" + id, antes = previas.get(link);
    let photo = antes && antes.photo || "";
    for (let k = 0; k < 3 && !photo; k++) {
      try { const r = await fetch("https://open.spotify.com/oembed?url=spotify:track:" + id, { headers: UA }); if (r.ok) photo = (await r.json()).thumbnail_url || ""; } catch (e) {}
    }
    const q = encodeURIComponent(t.title + " " + t.subtitle);
    return { title: t.title, artist: t.subtitle, year: antes ? antes.year : "", desc: antes ? antes.desc : "",
      youtube: "https://www.youtube.com/results?search_query=" + q,
      links: [{ label: "Escuchar en Spotify", url: link }], spotify: link, photo, audio: antes ? antes.audio : "" };
  }));
  canciones.push(...lote);
}

const cabecera = viejo.slice(0, viejo.indexOf("const SONGS = [") + "const SONGS = [".length);
const nuevo = cabecera + "\n" + canciones.map((s) => "  " + JSON.stringify(s)).join(",\n") + "\n];\n";
if (nuevo === viejo) { console.log("Sin cambios: la playlist sigue igual."); return; }
fs.writeFileSync(ARCHIVO, nuevo);
console.log("Actualizado: " + canciones.length + " canciones.");
}
await main();
