// Aufgabenerzeuger des Pseudocode-Trainers. Alle Lösungen berechnet der Interpreter.

import { fuehreAus, formatiere } from './pseudo.js';
import { PROGRAMME, PUZZLES, FEHLER, fehlerCode } from './programme.js';
import { pruefeZahl, lesarten } from '../rahmen/pruefen.js';

export const imRaum = (liste, raum) => liste.filter((x) => x.raum.includes(raum));

// ---------- Werte vergleichen ----------

function normText(s) {
  return String(s ?? '')
    .trim()
    .replace(/^["'„“]|["'“”]$/g, '')
    .replace(/(\d),(\d)/g, '$1.$2')
    .replace(/\s+/g, ' ')
    .toLowerCase();
}

function normListe(s) {
  return String(s ?? '')
    .replace(/[[\]{}()]/g, '')
    .split(/[;,\s]+/)
    .filter(Boolean)
    .map((x) => x.replace(/^["']|["']$/g, ''));
}

export function pruefeWert(eingabe, erwartet) {
  const leer = String(eingabe ?? '').trim() === '';
  if (leer) return { ok: false, leer: true };
  if (typeof erwartet === 'number') return pruefeZahl(eingabe, { erwartet, stellen: Number.isInteger(erwartet) ? 0 : 2 });
  if (typeof erwartet === 'boolean') {
    const e = normText(eingabe);
    return { ok: (erwartet ? ['wahr', 'true', 'ja', '1'] : ['falsch', 'false', 'nein', '0']).includes(e) };
  }
  if (Array.isArray(erwartet)) {
    const teile = normListe(eingabe);
    if (teile.length !== erwartet.length) return { ok: false };
    return { ok: teile.every((t, i) => (typeof erwartet[i] === 'number' ? lesarten(t).some((x) => Math.abs(x - erwartet[i]) < 1e-9) : normText(t) === normText(erwartet[i]))) };
  }
  if (erwartet === null || erwartet === undefined) return { ok: ['null', '-', '–', 'leer', ''].includes(normText(eingabe)) };
  return { ok: normText(eingabe) === normText(erwartet) };
}

export function ausgabeText(ausgabe) {
  return ausgabe.join(' / ');
}

function pruefeAusgabe(eingabe, ausgabe) {
  const e = String(eingabe ?? '').trim();
  if (!e) return { ok: false, leer: true };
  const soll = ausgabe.map(normText);
  const ist = e.split(/\s*[/\n|]\s*/).map(normText);
  if (ist.length === soll.length && ist.every((x, i) => x === soll[i])) return { ok: true };
  // Nur der Zahlenwert genannt, wenn die Ausgabe genau eine Zahl enthält
  if (ausgabe.length === 1) {
    const zahlen = ausgabe[0].match(/-?\d+(?:,\d+)?/g);
    if (zahlen?.length === 1 && lesarten(e).some((x) => Math.abs(x - Number(zahlen[0].replace(',', '.'))) < 1e-9)) return { ok: true, hinweis: `vollständig: ${ausgabe[0]}` };
  }
  return { ok: false };
}

function feldFuer(id, wert, label) {
  return {
    id,
    label,
    imBild: true,
    typ: 'eigen',
    soll: Array.isArray(wert) ? formatiere(wert) : formatiere(wert),
    pruefe: (e) => pruefeWert(e, wert),
  };
}

// ---------- Schreibtischtest ----------

export function tabelleFuer(programm, eingaben) {
  const lauf = fuehreAus(programm.code, { eingaben });
  if (lauf.fehler) throw lauf.fehler;
  const ereignisse = programm.messEreignis === 'schleifenende' ? ['iterationsende'] : [programm.messEreignis ?? 'nach'];
  const zeilen = lauf.schritte.filter((s) => s.zeile === programm.messzeile && ereignisse.includes(s.ereignis)).map((s) => programm.spalten.map((sp) => sp.wert({ ...(s.global ?? {}), ...s.vars })));
  return { zeilen, ausgabe: lauf.ausgabe };
}

export function schreibtisch(r, raum = 'AP1') {
  const p = r.wahl(imRaum(PROGRAMME, raum));
  let eingaben;
  let tab;
  do {
    eingaben = p.eingaben(r);
    tab = tabelleFuer(p, eingaben);
  } while (tab.zeilen.length < 1 || tab.zeilen.length > 9);
  const felder = [];
  tab.zeilen.forEach((z, i) => z.forEach((w, j) => felder.push(feldFuer(`z${i}s${j}`, w, `Zeile ${i + 1}, ${p.spalten[j].titel}`))));
  felder.push({ id: 'aus', label: 'Ausgabe des Programms (mehrere Zeilen mit / trennen)', typ: 'eigen', breit: true, soll: ausgabeText(tab.ausgabe), pruefe: (e) => pruefeAusgabe(e, tab.ausgabe) });
  return {
    titel: p.titel,
    sp: raum === 'AP2' ? 'AP2-5-2-3' : 'AP1-8-2-3',
    text: `Führe einen Schreibtischtest durch. Startwerte: ${Object.entries(eingaben)
      .map(([k, v]) => `\`${k} = ${Array.isArray(v) ? `[${v.join(', ')}]` : typeof v === 'string' ? `"${v}"` : formatiere(v)}\``)
      .join(', ')}. Trage die Werte jedes Mal ein, wenn Zeile ${p.messzeile} ${p.messEreignis === 'schleifenende' ? 'einen Schleifendurchlauf abschließt' : 'ausgeführt wurde'}.`,
    code: p.code,
    markiere: [p.messzeile],
    spalten: p.spalten.map((s) => s.titel),
    zeilen: tab.zeilen,
    felder,
    loesung: [
      'Gehe den Code Zeile für Zeile durch und notiere jede Änderung.',
      ...tab.zeilen.map((z, i) => `Zeile ${i + 1}: ${p.spalten.map((s, j) => `${s.titel} = ${formatiere(z[j])}`).join(', ')}`),
      `Ausgabe: **${ausgabeText(tab.ausgabe) || '(keine)'}**`,
      'Tipp: Im Visualizer kannst du genau dieses Programm Schritt für Schritt ablaufen lassen.',
    ],
  };
}

// ---------- Code-Puzzle ----------

export function puzzleAusgaben(code, tests) {
  return tests.map((t) => {
    const l = fuehreAus(code, { eingaben: t, maxSchritte: 5000 });
    return l.fehler ? `Fehler: ${l.fehler.meldung}` : ausgabeText(l.ausgabe);
  });
}

export function puzzle(r, raum = 'AP1') {
  const p = r.wahl(imRaum(PUZZLES, raum));
  const zeilen = p.code.split('\n');
  let reihenfolge;
  do reihenfolge = r.mische(zeilen.map((_, i) => i));
  while (reihenfolge.every((x, i) => x === i));
  const soll = puzzleAusgaben(p.code, p.tests);
  return {
    titel: p.titel,
    sp: p.sp,
    text: `${p.aufgabe}\nBringe die Zeilen in die richtige Reihenfolge. Die Einrückung zeigt dir die Blockstruktur.`,
    puzzle: { zeilen, start: reihenfolge },
    felder: [
      {
        id: 'ordnung',
        imBild: true,
        typ: 'eigen',
        label: 'Reihenfolge',
        soll: zeilen.join('\n'),
        pruefe: (e) => {
          if (typeof e === 'string') return { ok: e === zeilen.join('\n') };
          const ordnung = e ?? reihenfolge;
          const code = ordnung.map((i) => zeilen[i]).join('\n');
          if (ordnung.every((x, i) => x === i)) return { ok: true };
          try {
            const ist = puzzleAusgaben(code, p.tests);
            return { ok: ist.every((x, i) => x === soll[i]) && !ist.some((x) => x.startsWith('Fehler')) };
          } catch (fehler) {
            return { ok: false, grund: fehler.message };
          }
        },
      },
    ],
    loesung: [`Richtige Reihenfolge:\n${zeilen.map((z) => `- \`${z.trim()}\``).join('\n')}`, 'Gleichwertige Reihenfolgen (z. B. vertauschte Startwerte) zählen auch: Geprüft wird, ob das Programm für mehrere Testeingaben dasselbe ausgibt.'],
  };
}

// ---------- Fehlersuche ----------

export function fehlersuche(r, raum = 'AP1') {
  const f = r.wahl(imRaum(FEHLER, raum));
  const falscherCode = fehlerCode(f);
  const zeilen = falscherCode.split('\n');
  const mitTests = raum === 'AP2' || r.ja(0.5);
  // Ein Aufruf genügt – und zwar einer, an dem sich der Fehler zeigt
  const alle = f.tests.map((args) => {
    const soll = fuehreAus(f.code, { aufruf: { name: f.aufruf, args } });
    const ist = fuehreAus(falscherCode, { aufruf: { name: f.aufruf, args } });
    return { args, soll: soll.rueckgabe, ist: ist.fehler ? 'Fehler' : ist.rueckgabe, istFehler: ist.fehler?.meldung };
  });
  const tests = [alle.find((t) => t.ist === 'Fehler' || JSON.stringify(t.soll) !== JSON.stringify(t.ist)) ?? alle[0]];
  const korrekt = f.code.split('\n')[f.zeile - 1];
  const felder = [];
  if (mitTests)
    tests.forEach((t, i) => {
      felder.push({ id: `soll${i}`, label: 'Soll', typ: 'eigen', soll: formatiere(t.soll), pruefe: (e) => pruefeWert(e, t.soll), imBild: true });
      felder.push({ id: `ist${i}`, label: 'Ist', typ: 'eigen', soll: t.ist === 'Fehler' ? 'Fehler' : formatiere(t.ist), pruefe: (e) => (t.ist === 'Fehler' ? { ok: /fehler|error|abbruch|absturz|abst[üu]rz|exception|crash|au(ss|ß)erhalb|out of/i.test(String(e)), leer: !e } : pruefeWert(e, t.ist)), imBild: true });
    });
  felder.push({ id: 'zeile', label: 'Fehlerhafte Zeile', typ: 'auswahl', erwartet: String(f.zeile), optionen: zeilen.map((_, i) => ({ wert: String(i + 1), text: `Zeile ${i + 1}` })) });
  return {
    titel: 'Fehler im Code finden',
    sp: raum === 'AP2' ? 'AP2-5-2-3' : 'AP1-8-2-4',
    text: `${f.beschreibung} Der Code enthält **einen inhaltlichen Fehler**.${mitTests ? ' Trage für den Aufruf ein, was herauskommen sollte und was der Code tatsächlich liefert, und finde dann die fehlerhafte Zeile.' : ' Finde die fehlerhafte Zeile.'}`,
    code: falscherCode,
    tests: mitTests ? tests.map((t) => ({ aufruf: `${f.aufruf}(${t.args.map((a) => formatiere(a)).join(', ')})` })) : null,
    felder,
    loesung: [
      ...(mitTests ? tests.map((t) => `${f.aufruf}(${t.args.map(formatiere).join(', ')}): Soll ${formatiere(t.soll)}, Ist ${t.ist === 'Fehler' ? `Fehler (${t.istFehler})` : formatiere(t.ist)}`) : []),
      `Fehler in **Zeile ${f.zeile}**: \`${f.falsch.trim()}\``,
      `Richtig: \`${korrekt.trim()}\``,
      'Ein inhaltlicher (semantischer) Fehler: Das Programm läuft, liefert aber ein falsches Ergebnis.',
    ],
  };
}

// ---------- Suchen und Sortieren ----------

export function sortierSchritte(art, a) {
  const x = [...a];
  const schritte = [];
  const n = x.length;
  if (art === 'bubble') {
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - 1 - i; j++) if (x[j] > x[j + 1]) [x[j], x[j + 1]] = [x[j + 1], x[j]];
      schritte.push([...x]);
    }
  } else if (art === 'selection') {
    for (let i = 0; i < n - 1; i++) {
      let m = i;
      for (let j = i + 1; j < n; j++) if (x[j] < x[m]) m = j;
      [x[i], x[m]] = [x[m], x[i]];
      schritte.push([...x]);
    }
  } else {
    for (let i = 1; i < n; i++) {
      const k = x[i];
      let j = i - 1;
      while (j >= 0 && x[j] > k) {
        x[j + 1] = x[j];
        j--;
      }
      x[j + 1] = k;
      schritte.push([...x]);
    }
  }
  return schritte;
}

const VERFAHREN = {
  bubble: { name: 'Bubble Sort', idee: 'Benachbarte Elemente vergleichen und tauschen; nach jedem Durchlauf steht das größte Element des unsortierten Teils hinten.' },
  selection: { name: 'Selection Sort', idee: 'Im unsortierten Rest das kleinste Element suchen und mit dem ersten Element des Rests tauschen.' },
  insertion: { name: 'Insertion Sort', idee: 'Das nächste Element nehmen und links an der richtigen Stelle in den sortierten Teil einfügen.' },
};

export function sortieren(r) {
  const art = r.wahl(['schritte', 'schritte', 'erkennen', 'binaer']);
  if (art === 'binaer') {
    const a = [...new Set(Array.from({ length: 14 }, () => r.ganz(1, 80)))].sort((x, y) => x - y).slice(0, 9);
    const gesucht = r.ja(0.7) ? r.wahl(a) : r.ganz(1, 80);
    const mitten = [];
    let l = 0;
    let h = a.length - 1;
    let pos = -1;
    while (l <= h) {
      const m = Math.floor((l + h) / 2);
      mitten.push(m);
      if (a[m] === gesucht) {
        pos = m;
        break;
      }
      if (a[m] < gesucht) l = m + 1;
      else h = m - 1;
    }
    return {
      titel: 'Binäre Suche',
      sp: 'AP2-3-2-3',
      text: `Das sortierte Array lautet \`[${a.join(', ')}]\` (Index ab 0). Gesucht wird **${gesucht}**. Die Mitte ist \`(links + rechts) DIV 2\`. Welche Indizes werden nacheinander als Mitte geprüft, und welche Position wird geliefert (−1, wenn nicht gefunden)?`,
      felder: [
        { id: 'mitten', label: 'Geprüfte Mitten (z. B. 4, 6, 5)', typ: 'eigen', breit: true, soll: mitten.join(', '), pruefe: (e) => pruefeWert(e, mitten) },
        { id: 'pos', label: 'Ergebnis', erwartet: pos },
      ],
      loesung: [...mitten.map((m, i) => `${i + 1}. Mitte ${m}: a[${m}] = ${a[m]} ${a[m] === gesucht ? '= gesucht → gefunden' : a[m] < gesucht ? '< gesucht → rechts weitersuchen' : '> gesucht → links weitersuchen'}`), `Ergebnis: **${pos}**`, 'Die binäre Suche funktioniert nur auf sortierten Daten und halbiert den Suchbereich in jedem Schritt.'],
    };
  }
  const verfahren = r.wahl(['bubble', 'selection', 'insertion']);
  let a;
  do a = Array.from({ length: r.ganz(5, 6) }, () => r.ganz(1, 50));
  while (new Set(a).size < a.length);
  const schritte = sortierSchritte(verfahren, a);
  if (art === 'erkennen') {
    const zeige = schritte.slice(0, 2);
    // Eindeutig? Prüfen, ob ein anderes Verfahren dieselben ersten Schritte liefert
    const passend = Object.keys(VERFAHREN).filter((v) => {
      const s = sortierSchritte(v, a);
      return zeige.every((z, i) => z.join() === s[i]?.join());
    });
    if (passend.length > 1) return sortieren(r);
    return {
      titel: 'Sortierverfahren erkennen',
      sp: 'AP2-3-2-3',
      text: `Ausgangsfolge: \`[${a.join(', ')}]\`\n${zeige.map((z, i) => `- nach Durchlauf ${i + 1}: \`[${z.join(', ')}]\``).join('\n')}\nWelches Verfahren wurde angewendet?`,
      felder: [{ id: 'v', label: 'Verfahren', typ: 'auswahl', erwartet: VERFAHREN[verfahren].name, optionen: Object.values(VERFAHREN).map((v) => v.name) }],
      loesung: [...Object.values(VERFAHREN).map((v) => `${v.name}: ${v.idee}`), `Hier: **${VERFAHREN[verfahren].name}**`],
    };
  }
  return {
    titel: VERFAHREN[verfahren].name,
    sp: 'AP2-3-2-3',
    text: `Sortiere \`[${a.join(', ')}]\` aufsteigend mit **${VERFAHREN[verfahren].name}**. Wie sieht das Array nach jedem Durchlauf der äußeren Schleife aus?\n${VERFAHREN[verfahren].idee}`,
    felder: schritte.map((s, i) => ({ id: `d${i}`, label: `nach Durchlauf ${i + 1}`, typ: 'eigen', soll: s.join(', '), platzhalter: 'z. B. 3, 7, 1, …', pruefe: (e) => pruefeWert(e, s) })),
    loesung: [`Start: ${a.join(', ')}`, ...schritte.map((s, i) => `Durchlauf ${i + 1}: ${s.join(', ')}`)],
  };
}

export const ERZEUGER = { schreibtisch, puzzle, fehler: fehlersuche, sortieren };
