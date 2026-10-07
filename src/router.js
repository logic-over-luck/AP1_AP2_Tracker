// Einfaches Routing über den Hash der Adresse. Funktioniert auch bei file://.
// Form: #/<raum>/<bereich>/<unter>?a=b   z. B. #/ap1/lernen?block=AP1-1-1&sp=AP1-1-1-1

import { useEffect, useState } from 'preact/hooks';

const RAUM_AUS_PFAD = { ap1: 'AP1', ap2: 'AP2', wiso: 'WISO' };
const PFAD_AUS_RAUM = { AP1: 'ap1', AP2: 'ap2', WISO: 'wiso' };

export function leseRoute(hash = location.hash) {
  const [pfad, abfrage = ''] = hash.replace(/^#\/?/, '').split('?');
  const teile = pfad.split('/').filter(Boolean).map(decodeURIComponent);
  const raum = RAUM_AUS_PFAD[teile[0]] ?? null;
  const params = Object.fromEntries(new URLSearchParams(abfrage));
  return { raum, bereich: teile[1] ?? 'start', unter: teile[2] ?? null, params };
}

export function link(raum, bereich = 'start', unter = null, params = null) {
  let h = `#/${PFAD_AUS_RAUM[raum] ?? 'ap1'}`;
  if (bereich && (bereich !== 'start' || unter)) h += `/${bereich}`;
  if (unter) h += `/${encodeURIComponent(unter)}`;
  const p = params ? Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '') : [];
  if (p.length) h += `?${new URLSearchParams(p).toString()}`;
  return h;
}

export function geheZu(raum, bereich, unter, params, { ersetzen } = {}) {
  const ziel = link(raum, bereich, unter, params);
  if (ersetzen) history.replaceState(null, '', ziel);
  else if (location.hash !== ziel) history.pushState(null, '', ziel);
  window.dispatchEvent(new Event('hashchange'));
}

export function useRoute() {
  const [route, setRoute] = useState(leseRoute());
  useEffect(() => {
    const h = () => setRoute(leseRoute());
    window.addEventListener('hashchange', h);
    window.addEventListener('popstate', h);
    return () => {
      window.removeEventListener('hashchange', h);
      window.removeEventListener('popstate', h);
    };
  }, []);
  return route;
}
