// Intro beim Öffnen: ein Terminal tippt „hello world", das Logo springt auf, der Name fährt hoch –
// dann blendet die App ein. Einmal pro Sitzung, überspringbar (Klick, Taste), und bei
// „Bewegung reduzieren" im System gar nicht.

import { useEffect, useState } from 'preact/hooks';
import { Icon } from '../../ui/bausteine.jsx';

const SCHLUESSEL = 'lernstudio.intro';
const TEXT = 'hello world';

function sollZeigen() {
  try {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    if (sessionStorage.getItem(SCHLUESSEL)) return false;
    sessionStorage.setItem(SCHLUESSEL, '1');
  } catch {}
  return true;
}

// Einmal beim Laden entscheiden – das Cockpit fragt das ab, um seine Kacheln nach dem Intro auftreten zu lassen
export const INTRO_BEIM_START = sollZeigen();
export const INTRO_DAUER = 220 + 11 * 55 + 1500 + 300; // ms bis die App sichtbar wird
export const frischGeoeffnet = { wert: true };

export function Intro() {
  const [zeigen, setZeigen] = useState(INTRO_BEIM_START);
  const [getippt, setGetippt] = useState(0);
  const [logo, setLogo] = useState(false);
  const [weg, setWeg] = useState(false);

  useEffect(() => {
    if (!zeigen) return;
    const ende = () => {
      setWeg(true);
      setTimeout(() => setZeigen(false), 520);
    };
    const zeiten = [];
    for (let i = 1; i <= TEXT.length; i++) zeiten.push(setTimeout(() => setGetippt(i), 220 + i * 55));
    zeiten.push(setTimeout(() => setLogo(true), 220 + TEXT.length * 55 + 260));
    zeiten.push(setTimeout(ende, 220 + TEXT.length * 55 + 1500));
    const ueberspringen = () => ende();
    window.addEventListener('keydown', ueberspringen, { once: true });
    return () => {
      zeiten.forEach(clearTimeout);
      window.removeEventListener('keydown', ueberspringen);
    };
  }, [zeigen]);

  if (!zeigen) return null;
  return (
    <div
      class={`intro ${logo ? 'intro--logo' : ''} ${weg ? 'intro--weg' : ''}`}
      role="presentation"
      onClick={() => {
        setWeg(true);
        setTimeout(() => setZeigen(false), 520);
      }}
    >
      <div class="intro__gitter" aria-hidden="true" />
      <div class="intro__mitte">
        <div class="intro__terminal mono">
          <span class="intro__prompt">&gt;</span> {TEXT.slice(0, getippt)}
          <span class="intro__cursor" />
        </div>
        <div class="intro__logo">
          <span class="intro__bild">
            <Icon name="layers" groesse={34} strich={2} />
          </span>
          <span class="intro__name">Lernstudio</span>
          <span class="intro__zusatz">Fachinformatik · AP1 · AP2 · WiSo</span>
        </div>
      </div>
      <span class="intro__hinweis">Klick oder Taste zum Überspringen</span>
    </div>
  );
}
