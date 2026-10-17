import sys; sys.path.insert(0, sys.path[0])
from lp import LP, meta, QUELLEN_PB2
L = LP("PB2-1", "Programmlogik und Pseudocode", "PB2", ["G.PB2.01", "G.PB2.02"])
G1 = ["G.PB2.01"]; G2 = ["G.PB2.02"]; G12 = ["G.PB2.01", "G.PB2.02"]
P = ["podcast:themen-pb2"]
HW = "Die Darstellung soll laut Katalog in allgemein verständlichem Programm- oder Pseudocode erfolgen; eine bestimmte Sprache wird nicht verlangt (AP2b.03.05, AP2b.04.19)."

L.tb("Algorithmen in Pseudocode", "Lösungen als lesbaren Pseudocode aufschreiben: Funktionen, Kontrollstrukturen, Arrays und Listen von Objekten, bestehende Klassen erweitern und den Ablauf grafisch darstellen. Variablen, Kontrollstrukturen und einfachen Pseudocode kennst du aus AP1.")
L.sp("sp_form", "Pseudocode: Funktionen, Kontrollstrukturen und vorgegebene Strukturen",
     "Eine Funktion so aufschreiben, dass ein Dritter sie ohne Kenntnis der Sprache lesen kann, mit Kontrollstrukturen, passenden Datentypen und den Methoden und Strukturen, die die Aufgabe vorgibt.",
     G1, ["AP2b.03.05", ("AP2b.04.16", "Form des Pseudocodes"), ("AP2b.04.16.1", "Form des Pseudocodes")],
     ["2021W-PB2-A2", "2022S-PB2-A1", "2023S-PB2-A2", "2024W-PB2-A1", "2025S-PB2-A1", "2025W-PB2-A1-a"],
     baut_auf=["AP1-8-2-1", "AP1-8-2-2"], hinweis=HW)
L.k("fo1", "Du kannst eine Funktion mit Namen, Parametern mit Datentyp und Rückgabetyp so aufschreiben, dass ein Dritter sie ohne Kenntnis deiner Programmiersprache lesen kann (Signatur wie in der Aufgabe vorgegeben).", 3,
    ["katalog:AP2b.03.05", "beleg:2021W-PB2-A2"])
L.k("fo2", "Du kannst über die Kontrollstrukturen aus AP1 hinaus geschachtelte Schleifen und Verzweigungen sauber einrücken, Zählschleifen über Indexbereiche (0 bis Länge − 1) richtig begrenzen und Schleifen vorzeitig beenden, sobald das Ergebnis feststeht.", 3,
    ["katalog:AP2b.04.16.1", "beleg:2022S-PB2-A1"])
L.k("fo3", "Du kannst zweidimensionale Arrays verarbeiten: Zeile und Spalte über zwei Indizes ansprechen, eine Zeile anhand eines Schlüsselwerts (z. B. Monat und Tag) suchen und die Spalten dieser Zeile auswerten.", 3,
    ["katalog:AP2b.04.16.1", "beleg:2021W-PB2-A2", "beleg:2022S-PB2-A1"])
L.k("fo4", "Du kannst die in der Aufgabe vorgegebenen Klassen, Methoden und Datenstrukturen richtig verwenden, zum Beispiel Listen mit add, size und get oder Getter von Objekten, und keine eigenen Hilfsfunktionen voraussetzen, die es nicht gibt.", 3,
    ["katalog:AP2b.04.16.1", "beleg:2025S-PB2-A1"])
L.k("fo5", "Du kannst Sonderfälle im Pseudocode abfangen, zum Beispiel eine leere Liste, einen fehlenden Eintrag oder eine Division durch null, und dafür einen festgelegten Rückgabewert liefern.", 3,
    ["katalog:AP2b.04.16", "beleg:2025S-PB2-A1"])

L.sp("sp_alg", "Algorithmen über Arrays und Listen: filtern, zählen, Extremwerte, abgleichen",
     "Wiederkehrende Grundmuster sicher anwenden: Elemente filtern, zählen und summieren, Durchschnitt und Extremwerte bestimmen, Listen abgleichen, gruppieren und Häufigkeiten zählen.",
     G1, ["AP2b.04.16", "AP2b.04.16.1"],
     ["2023S-PB2-A2", "2024S-PB2-A2-b", "2024W-PB2-A1", "2025W-PB2-A1-a", "2025W-PB2-A1-b", "2023W-PB2-A2"],
     hinweis="Die Suche nach dem kleinsten oder größten Element (2025W-PB2-A1-b) ist eine lineare Suche; die Suchverfahren selbst stehen in PB2-2.")
L.k("al1", "Du kannst eine Liste oder ein Array durchlaufen und die Elemente, die eine oder mehrere Bedingungen erfüllen, in eine Ergebnisliste übernehmen und diese zurückgeben.", 3,
    ["katalog:AP2b.04.16", "beleg:2025W-PB2-A1-a"])
L.k("al2", "Du kannst zählen, summieren und einen Durchschnitt berechnen, auch nur für die Elemente eines Zeitraums oder einer Bedingung, zum Beispiel die Tage, an denen ein Kurs besser als der Index war.", 3,
    ["katalog:AP2b.04.16", "beleg:2024S-PB2-A2-b", "beleg:2023S-PB2-A2"])
L.k("al3", "Du kannst das kleinste oder größte Element nach einem Kriterium bestimmen: mit dem ersten Element beginnen, jedes weitere vergleichen und das bisher beste merken; auch das Element mit der kleinsten Abweichung von einem Zielwert.", 3,
    ["katalog:AP2b.04.16", "beleg:2025W-PB2-A1-b"])
L.k("al4", "Du kannst zwei Listen mit verschachtelten Schleifen abgleichen, zum Beispiel für jeden Tisch prüfen, ob eine Reservierung ihn zur selben Zeit belegt.", 3,
    ["katalog:AP2b.04.16", "beleg:2025W-PB2-A1-a"])
L.k("al5", "Du kannst Werte gruppieren und Häufigkeiten zählen: je Schlüssel (z. B. Tag des Monats) einen Zähler in einem zweiten Array an der passenden Stelle erhöhen oder je Gruppe einen Wert berechnen.", 3,
    ["katalog:AP2b.04.16", "beleg:2023S-PB2-A2", "beleg:2024W-PB2-A1"])
L.k("al6", "Du kannst einen Algorithmus nach einer Beschreibung vervollständigen, zum Beispiel immer die nächstgelegene noch nicht besuchte Position wählen, bis alle besucht sind.", 3,
    ["katalog:AP2b.04.16", "beleg:2023W-PB2-A2"])

L.sp("sp_erw", "Bestehende Funktionen und Klassen erweitern",
     "Vorhandene Klassen nach einem Klassendiagramm um Methoden erweitern, die andere Methoden und Objekte nutzen, und dabei die vorgegebenen Schnittstellen einhalten. Methoden aus einem Klassendiagramm umsetzen kennst du aus PB1-5.",
     G1, [("AP2b.04.19", "Klassen erweitern; Code nach Fehlern korrigieren in PB2-3, Funktionsobjekte in PB2-2"), ("AP2b.04.16.1", "Methoden in Klassen"), ("AP2b.04.21.1", "HTTP-Antwort im Code")],
     ["2024W-PB2-A2-a", "2024W-PB2-A2-b", "2025S-PB2-A1", "2022W-PB2-A1-b", "2023S-PB2-A3-ab"],
     baut_auf=["PB1-5-1-5", "PB1-7-1-4"], hinweis=HW)
L.k("er1", "Du kannst eine vorhandene Klasse um eine Methode erweitern, die andere Methoden derselben Klasse und Getter anderer Objekte benutzt, zum Beispiel die Auslastung einer Station aus ihren Belegungen berechnen.", 3,
    ["katalog:AP2b.04.19", "beleg:2025S-PB2-A1"])
L.k("er2", "Du kannst eine Methode nach Vorgabe implementieren, die ein Objekt erzeugt, befüllt und zurückgibt, zum Beispiel eine HTTP-Antwort mit Statuscode, Kopfzeilen (Content-Type, Content-Length) und Body.", 3,
    ["katalog:AP2b.04.19", "beleg:2024W-PB2-A2-a"])
L.k("er3", "Du kannst eine private Hilfsmethode schreiben, die aus einer Liste von Objekten die nächsten passenden Einträge ab einem Zeitpunkt ermittelt und die Anzahl begrenzt.", 3,
    ["katalog:AP2b.04.19", "beleg:2024W-PB2-A2-b"])

L.sp("sp_ad", "Abläufe grafisch darstellen: Aktivitätsdiagramm für Algorithmen",
     "Den Ablauf eines Algorithmus oder Programms mit Verzweigungen, Schleifen und Rücksprüngen als Aktivitätsdiagramm zeichnen. Die Notation kennst du aus AP1-8-3-3; Geschäftsprozesse, Sequenz- und Zustandsdiagramme aus PB1-4.",
     G2, ["AP2a.02.02.1", ("AP2b.04.09.4", "Aktivitätsdiagramm für Programmabläufe; Geschäftsprozesse in PB1-4-1-5"), "ANH.uml-aktivitaetsdiagramm", ("AP2b.04.09.5", "Sequenzdiagramm, Notation in PB1-4-1-3"), ("AP2b.04.09.3", "Zustandsdiagramm, Notation in PB1-4-1-4"), "ANH.uml-sequenzdiagramm", "ANH.uml-zustandsdiagramm"],
     ["2021W-PB2-A1-a", "2023S-PB2-A1", "2024S-PB2-A1-a", "2023W-PB2-A1", "2025S-PB2-A2-a", "2025W-PB2-A2"], baut_auf=["AP1-8-3-3", "PB1-4-1-5", "PB1-4-1-3", "PB1-4-1-4"],
     hinweis="Auch PB2 verlangt Diagramme, deren Notation in PB1 steht: Geschäftsprozess als Aktivitätsdiagramm (2023S-PB2-A1, 2024S-PB2-A1-a, PB1-4-1-5), Sequenzdiagramm (2023W-PB2-A1, 2025S-PB2-A2-a, PB1-4-1-3), Zustandsdiagramm (2025W-PB2-A2, PB1-4-1-4). Gelernt wird es dort, geübt mit diesen Aufgaben.")
L.k("ad1", "Du kannst Schleifen und Verzweigungen eines Algorithmus als Aktivitätsdiagramm abbilden: Schleife als Entscheidung mit Rücksprung vor die Prüfung, Verzweigung mit Bedingungen in eckigen Klammern und Zusammenführung.", 3,
    ["katalog:AP2a.02.02.1", "beleg:2021W-PB2-A1-a"])
L.k("ad2", "Du kannst den Ablauf zwischen Benutzer und System mit Schwimmbahnen darstellen, auch mit einer Wiederholung, wenn ein Schritt scheitert (z. B. Termin inzwischen vergeben → erneut suchen).", 3,
    ["katalog:AP2a.02.02.1", "beleg:2021W-PB2-A1-a"])
L.k("ad3", "Du kannst aus einem Aktivitätsdiagramm den Algorithmus ablesen und umgekehrt einen Pseudocode in ein Diagramm übertragen, ohne dass Bedingungen fehlen oder sich überschneiden.", 3,
    ["katalog:AP2a.02.02.1"])
L.grenze("Struktogramm und Programmablaufplan als eigene Darstellungsformen gehören nicht dazu.",
         "Z4: Der Katalog nennt Aktivitätsdiagramm oder Pseudocode (AP2a.02.02.1); das Struktogramm ist laut Katalog-Vorbemerkung gestrichen. Ältere Aufgaben mit Struktogramm zählen für Pseudocode.", ["AP2a.02.02.1"])

L.tb("Zusammenhänge im Code", "Wie die Teile zusammenspielen: zwei Darstellungen desselben Algorithmus vergleichen und eine Lösungsvariante begründet wählen.") if False else None

A = L.a
A("AP2-2-1-3-K5", "angepasst", "ad1", "mit Rücksprung und Zusammenführung")
A("AP2-3-2-1-K1", "angepasst", "fo1", "Signatur wie vorgegeben")
A("AP2-3-2-1-K2", "angepasst", "fo2", "auf das Neue gegenüber AP1 gekürzt (Schachtelung, Indexgrenzen)")
A("AP2-3-2-1-K3", "gestrichen", None, "E2: Variablen, Datentypen und Operatoren stehen in AP1-8-2-1")
A("AP2-3-2-1-K4", "angepasst", "fo4", "vorgegebene Klassen und Getter")
A("AP2-3-2-1-K5", "angepasst", "fo5", "mit festgelegtem Rückgabewert")
A("AP2-3-2-2-K1", "angepasst", "al1", "Ergebnisliste zurückgeben")
A("AP2-3-2-2-K2", "angepasst", "al2", "mit Beispiel aus 2024S")
A("AP2-3-2-2-K3", "angepasst", "al3", "auch kleinste Abweichung (2025W)")
A("AP2-3-2-2-K4", "angepasst", "al4", "Beispiel Tische und Reservierungen")
A("AP2-3-2-2-K5", "angepasst", "al5", "mit Häufigkeiten zusammengefasst")
A("AP2-3-2-2-K6", "angepasst", "al5", "in al5 aufgenommen")
A("AP2-3-3-1-K6", "angepasst", "er1", "mit Getter anderer Objekte")

T = L.themen
T("Pseudocode", P, "Kern", ["fo1", "fo2", "al1"])
T("Prozessanalyse, Aktivitätsdiagramm", P, "Kern", ["ad1", "ad2"])
T("Struktogramm", P, "Außen", ["sp_ad"], "Z4: gestrichen, Aufgaben zählen für Pseudocode")
T("Objektorientierung, Klassendiagramm", P, "Kern", ["er1", "er2"])
T("Sortieralgorithmen, Rekursion, Generische Klassen, Funktionale Programmierung", P, "Ordner", ["PB2-2"])
T("Fehler finden, Schreibtischtest", P, "Ordner", ["PB2-3"])
T("Sequenzdiagramm, Zustandsdiagramm, Relationales Datenmodell, ERM", P, "Ordner", ["PB1"], "wohnen in PB1 (P3); PB2-Prüfungen verlangen sie in der Tiefe von PB1")
T("Dateigrößen berechnen", P, "Ordner", ["AP1"], "AP1-4-2-2")

L.write("/home/claude/AP1_AP2_Tracker/umbau/lernplan/pb2/PB2-1.json", meta(quellen=QUELLEN_PB2,
  hinweis="PB2-Ordner nach dem Muster von PB1 (P33): neue IDs PB2-…, alte AP2-Aussagen, die PB1 für PB2 vermerkt hat, stehen in alt_neu. Inhalte aus AP1 und PB1 werden mit baut_auf importiert (E2).",
  kerntest="Alle Algorithmus-Aufgaben der PB2-Prüfungen gegen die Musterlösungen gelesen (2021W-A2, 2022S-A1, 2023S-A2, 2023W-A2, 2024S-A2-b, 2024W-A1, 2024W-A2, 2025S-A1, 2025W-A1); 2025W ohne Aufgabensatz nur über die Lösung (P34)."))
