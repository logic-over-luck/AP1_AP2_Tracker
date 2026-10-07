// sql.js im Browser laden – ohne Netz und ohne fetch, damit es auch per file:// läuft.
// Das WebAssembly steckt als Base64 in <script id="sqljs-wasm"> (siehe tools/build.mjs)
// und wird erst beim ersten Öffnen des SQL-Labors ausgepackt.

import initSqlJs from 'sql.js/dist/sql-wasm-browser.js';
import { erstelleEngine } from './engine.js';

let versprechen = null;

function wasmBytes() {
  const tag = document.getElementById('sqljs-wasm');
  if (!tag) throw new Error('Das eingebettete WebAssembly fehlt in dieser Datei.');
  const bin = atob(tag.textContent.trim());
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

export function ladeEngine() {
  if (!versprechen) {
    versprechen = (async () => {
      const bytes = wasmBytes();
      const SQL = await initSqlJs({
        instantiateWasm(imports, fertig) {
          WebAssembly.instantiate(bytes, imports).then((r) => fertig(r.instance, r.module));
          return {};
        },
      });
      return erstelleEngine(SQL);
    })();
    versprechen.catch(() => (versprechen = null));
  }
  return versprechen;
}
