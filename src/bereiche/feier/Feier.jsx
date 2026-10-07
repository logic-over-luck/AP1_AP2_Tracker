// Besondere Momente: Rangaufstieg, Block geschafft, Serien-Meilenstein. Dazu die Rangleiter.

import { useEffect, useRef, useState } from 'preact/hooks';
import { aufFeier, useLernstand } from '../../lernstand/store.js';
import { RAENGE, XP } from '../../lernstand/regeln.js';
import { Icon, Knopf, Balken } from '../../ui/bausteine.jsx';
import { Dialog } from '../../ui/dialog.jsx';

function konfetti(canvas, staerke = 1) {
  if (!canvas || matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  canvas.width = innerWidth * dpr;
  canvas.height = innerHeight * dpr;
  ctx.scale(dpr, dpr);
  const akzent = getComputedStyle(document.documentElement).getPropertyValue('--akzent').trim() || '#5ad1a7';
  const farben = [akzent, '#ffffff', '#f0a85a', '#7ea6ff', '#c39bff'];
  const teile = Array.from({ length: Math.round(110 * staerke) }, () => ({
    x: innerWidth / 2 + (Math.random() - 0.5) * 120,
    y: innerHeight * 0.38,
    vx: (Math.random() - 0.5) * 14,
    vy: -Math.random() * 13 - 4,
    w: 5 + Math.random() * 5,
    h: 3 + Math.random() * 4,
    r: Math.random() * Math.PI,
    vr: (Math.random() - 0.5) * 0.3,
    f: farben[Math.floor(Math.random() * farben.length)],
  }));
  let frame;
  const start = performance.now();
  const schritt = (t) => {
    const alter = (t - start) / 1000;
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (const p of teile) {
      p.vy += 0.38;
      p.vx *= 0.99;
      p.x += p.vx;
      p.y += p.vy;
      p.r += p.vr;
      ctx.save();
      ctx.globalAlpha = Math.max(0, 1 - alter / 2.2);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.r);
      ctx.fillStyle = p.f;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    }
    if (alter < 2.4) frame = requestAnimationFrame(schritt);
    else ctx.clearRect(0, 0, innerWidth, innerHeight);
  };
  frame = requestAnimationFrame(schritt);
  return () => cancelAnimationFrame(frame);
}

export function Feier() {
  const [moment, setMoment] = useState(null);
  const [leiter, setLeiter] = useState(false);
  const canvas = useRef(null);

  useEffect(() => aufFeier((m) => setMoment({ ...m, id: Date.now() })), []);
  useEffect(() => {
    const h = () => setLeiter(true);
    window.addEventListener('raenge-zeigen', h);
    return () => window.removeEventListener('raenge-zeigen', h);
  }, []);
  useEffect(() => {
    if (!moment) return;
    const stopp = konfetti(canvas.current, moment.art === 'rang' ? 1.4 : 0.7);
    let t;
    if (moment.art !== 'rang') t = setTimeout(() => setMoment(null), 4200);
    return () => {
      stopp();
      clearTimeout(t);
    };
  }, [moment?.id]);

  return (
    <>
      <canvas ref={canvas} class="konfetti" aria-hidden="true" />
      {moment?.art === 'rang' && (
        <div class="dialog-huelle" onMouseDown={(e) => e.target === e.currentTarget && setMoment(null)}>
          <div class="dialog rang-feier" role="dialog" aria-modal="true" aria-label="Neuer Rang">
            <div class="rang-feier__abzeichen">
              <Icon name="award" groesse={40} strich={1.5} />
            </div>
            <div class="ueberschrift-klein ueberschrift-klein--akzent">Rangaufstieg</div>
            <h2 class="rang-feier__name">{moment.rang.name}</h2>
            <p class="rang-feier__text">{moment.rang.text}</p>
            {moment.rang.naechster && (
              <p class="gedaempft">
                Nächster Rang: <strong>{moment.rang.naechster.name}</strong> ab {moment.rang.naechster.ab} XP
              </p>
            )}
            <Knopf variante="primaer" groesse="l" autoFocus onClick={() => setMoment(null)}>
              Weiter so
            </Knopf>
          </div>
        </div>
      )}
      {moment && moment.art !== 'rang' && (
        <div class="feier-banner" role="status">
          <span class="feier-banner__symbol">
            <Icon name={moment.art === 'block' ? 'trophy' : 'flame'} groesse={22} />
          </span>
          <span>
            <strong>{moment.art === 'block' ? 'Block geschafft!' : `${moment.tage} Tage am Stück!`}</strong>
            <span class="feier-banner__text">
              {moment.art === 'block' ? `„${moment.block.titel}" ist abgehakt. Morgen steht die erste Wiederholung an.` : 'Deine Lernserie wächst. Bleib dran!'}
            </span>
          </span>
        </div>
      )}
      <Rangleiter offen={leiter} onSchliessen={() => setLeiter(false)} />
    </>
  );
}

function Rangleiter({ offen, onSchliessen }) {
  const stand = useLernstand();
  return (
    <Dialog offen={offen} titel="Rangleiter" icon="award" onSchliessen={onSchliessen} breit>
      <div class="rangleiter">
        <div class="rangleiter__kopf">
          <div>
            <div class="ueberschrift-klein">Dein Rang</div>
            <div class="rangleiter__aktuell">{stand.rang.name}</div>
            <div class="gedaempft">
              {stand.xp} XP · Serie {stand.serie.aktuell} {stand.serie.aktuell === 1 ? 'Tag' : 'Tage'} · beste {stand.serie.beste}
            </div>
          </div>
          {stand.rang.naechster && (
            <div class="rangleiter__naechster">
              <div class="gedaempft">noch {stand.rang.naechster.ab - stand.xp} XP bis {stand.rang.naechster.name}</div>
              <Balken wert={stand.rang.anteil} dick />
            </div>
          )}
        </div>
        <ol class="rangleiter__liste">
          {RAENGE.map((r, i) => (
            <li key={r.name} class={`rangstufe ${i < stand.rang.index ? 'rangstufe--erreicht' : ''} ${i === stand.rang.index ? 'rangstufe--aktuell' : ''}`}>
              <span class="rangstufe__nr">{i + 1}</span>
              <span class="wachsen">
                <span class="rangstufe__name">{r.name}</span>
                <span class="rangstufe__text">{r.text}</span>
              </span>
              <span class="rangstufe__xp tabellenziffern">{r.ab} XP</span>
              {i <= stand.rang.index ? <Icon name="circle-check" groesse={16} /> : <Icon name="lock" groesse={14} />}
            </li>
          ))}
        </ol>
        <div class="rangleiter__regeln">
          <div class="ueberschrift-klein">So sammelst du XP</div>
          <ul>
            <li>Stichpunkt abhaken: {XP.stichpunkt} · Block geschafft: +{XP.blockGeschafft}</li>
            <li>Wiederholung erledigt: {XP.wiederholung}</li>
            <li>Lernkarte: {XP.karte[2]} (gewusst) bzw. {XP.karte[0]}</li>
            <li>Trainer-Aufgabe richtig: {XP.aufgabeRichtig} · versucht: {XP.aufgabeVersucht}</li>
            <li>Fokus-Timer: 1 XP je {XP.fokusJeMinuten} Minuten</li>
          </ul>
        </div>
      </div>
    </Dialog>
  );
}
