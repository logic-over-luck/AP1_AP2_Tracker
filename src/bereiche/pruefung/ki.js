// Bewertung durch eine KI, ohne dass die App online geht: Die App baut einen Prompt (Prüferauftrag, Aufgaben,
// Antworten, Musterlösung, Punkteschema) für alle Teilaufgaben, die sie nicht selbst prüfen kann. Die KI antwortet
// ausschließlich mit einer Zeile je Teilaufgabe im Format
//   1aa:4
//   1b:2,5
// Die App liest das streng: jede erwartete Nummer genau einmal, Punkte 0 … Höchstpunkte in halben Schritten,
// sonst nichts. Zahlenfelder und Auswahl bewertet die App selbst (automatischePunkte); Zeichnungen auf Papier
// werden nicht bewertet (istZeichnung).
// Rein, ohne Browser-Abhängigkeit (Tests).

import { teilSchluessel, automatischePunkte, istZeichnung } from './generator.js';

export const kurz = (i, t) => `${i + 1}${t.nr}`;
const zahl = (x) => String(x).replace('.', ',');

// Teilaufgaben, die die KI bewerten muss: { kurz, k, max, aufgabe, teil, i }
export function kiTeile(pruefung) {
  const liste = [];
  pruefung.aufgaben.forEach(({ aufgabe }, i) => {
    for (const t of aufgabe.teile) if (!istZeichnung(t) && automatischePunkte(t, undefined) === null) liste.push({ kurz: kurz(i, t), k: teilSchluessel(aufgabe, t), max: t.punkte, aufgabe, teil: t, i });
  });
  return liste;
}

// Punkte, die die App selbst vergibt (Zahlen, Auswahl)
export function eigenePunkte(pruefung, antworten) {
  const punkte = {};
  for (const { aufgabe } of pruefung.aufgaben)
    for (const t of aufgabe.teile) {
      const k = teilSchluessel(aufgabe, t);
      const p = automatischePunkte(t, antworten[k]);
      if (p !== null) punkte[k] = p;
    }
  return punkte;
}

function blockText(b) {
  if (!b) return '';
  if (typeof b === 'string') return b;
  if (b.tabelle) {
    const { titel, kopf, zeilen } = b.tabelle;
    const z = (r) => `| ${r.map((c) => String(c ?? '').replace(/\n/g, ' ')).join(' | ')} |`;
    return [titel ? `${titel}:` : null, kopf ? z(kopf) : null, kopf ? `|${kopf.map(() => '---').join('|')}|` : null, ...zeilen.map(z)].filter(Boolean).join('\n');
  }
  if (b.code !== undefined) {
    const zeilen = String(b.code).split('\n');
    const text = b.nummern ? zeilen.map((z, i) => `${String(i + 1).padStart(2)}  ${z}`).join('\n') : b.code;
    return `${b.titel ? `${b.titel}:\n` : ''}\`\`\`\n${text}\n\`\`\``;
  }
  if (b.hinweis) return `Hinweis: ${b.hinweis}`;
  if (b.diagramm) return `[Diagramm${b.titel ? ` „${b.titel}“` : ''} – siehe Aufgabentext und Lösungsbeschreibung]`;
  return '';
}

const bloecke = (liste) => (Array.isArray(liste) ? liste : liste ? [liste] : []).map(blockText).filter(Boolean).join('\n\n');

function antwortText(t, wert) {
  const a = t.antwort ?? { art: 'text' };
  const leer = '(keine Antwort)';
  switch (a.art) {
    case 'tabelle': {
      if (!wert || !Object.values(wert).some((v) => String(v).trim())) return leer;
      const zeilen = a.zeilen.map((r, i) => r.map((c, j) => (c === null ? `»${String(wert[`${i}:${j}`] ?? '').trim() || '–'}«` : String(c))));
      return blockText({ tabelle: { kopf: a.kopf, zeilen } }) + '\n(»…« = Eintrag des Prüflings, – = leer)';
    }
    case 'code':
      return String(wert ?? '').trim() ? `\`\`\`\n${wert}\n\`\`\`` : leer;
    default:
      return String(wert ?? '').trim() || leer;
  }
}

export function kiPrompt(pruefung, antworten) {
  const teile = kiTeile(pruefung);
  const abschnitte = [];
  let letzte = null;
  for (const { kurz: nr, max, aufgabe, teil: t, i } of teile) {
    if (letzte !== aufgabe.id) {
      const { satz } = pruefung.aufgaben[i];
      abschnitte.push(`\n=== ${i + 1}. Aufgabe: ${aufgabe.titel} ===`, `Situation: ${satz.situation}`);
      if (aufgabe.situation) abschnitte.push(aufgabe.situation);
      if (aufgabe.vorgaben) abschnitte.push(bloecke(aufgabe.vorgaben));
      letzte = aufgabe.id;
    }
    abschnitte.push(
      [
        `\n--- ${nr} (höchstens ${zahl(max)} Punkte) ---`,
        `AUFGABE:\n${t.text}`,
        t.vorgaben ? bloecke(t.vorgaben) : null,
        `ANTWORT DES PRÜFLINGS:\n${antwortText(t, antworten[teilSchluessel(aufgabe, t)])}`,
        `MUSTERLÖSUNG:\n${bloecke(t.loesung)}`,
        t.bewertung?.length ? `PUNKTESCHEMA:\n${t.bewertung.map((b) => `- ${b}`).join('\n')}` : null,
      ]
        .filter(Boolean)
        .join('\n\n'),
    );
  }
  return [
    'Du bist Mitglied eines IHK-Prüfungsausschusses (Fachinformatiker/in Anwendungsentwicklung) und korrigierst eine Probeprüfung.',
    '',
    'Regeln für die Bewertung:',
    '- Bewerte jede Teilaufgabe nach dem Punkteschema. Andere fachlich richtige Antworten zählen voll, auch wenn sie anders formuliert sind als die Musterlösung.',
    '- Bei „nennen“ zählen nur so viele Angaben, wie verlangt sind (die ersten).',
    '- Folgefehler werden nicht doppelt abgezogen.',
    '- Keine oder leere Antwort = 0.',
    '- Vergib ganze oder halbe Punkte, nie mehr als die Höchstpunkte.',
    '',
    'ANTWORTFORMAT – STRENG EINHALTEN:',
    'Antworte ausschließlich mit genau einer Zeile je Teilaufgabe in dieser Reihenfolge, Format <Nummer>:<Punkte>, halbe Punkte mit Komma.',
    'Kein weiterer Text, keine Begründung, keine Überschrift, keine Formatierung, kein Codeblock.',
    'Genau diese Zeilen (Höchstpunkte in Klammern, die Klammern NICHT mit ausgeben):',
    ...teile.map((x) => `${x.kurz}:<Punkte>   (max. ${zahl(x.max)})`),
    '',
    'Beispiel für eine korrekte Antwort:',
    ...teile.slice(0, 3).map((x, j) => `${x.kurz}:${zahl([x.max, Math.max(0, x.max - 1.5), 0][j])}`),
    '…',
    '',
    `Prüfung: ${pruefung.titel}`,
    ...abschnitte,
  ].join('\n');
}

// Liest die Antwort der KI. Ergebnis: { punkte } oder { fehler: [Text …] }
export function lesePunkte(text, pruefung) {
  const erwartet = new Map(kiTeile(pruefung).map((x) => [x.kurz, x]));
  const punkte = {};
  const fehler = [];
  const gesehen = new Set();
  const zeilen = String(text ?? '')
    .split('\n')
    .map((z) => z.trim())
    .filter((z) => z && !/^```/.test(z));
  for (const z of zeilen) {
    const m = z.match(/^(\d+[a-z]+)\s*:\s*(\d+(?:[.,]5|[.,]0)?)$/i);
    if (!m) {
      fehler.push(`Zeile „${z.length > 40 ? z.slice(0, 40) + '…' : z}“ hat nicht das Format Nummer:Punkte.`);
      continue;
    }
    const nr = m[1].toLowerCase();
    const x = erwartet.get(nr);
    if (!x) {
      fehler.push(`${nr} gibt es in dieser Prüfung nicht (oder wird von der App selbst bewertet).`);
      continue;
    }
    if (gesehen.has(nr)) {
      fehler.push(`${nr} steht doppelt.`);
      continue;
    }
    gesehen.add(nr);
    const wert = Number(m[2].replace(',', '.'));
    if (wert > x.max) {
      fehler.push(`${nr}: ${zahl(wert)} Punkte, höchstens ${zahl(x.max)} möglich.`);
      continue;
    }
    punkte[x.k] = wert;
  }
  const fehlen = [...erwartet.keys()].filter((nr) => !gesehen.has(nr));
  if (fehlen.length) fehler.push(`Es fehlen: ${fehlen.join(', ')}.`);
  return fehler.length ? { fehler } : { punkte };
}
