import { render } from 'preact';
import { App } from './app.jsx';
import { initialisiere } from './lernstand/store.js';

try {
  initialisiere();
  render(<App />, document.getElementById('app'));
} catch (e) {
  console.error(e);
  document.getElementById('app').innerHTML = `<div class="lade-hinweis">Das Lernstudio konnte nicht starten: ${String(e.message).replace(/</g, '&lt;')}</div>`;
}
