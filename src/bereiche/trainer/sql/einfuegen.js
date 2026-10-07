// Antippen statt Tippen: setzt ein Wort an der Cursorposition in den SQL-Text ein und kümmert sich
// um Leerzeichen und Kommas, damit nicht „bezeichnungpreis" entsteht.
//   wort      – einzufügender Text, z. B. 'SELECT', 'preis', 'COUNT()'
//   zurueck   – Cursor so viele Zeichen vor das Ende des Worts setzen (z. B. 1 für „COUNT(|)")
//   spalten   – bekannte Spaltennamen (klein); zwei Spalten hintereinander im SELECT werden mit Komma getrennt

const KLAUSEL = /\b(SELECT|FROM|WHERE|ON|SET|GROUP BY|ORDER BY|HAVING|VALUES|JOIN|INTO|UPDATE|TABLE)\b/g;
const MIT_KOMMA = new Set(['SELECT', 'GROUP BY', 'ORDER BY']);

export function setzeEin(text, a, b, wort, { zurueck = 0, spalten = new Set() } = {}) {
  let vor = text.slice(0, a);
  const nach = text.slice(b);
  const istSpalte = (w) => w === '*' || spalten.has(String(w).toLowerCase().split('.').pop());
  const letztes = vor.match(/([A-Za-z_][\w.]*|\*)\s*$/)?.[1];
  const klausel = [...vor.toUpperCase().matchAll(KLAUSEL)].pop()?.[1];

  let davor = '';
  if (letztes && istSpalte(wort) && istSpalte(letztes) && MIT_KOMMA.has(klausel)) {
    vor = vor.trimEnd();
    davor = ', ';
  } else if (/^[,;)]/.test(wort)) {
    vor = vor.trimEnd();
  } else if (vor && !/[\s(.]$/.test(vor)) {
    davor = ' ';
  }

  let danach = '';
  if (!zurueck && !/[\s(.]$/.test(wort) && !/^[\s,;)]/.test(nach)) danach = wort === ';' ? '\n' : ' ';

  const kopf = vor + davor + wort;
  return { text: kopf + danach + nach, pos: zurueck ? kopf.length - zurueck : kopf.length + danach.length };
}

// Tabellennamen, die im Text vorkommen (für die Spaltenleiste: zuletzt genannte Tabelle zuerst)
export function genannteTabellen(text, tabellen) {
  const t = String(text ?? '').toLowerCase();
  return tabellen
    .map((n) => ({ n, i: t.lastIndexOf(n.toLowerCase()) }))
    .filter((x) => x.i >= 0 && new RegExp(`\\b${x.n.toLowerCase()}\\b`).test(t))
    .sort((x, y) => y.i - x.i)
    .map((x) => x.n);
}
