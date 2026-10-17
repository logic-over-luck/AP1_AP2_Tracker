import sys; sys.path.insert(0, sys.path[0])
from lp import LP, meta, QUELLEN_PB2
L = LP("PB2-2", "Suchen, Sortieren, Rekursion und Generik", "PB2", ["G.PB2.01", "G.PB2.02"])
G1 = ["G.PB2.01"]; G12 = ["G.PB2.01", "G.PB2.02"]
P = ["podcast:themen-pb2"]

L.tb("Suchen, Sortieren und weiterführende Techniken", "Die klassischen Such- und Sortierverfahren kennen und schreiben, Rekursion und Iteration vergleichen und Algorithmen mit generischen Klassen und übergebenen Vergleichsfunktionen flexibel machen.")
L.sp("sp_su", "Suchen: lineare und binäre Suche",
     "Die lineare Suche schreiben und die binäre Suche erklären, einschließlich ihrer Voraussetzung.",
     G12, ["AP2b.04.18", "AP2b.04.18.1", "AP2b.04.18.2"], ["2025W-PB2-A1-b"], baut_auf=["PB2-1-1-2"] if False else None,
     hinweis="Die Minimumsuche aus 2025W-PB2-A1-b ist eine lineare Suche (Muster in PB2-1-1-2).")
L.k("su1", "Du kannst die lineare Suche schreiben: die Elemente der Reihe nach mit dem Gesuchten vergleichen und beim ersten Treffer das Element oder seinen Index zurückgeben, sonst einen festgelegten Wert wie −1 oder null.", 3,
    ["katalog:AP2b.04.18.1", "beleg:2025W-PB2-A1-b"])
L.k("su2", "Du kannst die binäre Suche beschreiben: in einer sortierten Folge das mittlere Element prüfen und die Hälfte verwerfen, in der das Gesuchte nicht liegen kann, bis es gefunden ist oder der Bereich leer ist.", 2,
    ["katalog:AP2b.04.18.2"])
L.k("su3", "Du kannst lineare und binäre Suche vergleichen: Die binäre Suche funktioniert nur auf sortierten Daten, braucht dafür aber bei n Elementen höchstens etwa log₂(n) Vergleiche statt bis zu n.", 2,
    ["katalog:AP2b.04.18", "katalog:AP2b.04.18.1", "katalog:AP2b.04.18.2"])

L.sp("sp_so", "Sortieren: Bubble Sort, Selection Sort, Insertion Sort",
     "Einen elementaren Sortieralgorithmus in Pseudocode schreiben, auch für Objekte nach einem Attribut, und die drei Verfahren am Vorgehen unterscheiden.",
     G12, ["AP2b.04.18.3", ("AP2b.04.16.1", "Sortieren in Pseudocode")], ["2022W-PB2-A1-a", "2024S-PB2-A2-a"])
L.k("so1", "Du kannst einen Sortieralgorithmus deiner Wahl in Pseudocode schreiben und benennen, zum Beispiel Bubble Sort mit zwei verschachtelten Schleifen, auch für ein Array von Objekten, die nach einem Attribut sortiert werden.", 3,
    ["katalog:AP2b.04.18.3", "beleg:2022W-PB2-A1-a"])
L.k("so2", "Du kannst Bubble Sort (benachbarte Elemente vertauschen, bis nichts mehr getauscht wird), Selection Sort (jeweils das kleinste restliche Element nach vorn holen) und Insertion Sort (jedes Element in den bereits sortierten Teil einfügen) am Vorgehen unterscheiden.", 2,
    ["katalog:AP2b.04.18.3"])
L.k("so3", "Du kannst zwei Elemente über eine Hilfsvariable tauschen und statt eines festen Vergleichs eine vorgegebene Vergleichsfunktion einsetzen, die einen negativen Wert, null oder einen positiven Wert liefert.", 3,
    ["katalog:AP2b.04.18.3", "beleg:2024S-PB2-A2-a"])

L.sp("sp_re", "Rekursion und Iteration",
     "Rekursive Algorithmen nachvollziehen, mit iterativen vergleichen und in eine iterative Lösung umschreiben.",
     G12, ["ZB.rekursion", ("AP2b.04.16.1", "rekursiv und iterativ")], ["2022W-PB2-A2-b", "2022W-PB2-A2-c"],
     hinweis="Den Schreibtischtest eines rekursiven Algorithmus (2022W-PB2-A2-aa) übst du in PB2-3.")
L.k("re1", "Du kannst Rekursion erklären: Eine Funktion ruft sich selbst mit einem kleineren Teilproblem auf, bis eine Abbruchbedingung erreicht ist; ohne Abbruchbedingung läuft sie endlos bis zum Speicherüberlauf.", 2,
    ["beleg:2022W-PB2-A2-b"])
L.k("re2", "Du kannst je einen Vor- und Nachteil der rekursiven gegenüber einer iterativen Lösung beschreiben: oft kürzer und näher an der Problembeschreibung, aber mehr Speicher für die Aufrufe und langsamer.", 2,
    ["beleg:2022W-PB2-A2-b"])
L.k("re3", "Du kannst einen rekursiven Algorithmus iterativ umsetzen: die Selbstaufrufe durch eine Schleife ersetzen und Zwischenergebnisse in Variablen oder einer Liste halten.", 3,
    ["beleg:2022W-PB2-A2-c"])

L.sp("sp_ge", "Generische Klassen und Funktionsobjekte",
     "Generische Klassen erklären und Algorithmen flexibel machen, indem eine Vergleichsfunktion als Parameter übergeben wird.",
     G1, ["ZB.generik-funktionsobjekte", ("AP2b.04.19", "Sortierfunktion mit Funktionsobjekt"), ("AP2b.04.16.1", "Vergleichsfunktion")],
     ["2022W-PB2-A1-b", "2022W-PB2-A1-c", "2022W-PB2-A1-d", "2024S-PB2-A2-a"], baut_auf=["PB1-5-1-1"])
L.k("ge1", "Du kannst den Begriff generische Klasse erläutern: Die Klasse wird mit einem Typparameter geschrieben (z. B. List<T>) und erst bei der Verwendung für einen bestimmten Typ festgelegt, sodass derselbe Code für verschiedene Datentypen typsicher funktioniert.", 2,
    ["beleg:2022W-PB2-A1-c"])
L.k("ge2", "Du kannst eine Vergleichsfunktion für zwei Objekte schreiben, die 0 bei Gleichheit, einen positiven Wert, wenn das erste größer ist, und sonst einen negativen Wert liefert.", 3,
    ["katalog:AP2b.04.16.1", "beleg:2022W-PB2-A1-b"])
L.k("ge3", "Du kannst einen Sortieralgorithmus so umschreiben, dass er ein übergebenes Funktionsobjekt zum Vergleichen aufruft, und damit dieselbe Sortierfunktion für verschiedene Kriterien nutzen (z. B. Kurs, Datum).", 3,
    ["katalog:AP2b.04.19", "beleg:2022W-PB2-A1-d", "beleg:2024S-PB2-A2-a"])

A = L.a
A("AP2-3-2-3-K1", "angepasst", "su1", "mit Rückgabewert bei Misserfolg")
A("AP2-3-2-3-K2", "angepasst", "su2", "beschreiben (Katalog: kennen); schreiben ist keine Pflicht")
A("AP2-3-2-3-K3", "angepasst", "so1", "auch für Objekte")
A("AP2-3-2-3-K4", "angepasst", "so2", "mit Vorgehen je Verfahren")
A("AP2-3-2-3-K5", "angepasst", "so3", "Vergleichsfunktion mit Vorzeichen")
A("AP2-3-2-3-K6", "angepasst", "su3", "mit Vergleich der Laufzeit")

T = L.themen
P_ = P
T("Sortieralgorithmen", P_, "Kern", ["so1", "so2"])
T("Rekursion", P_, "Kern", ["re1", "re2", "re3"])
T("Generische Klassen, Funktionale Programmierung", P_, "Kern", ["ge1", "ge3"], "„Funktionale Programmierung“ meint in 2022W die übergebene Vergleichsfunktion")
T("Pseudocode", P_, "Ordner", ["PB2-1"])

L.write("/home/claude/AP1_AP2_Tracker/umbau/lernplan/pb2/PB2-2.json", meta(quellen=QUELLEN_PB2,
  hinweis="PB2-Ordner (P33). Rekursion und Generik sind Zusatzbausteine (Belege 2022W-PB2, 2024S-PB2).",
  kerntest="2022W-PB2-A1 (Sortieren, Vergleichsfunktion, Generik), 2022W-PB2-A2-b/-c (Rekursion), 2024S-PB2-A2-a, 2025W-PB2-A1-b gegen die Musterlösungen gelesen."))
