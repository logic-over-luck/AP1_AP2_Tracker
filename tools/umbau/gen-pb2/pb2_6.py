import sys; sys.path.insert(0, sys.path[0])
from lp import LP, meta, QUELLEN_PB2
L = LP("PB2-6", "SQL: Daten abfragen", "PB2", ["G.PB2.04"])
G4 = ["G.PB2.04"]
P = ["podcast:themen-pb2"]
SQL = "ANH.sql-syntax-auszug"
BS = "Die SQL-Syntax (Auszug) mit den Funktionen steht im Belegsatz; die Ergebnistabelle der Aufgabe gibt Spaltennamen und Reihenfolge vor."

L.tb("Abfragen zur Gewinnung von Daten", "Mit SELECT Daten auswählen, filtern, berechnen und sortieren, Tabellen verknüpfen, gruppieren und zusammenfassen und Unterabfragen einsetzen – immer passend zur verlangten Ergebnistabelle.")
L.sp("sp_sel", "SELECT: Spalten, Bedingungen, Ausdrücke und Sortieren",
     "Spalten auswählen und umbenennen, mit Bedingungen filtern, in der Ausgabe rechnen, Text- und Datumsfunktionen nutzen und sortieren.",
     G4, ["AP2b.04.22.4", ("AP2b.04.22.5", "Selektion mit WHERE"), "AP2b.04.22.6", "AP2b.04.22.9", ("AP2a.02.03.9", "Ausdrücke und Bedingungen"), ("AP2a.02.03.7", "Projektion, Selektion, Sortieren"), ("AP2a.02.03.6", "Datenbankabfrage"), ("AP2b.03.03.2", "SQL nutzen"), (SQL, "Syntax-Auszug für Abfragen")],
     ["2021W-PB2-A4-b", "2022W-PB2-A4-c", "2023W-PB2-A4-a", "2024W-PB2-A4-a", "2024W-PB2-A4-b", "2024W-PB2-A4-c", "2023S-PB2-A4-b"],
     hinweis=BS)
L.k("se1", "Du kannst mit SELECT … FROM die verlangten Spalten in der Reihenfolge der Ergebnistabelle ausgeben und mit AS umbenennen, auch mit DISTINCT ohne doppelte Zeilen.", 3,
    ["katalog:AP2b.04.22.4", "beleg:2021W-PB2-A4-b"])
L.k("se2", "Du kannst mit WHERE filtern und Bedingungen mit AND, OR, NOT, Klammern, IN und BETWEEN verknüpfen, zum Beispiel PLZ zwischen 50800 und 51999 oder Menge 100 oder 200.", 3,
    ["katalog:AP2b.04.22.5", "katalog:AP2b.04.22.9", "beleg:2023W-PB2-A4-a"])
L.k("se3", "Du kannst LIKE mit den Platzhaltern % und _ sowie IS NULL und IS NOT NULL einsetzen, zum Beispiel eine 3 an der vierten Stelle der PLZ: LIKE '___3%'.", 3,
    ["katalog:AP2b.04.22.9", "beleg:2022W-PB2-A4-c"])
L.k("se4", "Du kannst in der Ausgabe rechnen und Funktionen der SQL-Syntax einsetzen, zum Beispiel Menge * Preis, YEAR, MONTH, Wochentag oder die Differenz zweier Zeitpunkte in Minuten.", 3,
    ["katalog:AP2b.04.22.9", "beleg:2024W-PB2-A4-c", "beleg:2023S-PB2-A4-b"])
L.k("se5", "Du kannst mit ORDER BY auf- und absteigend nach einer oder mehreren Spalten sortieren, zum Beispiel absteigend nach Datum und Uhrzeit oder erst nach Menge absteigend, dann nach Preis aufsteigend.", 3,
    ["katalog:AP2b.04.22.6", "beleg:2024W-PB2-A4-b"])

L.sp("sp_join", "Abfragen über mehrere Tabellen: JOIN",
     "Tabellen über Primär- und Fremdschlüssel verknüpfen, auch drei und mehr, mit LEFT JOIN alle Datensätze einer Seite behalten und eine Tabelle zweimal einbinden.",
     G4, ["AP2b.04.22.8", ("AP2a.02.03.8", "Abfrage über mehrere Tabellen")],
     ["2021W-PB2-A4-e", "2022S-PB2-A4-bd", "2025W-PB2-A4-b", "2024W-PB2-A4-c", "2023S-PB2-A4-c"], baut_auf=["PB1-6-1-2"])
L.k("jo1", "Du kannst zwei Tabellen mit INNER JOIN … ON über Primär- und Fremdschlüssel verbinden (oder gleichwertig über FROM mit Komma und WHERE-Bedingung).", 3,
    ["katalog:AP2b.04.22.8", "beleg:2025W-PB2-A4-b"])
L.k("jo2", "Du kannst drei und mehr Tabellen in einer Abfrage verketten, auch über eine Zwischentabelle einer m:n-Beziehung, und Tabellen mit Aliasnamen abkürzen, damit gleichnamige Spalten eindeutig sind.", 3,
    ["katalog:AP2b.04.22.8", "beleg:2021W-PB2-A4-e"])
L.k("jo3", "Du kannst mit LEFT JOIN alle Datensätze der linken Tabelle ausgeben, auch wenn rechts kein passender Datensatz da ist, und erkennen, wann das nötig ist (z. B. Mitarbeiter ohne Tätigkeiten mit Durchschnitt 0); RIGHT JOIN ist das Spiegelbild.", 3,
    ["katalog:AP2b.04.22.8", "beleg:2023S-PB2-A4-c"])
L.k("jo4", "Du kannst dieselbe Tabelle zweimal mit verschiedenen Aliasnamen einbinden, zum Beispiel Zählerstände zweier Jahre in einer Zeile gegenüberstellen und die Differenz berechnen.", 3,
    ["katalog:AP2b.04.22.8", "beleg:2022S-PB2-A4-bd"])

L.sp("sp_grp", "Aggregatfunktionen, GROUP BY und HAVING",
     "Werte mit COUNT, SUM, AVG, MIN und MAX zusammenfassen, je Gruppe ausgeben, Gruppen filtern und nach dem Ergebnis sortieren.",
     G4, ["AP2b.04.22.7", "AP2b.04.22.10", ("AP2a.02.03.10", "Aggregat-Funktionen")],
     ["2021W-PB2-A4-d", "2022S-PB2-A4-bc", "2022W-PB2-A4-a", "2023S-PB2-A4-a", "2023S-PB2-A4-c", "2023W-PB2-A4-b", "2023W-PB2-A4-d", "2024S-PB2-A4-b", "2025S-PB2-A4-e", "2025W-PB2-A4-c", "2025W-PB2-A4-e"])
L.k("gr1", "Du kannst COUNT, SUM, AVG, MIN und MAX einsetzen und COUNT(*) (alle Zeilen) von COUNT(Spalte) (nur Zeilen, in denen die Spalte nicht NULL ist) unterscheiden.", 3,
    ["katalog:AP2b.04.22.10", "beleg:2023S-PB2-A4-a", "beleg:2024S-PB2-A4-b"])
L.k("gr2", "Du kannst mit GROUP BY je Gruppe ein Ergebnis ausgeben und weißt, dass jede ausgegebene Spalte, die nicht aggregiert ist, im GROUP BY stehen muss.", 3,
    ["katalog:AP2b.04.22.7", "beleg:2022W-PB2-A4-a", "beleg:2023W-PB2-A4-b"])
L.k("gr3", "Du kannst mit HAVING Gruppen filtern und HAVING von WHERE unterscheiden: WHERE filtert Zeilen vor dem Gruppieren, HAVING filtert Gruppen danach, zum Beispiel Kunden mit mindestens drei Bestellungen.", 3,
    ["katalog:AP2b.04.22.7", "beleg:2021W-PB2-A4-d", "beleg:2025W-PB2-A4-c"])
L.k("gr4", "Du kannst Aggregate mit JOIN verbinden und nach dem aggregierten Wert sortieren, zum Beispiel Umsatz je Kunde über mehrere Tabellen oder Verkaufsanzahl je Kategorie absteigend.", 3,
    ["katalog:AP2b.04.22.10", "katalog:AP2b.04.22.7", "beleg:2023W-PB2-A4-d", "beleg:2025W-PB2-A4-e"])

L.sp("sp_sub", "Unterabfragen und UNION",
     "Unterabfragen in WHERE und FROM einsetzen und Ergebnisse zweier Abfragen mit UNION vereinigen.",
     G4, [("AP2b.04.22.5", "SELECT (SELECT …)"), ("AP2b.04.22.9", "Bedingungen mit Unterabfragen"), ("AP2b.04.22.10", "Aggregat in der Unterabfrage")],
     ["2024S-PB2-A4-d", "2025S-PB2-A4-f", "2021W-PB2-A4-c", "2022S-PB2-A4-bb"],
     hinweis="UPDATE und DELETE mit Unterabfrage (2021W-PB2-A4-c, 2022S-PB2-A4-bb) stehen in PB2-5-1-2.")
L.k("su1", "Du kannst eine Unterabfrage in der WHERE-Bedingung mit IN oder NOT IN einsetzen und erklären, dass EXISTS bzw. NOT EXISTS prüft, ob die Unterabfrage überhaupt Zeilen liefert.", 3,
    ["katalog:AP2b.04.22.5", "beleg:2022S-PB2-A4-bb"])
L.k("su2", "Du kannst eine Unterabfrage einsetzen, die einen einzelnen Wert liefert, und damit vergleichen oder rechnen, zum Beispiel die HerstellerID zum Namen oder den Höchstwert.", 3,
    ["katalog:AP2b.04.22.5", "beleg:2021W-PB2-A4-c"])
L.k("su3", "Du kannst eine Unterabfrage in FROM verwenden und ihr mit AS einen Namen geben, zum Beispiel erst die Anzahl je Patient zählen und davon den Durchschnitt bilden.", 3,
    ["katalog:AP2b.04.22.5", "katalog:AP2b.04.22.10", "beleg:2025S-PB2-A4-f"])
L.k("su4", "Du kannst die Ergebnisse zweier Abfragen mit gleicher Spaltenzahl mit UNION vereinigen (z. B. aktuelle Tabelle und Archiv) und das Gesamtergebnis gruppieren und sortieren.", 3,
    ["katalog:AP2b.04.22.5", "beleg:2024S-PB2-A4-d"])

A = L.a
A("AP2-4-2-1-K1", "angepasst", "se1", "in der Reihenfolge der Ergebnistabelle, mit DISTINCT")
A("AP2-4-2-1-K2", "angepasst", "se2", "mit IN und BETWEEN")
A("AP2-4-2-1-K3", "angepasst", "se3", "mit Beispiel 2022W")
A("AP2-4-2-1-K4", "angepasst", "se4", "mit Funktionen zusammengefasst")
A("AP2-4-2-1-K5", "angepasst", "se5", "mehrstufig; DISTINCT in se1")
A("AP2-4-2-1-K6", "angepasst", "se4", "in se4 aufgenommen")
A("AP2-4-2-2-K1", "angepasst", "jo1", "auch über FROM und WHERE")
A("AP2-4-2-2-K2", "angepasst", "jo2", "mit Aliasnamen")
A("AP2-4-2-2-K3", "angepasst", "jo3", "mit Beispiel 2023S")
A("AP2-4-2-2-K4", "angepasst", "jo3", "in jo3 aufgenommen")
A("AP2-4-2-2-K5", "angepasst", "jo2", "in jo2 aufgenommen")
A("AP2-4-2-2-K6", "angepasst", "jo3", "in jo3 aufgenommen")
A("AP2-4-2-3-K1", "angepasst", "gr1", "mit COUNT(*) und COUNT(Spalte)")
A("AP2-4-2-3-K2", "angepasst", "gr2", "Regel für GROUP BY")
A("AP2-4-2-3-K3", "angepasst", "gr3", "mit Beispiel 2025W")
A("AP2-4-2-3-K4", "angepasst", "gr4", "mit JOIN zusammengefasst")
A("AP2-4-2-3-K5", "angepasst", "gr4", "in gr4 aufgenommen")
A("AP2-4-2-3-K6", "angepasst", "gr1", "in gr1 aufgenommen")
A("AP2-4-2-4-K1", "angepasst", "su1", "mit EXISTS")
A("AP2-4-2-4-K2", "angepasst", "su2", "mit Beispiel 2021W")
A("AP2-4-2-4-K3", "angepasst", "su3", "mit Beispiel 2025S")
A("AP2-4-2-4-K4", "angepasst", "su1", "in su1 aufgenommen")
A("AP2-4-2-4-K5", "angepasst", "su4", "Tabelle und Archiv (2024S)")

T = L.themen
T("SELECT, SQL", P, "Kern", ["se1", "se2", "jo1", "gr1"])
T("UNION", P, "Kern", ["su4"])
T("INSERT, UPDATE, DELETE, GRANT, REVOKE, CREATE TABLE", P, "Ordner", ["PB2-5"])

L.write("/home/claude/AP1_AP2_Tracker/umbau/lernplan/pb2/PB2-6.json", meta(quellen=QUELLEN_PB2,
  hinweis="PB2-Ordner (P33).",
  kerntest="Alle SELECT-Aufgaben der PB2-Prüfungen gegen die Musterlösungen gelesen (2021W-A4 bis 2025W-A4)."))
