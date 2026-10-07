// Hilfe: wie das Lernstudio funktioniert. Liest die Regeln aus regeln.js, damit Text und
// Verhalten übereinstimmen.

import { PHASEN_ABSTAND, KARTEN_ABSTAND, KARTE_SICHER_AB, XP, RAENGE } from '../../lernstand/regeln.js';
import { Icon, Kbd, Knopf } from '../../ui/bausteine.jsx';
import { inhalt } from '../../daten/inhalt.js';

function Abschnitt({ icon, titel, children }) {
  return (
    <section class="flaeche flaeche--gross hilfe-abschnitt">
      <h2 class="hilfe-abschnitt__titel">
        <span class="hilfe-abschnitt__symbol">
          <Icon name={icon} groesse={18} />
        </span>
        {titel}
      </h2>
      <div class="hilfe-abschnitt__text">{children}</div>
    </section>
  );
}

export function Hilfe() {
  const karten = inhalt.karten.size;
  return (
    <div class="hilfe">
      <header class="seitenkopf">
        <div>
          <div class="ueberschrift-klein ueberschrift-klein--akzent">Nachschlagen</div>
          <h1 class="seitenkopf__titel">So funktioniert das Lernstudio</h1>
          <p class="seitenkopf__text">Alles läuft lokal in deinem Browser, ohne Internet. Hier steht, nach welchen Regeln es arbeitet.</p>
        </div>
      </header>

      <div class="hilfe-raster">
        <Abschnitt icon="layers" titel="Drei Lernräume">
          <p>
            <strong>AP1</strong>, <strong>AP2</strong> und <strong>WiSo</strong> haben je eigenen Fortschritt, eigene Farbe und eigenen Prüfungstermin. Themen, die in zwei
            Räumen vorkommen, lernst und hakst du getrennt ab – am Stichpunkt führt „Auch in …" zum Gegenstück.
          </p>
          <p>Umschalten oben in der Leiste. Im Raum erscheinen nur die Trainer, die dort gebraucht werden; SQL gehört zum Beispiel nur zu AP2.</p>
        </Abschnitt>

        <Abschnitt icon="list-checks" titel="Lernplan">
          <p>
            Ordner sind Themenbereiche, Blöcke die Karten darin, Stichpunkte das, was du abhakst. Sind alle Stichpunkte eines Blocks erledigt, ist der Block
            erledigt. Ein Klick auf einen Stichpunkt zeigt rechts die Kurzfassung; „Alles anzeigen" zeigt den vollen Rahmen und alle Können-Aussagen.
          </p>
          <p>„Lernprompt kopieren" legt einen fertigen Auftrag mit dem vollen Wortlaut in die Zwischenablage – zum Einfügen in einen KI-Chat.</p>
        </Abschnitt>

        <Abschnitt icon="trending-up" titel="Priorität">
          <p>Die Priorität kommt daraus, wie gut ein Thema in ausgewerteten IHK-Prüfungen belegt ist:</p>
          <ul>
            <li>
              <span class="marke marke--hoch">Hoch</span> kam in Prüfungen nach dem aktuellen Katalog vor.
            </li>
            <li>
              <span class="marke marke--mittel">Mittel</span> kam in älteren Prüfungen vor oder wird für eine aktuelle Prüfung als Thema genannt.
            </li>
            <li>
              <span class="marke marke--normal">Normal</span> steht im Katalog, ohne Beleg in den ausgewerteten Prüfungen. Das heißt: normal wichtig, nicht unwichtig.
            </li>
          </ul>
        </Abschnitt>

        <Abschnitt icon="refresh-cw" titel="Wiederholungs-Phasen">
          <p>
            Hast du einen Block abgehakt, wird er dreimal zur Wiederholung fällig: nach {PHASEN_ABSTAND[0]} Tag, dann {PHASEN_ABSTAND[1]} Tage nach der ersten und{' '}
            {PHASEN_ABSTAND[2]} Tage nach der zweiten Wiederholung. Fällige Blöcke sind orange markiert und stehen in „Heute im Fokus" ganz oben.
          </p>
          <p>Wiederholen heißt: Kurzfassungen lesen, Lernkarten des Blocks durchgehen, dann die fällige Phase anklicken.</p>
        </Abschnitt>

        <Abschnitt icon="sparkles" titel="Heute im Fokus">
          <p>Die Empfehlung folgt einer festen Reihenfolge:</p>
          <ol>
            <li>fällige Wiederholungen (am längsten überfällig zuerst)</li>
            <li>angefangene Blöcke (die fast fertigen zuerst)</li>
            <li>offene Blöcke mit hoher Priorität, dann mittlere, dann normale</li>
            <li>wenn alles erledigt ist: fällige Lernkarten</li>
          </ol>
          <p>„Hier lohnt sich Wiederholen" zeigt Blöcke, deren Karten du zuletzt nicht wusstest oder deren Trainer-Aufgaben danebengingen.</p>
        </Abschnitt>

        <Abschnitt icon="layers" titel={`Lernkarten (${karten})`}>
          <p>Nach dem Aufdecken bewertest du selbst. Davon hängt ab, wann die Karte wiederkommt:</p>
          <ul>
            <li>
              <strong>Gewusst</strong> – eine Stufe höher (eine neue Karte springt gleich auf 3 Tage). Abstände je Stufe: {KARTEN_ABSTAND.slice(1).join(', ')} Tage.
            </li>
            <li>
              <strong>Unsicher</strong> – eine Stufe zurück, mindestens Stufe 1 (morgen wieder).
            </li>
            <li>
              <strong>Nicht gewusst</strong> – zurück auf Anfang; die Karte kommt in derselben Runde noch einmal.
            </li>
          </ul>
          <p>Ab Stufe {KARTE_SICHER_AB} (also mindestens eine Woche Abstand gehalten) gilt eine Karte als „sicher".</p>
          <p class="hilfe-tasten">
            <Kbd>Leertaste</Kbd> aufdecken · <Kbd>1</Kbd> <Kbd>2</Kbd> <Kbd>3</Kbd> bewerten · <Kbd>M</Kbd> merken · <Kbd>Esc</Kbd> zurück
          </p>
        </Abschnitt>

        <Abschnitt icon="target" titel="Trainer">
          <p>
            Rechentrainer erzeugen Aufgaben mit zufälligen Werten und prüfen deine Antwort selbst – mit Rechenweg zum Aufdecken. Komma und Punkt sind beide
            erlaubt; wo gerundet wird, steht in der Aufgabe, auf wie viele Stellen.
          </p>
          <p>
            Diagramme lassen sich nicht ehrlich automatisch prüfen. Dort gibt es Aufgaben zum Zuordnen, Ergänzen und Fehlerfinden – und für freie Zeichnungen eine
            Musterlösung mit Prüfliste zum Selbstabgleich.
          </p>
        </Abschnitt>

        <Abschnitt icon="award" titel="Ränge und Lernserie">
          <p>
            Jede Lernhandlung bringt Erfahrungspunkte: Stichpunkt {XP.stichpunkt}, Block geschafft +{XP.blockGeschafft}, Wiederholung {XP.wiederholung}, Karte{' '}
            {XP.karte[0]}–{XP.karte[2]}, Aufgabe {XP.aufgabeRichtig}, Fokus 1 je {XP.fokusJeMinuten} Minuten.
          </p>
          <p>
            Die Rangleiter beginnt bei „{RAENGE[0].name}" und endet bei „{RAENGE[RAENGE.length - 1].name}". Die Lernserie zählt Tage am Stück, an denen du etwas
            gelernt hast. Ist heute noch nichts passiert, bleibt die Serie bis Mitternacht stehen.
          </p>
        </Abschnitt>

        <Abschnitt icon="hard-drive-download" titel="Sichern und Updates">
          <p>
            Der Lernstand liegt im Browser, getrennt vom Inhalt. Über <strong>Sicherung</strong> oben rechts lädst du ihn als Datei herunter und liest ihn wieder
            ein. Der Punkt am Knopf erinnert dich, wenn die letzte Sicherung länger als eine Woche her ist.
          </p>
          <p>
            Nach einem Update ersetzt du einfach die Datei <code>Lernstudio.html</code> am selben Ort – der Lernstand bleibt. Liegt die neue Datei woanders oder
            nutzt du einen anderen Browser, liest du deine Sicherung ein. Ältere Sicherungen bleiben lesbar.
          </p>
        </Abschnitt>

        <Abschnitt icon="keyboard" titel="Tastatur">
          <ul class="hilfe-kurz">
            <li>
              <Kbd>Strg K</Kbd> oder <Kbd>/</Kbd> Suchen und springen
            </li>
            <li>
              <Kbd>Tab</Kbd> durch alle Elemente, <Kbd>Enter</Kbd>/<Kbd>Leertaste</Kbd> auslösen
            </li>
            <li>
              <Kbd>Esc</Kbd> schließt Dialoge und Sitzungen
            </li>
          </ul>
        </Abschnitt>

        <Abschnitt icon="info" titel="Über die Inhalte">
          <p>
            Grundlage ist die geprüfte Inhaltsdatei mit {inhalt.sp.size} Stichpunkten. Kurzfassungen, Lernkarten und Glossar sind daraus abgeleitet und wurden
            unabhängig gegengelesen. Wo etwas fachlich nicht sicher zu klären war, ist es in <code>STAND.md</code> aufgeführt.
          </p>
          <p class="gedaempft">
            Schriften: Inter und JetBrains Mono (SIL Open Font License). Symbole: Lucide (ISC). SQL: sql.js/SQLite (MIT/gemeinfrei). Oberfläche: Preact (MIT).
          </p>
        </Abschnitt>
      </div>
    </div>
  );
}

export { Knopf };
