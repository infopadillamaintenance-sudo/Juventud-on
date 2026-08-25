/**
 * Genera una versión de la web en UN SOLO archivo HTML autocontenido:
 * el CSS, el JavaScript y las tipografías quedan incrustados dentro del propio
 * archivo. Sirve para enviarlo por WhatsApp, abrirlo sin servidor o subirlo
 * a cualquier hosting arrastrando un único archivo.
 *
 *   node tools/build-single-file.mjs                  → dist/juventud-on.html
 *   node tools/build-single-file.mjs --body-only ruta → sin <html>/<head>/<body>
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const leer = (p) => readFileSync(resolve(raiz, p), "utf8");

const args = process.argv.slice(2);
const soloCuerpo = args.includes("--body-only");
const salida = args.find((a) => !a.startsWith("--")) ||
  (soloCuerpo ? "dist/juventud-on-cuerpo.html" : "dist/juventud-on.html");

/* --- 1. CSS con las tipografías incrustadas en base64 --- */
let css = leer("assets/css/juventud-on.css");
css = css.replace(/url\(["']?\.\.\/fonts\/([^"')]+)["']?\)/g, (_, archivo) => {
  const b64 = readFileSync(resolve(raiz, "assets/fonts", archivo)).toString("base64");
  return `url("data:font/woff2;base64,${b64}")`;
});

/* --- 2. HTML con CSS y JS en línea --- */
let html = leer("index.html");
// Ojo: se usan funciones de reemplazo, no cadenas. Con cadenas, secuencias como
// `$$` o `$&` dentro del CSS/JS se interpretarían como patrones de sustitución
// y corromperían el archivo generado.
html = html.replace(
  /<link rel="preload"[^>]*>\s*/,
  () => ""
).replace(
  /<link rel="stylesheet" href="assets\/css\/juventud-on\.css">/,
  () => `<style>\n${css}\n</style>`
).replace(
  /<script src="assets\/js\/data\.js"><\/script>\s*<script src="assets\/js\/app\.js"><\/script>/,
  () => `<script>\n${leer("assets/js/data.js")}\n${leer("assets/js/app.js")}\n</script>`
);

/* --- 3. Modo "solo cuerpo" (para incrustar en otra página) --- */
if (soloCuerpo) {
  // Solo el título y los estilos: quien incruste la página aporta su propio
  // <head> (charset, viewport y metaetiquetas).
  const estilos = html.match(/<style>[\s\S]*?<\/style>/)[0];
  const cuerpo = html.match(/<body[^>]*>([\s\S]*?)<\/body>/)[1];
  const clasesBody = html.match(/<body class="([^"]*)"/)?.[1] ?? "";
  html = `<title>Juventud ON</title>\n${estilos}\n<div class="${clasesBody}">\n` +
         cuerpo.trim() + "\n</div>\n";
}

mkdirSync(resolve(raiz, dirname(salida)), { recursive: true });
writeFileSync(resolve(raiz, salida), html);
console.log(`✓ ${salida} — ${(Buffer.byteLength(html) / 1024).toFixed(0)} KB`);
