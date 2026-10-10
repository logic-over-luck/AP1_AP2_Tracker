// Baut den Text für „Lernprompt kopieren": ein fertiger Auftrag für einen KI-Chat mit dem
// vollen Wortlaut aus Rahmen und Können-Aussagen.
// Block-Prompt: nur die noch offenen Stichpunkte, die KI geht sie einzeln durch und sagt,
// wann ein Stichpunkt abgehakt werden kann. Ist alles abgehakt, wird daraus ein Wiederholungs-Prompt.

const PRUEFUNG = {
  AP1: 'Abschlussprüfung Teil 1 (AP1) „Einrichten eines IT-gestützten Arbeitsplatzes“',
  AP2: 'Abschlussprüfung Teil 2 (AP2) für Fachinformatiker Anwendungsentwicklung',
  WISO: 'Prüfungsbereich Wirtschafts- und Sozialkunde (WiSo) der Abschlussprüfung',
};

// Zusatzschritt je Art des Stichpunkts
const UEBUNG_JE_ART = {
  Rechnen: 'Gib mir zwei Rechenaufgaben im Prüfungsstil. Den vollständigen Rechenweg zum Vergleichen zeigst du erst nach meiner Lösung.',
  Zeichnen: 'Beschreibe mir eine typische Zeichenaufgabe. Ich skizziere auf Papier und beschreibe dir meine Lösung, du prüfst sie anhand einer Prüfliste.',
  Schreiben: 'Gib mir eine kurze Schreibaufgabe im Prüfungsstil und bewerte meine Lösung wie ein IHK-Prüfer.',
  Wissen: 'Fasse den Stichpunkt zum Schluss in einer kurzen Merkliste zusammen.',
};
const ART_REIHENFOLGE = ['Rechnen', 'Zeichnen', 'Schreiben', 'Wissen'];

const LEER = { spErledigt: new Set(), notizen: new Map() };

function einleitung(raum) {
  return `Ich bereite mich auf die IHK-${PRUEFUNG[raum]} vor (Umschulung Fachinformatiker Anwendungsentwicklung).`;
}

// Ein Stichpunkt mit Rahmen, nummerierten Können-Aussagen, unklarer Tiefe und eigener Notiz
function spAbschnitt(sp, stand, ueberschrift) {
  const zeilen = [];
  if (ueberschrift) zeilen.push(`### ${ueberschrift}`);
  zeilen.push(`Art: ${sp.art}`);
  zeilen.push('', 'Rahmen (wie tief das Thema geht):', sp.rahmen);
  if (sp.unklar) {
    zeilen.push('', 'Achtung, die Tiefe ist im Prüfungskatalog nicht eindeutig.');
    if (sp.unklar.hinweis) zeilen.push(sp.unklar.hinweis);
    zeilen.push('Mögliche Auslegungen:');
    for (const a of sp.unklar.auslegungen) zeilen.push(`${a.kennung}) ${a.text}`);
    if (sp.unklar.nachsatz) zeilen.push(sp.unklar.nachsatz);
    zeilen.push('Bereite mich auf die weitere Auslegung vor.');
  }
  zeilen.push('', 'Das muss ich können:');
  sp.koennen.forEach(([, text], i) => zeilen.push(`${i + 1}. ${text}`));
  const notiz = stand.notizen.get(sp.id);
  if (notiz) zeilen.push('', `Meine eigene Notiz dazu: ${notiz}`);
  return zeilen.join('\n');
}

// Ablauf für einen Stichpunkt; bei mehreren Arten (Block) steht der Zusatzschritt je Art da
function ablaufJeStichpunkt(arten, mehrere) {
  const vorhanden = ART_REIHENFOLGE.filter((a) => arten.has(a));
  const zusatz = vorhanden.length === 1 ? [`4. ${UEBUNG_JE_ART[vorhanden[0]]}`] : ['4. Je nach Art des Stichpunkts:', ...vorhanden.map((a) => `   - ${a}: ${UEBUNG_JE_ART[a]}`)];
  const was = mehrere ? 'jedem Stichpunkt' : 'dem Stichpunkt';
  return [
    `So gehst du mit ${was} vor:`,
    '1. Frag mich zuerst kurz, was ich schon darüber weiß, und bau darauf auf.',
    '2. Erkläre ihn Schritt für Schritt, verständlich und mit einem Beispiel aus dem IT-Alltag. Halte dich an den Rahmen: nicht tiefer als nötig, aber vollständig.',
    '3. Prüfe danach jede „Das muss ich können“-Aussage mit einer Prüfungsfrage. Immer nur eine Frage pro Nachricht: Warte auf meine Antwort, korrigiere sie und erkläre Fehler.',
    ...zusatz,
    '5. Entscheide dann ehrlich, ob der Stichpunkt sitzt:',
    '   - Habe ich alle Aussagen sicher beantwortet, schreib: „✅ Kannst du abhaken: <Titel des Stichpunkts>“. Dann hake ich ihn in meinem Lernplan ab.',
    '   - Sonst sag mir genau, welche Aussagen noch wackeln, und übe sie mit mir, bis sie sitzen.',
  ].join('\n');
}

const SCHLUSS = 'Antworte auf Deutsch. Wenn etwas im Prüfungskatalog nicht eindeutig ist, sag es mir.';

function wiederholung(sps, mehrere) {
  return [
    'So möchte ich wiederholen:',
    `1. Keine lange Erklärung vorweg. Stell mir Prüfungsfragen zu den „Das muss ich können“-Aussagen${mehrere ? ', gemischt quer durch alle Stichpunkte' : ''}. Immer nur eine Frage pro Nachricht.`,
    '2. Warte auf meine Antwort, korrigiere sie und erkläre Fehler kurz.',
    `3. Nach etwa ${mehrere ? 10 : 5} Fragen: Werte aus, was sitzt und was wackelt${mehrere ? ' – je Stichpunkt' : ''}. Was wackelt, erklärst du noch einmal kurz. Dann sag mir, ob ich ${mehrere ? 'einen Stichpunkt' : 'ihn'} in meinem Lernplan wieder öffnen sollte.`,
    SCHLUSS,
  ].join('\n');
}

export function lernpromptStichpunkt(sp, index, stand = LEER) {
  const block = index.bloecke.get(sp.block);
  const ordner = index.ordner.get(sp.ordner);
  const erledigt = stand.spErledigt.has(sp.id);
  return [
    einleitung(sp.raum),
    `Thema: ${ordner.titel} › ${block.titel} › ${sp.titel}`,
    erledigt ? 'Diesen Stichpunkt habe ich schon abgehakt. Prüfe, ob er noch sitzt.' : null,
    '',
    spAbschnitt(sp, stand, null),
    '',
    erledigt ? wiederholung([sp], false) : [ablaufJeStichpunkt(new Set([sp.art]), false), SCHLUSS].join('\n'),
  ]
    .filter((z) => z !== null)
    .join('\n');
}

// Welche Stichpunkte im Block-Prompt landen: die offenen, oder alle zur Wiederholung
export function blockAuswahl(block, stand = LEER) {
  const offen = block.sp.filter((id) => !stand.spErledigt.has(id));
  return offen.length ? { modus: 'lernen', ids: offen } : { modus: 'wiederholen', ids: block.sp };
}

export function lernpromptBlock(block, index, stand = LEER) {
  const ordner = index.ordner.get(block.ordner);
  const { modus, ids } = blockAuswahl(block, stand);
  const sps = ids.map((id) => index.sp.get(id));
  const fertig = block.sp.filter((id) => stand.spErledigt.has(id)).map((id) => index.sp.get(id));
  const mehrere = sps.length > 1;
  const kopf = [einleitung(block.raum), `Themenblock: ${ordner.titel} › ${block.titel}`, block.satz ? `Worum es geht: ${block.satz}` : null];

  if (modus === 'wiederholen') {
    return [
      ...kopf,
      '',
      `Alle ${sps.length} Stichpunkte dieses Blocks habe ich schon abgehakt. Jetzt geht es ums Wiederholen.`,
      '',
      sps.map((s, i) => spAbschnitt(s, stand, `Stichpunkt ${i + 1}: ${s.titel}`)).join('\n\n'),
      '',
      wiederholung(sps, mehrere),
    ]
      .filter((z) => z !== null)
      .join('\n');
  }

  const ablauf = mehrere
    ? [
        'So läuft die Sitzung ab:',
        '- Zeig mir am Anfang kurz die Liste der offenen Stichpunkte, damit ich weiß, was kommt. Dann fang mit Stichpunkt 1 an.',
        '- Immer nur ein Stichpunkt zur Zeit, in der Reihenfolge oben. Ist einer fertig, frag mich, ob wir zum nächsten weitergehen.',
        '- Zum Schluss eine kurze Übersicht: welche Stichpunkte ich abhaken kann und wo noch Lücken sind. Sitzen alle, sag mir, dass der ganze Block abgehakt werden kann.',
        '',
      ].join('\n')
    : null;

  return [
    ...kopf,
    '',
    fertig.length ? `Schon abgehakt (nur zur Einordnung, nicht neu durchnehmen): ${fertig.map((s) => s.titel).join('; ')}` : null,
    fertig.length ? '' : null,
    mehrere ? `Noch offen sind ${sps.length} Stichpunkte:` : 'Noch offen ist ein Stichpunkt:',
    '',
    sps.map((s, i) => spAbschnitt(s, stand, mehrere ? `Stichpunkt ${i + 1} von ${sps.length}: ${s.titel}` : s.titel)).join('\n\n'),
    '',
    ablauf,
    ablaufJeStichpunkt(new Set(sps.map((s) => s.art)), mehrere),
    SCHLUSS,
  ]
    .filter((z) => z !== null)
    .join('\n');
}

export async function kopiere(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Rückfall für Browser, die die Zwischenablage bei file:// sperren
    const feld = document.createElement('textarea');
    feld.value = text;
    feld.setAttribute('readonly', '');
    feld.style.position = 'fixed';
    feld.style.opacity = '0';
    document.body.appendChild(feld);
    feld.select();
    let ok = false;
    try {
      ok = document.execCommand('copy');
    } catch {}
    feld.remove();
    return ok;
  }
}
