// KI-Korrektur ohne Internet in der App: Die App baut einen Text (Prüferauftrag, Aufgaben, eigene Antworten,
// Musterlösung, Punkteschema), den man selbst bei einer KI einfügt. Die KI antwortet mit einer Maschinenzeile
//   PUNKTE: 1a=4; 1b=5,5; 2a=?; …
// die die App wieder einliest. Werte werden auf 0 … Höchstpunkte begrenzt und auf halbe Punkte gerundet;
// „?“ (z. B. Zeichnungen auf Papier) bleibt offen. Rein, ohne Browser-Abhängigkeit (Tests).

import { teilSchluessel } from './generator.js';

export const kurz = (i, t) => `${i + 1}${t.nr}`;

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
  if (b.diagramm) return `[Diagramm${b.titel ? ` „${b.titel}“` : ''} – nur in der App sichtbar]`;
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
      return blockText({ tabelle: { kopf: a.kopf, zeilen } }) + '\n(»…« = Eintrag des Prüflings)';
    }
    case 'zahlen':
      return a.felder.map((f) => `${f.label}: ${String(wert?.[f.id] ?? '').trim() || '–'}${f.einheit ? ' ' + f.einheit : ''}`).join('\n');
    case 'auswahl': {
      const gewaehlt = a.mehrfach ? (wert ?? []) : wert === undefined || wert === null ? [] : [wert];
      return gewaehlt.length ? gewaehlt.map((i) => `☒ ${a.optionen[i]}`).join('\n') : leer;
    }
    case 'papier':
      return `ZEICHNUNG AUF PAPIER – nicht sichtbar.${String(wert ?? '').trim() ? ` Notizen: ${wert}` : ''}`;
    case 'code':
      return String(wert ?? '').trim() ? `\`\`\`\n${wert}\n\`\`\`` : leer;
    default:
      return String(wert ?? '').trim() || leer;
  }
}

export function kiPrompt(pruefung, antworten) {
  const teile = [];
  const keys = [];
  pruefung.aufgaben.forEach(({ satz, aufgabe }, i) => {
    teile.push(`\n==================== ${i + 1}. Aufgabe: ${aufgabe.titel} (${aufgabe.punkte} Punkte) ====================`);
    teile.push(`Situation: ${satz.situation}`);
    if (aufgabe.situation) teile.push(aufgabe.situation);
    if (aufgabe.vorgaben) teile.push(bloecke(aufgabe.vorgaben));
    for (const t of aufgabe.teile) {
      const k = kurz(i, t);
      keys.push(k);
      teile.push(
        [
          `\n---------- Teilaufgabe ${k} (höchstens ${String(t.punkte).replace('.', ',')} Punkte) ----------`,
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
  });
  return [
    'Du bist Mitglied eines IHK-Prüfungsausschusses (Fachinformatiker/in Anwendungsentwicklung) und korrigierst eine Probeprüfung.',
    'Bewerte jede Teilaufgabe streng, aber fair nach dem Punkteschema: Andere fachlich richtige Antworten zählen voll, auch wenn sie anders formuliert sind als die Musterlösung. Bei „nennen“ zählen nur so viele Angaben, wie verlangt sind (die ersten). Folgefehler werden nicht doppelt abgezogen. Vergib halbe Punkte, wo es passt.',
    'Bei Zeichnungen auf Papier siehst du die Antwort nicht – vergib dort „?“.',
    '',
    'Gib zuerst je Teilaufgabe eine kurze Begründung (1–3 Sätze: was fehlt oder falsch ist). Schreib danach als allerletzte Zeile genau eine Zeile in diesem Format, ohne Formatierung:',
    `PUNKTE: ${keys.map((k) => `${k}=<Punkte>`).join('; ')}`,
    '',
    `Prüfung: ${pruefung.titel}`,
    ...teile,
  ].join('\n');
}

// Liest die Maschinenzeile. Ergebnis: { punkte: { teilSchluessel: wert }, gelesen, offen, unbekannt }
export function lesePunkte(text, pruefung) {
  const zeile = String(text ?? '')
    .split('\n')
    .reverse()
    .find((z) => /PUNKTE\s*:/i.test(z));
  if (!zeile) return null;
  const nachKurz = new Map();
  pruefung.aufgaben.forEach(({ aufgabe }, i) => aufgabe.teile.forEach((t) => nachKurz.set(kurz(i, t), { k: teilSchluessel(aufgabe, t), max: t.punkte })));
  const punkte = {};
  const unbekannt = [];
  let offen = 0;
  for (const m of zeile.replace(/^.*PUNKTE\s*:/i, '').matchAll(/(\d+[a-z]+)\s*[=:]\s*(\?|-?\d+(?:[.,]\d+)?)/gi)) {
    const ziel = nachKurz.get(m[1].toLowerCase());
    if (!ziel) {
      unbekannt.push(m[1]);
      continue;
    }
    if (m[2] === '?') {
      offen++;
      continue;
    }
    const wert = Math.round(Number(m[2].replace(',', '.')) * 2) / 2;
    punkte[ziel.k] = Math.max(0, Math.min(ziel.max, wert));
  }
  return { punkte, gelesen: Object.keys(punkte).length, offen, unbekannt };
}
