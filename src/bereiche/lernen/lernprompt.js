// Baut den Text für „Lernprompt kopieren": ein fertiger Auftrag für einen KI-Chat mit dem
// vollen Wortlaut aus Rahmen und Können-Aussagen.

const PRUEFUNG = {
  AP1: 'Abschlussprüfung Teil 1 (AP1) „Einrichten eines IT-gestützten Arbeitsplatzes"',
  AP2: 'Abschlussprüfung Teil 2 (AP2) für Fachinformatiker Anwendungsentwicklung',
  WISO: 'Prüfungsbereich Wirtschafts- und Sozialkunde (WiSo) der Abschlussprüfung',
};

function spAbschnitt(sp, mitTitel = true) {
  const zeilen = [];
  if (mitTitel) zeilen.push(`### ${sp.titel}`);
  zeilen.push(`Art: ${sp.art}`);
  zeilen.push('', 'Rahmen (wie tief das Thema geht):', sp.rahmen);
  zeilen.push('', 'Das muss ich können:');
  for (const [, text] of sp.koennen) zeilen.push(`- ${text}`);
  return zeilen.join('\n');
}

function anleitung(art) {
  const zeilen = [
    'So möchte ich lernen:',
    '1. Erkläre mir das Thema Schritt für Schritt, verständlich und mit einem Beispiel aus dem IT-Alltag.',
    '2. Halte dich an den Rahmen oben: nicht tiefer als nötig, aber vollständig.',
    '3. Stelle mir danach nacheinander Prüfungsfragen zu jeder „Das muss ich können"-Aussage. Warte jeweils auf meine Antwort, korrigiere sie und erkläre Fehler.',
  ];
  if (art === 'Rechnen') zeilen.push('4. Gib mir zwei Rechenaufgaben im Prüfungsstil mit vollständigem Rechenweg zum Vergleichen – erst nach meiner Lösung.');
  else if (art === 'Zeichnen') zeilen.push('4. Beschreibe mir eine typische Zeichenaufgabe; ich skizziere auf Papier und beschreibe dir meine Lösung, du prüfst sie anhand einer Prüfliste.');
  else if (art === 'Schreiben') zeilen.push('4. Gib mir eine kurze Schreibaufgabe im Prüfungsstil und bewerte meine Lösung wie ein IHK-Prüfer.');
  else zeilen.push('4. Fasse zum Schluss die wichtigsten Punkte in einer kurzen Merkliste zusammen.');
  zeilen.push('Antworte auf Deutsch. Wenn etwas im Prüfungskatalog nicht eindeutig ist, sag es mir.');
  return zeilen.join('\n');
}

export function lernpromptStichpunkt(sp, index) {
  const block = index.bloecke.get(sp.block);
  const ordner = index.ordner.get(sp.ordner);
  return [
    `Ich bereite mich auf die IHK-${PRUEFUNG[sp.raum]} vor (Ausbildung Fachinformatiker Anwendungsentwicklung).`,
    `Thema: ${ordner.titel} › ${block.titel} › ${sp.titel}`,
    '',
    spAbschnitt(sp, false),
    '',
    anleitung(sp.art),
  ].join('\n');
}

export function lernpromptBlock(block, index) {
  const ordner = index.ordner.get(block.ordner);
  const sps = block.sp.map((id) => index.sp.get(id));
  const arten = new Set(sps.map((s) => s.art));
  const art = arten.has('Rechnen') ? 'Rechnen' : arten.has('Schreiben') ? 'Schreiben' : arten.has('Zeichnen') ? 'Zeichnen' : 'Wissen';
  return [
    `Ich bereite mich auf die IHK-${PRUEFUNG[block.raum]} vor (Ausbildung Fachinformatiker Anwendungsentwicklung).`,
    `Themenblock: ${ordner.titel} › ${block.titel}`,
    block.satz ? `Worum es geht: ${block.satz}` : '',
    '',
    `Der Block hat ${sps.length} Stichpunkte:`,
    '',
    sps.map((s) => spAbschnitt(s)).join('\n\n'),
    '',
    anleitung(art),
    'Gehe die Stichpunkte nacheinander durch und frag mich, bevor du zum nächsten wechselst.',
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
