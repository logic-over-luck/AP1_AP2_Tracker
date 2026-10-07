// Interpreter für Pseudocode in deutscher Schreibweise, wie in IHK-Prüfungen.
// Rein und ohne Browser-Abhängigkeit; getestet in tests/pseudo.test.mjs.
//
// Sprachumfang (Groß-/Kleinschreibung egal):
//   Zuweisung        x = 5   ·   x ← 5   ·   x := 5   ·   GANZZAHL x = 5   ·   x += 1
//   Ausgabe          AUSGABE "Summe: ", s
//   Verzweigung      WENN … DANN / SONST WENN … DANN / SONST / ENDE WENN
//   Zählschleife     FÜR i = 0 BIS 9 [SCHRITT 2] … ENDE FÜR     ·   FÜR JEDES x IN liste … ENDE FÜR
//   Kopfgesteuert    SOLANGE … [TUE] … ENDE SOLANGE
//   Fußgesteuert     WIEDERHOLE … BIS bedingung   ·   WIEDERHOLE … SOLANGE bedingung
//   Funktionen       FUNKTION name(a, b) … RÜCKGABE x … ENDE FUNKTION   (auch PROZEDUR)
//   Operatoren       + − * /  DIV (ganzzahlig)  MOD  ·  = == != <> < <= > >=  ·  UND ODER NICHT
//   Werte            Zahlen, "Text", WAHR/FALSCH, [1, 2, 3], NULL
//   Listen           a[i] (Index ab 0), LÄNGE(a), a.länge, a.add(x), a.size(), a.get(i)
// In Bedingungen bedeutet = Vergleich; als eigene Anweisung bedeutet = Zuweisung.

export class PseudoFehler extends Error {
  constructor(meldung, zeile) {
    super(zeile ? `Zeile ${zeile}: ${meldung}` : meldung);
    this.zeile = zeile;
    this.meldung = meldung;
  }
}

const TYPEN = 'GANZZAHL|KOMMAZAHL|ZAHL|TEXT|ZEICHENKETTE|STRING|BOOLEAN|BOOL|WAHRHEITSWERT|INT|INTEGER|FLOAT|DOUBLE|REAL|VAR|LISTE|ARRAY|FELD|ZEICHEN|CHAR';
const ZUWEISUNG = '(?:=|←|:=|<-)';
const BEZ = '[A-Za-zÄÖÜäöüß_][A-Za-zÄÖÜäöüß_0-9]*';

// ---------- Lexer für Ausdrücke ----------

const SCHLUESSEL = new Set(['UND', 'ODER', 'NICHT', 'DIV', 'MOD', 'WAHR', 'FALSCH', 'NULL', 'AND', 'OR', 'NOT', 'TRUE', 'FALSE', 'NIL']);

export function zerlege(text, zeile) {
  const t = [];
  let i = 0;
  while (i < text.length) {
    const c = text[i];
    if (/\s/.test(c)) {
      i++;
      continue;
    }
    if (c === '/' && text[i + 1] === '/') break; // Kommentar
    if (/\d/.test(c) || (c === '.' && /\d/.test(text[i + 1] ?? ''))) {
      const m = text.slice(i).match(/^\d*\.?\d+(?:[eE][+-]?\d+)?/);
      t.push({ art: 'zahl', wert: Number(m[0]) });
      i += m[0].length;
      continue;
    }
    if (c === '"' || c === "'" || c === '„' || c === '“') {
      const ende = c === '„' ? '“' : c === '“' ? '”' : c;
      let j = i + 1;
      let s = '';
      while (j < text.length && text[j] !== ende && !(c === '„' && text[j] === '"')) s += text[j++];
      if (j >= text.length) throw new PseudoFehler('Text ohne schließendes Anführungszeichen', zeile);
      t.push({ art: 'text', wert: s });
      i = j + 1;
      continue;
    }
    const wort = text.slice(i).match(new RegExp(`^${BEZ}`));
    if (wort) {
      const w = wort[0];
      const gross = w.toUpperCase();
      if (SCHLUESSEL.has(gross)) t.push({ art: 'op', wert: { AND: 'UND', OR: 'ODER', NOT: 'NICHT', TRUE: 'WAHR', FALSE: 'FALSCH', NIL: 'NULL' }[gross] ?? gross });
      else t.push({ art: 'name', wert: w });
      i += w.length;
      continue;
    }
    const zwei = text.slice(i, i + 2);
    if (['==', '!=', '<>', '<=', '>=', '&&', '||'].includes(zwei)) {
      t.push({ art: 'op', wert: { '&&': 'UND', '||': 'ODER' }[zwei] ?? zwei });
      i += 2;
      continue;
    }
    const einzeln = { '≤': '<=', '≥': '>=', '≠': '!=', '−': '-', '·': '*', '×': '*', '÷': '/', '!': 'NICHT' };
    if (einzeln[c]) {
      t.push({ art: 'op', wert: einzeln[c] });
      i++;
      continue;
    }
    if ('+-*/%<>=()[],.'.includes(c)) {
      t.push({ art: 'op', wert: c });
      i++;
      continue;
    }
    throw new PseudoFehler(`Unbekanntes Zeichen „${c}"`, zeile);
  }
  return t;
}

// ---------- Ausdrucks-Parser (Pratt) ----------

const RANG = { ODER: 1, UND: 2, '=': 4, '==': 4, '!=': 4, '<>': 4, '<': 4, '<=': 4, '>': 4, '>=': 4, '+': 5, '-': 5, '*': 6, '/': 6, DIV: 6, MOD: 6, '%': 6, '//': 6 };

export function parseAusdruck(text, zeile) {
  const t = zerlege(text, zeile);
  let p = 0;
  const sieh = () => t[p];
  const nimm = () => t[p++];
  const erwarte = (wert) => {
    const x = nimm();
    if (!x || x.wert !== wert) throw new PseudoFehler(`„${wert}" erwartet`, zeile);
  };
  const ausdruck = (minRang = 0) => {
    let links = praefix();
    for (;;) {
      const x = sieh();
      if (!x || x.art !== 'op') break;
      const r = RANG[x.wert];
      if (r === undefined || r <= minRang) break;
      nimm();
      const rechts = ausdruck(r);
      links = { art: 'bin', op: x.wert, links, rechts };
    }
    return links;
  };
  const praefix = () => {
    const x = nimm();
    if (!x) throw new PseudoFehler('Ausdruck unvollständig', zeile);
    let knoten;
    if (x.art === 'zahl' || x.art === 'text') knoten = { art: 'wert', wert: x.wert };
    else if (x.art === 'op' && x.wert === 'WAHR') knoten = { art: 'wert', wert: true };
    else if (x.art === 'op' && x.wert === 'FALSCH') knoten = { art: 'wert', wert: false };
    else if (x.art === 'op' && x.wert === 'NULL') knoten = { art: 'wert', wert: null };
    else if (x.art === 'op' && x.wert === 'NICHT') knoten = { art: 'nicht', wert: ausdruck(3) };
    else if (x.art === 'op' && x.wert === '-') knoten = { art: 'neg', wert: ausdruck(6.5) };
    else if (x.art === 'op' && x.wert === '+') knoten = ausdruck(6.5);
    else if (x.art === 'op' && x.wert === '(') {
      knoten = ausdruck();
      erwarte(')');
    } else if (x.art === 'op' && x.wert === '[') {
      const elemente = [];
      if (sieh()?.wert !== ']') {
        do elemente.push(ausdruck());
        while (sieh()?.wert === ',' && nimm());
      }
      erwarte(']');
      knoten = { art: 'liste', elemente };
    } else if (x.art === 'name') knoten = { art: 'name', name: x.wert };
    else throw new PseudoFehler(`Unerwartet: „${x.wert}"`, zeile);
    // Nachgestellt: Aufruf, Index, Eigenschaft
    for (;;) {
      const n = sieh();
      if (n?.wert === '(' && (knoten.art === 'name' || knoten.art === 'eig')) {
        nimm();
        const args = [];
        if (sieh()?.wert !== ')') {
          do args.push(ausdruck());
          while (sieh()?.wert === ',' && nimm());
        }
        erwarte(')');
        knoten = { art: 'aufruf', ziel: knoten, args };
      } else if (n?.wert === '[') {
        nimm();
        const index = ausdruck();
        erwarte(']');
        knoten = { art: 'index', ziel: knoten, index };
      } else if (n?.wert === '.' && t[p + 1]?.art === 'name') {
        nimm();
        knoten = { art: 'eig', ziel: knoten, name: nimm().wert };
      } else break;
    }
    return knoten;
  };
  const e = ausdruck();
  if (p < t.length) throw new PseudoFehler(`Unerwartet: „${t[p].wert}"`, zeile);
  return e;
}

// ---------- Anweisungs-Parser ----------

function einzug(zeile) {
  return zeile.match(/^\s*/)[0].replace(/\t/g, '    ').length;
}

export function parse(quelltext) {
  const roh = quelltext.replace(/\r/g, '').split('\n');
  const zeilen = roh.map((text, i) => ({ nr: i + 1, text: text.replace(/\/\/.*$/, '').trimEnd(), einzug: einzug(text) })).filter((z) => z.text.trim() !== '');
  let p = 0;
  const funktionen = {};

  const block = (enden) => {
    const anweisungen = [];
    while (p < zeilen.length) {
      const z = zeilen[p];
      const t = z.text.trim();
      if (enden.some((e) => e.test(t))) return anweisungen;
      p++;
      anweisungen.push(anweisung(z, t));
    }
    if (enden.length) throw new PseudoFehler(`Block nicht abgeschlossen (erwartet: ${enden.map((e) => e.source.replace(/[\^$\\s*+?()|]/g, ' ').replace(/\s+/g, ' ').trim()).join(' oder ')})`, zeilen.at(-1)?.nr);
    return anweisungen;
  };

  const anweisung = (z, t) => {
    const nr = z.nr;
    let m;
    if ((m = t.match(/^WENN\s+(.+?)(?:\s+DANN)?:?$/i))) {
      const zweige = [{ bed: parseAusdruck(m[1], nr), rumpf: block([/^SONST\b/i, /^ENDE\s*WENN$/i]), zeile: nr }];
      let sonst = null;
      for (;;) {
        const e = zeilen[p];
        const et = e.text.trim();
        p++;
        if ((m = et.match(/^SONST\s*WENN\s+(.+?)(?:\s+DANN)?:?$/i))) zweige.push({ bed: parseAusdruck(m[1], e.nr), rumpf: block([/^SONST\b/i, /^ENDE\s*WENN$/i]), zeile: e.nr });
        else if (/^SONST:?$/i.test(et)) sonst = block([/^ENDE\s*WENN$/i]);
        else if (/^ENDE\s*WENN$/i.test(et)) break;
        else throw new PseudoFehler('SONST oder ENDE WENN erwartet', e.nr);
      }
      return { art: 'wenn', zeile: nr, zweige, sonst };
    }
    if ((m = t.match(new RegExp(`^F(?:Ü|UE)R\\s+JEDE[SNMR]?\\s+(${BEZ})\\s+(?:IN|AUS)\\s+(.+?):?$`, 'i')))) {
      const rumpf = block([/^ENDE\s*F(Ü|UE)R$/i]);
      p++;
      return { art: 'fuerJedes', zeile: nr, var: m[1], liste: parseAusdruck(m[2], nr), rumpf };
    }
    if ((m = t.match(new RegExp(`^F(?:Ü|UE)R\\s+(${BEZ})\\s*(?:${ZUWEISUNG}|VON)\\s*(.+?)\\s+BIS\\s+(.+?)(?:\\s+SCHRITT(?:WEITE)?\\s+(.+?))?:?$`, 'i')))) {
      const rumpf = block([/^ENDE\s*F(Ü|UE)R$/i]);
      p++;
      return { art: 'fuer', zeile: nr, var: m[1], von: parseAusdruck(m[2], nr), bis: parseAusdruck(m[3], nr), schritt: m[4] ? parseAusdruck(m[4], nr) : null, rumpf };
    }
    if ((m = t.match(/^SOLANGE\s+(.+?)(?:\s+(?:TUE|WIEDERHOLE|MACHE|DO))?:?$/i))) {
      const rumpf = block([/^ENDE\s*SOLANGE$/i]);
      p++;
      return { art: 'solange', zeile: nr, bed: parseAusdruck(m[1], nr), rumpf };
    }
    if (/^(WIEDERHOLE|TUE|MACHE):?$/i.test(t)) {
      const meinEinzug = z.einzug;
      const rumpf = [];
      while (p < zeilen.length) {
        const e = zeilen[p];
        const et = e.text.trim();
        if (e.einzug <= meinEinzug && /^(BIS|SOLANGE)\s+/i.test(et)) break;
        p++;
        rumpf.push(anweisung(e, et));
      }
      const ende = zeilen[p];
      if (!ende) throw new PseudoFehler('WIEDERHOLE ohne BIS bzw. SOLANGE', nr);
      p++;
      const em = ende.text.trim().match(/^(BIS|SOLANGE)\s+(.+?)$/i);
      return { art: 'wiederhole', zeile: nr, endZeile: ende.nr, bis: em[1].toUpperCase() === 'BIS', bed: parseAusdruck(em[2], ende.nr), rumpf };
    }
    if ((m = t.match(new RegExp(`^(FUNKTION|PROZEDUR|METHODE|FUNCTION)\\s+(${BEZ})\\s*\\((.*?)\\)(?:\\s*:\\s*.+)?:?$`, 'i')))) {
      const params = m[3]
        .split(',')
        .map((x) => x.trim())
        .filter(Boolean)
        .map((x) => {
          const teile = x.replace(/:\s*\S+$/, '').trim().split(/\s+/);
          return teile[teile.length - 1].replace(/\[\]$/, '');
        });
      const rumpf = block([/^ENDE\s*(FUNKTION|PROZEDUR|METHODE|FUNCTION)$/i]);
      p++;
      funktionen[m[2].toLowerCase()] = { name: m[2], params, rumpf, zeile: nr };
      return { art: 'leer', zeile: nr };
    }
    if ((m = t.match(/^(?:R(?:Ü|UE)CKGABE|GIB\s+ZUR(?:Ü|UE)CK|RETURN|ZUR(?:Ü|UE)CK)\s*:?\s*(.*)$/i))) {
      return { art: 'rueckgabe', zeile: nr, wert: m[1] ? parseAusdruck(m[1], nr) : null };
    }
    if ((m = t.match(/^(?:AUSGABE|AUSGEBEN|SCHREIBE|DRUCKE|PRINT)\b\s*:?\s*(.*)$/i))) {
      let rest = m[1].trim();
      if (rest.startsWith('(') && schliessendeKlammer(rest, 0) === rest.length - 1) rest = rest.slice(1, -1);
      return { art: 'ausgabe', zeile: nr, werte: teileArgumente(rest).map((a) => parseAusdruck(a, nr)) };
    }
    if (/^(ABBRUCH|BREAK|VERLASSE\s+SCHLEIFE)$/i.test(t)) return { art: 'abbruch', zeile: nr };
    if ((m = t.match(new RegExp(`^(?:(?:${TYPEN})(?:\\[\\])?\\s+)?(${BEZ}(?:\\s*\\[.+\\])?)\\s*(\\+=|-=|\\*=|${ZUWEISUNG})\\s*(.+)$`, 'i')))) {
      const ziel = parseAusdruck(m[1], nr);
      if (!['name', 'index', 'eig'].includes(ziel.art)) throw new PseudoFehler('Zuweisung an diesen Ausdruck nicht möglich', nr);
      let wert = parseAusdruck(m[3], nr);
      if (['+=', '-=', '*='].includes(m[2])) wert = { art: 'bin', op: m[2][0], links: ziel, rechts: wert };
      return { art: 'zuweisung', zeile: nr, ziel, wert };
    }
    if ((m = t.match(new RegExp(`^(?:${TYPEN})(?:\\[\\])?\\s+(${BEZ})$`, 'i')))) {
      return { art: 'zuweisung', zeile: nr, ziel: { art: 'name', name: m[1] }, wert: { art: 'wert', wert: /\[\]/.test(t) ? [] : null }, deklaration: true };
    }
    if (/^ENDE\b|^SONST\b|^BIS\b/i.test(t)) throw new PseudoFehler(`„${t}" passt zu keinem offenen Block`, nr);
    // Ausdruck als Anweisung (z. B. Aufruf)
    const e = parseAusdruck(t, nr);
    if (e.art !== 'aufruf') throw new PseudoFehler(`Anweisung nicht verstanden: „${t}"`, nr);
    return { art: 'aufrufAnw', zeile: nr, ausdruck: e };
  };

  const programm = block([]);
  return { programm, funktionen };
}

function schliessendeKlammer(text, start) {
  let tiefe = 0;
  let inText = null;
  for (let i = start; i < text.length; i++) {
    const c = text[i];
    if (inText) {
      if (c === inText) inText = null;
      continue;
    }
    if (c === '"' || c === "'") inText = c;
    else if (c === '(') tiefe++;
    else if (c === ')' && --tiefe === 0) return i;
  }
  return -1;
}

function teileArgumente(text) {
  const teile = [];
  let tiefe = 0;
  let s = '';
  let inText = null;
  for (const c of text) {
    if (inText) {
      s += c;
      if (c === inText) inText = null;
      continue;
    }
    if (c === '"' || c === "'") inText = c;
    if (c === '„') inText = '“';
    if ('([' .includes(c)) tiefe++;
    if (')]'.includes(c)) tiefe--;
    if (c === ',' && tiefe === 0) {
      teile.push(s.trim());
      s = '';
    } else s += c;
  }
  if (s.trim()) teile.push(s.trim());
  return teile;
}

// ---------- Ausführung ----------

class Rueckgabe {
  constructor(wert) {
    this.wert = wert;
  }
}
class Abbruch {}

export function formatiere(w) {
  if (w === null || w === undefined) return 'NULL';
  if (w === true) return 'WAHR';
  if (w === false) return 'FALSCH';
  if (typeof w === 'number') {
    if (Number.isInteger(w)) return String(w);
    return String(Math.round(w * 1e10) / 1e10).replace('.', ',');
  }
  if (Array.isArray(w)) return `[${w.map(formatiere).join(', ')}]`;
  if (typeof w === 'string') return w;
  return String(w);
}

function kopie(w) {
  if (Array.isArray(w)) return w.map(kopie);
  return w;
}

// Führt ein Programm aus und liefert die Schritte (für Visualizer und Schreibtischtest).
// optionen: { eingaben: { name: wert }, maxSchritte, aufruf: { name, args } }
export function fuehreAus(quelltext, optionen = {}) {
  const { programm, funktionen } = parse(quelltext);
  const max = optionen.maxSchritte ?? 20000;
  const schritte = [];
  const ausgabe = [];
  const global = new Map(Object.entries(optionen.eingaben ?? {}).map(([k, v]) => [k, kopie(v)]));
  const stapel = [{ name: 'Hauptprogramm', vars: global }];
  let zaehler = 0;

  const aktuell = () => stapel[stapel.length - 1];
  const finde = (name) => {
    const f = aktuell();
    if (f.vars.has(name)) return f.vars;
    if (global.has(name)) return global;
    const klein = name.toLowerCase();
    for (const k of f.vars.keys()) if (k.toLowerCase() === klein) return f.vars;
    for (const k of global.keys()) if (k.toLowerCase() === klein) return global;
    return null;
  };
  const lies = (name, zeile) => {
    const m = finde(name);
    if (!m) throw new PseudoFehler(`Variable „${name}" ist nicht belegt`, zeile);
    const echt = [...m.keys()].find((k) => k === name) ?? [...m.keys()].find((k) => k.toLowerCase() === name.toLowerCase());
    return m.get(echt);
  };
  const schreibe = (name, wert) => {
    const m = finde(name);
    if (m) {
      const echt = [...m.keys()].find((k) => k.toLowerCase() === name.toLowerCase());
      m.set(echt, wert);
    } else aktuell().vars.set(name, wert);
  };
  const protokoll = (zeile, ereignis, extra = {}) => {
    if (++zaehler > max) throw new PseudoFehler(`Mehr als ${max} Schritte – vermutlich eine Endlosschleife`, zeile);
    const f = aktuell();
    schritte.push({
      zeile,
      ereignis,
      ebene: stapel.length - 1,
      funktion: f.name,
      vars: Object.fromEntries([...f.vars].map(([k, v]) => [k, kopie(v)])),
      global: stapel.length > 1 ? Object.fromEntries([...global].map(([k, v]) => [k, kopie(v)])) : null,
      ausgabe: [...ausgabe],
      ...extra,
    });
  };

  const zahl = (w, zeile, was) => {
    if (typeof w !== 'number') throw new PseudoFehler(`${was} braucht eine Zahl, bekam ${formatiere(w)}`, zeile);
    return w;
  };

  const werte = (e, zeile) => {
    switch (e.art) {
      case 'wert':
        return e.wert;
      case 'liste':
        return e.elemente.map((x) => werte(x, zeile));
      case 'name':
        return lies(e.name, zeile);
      case 'nicht':
        return !wahr(werte(e.wert, zeile), zeile);
      case 'neg':
        return -zahl(werte(e.wert, zeile), zeile, 'Minus');
      case 'index': {
        const ziel = werte(e.ziel, zeile);
        const i = werte(e.index, zeile);
        if (typeof ziel === 'string') {
          if (i < 0 || i >= ziel.length) throw new PseudoFehler(`Index ${i} liegt außerhalb des Textes (Länge ${ziel.length})`, zeile);
          return ziel[i];
        }
        if (!Array.isArray(ziel)) throw new PseudoFehler('Index nur bei Listen und Arrays möglich', zeile);
        if (!Number.isInteger(i) || i < 0 || i >= ziel.length) throw new PseudoFehler(`Index ${formatiere(i)} liegt außerhalb des Arrays (gültig: 0 bis ${ziel.length - 1})`, zeile);
        return ziel[i];
      }
      case 'eig': {
        const ziel = werte(e.ziel, zeile);
        const n = e.name.toLowerCase();
        if (['länge', 'laenge', 'length', 'anzahl', 'size'].includes(n)) return ziel.length;
        throw new PseudoFehler(`Unbekannte Eigenschaft „${e.name}"`, zeile);
      }
      case 'aufruf':
        return rufe(e, zeile);
      case 'bin':
        return binaer(e, zeile);
      default:
        throw new PseudoFehler('Ausdruck nicht auswertbar', zeile);
    }
  };

  const wahr = (w, zeile) => {
    if (typeof w !== 'boolean') throw new PseudoFehler(`Bedingung muss WAHR oder FALSCH ergeben, ergab ${formatiere(w)}`, zeile);
    return w;
  };

  const gleich = (a, b) => (typeof a === 'number' && typeof b === 'number' ? Math.abs(a - b) < 1e-9 : a === b);

  const binaer = (e, zeile) => {
    if (e.op === 'UND') return wahr(werte(e.links, zeile), zeile) && wahr(werte(e.rechts, zeile), zeile);
    if (e.op === 'ODER') return wahr(werte(e.links, zeile), zeile) || wahr(werte(e.rechts, zeile), zeile);
    const a = werte(e.links, zeile);
    const b = werte(e.rechts, zeile);
    switch (e.op) {
      case '+':
        if (typeof a === 'string' || typeof b === 'string') return formatiere(a) + formatiere(b);
        return zahl(a, zeile, '+') + zahl(b, zeile, '+');
      case '-':
        return zahl(a, zeile, '−') - zahl(b, zeile, '−');
      case '*':
        return zahl(a, zeile, '*') * zahl(b, zeile, '*');
      case '/':
        if (zahl(b, zeile, '/') === 0) throw new PseudoFehler('Division durch null', zeile);
        return zahl(a, zeile, '/') / b;
      case 'DIV':
      case '//':
        if (zahl(b, zeile, 'DIV') === 0) throw new PseudoFehler('Division durch null', zeile);
        return Math.trunc(zahl(a, zeile, 'DIV') / b);
      case 'MOD':
      case '%':
        if (zahl(b, zeile, 'MOD') === 0) throw new PseudoFehler('Division durch null', zeile);
        return zahl(a, zeile, 'MOD') % b;
      case '=':
      case '==':
        return gleich(a, b);
      case '!=':
      case '<>':
        return !gleich(a, b);
      case '<':
        return a < b;
      case '<=':
        return a < b || gleich(a, b);
      case '>':
        return a > b;
      case '>=':
        return a > b || gleich(a, b);
      default:
        throw new PseudoFehler(`Operator ${e.op} unbekannt`, zeile);
    }
  };

  const EINGEBAUT = {
    länge: (a) => a.length,
    laenge: (a) => a.length,
    len: (a) => a.length,
    abs: (x) => Math.abs(x),
    runden: (x, n = 0) => Math.round(x * 10 ** n) / 10 ** n,
    abrunden: (x) => Math.floor(x),
    aufrunden: (x) => Math.ceil(x),
    ganzzahl: (x) => Math.trunc(x),
    wurzel: (x) => Math.sqrt(x),
    min: (...x) => Math.min(...x),
    max: (...x) => Math.max(...x),
    text: (x) => formatiere(x),
    zahl: (x) => Number(String(x).replace(',', '.')),
    neueliste: () => [],
  };

  const rufe = (e, zeile) => {
    const args = e.args.map((a) => werte(a, zeile));
    if (e.ziel.art === 'eig') {
      const obj = werte(e.ziel.ziel, zeile);
      const n = e.ziel.name.toLowerCase();
      if (!Array.isArray(obj) && typeof obj !== 'string') throw new PseudoFehler(`Methode „${e.ziel.name}" nur bei Listen`, zeile);
      if (['add', 'hinzufügen', 'hinzufuegen', 'anhängen', 'append', 'push'].includes(n)) {
        obj.push(kopie(args[0]));
        return null;
      }
      if (['size', 'länge', 'laenge', 'length', 'anzahl', 'count'].includes(n)) return obj.length;
      if (['get', 'hole'].includes(n)) {
        if (args[0] < 0 || args[0] >= obj.length) throw new PseudoFehler(`Index ${args[0]} außerhalb der Liste`, zeile);
        return obj[args[0]];
      }
      if (['set', 'setze'].includes(n)) {
        obj[args[0]] = args[1];
        return null;
      }
      if (['contains', 'enthält', 'enthaelt'].includes(n)) return obj.some((x) => gleich(x, args[0]));
      if (['isempty', 'istleer'].includes(n)) return obj.length === 0;
      if (['remove', 'entferne'].includes(n)) {
        obj.splice(args[0], 1);
        return null;
      }
      throw new PseudoFehler(`Unbekannte Methode „${e.ziel.name}"`, zeile);
    }
    const name = e.ziel.name;
    const f = funktionen[name.toLowerCase()];
    if (f) {
      if (args.length !== f.params.length) throw new PseudoFehler(`${f.name} erwartet ${f.params.length} Parameter, bekam ${args.length}`, zeile);
      if (stapel.length > 200) throw new PseudoFehler('Zu tiefe Rekursion', zeile);
      stapel.push({ name: f.name, vars: new Map(f.params.map((p, i) => [p, args[i]])) });
      protokoll(f.zeile, 'aufruf', { aufrufZeile: zeile });
      try {
        fuehreBlock(f.rumpf);
        return null;
      } catch (x) {
        if (x instanceof Rueckgabe) return x.wert;
        throw x;
      } finally {
        stapel.pop();
      }
    }
    const eingebaut = EINGEBAUT[name.toLowerCase()];
    if (eingebaut) return eingebaut(...args);
    throw new PseudoFehler(`Unbekannte Funktion „${name}"`, zeile);
  };

  const zuweise = (ziel, wert, zeile) => {
    if (ziel.art === 'name') schreibe(ziel.name, wert);
    else if (ziel.art === 'index') {
      const arr = werte(ziel.ziel, zeile);
      const i = werte(ziel.index, zeile);
      if (!Array.isArray(arr)) throw new PseudoFehler('Index nur bei Listen und Arrays möglich', zeile);
      if (!Number.isInteger(i) || i < 0 || i >= arr.length) throw new PseudoFehler(`Index ${formatiere(i)} liegt außerhalb des Arrays (gültig: 0 bis ${arr.length - 1})`, zeile);
      arr[i] = wert;
    } else throw new PseudoFehler('Zuweisung nicht möglich', zeile);
  };

  const fuehreBlock = (anw) => {
    for (const a of anw) fuehre(a);
  };

  const fuehre = (a) => {
    const z = a.zeile;
    switch (a.art) {
      case 'leer':
        return;
      case 'zuweisung':
        protokoll(z, 'vor');
        zuweise(a.ziel, kopie(werte(a.wert, z)), z);
        protokoll(z, 'nach');
        return;
      case 'ausgabe':
        protokoll(z, 'vor');
        ausgabe.push(a.werte.map((w) => formatiere(werte(w, z))).join(''));
        protokoll(z, 'nach');
        return;
      case 'aufrufAnw':
        protokoll(z, 'vor');
        werte(a.ausdruck, z);
        protokoll(z, 'nach');
        return;
      case 'rueckgabe': {
        protokoll(z, 'vor');
        const w = a.wert ? werte(a.wert, z) : null;
        protokoll(z, 'nach', { rueckgabe: kopie(w) });
        throw new Rueckgabe(w);
      }
      case 'abbruch':
        protokoll(z, 'nach');
        throw new Abbruch();
      case 'wenn': {
        for (const zweig of a.zweige) {
          protokoll(zweig.zeile, 'vor');
          const b = wahr(werte(zweig.bed, zweig.zeile), zweig.zeile);
          protokoll(zweig.zeile, 'bedingung', { ergebnis: b });
          if (b) {
            fuehreBlock(zweig.rumpf);
            return;
          }
        }
        if (a.sonst) fuehreBlock(a.sonst);
        return;
      }
      case 'fuer': {
        protokoll(z, 'vor');
        const von = zahl(werte(a.von, z), z, 'FÜR');
        const bis = zahl(werte(a.bis, z), z, 'FÜR');
        const schritt = a.schritt ? zahl(werte(a.schritt, z), z, 'SCHRITT') : von <= bis ? 1 : -1;
        if (schritt === 0) throw new PseudoFehler('SCHRITT 0 führt zu einer Endlosschleife', z);
        try {
          for (let i = von; schritt > 0 ? i <= bis : i >= bis; i += schritt) {
            schreibe(a.var, i);
            protokoll(z, 'schleife');
            try {
              fuehreBlock(a.rumpf);
            } catch (x) {
              if (x instanceof Abbruch) break;
              throw x;
            }
            protokoll(z, 'iterationsende');
          }
        } finally {
          /* Zählvariable bleibt sichtbar */
        }
        return;
      }
      case 'fuerJedes': {
        protokoll(z, 'vor');
        const liste = werte(a.liste, z);
        if (!Array.isArray(liste) && typeof liste !== 'string') throw new PseudoFehler('FÜR JEDES braucht eine Liste', z);
        for (const x of [...liste]) {
          schreibe(a.var, kopie(x));
          protokoll(z, 'schleife');
          try {
            fuehreBlock(a.rumpf);
          } catch (e) {
            if (e instanceof Abbruch) break;
            throw e;
          }
          protokoll(z, 'iterationsende');
        }
        return;
      }
      case 'solange': {
        for (;;) {
          protokoll(z, 'vor');
          const b = wahr(werte(a.bed, z), z);
          protokoll(z, 'bedingung', { ergebnis: b });
          if (!b) break;
          try {
            fuehreBlock(a.rumpf);
          } catch (e) {
            if (e instanceof Abbruch) break;
            throw e;
          }
          protokoll(z, 'iterationsende');
        }
        return;
      }
      case 'wiederhole': {
        protokoll(z, 'vor');
        for (;;) {
          try {
            fuehreBlock(a.rumpf);
          } catch (e) {
            if (e instanceof Abbruch) break;
            throw e;
          }
          protokoll(a.endZeile, 'vor');
          const b = wahr(werte(a.bed, a.endZeile), a.endZeile);
          protokoll(a.endZeile, 'bedingung', { ergebnis: b });
          if (a.bis ? b : !b) break;
        }
        return;
      }
      default:
        throw new PseudoFehler(`Anweisung ${a.art} unbekannt`, z);
    }
  };

  let fehler = null;
  let rueckgabe;
  try {
    protokoll(programm[0]?.zeile ?? 1, 'start');
    if (optionen.aufruf) {
      rueckgabe = rufe({ ziel: { art: 'name', name: optionen.aufruf.name }, args: optionen.aufruf.args.map((w) => ({ art: 'wert', wert: kopie(w) })) }, 0);
      fuehreBlock([]);
    } else fuehreBlock(programm);
    protokoll(schritte.at(-1)?.zeile ?? 1, 'ende');
  } catch (e) {
    if (e instanceof Rueckgabe) rueckgabe = e.wert;
    else if (e instanceof PseudoFehler) fehler = e;
    else if (e instanceof Abbruch) fehler = new PseudoFehler('ABBRUCH außerhalb einer Schleife');
    else throw e;
  }
  return { schritte, ausgabe, fehler, rueckgabe, variablen: Object.fromEntries(global) };
}

// Werte bestimmter Variablen jedes Mal, wenn eine bestimmte Zeile fertig ausgeführt ist.
export function messreihe(ergebnis, zeile, namen, ereignisse = ['nach', 'schleife']) {
  return ergebnis.schritte
    .filter((s) => s.zeile === zeile && ereignisse.includes(s.ereignis))
    .map((s) => Object.fromEntries(namen.map((n) => [n, n in s.vars ? s.vars[n] : s.global?.[n]])));
}

// ---------- Hervorhebung für die Anzeige ----------

const KW =
  /\b(WENN|DANN|SONST|ENDE|F(?:Ü|UE)R|JEDE[SNMR]?|IN|BIS|SCHRITT|VON|SOLANGE|TUE|WIEDERHOLE|FUNKTION|PROZEDUR|METHODE|R(?:Ü|UE)CKGABE|AUSGABE|UND|ODER|NICHT|DIV|MOD|ABBRUCH|KLASSE|NEU|GIB|ZUR(?:Ü|UE)CK)\b/gi;

export function hervorheben(zeile) {
  // liefert [{ art, text }]
  const teile = [];
  const kommentar = zeile.indexOf('//');
  const code = kommentar >= 0 ? zeile.slice(0, kommentar) : zeile;
  const re = new RegExp(`("[^"]*"|„[^“"]*[“"]|'[^']*')|(\\b\\d+(?:\\.\\d+)?\\b)|(${KW.source})|(\\b(?:${TYPEN})\\b(?:\\[\\])?)|(\\b(?:WAHR|FALSCH|NULL|TRUE|FALSE)\\b)`, 'gi');
  let letzte = 0;
  let m;
  while ((m = re.exec(code))) {
    if (m.index > letzte) teile.push({ art: 'text', text: code.slice(letzte, m.index) });
    const art = m[1] ? 'str' : m[2] ? 'num' : m[3] ? 'kw' : m[5] ? 'typ' : 'lit';
    teile.push({ art, text: m[0] });
    letzte = m.index + m[0].length;
  }
  if (letzte < code.length) teile.push({ art: 'text', text: code.slice(letzte) });
  if (kommentar >= 0) teile.push({ art: 'kom', text: zeile.slice(kommentar) });
  return teile;
}
