import sys; sys.path.insert(0, sys.path[0])
from lp import LP, meta, QUELLEN_PB2
L = LP("PB2-3", "Fehler finden, Debugging und Unit-Tests", "PB2", ["G.PB2.01", "G.PB2.03"])
G1 = ["G.PB2.01"]; G3 = ["G.PB2.03"]; G13 = ["G.PB2.01", "G.PB2.03"]
P = ["podcast:themen-pb2"]

L.tb("Code prüfen und Fehler beheben", "Fremden Code mit Testdaten von Hand durchgehen, Fehler lokalisieren und berichtigen, Debugging-Techniken einsetzen und Code mit Unit-Tests absichern. Schreibtischtest und Fehlerarten kennst du aus AP1.")
L.sp("sp_st", "Schreibtischtest und Fehler im Algorithmus lokalisieren",
     "Einen gegebenen Algorithmus mit Testdaten von Hand ausführen, erwartetes und tatsächliches Ergebnis vergleichen, den Fehler mit Zeilennummer benennen und berichtigen.",
     G1, ["AP2a.03.01.3", ("AP2a.02.01.1", "Fehler finden und beheben")],
     ["2021W-PB2-A1-c", "2022W-PB2-A2-aa", "2022W-PB2-A2-ab", "2023S-PB2-A3-aa", "2023S-PB2-A3-ab", "2025W-PB2-A3-bb"],
     baut_auf=["AP1-8-2-3", "AP1-8-2-4"],
     hinweis="Fehlersuche in einem Struktogramm (2021W-PB2-A1-c) zählt nach Z4 für die Fehlersuche im Algorithmus.")
L.k("st1", "Du kannst über den Schreibtischtest aus AP1 hinaus auch verschachtelte Schleifen und rekursive Aufrufe Schritt für Schritt verfolgen und die Werte der Variablen je Durchlauf festhalten.", 3,
    ["katalog:AP2a.03.01.3", "beleg:2022W-PB2-A2-aa"])
L.k("st2", "Du kannst aus der Beschreibung einer Funktion das erwartete Ergebnis ableiten, es dem tatsächlichen gegenüberstellen und aus den Abweichungen die fehlerhafte Zeile mit Zeilennummer bestimmen.", 3,
    ["katalog:AP2a.03.01.3", "beleg:2025W-PB2-A3-bb", "beleg:2023S-PB2-A3-aa"])
L.k("st3", "Du kannst die fehlerhafte Stelle berichtigt aufschreiben oder den Code so ändern bzw. erweitern, dass die erwartete Ausgabe entsteht.", 3,
    ["katalog:AP2a.02.01.1", "beleg:2023S-PB2-A3-ab", "beleg:2022W-PB2-A2-ab"])
L.k("st4", "Du kannst typische inhaltliche Fehler in Algorithmen erkennen: falscher Startwert (z. B. 0 statt des ersten Elements beim Minimum), Schleife eine Stelle zu kurz oder zu lang, falscher Vergleichsoperator (< statt <=), fehlender Monat oder Fall.", 3,
    ["katalog:AP2a.02.01.1", "beleg:2021W-PB2-A1-c", "beleg:2025W-PB2-A3-bb"])

L.sp("sp_db", "Debugging, Ablaufverfolgung und Fehlerbehandlung",
     "Debugging-Techniken einordnen und einsetzen und festlegen, wie ein Programm auf unerwartete Eingaben reagiert.",
     G1, [("AP2a.02.01.1", "Debugging, Breakpoint"), ("AP2a.03.01.3", "Ablaufverfolgung"), ("AP2b.03.08.2", "print-Debugging, TDD"), ("AP2b.04.17.5", "Fehlerbehandlung bei unerwarteten Eingaben")],
     ["2025S-PB2-A2-bc"], baut_auf=["PB1-5-1-2", "AP1-8-2-4"],
     hinweis="Die Ausnahmebehandlung mit try/catch steht in PB1-5-1-2.")
L.k("db1", "Du kannst erklären, was ein Breakpoint bewirkt (das Programm hält an dieser Stelle, du kannst Variablen ansehen und Schritt für Schritt weitergehen) und wann Debugging mit dem Debugger sinnvoll ist.", 2,
    ["katalog:AP2a.02.01.1"])
L.k("db2", "Du kannst Ablaufverfolgung und print-Debugging erklären: den Weg des Programms und die Werte der Variablen Schritt für Schritt nachvollziehen bzw. Zwischenwerte gezielt ausgeben lassen.", 2,
    ["katalog:AP2a.03.01.3", "katalog:AP2b.03.08.2"])
L.k("db3", "Du kannst Test Driven Development erklären: erst einen fehlschlagenden Test schreiben, dann gerade so viel Code, dass er besteht, dann aufräumen (Red, Green, Refactor).", 2,
    ["katalog:AP2b.03.08.2"])
L.k("db4", "Du kannst für eine unerwartete Eingabe (z. B. leer, nur Leerzeichen, null) eine geeignete Reaktion festlegen: Eingabe bereinigen und prüfen, dem Benutzer eine verständliche Meldung geben oder eine Ausnahme auslösen, und in gegebenem Code erkennen, bei welchen Eingaben eine Ausnahme ausgelöst wird.", 3,
    ["katalog:AP2b.04.17.5", "beleg:2025S-PB2-A2-bc"])

L.sp("sp_ut", "Unit-Tests und Regressionstests",
     "Zweck und Eigenschaften von Unit-Tests kennen, einen Unit-Test gegen den Code prüfen und Regressionstests einordnen.",
     G3, [("AP2b.03.08.2", "Unit-Test, Regressionstest"), ("AP2a.02.01.1", "Code anpassen, bis der Test besteht")],
     ["2022S-PB2-A2-aa", "2022S-PB2-A2-ab", "2022S-PB2-A2-ba", "2022S-PB2-A2-bb", "2024S-PB2-A3-ab", "2025W-PB2-A3-aa"],
     baut_auf=["PB1-9-1-4"],
     hinweis="Was ein Unit-Test im Rahmen der Teststufen ist, steht in PB1-9-1-4; hier geht es um das Schreiben und Prüfen.")
L.k("ut1", "Du kannst beschreiben, was ein Unit-Test ist und wozu er dient: eine einzelne Einheit (Methode, Klasse) wird automatisch mit festgelegten Eingaben und erwarteten Ergebnissen geprüft (assertEquals), damit Fehler früh auffallen.", 2,
    ["katalog:AP2b.03.08.2", "beleg:2022S-PB2-A2-aa"])
L.k("ut2", "Du kannst Eigenschaften guter Unit-Tests beschreiben: unabhängig von anderen Tests und äußeren Systemen, wiederholbar mit gleichem Ergebnis, schnell, automatisch und mit eindeutigem Ergebnis.", 2,
    ["katalog:AP2b.03.08.2", "beleg:2022S-PB2-A2-ab"])
L.k("ut3", "Du kannst einen gegebenen Unit-Test gegen den Code überprüfen: je Testfall das tatsächliche Ergebnis bestimmen, eintragen, ob er besteht, und den Code so anpassen, dass alle Testfälle bestehen.", 4,
    ["katalog:AP2b.03.08.2", "katalog:AP2a.02.01.1", "beleg:2022S-PB2-A2-ba", "beleg:2022S-PB2-A2-bb"])
L.k("ut4", "Du kannst den Zweck von Regressionstests erläutern: Nach jeder Änderung werden die vorhandenen Tests erneut ausgeführt, damit bereits funktionierende Teile nicht unbemerkt kaputtgehen.", 2,
    ["katalog:AP2b.03.08.2", "beleg:2024S-PB2-A3-ab"])

A = L.a
A("AP2-3-3-3-K2", "angepasst", "db4", "mit geeigneter Reaktion auf unerwartete Eingaben")
A("AP2-5-2-3-K1", "angepasst", "st1", "über AP1 hinaus: Verschachtelung und Rekursion")
A("AP2-5-2-3-K2", "angepasst", "st2", "mit Zeilennummer")
A("AP2-5-2-3-K3", "angepasst", "st2", "in st2 aufgenommen")
A("AP2-5-2-3-K4", "angepasst", "st3", "berichtigen oder ergänzen")
A("AP2-5-2-3-K5", "angepasst", "st4", "mit Beispielen aus den Prüfungen")
A("AP2-5-3-1-K1", "angepasst", "db1", "erklären (Katalog)")
A("AP2-5-3-1-K2", "angepasst", "db2", "mit print-Debugging zusammengefasst")
A("AP2-5-3-1-K3", "angepasst", "db2", "in db2 aufgenommen")
A("AP2-5-3-1-K4", "angepasst", "db3", "Red, Green, Refactor")
A("AP2-5-3-1-K5", "gestrichen", None, "E2: formale und inhaltliche Fehler unterscheiden steht in AP1-8-2-4")

T = L.themen
T("Fehler finden, Schreibtischtest", P, "Kern", ["st1", "st2", "st3"])
T("Unit-Tests", P, "Kern", ["ut1", "ut2", "ut3"])
T("Regressionstests", P, "Kern", ["ut4"])
T("Fehlerbehandlung", P, "Kern", ["db4"])
T("Code Coverage, Äquivalenzklassen, Testverfahren, Black-Box-Test, White-Box-Test", P, "Ordner", ["PB2-4"])

L.write("/home/claude/AP1_AP2_Tracker/umbau/lernplan/pb2/PB2-3.json", meta(quellen=QUELLEN_PB2,
  hinweis="PB2-Ordner (P33).",
  kerntest="Schreibtischtests und Fehlersuche (2021W-A1-c, 2022W-A2-a, 2023S-A3-a, 2025W-A3-b), Unit-Tests (2022S-A2, 2024S-A3-ab, 2025W-A3-aa) und 2025S-A2-bc gegen die Musterlösungen gelesen."))
