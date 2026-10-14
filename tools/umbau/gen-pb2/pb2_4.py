import sys; sys.path.insert(0, sys.path[0])
from lp import LP, meta, QUELLEN_PB2
L = LP("PB2-4", "Testszenarien und Testdaten", "PB2", ["G.PB2.03"])
G3 = ["G.PB2.03"]
P = ["podcast:themen-pb2"]

L.tb("Testszenarien auswählen und Testdaten generieren", "Messen, wie gründlich Tests den Code durchlaufen, das passende Testverfahren auswählen, Kriterien für bestandene Tests festlegen und Testdaten systematisch bilden. Black-Box- und White-Box-Test, Teststufen und Testprozess kennst du aus PB1-9.")
L.sp("sp_cov", "Testabdeckung: Anweisungs-, Zweig- und Pfadüberdeckung",
     "Die Überdeckungsmaße des White-Box-Tests erläutern, voneinander abgrenzen und für einen Code die nötigen Testfälle bestimmen.",
     G3, [("AP2b.03.08.2", "Überdeckungsmaße"), ("AP2b.05.03.2.3", "Testdaten für eine Überdeckung"), ("AP2a.02.01.2", "White-Box-Test")],
     ["2022W-PB2-A2-ac", "2023S-PB2-A3-ba", "2023S-PB2-A3-bb", "2024S-PB2-A3-b", "2024S-PB2-A3-c", "2025W-PB2-A3-ab"],
     baut_auf=["PB1-9-1-3"])
L.k("cv1", "Du kannst Testabdeckung (Code Coverage) erläutern: der Anteil des Codes, der von den Testfällen ausgeführt wird, meist in Prozent angegeben.", 2,
    ["katalog:AP2b.03.08.2", "beleg:2025W-PB2-A3-ab"])
L.k("cv2", "Du kannst Anweisungs-, Zweig- und Pfadüberdeckung erläutern: jede Anweisung mindestens einmal ausgeführt; jede Verzweigung in jede Richtung mindestens einmal durchlaufen; jeder mögliche Weg vom Anfang bis zum Ende durchlaufen. Die englischen Begriffe (statement, branch, path coverage) sind meist vorgegeben.", 2,
    ["katalog:AP2b.03.08.2", "beleg:2023S-PB2-A3-ba", "beleg:2024S-PB2-A3-b"], vorgegeben="englischer Text zu den Überdeckungsmaßen (2024S)")
L.k("cv3", "Du kannst erklären, wie die Maße aufeinander aufbauen: Pfadüberdeckung schließt Zweigüberdeckung ein, Zweigüberdeckung schließt Anweisungsüberdeckung ein – aber nicht umgekehrt.", 2,
    ["katalog:AP2b.03.08.2", "beleg:2024S-PB2-A3-b"])
L.k("cv4", "Du kannst für einen gegebenen Code die Anweisungen nennen, die mit vorgegebenen Testdaten nicht durchlaufen werden, und die Mindestzahl an Testfällen für Anweisungs- oder Zweigüberdeckung bestimmen.", 3,
    ["katalog:AP2b.05.03.2.3", "beleg:2022W-PB2-A2-ac", "beleg:2023S-PB2-A3-bb"])
L.k("cv5", "Du kannst für einen kurzen Code mit verschachtelten Verzweigungen die Testfälle (Eingaben und durchlaufener Weg) für eine verlangte Überdeckung notieren.", 3,
    ["katalog:AP2b.05.03.2.3", "beleg:2024S-PB2-A3-c"])

L.sp("sp_wahl", "Testverfahren auswählen und Bestehenskriterien festlegen",
     "Für eine Situation das passende Testverfahren und Überdeckungsmaß auswählen und begründen und festlegen, wann ein Test als bestanden gilt.",
     G3, ["AP2b.05.03.2.1", "AP2b.05.03.2.2", ("AP2b.03.08.1", "Black-Box/White-Box im Vergleich"), ("AP2a.02.01.2", "Vorteile des White-Box-Tests")],
     ["2025S-PB2-A2-ba", "2025S-PB2-A2-bb", "2024S-PB2-A3-aa", "2025W-PB2-A3-ba"],
     baut_auf=["PB1-9-1-3"],
     hinweis="Was Black-Box- und White-Box-Test sind, steht in PB1-9-1-3 (2025S-PB2-A2-bb, 2024S-PB2-A3-aa).")
L.k("wa1", "Du kannst für eine Situation ein passendes Testverfahren auswählen und die Wahl begründen, zum Beispiel White-Box-Test mit Zweigüberdeckung für eine Methode mit vielen Verzweigungen, Black-Box-Test mit Äquivalenzklassen für eine Schnittstelle ohne Codezugang.", 4,
    ["katalog:AP2b.05.03.2.1", "beleg:2025S-PB2-A2-ba"])
L.k("wa2", "Du kannst ein Überdeckungsmaß für eine Vorgabe des Projektleiters nennen und begründen, zum Beispiel Zweigüberdeckung, weil sie anders als die Anweisungsüberdeckung auch leere Else-Zweige prüft, aber anders als die Pfadüberdeckung noch bezahlbar bleibt.", 4,
    ["katalog:AP2b.05.03.2.1", "beleg:2025S-PB2-A2-ba"])
L.k("wa3", "Du kannst Kriterien für Testergebnisse definieren: zu jedem Testfall das erwartete Ergebnis vorab festlegen; bestanden ist der Test, wenn das tatsächliche Ergebnis genau übereinstimmt, auch eine erwartete Fehlermeldung oder Ausnahme.", 2,
    ["katalog:AP2b.05.03.2.2", "beleg:2025W-PB2-A3-ba"])

L.sp("sp_td", "Testdaten auswählen und generieren: Äquivalenzklassen, Grenzwerte, Sonderfälle",
     "Testdaten systematisch bilden, die Normalfall, Grenzen, ungültige Eingaben und Sonderfälle abdecken, und wissen, wozu Testdatengeneratoren dienen.",
     G3, ["AP2b.05.03.2.3", "AP2a.02.01.3", "AP2a.03.02.3"],
     ["2022S-PB2-A2-bc", "2023S-PB2-A3-bc", "2025W-PB2-A3-ba"], baut_auf=["PB1-9-1-3"],
     hinweis="Den Extremwertetest erklären steht in PB1-9-1-3; hier wird er beim Bilden der Testdaten angewendet.")
L.k("td1", "Du kannst Äquivalenzklassen bilden: Eingaben, die die Funktion gleich behandelt, in Klassen einteilen (gültige und ungültige) und je Klasse einen Vertreter testen, zum Beispiel Testdaten aus zwei weiteren Klassen, für die −1 erwartet wird.", 3,
    ["katalog:AP2b.05.03.2.3", "beleg:2022S-PB2-A2-bc"])
L.k("td2", "Du kannst für eine Funktion Testdaten auswählen, die den Normalfall, die Grenzwerte (knapp innerhalb und außerhalb) und ungültige Eingaben abdecken, und die Auswahl begründen.", 4,
    ["katalog:AP2b.05.03.2.3", "katalog:AP2a.02.01.3", "beleg:2023S-PB2-A3-bc"])
L.k("td3", "Du kannst Sonderfälle als Testdaten angeben, die oft vergessen werden: leere Eingabe oder leeres Array, null, nur ein Element, nur negative Werte, das gesuchte Element an erster oder letzter Stelle.", 3,
    ["katalog:AP2a.02.01.3", "beleg:2025W-PB2-A3-ba"])
L.k("td4", "Du kannst Testdaten so anpassen, dass alle Anweisungen bzw. Zweige durchlaufen werden, und die Änderung begründen.", 4,
    ["katalog:AP2b.05.03.2.3", "beleg:2023S-PB2-A3-bc"])
L.k("td5", "Du kannst Testdaten mit erwartetem Ergebnis in einer Tabelle festhalten und nach dem Test das tatsächliche Ergebnis eintragen.", 3,
    ["katalog:AP2a.02.01.3", "beleg:2025W-PB2-A3-ba"])
L.k("td6", "Du kannst Testdatengeneratoren einsetzen: große Mengen passender, auch zufälliger oder grenznaher Testdaten nach festgelegten Regeln (Wertebereich, Format, Verteilung) automatisch erzeugen lassen, statt echte personenbezogene Daten zu verwenden.", 3,
    ["katalog:AP2a.03.02.3"])

A = L.a
A("AP2-1-2-3-K4", "angepasst", "cv2", "englische Begriffe vorgegeben (2024S)")
A("AP2-5-1-1-K5", "angepasst", "wa1", "mit Beispielen")
A("AP2-5-2-1-K1", "angepasst", "td2", "mit Begründung (auswählen, Katalog Stufe 4)")
A("AP2-5-2-1-K2", "gestrichen", None, "E2: Extremwertetest erklären steht in PB1-9-1-3-K4; Anwendung in td2")
A("AP2-5-2-1-K3", "angepasst", "td3", "mit typischen Sonderfällen")
A("AP2-5-2-1-K4", "angepasst", "td6", "ohne echte personenbezogene Daten")
A("AP2-5-2-1-K5", "angepasst", "td1", "mit Beispiel 2022S")
A("AP2-5-2-2-K1", "angepasst", "cv1", "erläutern")
A("AP2-5-2-2-K2", "angepasst", "cv2", "drei Maße in einer Aussage")
A("AP2-5-2-2-K3", "angepasst", "cv2", "in cv2 aufgenommen")
A("AP2-5-2-2-K4", "angepasst", "cv2", "in cv2 aufgenommen")
A("AP2-5-2-2-K5", "angepasst", "cv3", "Aufbau der Maße")
A("AP2-5-2-2-K6", "angepasst", "cv5", "Testfälle für eine Überdeckung notieren (2024S)")
A("AP2-5-2-4-K2", "angepasst", "wa3", "Kriterien für Testergebnisse definieren (Katalog)")

T = L.themen
T("Code Coverage", P, "Kern", ["cv1", "cv2", "cv4"])
T("Äquivalenzklassen", P, "Kern", ["td1"])
T("Testverfahren", P, "Kern", ["wa1", "wa2"])
T("Black-Box-Test, White-Box-Test", P, "Ordner", ["PB1-9"], "Begriffe in PB1-9-1-3; Auswahl hier")
T("Unit-Tests, Regressionstests, Schreibtischtest", P, "Ordner", ["PB2-3"])

L.write("/home/claude/AP1_AP2_Tracker/umbau/lernplan/pb2/PB2-4.json", meta(quellen=QUELLEN_PB2,
  hinweis="PB2-Ordner (P33). Überdeckungsmaße wohnen in PB2 (P3: AP2b.03.08.2, AP2b.05.03.2.1–3).",
  kerntest="2022W-A2-ac, 2023S-A3-b, 2024S-A3, 2025S-A2-b, 2022S-A2-bc, 2025W-A3 gegen die Musterlösungen gelesen."))
