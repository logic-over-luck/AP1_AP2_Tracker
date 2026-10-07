// Intro: ein Terminal tippt „hello world", das Logo springt auf, der Name fährt hoch – dann blendet
// die App ein. Von selbst einmal je Tab (nicht bei „Bewegung reduzieren"), jederzeit per Klick aufs
// Logo. Überspringbar mit Klick oder Taste. Wenn es wirklich vorbei ist, meldet es das (aufIntroEnde),
// damit das Cockpit erst dann seine Kacheln auftreten lässt.

import { useEffect, useRef, useState } from 'preact/hooks';
import { Icon } from '../../ui/bausteine.jsx';

const SCHLUESSEL = 'lernstudio.intro';
const TEXT = 'hello world';
const TIPPEN_AB = 220; // ms
const JE_ZEICHEN = 55;
const LOGO_AB = TIPPEN_AB + TEXT.length * JE_ZEICHEN + 260;
const ENDE_AB = LOGO_AB + 1240;
const AUSBLENDEN = 500;

function vonSelbstZeigen() {
  try {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    if (sessionStorage.getItem(SCHLUESSEL)) return false;
    sessionStorage.setItem(SCHLUESSEL, '1');
  } catch {}
  return true;
}

// ---------- Zustand für andere Bereiche ----------

let laeuft = vonSelbstZeigen();
const startetVonSelbst = laeuft;
const endeHoerer = new Set();
const startHoerer = new Set();

export const introLaeuft = () => laeuft;
export function aufIntroEnde(f) {
  endeHoerer.add(f);
  return () => endeHoerer.delete(f);
}
export function aufIntroStart(f) {
  startHoerer.add(f);
  return () => startHoerer.delete(f);
}
export function spieleIntro() {
  window.dispatchEvent(new Event('intro-abspielen'));
}
// Erstes Anzeigen des Cockpits in diesem Tab (für den gestaffelten Auftritt ohne Intro)
export const frischGeoeffnet = { wert: true };

// ---------- Anzeige ----------

export function Intro() {
  const [lauf, setLauf] = useState(startetVonSelbst ? 1 : 0); // 0 = nichts zu zeigen
  const [getippt, setGetippt] = useState(0);
  const [logo, setLogo] = useState(false);
  const [weg, setWeg] = useState(false);
  const beenden = useRef(() => {});

  // Klick aufs Logo
  useEffect(() => {
    const h = () => {
      laeuft = true;
      for (const f of startHoerer) f();
      setGetippt(0);
      setLogo(false);
      setWeg(false);
      setLauf((n) => n + 1);
    };
    window.addEventListener('intro-abspielen', h);
    return () => window.removeEventListener('intro-abspielen', h);
  }, []);

  // Ein Durchlauf
  useEffect(() => {
    if (!lauf) return;
    const zeiten = [];
    let fertig = false;
    const ende = () => {
      if (fertig) return;
      fertig = true;
      setWeg(true);
      zeiten.push(
        setTimeout(() => {
          setLauf(0);
          laeuft = false;
          for (const f of endeHoerer) f();
        }, AUSBLENDEN),
      );
    };
    beenden.current = ende;
    for (let i = 1; i <= TEXT.length; i++) zeiten.push(setTimeout(() => setGetippt(i), TIPPEN_AB + i * JE_ZEICHEN));
    zeiten.push(setTimeout(() => setLogo(true), LOGO_AB));
    zeiten.push(setTimeout(ende, ENDE_AB));
    const taste = (e) => {
      if (e.key === 'Tab') return;
      ende();
    };
    window.addEventListener('keydown', taste);
    return () => {
      zeiten.forEach(clearTimeout);
      window.removeEventListener('keydown', taste);
    };
  }, [lauf]);

  if (!lauf) return null;
  return (
    <div key={lauf} class={`intro ${logo ? 'intro--logo' : ''} ${weg ? 'intro--weg' : ''}`} role="presentation" onClick={() => beenden.current()}>
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
