// Glossar: Fachbegriffe aus der Inhaltsdatei, kurz erklärt und mit den Stichpunkten verknüpft.

import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { inhalt } from '../../daten/inhalt.js';
import { link } from '../../router.js';
import { Icon, Reiter, Suchfeld, Leer, Knopf, Rich, Treffer } from '../../ui/bausteine.jsx';

function anfangsbuchstabe(b) {
  const c = b
    .trim()
    .charAt(0)
    .toUpperCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
  return /[A-Z]/.test(c) ? c : '#';
}

export function Glossar({ raum, params }) {
  const [umfang, setUmfang] = useState('raum');
  const [suche, setSuche] = useState(params.begriff ?? '');
  const eingabe = useRef(null);
  const r = inhalt.raeume.get(raum);

  useEffect(() => {
    if (params.begriff) setSuche(params.begriff);
  }, [params.begriff]);

  const eintraege = useMemo(() => {
    const s = suche.trim().toLowerCase();
    return inhalt.glossar.filter((g) => {
      if (umfang === 'raum' && !g.sp.some((id) => inhalt.raumVon(id) === raum)) return false;
      if (!s) return true;
      return g.b.toLowerCase().includes(s) || (g.l ?? '').toLowerCase().includes(s) || g.e.toLowerCase().includes(s);
    });
  }, [suche, umfang, raum]);

  const gruppen = new Map();
  for (const g of eintraege) {
    const a = anfangsbuchstabe(g.b);
    if (!gruppen.has(a)) gruppen.set(a, []);
    gruppen.get(a).push(g);
  }
  const buchstaben = [...gruppen.keys()].sort((a, b) => (a === '#' ? 1 : b === '#' ? -1 : a.localeCompare(b)));
  const imRaum = inhalt.glossar.filter((g) => g.sp.some((id) => inhalt.raumVon(id) === raum)).length;

  return (
    <div class="glossar">
      <header class="seitenkopf">
        <div>
          <div class="ueberschrift-klein ueberschrift-klein--akzent">Nachschlagen</div>
          <h1 class="seitenkopf__titel">Glossar</h1>
          <p class="seitenkopf__text">Fachbegriffe und Abkürzungen, kurz erklärt. Jeder Begriff führt zu den Stichpunkten, in denen er vorkommt.</p>
        </div>
      </header>
      <div class="lernen__leiste glossar__leiste">
        <Reiter
          label="Umfang"
          aktiv={umfang}
          onWahl={setUmfang}
          eintraege={[
            { id: 'raum', text: `Nur ${r.name}`, zahl: imRaum },
            { id: 'alle', text: 'Alle Räume', zahl: inhalt.glossar.length },
          ]}
        />
        <span class="wachsen" />
        <Suchfeld wert={suche} onEingabe={setSuche} platzhalter="Begriff suchen …" eingabeRef={eingabe} />
      </div>
      {buchstaben.length > 1 && !suche && (
        <nav class="abc" aria-label="Buchstaben">
          {buchstaben.map((b) => (
            <a key={b} href={`#glossar-${b}`} onClick={(e) => {
              e.preventDefault();
              document.getElementById(`glossar-${b}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}>
              {b}
            </a>
          ))}
        </nav>
      )}
      {eintraege.length === 0 ? (
        <div class="flaeche">
          <Leer icon="book-open" titel={inhalt.glossar.length ? 'Kein Begriff gefunden' : 'Das Glossar ist noch leer'} aktion={suche ? <Knopf onClick={() => setSuche('')}>Suche leeren</Knopf> : null}>
            {suche ? `Zu „${suche}" gibt es keinen Eintrag${umfang === 'raum' ? ` in ${r.name}. Probier „Alle Räume"` : ''}.` : null}
          </Leer>
        </div>
      ) : (
        buchstaben.map((b) => (
          <section key={b} class="glossar__gruppe" id={`glossar-${b}`}>
            <h2 class="glossar__buchstabe">{b}</h2>
            <dl class="glossar__liste">
              {gruppen.get(b).map((g) => (
                <div key={g.b} class="flaeche glossar__eintrag">
                  <dt>
                    <span class="glossar__begriff">
                      <Treffer text={g.b} suche={suche.trim()} />
                    </span>
                    {g.l && <span class="glossar__lang">{g.l}</span>}
                  </dt>
                  <dd>
                    <Rich text={g.e} />
                    <div class="glossar__links">
                      {g.sp
                        .filter((id) => umfang === 'alle' || inhalt.raumVon(id) === raum)
                        .map((id) => {
                          const sp = inhalt.sp.get(id);
                          return (
                            <a key={id} class="glossar__sp" href={link(sp.raum, 'lernen', null, { sp: id })}>
                              {umfang === 'alle' && <span class="glossar__raum">{inhalt.raeume.get(sp.raum).name}</span>}
                              {sp.titel}
                              <Icon name="arrow-right" groesse={12} />
                            </a>
                          );
                        })}
                    </div>
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ))
      )}
    </div>
  );
}
