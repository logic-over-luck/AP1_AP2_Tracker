import json, sys, os
Z = {}
def t(i, bs, typ, thema, **kw):
    p = i.split('-A')[0]
    Z.setdefault(p, {})[i] = {"bausteine": bs, "typ": typ, "thema": thema, **kw}
SQL = "ANH.sql-syntax-auszug"
S = "Struktogramm als Darstellungsform gestrichen (Katalog-Vorbemerkung, Z4); die Teilaufgabe zählt für Pseudocode bzw. Fehlersuche im Algorithmus"
W = "P34: Aufgabensatz fehlt, nur Lösungshinweis; belegt das Thema, die Tiefe kommt aus dem Katalog"
AD = "ANH.uml-aktivitaetsdiagramm"
# ---------- 2021W ----------
t("2021W-PB2-A1-a", ["AP2a.02.02.1","AP2b.04.09.4",AD], "diagramm", "Ablauf einer Terminreservierung mit Schwimmbahnen, Verzweigung und Rücksprung als Aktivitätsdiagramm")
t("2021W-PB2-A1-b", ["AP2b.05.02.3"], "begruenden", "Variante wählen: gleichzeitige Zugriffe, Termin blockieren")
t("2021W-PB2-A1-c", ["AP2a.03.01.3","AP2a.02.01.1","AP1.04.07.4"], "code_lesen", "drei Fehler in einem Algorithmus zur Passwortprüfung finden und korrigieren", hinweis=S)
t("2021W-PB2-A4-a", ["AP2b.04.22.1","AP2a.02.03.7",SQL], "code_schreiben", "CREATE TABLE mit Primärschlüssel")
t("2021W-PB2-A4-b", ["AP2b.04.22.4","AP2b.04.22.5","AP2a.02.03.7"], "code_schreiben", "SELECT mit WHERE")
t("2021W-PB2-A4-c", ["AP2b.04.22.3","AP2b.04.22.5","AP2b.04.22.9"], "code_schreiben", "UPDATE mit Unterabfrage, Preis um 5 % erhöhen")
t("2021W-PB2-A4-d", ["AP2b.04.22.7","AP2b.04.22.8","AP2b.04.22.10","AP2a.02.03.10"], "code_schreiben", "Join, GROUP BY, HAVING COUNT")
t("2021W-PB2-A4-e", ["AP2b.04.22.8","AP2b.04.22.9","AP2b.04.22.6","AP2a.02.03.8"], "code_schreiben", "Join über vier Tabellen, OR-Bedingung, ORDER BY mehrstufig")
t("2021W-PB2-A2", ["AP2b.04.16","AP2b.04.16.1","AP2b.03.05"], "code_schreiben", "Funktion: Termin in zweidimensionalem Array prüfen")
t("2021W-PB2-A3", ["AP2b.04.10.2","AP2a.02.03.4"], "diagramm", "relationales Modell erweitern und normalisieren, Schlüssel kennzeichnen")
# ---------- 2022S ----------
t("2022S-PB2-A2-aa", ["AP2b.03.08.2"], "erklaeren", "Unit-Test: was und wozu")
t("2022S-PB2-A2-ab", ["AP2b.03.08.2"], "erklaeren", "zwei Eigenschaften eines Unit-Tests")
t("2022S-PB2-A2-ba", ["AP2b.03.08.2","AP2a.03.01.3"], "code_lesen", "Unit-Test gegen Methode prüfen, Ergebnisse eintragen")
t("2022S-PB2-A2-bb", ["AP2a.02.01.1","AP2b.04.19"], "code_schreiben", "Quellcode korrigieren, damit der Unit-Test besteht")
t("2022S-PB2-A2-bc", ["AP2b.05.03.2.3","AP2a.02.01.3"], "aufzaehlen", "Testdaten aus zwei weiteren Äquivalenzklassen")
t("2022S-PB2-A4-aa", ["ZB.prozedur-trigger"], "erklaeren", "Stored Procedure beschreiben")
t("2022S-PB2-A4-ab", ["ZB.prozedur-trigger"], "erklaeren", "Trigger beschreiben")
t("2022S-PB2-A4-ac", ["AP2b.04.22.2"], "erklaeren", "Zweck eines Index")
t("2022S-PB2-A4-ba", ["AP2b.04.22.2",SQL], "code_schreiben", "CREATE INDEX")
t("2022S-PB2-A4-bb", ["AP2b.04.22.3","AP2b.04.22.5"], "code_schreiben", "DELETE mit Unterabfrage (Haushalte ohne Zähler)")
t("2022S-PB2-A4-bc", ["AP2b.04.22.7","AP2b.04.22.10","AP2b.04.22.6","AP2b.04.22.8"], "code_schreiben", "Anzahl Zähler je Haushalt, Join, GROUP BY, ORDER BY")
t("2022S-PB2-A4-bd", ["AP2b.04.22.8","AP2b.04.22.9","AP2b.04.22.6"], "code_schreiben", "Verbrauch zwischen zwei Ablesungen (Tabelle zweimal verknüpft)")
t("2022S-PB2-A1", ["AP2b.04.16","AP2b.04.16.1","AP2b.03.05"], "code_schreiben", "Algorithmus: Verbräuche aus zweidimensionalem Array auswerten")
t("2022S-PB2-A3", ["AP2b.04.10.2","AP2a.02.03.4","AP2a.02.03.5"], "diagramm", "relationales Modell zur Tarifübersicht in 3. Normalform")
# ---------- 2022W ----------
t("2022W-PB2-A1-a", ["AP2b.04.18.3","AP2b.04.16.1","AP2b.04.16"], "code_schreiben", "Array von Objekten sortieren (Bubble Sort o. a.)")
t("2022W-PB2-A1-b", ["AP2b.04.16.1","AP2b.04.19"], "code_schreiben", "Vergleichsfunktion (0, positiv, negativ) erstellen")
t("2022W-PB2-A1-c", ["ZB.generik-funktionsobjekte"], "erklaeren", "Begriff generische Klasse")
t("2022W-PB2-A1-d", ["ZB.generik-funktionsobjekte","AP2b.04.19","AP2b.04.18.3"], "code_schreiben", "Sortieralgorithmus mit Function-Objekt aktualisieren")
t("2022W-PB2-A2-aa", ["AP2a.03.01.3","AP1.04.07.5"], "code_lesen", "Schreibtischtest eines rekursiven Algorithmus")
t("2022W-PB2-A2-ab", ["AP2a.02.01.1"], "erklaeren", "Fehler und Korrektur beschreiben")
t("2022W-PB2-A2-ac", ["AP2b.03.08.2","AP2b.05.03.2.3","AP2a.02.01.2"], "berechnen", "Anweisungsüberdeckung erklären, Mindestzahl Testfälle")
t("2022W-PB2-A2-b", ["ZB.rekursion"], "erklaeren", "Vor- und Nachteil rekursiv gegenüber iterativ")
t("2022W-PB2-A2-c", ["ZB.rekursion","AP2b.04.16.1"], "code_schreiben", "rekursiven Algorithmus iterativ umsetzen")
t("2022W-PB2-A3-a", ["AP2b.04.10.1","AP2a.02.03.5"], "diagramm", "ER-Modell um Entitätstypen und Kardinalitäten erweitern")
t("2022W-PB2-A3-b", ["AP2b.04.10.2","AP2a.02.03.4"], "diagramm", "ER-Modell in relationales Modell 3. NF überführen")
t("2022W-PB2-A3-c", ["AP2a.02.03.2"], "zuordnen", "sinnvolle Datentypen festlegen")
t("2022W-PB2-A4-a", ["AP2b.04.22.8","AP2b.04.22.10","AP2b.04.22.7","AP2b.04.22.9"], "code_schreiben", "Join mit SUM und COUNT je Mitarbeiter, Jahr 2022")
t("2022W-PB2-A4-b", ["AP2b.04.22.3","AP2b.04.22.5","AP2b.05.02.3"], "code_schreiben", "Datensätze ins Archiv verschieben (INSERT … SELECT, DELETE)")
t("2022W-PB2-A4-c", ["AP2b.04.22.9","AP2b.04.22.4"], "code_schreiben", "LIKE bzw. Teilzeichenkette in WHERE")
# ---------- 2023S ----------
t("2023S-PB2-A3-aa", ["AP2a.02.01.1","AP2a.03.01.3"], "code_lesen", "zwei Fehler im Code nennen")
t("2023S-PB2-A3-ab", ["AP2a.02.01.1","AP2b.04.19"], "code_schreiben", "Code so ändern, dass die erwartete Ausgabe entsteht")
t("2023S-PB2-A3-ba", ["AP2b.03.08.2","AP2a.02.01.2"], "erklaeren", "Anweisungsüberdeckung erläutern")
t("2023S-PB2-A3-bb", ["AP2a.03.01.3","AP2b.03.08.2"], "code_lesen", "nicht durchlaufene Anweisungen nennen")
t("2023S-PB2-A3-bc", ["AP2b.05.03.2.3","AP2a.02.01.3"], "begruenden", "Testdaten für volle Anweisungsüberdeckung anpassen")
t("2023S-PB2-A4-a", ["AP2b.04.22.10","AP2b.04.22.9"], "code_schreiben", "COUNT mit Bedingungen")
t("2023S-PB2-A4-b", ["AP2b.04.22.8","AP2b.04.22.9","AP2b.04.22.6"], "code_schreiben", "Join, Datumsbereich, Wochentag, ORDER BY")
t("2023S-PB2-A4-c", ["AP2b.04.22.10","AP2b.04.22.7","AP2b.04.22.8"], "code_schreiben", "Durchschnitt je Mitarbeiter (auch 0)")
t("2023S-PB2-A4-d", ["AP2a.02.03.7",SQL], "code_schreiben", "CREATE USER und GRANT")
t("2023S-PB2-A1", ["AP2b.04.09.4",AD], "diagramm", "Geschäftsprozess als Aktivitätsdiagramm vervollständigen")
t("2023S-PB2-A2", ["AP2b.04.16","AP2b.04.16.1","AP2b.03.05"], "code_schreiben", "Algorithmus: Besucherzahlen je Tag eines Monats auswerten")
# ---------- 2023W ----------
t("2023W-PB2-A3-a", ["AP2b.04.10.2","AP2a.02.03.4","AP2a.02.03.5"], "diagramm", "relationales Modell Messstellen/Messgeräte erstellen")
t("2023W-PB2-A3-b", ["AP1.03.03.4.1","ZB.datendarstellung","ANH.praefixe"], "berechnen", "Speicherbedarf unkomprimierter Bilder berechnen")
t("2023W-PB2-A4-a", ["AP2b.04.22.4","AP2b.04.22.9"], "code_schreiben", "SELECT mit Bereichsbedingung")
t("2023W-PB2-A4-b", ["AP2b.04.22.10","AP2b.04.22.7","AP2b.04.22.6"], "code_schreiben", "MIN, MAX, COUNT je Jahrgang, sortiert")
t("2023W-PB2-A4-c", ["AP2b.04.22.3","AP2b.04.22.5","AP2b.04.22.9"], "code_schreiben", "UPDATE mit Bedingung über verknüpfte Tabellen")
t("2023W-PB2-A4-d", ["AP2b.04.22.10","AP2b.04.22.7","AP2b.04.22.8"], "code_schreiben", "durchschnittlicher Umsatz je Kunde")
t("2023W-PB2-A1", ["AP2b.04.09.5","ANH.uml-sequenzdiagramm"], "diagramm", "Sequenzdiagramm mit Alternativen erstellen")
t("2023W-PB2-A2", ["AP2b.04.16","AP2b.04.16.1","AP2b.03.05","AP2b.04.19"], "code_schreiben", "Algorithmus nächster Nachbar vervollständigen")
# ---------- 2024S ----------
t("2024S-PB2-A1-a", ["AP2b.04.09.4",AD], "diagramm", "Einladungsvorgang als Aktivitätsdiagramm ergänzen (parallel, Verzweigung)")
t("2024S-PB2-A1-ba", ["AP2a.04.04.9"], "erklaeren", "Sicherheitsrisiko: Dokumente aus externen Quellen öffnen")
t("2024S-PB2-A1-bb", ["AP2a.04.04.9"], "erklaeren", "sicherere Alternative erläutern")
t("2024S-PB2-A1-ca", ["AP2a.04.02.3"], "erklaeren", "Schwachstelle: E-Mail-Link kann in falsche Hände gelangen")
t("2024S-PB2-A1-cb", ["AP2a.04.02.3","AP2b.05.01.2"], "erklaeren", "Vorgehen mit mehr Sicherheit (z. B. zweiter Faktor)")
t("2024S-PB2-A2-a", ["AP2b.04.18.3","ZB.generik-funktionsobjekte","AP2b.04.16.1"], "code_schreiben", "Sortierfunktion mit Vergleichsfunktion als Parameter")
t("2024S-PB2-A2-b", ["AP2b.04.16","AP2b.04.16.1"], "code_schreiben", "Tage zählen, an denen die Aktie besser als der DAX war")
t("2024S-PB2-A3-aa", ["AP2b.03.08.1","AP2a.02.01.2"], "erklaeren", "zwei Vorteile von Whitebox- gegenüber Blackbox-Tests")
t("2024S-PB2-A3-ab", ["AP2b.03.08.2"], "erklaeren", "Zweck von Regressionstests")
t("2024S-PB2-A3-b", ["AP2b.03.08.2","AP2b.05.03.2.3"], "erklaeren", "Anweisungs-, Zweig- und Pfadüberdeckung erläutern (englischer Text)", vorgegeben="englischer Text zu den Überdeckungsmaßen")
t("2024S-PB2-A3-c", ["AP2b.05.03.2.3","AP2b.05.03.2.2"], "aufzaehlen", "Testfälle für eine Überdeckung notieren")
t("2024S-PB2-A4-a", ["AP2b.04.22.3"], "code_schreiben", "DELETE mit WHERE")
t("2024S-PB2-A4-b", ["AP2b.04.22.10","AP2b.04.22.7","AP2b.04.22.8"], "code_schreiben", "MIN, MAX, AVG, COUNT je Börse")
t("2024S-PB2-A4-c", ["AP2b.04.22.3","AP2b.04.22.5","AP2b.04.22.9","AP2b.05.02.3"], "code_schreiben", "Vorjahresdaten ins Archiv verschieben")
t("2024S-PB2-A4-d", ["AP2b.04.22.7","AP2b.04.22.10","AP2b.04.22.6","AP2b.04.22.8"], "code_schreiben", "Kennzahlen je Jahr über Tabelle und Archiv, sortiert")
# ---------- 2024W ----------
t("2024W-PB2-A2-a", ["AP2b.04.19","AP2b.04.16.1","AP2b.04.21.1"], "code_schreiben", "Methode erzeugt HTTP-Fehlerantwort (Statuscode, Header, Body)")
t("2024W-PB2-A2-b", ["AP2b.04.19","AP2b.04.16.1"], "code_schreiben", "nächste Abfahrten ermitteln (Methode erweitern)")
t("2024W-PB2-A3-a", ["AP2b.04.10.2","AP2a.02.03.4","AP2a.02.03.5"], "diagramm", "relationales Modell für Kontrollen erstellen")
t("2024W-PB2-A3-ba", ["AP2b.02.05.2","AP2b.05.02.2"], "erklaeren", "drei Probleme der Datenqualität und Folgen beim Import")
t("2024W-PB2-A3-bb", ["AP2b.02.05.2"], "erklaeren", "Weg, die Daten dennoch zu importieren")
t("2024W-PB2-A3-bc", ["AP2b.02.05.2"], "begruenden", "Import beurteilen")
t("2024W-PB2-A4-a", ["AP2b.04.22.4","AP2b.04.22.5","AP2b.04.22.8"], "code_schreiben", "SELECT mit Join und Bedingung")
t("2024W-PB2-A4-b", ["AP2b.04.22.6","AP2b.04.22.8"], "code_schreiben", "ORDER BY absteigend nach Datum und Uhrzeit")
t("2024W-PB2-A4-c", ["AP2b.04.22.8","AP2b.04.22.9"], "code_schreiben", "Verspätung in Minuten aus Zeitstempeln")
t("2024W-PB2-A1", ["AP2b.03.05","AP2b.04.16.1","AP2a.02.02.1"], "code_schreiben", "Algorithmus: gemessene Fahrzeiten auswerten")
# ---------- 2025S ----------
t("2025S-PB2-A2-a", ["AP2b.04.09.5","ANH.uml-sequenzdiagramm"], "diagramm", "Sequenzdiagramm zur Ausgabe eines Medikationsplans")
t("2025S-PB2-A2-ba", ["AP2b.05.03.2.1","AP2b.03.08.2"], "begruenden", "geeignete Überdeckung wählen und begründen")
t("2025S-PB2-A2-bb", ["AP2b.03.08.1","AP2a.02.01.2"], "erklaeren", "Whitebox-Test beschreiben")
t("2025S-PB2-A2-bc", ["AP2b.04.17.5","AP2b.05.02.2"], "erklaeren", "Umgang mit einer Eingabe nur aus Leerzeichen")
t("2025S-PB2-A4-a", ["AP2b.04.22.3"], "code_schreiben", "INSERT")
t("2025S-PB2-A4-b", ["AP2a.02.03.7",SQL], "code_schreiben", "GRANT Schreibrechte")
t("2025S-PB2-A4-c", ["AP2a.02.03.7",SQL], "code_schreiben", "REVOKE Schreibrechte")
t("2025S-PB2-A4-d", ["AP2b.04.22.1","AP2b.04.22.3"], "code_schreiben", "fehlende Werte setzen, Spalte NOT NULL machen (UPDATE, ALTER TABLE)")
t("2025S-PB2-A4-e", ["AP2b.04.22.7","AP2b.04.22.10","AP2b.04.22.6","AP2b.04.22.8"], "code_schreiben", "HAVING COUNT >= 3, sortiert")
t("2025S-PB2-A4-f", ["AP2b.04.22.10","AP2b.04.22.5"], "code_schreiben", "Durchschnitt der Anzahl je Patient (Unterabfrage)")
t("2025S-PB2-A1", ["AP2b.04.16","AP2b.04.16.1","AP2b.03.05","AP2b.04.19"], "code_schreiben", "Bettenauslastung einer Station berechnen")
t("2025S-PB2-A3", ["AP2b.04.10.2","AP2a.02.03.4","AP2a.02.03.5"], "diagramm", "relationales Modell Operationen erweitern, Schlüssel und Beziehungen")
# ---------- 2025W (ohne Aufgabensatz, P34) ----------
t("2025W-PB2-A1-a", ["AP2b.04.16","AP2b.04.16.1","AP2b.03.05"], "code_schreiben", "freie Tische für Reservierung ermitteln (Liste filtern)", hinweis=W)
t("2025W-PB2-A1-b", ["AP2b.04.16.1","AP2b.04.18.1"], "code_schreiben", "besten Tisch suchen (Minimum)", hinweis=W)
t("2025W-PB2-A3-aa", ["AP2b.03.08.2"], "erklaeren", "Unit-Test", hinweis=W)
t("2025W-PB2-A3-ab", ["AP2b.03.08.2"], "erklaeren", "Testabdeckung (Anweisungsüberdeckung in Prozent)", hinweis=W)
t("2025W-PB2-A3-ba", ["AP2b.05.03.2.3","AP2b.05.03.2.2","AP2a.02.01.3"], "aufzaehlen", "Testdaten mit erwartetem und tatsächlichem Ergebnis", hinweis=W)
t("2025W-PB2-A3-bb", ["AP2a.02.01.1"], "code_lesen", "Fehlerstellen mit Korrektur", hinweis=W)
t("2025W-PB2-A4-a", ["AP2b.04.22.3"], "code_schreiben", "INSERT", hinweis=W)
t("2025W-PB2-A4-b", ["AP2b.04.22.8","AP2b.04.22.10","AP2b.04.22.7","AP2b.04.22.6"], "code_schreiben", "Gesamtpreis je Bestellung über Joins", hinweis=W)
t("2025W-PB2-A4-c", ["AP2b.04.22.7","AP2b.04.22.10","AP2b.04.22.8"], "code_schreiben", "Kunden mit mindestens drei Bestellungen", hinweis=W)
t("2025W-PB2-A4-d", ["AP2b.04.22.1","AP2b.04.22.3","AP2b.04.22.9"], "code_schreiben", "Spalten ergänzen, Namen aufteilen, Spalte löschen", hinweis=W)
t("2025W-PB2-A4-e", ["AP2b.04.22.7","AP2b.04.22.10","AP2b.04.22.6","AP2b.04.22.8"], "code_schreiben", "Verkaufsanzahl je Kategorie", hinweis=W)
t("2025W-PB2-A2", ["AP2b.04.09.3","ANH.uml-zustandsdiagramm"], "diagramm", "Zustandsdiagramm eines Serviceroboters", hinweis=W)

# SQL-Teilaufgaben belegen auch die gleichlautenden Bausteine aus AP2a.02.03 und AP2b.03.03.2 (SQL festlegen/nutzen)
PAAR = {"AP2b.04.22.8": "AP2a.02.03.8", "AP2b.04.22.9": "AP2a.02.03.9", "AP2b.04.22.10": "AP2a.02.03.10"}
for ta in Z.values():
    for e in ta.values():
        bs = e["bausteine"]
        if any(b.startswith("AP2b.04.22") for b in bs):
            for extra in ["AP2a.02.03.6", "AP2b.03.03.2"] + [PAAR[b] for b in bs if b in PAAR]:
                if extra not in bs: bs.append(extra)
out = sys.argv[1]
os.makedirs(out, exist_ok=True)
n=0
for p, ta in Z.items():
    json.dump({"pruefung": p, "teilaufgaben": ta}, open(f"{out}/{p}.json","w",encoding="utf8"), ensure_ascii=False, indent=2)
    n += len(ta)
print(n, "Teilaufgaben in", len(Z), "Dateien")
