// sollText ohne JSX nachgebaut (die Oberfläche zeigt dasselbe an)
import { zahlText, runde } from '../../src/bereiche/trainer/rahmen/pruefen.js';
export function sollText(f) {
  if (f.soll) return f.soll;
  if (f.typ === 'auswahl') return f.erwartet;
  if (f.typ === 'basis') return f.erwartet.toString(f.basis).toUpperCase();
  if (f.typ === 'zahl' || !f.typ) return zahlText(runde(f.erwartet, f.stellen ?? 0), f.stellen ?? 0) + (f.einheit ? ` ${f.einheit}` : '');
  return String(f.erwartet);
}
