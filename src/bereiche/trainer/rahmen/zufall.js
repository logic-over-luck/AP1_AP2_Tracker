// Zufall mit Startwert: Aufgaben lassen sich in Tests wiederholen.

export function zufall(startwert = Math.floor(Math.random() * 2 ** 31)) {
  let a = startwert >>> 0;
  const naechste = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const r = {
    startwert,
    zahl: naechste,
    // ganze Zahl von min bis max (beide eingeschlossen)
    ganz: (min, max) => min + Math.floor(naechste() * (max - min + 1)),
    // ganze Zahl in Schritten, z. B. stufe(100, 2000, 50)
    stufe: (min, max, schritt) => min + schritt * Math.floor(naechste() * (Math.floor((max - min) / schritt) + 1)),
    wahl: (liste) => liste[Math.floor(naechste() * liste.length)],
    mische: (liste) => {
      const x = [...liste];
      for (let i = x.length - 1; i > 0; i--) {
        const j = Math.floor(naechste() * (i + 1));
        [x[i], x[j]] = [x[j], x[i]];
      }
      return x;
    },
    ja: (wahrscheinlichkeit = 0.5) => naechste() < wahrscheinlichkeit,
    // Aufgabenart wählen – nur unter den Arten, die man sich ausgesucht hat (r.arten), sonst unter allen
    art: (liste) => {
      const frei = r.arten?.size ? liste.filter((a) => r.arten.has(a)) : liste;
      return r.wahl(frei.length ? frei : liste);
    },
  };
  return r;
}
