import sys; sys.path.insert(0, sys.path[0])
from lpw import LPW, B, T, K, R, meta

L = LPW("WISO-5", "Vernetztes Zusammenarbeiten unter Nutzung digitaler Medien", ["G.WISO.05"])
G5 = ["G.WISO.05"]; G53 = ["G.WISO.05", "G.WISO.03"]

AP1_SICHER = ["AP1-7-1-1", "AP1-7-1-2", "AP1-7-1-3", "AP1-7-2-1", "AP1-7-2-2", "AP1-7-4-1", "AP1-7-4-2", "AP1-7-4-3", "AP1-7-5-1", "PB1-10-1-4"]

# ---------------------------------------------------------------- 5-2 Sicher digital kommunizieren
L.tb("WISO-5-2", "Sicher und angemessen digital kommunizieren", "Sicherheitsbewusst mit IT, E-Mail und Social Media umgehen, Social Engineering erkennen und dienstlich klar, höflich und zuständig kommunizieren. Die technischen Grundlagen der IT-Sicherheit kennst du aus AP1-7.")

L.sp("WISO-5-2-1", "Sicherheitsbewusstsein, Social Engineering und IT-Sicherheit am Arbeitsplatz",
     "Begründen, warum Sicherheitsbewusstsein nötig ist, Social Engineering erkennen und abwehren und sich am eigenen Arbeitsplatz sicherheitsbewusst verhalten.",
     G53, ["WISO.05.02.1", "WISO.05.02.9", ("WISO.03.08.3", "Schutzziel Authentizität")],
     T("2021W-A25", "2021W-A26", "2021W-A27", "2021W-A28", "2021W-A29"),
     baut_auf=AP1_SICHER,
     hinweis="Schutzziele, technische und organisatorische Maßnahmen, BSI und IT-Grundschutz, Datenschutz (DSGVO), Schadsoftware, Phishing und sicheres mobiles Arbeiten kennst du aus AP1-7 (WISO.03.08 gedeckt, P47). Damit lösen sich 2021W-WISO-A25 bis A28 (Phishing erkennen und richtig reagieren: AP1-7-4-2; offenes WLAN nur mit VPN: AP1-7-4-3).")
L.k(1, "Du kannst erläutern, warum Sicherheitsbewusstsein privat und im Betrieb nötig ist: Unachtsamkeit Einzelner ist ein häufiger Weg für Angriffe, private Gewohnheiten wirken in den Betrieb hinein, und auch bekannte, seriöse Webseiten können manipuliert sein.", 2,
    [K("WISO.05.02.1"), B("2021W-A27")])
L.k(3, "Du kannst Social Engineering erklären: Angreifer nutzen Vertrauen, Hilfsbereitschaft, Respekt vor Vorgesetzten oder Zeitdruck aus, um an Informationen oder Zugang zu kommen, zum Beispiel per Phishing-Mail, Anruf als angeblicher Support oder vorgetäuschter Notlage.", 2,
    [K("WISO.05.02.9"), B("2021W-A25")])
L.k(4, "Du kannst Verhalten unterscheiden, das Schäden durch Social Engineering vermeidet: die Identität des Gegenübers über einen bekannten Weg prüfen, keine Zugangsdaten weitergeben, verdächtige Nachrichten nicht weiterleiten, sondern löschen und der zuständigen Stelle melden.", 2,
    [K("WISO.05.02.9"), B("2021W-A26")])
L.k(7, "Du kannst sicherheitsbewusstes Verhalten am eigenen Arbeitsplatz anwenden: Bildschirm sperren, für jeden Zugang ein eigenes Passwort, Updates nicht aufschieben, Vorfälle sofort melden.", 3,
    [K("WISO.05.02.1")])
L.k(8, "Du kannst über Vertraulichkeit, Integrität und Verfügbarkeit aus AP1 hinaus das Schutzziel Authentizität erklären (Daten und Absender sind echt und nachweisbar) und einem Verfahren das gesicherte Schutzziel zuordnen, zum Beispiel einer mitgesendeten und beim Empfänger verglichenen Prüfsumme die Integrität.", 2,
    [K("WISO.03.08.3"), B("2021W-A29")], neu=(["AP1-7-1-1"], "Authentizität als viertes Schutzziel; Prüfsumme bei der Übertragung"))

L.sp("WISO-5-2-4", "Social Media und virtuelle Räume: Gefahren, Äußerungen über den Arbeitgeber, Kommunikation ohne direkten Kontakt",
     "Die Gefahren von Social Media für die IT-Sicherheit kennen, die Folgen von Äußerungen über den Arbeitgeber berücksichtigen und Erfahrungen aus virtuellen Räumen reflektieren.",
     G5, ["WISO.05.02.2", "WISO.05.02.3", "WISO.05.02.8"], [],
     hinweis="Neuer Stichpunkt; die Aussagen standen vorher in WISO-5-2-1, der dadurch zu groß wurde (F3).")
L.k(1, "Du kannst Gefahren von Social Media für die IT-Sicherheit nennen: preisgegebene Informationen über Personen und Betrieb, gefälschte Profile, schädliche Links, übernommene Konten.", 1,
    [K("WISO.05.02.3")])
L.k(2, "Du kannst die möglichen Folgen von Äußerungen über den eigenen Arbeitgeber in sozialen Netzwerken berücksichtigen, bevor du etwas veröffentlichst: Abmahnung, Kündigung oder Schadensersatz bei Beleidigung, Geschäftsschädigung oder verratenen Geschäftsgeheimnissen.", 3,
    [K("WISO.05.02.8")])
L.k(3, "Du kannst Erfahrungen aus Chats, Foren oder Videokonferenzen reflektieren und beim eigenen Schreiben berücksichtigen, was dort anders ist als im direkten Gespräch: fehlende Mimik, dauerhaft gespeicherte Inhalte, unklare Identität des Gegenübers.", 3,
    [K("WISO.05.02.2")])

L.sp("WISO-5-2-2", "Dienstliche E-Mails, Netiquette, Empfängersicht und Adressatenlisten",
     "Dienstliche E-Mails kurz, höflich und korrekt formulieren, Nachrichten aus Sicht der Empfänger prüfen und Adressatenlisten sorgfältig verwenden.",
     G5, ["WISO.05.02.5", "WISO.05.02.6", "WISO.05.02.7"], [], baut_auf=["AP1-2-2-3", "AP1-7-4-2"],
     hinweis="Kommunikationsmodelle und eine unbequeme Nachricht an Kunden formulieren stehen in AP1-2-2-3, verdächtige Absender und Links prüfen in AP1-7-4-2.")
L.k(1, "Du kannst eine dienstliche E-Mail nach den Regeln formulieren: aussagekräftiger Betreff, Anrede und Gruß, kurzer und klarer Text, höflicher Ton, korrekte Rechtschreibung.", 3,
    [K("WISO.05.02.5")])
L.k(3, "Du kannst erklären, was Netiquette ist: Regeln für einen respektvollen Umgang in der digitalen Kommunikation, zum Beispiel keine Großbuchstaben als Schreien, sachlich bleiben, nicht vorschnell an alle antworten.", 2,
    [K("WISO.05.02.5")])
L.k(4, "Du kannst eine Nachricht vor dem Senden aus Sicht der Empfänger anpassen: Was wissen sie schon, was brauchen sie, was sollen sie tun?", 3,
    [K("WISO.05.02.6")])
L.k(5, "Du kannst Adressatenlisten sorgfältig einsetzen: nur an die schicken, die es betrifft, und Adressen nicht für alle Empfänger sichtbar machen.", 3,
    [K("WISO.05.02.7")])
L.k(6, "Du kannst die Felder An, CC und BCC unterscheiden und erklären, dass BCC die Adressen vor den anderen Empfängern verbirgt.", 2,
    [K("WISO.05.02.7")])

L.sp("WISO-5-2-3", "Zuständigkeiten bei Kommunikation und Information abgrenzen",
     "Verdeutlichen, wer welche Information an wen geben darf, Anfragen richtig weiterleiten und dienstliche und private Kommunikation trennen.",
     G5, ["WISO.05.02.4"], [])
L.k(1, "Du kannst verdeutlichen, warum bei Kommunikation und Information festgelegt sein muss, wer zuständig ist: damit Auskünfte richtig, abgestimmt und befugt sind.", 2,
    [K("WISO.05.02.4")])
L.k(2, "Du kannst Zuständigkeiten im Alltag anwenden: Auskünfte nach außen geben nur befugte Stellen, und Anfragen außerhalb deiner Zuständigkeit leitest du an die richtige Stelle weiter.", 3,
    [K("WISO.05.02.4")])
L.k(3, "Du kannst in einem Beispiel zuordnen, wer intern zu informieren ist, zum Beispiel Vorgesetzte, Fachabteilung oder Datenschutzbeauftragte.", 2,
    [K("WISO.05.02.4")])
L.k(4, "Du kannst die Trennung von dienstlicher und privater Kommunikation umsetzen, zum Beispiel getrennte Konten, Geräte und Kanäle.", 3,
    [K("WISO.05.02.4")], alt=("angepasst", "Operator umsetzen; Stufe 3 nach Katalog (WISO.05.02 umsetzen)"))

# ---------------------------------------------------------------- 5-3 Zusammenarbeit, Ethik, Compliance
L.tb("WISO-5-3", "Zusammenarbeit, Ethik und Compliance", "Wertschätzend in vielfältigen Teams arbeiten, Diversity und ethische Folgen von IT-Lösungen berücksichtigen und die Regeln des Betriebs einhalten.")

L.sp("WISO-5-3-3", "Wertschätzende Zusammenarbeit: interdisziplinär, interkulturell, gemeinsame Verantwortung, Unternehmenswerte und Ethikregeln",
     "Interdisziplinäre und interkulturelle Zusammenarbeit erklären, wertschätzendes Verhalten erkennen und Unternehmenswerte und Ethikregeln anwenden.",
     G5, ["WISO.05.01.1", "WISO.05.01.2", "WISO.05.01.3", "WISO.05.01.4"], [], baut_auf=["AP1-1-1-4"],
     hinweis="Teamphasen und Regeln für Feedback stehen in AP1-1-1-4. Früher Stichpunkt WISO-5-1-1.")
L.k(1, "Du kannst Interdisziplinarität (Zusammenarbeit verschiedener Fachgebiete) und Interkulturalität (Zusammenarbeit von Menschen mit unterschiedlichem kulturellem Hintergrund) erklären.", 2,
    [K("WISO.05.01.1")])
L.k(2, "Du kannst Verhalten erklären, das die Zusammenarbeit mit anderen Teams wirksam, integer und respektvoll macht: zuhören, Zusagen einhalten, sachlich bleiben, Informationen offen teilen.", 2,
    [K("WISO.05.01.2")])
L.k(3, "Du kannst erklären, was gemeinsame Verantwortung bedeutet: Das Ergebnis gehört dem ganzen Team, und der Beitrag jedes Mitglieds wird anerkannt.", 2,
    [K("WISO.05.01.3")])
L.k(4, "Du kannst Unternehmenswerte und betriebliche Ethikregeln, zum Beispiel einen Verhaltenskodex, auf eine Situation im Arbeitsalltag anwenden.", 3,
    [K("WISO.05.01.4")])
L.k(5, "Du kannst in einer beschriebenen Situation wertschätzendes von abwertendem Verhalten unterscheiden.", 2,
    [K("WISO.05.01.2"), K("WISO.05.01.3")])
L.k(6, "Du kannst Ursachen für Missverständnisse in gemischten Teams erklären: Fachsprache, unterschiedliche Sprachkenntnisse, Zeitzonen, andere Gewohnheiten im Umgang mit Kritik.", 2,
    [K("WISO.05.01.1")])

L.sp("WISO-5-3-1", "Diversity, Gender-Neutralität und ethische Verantwortung für IT-Lösungen",
     "Diversity und Gender-Neutralität erklären, das Ziel des Diversity Managements kennen und ethische Folgen von IT-Lösungen benennen.",
     G5, ["WISO.05.03.1", "WISO.05.03.2", "WISO.05.03.3", "WISO.05.03.4"],
     T("2022S-A29", "2022S-A30"),
     hinweis="Die Merkmale des Allgemeinen Gleichbehandlungsgesetzes stehen in WISO-1-3-5.")
L.k(1, "Du kannst Diversity und das Ziel des Diversity Managements erklären: die Vielfalt der Menschen, zum Beispiel nach Alter, Geschlecht, Herkunft, Religion oder Behinderung, anerkennen und die in ihr liegenden Potenziale für das Unternehmen nutzen.", 2,
    [K("WISO.05.03.1"), B("2022S-A30")])
L.k(2, "Du kannst Gender-Neutralität erklären und ein Beispiel nennen: Sprache, Formulare und Software so gestalten, dass kein Geschlecht ausgeschlossen wird, etwa durch eine dritte Auswahlmöglichkeit neben männlich und weiblich.", 2,
    [K("WISO.05.03.2")])
L.k(3, "Du kannst erklären, dass eine IT-Lösung die Würde und Integrität aller Betroffenen wahren muss, auch der Menschen, die sie nicht selbst benutzen, deren Daten aber verarbeitet werden.", 2,
    [K("WISO.05.03.3")])
L.k(4, "Du kannst erklären, dass dabei auch die späteren Folgen zählen und die Auswirkungen auf Umwelt, Pflanzen, Tiere und Lebensräume.", 2,
    [K("WISO.05.03.4")])
L.k(5, "Du kannst ethische Fragen bei IT-Lösungen an Beispielen erklären: Überwachung von Beschäftigten, Benachteiligung durch automatische Entscheidungen, fehlende Barrierefreiheit.", 2,
    [K("WISO.05.03.3")])
L.k(6, "Du kannst die Charta der Vielfalt einordnen: eine freiwillige Selbstverpflichtung von Unternehmen für ein vorurteilsfreies Arbeitsumfeld, die Merkmale wie Alter, Geschlecht, Nationalität und ethnische Herkunft, Religion, sexuelle Orientierung und Behinderung berücksichtigt – nicht den Ausbildungsstand.", 2,
    [K("WISO.05.03.1"), B("2022S-A29")])

L.sp("WISO-5-3-2", "Compliance im Arbeitsalltag: allgemeine und betriebliche Regelungen einhalten",
     "Allgemeine und betriebliche Regelungen unterscheiden, regelgerechtes Verhalten in einer Situation erkennen und Folgen von Verstößen kennen.",
     G5, ["WISO.05.03.5"], T("2021W-A30", "2023S-A30"), baut_auf=["PB1-2-1-2"],
     hinweis="Was Compliance ist und wie ein Softwareprojekt regelkonform bleibt, steht in PB1-2-1-2.")
L.k(2, "Du kannst allgemeine und betriebliche Regelungen unterscheiden: Gesetze gelten für alle, betriebliche Regeln wie ein Verhaltenskodex oder eine IT-Nutzungsrichtlinie nur im eigenen Betrieb.", 2,
    [K("WISO.05.03.5")])
L.k(3, "Du kannst in einer beschriebenen Situation regelgerechtes von regelwidrigem Verhalten unterscheiden, zum Beispiel eine Auswahl nach Qualifikation gegenüber einer Bevorzugung aus Verwandtschaft oder wegen Hautfarbe, Religion oder sexueller Orientierung.", 2,
    [K("WISO.05.03.5"), B("2023S-A30")])
L.k(4, "Du kannst Bereiche erklären, die Compliance-Regeln häufig betreffen: Bestechung und Annahme von Geschenken, Datenschutz, Lizenzen und Urheberrecht, Umgang mit vertraulichen Informationen; Einflussnahme durch persönliche Zuwendungen ist ein Compliance-Verstoß.", 2,
    [K("WISO.05.03.5"), B("2021W-A30")])
L.k(5, "Du kannst Folgen von Verstößen erklären: Abmahnung oder Kündigung, Bußgeld, Schadensersatz, Schaden für den Ruf des Betriebs.", 2,
    [K("WISO.05.03.5")])

# ---------------------------------------------------------------- alt → neu
A = L.a
A("WISO-5-2-1-K2", "verschoben", "WISO-5-2-4-K1", "Social Media im neuen Stichpunkt WISO-5-2-4 (F3)")
A("WISO-5-2-1-K5", "verschoben", "WISO-5-2-4-K2", "Äußerungen über den Arbeitgeber im neuen Stichpunkt WISO-5-2-4 (F3)")
A("WISO-5-2-1-K6", "verschoben", "WISO-5-2-4-K3", "Erfahrungen in virtuellen Räumen im neuen Stichpunkt WISO-5-2-4 (F3)")
A("WISO-5-2-2-K2", "gestrichen", None, "E2/P36: Absender und Links prüfen, unbekannte Anhänge nicht öffnen steht in AP1-7-4-2-K2 und AP1-7-4-1-K8")
for n in range(1, 7):
    A(f"WISO-5-1-1-K{n}", "verschoben", f"WISO-5-3-3-K{n}", "Stichpunkt in den Block Zusammenarbeit, Ethik und Compliance verschoben (F4: der Block Zusammenarbeit im Team hatte nur einen Stichpunkt)")
A("WISO-5-3-2-K1", "gestrichen", None, "E2/P36: Compliance erklären steht in PB1-2-1-2-K1")

RS = L.rahmen_satz
RS("WISO-5-2-1", "Verlangt ist das Erkennen von Gefahren und das richtige Verhalten, keine technische Abwehr.", "übernommen", "G2: Perspektive WiSo (Verhalten am Arbeitsplatz); technische Abwehr steht in AP1-7")
RS("WISO-5-2-3", "Sicher ist nur der Kern: Es muss klar sein, wer welche Information an wen geben darf.", "übernommen", "Katalogwortlaut WISO.05.02.4 („Zuständigkeitsabgrenzung verdeutlichen“)")
RS("WISO-5-3-2", "In den ausgewerteten Prüfungen gab es dazu keine Frage; es genügt, den Begriff zu erklären, Beispiele zu nennen und in einer Situation das regelgerechte Verhalten zu erkennen.", "gestrichen", "Überholt: 2021W-WISO-A30 und 2023S-WISO-A30 fragen Compliance ab; Tiefe aus Katalog und Z3b")

L.gesch("WISO.05.01.1", "Interdisziplinarität, Interkulturalität", {"Interdisziplinarität": ["WISO-5-3-3-K1"], "Interkulturalität": ["WISO-5-3-3-K1", "WISO-5-3-3-K6"]})
L.gesch("WISO.05.02.1", "privater und betrieblicher Bereich", {"privat": ["WISO-5-2-1-K1"], "betrieblich": ["WISO-5-2-1-K1", "WISO-5-2-1-K7"]})
L.gesch("WISO.05.02.3", "Gefahren im privaten und betrieblichen Bereich (Social Media)", {"privat/betrieblich": ["WISO-5-2-4-K1"]})
L.gesch("WISO.05.03.5", "allgemeine und betriebliche Compliance-Regelungen", {"allgemein": ["WISO-5-3-2-K2"], "betrieblich": ["WISO-5-3-2-K2", "WISO-5-3-2-K3"]})

L.write(meta(kerntest="Alle 10 WiSo-Teilaufgaben dieses Ordners gegen die Musterlösungen gelesen; Phishing, sicheres Surfen und offenes WLAN lösen sich mit AP1-7-4-2 und AP1-7-4-3 (baut_auf), die Prüfsumme mit der neuen Aussage zu den Schutzzielen. Charta der Vielfalt ergänzt."))
