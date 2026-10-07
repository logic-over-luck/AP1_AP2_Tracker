// Fokus-Timer mit 15, 25 und 45 Minuten. Läuft weiter, wenn man den Bereich wechselt oder
// die Seite neu lädt (Startzeit liegt in den Ansichts-Einstellungen). Am Ende wird die
// Fokuszeit ins Protokoll geschrieben; beim Abbrechen zählen die angefangenen Minuten.

import { useEffect, useState } from 'preact/hooks';
import { useEinstellung } from '../../lernstand/einstellungen.js';
import { erfasse } from '../../lernstand/store.js';
import { Icon, SymbolKnopf } from '../../ui/bausteine.jsx';
import { melde } from '../../ui/dialog.jsx';

const DAUERN = [15, 25, 45];

function format(sek) {
  const s = Math.max(0, Math.round(sek));
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

function ton() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    [0, 0.18, 0.36].forEach((t, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.frequency.value = [660, 880, 990][i];
      o.type = 'sine';
      g.gain.setValueAtTime(0.0001, ctx.currentTime + t);
      g.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + t + 0.3);
      o.connect(g).connect(ctx.destination);
      o.start(ctx.currentTime + t);
      o.stop(ctx.currentTime + t + 0.32);
    });
  } catch {}
}

// Ein gemeinsamer Takt für alle Anzeigen des Timers
export function useTimer() {
  const [timer, setTimer] = useEinstellung('timer', { minuten: 25, start: null, pause: null, raum: null });
  const [, tick] = useState(0);
  const laeuft = timer.start !== null && timer.pause === null;
  useEffect(() => {
    if (!laeuft) return;
    const id = setInterval(() => tick((x) => x + 1), 1000);
    return () => clearInterval(id);
  }, [laeuft]);

  const gesamt = timer.minuten * 60;
  const vergangen = timer.start === null ? 0 : ((timer.pause ?? Date.now()) - timer.start) / 1000;
  const rest = gesamt - vergangen;

  useEffect(() => {
    if (laeuft && rest <= 0) {
      erfasse({ e: 'fokus', min: timer.minuten, r: timer.raum });
      setTimer({ ...timer, start: null, pause: null });
      ton();
      melde(`${timer.minuten} Minuten Fokus geschafft. Gönn dir eine kurze Pause.`, { icon: 'coffee', dauer: 8000 });
      document.title = 'Lernstudio · Fachinformatik';
    } else if (laeuft) {
      document.title = `${format(rest)} · Fokus – Lernstudio`;
    }
  });

  return {
    timer,
    laeuft,
    pausiert: timer.pause !== null,
    rest,
    anteil: timer.start === null ? 0 : Math.min(1, vergangen / gesamt),
    starte: (raum) => setTimer({ ...timer, start: Date.now(), pause: null, raum }),
    pausiere: () => setTimer({ ...timer, pause: Date.now() }),
    weiter: () => setTimer({ ...timer, start: timer.start + (Date.now() - timer.pause), pause: null }),
    abbrechen: () => {
      const min = Math.floor(vergangen / 60);
      if (min >= 1) {
        erfasse({ e: 'fokus', min, r: timer.raum });
        melde(`${min} Minuten Fokuszeit gespeichert.`, { icon: 'timer' });
      }
      setTimer({ ...timer, start: null, pause: null });
      document.title = 'Lernstudio · Fachinformatik';
    },
    waehle: (minuten) => timer.start === null && setTimer({ ...timer, minuten }),
  };
}

export function FokusTimer({ raum }) {
  const t = useTimer();
  const umfang = 2 * Math.PI * 52;
  return (
    <section class="flaeche flaeche--innen fokus" aria-label="Fokus-Timer">
      <div class="fokus__kopf">
        <Icon name="timer" groesse={16} />
        <span>Zeit für Fokus</span>
      </div>
      <div class="fokus__mitte">
        <div class="fokus__uhr">
          <svg viewBox="0 0 120 120" class="fokus__ring" aria-hidden="true">
            <circle cx="60" cy="60" r="52" class="fokus__spur" />
            <circle cx="60" cy="60" r="52" class="fokus__wert" stroke-dasharray={umfang} stroke-dashoffset={umfang * (1 - t.anteil)} />
          </svg>
          <div class="fokus__zeit tabellenziffern" aria-live="off">
            {format(t.timer.start === null ? t.timer.minuten * 60 : t.rest)}
          </div>
          <div class="fokus__status">{t.laeuft ? 'läuft' : t.pausiert ? 'pausiert' : 'bereit'}</div>
        </div>
        <div class="fokus__steuerung">
          {!t.laeuft ? (
            <button class="fokus__start" aria-label={t.pausiert ? 'Weiter' : 'Starten'} onClick={() => (t.pausiert ? t.weiter() : t.starte(raum))}>
              <Icon name="play" groesse={20} />
            </button>
          ) : (
            <button class="fokus__start fokus__start--laeuft" aria-label="Pause" onClick={t.pausiere}>
              <Icon name="pause" groesse={20} />
            </button>
          )}
          <SymbolKnopf icon="rotate-ccw" label="Beenden" disabled={t.timer.start === null} onClick={t.abbrechen} />
        </div>
      </div>
      <div class="fokus__dauern" role="group" aria-label="Dauer">
        {DAUERN.map((m) => (
          <button key={m} class="fokus__dauer" aria-pressed={t.timer.minuten === m} disabled={t.timer.start !== null} onClick={() => t.waehle(m)}>
            {m} min
          </button>
        ))}
      </div>
    </section>
  );
}

// Kleine Anzeige in der Kopfzeile, solange der Timer läuft
export function TimerPille() {
  const t = useTimer();
  if (t.timer.start === null) return null;
  return (
    <button class="timer-pille" onClick={() => (t.laeuft ? t.pausiere() : t.weiter())} aria-label={t.laeuft ? 'Fokus pausieren' : 'Fokus fortsetzen'}>
      <Icon name={t.laeuft ? 'timer' : 'pause'} groesse={14} />
      <span class="tabellenziffern">{format(t.rest)}</span>
    </button>
  );
}
