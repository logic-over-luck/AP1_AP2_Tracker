// Befehlspalette (Strg+K): Stichpunkte, Blöcke, Glossar, Trainer und Bereiche von überall finden.

import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { inhalt } from '../../daten/inhalt.js';
import { link } from '../../router.js';
import { TRAINER, trainerIn } from '../trainer/verzeichnis.js';
import { Icon, Kbd } from '../../ui/bausteine.jsx';

function eintraegeFuer(raum) {
  const liste = [];
  const r = inhalt.raeume.get(raum);
  liste.push({ art: 'Bereich', icon: 'layout-grid', titel: 'Übersicht', ziel: link(raum) });
  liste.push({ art: 'Bereich', icon: 'list-checks', titel: 'Lernplan', ziel: link(raum, 'lernen') });
  liste.push({ art: 'Bereich', icon: 'layers', titel: 'Lernkarten', ziel: link(raum, 'karten') });
  liste.push({ art: 'Bereich', icon: 'refresh-cw', titel: 'Fällige Lernkarten lernen', ziel: link(raum, 'karten', 'sitzung', { quelle: 'faellig' }) });
  liste.push({ art: 'Bereich', icon: 'shuffle', titel: 'Zufallsmix', ziel: link(raum, 'karten', 'sitzung', { quelle: 'mix' }) });
  liste.push({ art: 'Bereich', icon: 'book-open', titel: 'Glossar', ziel: link(raum, 'glossar') });
  liste.push({ art: 'Bereich', icon: 'circle-question-mark', titel: 'Hilfe', ziel: link(raum, 'hilfe') });
  for (const anderer of inhalt.raeume.values())
    if (anderer.id !== raum) liste.push({ art: 'Lernraum', icon: 'arrow-left-right', titel: `Zu ${anderer.name} wechseln`, ziel: link(anderer.id) });
  for (const t of trainerIn(raum)) {
    liste.push({ art: 'Trainer', icon: t.icon, titel: t.name, zusatz: t.text, ziel: link(raum, 'trainer', t.id) });
  }
  for (const b of r.bloeckeListe) liste.push({ art: 'Block', icon: 'square-check-big', titel: b.titel, zusatz: b.satz, ziel: link(raum, 'lernen', null, { block: b.id }) });
  for (const b of r.bloeckeListe)
    for (const id of b.sp) {
      const sp = inhalt.sp.get(id);
      liste.push({ art: 'Stichpunkt', icon: 'circle-dot', titel: sp.titel, zusatz: b.titel, ziel: link(raum, 'lernen', null, { sp: id }) });
    }
  for (const g of inhalt.glossar)
    if (g.sp.some((id) => inhalt.raumVon(id) === raum)) liste.push({ art: 'Glossar', icon: 'book-open', titel: g.b, zusatz: g.l ?? g.e, ziel: link(raum, 'glossar', null, { begriff: g.b }) });
  return liste;
}

function bewerte(e, s) {
  const t = e.titel.toLowerCase();
  if (t === s) return 100;
  if (t.startsWith(s)) return 80;
  if (t.split(/[\s,:/()-]+/).some((w) => w.startsWith(s))) return 60;
  if (t.includes(s)) return 40;
  if ((e.zusatz ?? '').toLowerCase().includes(s)) return 10;
  return 0;
}

export function Befehlspalette({ raum }) {
  const [offen, setOffen] = useState(false);
  const [suche, setSuche] = useState('');
  const [aktiv, setAktiv] = useState(0);
  const eingabe = useRef(null);
  const liste = useRef(null);
  const alle = useMemo(() => eintraegeFuer(raum), [raum]);

  useEffect(() => {
    const taste = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOffen((o) => !o);
      } else if (e.key === '/' && !e.target.closest('input, textarea, select')) {
        e.preventDefault();
        setOffen(true);
      }
    };
    const oeffnen = () => setOffen(true);
    window.addEventListener('keydown', taste);
    window.addEventListener('palette-oeffnen', oeffnen);
    return () => {
      window.removeEventListener('keydown', taste);
      window.removeEventListener('palette-oeffnen', oeffnen);
    };
  }, []);
  useEffect(() => {
    if (offen) {
      setSuche('');
      setAktiv(0);
      setTimeout(() => eingabe.current?.focus(), 20);
    }
  }, [offen]);

  const s = suche.trim().toLowerCase();
  const treffer = s
    ? alle
        .map((e) => ({ e, p: bewerte(e, s) }))
        .filter((x) => x.p > 0)
        .sort((a, b) => b.p - a.p)
        .slice(0, 40)
        .map((x) => x.e)
    : alle.filter((e) => e.art === 'Bereich' || e.art === 'Trainer' || e.art === 'Lernraum');

  useEffect(() => {
    liste.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' });
  }, [aktiv]);

  if (!offen) return null;
  const waehle = (e) => {
    setOffen(false);
    location.hash = e.ziel;
  };
  return (
    <div class="dialog-huelle palette-huelle" onMouseDown={(e) => e.target === e.currentTarget && setOffen(false)}>
      <div class="dialog palette" role="dialog" aria-modal="true" aria-label="Suchen und springen">
        <div class="palette__eingabe">
          <Icon name="search" groesse={18} />
          <input
            ref={eingabe}
            value={suche}
            placeholder="Stichpunkt, Begriff, Trainer suchen …"
            aria-label="Suchen"
            onInput={(e) => {
              setSuche(e.currentTarget.value);
              setAktiv(0);
            }}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                setAktiv((a) => Math.min(a + 1, treffer.length - 1));
              } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setAktiv((a) => Math.max(a - 1, 0));
              } else if (e.key === 'Enter' && treffer[aktiv]) {
                waehle(treffer[aktiv]);
              } else if (e.key === 'Escape') {
                setOffen(false);
              }
            }}
          />
          <Kbd>Esc</Kbd>
        </div>
        <ul class="palette__liste" ref={liste} role="listbox">
          {treffer.length === 0 && <li class="palette__leer">Nichts gefunden.</li>}
          {treffer.map((e, i) => (
            <li key={e.ziel + e.titel} role="option" aria-selected={i === aktiv} class="palette__eintrag" onMouseMove={() => setAktiv(i)} onClick={() => waehle(e)}>
              <Icon name={e.icon} groesse={16} />
              <span class="wachsen palette__text">
                <span class="palette__titel">{e.titel}</span>
                {e.zusatz && <span class="palette__zusatz">{e.zusatz}</span>}
              </span>
              <span class="palette__art">{e.art}</span>
            </li>
          ))}
        </ul>
        <div class="palette__fuss">
          <span>
            <Kbd>↑</Kbd> <Kbd>↓</Kbd> wählen
          </span>
          <span>
            <Kbd>Enter</Kbd> öffnen
          </span>
          <span>
            <Kbd>Strg K</Kbd> oder <Kbd>/</Kbd> öffnet die Suche
          </span>
        </div>
      </div>
    </div>
  );
}

export { TRAINER };
