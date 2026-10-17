import sys; sys.path.insert(0, sys.path[0])
from lp import LP, meta, QUELLEN_PB2
L = LP("PB2-5", "SQL: Tabellen, Datenpflege und Rechte", "PB2", ["G.PB2.04"])
G4 = ["G.PB2.04"]
P = ["podcast:themen-pb2"]
SQL = "ANH.sql-syntax-auszug"
BS = "Die SQL-Syntax (Auszug) steht im Belegsatz; Befehle und Funktionen musst du anwenden, nicht auswendig kennen."

L.tb("Datenbank aufbauen, pflegen und absichern", "Tabellen und Indizes anlegen und ändern, Daten einfügen, ändern, löschen und archivieren, Benutzer und Rechte verwalten, Datenbankobjekte wie Prozeduren und Trigger einordnen und Daten vor einem Import prüfen. Datenmodell, Normalisierung und Datentypen kennst du aus PB1-6.")
L.sp("sp_ddl", "Tabellenstruktur und Index: CREATE TABLE, ALTER TABLE, CREATE INDEX",
     "Tabellen nach einem Datenmodell mit Datentypen und Schlüsseln anlegen, nachträglich ändern und Indizes begründet anlegen.",
     G4, ["AP2b.04.22.1", "AP2b.04.22.2", ("AP2b.04.22.3", "UPDATE vor NOT NULL; Datenpflege in PB2-5-1-2"), ("AP2a.02.03.7", "Tabellenstruktur und Index"), ("AP2b.03.03.2", "SQL festlegen"), ("AP2a.02.03.6", "Datenpflege: Struktur"), SQL,
          ("AP2b.04.10.2", "relationales Modell aus PB1-6"), ("AP2a.02.03.4", "Normalisierung aus PB1-6"), ("AP2a.02.03.5", "ER-Modell aus PB1-6"), ("AP2b.04.10.1", "ER-Modell aus PB1-6"), ("AP2a.02.03.2", "Datentypen aus PB1-6"), ("AP1.03.03.4.1", "Speicherbedarf aus AP1-4-2-2"), ("ZB.datendarstellung", "aus AP1-4-2"), "ANH.praefixe"],
     ["2021W-PB2-A4-a", "2022S-PB2-A4-ac", "2022S-PB2-A4-ba", "2025S-PB2-A4-d", "2025W-PB2-A4-d",
      "2021W-PB2-A3", "2022S-PB2-A3", "2022W-PB2-A3-a", "2022W-PB2-A3-b", "2022W-PB2-A3-c", "2023W-PB2-A3-a", "2024W-PB2-A3-a", "2025S-PB2-A3", "2023W-PB2-A3-b"],
     baut_auf=["PB1-6-1-1", "PB1-6-1-2", "PB1-6-1-3", "AP1-8-4-5", "AP1-4-2-2"],
     hinweis="PB2 verlangt in jeder Prüfung auch ein Datenmodell (ER-Modell, relationales Modell, 3. Normalform, Datentypen). Gelernt wird es in PB1-6, geübt mit diesen Aufgaben. Den Speicherbedarf von Bildern (2023W-PB2-A3-b) berechnen steht in AP1-4-2-2. " + BS)
L.k("dd1", "Du kannst mit CREATE TABLE eine Tabelle nach dem relationalen Modell anlegen: Spalten mit passenden Datentypen aus der SQL-Syntax (z. B. INT, DECIMAL(8,2), VARCHAR(30), DATE, BOOLEAN), Primärschlüssel und Fremdschlüssel mit REFERENCES.", 3,
    ["katalog:AP2b.04.22.1", "beleg:2021W-PB2-A4-a"])
L.k("dd2", "Du kannst mit ALTER TABLE Spalten hinzufügen, ändern oder entfernen und einen Fremdschlüssel ergänzen, auch in der richtigen Reihenfolge: neue Spalten anlegen, Daten übertragen (UPDATE), alte Spalte löschen.", 3,
    ["katalog:AP2b.04.22.1", "beleg:2025W-PB2-A4-d"])
L.k("dd3", "Du kannst eine Spalte einer gefüllten Tabelle nachträglich zum Pflichtfeld machen: zuerst fehlende Werte mit UPDATE … WHERE … IS NULL füllen, dann die Spalte mit ALTER TABLE auf NOT NULL setzen.", 3,
    ["katalog:AP2b.04.22.1", "katalog:AP2b.04.22.3", "beleg:2025S-PB2-A4-d"])
L.k("dd4", "Du kannst erklären, wozu ein Index dient (schnelleres Suchen und Sortieren in großen Tabellen) und welchen Nachteil er hat (zusätzlicher Speicher, langsameres Einfügen und Ändern).", 2,
    ["katalog:AP2b.04.22.2", "beleg:2022S-PB2-A4-ac"])
L.k("dd5", "Du kannst mit CREATE INDEX einen benannten Index auf eine Spalte anlegen, zum Beispiel CREATE INDEX Idx_Datum ON Zaehlerstand (ZSt_Datum).", 3,
    ["katalog:AP2b.04.22.2", "beleg:2022S-PB2-A4-ba"])

L.sp("sp_dml", "Datenpflege: INSERT, UPDATE, DELETE und Archivieren",
     "Datensätze einfügen, ändern und löschen, auch mit Unterabfragen und über mehrere Tabellen, und Daten in ein Archiv verschieben.",
     G4, ["AP2b.04.22.3", ("AP2a.02.03.6", "Datenpflege"), ("AP2a.02.03.7", "Manipulation"), ("AP2b.03.03.2", "SQL nutzen"), ("AP2b.05.02.3", "Transaktion beim Verschieben, aus PB1-6")],
     ["2021W-PB2-A4-c", "2022S-PB2-A4-bb", "2022W-PB2-A4-b", "2023W-PB2-A4-c", "2024S-PB2-A4-a", "2024S-PB2-A4-c", "2025S-PB2-A4-a", "2025W-PB2-A4-a", "2021W-PB2-A1-b"],
     baut_auf=["PB1-6-1-5", "PB1-6-1-2"],
     hinweis="Gleichzeitige Zugriffe und Transaktionen (2021W-PB2-A1-b) stehen in PB1-6-1-5. " + BS)
L.k("dm1", "Du kannst mit INSERT INTO … (Spaltenliste) VALUES … einen Datensatz einfügen und mit INSERT INTO … SELECT … Datensätze aus einer Abfrage übernehmen.", 3,
    ["katalog:AP2b.04.22.3", "beleg:2025S-PB2-A4-a", "beleg:2022W-PB2-A4-b"])
L.k("dm2", "Du kannst mit UPDATE … SET … WHERE Werte ändern, auch berechnet aus der Spalte selbst (Preis = Preis * 1.05) und mit einer Unterabfrage oder Bedingung über eine verknüpfte Tabelle.", 3,
    ["katalog:AP2b.04.22.3", "beleg:2021W-PB2-A4-c", "beleg:2023W-PB2-A4-c"])
L.k("dm3", "Du kannst mit DELETE FROM … WHERE Datensätze löschen, auch mit einer Unterabfrage (z. B. Haushalte ohne Zähler: WHERE HaushaltID NOT IN (SELECT …)), und weißt, dass ohne WHERE alle Zeilen gelöscht werden.", 3,
    ["katalog:AP2b.04.22.3", "beleg:2022S-PB2-A4-bb", "beleg:2024S-PB2-A4-a"])
L.k("dm4", "Du kannst abhängige Datensätze in der richtigen Reihenfolge löschen: erst die Zeilen mit dem Fremdschlüssel, dann die Zeile, auf die sie verweisen (sonst verletzt das Löschen die referenzielle Integrität).", 3,
    ["katalog:AP2b.04.22.3"])
L.k("dm5", "Du kannst Datensätze in eine gleich aufgebaute Archivtabelle verschieben: mit INSERT INTO Archiv SELECT … WHERE … kopieren und mit DELETE … WHERE mit derselben Bedingung löschen, beides in einer Transaktion.", 3,
    ["katalog:AP2b.04.22.3", "beleg:2022W-PB2-A4-b", "beleg:2024S-PB2-A4-c"])

L.sp("sp_dcl", "Benutzer und Rechte: CREATE USER, GRANT, REVOKE",
     "Benutzer anlegen und ihnen gezielt Rechte auf Tabellen geben und wieder entziehen.",
     G4, [("AP2a.02.03.7", "Benutzer und Rechte laut SQL-Anhang"), SQL, ("AP2a.04.04.9", "Sicherheitsrisiken aus PB1-10"), ("AP2a.04.02.3", "aus PB1-10"), ("AP2b.05.01.2", "aus PB1-10")],
     ["2023S-PB2-A4-d", "2025S-PB2-A4-b", "2025S-PB2-A4-c", "2024S-PB2-A1-ba", "2024S-PB2-A1-bb", "2024S-PB2-A1-ca", "2024S-PB2-A1-cb"],
     baut_auf=["PB1-10-1-2", "PB1-10-2-1"],
     hinweis="Sicherheitsrisiken von Dokumenten aus fremden Quellen und von Links per E-Mail (2024S-PB2-A1-b/-c) stehen in PB1-10-1-2. " + BS)
L.k("dc1", "Du kannst mit CREATE USER einen Benutzer mit Passwort anlegen (CREATE USER Name IDENTIFIED BY 'Passwort').", 3,
    ["katalog:AP2a.02.03.7", "beleg:2023S-PB2-A4-d"])
L.k("dc2", "Du kannst mit GRANT Recht ON Datenbank.Tabelle TO Benutzer ein Recht wie SELECT, INSERT oder UPDATE gezielt vergeben, sodass ein Benutzer nur bekommt, was er braucht.", 3,
    ["katalog:AP2a.02.03.7", "beleg:2023S-PB2-A4-d", "beleg:2025S-PB2-A4-b"])
L.k("dc3", "Du kannst mit REVOKE Recht ON Datenbank.Tabelle FROM Benutzer ein Recht wieder entziehen.", 3,
    ["katalog:AP2a.02.03.7", "beleg:2025S-PB2-A4-c"])
L.k("dc4", "Du kannst erklären, was WITH GRANT OPTION bewirkt: Der Benutzer darf das erhaltene Recht an andere weitergeben.", 2,
    ["katalog:AP2a.02.03.7"])

L.sp("sp_pt", "Stored Procedure und Trigger",
     "Gespeicherte Prozeduren und Trigger als Datenbankobjekte beschreiben und unterscheiden.",
     G4, ["ZB.prozedur-trigger"], ["2022S-PB2-A4-aa", "2022S-PB2-A4-ab"])
L.k("pt1", "Du kannst beschreiben, was eine Stored Procedure ist: eine in der Datenbank gespeicherte Folge von SQL-Anweisungen mit Namen und Parametern, die von Anwendungen aufgerufen wird.", 2,
    ["beleg:2022S-PB2-A4-aa"])
L.k("pt2", "Du kannst beschreiben, was ein Trigger ist: SQL-Anweisungen, die die Datenbank automatisch ausführt, wenn in einer Tabelle ein bestimmtes Ereignis eintritt (INSERT, UPDATE oder DELETE), zum Beispiel um Änderungen zu protokollieren.", 2,
    ["beleg:2022S-PB2-A4-ab"])
L.k("pt3", "Du kannst Stored Procedure und Trigger unterscheiden: Die Prozedur wird ausdrücklich aufgerufen, der Trigger löst bei einem Ereignis selbst aus; beide verlagern Logik in die Datenbank.", 2,
    ["beleg:2022S-PB2-A4-aa", "beleg:2022S-PB2-A4-ab"])

L.sp("sp_imp", "Datenqualität vor einem Import prüfen",
     "Einen gelieferten Datenbestand auf Qualitätsmängel prüfen, Folgen eines Imports benennen, einen Weg zur Bereinigung aufzeigen und den Import beurteilen. Daten heterogener Quellen zusammenführen kennst du aus PB1-7.",
     G4, [("AP2b.02.05.2", "Datenqualität beim Import"), ("AP2b.05.02.2", "Validierung vor dem Import")],
     ["2024W-PB2-A3-ba", "2024W-PB2-A3-bb", "2024W-PB2-A3-bc"], baut_auf=["PB1-7-1-3", "PB1-7-1-1", "PB1-6-1-5"])
L.k("im1", "Du kannst Qualitätsmängel in einem Datenbestand beschreiben und je eine Folge des Imports nennen, zum Beispiel uneinheitliche Formate (Datum), mehrere Werte in einem Feld, fehlende oder ungültige Werte, Dubletten, unterschiedliche Schreibweisen → falsche Auswertungen, abgelehnte Datensätze, verletzte Schlüssel.", 2,
    ["beleg:2024W-PB2-A3-ba"])
L.k("im2", "Du kannst einen Weg aufzeigen, die Daten dennoch zu importieren: zuerst in eine Zwischentabelle laden, dann mit Skript oder SQL bereinigen und vereinheitlichen, prüfen und erst danach in die Zieltabellen übernehmen.", 2,
    ["beleg:2024W-PB2-A3-bb"])
L.k("im3", "Du kannst beurteilen, ob ein Datenbestand ohne Nacharbeit importiert werden kann, und für oder gegen den Import argumentieren, etwa mit Aufwand der Bereinigung gegen Nutzen der Daten.", 4,
    ["beleg:2024W-PB2-A3-bc"])

A = L.a
A("AP2-4-1-1-K4", "angepasst", "dd1", "Datentyp aus der SQL-Syntax beim Anlegen der Tabelle")
A("AP2-4-1-2-K5", "angepasst", "im1", "mit Folge des Imports")
A("AP2-4-4-3-K2", "angepasst", "im3", "beurteilen und argumentieren (2024W)")
A("AP2-4-3-1-K1", "angepasst", "dm1", "mit INSERT … SELECT zusammengefasst")
A("AP2-4-3-1-K2", "angepasst", "dm1", "in dm1 aufgenommen")
A("AP2-4-3-1-K3", "angepasst", "dm2", "mit Unterabfrage")
A("AP2-4-3-1-K4", "angepasst", "dm3", "mit Unterabfrage")
A("AP2-4-3-1-K5", "angepasst", "dm4", "mit Begründung (referenzielle Integrität)")
A("AP2-4-3-1-K6", "angepasst", "dm5", "in einer Transaktion")
A("AP2-4-3-2-K1", "angepasst", "dd1", "mit REFERENCES")
A("AP2-4-3-2-K2", "angepasst", "dd2", "mit Reihenfolge beim Umbau")
A("AP2-4-3-2-K3", "gestrichen", None, "DROP TABLE kam in keiner PB2-Prüfung vor und steht im SQL-Auszug; Spalten entfernen in dd2")
A("AP2-4-3-2-K4", "gestrichen", None, "Befehlsgruppen zuordnen wurde in keiner Prüfung verlangt; ergibt sich aus den Aussagen dd1–dm5")
A("AP2-4-3-2-K5", "angepasst", "dd5", "Anlegen; Zweck in dd4")
A("AP2-4-3-2-K6", "angepasst", "dd4", "Zweck und Nachteil zusammen")
A("AP2-4-3-3-K1", "angepasst", "dc2", "gezielt vergeben")
A("AP2-4-3-3-K2", "angepasst", "dc3", "REVOKE")
A("AP2-4-3-3-K3", "angepasst", "dc1", "mit Passwort")
A("AP2-4-3-3-K4", "angepasst", "dc2", "in dc2 aufgenommen")
A("AP2-4-3-3-K5", "angepasst", "dc4", "erklären")
for i in range(1, 6):
    A(f"AP2-6-6-3-K{i}", "gestrichen", None, "E2: Datenmengen und Übertragungszeiten berechnen stehen in AP1-4-2-2 und AP1-4-2-4 (Beleg 2023W-PB2-A3-b dort geübt); P32: Rechenweg und Runden sind Prüfungstechnik")

T = L.themen
T("CREATE TABLE, CREATE INDEX, Index", P, "Kern", ["dd1", "dd4", "dd5"])
T("UPDATE, DELETE, INSERT", P, "Kern", ["dm1", "dm2", "dm3"])
T("GRANT, REVOKE", P, "Kern", ["dc2", "dc3"])
T("Stored Procedures, Trigger", P, "Kern", ["pt1", "pt2"])
T("Datenimport, Datenqualität", P, "Kern", ["im1", "im3"])
T("Relationales Datenmodell, ERM, Datentypen", P, "Ordner", ["PB1-6"])
T("E-Mail-Sicherheit", P, "Ordner", ["PB1-10"])
T("Dateigrößen berechnen", P, "Ordner", ["AP1"], "AP1-4-2-2")
T("SELECT, SQL, UNION", P, "Ordner", ["PB2-6"])

L.write("/home/claude/AP1_AP2_Tracker/umbau/lernplan/pb2/PB2-5.json", meta(quellen=QUELLEN_PB2,
  hinweis="PB2-Ordner (P33). Stored Procedure und Trigger sind Zusatzbaustein (Beleg 2022S-PB2).",
  kerntest="SQL-Datenpflege und Rechte aus allen PB2-Prüfungen sowie 2024W-PB2-A3-b (Datenimport) gegen die Musterlösungen gelesen."))
