// Zerlegt den Prüfungskatalog (Markdown-Fassung) in Bausteine mit festen IDs.
//
// Schicht 1 (Fundament): rein mechanisch, kein Ermessen. Jede Zeile des Katalogs wird
// entweder zu einem Baustein oder ist ausdrücklich als „ignoriert" begründet.
//
// Aufruf:  node tools/umbau/katalog-zerlegen.mjs [quellen/katalog.md] [umbau/fundament/katalog-bausteine.json]
//
// Die Quelle erzeugt man einmal aus der Word-Fassung:
//   pandoc Pruefungskatalog_FIAE_korrigiert_v2_1.docx -t gfm --wrap=none -o quellen/katalog.md
//
// ID-Schema (Punkte statt Bindestriche, damit es keine Verwechslung mit alten Stichpunkt-IDs gibt):
//   Teil              AP1 | AP2a (AP2, fachrichtungsübergreifend) | AP2b (AP2, Fachrichtung AE) | WISO
//   Fragenkomplex     AP1.04
//   Katalogpunkt      AP1.04.05
//   Spiegelstrich     AP1.04.05.3        (eingerückt: AP1.01.01.2.4)
//   Betr. Handlung    AP1.04.H2
//   Gebiet (Raster)   G.AP1.03 | G.PB1.02 | G.PB2.04 | G.WISO.01
//   Anhang            ANH.sql-syntax

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { createHash } from 'node:crypto';

const QUELLE = process.argv[2] ?? 'quellen/katalog.md';
const ZIEL = process.argv[3] ?? 'umbau/fundament/katalog-bausteine.json';

// Operatoren: feste Liste. Gefunden wird nur, was wörtlich (als Wortanfang) im Titel steht.
// Welche Tiefe ein Operator bedeutet, steht NICHT hier, sondern im Regelwerk (UMBAU.md).
export const OPERATOREN = [
  'abbilden', 'ableiten', 'abstimmen', 'analysieren', 'anwenden', 'aufbereiten', 'auswählen', 'auswerten',
  'automatisieren', 'begleiten', 'begründen', 'benennen', 'beraten', 'beschreiben', 'bestimmen', 'beurteilen',
  'bewerten', 'charakterisieren', 'darstellen', 'definieren', 'dokumentieren', 'durchführen', 'einordnen',
  'einrichten', 'einschätzen', 'einsetzen', 'entnehmen', 'entwickeln', 'erfassen', 'erläutern', 'erstellen',
  'erweitern', 'festlegen', 'formulieren', 'gestalten', 'identifizieren', 'implementieren', 'interpretieren',
  'kennen', 'konfigurieren', 'konzeptionieren', 'modellieren', 'nachweisen', 'nennen', 'nutzen', 'planen',
  'präsentieren', 'prüfen', 'überprüfen', 'überwachen', 'unterscheiden', 'unterstützen', 'umsetzen',
  'verhindern', 'vergleichen', 'vorbereiten', 'vornehmen', 'wahrnehmen', 'zuordnen', 'zusammenführen', 'testen',
  'beheben', 'erkennen', 'messen', 'verwenden',
];

function operatorenIn(text) {
  const t = text.toLowerCase();
  return OPERATOREN.filter((op) => new RegExp(`(^|[^a-zäöüß])${op}([^a-zäöüß]|$)`).test(t));
}

const norm = (s) => s.replace(/\s+/g, ' ').trim();
const pad = (n) => String(n).padStart(2, '0');
const slug = (s) => s.toLowerCase()
  .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function teilAusUeberschrift(h) {
  if (/^Teil 1 der Abschlussprüfung/.test(h)) return 'AP1';
  if (/^Teil 2 der Abschlussprüfung.* - 01:/.test(h)) return 'AP2a';
  if (/^Teil 2 der Abschlussprüfung.* - 02:/.test(h)) return 'AP2b';
  if (/^Teil 2 der Abschlussprüfung.* - 03:/.test(h)) return 'WISO';
  return null;
}

// Zeilen, die auf jeder Originalseite als Kopfzeile wiederholt werden.
const KOPFZEILE = [
  /^Teil 1 der Abschlussprüfung \(AP1 - Einrichten eines IT-gestützten Arbeitsplatzes\)$/,
  /^Teil 2 der Abschlussprüfung \(Teil [123]( und Teil 2)? der AP2\)( - 0[123](: .*)?)?$/,
  /^Fachrichtungsübergreifende berufsprofilgebende Fertigkeiten, Kenntnisse und Fähigkeiten$/,
  /^Berufsprofilgebende Fertigkeiten, Kenntnisse und Fähigkeiten in der Fachrichtung Anwendungsentwicklung$/,
  /^Fachrichtungsübergreifende, integrativ zu vermittelnde Fertigkeiten, Kenntnisse und Fähigkeiten \(Wirtschafts- und Sozialkunde\)$/,
];

export function zerlege(md) {
  const zeilen = md.split('\n');
  const out = {
    pruefungsbereiche: [], lernfelder: [], teile: [], fragenkomplexe: [], punkte: [], spiegelstriche: [], handlungen: [],
    anhang: [], ignoriert: [], nicht_zugeordnet: [],
  };

  let seite = null;
  let bereich = 'vorspann'; // vorspann | raster | teil | anhang | sonst
  let teil = null, fk = null, punkt = null, modus = null, anhang = null;
  let letztes = null; // letztes erzeugtes Element, für Quellenauffälligkeiten
  const stapel = []; // Spiegelstrich-Eltern je Einrückungstiefe
  const ssZaehler = new Map(); // Elternschlüssel -> laufende Nummer
  const hZaehler = new Map();

  const ignoriere = (i, grund) => out.ignoriert.push({ zeile: i + 1, grund });
  const offen = (i, text) => out.nicht_zugeordnet.push({ zeile: i + 1, text: text.slice(0, 160) });

  for (let i = 0; i < zeilen.length; i++) {
    const roh = zeilen[i];
    const z = roh.trim();
    if (!z) continue;

    const s = z.match(/^Quelle: Original-PDF-Seite (\d+)$/);
    if (s) { seite = Number(s[1]); ignoriere(i, 'Seitenmarker'); continue; }

    // ---------- Überschriften erster Ebene ----------
    const h1 = roh.match(/^# (.*)$/);
    if (h1) {
      const titel = norm(h1[1]);
      fk = punkt = modus = null; stapel.length = 0;
      const t = teilAusUeberschrift(titel);
      if (t) {
        bereich = 'teil'; teil = t;
        out.teile.push({ id: t, titel, seite });
        letztes = out.teile.at(-1);
      } else if (titel === 'Raster') {
        bereich = 'raster'; ignoriere(i, 'Überschrift Raster');
      } else if (/^Anhang – /.test(titel)) {
        bereich = 'anhang';
        const name = titel.replace(/^Anhang – /, '');
        anhang = { id: `ANH.${slug(name)}`, titel: name, abschnitte: [], seite };
        out.anhang.push(anhang); letztes = anhang;
      } else {
        bereich = 'sonst'; ignoriere(i, `Vorspann/Übersicht: ${titel.slice(0, 60)}`);
      }
      continue;
    }

    // ---------- Raster: Gebiete je Prüfungsbereich ----------
    if (bereich === 'raster') {
      const r = z.match(/^\|\s*(.+?)\s*\|\s*(\d{2})\s*\|\s*(.+?)\s*\|$/);
      if (r) {
        const pbText = r[1];
        let pb = null;
        if (/^AP1 /.test(pbText)) pb = 'AP1';
        else if (/^01 Planen eines Softwareproduktes/.test(pbText)) pb = 'PB1';
        else if (/^02 Entwicklung und Umsetzung von Algorithmen/.test(pbText)) pb = 'PB2';
        else if (/^03 Wirtschafts- und Sozialkunde/.test(pbText)) pb = 'WISO';
        if (!pb) { offen(i, z); continue; }
        let p = out.pruefungsbereiche.find((x) => x.id === pb);
        if (!p) {
          const m = pbText.match(/\((\d+) Minuten, (\d+) % Gewichtung/);
          p = { id: pb, text: pbText, minuten: m ? Number(m[1]) : null, gewicht_prozent: m ? Number(m[2]) : null, gebiete: [] };
          out.pruefungsbereiche.push(p);
        }
        const g = r[3].match(/^(.*?)\s*\((§[^)]*)\)$/);
        p.gebiete.push({ id: `G.${pb}.${r[2]}`, nr: r[2], text: g ? g[1] : r[3], paragraf: g ? g[2] : null, seite });
        continue;
      }
      const lfz = z.match(/^LF ?(\d+[a-d]?): (.*)$/);
      if (lfz) { out.lernfelder.push({ id: `LF${lfz[1]}`, titel: norm(lfz[2]) }); continue; }
      if (/^\|/.test(z)) { ignoriere(i, 'Tabellenkopf Raster'); continue; }
      if (/^## /.test(z)) { ignoriere(i, 'Zwischenüberschrift Raster'); continue; }
      ignoriere(i, 'Fließtext Raster'); // Bearbeitungszeiten-Sätze; Werte stehen in den Tabellenzeilen
      continue;
    }

    if (bereich === 'vorspann' || bereich === 'sonst') { ignoriere(i, 'Vorspann/Übersicht'); continue; }

    // ---------- Anhang: nur grob, je Abschnitt ----------
    if (bereich === 'anhang') {
      const h = z.match(/^#{2,3} (.*)$/);
      if (h) anhang.abschnitte.push(norm(h[1]));
      else ignoriere(i, `Inhalt Anhang ${anhang.id}`);
      continue;
    }

    // ---------- Teile ----------
    if (/^Quellenauffälligkeit:/.test(z)) {
      if (letztes) (letztes.auffaelligkeiten ??= []).push(z.replace(/^Quellenauffälligkeit:\s*/, ''));
      ignoriere(i, 'Quellenauffälligkeit (am vorigen Element vermerkt)');
      continue;
    }
    if (/^Redaktionell/.test(z)) { ignoriere(i, 'redaktioneller Vermerk'); continue; }
    if (KOPFZEILE.some((re) => re.test(z))) { ignoriere(i, 'Kopfzeile der Originalseite'); continue; }

    const h2 = roh.match(/^## (.*)$/);
    if (h2) {
      const titel = norm(h2[1]);
      const fort = titel.match(/^Fortsetzung zu: (\d{2}) /);
      punkt = null; modus = null; stapel.length = 0;
      if (fort) {
        fk = out.fragenkomplexe.find((f) => f.id === `${teil}.${fort[1]}`);
        if (!fk) offen(i, z); else { fk.seiten.push(seite); letztes = fk; }
        ignoriere(i, 'Fortsetzungsüberschrift');
        continue;
      }
      const m = titel.match(/^(\d{2}) (.*?)\s*\((§[^)]*)\)$/);
      if (!m) { offen(i, z); continue; }
      fk = { id: `${teil}.${m[1]}`, teil, nr: m[1], titel: m[2], paragraf: m[3], lernfelder: [], vorbemerkungen: [], seiten: [seite] };
      out.fragenkomplexe.push(fk); letztes = fk;
      continue;
    }

    const h3 = roh.match(/^### (.*)$/);
    if (h3) {
      const t = norm(h3[1]);
      if (t === 'Themenkreis') { modus = 'themenkreis'; ignoriere(i, 'Spaltenüberschrift'); continue; }
      if (t === 'Beispiele für betriebliche Handlungen/Qualifikationen') { modus = 'handlungen'; punkt = null; stapel.length = 0; ignoriere(i, 'Spaltenüberschrift'); continue; }
      offen(i, z); continue;
    }

    const lf = z.match(/^\*\*(LF[^*]*)\*\*$/);
    if (lf && fk) {
      fk.lernfelder.push(...lf[1].split(/\s*,\s*/).map((x) => x.replace(/\s+/g, '')));
      ignoriere(i, 'Lernfelder (am Fragenkomplex vermerkt)');
      continue;
    }

    const h4 = roh.match(/^#### (.*)$/);
    if (h4) {
      const t = norm(h4[1]);
      const m = t.match(/^(\d{2}) (.*)$/);
      if (!m || !fk) { offen(i, z); continue; }
      let titel = m[2];
      const hinweise = [];
      const pfeil = titel.match(/^(.*?)\s*→\s*(.*)$/);
      if (pfeil) { titel = pfeil[1]; hinweise.push(pfeil[2]); }
      punkt = {
        id: `${fk.id}.${m[1]}`, fragenkomplex: fk.id, nr: m[1], titel,
        operatoren: operatorenIn(titel), hinweise,
        nicht_schriftlich: hinweise.some((h) => /nicht Bestandteil der schriftlichen Prüfung/.test(h)),
        zusaetze: [], seite,
      };
      out.punkte.push(punkt); letztes = punkt; stapel.length = 0;
      modus = 'themenkreis';
      continue;
    }

    const b = roh.match(/^(\s*)- (.*)$/);
    if (b) {
      const tiefe = Math.floor(b[1].length / 2);
      const text = norm(b[2]);
      if (modus === 'handlungen' && fk) {
        const n = (hZaehler.get(fk.id) ?? 0) + 1; hZaehler.set(fk.id, n);
        const h = { id: `${fk.id}.H${n}`, fragenkomplex: fk.id, text, seite };
        out.handlungen.push(h); letztes = h;
        continue;
      }
      if (modus === 'themenkreis' && punkt) {
        stapel.length = tiefe;
        const eltern = tiefe === 0 ? null : stapel[tiefe - 1];
        if (tiefe > 0 && !eltern) { offen(i, z); continue; }
        const schluessel = eltern ? eltern.id : punkt.id;
        const n = (ssZaehler.get(schluessel) ?? 0) + 1; ssZaehler.set(schluessel, n);
        const ss = {
          id: eltern ? `${eltern.id}.${n}` : `${punkt.id}.${n}`,
          punkt: punkt.id, eltern: eltern ? eltern.id : null, tiefe, text,
          operatoren: operatorenIn(text), seite,
        };
        out.spiegelstriche.push(ss); stapel[tiefe] = ss; letztes = ss;
        continue;
      }
      offen(i, z); continue;
    }

    // Fließtext zwischen Fragenkomplex-Überschrift und Themenkreis
    if (modus === null && fk) {
      fk.vorbemerkungen.push(norm(z));
      ignoriere(i, 'Vorbemerkung (am Fragenkomplex vermerkt)');
      continue;
    }
    // Fließtext im Themenkreis
    if (modus === 'themenkreis' && fk) {
      if (punkt) punkt.zusaetze.push(norm(z)); else fk.vorbemerkungen.push(norm(z));
      ignoriere(i, punkt ? 'Fließtext (am Katalogpunkt vermerkt)' : 'Vorbemerkung (am Fragenkomplex vermerkt)');
      continue;
    }
    offen(i, z);
  }

  // Abdeckungspflicht: jeder Spiegelstrich, und jeder Katalogpunkt ohne Spiegelstriche.
  const mitSS = new Set(out.spiegelstriche.map((s) => s.punkt));
  for (const p of out.punkte) p.ohne_spiegelstriche = !mitSS.has(p.id);
  const nichtSchriftlich = new Set(out.punkte.filter((p) => p.nicht_schriftlich).map((p) => p.id));
  out.abdeckungspflichtig = [
    ...out.spiegelstriche.filter((s) => !nichtSchriftlich.has(s.punkt)).map((s) => s.id),
    ...out.punkte.filter((p) => p.ohne_spiegelstriche && !p.nicht_schriftlich).map((p) => p.id),
  ];
  return out;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const md = readFileSync(QUELLE, 'utf8');
  const z = zerlege(md);
  const anzahl = Object.fromEntries(
    ['pruefungsbereiche', 'lernfelder', 'teile', 'fragenkomplexe', 'punkte', 'spiegelstriche', 'handlungen', 'anhang', 'abdeckungspflichtig', 'nicht_zugeordnet']
      .map((k) => [k, z[k].length]),
  );
  anzahl.gebiete = z.pruefungsbereiche.reduce((a, p) => a + p.gebiete.length, 0);
  const ergebnis = {
    meta: {
      schicht: 1,
      beschreibung: 'Prüfungskatalog FIAE (2. Auflage, ab AP1 Frühjahr 2025 / AP2 Sommer 2025), mechanisch in Bausteine zerlegt. Wortlaut unverändert. Nicht von Hand bearbeiten – neu erzeugen.',
      quelle: QUELLE,
      quelle_sha256: createHash('sha256').update(md).digest('hex'),
      erzeugt_mit: 'node tools/umbau/katalog-zerlegen.mjs',
      anzahl,
    },
    ...z,
  };
  delete ergebnis.ignoriert; // nur zur Kontrolle nötig, siehe fundament-pruefen.mjs
  mkdirSync(dirname(ZIEL), { recursive: true });
  writeFileSync(ZIEL, JSON.stringify(ergebnis, null, 2) + '\n');
  console.log(JSON.stringify(anzahl));
  if (z.nicht_zugeordnet.length) {
    console.log('\nNicht zugeordnete Zeilen:');
    for (const n of z.nicht_zugeordnet) console.log(`  Zeile ${n.zeile}: ${n.text}`);
    process.exitCode = 1;
  }
}
