// Netzplan: Erzeugen, Berechnen, Anordnen. Rein, getestet in tests/netzplan.test.mjs.
//
// Konvention (Formeln aus dem Anhang des Prüfungskatalogs, wie in den Können-Aussagen):
// – Start bei 0. FEZ = FAZ + Dauer. FAZ = größter FEZ aller Vorgänger.
// – SEZ des letzten Vorgangs = sein FEZ. SAZ = SEZ − Dauer. SEZ = kleinster SAZ aller Nachfolger.
// – GP = SAZ − FAZ (= SEZ − FEZ). FP = kleinster FAZ der Nachfolger − FEZ (letzter Vorgang: 0).
// – Kritischer Weg: alle Vorgänge mit GP = 0.

const NAMEN = {
  it: [
    'Anforderungen aufnehmen',
    'Hardware bestellen',
    'Software auswählen',
    'Netzwerk planen',
    'Lieferung abwarten',
    'Lizenzen beschaffen',
    'Verkabelung erneuern',
    'Server einrichten',
    'Clients installieren',
    'Daten migrieren',
    'Testen',
    'Benutzer schulen',
    'Dokumentation erstellen',
    'Abnahme',
  ],
  sw: [
    'Anforderungsanalyse',
    'Datenbank entwerfen',
    'Oberfläche entwerfen',
    'Schnittstelle spezifizieren',
    'Backend programmieren',
    'Frontend programmieren',
    'Testdaten erzeugen',
    'Integrationstest',
    'Benutzerhandbuch',
    'Systemtest',
    'Deployment vorbereiten',
    'Schulung',
    'Abnahme',
  ],
};

export function berechne(vorgaenge) {
  const byId = new Map(vorgaenge.map((v) => [v.id, { ...v, nachfolger: [] }]));
  for (const v of byId.values()) for (const p of v.vorgaenger) byId.get(p).nachfolger.push(v.id);
  const reihenfolge = topologisch([...byId.values()]);
  for (const v of reihenfolge) {
    v.faz = v.vorgaenger.length ? Math.max(...v.vorgaenger.map((p) => byId.get(p).fez)) : 0;
    v.fez = v.faz + v.dauer;
  }
  const ende = Math.max(...reihenfolge.map((v) => v.fez));
  for (const v of [...reihenfolge].reverse()) {
    v.sez = v.nachfolger.length ? Math.min(...v.nachfolger.map((n) => byId.get(n).saz)) : ende;
    v.saz = v.sez - v.dauer;
  }
  for (const v of reihenfolge) {
    v.gp = v.saz - v.faz;
    v.fp = v.nachfolger.length ? Math.min(...v.nachfolger.map((n) => byId.get(n).faz)) - v.fez : ende - v.fez;
    v.kritisch = v.gp === 0;
  }
  const ergebnis = vorgaenge.map((v) => byId.get(v.id));
  return { vorgaenge: ergebnis, dauer: ende, kritisch: kritischeWege(ergebnis) };
}

function topologisch(liste) {
  const byId = new Map(liste.map((v) => [v.id, v]));
  const besucht = new Set();
  const aus = [];
  const besuche = (v) => {
    if (besucht.has(v.id)) return;
    besucht.add(v.id);
    for (const p of v.vorgaenger) besuche(byId.get(p));
    aus.push(v);
  };
  for (const v of liste) besuche(v);
  return aus;
}

// Alle Wege durch kritische Vorgänge vom Start bis zum Ende (meist genau einer)
export function kritischeWege(vorgaenge) {
  const byId = new Map(vorgaenge.map((v) => [v.id, v]));
  const starts = vorgaenge.filter((v) => v.kritisch && v.vorgaenger.length === 0);
  const wege = [];
  const gehe = (v, weg) => {
    const weiter = v.nachfolger.map((n) => byId.get(n)).filter((n) => n.kritisch && n.faz === v.fez);
    if (!weiter.length) {
      if (!v.nachfolger.length) wege.push([...weg, v.id]);
      return;
    }
    for (const n of weiter) gehe(n, [...weg, v.id]);
  };
  for (const s of starts) gehe(s, []);
  return wege;
}

// Zufälliger Netzplan mit einem Start- und einem Endvorgang
export function erzeuge(r, { min = 6, max = 9, thema = 'it' } = {}) {
  const n = r.ganz(min, max);
  const pool = NAMEN[thema];
  const namen = [pool[0], ...r.mische(pool.slice(1, -1)).slice(0, n - 2), pool.at(-1)];
  const ids = 'ABCDEFGHIJKLMN'.slice(0, n).split('');
  // Ebenen bilden, damit parallele Pfade entstehen
  const ebenen = [[ids[0]]];
  let i = 1;
  while (i < n - 1) {
    const breite = Math.min(r.ganz(1, 3), n - 1 - i);
    ebenen.push(ids.slice(i, i + breite));
    i += breite;
  }
  ebenen.push([ids[n - 1]]);
  const vorgaenge = [];
  ebenen.forEach((ebene, e) => {
    for (const id of ebene) {
      let vorgaenger = [];
      if (e > 0) {
        const vorher = ebenen[e - 1];
        if (e === ebenen.length - 1) vorgaenger = [...vorher];
        else {
          vorgaenger = r.mische(vorher).slice(0, r.ganz(1, Math.min(2, vorher.length)));
          // gelegentlich ein Vorgänger zwei Ebenen zurück
          if (e >= 2 && r.ja(0.2)) vorgaenger.push(r.wahl(ebenen[e - 2]));
        }
      }
      vorgaenge.push({ id, name: namen[ids.indexOf(id)], dauer: r.ganz(1, 8), vorgaenger: [...new Set(vorgaenger)].sort() });
    }
  });
  // Jeder Vorgang außer dem letzten braucht einen Nachfolger
  for (const v of vorgaenge) {
    if (v.id === ids[n - 1]) continue;
    const hatNachfolger = vorgaenge.some((w) => w.vorgaenger.includes(v.id));
    if (!hatNachfolger) {
      const e = ebenen.findIndex((x) => x.includes(v.id));
      const ziel = r.wahl(ebenen[e + 1]);
      const w = vorgaenge.find((x) => x.id === ziel);
      w.vorgaenger = [...new Set([...w.vorgaenger, v.id])].sort();
    }
  }
  return { vorgaenge, ebenen };
}

// Anordnung für das Diagramm: Spalte = Ebene (längster Weg vom Start), Zeile = Position darin
// Knoten in Spalten anordnen (Spalte = längster Weg vom Start).
// Pfeile, die Spalten überspringen, bekommen Hilfspunkte in den Zwischenspalten – so laufen
// sie durch eine freie Lücke statt hinter anderen Knoten. Die Reihenfolge in jeder Spalte wird
// mehrmals nach der mittleren Höhe der Nachbarn sortiert (Baryzentrum), damit sich möglichst
// wenige Pfeile kreuzen.
export function anordnen(vorgaenge) {
  const byId = new Map(vorgaenge.map((v) => [v.id, v]));
  const tiefe = new Map();
  const t = (id) => {
    if (tiefe.has(id)) return tiefe.get(id);
    const v = byId.get(id);
    const d = v.vorgaenger.length ? 1 + Math.max(...v.vorgaenger.map(t)) : 0;
    tiefe.set(id, d);
    return d;
  };
  vorgaenge.forEach((v) => t(v.id));
  const anzahl = Math.max(...tiefe.values()) + 1;
  const schichten = Array.from({ length: anzahl }, () => []);
  for (const v of vorgaenge) schichten[tiefe.get(v.id)].push(v.id);

  const vor = new Map();
  const nach = new Map();
  const verbinde = (a, b) => {
    (nach.get(a) ?? nach.set(a, []).get(a)).push(b);
    (vor.get(b) ?? vor.set(b, []).get(b)).push(a);
  };
  const kanten = [];
  for (const v of vorgaenge)
    for (const p of v.vorgaenger) {
      const ueber = [];
      let letzter = p;
      for (let s = tiefe.get(p) + 1; s < tiefe.get(v.id); s++) {
        const h = `~${p}${v.id}${s}`;
        schichten[s].push(h);
        ueber.push(h);
        verbinde(letzter, h);
        letzter = h;
      }
      verbinde(letzter, v.id);
      kanten.push({ von: p, nach: v.id, ueber });
    }

  const hoehe = (s) => {
    const m = new Map();
    s.forEach((id, i) => m.set(id, i - (s.length - 1) / 2));
    return m;
  };
  const sortiere = (s, nachbarn, h) => {
    const schluessel = new Map(
      s.map((id, i) => {
        const n = (nachbarn.get(id) ?? []).filter((x) => h.has(x));
        return [id, n.length ? n.reduce((a, x) => a + h.get(x), 0) / n.length : i - (s.length - 1) / 2];
      }),
    );
    return [...s].sort((a, b) => schluessel.get(a) - schluessel.get(b));
  };
  const kreuzungen = (sch) => {
    let k = 0;
    for (let s = 0; s < sch.length - 1; s++) {
      const oben = new Map(sch[s].map((id, i) => [id, i]));
      const unten = new Map(sch[s + 1].map((id, i) => [id, i]));
      const paare = sch[s].flatMap((a) => (nach.get(a) ?? []).filter((b) => unten.has(b)).map((b) => [oben.get(a), unten.get(b)]));
      for (let i = 0; i < paare.length; i++)
        for (let j = i + 1; j < paare.length; j++) if ((paare[i][0] - paare[j][0]) * (paare[i][1] - paare[j][1]) < 0) k++;
    }
    return k;
  };
  let beste = schichten.map((s) => [...s]);
  let wenigste = kreuzungen(beste);
  let akt = beste;
  for (let runde = 0; runde < 6 && wenigste > 0; runde++) {
    akt = akt.map((s) => [...s]);
    for (let s = 1; s < anzahl; s++) akt[s] = sortiere(akt[s], vor, hoehe(akt[s - 1]));
    for (let s = anzahl - 2; s >= 0; s--) akt[s] = sortiere(akt[s], nach, hoehe(akt[s + 1]));
    const k = kreuzungen(akt);
    if (k < wenigste) [beste, wenigste] = [akt, k];
  }

  const pos = new Map();
  beste.forEach((s, x) => s.forEach((id, y) => pos.set(id, { x, y, anzahl: s.length })));
  return { pos, kanten, spalten: anzahl, zeilen: Math.max(...beste.map((s) => s.length)) };
}

// Kritischen Weg aus einer Eingabe lesen: „A-C-F", „A, C, F", „ACF"
export function liesWeg(text) {
  return String(text ?? '')
    .toUpperCase()
    .replace(/[^A-Z]/g, '')
    .split('');
}

// Pfeile wie in IHK-Prüfungen: gerade und rechtwinklig. Waagerecht aus dem Vorgänger,
// in der Lücke zwischen zwei Spalten senkrecht, waagerecht in den Nachfolger.
// Alle Pfeile eines Vorgängers teilen sich eine senkrechte Bahn (Verzweigung wie ein Baum);
// Vorgänger, deren Bahnen sich sonst überdecken würden, bekommen eine eigene Bahn daneben.
export function pfeile({ pos, kanten, zeilen }, { KB, KH, AX, AY }) {
  const xy = (id) => {
    const p = pos.get(id);
    return { x: p.x * (KB + AX), y: p.y * (KH + AY) + ((zeilen - p.anzahl) * (KH + AY)) / 2 + KH / 2 };
  };
  // Jede Kante in Abschnitte zwischen zwei benachbarten Spalten zerlegen
  const abschnitte = [];
  for (const k of kanten) {
    const kette = [k.von, ...k.ueber, k.nach];
    for (let i = 0; i < kette.length - 1; i++) abschnitte.push({ kante: k, von: kette[i], nach: kette[i + 1], spalte: pos.get(kette[i]).x, y1: xy(kette[i]).y, y2: xy(kette[i + 1]).y });
  }
  const bahn = new Map();
  const bahnenJeSpalte = new Map();
  const spalten = [...new Set(abschnitte.map((a) => a.spalte))];
  for (const s of spalten) {
    const hier = abschnitte.filter((a) => a.spalte === s);
    const gruppen = [...new Set(hier.filter((a) => a.y1 !== a.y2).map((a) => a.von))].sort((a, b) => xy(a).y - xy(b).y);
    const vergeben = new Map(); // von -> Bahnnummer
    // Vorgänger mit genau denselben Nachfolgern dürfen sich eine Bahn teilen – das liest sich eindeutig
    const ziele = (g) => hier.filter((a) => a.von === g).map((a) => a.nach).sort().join();
    const konflikt = (g, n) =>
      hier.some((e) => {
        if (e.von !== g) return false;
        return hier.some((f) => {
          if (f.von === g || !vergeben.has(f.von) || f.y1 === f.y2) return false;
          const m = vergeben.get(f.von);
          const ueberlapp = (a1, a2, b1, b2) => Math.max(Math.min(a1, a2), Math.min(b1, b2)) < Math.min(Math.max(a1, a2), Math.max(b1, b2));
          // gleiche Bahn, senkrechte Stücke überdecken sich, aber anderes Ziel
          if (m === n && f.nach !== e.nach && ziele(g) !== ziele(f.von) && e.y1 !== e.y2 && ueberlapp(e.y1, e.y2, f.y1, f.y2)) return true;
          // waagerechter Ausgang von e liegt auf dem waagerechten Eingang von f (gleiche Höhe)
          if (e.y1 === f.y2 && m < n) return true;
          if (f.y1 === e.y2 && n < m) return true;
          return false;
        });
      });
    for (const g of gruppen) {
      let n = 0;
      while (konflikt(g, n) && n < 6) n++;
      vergeben.set(g, n);
    }
    const anzahl = Math.max(0, ...vergeben.values()) + 1;
    bahnenJeSpalte.set(s, anzahl);
    for (const [g, n] of vergeben) bahn.set(`${s}:${g}`, n);
  }
  const lauf = new Map(kanten.map((k) => [k, []]));
  for (const a of abschnitte) {
    const x1 = xy(a.von).x + KB;
    const x2 = xy(a.nach).x;
    const ziel = a.nach === a.kante.nach ? x2 - 2 : x2;
    const teile = [];
    if (a.y1 === a.y2) teile.push(`H${ziel}`);
    else {
      const anzahl = bahnenJeSpalte.get(a.spalte);
      const n = bahn.get(`${a.spalte}:${a.von}`);
      const bx = Math.round(x1 + (AX * (n + 1)) / (anzahl + 1));
      teile.push(`H${bx}`, `V${a.y2}`, `H${ziel}`);
    }
    // Durch einen Hilfspunkt (übersprungene Spalte) geradeaus weiter
    if (a.nach !== a.kante.nach) teile.push(`H${x2 + KB}`);
    lauf.get(a.kante).push({ start: [x1, a.y1], teile });
  }
  return kanten.map((k) => {
    const s = lauf.get(k);
    return { von: k.von, nach: k.nach, d: `M${s[0].start[0]} ${s[0].start[1]} ${s.flatMap((x) => x.teile).join(' ')}` };
  });
}
