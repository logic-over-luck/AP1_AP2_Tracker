// Probeprüfung AP1 – eigene Aufgaben, fiktive Firma (Format: ../../README.md)

export default {
  id: 'ap1-01',
  teil: 'AP1',
  titel: 'Steuerkanzlei Brenneke & Tasdemir',
  situation:
    'Sie sind Auszubildende bzw. Auszubildender der **Lindwurm IT-Service GmbH**, eines IT-Dienstleisters für kleine und mittlere Unternehmen. Ihr Kunde ist die **Steuerkanzlei Brenneke & Tasdemir PartG mbB** mit 25 Arbeitsplätzen (Steuerberaterinnen und Steuerberater, Steuerfachangestellte, Sekretariat und Auszubildende). Die Kanzlei zieht in **fünf Wochen** aus einem Altbau in zwei Etagen eines Neubaus um. Im Zuge des Umzugs werden die alten Tower-PCs ersetzt, das Netzwerk wird neu aufgebaut, das Sicherheitskonzept überarbeitet und für die neuen Besprechungsräume eine kleine Raumbuchungs-Anwendung entwickelt.\n\nSie unterstützen Ihr Team bei folgenden Aufgaben:\n- 1. Neue Arbeitsplätze beschaffen\n- 2. Netzwerk in den neuen Räumen einrichten\n- 3. Mandantendaten schützen\n- 4. Raumbuchung entwickeln',
  aufgaben: [
    // ---------------------------------------------------------------- Aufgabe 1
    {
      id: 'ap1-01-1',
      art: 'wirtschaft',
      titel: 'Neue Arbeitsplätze beschaffen',
      punkte: 25,
      sp: ['AP1-3-2-3'],
      situation:
        'Für alle 25 Arbeitsplätze sollen kompakte Mini-PCs mit je zwei Monitoren beschafft werden. Drei Anbieter haben Angebote abgegeben. Die Kanzleileitung hat die Kriterien gewichtet und die Angebote mit 1 (schlecht) bis 10 (sehr gut) Punkten bewertet.',
      teile: [
        {
          nr: 'aa',
          punkte: 6,
          sp: ['AP1-3-2-3'],
          text: 'Vervollständigen Sie die Nutzwertanalyse: Berechnen Sie die gewichteten Punkte für die Angebote B und C, die Summen (Nutzwerte) aller drei Angebote und tragen Sie die Rangfolge ein (Rang 1 = höchster Nutzwert). Die Gewichtung eines Kriteriums gilt für alle Angebote gleich; gewichteter Wert = Punkte × Gewichtung. Die Spalte „A gew.“ ist als Beispiel vorgegeben.',
          antwort: {
            art: 'tabelle',
            kopf: ['Kriterium', 'Gewichtung', 'A Punkte', 'A gew.', 'B Punkte', 'B gew.', 'C Punkte', 'C gew.'],
            zeilen: [
              ['Preis', '35 %', '8', '2,80', '6', null, '9', null],
              ['Leistung', '25 %', '6', '1,50', '9', null, '7', null],
              ['Garantie und Service', '25 %', '7', '1,75', '9', null, '4', null],
              ['Energieverbrauch', '15 %', '9', '1,35', '7', null, '8', null],
              ['Nutzwert (Summe)', '100 %', '', null, '', null, '', null],
              ['Rang', '', '', null, '', null, '', null],
            ],
          },
          loesung: [
            'Gewichteter Wert = Punkte × Gewichtung (z. B. Preis B: 6 × 0,35 = 2,10).',
            {
              tabelle: {
                kopf: ['Kriterium', 'Gewichtung', 'A gew.', 'B gew.', 'C gew.'],
                zeilen: [
                  ['Preis', '35 %', '2,80', '2,10', '3,15'],
                  ['Leistung', '25 %', '1,50', '2,25', '1,75'],
                  ['Garantie und Service', '25 %', '1,75', '2,25', '1,00'],
                  ['Energieverbrauch', '15 %', '1,35', '1,05', '1,20'],
                  ['**Nutzwert**', '', '**7,40**', '**7,65**', '**7,10**'],
                  ['**Rang**', '', '2', '1', '3'],
                ],
              },
            },
            'Nach der Nutzwertanalyse liegt Angebot B vorn, vor A und C.',
          ],
          bewertung: ['Spalte „B gew.“ vollständig richtig: 2 P', 'Spalte „C gew.“ vollständig richtig: 2 P', 'drei Nutzwerte richtig: 1 P', 'Rangfolge richtig (auch als Folgefehler aus eigenen Summen): 1 P'],
        },
        {
          nr: 'ab',
          punkte: 2,
          sp: ['AP1-3-2-3', 'AP1-3-2-2'],
          text: 'Erst nach der Bewertung teilen die Anbieter ihre Lieferzeiten mit: Anbieter A liefert in 2 Wochen, Anbieter B in 7 Wochen, Anbieter C in 3 Wochen. Die Geräte müssen vor dem Umzug geliefert und eingerichtet sein.\n\nNennen Sie das Angebot, das die Kanzlei nun wählen sollte, und begründen Sie Ihre Wahl.',
          antwort: { art: 'text', zeilen: 3 },
          loesung: [
            '**Angebot A.** Angebot B hat zwar den höchsten Nutzwert, scheidet aber aus, weil die Lieferzeit von 7 Wochen nach dem Umzugstermin (in 5 Wochen) liegt. Die Lieferzeit ist ein K.-o.-Kriterium. Unter den verbleibenden Angeboten hat A mit 7,40 den höheren Nutzwert (C: 7,10).',
          ],
          bewertung: ['1 P für Angebot A', '1 P für die Begründung (B wegen Lieferzeit ausgeschlossen, A hat dann den höchsten Nutzwert)', 'Wahl von C: 0 P für die Wahl; 1 P für die Begründung, wenn B wegen der Lieferzeit ausgeschlossen und die Wahl schlüssig begründet ist (z. B. höchste Gewichtung beim Preis)', 'Folgefehler aus aa) werden ohne Abzug gewertet'],
        },
        {
          nr: 'b',
          punkte: 6,
          sp: ['AP1-3-1-2', 'AP1-3-1-4'],
          text: 'Die Kanzlei entscheidet sich für den Kauf bei Anbieter A. Die Geräte werden einmalig bezahlt. Um den Kauf später mit einem Leasingangebot vergleichen zu können, sollen Sie die durchschnittlichen Kosten je Monat ermitteln: Verteilen Sie die Anschaffungskosten gleichmäßig auf die geplante Nutzungsdauer und rechnen Sie die Wartung auf einen Monat um. Runden Sie auf zwei Nachkommastellen.',
          vorgaben: [
            {
              tabelle: {
                titel: 'Angebot A (Auszug, alle Preise netto)',
                kopf: ['Position', 'Menge', 'Einzelpreis', 'Nutzungsdauer'],
                zeilen: [
                  ['Mini-PC „Kompakt 7“ inkl. Betriebssystem', '25 Stück', '749,00 €', '4 Jahre'],
                  ['Monitor 27 Zoll, höhenverstellbar', '50 Stück', '189,00 €', '6 Jahre'],
                  ['Wartungsvertrag (Vor-Ort-Service) für alle Geräte', '1', '1.200,00 € je Jahr', '–'],
                ],
              },
            },
            'Auf alle Geräte (Mini-PCs und Monitore) gewährt Anbieter A einen Mengenrabatt von 8 %. Auf den Wartungsvertrag gibt es keinen Rabatt.',
          ],
          antwort: {
            art: 'zahlen',
            felder: [
              { id: 'pc', label: 'Mini-PCs je Monat', erwartet: 358.8958, stellen: 2, toleranz: 0.01, einheit: '€' },
              { id: 'mon', label: 'Monitore je Monat', erwartet: 120.75, stellen: 2, toleranz: 0.01, einheit: '€' },
              { id: 'wart', label: 'Wartung je Monat', erwartet: 100, stellen: 2, einheit: '€' },
              { id: 'ges', label: 'Gesamtkosten je Monat', erwartet: 579.6458, stellen: 2, toleranz: 0.01, einheit: '€' },
            ],
          },
          loesung: [
            '- Mini-PCs: 25 × 749,00 € = 18.725,00 €; abzüglich 8 %: 18.725,00 € × 0,92 = 17.227,00 €; je Monat: 17.227,00 € / 48 Monate = **358,90 €**\n- Monitore: 50 × 189,00 € = 9.450,00 €; × 0,92 = 8.694,00 €; je Monat: 8.694,00 € / 72 Monate = **120,75 €**\n- Wartung: 1.200,00 € / 12 = **100,00 €**\n- Gesamt: 358,90 € + 120,75 € + 100,00 € = **579,65 €** je Monat',
          ],
          bewertung: ['Mini-PCs mit Rabatt und Nutzungsdauer: 2 P', 'Monitore mit Rabatt und Nutzungsdauer: 2 P', 'Wartung je Monat: 1 P', 'Gesamtsumme: 1 P', 'Folgefehler werden ohne Abzug weitergerechnet'],
        },
        {
          nr: 'ca',
          punkte: 2,
          sp: ['AP1-3-2-1'],
          text: 'Anbieter A bietet alternativ ein Leasing an: 27,90 € netto je Arbeitsplatz und Monat (Mini-PC, zwei Monitore und Vor-Ort-Service), Laufzeit 48 Monate.\n\nBerechnen Sie die monatliche Leasingrate für alle 25 Arbeitsplätze und die monatliche Differenz zum Kauf aus b). Falls Sie b) nicht lösen konnten, rechnen Sie mit 580,00 € je Monat.',
          antwort: {
            art: 'zahlen',
            felder: [
              { id: 'leasing', label: 'Leasingrate je Monat (25 Plätze)', erwartet: 697.5, stellen: 2, einheit: '€' },
              { id: 'diff', label: 'Mehrkosten Leasing gegenüber Kauf je Monat', erwartet: 117.85, stellen: 2, toleranz: 0.36, einheit: '€' },
            ],
          },
          loesung: [
            '- Leasing: 25 × 27,90 € = **697,50 €** je Monat\n- Differenz: 697,50 € − 579,65 € = **117,85 €** je Monat (mit Ersatzwert: 697,50 € − 580,00 € = 117,50 €)\n- Das Leasing ist also monatlich teurer als der Kauf.',
          ],
          bewertung: ['je richtigem Wert 1 P', 'Rechnung mit Ersatzwert 580,00 € ist voll richtig'],
        },
        {
          nr: 'cb',
          punkte: 2,
          sp: ['AP1-3-2-1', 'AP1-3-3-1'],
          text: 'Nennen Sie zwei Gründe, die trotz der höheren monatlichen Kosten für das Leasing sprechen können.',
          antwort: { art: 'text', zeilen: 3 },
          loesung: [
            '- Keine hohe Einmalzahlung, Liquidität bleibt erhalten (Geld steht für andere Umzugskosten zur Verfügung)\n- Feste, gut planbare monatliche Raten\n- Nach Ablauf der Laufzeit einfacher Austausch gegen aktuelle Geräte\n- Leasingraten sind laufender Aufwand (Betriebsausgabe); die Geräte erscheinen nicht in der eigenen Bilanz\n- Rücknahme der Geräte am Laufzeitende durch den Leasinggeber, keine eigene Entsorgung\n- Service ist in der Rate enthalten\n- Andere sinnvolle Antworten sind richtig.',
          ],
          bewertung: ['je Grund 1 P (max. 2)', 'andere sinnvolle Antworten sind richtig'],
        },
        {
          nr: 'd',
          punkte: 4,
          sp: ['AP1-4-1-4'],
          text: 'Auf der Rückseite des Mini-PCs befinden sich verschiedene Anschlüsse. Ordnen Sie den Beschreibungen die passende Bezeichnung zu.\n\nAuswahl: HDMI, DisplayPort, USB-A, USB-C, RJ45, VGA, Klinke 3,5 mm',
          antwort: {
            art: 'tabelle',
            kopf: ['Beschreibung', 'Bezeichnung'],
            zeilen: [
              ['24-poliger, flacher Stecker, beidseitig steckbar; überträgt Daten, Bildsignal und Strom', null],
              ['8-poliger Modularstecker mit Rastnase für Twisted-Pair-Kabel', null],
              ['20-poliger Stecker mit einer abgeschrägten Ecke, meist mit Verriegelung; digitales Bild- und Tonsignal vor allem für PC-Monitore', null],
              ['19-poliger, trapezförmiger Stecker ohne Verriegelung; Bild und Ton, verbreitet bei Fernsehern und Beamern', null],
            ],
          },
          loesung: [
            {
              tabelle: {
                kopf: ['Beschreibung', 'Bezeichnung'],
                zeilen: [
                  ['24-polig, beidseitig steckbar, Daten + Bild + Strom', 'USB-C'],
                  ['8-poliger Modularstecker mit Rastnase', 'RJ45'],
                  ['20-polig, abgeschrägte Ecke, Verriegelung', 'DisplayPort'],
                  ['19-polig, trapezförmig, Fernseher/Beamer', 'HDMI'],
                ],
              },
            },
          ],
          bewertung: ['je richtiger Zuordnung 1 P'],
        },
        {
          nr: 'e',
          punkte: 3,
          sp: ['AP1-4-2-3', 'AP1-4-3-3'],
          text: 'Die alten Tower-PCs nehmen im Betrieb durchschnittlich 85 W auf, die neuen Mini-PCs 18 W. Alle 25 Arbeitsplätze laufen an 220 Arbeitstagen je 8 Stunden. Die Kanzlei zahlt 0,34 € je kWh.\n\nBerechnen Sie die jährliche Einsparung an elektrischer Energie in kWh und an Stromkosten in €.',
          antwort: {
            art: 'zahlen',
            felder: [
              { id: 'kwh', label: 'Einsparung Energie je Jahr', erwartet: 2948, stellen: 0, einheit: 'kWh' },
              { id: 'eur', label: 'Einsparung Stromkosten je Jahr', erwartet: 1002.32, stellen: 2, toleranz: 0.01, einheit: '€' },
            ],
          },
          loesung: [
            '- Leistungsdifferenz je Platz: 85 W − 18 W = 67 W; für 25 Plätze: 67 W × 25 = 1.675 W = 1,675 kW\n- Betriebsstunden: 220 Tage × 8 h = 1.760 h\n- Energie: 1,675 kW × 1.760 h = **2.948 kWh**\n- Kosten: 2.948 kWh × 0,34 €/kWh = **1.002,32 €** je Jahr',
            'Auch richtig: alte und neue Kosten getrennt berechnen (3.740 kWh = 1.271,60 € bzw. 792 kWh = 269,28 €) und die Differenz bilden.',
          ],
          bewertung: ['Energieeinsparung in kWh: 2 P', 'Kosteneinsparung in €: 1 P', 'Folgefehler ohne Abzug'],
        },
      ],
    },

    // ---------------------------------------------------------------- Aufgabe 2
    {
      id: 'ap1-01-2',
      art: 'netzwerk',
      titel: 'Netzwerk in den neuen Räumen',
      punkte: 25,
      sp: ['AP1-6-2-1'],
      situation:
        'In den neuen Räumen wird eine strukturierte Verkabelung mit Netzwerkdosen an jedem Arbeitsplatz installiert. Die Kanzlei erhält getrennte Netze für die Arbeitsplätze, für Server und Drucker, für die IP-Telefone und für ein Gäste-WLAN im Wartebereich.',
      vorgaben: [
        {
          tabelle: {
            titel: 'Geplante Netze',
            kopf: ['Netz', 'Netzadresse', 'Standardgateway'],
            zeilen: [
              ['Arbeitsplätze (Clients)', '192.168.40.0/26', '192.168.40.1'],
              ['Server und Drucker', '192.168.40.64/26', '192.168.40.65'],
              ['IP-Telefone', '192.168.40.128/26', '192.168.40.129'],
              ['Gäste-WLAN', '192.168.50.0/24', '192.168.50.1'],
            ],
          },
        },
      ],
      teile: [
        {
          nr: 'a',
          punkte: 4,
          sp: ['AP1-6-2-2'],
          text: 'Ermitteln Sie für das Netz der IP-Telefone die folgenden Werte.',
          antwort: {
            art: 'tabelle',
            kopf: ['Gesuchter Wert', 'Ihre Lösung'],
            zeilen: [
              ['Subnetzmaske (dezimal)', null],
              ['Broadcastadresse', null],
              ['letzte nutzbare Hostadresse', null],
              ['Anzahl nutzbarer Hostadressen', null],
            ],
          },
          loesung: [
            '/26 bedeutet 26 Bit Netzanteil, 6 Bit Hostanteil → 2⁶ = 64 Adressen je Netz.',
            {
              tabelle: {
                kopf: ['Gesuchter Wert', 'Lösung'],
                zeilen: [
                  ['Subnetzmaske', '255.255.255.192'],
                  ['Broadcastadresse', '192.168.40.191 (128 + 64 − 1)'],
                  ['letzte nutzbare Hostadresse', '192.168.40.190'],
                  ['Anzahl nutzbarer Hostadressen', '62 (64 − Netz- und Broadcastadresse)'],
                ],
              },
            },
          ],
          bewertung: ['je richtigem Wert 1 P'],
        },
        {
          nr: 'ba',
          punkte: 2,
          sp: ['AP1-6-2-1', 'AP1-6-2-4'],
          text: 'An einem neu aufgestellten Arbeitsplatz-PC funktioniert der Zugriff auf das Netzwerk nicht. Der Befehl `ipconfig /all` liefert folgende Ausgabe (Auszug).\n\nErläutern Sie, wie die angezeigte IPv4-Adresse zustande gekommen ist.',
          vorgaben: [
            {
              code: 'Ethernet-Adapter Ethernet:\n   Beschreibung. . . . . . . . . . . : Onboard-Netzwerkadapter 2.5 GbE\n   Physische Adresse . . . . . . . . : 3C-52-A1-07-4E-19\n   DHCP aktiviert. . . . . . . . . . : Ja\n   Autokonfiguration aktiviert . . . : Ja\n   Autokonfiguration IPv4-Adresse  . : 169.254.83.12(Bevorzugt)\n   Subnetzmaske  . . . . . . . . . . : 255.255.0.0\n   Standardgateway . . . . . . . . . :\n   DNS-Server  . . . . . . . . . . . :',
              titel: 'Ausgabe ipconfig /all',
            },
          ],
          antwort: { art: 'text', zeilen: 4 },
          loesung: [
            'Der PC ist auf automatischen Adressbezug (DHCP) eingestellt, hat aber keine Antwort von einem DHCP-Server erhalten (z. B. Kabel an falscher Dose, Switch-Port im falschen Netz, DHCP-Dienst ausgefallen). Deshalb hat sich das Betriebssystem selbst eine Adresse aus dem Bereich 169.254.0.0/16 gegeben (APIPA bzw. Link-Local-Adresse). Mit dieser Adresse ist nur Kommunikation im lokalen Segment mit anderen APIPA-Geräten möglich, es gibt kein Gateway und keinen DNS-Server.',
          ],
          bewertung: ['1 P: DHCP aktiv, aber kein DHCP-Server erreicht', '1 P: automatische Selbstvergabe aus 169.254.0.0/16 (APIPA/Link-Local)'],
        },
        {
          nr: 'bb',
          punkte: 4,
          sp: ['AP1-6-3-2'],
          text: 'Nachdem das Patchkabel an den richtigen Switch-Port umgesteckt wurde, wollen Sie die Verbindung schrittweise prüfen. Geben Sie zu jedem Prüfschritt einen passenden Befehl (Windows-Kommandozeile) mit Parameter an.',
          antwort: {
            art: 'tabelle',
            kopf: ['Prüfschritt', 'Befehl'],
            zeilen: [
              ['Eine neue IP-Konfiguration vom DHCP-Server anfordern', null],
              ['Die Erreichbarkeit des Standardgateways prüfen', null],
              ['Prüfen, ob der Name nas01.kanzlei.internal in eine IP-Adresse aufgelöst wird', null],
              ['Den Weg der Pakete zu einem Server im Internet verfolgen', null],
            ],
          },
          loesung: [
            {
              tabelle: {
                kopf: ['Prüfschritt', 'Befehl'],
                zeilen: [
                  ['neue IP-Konfiguration anfordern', '`ipconfig /renew` (vorher ggf. `ipconfig /release`)'],
                  ['Gateway prüfen', '`ping 192.168.40.1`'],
                  ['Namensauflösung prüfen', '`nslookup nas01.kanzlei.internal` (auch `ping nas01.kanzlei.internal` mit Blick auf die aufgelöste Adresse)'],
                  ['Weg verfolgen', '`tracert www.beispiel.de` (bzw. `pathping`)'],
                ],
              },
            },
          ],
          bewertung: ['je richtigem Befehl mit passendem Parameter 1 P', 'Linux-Befehle (dhclient, traceroute) sind ebenfalls richtig'],
        },
        {
          nr: 'c',
          punkte: 4,
          sp: ['AP1-6-1-1'],
          text: 'Ordnen Sie die Begriffe der passenden Schicht des OSI-Modells zu. Geben Sie Nummer und Bezeichnung der Schicht an. Die erste Zeile ist ein Beispiel.',
          antwort: {
            art: 'tabelle',
            kopf: ['Begriff', 'Schicht (Nr.)', 'Bezeichnung'],
            zeilen: [
              ['MAC-Adresse', '2', 'Sicherungsschicht (Data Link Layer)'],
              ['Router', null, null],
              ['TCP', null, null],
              ['Patchkabel Cat 6A', null, null],
              ['DNS', null, null],
            ],
          },
          loesung: [
            {
              tabelle: {
                kopf: ['Begriff', 'Schicht', 'Bezeichnung'],
                zeilen: [
                  ['Router', '3', 'Vermittlungsschicht (Network Layer)'],
                  ['TCP', '4', 'Transportschicht (Transport Layer)'],
                  ['Patchkabel Cat 6A', '1', 'Bitübertragungsschicht (Physical Layer)'],
                  ['DNS', '7', 'Anwendungsschicht (Application Layer)'],
                ],
              },
            },
          ],
          bewertung: ['je vollständig richtiger Zeile 1 P', 'deutsche oder englische Bezeichnung'],
        },
        {
          nr: 'da',
          punkte: 3,
          sp: ['AP1-4-2-2', 'AP1-4-2-1'],
          text: 'Die Mandantendaten des alten Fileservers (900 GiB) werden über das Netzwerk auf das neue NAS kopiert. Die Verbindung arbeitet mit 1 Gbit/s; davon sind erfahrungsgemäß 70 % für die Nutzdaten verfügbar.\n\nBerechnen Sie die Dauer der Übertragung in Sekunden (ganzzahlig) und in Stunden (zwei Nachkommastellen).',
          antwort: {
            art: 'zahlen',
            felder: [
              { id: 's', label: 'Dauer in Sekunden', erwartet: 11044.2, stellen: 0, toleranz: 2, einheit: 's' },
              { id: 'h', label: 'Dauer in Stunden', erwartet: 3.0678, stellen: 2, toleranz: 0.01, einheit: 'h' },
            ],
          },
          loesung: [
            '- Datenmenge: 900 GiB = 900 × 2³⁰ Byte = 966.367.641.600 Byte; × 8 = 7.730.941.132.800 Bit\n- Nutzbare Rate: 1 Gbit/s × 0,7 = 0,7 Gbit/s = 700.000.000 Bit/s (Übertragungsraten mit Dezimalpräfix)\n- Dauer: 7.730.941.132.800 Bit / 700.000.000 Bit/s ≈ **11.044 s**\n- 11.044 s / 3.600 s/h ≈ **3,07 h** (gut 3 Stunden)',
            'Typischer Fehler: GiB wie GB behandeln (900 × 10⁹ Byte) ergibt nur 10.286 s ≈ 2,86 h.',
          ],
          bewertung: ['Umrechnung GiB in Bit: 1 P', 'Dauer in Sekunden: 1 P', 'Dauer in Stunden: 1 P'],
        },
        {
          nr: 'db',
          punkte: 2,
          sp: ['AP1-4-2-1', 'AP1-1-5-3'],
          text: 'Nach der Einrichtung prüfen Sie einen Arbeitsplatz anhand eines Testprotokolls. Laut Datenblatt stellt das neue NAS für die Mandantendaten eine Freigabe mit einer nutzbaren Kapazität von 8 TB bereit.\n\nBegründen Sie die Abweichung bei Testfall T2.',
          vorgaben: [
            {
              tabelle: {
                titel: 'Testprotokoll Arbeitsplatz SB-12 (Auszug)',
                kopf: ['Nr.', 'Testfall', 'erwartetes Ergebnis', 'tatsächliches Ergebnis', 'i. O.'],
                zeilen: [
                  ['T1', 'Anmeldung an der Domäne mit Testbenutzer', 'Anmeldung erfolgreich', 'Anmeldung erfolgreich', 'ja'],
                  ['T2', 'Netzlaufwerk K: (Mandantendaten auf dem NAS) verbunden', 'Laufwerk K: sichtbar, Kapazität 8 TB', 'Laufwerk K: sichtbar, angezeigte Kapazität 7,27 TB', 'nein'],
                  ['T3', 'Testseite auf dem Etagendrucker drucken', 'Testseite wird gedruckt', 'Testseite wird gedruckt', 'ja'],
                ],
              },
            },
          ],
          antwort: { art: 'text', zeilen: 4 },
          loesung: [
            'Es liegt kein Fehler vor. Der Hersteller gibt die Kapazität mit Dezimalpräfix an (1 TB = 10¹² Byte). Das Betriebssystem rechnet mit Binärpräfixen (1 TiB = 2⁴⁰ Byte), zeigt aber „TB“ an. 8 TB entsprechen etwa 7,28 TiB; Windows kürzt die Anzeige auf 7,27. Das erwartete Ergebnis im Protokoll sollte korrigiert werden.',
          ],
          bewertung: ['1 P: Hersteller dezimal (10¹²), Betriebssystem binär (2⁴⁰)', '1 P: Folgerung – kein Defekt, Werte entsprechen sich'],
        },
        {
          nr: 'dc',
          punkte: 1,
          sp: ['AP1-4-2-1'],
          text: 'Rechnen Sie 8 TB in TiB um (zwei Nachkommastellen).',
          antwort: { art: 'zahlen', felder: [{ id: 'tib', label: '8 TB in TiB', erwartet: 7.276, stellen: 2, toleranz: 0.01, einheit: 'TiB' }] },
          loesung: ['8 × 10¹² Byte / 2⁴⁰ Byte = 8.000.000.000.000 / 1.099.511.627.776 ≈ **7,28 TiB** (abgeschnitten 7,27 TiB)'],
          bewertung: ['1 P für das Ergebnis (7,27 oder 7,28)'],
        },
        {
          nr: 'e',
          punkte: 2,
          sp: ['AP1-6-3-1', 'AP1-7-1-2'],
          text: 'Begründen Sie, warum das Gäste-WLAN im Wartebereich ein eigenes Netz erhält und nicht in das Netz der Arbeitsplätze eingebunden wird.',
          antwort: { art: 'text', zeilen: 3 },
          loesung: [
            'Die Geräte der Gäste sind nicht vertrauenswürdig (unbekannter Sicherheitszustand, evtl. mit Schadsoftware). In einem getrennten Netz (eigenes VLAN/Subnetz, Firewall-Regel „nur Internet“) können sie weder auf die Arbeitsplätze noch auf NAS und Kanzleisoftware zugreifen. So bleiben die vertraulichen Mandantendaten geschützt; zusätzlich lässt sich die Bandbreite der Gäste begrenzen.',
          ],
          bewertung: ['2 P für eine schlüssige Begründung (Trennung nicht vertrauenswürdiger Geräte, kein Zugriff auf interne Daten)'],
        },
        {
          nr: 'f',
          punkte: 3,
          sp: ['AP1-1-5-3'],
          text: 'Das Testprotokoll aus db) enthält bisher nur die Testfälle T1 bis T3. Nennen Sie drei weitere Testfälle, die bei der Abnahme eines Kanzlei-Arbeitsplatzes geprüft werden sollten.',
          antwort: { art: 'text', zeilen: 4 },
          loesung: [
            '- Beide Monitore werden erkannt, richtige Auflösung, erweiterter Desktop\n- Kanzleisoftware startet, Zugriff auf die Mandantendatenbank funktioniert\n- E-Mail senden und empfangen\n- Internetzugang im Browser\n- Virenschutz aktiv, Betriebssystem aktuell (Updates installiert)\n- IP-Telefon bzw. Headset: Testanruf\n- Bildschirmsperre greift nach eingestellter Zeit\n- VPN-Verbindung (bei Notebooks) wird aufgebaut\n- Scanner/Dokumentenerfassung funktioniert\n- Andere sinnvolle Antworten sind richtig.',
          ],
          bewertung: ['je sinnvollem Testfall 1 P (max. 3)', 'andere sinnvolle Antworten sind richtig'],
        },
      ],
    },

    // ---------------------------------------------------------------- Aufgabe 3
    {
      id: 'ap1-01-3',
      art: 'sicherheit',
      titel: 'Mandantendaten schützen',
      punkte: 25,
      sp: ['AP1-7-1-1'],
      situation:
        'Die Kanzlei verarbeitet Einkommens-, Vermögens- und Familiendaten ihrer Mandantinnen und Mandanten. Mit dem Umzug soll das Sicherheitskonzept überarbeitet werden. Die Berufsträger arbeiten zudem häufig mit Notebooks bei Mandanten, unterwegs und im Homeoffice.',
      teile: [
        {
          nr: 'a',
          punkte: 4,
          sp: ['AP1-7-2-2', 'AP1-7-1-1'],
          text: 'Für eine Schutzbedarfsanalyse nach BSI-Standard werden die Kategorien „normal“, „hoch“ und „sehr hoch“ verwendet. Ergänzen Sie die Tabelle um die Schutzbedarfskategorie und eine Begründung. Die erste Zeile ist ein Beispiel.',
          antwort: {
            art: 'tabelle',
            kopf: ['Anwendung', 'Schutzziel', 'Kategorie', 'Begründung'],
            zeilen: [
              ['Kanzlei-Website (nur öffentliche Informationen)', 'Vertraulichkeit', 'normal', 'Inhalte sind ohnehin öffentlich.'],
              ['Steuer- und Buchhaltungsprogramm mit Mandantendaten', 'Vertraulichkeit', null, null],
              ['Steuer- und Buchhaltungsprogramm mit Mandantendaten', 'Verfügbarkeit', null, null],
            ],
          },
          loesung: [
            {
              tabelle: {
                kopf: ['Schutzziel', 'Kategorie', 'Begründung (Beispiele)'],
                zeilen: [
                  ['Vertraulichkeit', 'sehr hoch (hoch mit Begründung vertretbar)', 'Personenbezogene Daten, teils besonderer Kategorien (z. B. Religionszugehörigkeit für die Kirchensteuer, Gesundheitskosten); Berufsgeheimnis der Steuerberater (§ 203 StGB); bei Offenlegung drohen Bußgelder nach DSGVO, Schadenersatz, Vertrauens- und Imageverlust bis zur Existenzgefährdung.'],
                  ['Verfügbarkeit', 'hoch', 'Ohne das Programm können keine Steuererklärungen und Buchhaltungen bearbeitet werden; Fristen können versäumt werden (Verspätungszuschläge, Haftung gegenüber Mandanten). Ein kurzer Ausfall von Stunden ist überbrückbar, mehrere Tage nicht.'],
                ],
              },
            },
          ],
          bewertung: ['je passender Kategorie 1 P', 'je schlüssiger Begründung 1 P', 'abweichende Kategorie mit schlüssiger Begründung ist richtig'],
        },
        {
          nr: 'b',
          punkte: 3,
          sp: ['AP1-7-3-5'],
          text: 'Die Kanzlei sichert ihre Daten bisher täglich auf eine zweite Festplatte im NAS, das im Serverraum steht. Erläutern Sie anhand der 3-2-1-Regel, was an dieser Datensicherung verbessert werden muss.',
          antwort: { art: 'text', zeilen: 5 },
          loesung: [
            '- **3** Kopien der Daten: Originaldaten plus mindestens zwei Sicherungen – bisher gibt es nur eine Sicherung.\n- **2** verschiedene Speichermedien bzw. Systeme: Die Sicherung im selben NAS ist bei einem Defekt des Geräts, Überspannung oder Verschlüsselung durch Ransomware mit betroffen. Besser: zusätzlich externe Festplatten, Bandlaufwerk oder zweites System.\n- **1** Kopie außer Haus (offsite, z. B. verschlüsselt im Rechenzentrum/Cloud oder Festplatte im Bankschließfach), damit Brand, Wasserschaden oder Diebstahl im Serverraum nicht alle Kopien zerstören. Mindestens eine Kopie sollte außerdem offline bzw. unveränderbar sein.',
          ],
          bewertung: ['je Bestandteil der Regel mit Bezug zur Situation 1 P'],
        },
        {
          nr: 'c',
          punkte: 6,
          sp: ['AP1-7-4-1', 'AP1-7-1-2'],
          text: 'Beschreiben Sie zu jeder Situation beim mobilen Arbeiten eine Gefahr und eine geeignete Schutzmaßnahme. Die erste Zeile ist ein Beispiel.',
          antwort: {
            art: 'tabelle',
            kopf: ['Situation', 'Gefahr', 'Schutzmaßnahme'],
            zeilen: [
              ['Telefonat mit einem Mandanten im vollen Zugabteil', 'Mitreisende hören vertrauliche Steuerdaten mit.', 'Gespräch verschieben oder an einen ungestörten Ort gehen, keine Namen und Zahlen nennen.'],
              ['Bearbeitung einer Steuererklärung am Notebook im Zug', null, null],
              ['Nutzung des kostenlosen WLANs im Hotel', null, null],
              ['Das Notebook wird nach einem Mandantentermin aus dem Auto gestohlen.', null, null],
            ],
          },
          loesung: [
            {
              tabelle: {
                kopf: ['Situation', 'Gefahr', 'Schutzmaßnahme (Beispiele)'],
                zeilen: [
                  ['Steuererklärung im Zug', 'Mitlesen des Bildschirms (Shoulder Surfing), Fotografieren', 'Blickschutzfilter, Sitzplatz mit Rücken zur Wand, Bildschirm beim Verlassen sperren'],
                  ['Hotel-WLAN', 'Mitschneiden des Datenverkehrs, gefälschter Hotspot (Man-in-the-Middle), Angriffe anderer Geräte im WLAN', 'nur über VPN arbeiten, alternativ eigenen Mobilfunk-Hotspot nutzen, Firewall-Profil „Öffentliches Netz“'],
                  ['Notebook gestohlen', 'Zugriff Unbefugter auf Mandantendaten, Datenschutzverletzung (meldepflichtig)', 'vollständige Festplattenverschlüsselung, starkes Passwort/Zwei-Faktor-Anmeldung, keine lokalen Daten, Fernsperrung/-löschung, Gerät nie unbeaufsichtigt im Auto lassen'],
                ],
              },
            },
            'Andere sinnvolle Antworten sind richtig.',
          ],
          bewertung: ['je Gefahr 1 P', 'je passender Maßnahme 1 P', 'andere sinnvolle Antworten sind richtig'],
        },
        {
          nr: 'd',
          punkte: 4,
          sp: ['AP1-7-4-1', 'AP1-7-1-3'],
          text: 'Eine Steuerfachangestellte leitet Ihnen folgende E-Mail weiter. Die Kanzlei nutzt die Kanzleisoftware „Fiskalo“; der Hersteller verschickt seine E-Mails sonst von der Domain fiskalo-software.de.\n\nNennen Sie vier Merkmale, an denen Sie erkennen, dass es sich um eine Phishing-E-Mail handelt.',
          vorgaben: [
            {
              code: 'Von:     Fiskalo Support <service@fiskalo-kundencenter.info>\nBetreff: DRINGEND: Ihre Lizenz läuft HEUTE ab!!\nAnhang:  Lizenzbestaetigung.zip\n\nSehr geehrter Kunde,\n\nwegen einer Umstellung unserer Server muss ihre Lizenz bis heute 18:00 Uhr\nbestätigt werden. Andernfalls wird der Zugang zu allen Mandantendaten gesperrt.\n\nMelden sie sich jetzt mit Ihrem Kanzlei-Benutzernamen und Passwort an:\n[ Lizenz jetzt bestätigen ]\n(Linkziel: http://fiskalo-login.verify-portal.xyz/kanzlei)\n\nMit freundlichen Grüßen\nIhr Fiskalo Team',
              titel: 'E-Mail (Auszug)',
            },
          ],
          antwort: { art: 'text', zeilen: 5 },
          loesung: [
            '- Absenderdomain weicht von der bekannten Herstellerdomain ab (fiskalo-kundencenter.info statt fiskalo-software.de)\n- Linkziel führt auf eine fremde Domain (verify-portal.xyz), nur http ohne Verschlüsselung\n- Aufforderung, Benutzername und Passwort einzugeben\n- Zeitdruck und Drohung („HEUTE“, „bis 18:00 Uhr“, Sperrung aller Daten)\n- unpersönliche Anrede („Sehr geehrter Kunde“)\n- Rechtschreib- und Großschreibfehler („ihre Lizenz“, „Melden sie“), mehrere Ausrufezeichen\n- gepackter Anhang (.zip), der Schadsoftware enthalten kann',
          ],
          bewertung: ['je Merkmal 1 P (max. 4)', 'andere sinnvolle Antworten sind richtig'],
        },
        {
          nr: 'e',
          punkte: 2,
          sp: ['AP1-6-3-1'],
          text: 'Im Homeoffice greifen die Mitarbeitenden über ein VPN auf das Kanzleinetz zu. Erklären Sie das Grundprinzip eines VPN.',
          antwort: { art: 'text', zeilen: 3 },
          loesung: [
            'Ein VPN (Virtual Private Network) baut über ein unsicheres, öffentliches Netz (Internet) eine verschlüsselte, authentifizierte Verbindung („Tunnel“) zwischen dem Notebook und dem VPN-Gateway der Kanzlei auf. Der Rechner verhält sich dann so, als wäre er direkt im Kanzleinetz; Dritte können die übertragenen Daten weder lesen noch unbemerkt verändern.',
          ],
          bewertung: ['1 P: Tunnel/Verbindung über öffentliches Netz ins private Netz', '1 P: Verschlüsselung und Authentifizierung'],
        },
        {
          nr: 'f',
          punkte: 4,
          sp: ['AP1-2-3-1', 'AP1-7-3-4'],
          text: 'Der Hersteller des neuen NAS hat folgenden Sicherheitshinweis veröffentlicht. Nennen Sie vier empfohlene Maßnahmen auf Deutsch.',
          vorgaben: [
            {
              hinweis:
                '**Security advisory for NX-series network storage devices**\n\nAttackers are increasingly targeting storage devices that can be reached from the internet. To protect your data, we strongly recommend the following steps. First, disable the default "admin" account and create a personal administrator account with a strong password. Enable two-step verification for all accounts with administrative rights. Install firmware updates as soon as they are released; automatic updates can be activated in the control panel. Do not forward any ports on your router to the device. If remote access is required, connect through a VPN instead. Finally, schedule regular snapshots and keep at least one backup copy offline, so that files can be restored after a ransomware attack.',
            },
          ],
          antwort: { art: 'text', zeilen: 5 },
          loesung: [
            '- Standardkonto „admin“ deaktivieren und ein persönliches Administratorkonto mit starkem Passwort anlegen\n- Zwei-Faktor-Authentifizierung (Zwei-Schritt-Bestätigung) für alle Administratorkonten aktivieren\n- Firmware-Updates sofort installieren, automatische Updates aktivieren\n- keine Portweiterleitung vom Router auf das NAS einrichten\n- Fernzugriff nur über VPN\n- regelmäßige Snapshots planen und mindestens eine Sicherung offline aufbewahren (Schutz vor Ransomware)',
          ],
          bewertung: ['je Maßnahme 1 P (max. 4)', 'Antworten auf Englisch werden nicht gewertet, sinngemäße Übersetzung genügt'],
        },
        {
          nr: 'g',
          punkte: 2,
          sp: ['AP1-7-5-1'],
          text: 'Nennen Sie zwei Rechte, die Mandantinnen und Mandanten als betroffene Personen nach der DSGVO gegenüber der Kanzlei haben.',
          antwort: { art: 'text', zeilen: 3 },
          loesung: [
            '- Recht auf Auskunft über die gespeicherten Daten\n- Recht auf Berichtigung unrichtiger Daten\n- Recht auf Löschung (eingeschränkt durch gesetzliche Aufbewahrungspflichten)\n- Recht auf Einschränkung der Verarbeitung\n- Recht auf Datenübertragbarkeit\n- Widerspruchsrecht bzw. Widerruf einer Einwilligung\n- Beschwerderecht bei der Datenschutz-Aufsichtsbehörde',
          ],
          bewertung: ['je Recht 1 P (max. 2)'],
        },
      ],
    },

    // ---------------------------------------------------------------- Aufgabe 4
    {
      id: 'ap1-01-4',
      art: 'programmieren',
      titel: 'Raumbuchung entwickeln',
      punkte: 25,
      sp: ['AP1-8-2-3'],
      situation:
        'In den neuen Räumen gibt es zwei Besprechungsräume für Mandantengespräche. Damit es keine Doppelbuchungen mehr gibt, entwickelt Ihr Team eine kleine Web-Anwendung „Raumbuchung“.',
      teile: [
        {
          nr: 'a',
          punkte: 7,
          sp: ['AP1-8-3-1'],
          text: 'Ihr Kollege hat mit dem Anwendungsfalldiagramm begonnen. Erweitern Sie das Diagramm um die folgenden Anforderungen:\n- Zum Buchen eines Raums und zum Stornieren einer Buchung müssen sich Mitarbeitende immer anmelden.\n- Beim Buchen eines Raums kann bei Bedarf eine Bewirtung (Getränke, Gebäck) bestellt werden. Der Erweiterungspunkt im Anwendungsfall „Raum buchen“ heißt „Bewirtung“.\n- Das Sekretariat kann alles, was Mitarbeitende können, und zusätzlich den Belegungsplan des Tages drucken.',
          vorgaben: [
            {
              titel: 'Begonnenes Anwendungsfalldiagramm',
              diagramm: {
                breite: 760,
                hoehe: 290,
                rahmen: [{ typ: 'system', x: 200, y: 16, w: 540, h: 258, text: 'Raumbuchung' }],
                knoten: [
                  { id: 'ma', typ: 'akteur', x: 70, y: 80, text: 'Mitarbeiter' },
                  { id: 'buchen', typ: 'anwendungsfall', x: 240, y: 50, w: 170, text: 'Raum buchen' },
                  { id: 'storno', typ: 'anwendungsfall', x: 240, y: 170, w: 170, text: 'Buchung stornieren' },
                ],
                kanten: [
                  { von: 'ma', nach: 'buchen', typ: 'assoziation' },
                  { von: 'ma', nach: 'storno', typ: 'assoziation' },
                ],
              },
            },
          ],
          antwort: { art: 'papier' },
          loesung: [
            {
              titel: 'Musterlösung',
              diagramm: {
                breite: 790,
                hoehe: 470,
                rahmen: [{ typ: 'system', x: 200, y: 16, w: 570, h: 438, text: 'Raumbuchung' }],
                knoten: [
                  { id: 'ma', typ: 'akteur', x: 70, y: 80, text: 'Mitarbeiter' },
                  { id: 'sek', typ: 'akteur', x: 70, y: 340, text: 'Sekretariat' },
                  { id: 'buchen', typ: 'anwendungsfall', x: 230, y: 40, w: 190, text: 'Raum buchen\nErweiterungspunkt: Bewirtung' },
                  { id: 'storno', typ: 'anwendungsfall', x: 230, y: 180, w: 190, text: 'Buchung stornieren' },
                  { id: 'anmelden', typ: 'anwendungsfall', x: 560, y: 180, w: 170, text: 'Anmelden' },
                  { id: 'bewirtung', typ: 'anwendungsfall', x: 560, y: 34, w: 180, text: 'Bewirtung bestellen' },
                  { id: 'plan', typ: 'anwendungsfall', x: 230, y: 360, w: 190, text: 'Belegungsplan drucken' },
                ],
                kanten: [
                  { von: 'ma', nach: 'buchen', typ: 'assoziation' },
                  { von: 'ma', nach: 'storno', typ: 'assoziation' },
                  { von: 'buchen', nach: 'anmelden', typ: 'abhaengigkeit', text: '«include»' },
                  { von: 'storno', nach: 'anmelden', typ: 'abhaengigkeit', text: '«include»', textSeite: -1 },
                  { von: 'bewirtung', nach: 'buchen', typ: 'abhaengigkeit', text: '«extend»\n[Bewirtung gewünscht]', textSeite: -1 },
                  { von: 'sek', nach: 'ma', typ: 'generalisierung' },
                  { von: 'sek', nach: 'plan', typ: 'assoziation' },
                ],
              },
            },
            'Element für Element:\n- Akteur „Sekretariat“ außerhalb der Systemgrenze\n- Generalisierung vom Sekretariat zum Mitarbeiter (hohles Dreieck zeigt auf „Mitarbeiter“)\n- Anwendungsfall „Anmelden“\n- «include» von „Raum buchen“ und von „Buchung stornieren“ jeweils **zu** „Anmelden“\n- Anwendungsfall „Bewirtung bestellen“ mit «extend» **zu** „Raum buchen“\n- Erweiterungspunkt „Bewirtung“ im Anwendungsfall „Raum buchen“ (Bedingung optional)\n- Anwendungsfall „Belegungsplan drucken“ mit Assoziation nur zum Sekretariat',
          ],
          bewertung: ['Akteur Sekretariat: 1 P', 'Generalisierung richtig gerichtet: 1 P', 'Anwendungsfall Anmelden: 1 P', 'beide include-Beziehungen richtig gerichtet: 1 P', 'Bewirtung bestellen mit richtig gerichtetem extend: 1 P', 'Erweiterungspunkt eingetragen: 1 P', 'Belegungsplan drucken mit Assoziation zum Sekretariat: 1 P'],
        },
        {
          nr: 'b',
          punkte: 4,
          sp: ['AP1-1-1-1'],
          text: 'Im Projektauftrag steht folgendes Ziel:\n\n„Mit der neuen Raumbuchung sollen Doppelbuchungen möglichst bald seltener vorkommen und alle sollen zufriedener sein.“\n\nNennen Sie zwei SMART-Kriterien, die dieses Ziel nicht erfüllt, mit kurzer Begründung. Formulieren Sie das Ziel anschließend so um, dass es die SMART-Kriterien erfüllt.',
          antwort: { art: 'text', zeilen: 6 },
          loesung: [
            '- **messbar** nicht erfüllt: „seltener“ und „zufriedener“ haben keinen Maßstab und keine Zielgröße.\n- **terminiert** nicht erfüllt: „möglichst bald“ nennt keinen Termin.\n- **spezifisch** nicht erfüllt: „alle sollen zufriedener sein“ ist unklar (wer? womit?).',
            'Beispiel für eine SMART-Formulierung: „Bis zum 30.06. des Folgejahres werden alle Besprechungsräume ausschließlich über die Raumbuchung reserviert; ab diesem Termin tritt keine Doppelbuchung mehr auf (Prüfung monatlich über das Buchungsprotokoll).“',
          ],
          bewertung: ['je nicht erfülltem Kriterium mit Begründung 1 P (max. 2)', 'Umformulierung: 2 P, wenn sie konkret, messbar und terminiert ist'],
        },
        {
          nr: 'ca',
          punkte: 6,
          sp: ['AP1-8-2-3', 'AP1-8-2-1'],
          text: 'Für eine Auswertung soll die Auslastung eines Besprechungsraums an einem Tag berechnet werden. Ein Raum ist täglich 10 Stunden buchbar, das sind 40 Viertelstunden. Jede angefangene Viertelstunde einer Buchung zählt voll; eine Buchung zählt höchstens 2 Stunden (8 Viertelstunden).\n\nFühren Sie einen Schreibtischtest für den Aufruf `auslastung([50, 120, 15, 135, 31])` durch. Tragen Sie die Werte der Variablen `s` und `slots` am Ende jedes Schleifendurchlaufs (nach Zeile 11) sowie den Rückgabewert ein.',
          vorgaben: [
            {
              code: 'funktion auslastung(dauer: Ganzzahl[]): Ganzzahl\n  slots = 0\n  für i = 0 bis länge(dauer) - 1\n    s = dauer[i] DIV 15\n    wenn dauer[i] MOD 15 > 0 dann\n      s = s + 1\n    ende wenn\n    wenn s > 8 dann\n      s = 8\n    ende wenn\n    slots = slots + s\n  ende für\n  rückgabe slots * 100 DIV 40\nende funktion',
              nummern: true,
              titel: 'Pseudocode',
            },
            { hinweis: '`DIV` ist die ganzzahlige Division (17 DIV 5 = 3), `MOD` der Rest der ganzzahligen Division (17 MOD 5 = 2). `länge(dauer)` liefert die Anzahl der Elemente. Der erste Index ist 0. Die Dauer steht in Minuten.' },
          ],
          antwort: {
            art: 'tabelle',
            kopf: ['i', 'dauer[i]', 's', 'slots'],
            zeilen: [
              ['0', '50', null, null],
              ['1', '120', null, null],
              ['2', '15', null, null],
              ['3', '135', null, null],
              ['4', '31', null, null],
              ['Rückgabewert', '–', '–', null],
            ],
          },
          loesung: [
            {
              tabelle: {
                kopf: ['i', 'dauer[i]', 'DIV / MOD', 's', 'slots'],
                zeilen: [
                  ['0', '50', '3 / 5 → +1', '4', '4'],
                  ['1', '120', '8 / 0 → kein +1, 8 ist nicht > 8', '8', '12'],
                  ['2', '15', '1 / 0', '1', '13'],
                  ['3', '135', '9 / 0 → 9 > 8, auf 8 begrenzt', '8', '21'],
                  ['4', '31', '2 / 1 → +1', '3', '24'],
                ],
              },
            },
            'Rückgabewert: 24 × 100 DIV 40 = 2400 DIV 40 = **60** (Prozent Auslastung).',
          ],
          bewertung: ['je vollständig richtiger Zeile (s und slots) 1 P', 'Rückgabewert 60: 1 P', 'Folgefehler werden weitergerechnet'],
        },
        {
          nr: 'cb',
          punkte: 3,
          sp: ['AP1-8-2-2', 'AP1-8-2-4'],
          text: 'Bei alten Datensätzen stehen versehentlich Buchungen mit einer Dauer von 0 oder weniger Minuten. Diese sollen bei der Berechnung nicht berücksichtigt werden. Geben Sie an, welche Pseudocode-Zeilen Sie an welcher Stelle ergänzen oder ändern.',
          antwort: { art: 'code', zeilen: 8 },
          loesung: [
            'Nach Zeile 3 eine Bedingung einfügen und den Schleifenrumpf damit umschließen:',
            {
              code: '  für i = 0 bis länge(dauer) - 1\n    wenn dauer[i] > 0 dann          // neu nach Zeile 3\n      s = dauer[i] DIV 15\n      wenn dauer[i] MOD 15 > 0 dann\n        s = s + 1\n      ende wenn\n      wenn s > 8 dann\n        s = 8\n      ende wenn\n      slots = slots + s\n    ende wenn                       // neu vor Zeile 12\n  ende für',
            },
            'Gleichwertig: in Zeile 11 `slots = slots + s` nur ausführen, wenn `dauer[i] > 0`, oder nach Zeile 10 `wenn s < 0 dann s = 0`. Ohne die Änderung würde z. B. −15 Minuten s = −1 ergeben und die Auslastung verringern.',
          ],
          bewertung: ['Bedingung dauer[i] > 0 (bzw. Ausschluss ≤ 0): 1 P', 'richtige Position innerhalb der Schleife: 1 P', 'vollständiger Block (ende wenn an der richtigen Stelle): 1 P'],
        },
        {
          nr: 'd',
          punkte: 3,
          sp: ['AP1-8-4-2'],
          text: 'Eine Buchung wird mit folgenden Attributen gespeichert. Geben Sie für jedes Attribut einen geeigneten Datentyp an und begründen Sie Ihre Wahl kurz. Die erste Zeile ist ein Beispiel.',
          antwort: {
            art: 'tabelle',
            kopf: ['Attribut', 'Beispielwert', 'Datentyp mit Begründung'],
            zeilen: [
              ['buchungsdatum', '14.06.2027', 'Datum (Date): Datumsvergleiche und Sortierung möglich'],
              ['raumNr', '2.10', null],
              ['teilnehmerzahl', '6', null],
              ['bewirtungGewuenscht', 'ja', null],
            ],
          },
          loesung: [
            {
              tabelle: {
                kopf: ['Attribut', 'Datentyp', 'Begründung'],
                zeilen: [
                  ['raumNr', 'Text (String)', 'Kennung, mit der nicht gerechnet wird; als Gleitkommazahl würde aus „2.10“ der Wert 2.1 (Etage 2, Raum 10 ginge verloren).'],
                  ['teilnehmerzahl', 'Ganzzahl (Integer)', 'Anzahl von Personen, immer ganzzahlig, man rechnet damit (z. B. Vergleich mit Raumkapazität).'],
                  ['bewirtungGewuenscht', 'Wahrheitswert (Boolean)', 'Es gibt nur zwei Zustände: ja (true) oder nein (false).'],
                ],
              },
            },
          ],
          bewertung: ['je Zeile 1 P (Datentyp mit passender Begründung)'],
        },
        {
          nr: 'e',
          punkte: 2,
          sp: ['AP1-1-3-3', 'AP1-5-1-4'],
          text: 'Ihr Ausbilder schlägt vor, bei der Programmierung der Raumbuchung einen KI-Codeassistenten einzusetzen. Nennen Sie einen Vorteil und ein Risiko.',
          antwort: { art: 'text', zeilen: 3 },
          loesung: [
            '**Vorteile** (eine Nennung genügt):\n- schnellere Entwicklung von Standardcode, z. B. Formulare und Datenbankzugriffe\n- Erklärung fremden Codes und Hilfe bei der Fehlersuche\n- Vorschläge für Testfälle und Dokumentation',
            '**Risiken** (eine Nennung genügt):\n- erzeugter Code kann fehlerhaft oder unsicher sein und muss geprüft werden\n- vertrauliche Daten oder Quellcode gelangen an den Anbieter des KI-Dienstes (Datenschutz)\n- unklare Lizenz- bzw. Urheberrechtslage des erzeugten Codes\n- Abhängigkeit, eigenes Verständnis des Codes geht verloren',
          ],
          bewertung: ['Vorteil 1 P', 'Risiko 1 P', 'andere sinnvolle Antworten sind richtig'],
        },
      ],
    },
  ],
};
