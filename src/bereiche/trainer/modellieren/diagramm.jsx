// Kleiner Diagramm-Baukasten (SVG) für den Trainer „Modellieren".
//
// Ein Diagramm ist reine Beschreibung (siehe README.md in diesem Ordner):
//   { breite, hoehe, rahmen: [...], knoten: [...], kanten: [...] }
// Lücken im Text werden als {1}, {2} … geschrieben und je nach Stand als [1], als gewählter
// Wert oder als Lösung gezeigt. „marke: n" setzt eine nummerierte Markierung (Fehler finden).

import { PX, ZEILE, ZEICHEN, umbrechen, laenge, masse, klassenMasse, mitte, KANTEN } from './geometrie.js';

export { pruefeDiagramm, lueckenIn } from './geometrie.js';

// ---------- Text ----------

// Eine Textzeile mit Lücken als <tspan>s
function Teile({ text, luecken }) {
  const teile = String(text).split(/(\{\d+\})/);
  return teile.map((t, i) => {
    const m = t.match(/^\{(\d+)\}$/);
    if (!m) return t;
    const l = luecken?.[m[1]];
    if (l?.text) return <tspan key={i} class={`dg-luecke dg-luecke--${l.zustand ?? 'gewaehlt'}`}>{l.text}</tspan>;
    return <tspan key={i} class="dg-luecke">[{m[1]}]</tspan>;
  });
}

function Text({ x, y, text, luecken, anker = 'middle', klasse = '', max, groesse, farbe }) {
  const zeilen = umbrechen(text, max);
  const zh = groesse ? groesse * 1.25 : ZEILE;
  const y0 = y - ((zeilen.length - 1) * zh) / 2;
  return (
    <text class={`dg-text ${klasse}`} text-anchor={anker} style={groesse || farbe ? { ...(groesse ? { fontSize: `${groesse}px` } : {}), ...(farbe ? { fill: farbe } : {}) } : undefined}>
      {zeilen.map((z, i) => (
        <tspan key={i} x={x} y={y0 + i * zh + (groesse ?? PX) * 0.35}>
          <Teile text={z} luecken={luecken} />
        </tspan>
      ))}
    </text>
  );
}

// ---------- Geometrie ----------

// Randpunkt eines Knotens in Richtung p
function rand(m, p) {
  const [cx, cy] = mitte(m);
  const dx = p[0] - cx;
  const dy = p[1] - cy;
  if (!dx && !dy) return [cx, cy];
  const a = m.w / 2;
  const b = m.h / 2;
  let t;
  if (m.form === 'ellipse') t = 1 / Math.sqrt((dx / a) ** 2 + (dy / b) ** 2);
  else if (m.form === 'raute') t = 1 / (Math.abs(dx) / a + Math.abs(dy) / b);
  else t = Math.min(dx ? a / Math.abs(dx) : Infinity, dy ? b / Math.abs(dy) : Infinity);
  return [cx + dx * t, cy + dy * t];
}

function seite(m, s) {
  const [cx, cy] = mitte(m);
  if (s === 'oben') return [cx, m.y];
  if (s === 'unten') return [cx, m.y + m.h];
  if (s === 'links') return [m.x, cy];
  if (s === 'rechts') return [m.x + m.w, cy];
  // „oben:20" → 20 px rechts der Mitte an der Oberkante
  const [name, v] = s.split(':');
  const d = Number(v) || 0;
  if (name === 'oben') return [cx + d, m.y];
  if (name === 'unten') return [cx + d, m.y + m.h];
  if (name === 'links') return [m.x, cy + d];
  return [m.x + m.w, cy + d];
}

// ---------- Kanten ----------

function spitze(art, p, q, schluessel) {
  // p = Spitze, q = Punkt davor
  const w = Math.atan2(p[1] - q[1], p[0] - q[0]);
  const pt = (l, d) => [p[0] - l * Math.cos(w) + d * Math.sin(w), p[1] - l * Math.sin(w) - d * Math.cos(w)];
  const pfad = (pts, zu) => 'M' + pts.map((x) => `${x[0].toFixed(1)},${x[1].toFixed(1)}`).join('L') + (zu ? 'Z' : '');
  if (art === 'offen') return <path key={schluessel} class="dg-linie" d={pfad([pt(11, 5.5), p, pt(11, -5.5)])} />;
  if (art === 'voll') return <path key={schluessel} class="dg-voll" d={pfad([pt(11, 5), p, pt(11, -5)], true)} />;
  if (art === 'dreieck') return <path key={schluessel} class="dg-hohl" d={pfad([pt(14, 8), p, pt(14, -8)], true)} />;
  if (art === 'raute') return <path key={schluessel} class="dg-hohl" d={pfad([p, pt(9, 6), pt(18, 0), pt(9, -6)], true)} />;
  if (art === 'raute-voll') return <path key={schluessel} class="dg-voll" d={pfad([p, pt(9, 6), pt(18, 0), pt(9, -6)], true)} />;
  if (art === 'kreis') {
    const c = pt(4, 0);
    return <circle key={schluessel} class="dg-hohl" cx={c[0]} cy={c[1]} r={4} />;
  }
  return null;
}

// Wie weit eine Spitze die Linie verkürzt, damit sie nicht durchscheint
const KUERZUNG = { dreieck: 13, raute: 17, 'raute-voll': 0, voll: 10, kreis: 8 };

function verkuerzt(p, q, l) {
  if (!l) return p;
  const d = Math.hypot(p[0] - q[0], p[1] - q[1]) || 1;
  return [p[0] + ((q[0] - p[0]) * l) / d, p[1] + ((q[1] - p[1]) * l) / d];
}

function kantenPunkte(kante, knoten) {
  const a = knoten.get(kante.von);
  const b = knoten.get(kante.nach);
  if (!a || !b) return null;
  // Nachrichten zwischen Lebenslinien: waagerecht auf Höhe y
  if (a.k.typ === 'lebenslinie' && b.k.typ === 'lebenslinie' && kante.y !== undefined) {
    const xa = mitte(a.m)[0];
    const xb = mitte(b.m)[0];
    if (kante.von === kante.nach) return [[xa + 5, kante.y], [xa + 42, kante.y], [xa + 42, kante.y + 20], [xa + 10, kante.y + 20]];
    const r = xb > xa ? 1 : -1;
    if (kante.typ === 'erzeugen') return [[xa + 5 * r, kante.y], [r > 0 ? b.m.x : b.m.x + b.m.w, kante.y]];
    return [[xa + 5 * r, kante.y], [xb - 5 * r, kante.y]];
  }
  const via = kante.via ?? [];
  const zielB = kante.nachSeite ? seite(b.m, kante.nachSeite) : mitte(b.m);
  const pa = kante.vonSeite ? seite(a.m, kante.vonSeite) : rand(a.m, via[0] ?? zielB);
  const pb = kante.nachSeite ? seite(b.m, kante.nachSeite) : rand(b.m, via.at(-1) ?? pa);
  return [pa, ...via, pb];
}

function punktAuf(pts, anteil) {
  const seg = [];
  let gesamt = 0;
  for (let i = 1; i < pts.length; i++) {
    const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    seg.push(l);
    gesamt += l;
  }
  let rest = gesamt * anteil;
  for (let i = 0; i < seg.length; i++) {
    if (rest <= seg[i] || i === seg.length - 1) {
      const t = seg[i] ? rest / seg[i] : 0;
      const p = pts[i];
      const q = pts[i + 1];
      return { p: [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t], waagerecht: Math.abs(q[0] - p[0]) >= Math.abs(q[1] - p[1]) };
    }
    rest -= seg[i];
  }
  return { p: pts[0], waagerecht: true };
}

function Kante({ kante, knoten, luecken, marken }) {
  const pts = kantenPunkte(kante, knoten);
  if (!pts) return null;
  const stil = KANTEN[kante.typ] ?? KANTEN.linie;
  const n = pts.length;
  const linie = pts.slice();
  if (stil.ende) linie[n - 1] = verkuerzt(pts[n - 1], pts[n - 2], KUERZUNG[stil.ende]);
  if (stil.anfang) linie[0] = verkuerzt(pts[0], pts[1], KUERZUNG[stil.anfang]);
  const d = 'M' + linie.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join('L');
  const textPos = punktAuf(pts, kante.textPos ?? 0.5);
  const seiteT = kante.textSeite ?? 1;
  const tx = textPos.waagerecht ? textPos.p[0] : textPos.p[0] + 7 * seiteT;
  // mehrzeilige Beschriftung ganz über (bzw. unter) die Linie schieben
  const zeilenN = kante.text ? umbrechen(kante.text).length : 1;
  const ty = textPos.waagerecht ? textPos.p[1] - (8 + ((zeilenN - 1) * ZEILE) / 2) * seiteT : textPos.p[1];
  const ende = (p, q, text, s = 1) => {
    if (!text) return null;
    const w = Math.atan2(q[1] - p[1], q[0] - p[0]);
    const x = p[0] + Math.cos(w) * 16 - Math.sin(w) * 10 * s;
    const y = p[1] + Math.sin(w) * 16 + Math.cos(w) * 10 * s;
    return <Text x={x} y={y} text={text} luecken={luecken} klasse="dg-klein" />;
  };
  return (
    <g class={`dg-kante ${kante.hervor ? 'dg-kante--hervor' : ''}`}>
      <path class={`dg-linie ${stil.strich === true ? 'dg-strich' : stil.strich === 'punkt' ? 'dg-punkt' : ''}`} d={d} />
      {stil.ende && spitze(stil.ende, pts[n - 1], pts[n - 2], 'e')}
      {stil.anfang && spitze(stil.anfang, pts[0], pts[1], 'a')}
      {kante.text && <Text x={tx} y={ty} text={kante.text} luecken={luecken} anker={textPos.waagerecht ? 'middle' : seiteT > 0 ? 'start' : 'end'} klasse="dg-klein dg-kantentext" />}
      {ende(pts[0], pts[1], kante.textVon, kante.textSeite ?? 1)}
      {ende(pts[n - 1], pts[n - 2], kante.textNach, -(kante.textSeite ?? 1))}
      {marken && kante.marke && <Marke x={textPos.waagerecht ? textPos.p[0] : textPos.p[0] - 14 * seiteT} y={textPos.waagerecht ? textPos.p[1] + 14 * seiteT : textPos.p[1]} n={kante.marke} />}
    </g>
  );
}

function Marke({ x, y, n }) {
  return (
    <g class="dg-marke" transform={`translate(${x.toFixed(1)},${y.toFixed(1)})`}>
      <circle r="10" />
      <text text-anchor="middle" y="4">
        {n}
      </text>
    </g>
  );
}

// ---------- Knoten ----------

function Knoten({ k, m, luecken, marken }) {
  const { x, y, w, h } = m;
  const [cx, cy] = mitte(m);
  const max = Math.max(4, Math.floor((w - 14) / ZEICHEN));
  let inhalt;
  switch (k.typ) {
    case 'akteur': {
      const kx = cx;
      inhalt = (
        <>
          <circle class="dg-form" cx={kx} cy={y + 9} r={9} />
          <path class="dg-linie" d={`M${kx},${y + 18}V${y + 42}M${kx - 16},${y + 26}H${kx + 16}M${kx},${y + 42}L${kx - 13},${y + 62}M${kx},${y + 42}L${kx + 13},${y + 62}`} />
          <Text x={kx} y={y + 62 + 12 + (umbrechen(k.text, 18).length - 1) * 7.5} text={k.text} luecken={luecken} max={18} />
        </>
      );
      break;
    }
    case 'anwendungsfall':
    case 'attribut':
    case 'org':
      inhalt = (
        <>
          <ellipse class={`dg-form ${k.typ === 'org' ? 'dg-org' : ''}`} cx={cx} cy={cy} rx={w / 2} ry={h / 2} />
          {k.typ === 'org' && <path class="dg-linie" d={`M${x + w * 0.16},${cy - h * 0.37}V${cy + h * 0.37}`} />}
          <Text x={k.typ === 'org' ? cx + 6 : cx} y={cy} text={k.text} luecken={luecken} max={Math.floor(max * 0.82)} klasse={k.pk ? 'dg-pk' : ''} />
        </>
      );
      break;
    case 'aktion':
    case 'funktion':
    case 'aufgabe':
      inhalt = (
        <>
          <rect class={`dg-form ${k.typ === 'funktion' ? 'dg-funktion' : ''}`} x={x} y={y} width={w} height={h} rx={k.typ === 'aktion' ? 12 : 8} />
          <Text x={cx} y={cy} text={k.text} luecken={luecken} max={max} />
        </>
      );
      break;
    case 'start':
      inhalt = <circle class="dg-voll" cx={cx} cy={cy} r={w / 2} />;
      break;
    case 'ende':
      inhalt = (
        <>
          <circle class="dg-hohl" cx={cx} cy={cy} r={w / 2} />
          <circle class="dg-voll" cx={cx} cy={cy} r={w / 2 - 5} />
        </>
      );
      break;
    case 'ablaufende':
      inhalt = (
        <>
          <circle class="dg-hohl" cx={cx} cy={cy} r={w / 2} />
          <path class="dg-linie" d={`M${cx - w * 0.35},${cy - h * 0.35}L${cx + w * 0.35},${cy + h * 0.35}M${cx + w * 0.35},${cy - h * 0.35}L${cx - w * 0.35},${cy + h * 0.35}`} />
        </>
      );
      break;
    case 'entscheidung':
    case 'beziehung':
    case 'gateway': {
      const pfad = `M${cx},${y}L${x + w},${cy}L${cx},${y + h}L${x},${cy}Z`;
      inhalt = (
        <>
          <path class="dg-form" d={pfad} />
          {k.typ === 'beziehung' && <Text x={cx} y={cy} text={k.text} luecken={luecken} max={Math.floor(max * 0.7)} />}
          {k.typ === 'gateway' && k.art === 'x' && <path class="dg-dick" d={`M${cx - 7},${cy - 7}L${cx + 7},${cy + 7}M${cx + 7},${cy - 7}L${cx - 7},${cy + 7}`} />}
          {k.typ === 'gateway' && k.art === '+' && <path class="dg-dick" d={`M${cx},${cy - 10}V${cy + 10}M${cx - 10},${cy}H${cx + 10}`} />}
          {k.typ === 'gateway' && k.art === 'o' && <circle class="dg-dick dg-ohne" cx={cx} cy={cy} r={9} />}
          {k.typ === 'gateway' && k.art && !['x', '+', 'o'].includes(k.art) && <Text x={cx} y={cy} text={k.art} luecken={luecken} />}
          {k.typ !== 'beziehung' && k.text && <Text x={x + w + 6} y={y - 6} text={k.text} luecken={luecken} anker="start" klasse="dg-klein" />}
        </>
      );
      break;
    }
    case 'balken':
      inhalt = <rect class="dg-voll" x={x} y={y} width={w} height={h} rx={2} />;
      break;
    case 'zustand': {
      const intern = k.intern ?? [];
      inhalt = (
        <>
          <rect class="dg-form" x={x} y={y} width={w} height={h} rx={12} />
          <Text x={cx} y={y + 16} text={k.name} luecken={luecken} klasse="dg-fett" />
          {intern.length > 0 && <path class="dg-linie" d={`M${x},${y + 28}H${x + w}`} />}
          {intern.map((z, i) => (
            <Text key={i} x={x + 9} y={y + 41 + i * 14} text={z} luecken={luecken} anker="start" klasse="dg-klein" />
          ))}
        </>
      );
      break;
    }
    case 'klasse': {
      const km = klassenMasse(k);
      const yName = y + (k.stereotyp ? 14 : 0) + 15;
      const zeile = (z, i, y0) => {
        const kursiv = z.startsWith('*');
        const statisch = z.startsWith('_');
        const t = kursiv || statisch ? z.slice(1) : z;
        return <Text key={i} x={x + 8} y={y0 + 12 + i * ZEILE} text={t} luecken={luecken} anker="start" klasse={`dg-mono ${kursiv ? 'dg-kursiv' : ''} ${statisch ? 'dg-pk' : ''}`} />;
      };
      inhalt = (
        <>
          <rect class="dg-form" x={x} y={y} width={w} height={h} />
          {k.stereotyp && <Text x={cx} y={y + 11} text={`«${k.stereotyp}»`} luecken={luecken} klasse="dg-klein" />}
          <Text x={cx} y={yName} text={k.name} luecken={luecken} klasse={`dg-fett ${k.abstrakt ? 'dg-kursiv' : ''}`} />
          <path class="dg-linie" d={`M${x},${y + km.kopf}H${x + w}M${x},${y + km.kopf + km.attr}H${x + w}`} />
          {(k.attribute ?? []).map((z, i) => zeile(z, i, y + km.kopf + 2))}
          {(k.methoden ?? []).map((z, i) => zeile(z, i, y + km.kopf + km.attr + 2))}
        </>
      );
      break;
    }
    case 'entitaet':
    case 'info':
      inhalt = (
        <>
          <rect class={`dg-form ${k.typ === 'info' ? 'dg-info' : ''}`} x={x} y={y} width={w} height={h} />
          {k.schwach && <rect class="dg-form" x={x + 4} y={y + 4} width={w - 8} height={h - 8} />}
          <Text x={cx} y={cy} text={k.text} luecken={luecken} max={max} klasse={k.typ === 'entitaet' ? 'dg-fett' : ''} />
        </>
      );
      break;
    case 'tabelle':
      inhalt = (
        <>
          <rect class="dg-form" x={x} y={y} width={w} height={h} rx={4} />
          <rect class="dg-tabkopf" x={x} y={y} width={w} height={26} rx={4} />
          <Text x={cx} y={y + 13} text={k.name} luecken={luecken} klasse="dg-fett" />
          {k.spalten.map((s, i) => {
            const yy = y + 26 + 3 + i * 19 + 9.5;
            return (
              <g key={i}>
                {s.pk && (
                  <text class="dg-schluessel dg-schluessel--pk" x={x + 8} y={yy + 4}>
                    PK
                  </text>
                )}
                {s.fk && (
                  <text class="dg-schluessel dg-schluessel--fk" x={x + (s.pk ? 24 : 8)} y={yy + 4}>
                    FK
                  </text>
                )}
                <Text x={x + (s.pk && s.fk ? 42 : s.pk || s.fk ? 26 : 10)} y={yy} text={s.name} luecken={luecken} anker="start" klasse={`dg-mono ${s.pk ? 'dg-pk' : ''}`} />
              </g>
            );
          })}
        </>
      );
      break;
    case 'ereignis': {
      const e = 12;
      inhalt = (
        <>
          <path class="dg-form dg-ereignis" d={`M${x + e},${y}H${x + w - e}L${x + w},${cy}L${x + w - e},${y + h}H${x + e}L${x},${cy}Z`} />
          <Text x={cx} y={cy} text={k.text} luecken={luecken} max={max - 2} />
        </>
      );
      break;
    }
    case 'konnektor':
      inhalt = (
        <>
          <circle class="dg-form" cx={cx} cy={cy} r={w / 2} />
          <Text x={cx} y={cy} text={k.text ?? { xor: 'XOR', und: '∧', oder: '∨' }[k.art] ?? ''} luecken={luecken} klasse="dg-fett dg-klein" />
        </>
      );
      break;
    case 'startereignis':
    case 'zwischenereignis':
    case 'endereignis':
      inhalt = (
        <>
          <circle class={`dg-form ${k.typ === 'endereignis' ? 'dg-dick' : ''}`} cx={cx} cy={cy} r={w / 2} />
          {k.typ === 'zwischenereignis' && <circle class="dg-hohl" cx={cx} cy={cy} r={w / 2 - 4} />}
          {k.symbol === 'brief' && <path class="dg-linie" d={`M${cx - 8},${cy - 5}h16v11h-16zM${cx - 8},${cy - 5}l8,6l8,-6`} />}
          {k.symbol === 'uhr' && <path class="dg-linie" d={`M${cx},${cy - 8}V${cy}L${cx + 5},${cy + 3}`} />}
          {k.text && <Text x={cx} y={y + h + 14} text={k.text} luecken={luecken} max={20} klasse="dg-klein" />}
        </>
      );
      break;
    case 'datenobjekt':
      inhalt = (
        <>
          <path class="dg-form" d={`M${x},${y}H${x + w - 10}L${x + w},${y + 10}V${y + h}H${x}Z`} />
          <path class="dg-linie" d={`M${x + w - 10},${y}V${y + 10}H${x + w}`} />
          {k.text && <Text x={cx} y={y + h + 14} text={k.text} luecken={luecken} max={20} klasse="dg-klein" />}
        </>
      );
      break;
    case 'lebenslinie':
      inhalt = (
        <>
          <path class="dg-linie dg-strich" d={`M${cx},${y + h}V${y + h + (k.laenge ?? 300)}`} />
          {(k.aktiv ?? []).map(([a, b], i) => (
            <rect key={i} class="dg-form" x={cx - 5} y={a} width={10} height={b - a} />
          ))}
          <rect class="dg-form" x={x} y={y} width={w} height={h} />
          <Text x={cx} y={cy} text={k.text} luecken={luecken} max={max} />
          {k.zerstoert !== undefined && <path class="dg-dick" d={`M${cx - 9},${k.zerstoert - 9}L${cx + 9},${k.zerstoert + 9}M${cx + 9},${k.zerstoert - 9}L${cx - 9},${k.zerstoert + 9}`} />}
        </>
      );
      break;
    case 'text':
      inhalt = <Text x={x} y={y} text={k.text} luecken={luecken} anker={k.anker ?? 'start'} klasse={k.klein ? 'dg-klein' : ''} max={k.max} />;
      break;
    case 'kasten':
      inhalt = <Kasten k={k} m={m} luecken={luecken} />;
      break;
    default:
      inhalt = <rect class="dg-form" x={x} y={y} width={w} height={h} />;
  }
  return (
    <g class={`dg-knoten ${k.hervor ? 'dg-knoten--hervor' : ''}`}>
      {inhalt}
      {marken && k.marke && <Marke x={x + w} y={y} n={k.marke} />}
    </g>
  );
}

// Bausteine für Masken und Mockups (helles „Papier")
function Kasten({ k, m, luecken }) {
  const { x, y, w, h } = m;
  const [cx, cy] = mitte(m);
  const farbe = k.farbe ? { fill: k.farbe } : undefined;
  const textFarbe = k.textFarbe ? { fill: k.textFarbe } : undefined;
  const t = (tx, ty, anker = 'start', kl = '') => (
    <g style={textFarbe}>
      <Text x={tx} y={ty} text={k.text} luecken={luecken} anker={anker} klasse={`mk-text ${kl}`} groesse={k.groesse} farbe={k.textFarbe} />
    </g>
  );
  switch (k.stil) {
    case 'text':
      return t(x, cy, k.anker ?? 'start', k.fett ? 'dg-fett' : '');
    case 'feld':
      return (
        <>
          <rect class="mk-feld" x={x} y={y} width={w} height={h} rx={3} style={farbe} />
          {k.text && t(x + 8, cy, 'start', 'mk-platzhalter')}
        </>
      );
    case 'knopf':
      return (
        <>
          <rect class={`mk-knopf ${k.zweit ? 'mk-knopf--zweit' : ''}`} x={x} y={y} width={w} height={h} rx={5} style={farbe} />
          {t(cx, cy, 'middle', k.zweit ? '' : 'mk-knopftext')}
        </>
      );
    case 'auswahl':
      return (
        <>
          <rect class="mk-feld" x={x} y={y} width={w} height={h} rx={3} style={farbe} />
          {k.text && t(x + 8, cy)}
          <path class="mk-linie" d={`M${x + w - 18},${cy - 3}l5,6l5,-6`} />
        </>
      );
    case 'check':
    case 'radio':
      return (
        <>
          {k.stil === 'check' ? <rect class="mk-feld" x={x} y={cy - 7} width={14} height={14} rx={2} /> : <circle class="mk-feld" cx={x + 7} cy={cy} r={7} />}
          {k.an && (k.stil === 'check' ? <path class="mk-linie mk-dick" d={`M${x + 3},${cy}l3,3l5,-6`} /> : <circle class="mk-voll" cx={x + 7} cy={cy} r={3.5} />)}
          {t(x + 22, cy)}
        </>
      );
    case 'bild':
      return (
        <>
          <rect class="mk-feld" x={x} y={y} width={w} height={h} rx={3} style={farbe} />
          <path class="mk-linie mk-duenn" d={`M${x},${y}L${x + w},${y + h}M${x + w},${y}L${x},${y + h}`} />
          {k.text && <rect class="mk-papier" x={cx - laenge(k.text) * 3.4 - 6} y={cy - 9} width={laenge(k.text) * 6.8 + 12} height={18} />}
          {k.text && t(cx, cy, 'middle')}
        </>
      );
    case 'diagramm':
      return (
        <>
          <rect class="mk-feld" x={x} y={y} width={w} height={h} rx={3} style={farbe} />
          <path class="mk-linie mk-duenn" d={`M${x + 12},${y + 8}V${y + h - 12}H${x + w - 8}`} />
          <path class="mk-linie mk-akzent" d={`M${x + 14},${y + h * 0.7}L${x + w * 0.3},${y + h * 0.45}L${x + w * 0.5},${y + h * 0.6}L${x + w * 0.72},${y + h * 0.3}L${x + w - 12},${y + h * 0.38}`} />
          {k.text && t(x + 18, y + 14, 'start', 'mk-klein')}
        </>
      );
    case 'liste':
    case 'tabelle': {
      const n = Math.max(2, Math.floor(h / 22));
      return (
        <>
          <rect class="mk-feld" x={x} y={y} width={w} height={h} rx={3} style={farbe} />
          {Array.from({ length: n - 1 }, (_, i) => (
            <path key={i} class="mk-linie mk-duenn" d={`M${x},${y + (i + 1) * (h / n)}H${x + w}`} />
          ))}
          {k.stil === 'tabelle' && <path class="mk-linie mk-duenn" d={`M${x + w * 0.4},${y}V${y + h}`} />}
          {k.text && t(x + 8, y + h / n / 2, 'start', 'mk-klein')}
        </>
      );
    }
    case 'kalender':
      return (
        <>
          <rect class="mk-feld" x={x} y={y} width={w} height={h} rx={3} />
          <path class="mk-linie mk-duenn" d={`M${x},${y + 22}H${x + w}`} />
          {Array.from({ length: 4 }, (_, r) =>
            Array.from({ length: 7 }, (_, c) => <rect key={`${r}-${c}`} class="mk-zelle" x={x + 8 + c * ((w - 16) / 7)} y={y + 30 + r * ((h - 38) / 4)} width={(w - 16) / 7 - 3} height={(h - 38) / 4 - 3} rx={2} />),
          )}
          {k.text && t(cx, y + 11, 'middle', 'mk-klein')}
        </>
      );
    case 'rahmen':
      return (
        <>
          <rect class="mk-gruppe" x={x} y={y} width={w} height={h} rx={4} />
          {k.text && (
            <>
              <rect class="mk-papier" x={x + 8} y={y - 8} width={laenge(k.text) * 6.6 + 10} height={16} />
              {t(x + 13, y, 'start', 'mk-klein')}
            </>
          )}
        </>
      );
    case 'leiste':
      return (
        <>
          <rect class="mk-leiste" x={x} y={y} width={w} height={h} style={farbe} />
          {k.text && t(x + 12, cy, 'start', 'mk-leistentext')}
        </>
      );
    default:
      return <rect class="mk-feld" x={x} y={y} width={w} height={h} />;
  }
}

// ---------- Rahmen (Systemgrenze, Schwimmbahnen, Pool, Fragment, Maske) ----------

function Rahmen({ r, luecken, marken }) {
  const { x, y } = r;
  let inhalt;
  switch (r.typ) {
    case 'system':
      inhalt = (
        <>
          <rect class="dg-rahmen" x={x} y={y} width={r.w} height={r.h} />
          <Text x={x + 10} y={y + 15} text={r.text} luecken={luecken} anker="start" klasse="dg-fett" />
        </>
      );
      break;
    case 'bahnen': {
      let xx = x;
      const kopf = r.kopf ?? 28;
      inhalt = (
        <>
          {r.bahnen.map((b, i) => {
            const el = (
              <g key={i}>
                <rect class="dg-rahmen" x={xx} y={y} width={b.w} height={r.h} />
                <path class="dg-linie dg-duenn" d={`M${xx},${y + kopf}H${xx + b.w}`} />
                <Text x={xx + b.w / 2} y={y + kopf / 2} text={b.text} luecken={luecken} klasse="dg-fett" />
              </g>
            );
            xx += b.w;
            return el;
          })}
        </>
      );
      break;
    }
    case 'pool': {
      let yy = y;
      const leiste = 28;
      const lanes = r.lanes ?? [{ text: '', h: r.h }];
      const gesamt = lanes.reduce((s, l) => s + l.h, 0);
      inhalt = (
        <>
          <rect class="dg-rahmen" x={x} y={y} width={r.w} height={gesamt} />
          <path class="dg-linie dg-duenn" d={`M${x + leiste},${y}V${y + gesamt}`} />
          <g transform={`translate(${x + leiste / 2},${y + gesamt / 2}) rotate(-90)`}>
            <Text x={0} y={0} text={r.text} luecken={luecken} klasse="dg-fett" />
          </g>
          {r.lanes &&
            lanes.map((l, i) => {
              const el = (
                <g key={i}>
                  <rect class="dg-rahmen dg-ohne" x={x + leiste} y={yy} width={r.w - leiste} height={l.h} />
                  <path class="dg-linie dg-duenn" d={`M${x + leiste + 24},${yy}V${yy + l.h}`} />
                  <g transform={`translate(${x + leiste + 12},${yy + l.h / 2}) rotate(-90)`}>
                    <Text x={0} y={0} text={l.text} luecken={luecken} klasse="dg-klein" />
                  </g>
                </g>
              );
              yy += l.h;
              return el;
            })}
        </>
      );
      break;
    }
    case 'fragment': {
      const tw = Math.max(36, laenge(r.art) * 8 + 18);
      inhalt = (
        <>
          <rect class="dg-rahmen dg-ohne" x={x} y={y} width={r.w} height={r.h} />
          <path class="dg-form" d={`M${x},${y}H${x + tw}V${y + 12}L${x + tw - 8},${y + 20}H${x}Z`} />
          <Text x={x + 7} y={y + 10} text={r.art} luecken={luecken} anker="start" klasse="dg-fett dg-klein" />
          {(r.trenner ?? []).map((ty, i) => (
            <path key={i} class="dg-linie dg-strich" d={`M${x},${ty}H${x + r.w}`} />
          ))}
          {(r.waechter ?? []).map((g, i) => (
            <Text key={i} x={g.x ?? x + tw + 8} y={g.y} text={g.text} luecken={luecken} anker="start" klasse="dg-klein dg-kursiv" />
          ))}
        </>
      );
      break;
    }
    case 'maske':
      inhalt = (
        <>
          <rect class="mk-papier mk-schatten" x={x} y={y} width={r.w} height={r.h} rx={r.geraet ? 18 : 6} />
          {r.text && (
            <>
              <path class="mk-titelleiste" d={`M${x},${y + (r.geraet ? 18 : 6)}a${r.geraet ? 18 : 6},${r.geraet ? 18 : 6} 0 0 1 ${r.geraet ? 18 : 6},-${r.geraet ? 18 : 6}H${x + r.w - (r.geraet ? 18 : 6)}a${r.geraet ? 18 : 6},${r.geraet ? 18 : 6} 0 0 1 ${r.geraet ? 18 : 6},${r.geraet ? 18 : 6}V${y + 30}H${x}Z`} />
              <Text x={x + 14} y={y + 16} text={r.text} luecken={luecken} anker="start" klasse="mk-titel" />
            </>
          )}
        </>
      );
      break;
    default:
      inhalt = <rect class="dg-rahmen dg-strich" x={x} y={y} width={r.w} height={r.h} rx={6} />;
  }
  return (
    <g>
      {inhalt}
      {marken && r.marke && <Marke x={x + (r.w ?? 0)} y={y} n={r.marke} />}
    </g>
  );
}

// ---------- Diagramm ----------

export function Diagramm({ d, luecken, marken = true, beschriftung }) {
  const knoten = new Map(d.knoten.map((k) => [k.id, { k, m: masse(k) }]));
  return (
    <div class="dg-huelle">
      <svg class="dg" viewBox={`0 0 ${d.breite} ${d.hoehe}`} style={{ maxWidth: `${d.breite}px` }} role="img" aria-label={beschriftung ?? 'Diagramm'}>
        {(d.rahmen ?? []).map((r, i) => (
          <Rahmen key={`r${i}`} r={r} luecken={luecken} marken={marken} />
        ))}
        {d.knoten.map((k) => (
          <Knoten key={k.id} k={k} m={knoten.get(k.id).m} luecken={luecken} marken={marken} />
        ))}
        {(d.kanten ?? []).map((ka, i) => (
          <Kante key={`k${i}`} kante={ka} knoten={knoten} luecken={luecken} marken={marken} />
        ))}
      </svg>
    </div>
  );
}

