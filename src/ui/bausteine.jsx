// Gemeinsame Bausteine. Jeder sieht überall gleich aus und bewegt sich gleich.

import { useEffect, useRef, useState } from 'preact/hooks';
import icons from 'virtual:icons';

export function Icon({ name, groesse = 16, strich = 1.75, class: klasse, ...rest }) {
  const knoten = icons[name];
  if (!knoten && typeof console !== 'undefined') console.warn(`Symbol fehlt: ${name}`);
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={groesse}
      height={groesse}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width={strich}
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
      class={klasse}
      {...rest}
    >
      {(knoten ?? []).map(([tag, attr], i) => {
        const Tag = tag;
        return <Tag key={i} {...attr} />;
      })}
    </svg>
  );
}

export function Knopf({ variante = 'zweit', groesse = 'm', icon, iconRechts, zahl, children, class: klasse = '', ...rest }) {
  const iconGroesse = groesse === 's' ? 14 : 16;
  return (
    <button type="button" class={`knopf knopf--${variante} knopf--${groesse} ${klasse}`} {...rest}>
      {icon && <Icon name={icon} groesse={iconGroesse} />}
      {children}
      {zahl !== undefined && zahl !== null && <span class="knopf__zahl">{zahl}</span>}
      {iconRechts && <Icon name={iconRechts} groesse={iconGroesse} />}
    </button>
  );
}

export function SymbolKnopf({ icon, label, groesse = 'm', tipUnten, class: klasse = '', ...rest }) {
  return (
    <button
      type="button"
      class={`symbolknopf ${groesse === 's' ? 'symbolknopf--s' : ''} ${klasse}`}
      aria-label={label}
      data-tip={label}
      data-tip-unten={tipUnten ? '' : undefined}
      {...rest}
    >
      <Icon name={icon} groesse={groesse === 's' ? 15 : 17} />
    </button>
  );
}

export function Haken({ an, teil, onWechsel, label, gross, disabled, class: klasse = '' }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={an ? 'true' : teil ? 'mixed' : 'false'}
      aria-label={label}
      disabled={disabled}
      class={`haken ${gross ? 'haken--gross' : ''} ${teil && !an ? 'haken--teil' : ''} ${klasse}`}
      onClick={(e) => {
        e.stopPropagation();
        onWechsel?.(!an);
      }}
    >
      {(an || !teil) && (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
      )}
    </button>
  );
}

const PRIO_TEXT = { top: 'Top-Thema', hoch: 'Häufig', mittel: 'Gelegentlich', normal: 'Selten' };
const PRIO_ICON = { top: 'flame' };

// Wichtigkeit eines Themas: wie oft es in den ausgewerteten Prüfungen vorkam (und mit wie vielen Punkten)
export function wichtigkeitText({ prio, pruefungen, punkte }) {
  if (!pruefungen) return 'Bisher in keiner ausgewerteten Prüfung dran – steht aber im Prüfungskatalog';
  const teile = [`Kam in ${pruefungen} ${pruefungen === 1 ? 'ausgewerteten Prüfung' : 'ausgewerteten Prüfungen'} vor`];
  if (punkte) teile.push(`bis zu ${punkte} Punkte in einer Aufgabe`);
  if (prio === 'top') teile.push('eines der wichtigsten Themen');
  return teile.join(' · ');
}

export function PrioMarke({ prio, pruefungen, punkte }) {
  return (
    <span class={`marke marke--${prio}`} data-tip={wichtigkeitText({ prio, pruefungen, punkte })}>
      {PRIO_ICON[prio] && <Icon name={PRIO_ICON[prio]} groesse={11} strich={2.2} />}
      {PRIO_TEXT[prio]}
    </span>
  );
}

export function Marke({ ton = 'neutral', icon, children, tip }) {
  return (
    <span class={`marke marke--${ton}`} data-tip={tip}>
      {icon && <Icon name={icon} groesse={11} strich={2.2} />}
      {children}
    </span>
  );
}

export function Balken({ wert, ton, dick, label }) {
  const prozent = Math.max(0, Math.min(1, wert || 0)) * 100;
  return (
    <div class={`balken ${dick ? 'balken--dick' : ''}`} role="progressbar" aria-valuenow={Math.round(prozent)} aria-valuemin="0" aria-valuemax="100" aria-label={label}>
      <div class={`balken__fuellung ${ton ? `balken__fuellung--${ton}` : ''}`} style={{ width: `${prozent}%` }} />
    </div>
  );
}

export function Ring({ wert, groesse = 20, dicke = 2.5 }) {
  const r = (groesse - dicke) / 2;
  const umfang = 2 * Math.PI * r;
  return (
    <svg class="ring" width={groesse} height={groesse} aria-hidden="true">
      <circle class="ring__spur" cx={groesse / 2} cy={groesse / 2} r={r} fill="none" stroke-width={dicke} />
      <circle
        class="ring__wert"
        cx={groesse / 2}
        cy={groesse / 2}
        r={r}
        fill="none"
        stroke-width={dicke}
        stroke-linecap="round"
        stroke-dasharray={umfang}
        stroke-dashoffset={umfang * (1 - Math.max(0, Math.min(1, wert)))}
      />
    </svg>
  );
}

// Klappt weich auf und zu; der Inhalt wird erst beim ersten Öffnen gebaut.
export function Aufklapp({ offen, children }) {
  const [war, setWar] = useState(offen);
  useEffect(() => {
    if (offen) setWar(true);
  }, [offen]);
  return (
    <div class="aufklapp" data-offen={offen ? 'true' : 'false'}>
      <div class="aufklapp__innen">{war ? children : null}</div>
    </div>
  );
}

// Zählt beim Ändern weich zur neuen Zahl hoch.
export function Zahl({ wert, format = (x) => String(Math.round(x)) }) {
  const [anzeige, setAnzeige] = useState(wert);
  const vorher = useRef(wert);
  useEffect(() => {
    const von = vorher.current;
    vorher.current = wert;
    if (von === wert || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setAnzeige(wert);
      return;
    }
    const start = performance.now();
    const dauer = 600;
    let rahmen;
    const schritt = (jetzt) => {
      const p = Math.min(1, (jetzt - start) / dauer);
      const e = 1 - Math.pow(1 - p, 3);
      setAnzeige(von + (wert - von) * e);
      if (p < 1) rahmen = requestAnimationFrame(schritt);
    };
    rahmen = requestAnimationFrame(schritt);
    return () => cancelAnimationFrame(rahmen);
  }, [wert]);
  return <>{format(anzeige)}</>;
}

export function Reiter({ eintraege, aktiv, onWahl, label }) {
  return (
    <div class="reiter" role="tablist" aria-label={label}>
      {eintraege.map((e) => (
        <button key={e.id} type="button" role="tab" aria-selected={aktiv === e.id} class="reiter__knopf" onClick={() => onWahl(e.id)}>
          {e.icon && <Icon name={e.icon} groesse={14} />}
          {e.text}
          {e.zahl !== undefined && <span class="reiter__zahl">{e.zahl}</span>}
        </button>
      ))}
    </div>
  );
}

export function Suchfeld({ wert, onEingabe, platzhalter = 'Suchen …', autoFocus, eingabeRef }) {
  return (
    <div class="suchfeld">
      <Icon name="search" groesse={15} />
      <input
        ref={eingabeRef}
        class="feld"
        type="search"
        value={wert}
        placeholder={platzhalter}
        aria-label={platzhalter}
        autoFocus={autoFocus}
        onInput={(e) => onEingabe(e.currentTarget.value)}
        onKeyDown={(e) => {
          if (e.key === 'Escape' && wert) {
            e.stopPropagation();
            onEingabe('');
          }
        }}
      />
      {wert && <SymbolKnopf class="suchfeld__leeren" icon="x" label="Suche leeren" groesse="s" onClick={() => onEingabe('')} />}
    </div>
  );
}

export function Kbd({ children }) {
  return <kbd class="kbd">{children}</kbd>;
}

export function Leer({ icon = 'sparkles', titel, children, aktion }) {
  return (
    <div class="leer">
      <div class="leer__symbol">
        <Icon name={icon} groesse={22} />
      </div>
      <div class="leer__titel">{titel}</div>
      {children && <div class="leer__text">{children}</div>}
      {aktion}
    </div>
  );
}

// Einfache Textauszeichnung: Zeilen mit „- " als Liste, `Code`, **fett**.
export function Rich({ text, class: klasse = '' }) {
  if (!text) return null;
  const bloecke = [];
  let liste = null;
  for (const zeile of String(text).split('\n')) {
    if (/^\s*[-–•]\s+/.test(zeile)) {
      if (!liste) bloecke.push((liste = { liste: [] }));
      liste.liste.push(zeile.replace(/^\s*[-–•]\s+/, ''));
    } else if (zeile.trim()) {
      liste = null;
      bloecke.push({ absatz: zeile });
    }
  }
  return (
    <div class={`rich ${klasse}`}>
      {bloecke.map((b, i) =>
        b.liste ? (
          <ul key={i}>
            {b.liste.map((z, j) => (
              <li key={j}>{inline(z)}</li>
            ))}
          </ul>
        ) : (
          <p key={i}>{inline(b.absatz)}</p>
        ),
      )}
    </div>
  );
}

function inline(text) {
  const teile = [];
  const muster = /(`[^`]+`|\*\*[^*]+\*\*)/g;
  let letzte = 0;
  let m;
  while ((m = muster.exec(text))) {
    if (m.index > letzte) teile.push(text.slice(letzte, m.index));
    const t = m[0];
    teile.push(t.startsWith('`') ? <code key={m.index}>{t.slice(1, -1)}</code> : <strong key={m.index}>{t.slice(2, -2)}</strong>);
    letzte = m.index + t.length;
  }
  if (letzte < text.length) teile.push(text.slice(letzte));
  return teile;
}

// Hebt Suchtreffer hervor.
export function Treffer({ text, suche }) {
  if (!suche || !text) return text ?? null;
  const i = text.toLowerCase().indexOf(suche.toLowerCase());
  if (i === -1) return text;
  return (
    <>
      {text.slice(0, i)}
      <mark class="treffer">{text.slice(i, i + suche.length)}</mark>
      {text.slice(i + suche.length)}
    </>
  );
}
