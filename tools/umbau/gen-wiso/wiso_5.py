import sys; sys.path.insert(0, sys.path[0])
from lpw import LPW, B, T, K, R, meta

L = LPW("WISO-5", "Vernetztes Zusammenarbeiten unter Nutzung digitaler Medien", ["G.WISO.05"])
G5 = ["G.WISO.05"]; G53 = ["G.WISO.05", "G.WISO.03"]

AP1_SICHER = ["AP1-7-1-1", "AP1-7-1-2", "AP1-7-1-3", "AP1-7-2-1", "AP1-7-2-2", "AP1-7-4-1", "AP1-7-4-2", "AP1-7-4-3", "AP1-7-5-1", "PB1-10-1-4"]

# ---------------------------------------------------------------- 5-2 Sicher digital kommunizieren
L.tb("WISO-5-2", "Sicher und angemessen digital kommunizieren", "Sicherheitsbewusst mit IT, E-Mail und Social Media umgehen, Social Engineering erkennen und dienstlich klar, höflich und zuständig kommunizieren. Die technischen Grundlagen der IT-Sicherheit kennst du aus AP1-7.")

L.sp("WISO-5-2-1", "Sicherheitsbewusstsein, Social Engineering und IT-Sicherheit am Arbeitsplatz",
     "Begründen, warum Sicherheitsbewusstsein nötig ist, Social Engineering erkennen und abwehren, Authentizität von Integrität abgrenzen und die Ziele der DSGVO sowie die Aufgaben des BSI kennen.",
     G53, ["WISO.05.02.1", "WISO.05.02.9", ("WISO.03.08.2", "zweites Ziel der DSGVO"), ("WISO.03.08.3", "Schutzziel Authentizität"), ("WISO.03.08.4", "BSI gegen Datenschutzaufsicht und Polizei")],
     T("2021W-A25", "2021W-A26", "2021W-A27", "2021W-A28", "2021W-A29"),
     baut_auf=AP1_SICHER + ["AP1-7-1-4", "AP1-7-3-2"],
     hinweis="Schutzziele, technische und organisatorische Maßnahmen, BSI und IT-Grundschutz, Datenschutz (DSGVO), Schadsoftware, Phishing und sicheres mobiles Arbeiten kennst du aus AP1-7 (WISO.03.08 bis auf drei Punkte gedeckt, P47); hier steht nur, was WiSo darüber hinaus verlangt (Authentizität, zweites Ziel der DSGVO, BSI-Abgrenzung). Damit lösen sich 2021W-WISO-A25 bis A28 (Phishing erkennen und richtig reagieren: AP1-7-4-2; offenes WLAN nur mit VPN: AP1-7-4-3). Bildschirm sperren, eigene Passwörter, Updates und Vorfälle melden stehen in AP1-7-1-3, AP1-7-1-4 und AP1-7-4-3.")
L.k(1, "Du kannst erläutern, warum Sicherheitsbewusstsein privat und im Betrieb nötig ist: Unachtsamkeit Einzelner ist ein häufiger Weg für Angriffe, private Gewohnheiten wirken in den Betrieb hinein, und auch bekannte, seriöse Webseiten können manipuliert sein.", 2,
    [K("WISO.05.02.1"), B("2021W-A27")])
L.k(3, "Du kannst Social Engineering erklären: Angreifer nutzen Vertrauen, Hilfsbereitschaft, Respekt vor Vorgesetzten oder Zeitdruck aus, um an Informationen oder Zugang zu kommen, zum Beispiel per Phishing-Mail mit gefälschtem Absender (Anzeigename passt nicht zur tatsächlichen Adresse), Anruf als angeblicher Support oder vorgetäuschter Notlage.", 2,
    [K("WISO.05.02.9"), B("2021W-A25")])
L.k(4, "Du kannst Verhalten unterscheiden, das Schäden durch Social Engineering vermeidet: die Identität über einen bekannten zweiten Weg prüfen (Rückruf unter der bekannten Nummer, auch bei angeblichen Anweisungen von Vorgesetzten) und eine verdächtige Nachricht nicht weiterleiten, ausdrucken oder beantworten, sondern löschen und der zuständigen Stelle melden.", 2,
    [K("WISO.05.02.9"), B("2021W-A26")])
L.k(8, "Du kannst Authentizität als viertes Schutzziel neben Vertraulichkeit, Integrität und Verfügbarkeit erklären (Absender und Daten sind echt) und dabei von der Integrität abgrenzen: Eine mitgesendete und beim Empfänger verglichene Prüfsumme zeigt nur, dass die Daten unverändert sind, nicht, wer sie geschickt hat; das belegt erst eine digitale Signatur.", 2,
    [K("WISO.03.08.3"), B("2021W-A29")], neu=(["AP1-7-1-1", "AP1-7-3-2"], "Authentizität als viertes Schutzziel benennen; Abgrenzung zur Integrität (Prüfsumme belegt keine Herkunft)"))
L.k(9, "Du kannst die beiden Ziele der DSGVO unterscheiden: den Schutz natürlicher Personen und ihrer Grundrechte bei der Verarbeitung personenbezogener Daten und den freien Verkehr dieser Daten im EU-Binnenmarkt durch ein einheitliches Recht, das in allen Mitgliedstaaten unmittelbar gilt; das BDSG ergänzt es nur.", 2,
    [K("WISO.03.08.2")], neu=(["AP1-7-5-1"], "zweites Ziel der DSGVO (freier Datenverkehr in der EU, einheitliches, unmittelbar geltendes Recht)"))
L.k(10, "Du kannst Aufgaben des BSI von denen anderer Stellen unterscheiden: Das BSI als Cybersicherheitsbehörde des Bundes warnt vor Sicherheitslücken, berät, setzt Standards, zertifiziert und schützt die Netze des Bundes; Bußgelder wegen Datenschutzverstößen verhängt die Datenschutzaufsicht (Landesdatenschutzbehörde, für Bundesbehörden der BfDI), Straftaten wie Erpressung durch Ransomware verfolgen Polizei und Staatsanwaltschaft.", 2,
    [K("WISO.03.08.4")], neu=(["AP1-7-2-1"], "Aufgaben des BSI abgrenzen gegen Datenschutzaufsicht und Polizei"))

L.sp("WISO-5-2-4", "Social Media und virtuelle Räume: Gefahren, Äußerungen über den Arbeitgeber, Kommunikation ohne direkten Kontakt",
     "Die Gefahren von Social Media für die IT-Sicherheit kennen, die Folgen von Äußerungen über den Arbeitgeber berücksichtigen und Erfahrungen aus virtuellen Räumen reflektieren.",
     G5, ["WISO.05.02.2", "WISO.05.02.3", "WISO.05.02.8"], [],
     hinweis="Neuer Stichpunkt; die Aussagen standen vorher in WISO-5-2-1, der dadurch zu groß wurde (F3). Pflichtverletzungen und ihre arbeitsrechtlichen Folgen allgemein (Abmahnung, Kündigung, Verschwiegenheit) stehen in WISO-1-1-4; hier nur das Besondere sozialer Netzwerke.")
L.k(1, "Du kannst Gefahren von Social Media für die IT-Sicherheit nennen: preisgegebene Informationen über Personen und Betrieb, gefälschte Profile, schädliche Links, übernommene Konten.", 1,
    [K("WISO.05.02.3")])
L.k(2, "Du kannst die möglichen Folgen von Äußerungen über den eigenen Arbeitgeber in sozialen Netzwerken berücksichtigen, bevor du etwas veröffentlichst: Sachliche Kritik ist grundsätzlich von der Meinungsfreiheit gedeckt; Beleidigung, Geschäftsschädigung durch unwahre Behauptungen oder verratene Geschäftsgeheimnisse können Abmahnung, Kündigung, Schadensersatz oder eine Strafanzeige nach sich ziehen, auch bei Beiträgen in privaten Profilen oder geschlossenen Gruppen.", 3,
    [K("WISO.05.02.8")])
L.k(3, "Du kannst Erfahrungen aus Chats, Foren oder Videokonferenzen reflektieren und beim eigenen Schreiben berücksichtigen, was dort anders ist als im direkten Gespräch: fehlende Mimik, dauerhaft gespeicherte Inhalte, unklare Identität des Gegenübers.", 3,
    [K("WISO.05.02.2")])

L.sp("WISO-5-2-2", "Dienstlich kommunizieren: E-Mail, Netiquette, Empfängersicht, Adressatenlisten und Zuständigkeiten",
     "Dienstliche E-Mails kurz, höflich, korrekt und sicher versenden, Nachrichten aus Sicht der Empfänger prüfen, Adressatenlisten sorgfältig verwenden und Zuständigkeiten in der Kommunikation beachten.",
     G5, [("WISO.05.02.1", "dienstliche und private Kommunikation trennen"), "WISO.05.02.4", "WISO.05.02.5", "WISO.05.02.6", "WISO.05.02.7"], [], baut_auf=["AP1-2-2-3", "AP1-7-4-2"],
     hinweis="Kommunikationsmodelle und eine unbequeme Nachricht an Kunden formulieren stehen in AP1-2-2-3, verdächtige Absender und Links prüfen in AP1-7-4-2, Verschlüsselung in AP1-7-3. Wer im Betrieb für IT-Sicherheit und wer für Datenschutz zuständig ist, steht in AP1-7-1-4. Die Zuständigkeiten (früher Stichpunkt WISO-5-2-3) sind hier aufgegangen (D7).")
L.k(1, "Du kannst eine dienstliche E-Mail nach den Regeln formulieren: aussagekräftiger Betreff, Anrede und Gruß, kurzer und klarer Text, höflicher Ton, korrekte Rechtschreibung.", 3,
    [K("WISO.05.02.5")])
L.k(3, "Du kannst erklären, was Netiquette ist: Regeln für einen respektvollen Umgang in der digitalen Kommunikation, zum Beispiel keine durchgehenden Großbuchstaben (gelten als Schreien), keine Kettenbriefe, angemessene Antwortzeiten.", 2,
    [K("WISO.05.02.5")])
L.k(4, "Du kannst eine Nachricht vor dem Senden aus Sicht der Empfänger anpassen: Was wissen sie schon, was brauchen sie, was sollen sie tun?", 3,
    [K("WISO.05.02.6")])
L.k(5, "Du kannst Adressatenlisten sorgfältig einsetzen: nur Betroffene anschreiben, An, CC und BCC unterscheiden und bei externen oder großen Verteilern BCC nutzen, weil offen sichtbare E-Mail-Adressen meist personenbezogene Daten sind und ihre Preisgabe gegen die DSGVO verstoßen kann.", 3,
    [K("WISO.05.02.7")])
L.k(7, "Du kannst dienstliche E-Mails sicher versenden und dabei dienstliche und private Kommunikation trennen: Empfänger vor dem Senden kontrollieren (Autovervollständigung), vertrauliche oder personenbezogene Inhalte nur verschlüsselt, keine Weiterleitung an private Postfächer oder Messenger, Abwesenheitsnotiz ohne interne Details.", 3,
    [K("WISO.05.02.5"), K("WISO.05.02.1")])
L.k(8, "Du kannst Zuständigkeiten in der Kommunikation in einer Situation anwenden: Auskünfte nach außen gibt nur, wer dazu befugt ist, damit sie richtig und abgestimmt sind; eine Anfrage außerhalb deiner Zuständigkeit leitest du an die zuständige Stelle weiter, zum Beispiel an Vorgesetzte, die Fachabteilung oder bei personenbezogenen Daten an den Datenschutzbeauftragten, statt selbst zu antworten.", 3,
    [K("WISO.05.02.4")])

# ---------------------------------------------------------------- 5-3 Zusammenarbeit, Ethik, Compliance
L.tb("WISO-5-3", "Zusammenarbeit, Ethik und Compliance", "Wertschätzend in vielfältigen Teams arbeiten, Diversity und ethische Folgen von IT-Lösungen berücksichtigen und die Regeln des Betriebs einhalten.")

L.sp("WISO-5-3-3", "Wertschätzende Zusammenarbeit: interdisziplinär, interkulturell, gemeinsame Verantwortung, Unternehmenswerte und Ethikregeln",
     "Interdisziplinäre und interkulturelle Zusammenarbeit erklären, wertschätzendes Verhalten erkennen und Unternehmenswerte und Ethikregeln anwenden.",
     G5, ["WISO.05.01.1", "WISO.05.01.2", "WISO.05.01.3", "WISO.05.01.4"], [], baut_auf=["AP1-1-1-4"],
     hinweis="Teamphasen und Regeln für Feedback stehen in AP1-1-1-4. Früher Stichpunkt WISO-5-1-1.")
L.k(1, "Du kannst Interdisziplinarität (Zusammenarbeit verschiedener Fachgebiete) und Interkulturalität (Zusammenarbeit von Menschen mit unterschiedlichem kulturellem Hintergrund) erklären.", 2,
    [K("WISO.05.01.1")])
L.k(2, "Du kannst Verhalten erklären, das die Zusammenarbeit mit anderen Teams wirksam, integer und respektvoll macht (zuhören, Zusagen einhalten, sachlich bleiben, Informationen offen teilen), und es in einer beschriebenen Situation von abwertendem Verhalten unterscheiden.", 2,
    [K("WISO.05.01.2")])
L.k(3, "Du kannst erklären, was gemeinsame Verantwortung bedeutet: Das Ergebnis gehört dem ganzen Team, und der Beitrag jedes Mitglieds wird anerkannt.", 2,
    [K("WISO.05.01.3")])
L.k(4, "Du kannst Unternehmenswerte und betriebliche Ethikregeln, zum Beispiel einen Verhaltenskodex, auf eine Situation im Arbeitsalltag anwenden.", 3,
    [K("WISO.05.01.4")])
L.k(6, "Du kannst Ursachen für Missverständnisse in gemischten Teams erklären: Fachsprache, unterschiedliche Sprachkenntnisse, Zeitzonen, andere Gewohnheiten im Umgang mit Kritik.", 2,
    [K("WISO.05.01.1")])

L.sp("WISO-5-3-1", "Diversity, Gender-Neutralität und ethische Verantwortung für IT-Lösungen",
     "Diversity und Gender-Neutralität erklären, das Ziel des Diversity Managements und die Charta der Vielfalt kennen und ethische Folgen von IT-Lösungen benennen.",
     G5, ["WISO.05.03.1", "WISO.05.03.2", "WISO.05.03.3", "WISO.05.03.4"],
     T("2022S-A29", "2022S-A30"),
     hinweis="Die Merkmale des Allgemeinen Gleichbehandlungsgesetzes und die Benachteiligung nach dem AGG stehen in WISO-1-3-5; hier nur, was die Charta der Vielfalt anders macht. Die Auswirkungen auf Umwelt, Pflanzen, Tiere und Lebensräume (WISO.05.03.4 wiederholt WISO.04.04.1) stehen in WISO-4-1-2; hier nur der Zeithorizont bei IT-Lösungen.")
L.k(1, "Du kannst Diversity und das Ziel des Diversity Managements erklären: die Vielfalt der Menschen, zum Beispiel nach Alter, Geschlecht, Herkunft, Religion oder Behinderung, anerkennen und die in ihr liegenden Potenziale für das Unternehmen nutzen.", 2,
    [K("WISO.05.03.1"), B("2022S-A30")])
L.k(2, "Du kannst Gender-Neutralität erklären und ein Beispiel nennen: Sprache, Formulare und Software so gestalten, dass kein Geschlecht ausgeschlossen wird, etwa die Auswahl „divers“ und „keine Angabe“ neben männlich und weiblich oder „(m/w/d)“ in Stellenanzeigen.", 2,
    [K("WISO.05.03.2")])
L.k(3, "Du kannst ethische Fragen bei IT-Lösungen an Beispielen erklären: Die Würde und Integrität aller direkt und indirekt Betroffenen, auch der Menschen, deren Daten nur verarbeitet werden, ist kurz-, mittel- und langfristig zu wahren, zum Beispiel keine heimliche Überwachung von Beschäftigten, keine Benachteiligung durch automatische Entscheidungen, barrierefreier Zugang und auf lange Sicht Energiebedarf und Elektroschrott der Lösung.", 2,
    [K("WISO.05.03.3"), K("WISO.05.03.4")])
L.k(6, "Du kannst die Charta der Vielfalt vom AGG unterscheiden: Sie ist eine freiwillige Selbstverpflichtung von Unternehmen für ein vorurteilsfreies Arbeitsumfeld (das AGG ist ein Gesetz) und nennt sieben Dimensionen: Alter, ethnische Herkunft und Nationalität, Geschlecht und geschlechtliche Identität, körperliche und geistige Fähigkeiten, Religion und Weltanschauung, sexuelle Orientierung und soziale Herkunft – nicht den Ausbildungsstand oder die Art des Abschlusses.", 2,
    [K("WISO.05.03.1"), B("2022S-A29")])

L.sp("WISO-5-3-2", "Compliance im Arbeitsalltag: allgemeine und betriebliche Regelungen einhalten",
     "Allgemeine und betriebliche Regelungen unterscheiden, regelgerechtes Verhalten in einer Situation erkennen und Folgen von Verstößen kennen.",
     G5, ["WISO.05.03.5"], T("2021W-A30", "2023S-A30"), baut_auf=["PB1-2-1-2"],
     hinweis="Was Compliance ist und wie ein Softwareprojekt regelkonform bleibt (Lizenzen, Datenschutz), steht in PB1-2-1-2. Benachteiligung nach AGG-Merkmalen (Hautfarbe, Religion, sexuelle Identität) steht in WISO-1-3-5, persönliche arbeitsrechtliche Folgen von Pflichtverletzungen in WISO-1-1-4.")
L.k(2, "Du kannst allgemeine und betriebliche Regelungen unterscheiden: Gesetze gelten für alle, betriebliche Regeln wie ein Verhaltenskodex oder eine IT-Nutzungsrichtlinie nur im eigenen Betrieb.", 2,
    [K("WISO.05.03.5")])
L.k(3, "Du kannst in einer beschriebenen Situation regelgerechtes von regelwidrigem Verhalten unterscheiden: Entscheidungen nach sachlichen Gründen wie der Qualifikation gegenüber einer Bevorzugung aus sachfremden Gründen wie Verwandtschaft oder persönlichen Beziehungen (Vetternwirtschaft).", 2,
    [K("WISO.05.03.5"), B("2023S-A30")])
L.k(4, "Du kannst Bereiche erklären, die Compliance-Regeln über das Softwareprojekt hinaus betreffen: Bestechung und Annahme von Geschenken, Interessenkonflikte, Umgang mit vertraulichen Informationen; wer Geschäftspartner durch persönliche Zuwendungen beeinflussen will, verstößt gegen Compliance.", 2,
    [K("WISO.05.03.5"), B("2021W-A30")])
L.k(5, "Du kannst Folgen von Compliance-Verstößen für den Betrieb erklären: Bußgelder und Haftung des Unternehmens, Schadensersatz, Ausschluss von Aufträgen und Schaden für den Ruf.", 2,
    [K("WISO.05.03.5")])

# ---------------------------------------------------------------- alt → neu
A = L.a
A("WISO-5-2-1-K2", "verschoben", "WISO-5-2-4-K1", "Social Media im neuen Stichpunkt WISO-5-2-4 (F3)")
A("WISO-5-2-1-K5", "verschoben", "WISO-5-2-4-K2", "Äußerungen über den Arbeitgeber im neuen Stichpunkt WISO-5-2-4 (F3)")
A("WISO-5-2-1-K6", "verschoben", "WISO-5-2-4-K3", "Erfahrungen in virtuellen Räumen im neuen Stichpunkt WISO-5-2-4 (F3)")
A("WISO-5-2-2-K2", "gestrichen", None, "E2/P36: Absender und Links prüfen, unbekannte Anhänge nicht öffnen steht in AP1-7-4-2-K2 und AP1-7-4-1-K8")
for n in (1, 2, 3, 4, 6):
    A(f"WISO-5-1-1-K{n}", "verschoben", f"WISO-5-3-3-K{n}", "Stichpunkt in den Block Zusammenarbeit, Ethik und Compliance verschoben (F4: der Block Zusammenarbeit im Team hatte nur einen Stichpunkt)")
A("WISO-5-1-1-K5", "verschoben", "WISO-5-3-3-K2", "Prüfer WISO-5 Nr. 27: wertschätzendes von abwertendem Verhalten unterscheiden ist die Anwendung von K2, dort zusammengefasst (Stichpunkt vorher von WISO-5-1-1 nach WISO-5-3-3 verschoben)")
A("WISO-5-2-2-K6", "verschoben", "WISO-5-2-2-K5", "Prüfer WISO-5 Nr. 13: An/CC/BCC ist nur das Mittel zu K5; zusammengefasst mit dem Datenschutzgrund für BCC")
A("WISO-5-2-3-K1", "verschoben", "WISO-5-2-2-K8", "Prüfer WISO-5 Nr. 12, D7: WISO-5-2-3 behielt nach den Kürzungen weniger als drei Aussagen und geht in WISO-5-2-2 auf; Begründung der Zuständigkeit in K8")
A("WISO-5-2-3-K2", "verschoben", "WISO-5-2-2-K8", "Prüfer WISO-5 Nr. 10/12, D7: sagt dasselbe wie WISO-5-2-3-K1 als Anwendung; zusammen in WISO-5-2-2-K8")
A("WISO-5-2-3-K3", "verschoben", "WISO-5-2-2-K8", "Prüfer WISO-5 Nr. 12, D7: wen intern informieren als Beispiel in WISO-5-2-2-K8; Zuständigkeit IT-Sicherheits- und Datenschutzbeauftragter steht in AP1-7-1-4")
A("WISO-5-2-3-K4", "verschoben", "WISO-5-2-2-K7", "Prüfer WISO-5 Nr. 11: Trennung dienstlich/privat ist keine Zuständigkeitsabgrenzung; aufgegangen im sicheren Versand dienstlicher E-Mails (WISO.05.02.5)")
A("WISO-5-3-1-K4", "verschoben", "WISO-5-3-1-K3", "Prüfer WISO-5 Nr. 19, D6: Umweltwirkungen stehen in WISO-4-1-2; nur der Zeithorizont bei IT-Lösungen bleibt, in K3")
A("WISO-5-3-1-K5", "verschoben", "WISO-5-3-1-K3", "Prüfer WISO-5 Nr. 23: K5 lieferte nur Beispiele zu K3; zusammengefasst")
A("WISO-5-3-2-K1", "gestrichen", None, "E2/P36: Compliance erklären steht in PB1-2-1-2-K1")

RS = L.rahmen_satz
RS("WISO-5-2-1", "Verlangt ist das Erkennen von Gefahren und das richtige Verhalten, keine technische Abwehr.", "übernommen", "G2: Perspektive WiSo (Verhalten am Arbeitsplatz); technische Abwehr steht in AP1-7")
RS("WISO-5-2-3", "Sicher ist nur der Kern: Es muss klar sein, wer welche Information an wen geben darf.", "übernommen", "Katalogwortlaut WISO.05.02.4 („Zuständigkeitsabgrenzung verdeutlichen“)")
RS("WISO-5-3-2", "In den ausgewerteten Prüfungen gab es dazu keine Frage; es genügt, den Begriff zu erklären, Beispiele zu nennen und in einer Situation das regelgerechte Verhalten zu erkennen.", "gestrichen", "Überholt: 2021W-WISO-A30 und 2023S-WISO-A30 fragen Compliance ab; Tiefe aus Katalog und Z3b")

L.gesch("WISO.05.01.1", "Interdisziplinarität, Interkulturalität", {"Interdisziplinarität": ["WISO-5-3-3-K1"], "Interkulturalität": ["WISO-5-3-3-K1", "WISO-5-3-3-K6"]})
L.gesch("WISO.05.02.1", "privater und betrieblicher Bereich", {"privat": ["WISO-5-2-1-K1"], "betrieblich": ["WISO-5-2-1-K1", "WISO-5-2-2-K7"]})
L.gesch("WISO.05.02.3", "Gefahren im privaten und betrieblichen Bereich (Social Media)", {"privat/betrieblich": ["WISO-5-2-4-K1"]})
L.gesch("WISO.05.03.5", "allgemeine und betriebliche Compliance-Regelungen", {"allgemein": ["WISO-5-3-2-K2"], "betrieblich": ["WISO-5-3-2-K2", "WISO-5-3-2-K3"]})

# Kür aus der unabhängigen Prüfung (P49, Hinweisquelle pruefer:wiso-2026-10)
L.kuer_pruefer('WISO-5-2-2', 'Pflichtangaben in geschäftlichen E-Mails', 'Geschäftliche E-Mails eines Kaufmanns oder einer Gesellschaft brauchen dieselben Pflichtangaben wie Geschäftsbriefe, bei einer GmbH zum Beispiel Firma, Rechtsform, Sitz, Registergericht, Handelsregisternummer und alle Geschäftsführer (§ 35a GmbHG, § 37a HGB).', 'Kür-Vorschlag der unabhängigen Prüfung (P49): übliches WiSo-Thema, aber nicht im Katalog')

L.write(meta(kerntest="Alle 10 WiSo-Teilaufgaben dieses Ordners gegen die Musterlösungen gelesen; Phishing, sicheres Surfen und offenes WLAN lösen sich mit AP1-7-4-2 und AP1-7-4-3 (baut_auf), die Prüfsumme mit der Aussage zu Authentizität und Integrität. Charta der Vielfalt ergänzt. Unabhängige Prüfung (umbau/berichte/WISO-5-pruefer.md, 29 Funde) eingebaut: Doppelungen zu AP1-7 gestrichen oder auf das Neue gekürzt, zweites DSGVO-Ziel und BSI-Abgrenzung ergänzt, WISO-5-2-3 in WISO-5-2-2 aufgegangen."))
