import sys; sys.path.insert(0, sys.path[0])
from lpw import LPW, B, T, K, R, meta

L = LPW("WISO-2", "Aufbau und Organisation des Ausbildungsbetriebes", ["G.WISO.02"])
G2 = ["G.WISO.02"]

# ---------------------------------------------------------------- 2-1 Betrieb und Gesamtwirtschaft
L.tb("WISO-2-1", "Der Betrieb in der Gesamtwirtschaft", "Wo ein Betrieb in der Volkswirtschaft steht, wie Arbeit betrieblich und weltweit geteilt wird, was die Soziale Marktwirtschaft ausmacht und wie die Konjunktur verläuft.")

L.sp("WISO-2-1-1", "Der Betrieb: Branche, Wirtschaftssektoren, erwerbswirtschaftliche Betriebe, Produktpalette und Märkte",
     "Ein Unternehmen seinem Wirtschaftssektor, seiner Branche und seiner Betriebsart zuordnen und die Begriffe Branche, Produktpalette und Markt erklären.",
     G2, ["WISO.02.01.1", "WISO.02.01.2", "WISO.02.01.3"],
     T("2022S-A17", "2023S-A27", "2025S-A1", "2024S-A9", "2023S-A21", "2025S-A2"), baut_auf=["AP1-2-1-1"],
     hinweis="Marktformen (Monopol, Oligopol, Polypol; 2025S-WISO-A2) stehen in AP1-2-1-1.")
L.k(1, "Du kannst Betriebe und Tätigkeiten den drei Wirtschaftssektoren zuordnen: primär (Urproduktion wie Landwirtschaft, Forstwirtschaft, Bergbau), sekundär (Be- und Verarbeitung in Industrie und Handwerk, Energie und Bau, auch das Herstellen von Software oder Geräten), tertiär (Dienstleistungen wie Handel, Verkehr und Logistik, Banken, Beratung, IT-Dienstleister).", 2,
    [K("WISO.02.01.2"), B("2022S-A17"), B("2023S-A27"), B("2025S-A1")])
L.k(2, "Du kannst erwerbswirtschaftliche Betriebe (Ziel ist Gewinn) von gemeinwirtschaftlichen oder gemeinnützigen Betrieben (Ziel ist Bedarfsdeckung) unterscheiden, zum Beispiel ist ein IT-Dienstleister ein erwerbswirtschaftlicher Betrieb des tertiären Sektors.", 2,
    [K("WISO.02.01.2"), B("2024S-A9"), B("2023S-A21")])
L.k(3, "Du kannst Branche, Produktpalette und Markt erklären: der Wirtschaftszweig, alle angebotenen Produkte und Dienstleistungen, das Zusammentreffen von Angebot und Nachfrage.", 2,
    [K("WISO.02.01.1"), K("WISO.02.01.3")])
L.k(5, "Du kannst Beschaffungsmarkt und Absatzmarkt unterscheiden.", 2,
    [K("WISO.02.01.3")])

L.sp("WISO-2-1-2", "Betriebliche und gesamtwirtschaftliche Arbeitsteilung, Globalisierung",
     "Arten der Arbeitsteilung unterscheiden, Globalisierung erklären und Maßnahmen und Folgen der weltweiten Arbeitsteilung unterscheiden.",
     G2, ["WISO.02.06", "WISO.02.06.1"],
     T("2025W-A22", "2025W-A26", "2022S-A22"),
     hinweis="Wie ein Betrieb Aufgaben auf Stellen verteilt (nach Verrichtung oder Objekt), steht in WISO-2-2-6-K4.")
L.k(2, "Du kannst betriebliche (eine Gesamtaufgabe wird im Betrieb in Teilaufgaben zerlegt und auf Stellen verteilt), gesamtwirtschaftliche (zwischen Berufen, Betrieben und Sektoren) und internationale Arbeitsteilung (zwischen Ländern) an einem Beispiel unterscheiden, zum Beispiel getrennte Stellen für Programmierung, Wartung und Kundenschulung als betriebliche, den Bezug von Bildschirmen aus China als internationale.", 2,
    [K("WISO.02.06"), B("2025W-A22")])
L.k(3, "Du kannst Globalisierung erklären: die zunehmende weltweite Verflechtung von Handel, Produktion, Kapital und Kommunikation.", 2,
    [K("WISO.02.06.1")])
L.k(4, "Du kannst Maßnahmen unterscheiden, die die Globalisierung fördern oder bremsen: Abbau von Zöllen und Handelsschranken und Offenheit für Investitionen aus dem und ins Ausland fördern sie, Importzölle und Beschränkung des Technologietransfers bremsen sie.", 2,
    [K("WISO.02.06.1"), B("2025W-A26")])
L.k(5, "Du kannst Vorteile und Nachteile der Arbeitsteilung erklären: höhere Produktivität durch Spezialisierung gegenüber einseitiger Arbeit und gegenseitiger Abhängigkeit.", 2,
    [K("WISO.02.06")])
L.k(6, "Du kannst Auswirkungen der weltweiten Arbeitsteilung erklären: größere Märkte, günstigere Beschaffung und mehr transportierte Waren gegenüber stärkerem Wettbewerb, Abhängigkeit von Lieferketten und unterschiedlichen Sozial- und Umweltstandards.", 2,
    [K("WISO.02.06.1"), B("2022S-A22")])

L.sp("WISO-2-1-3", "Soziale Marktwirtschaft: Merkmale, Möglichkeiten und Grenzen",
     "Die Merkmale der Sozialen Marktwirtschaft erklären und ihre Möglichkeiten und Grenzen beschreiben.",
     G2, ["WISO.02.06.2"], T("2025W-A27"))
L.k(1, "Du kannst die Merkmale der Sozialen Marktwirtschaft erklären: freier Wettbewerb, Privateigentum und freie Preisbildung, verbunden mit sozialem Ausgleich durch den Staat.", 2,
    [K("WISO.02.06.2")])
L.k(2, "Du kannst zutreffende von unzutreffenden Aussagen über die Soziale Marktwirtschaft unterscheiden: Sie will Chancengleichheit durch sozialen Ausgleich und solidarische Hilfe; der Staat setzt nicht allgemein Preise und Angebotsmengen fest (einzelne Eingriffe wie der gesetzliche Mindestlohn sind die Ausnahme), fördert keine Kartelle und rettet nicht jedes Unternehmen.", 2,
    [K("WISO.02.06.2"), B("2025W-A27")])
L.k(3, "Du kannst Aufgaben des Staates in der Sozialen Marktwirtschaft erklären: den Wettbewerb sichern und, nach dem Sozialstaatsprinzip des Grundgesetzes, für soziale Sicherheit und sozialen Ausgleich sorgen sowie Arbeitnehmer und Verbraucher schützen.", 2,
    [K("WISO.02.06.2")])
L.k(4, "Du kannst Grenzen der Sozialen Marktwirtschaft beschreiben: Sozialleistungen müssen finanziert werden, und der Staat kann Arbeitslosigkeit oder ungleiche Einkommen nicht vollständig verhindern.", 2,
    [K("WISO.02.06.2")])

L.sp("WISO-2-1-4", "Konjunktur: Phasen, Merkmale und Maßnahmen",
     "Konjunkturphasen an Kennzahlen und Merkmalen erkennen und Maßnahmen unterscheiden, die die Konjunktur beleben oder dämpfen.",
     G2, ["ZB.wiso-konjunktur"],
     T("2025S-A4", "2023S-A26", "2025S-A5", "2025S-A6", "2025W-A5", "2023S-A9"),
     hinweis="Neuer Stichpunkt (Zusatzbaustein): Konjunktur steht nicht im Katalog, kam aber in drei der acht Prüfungen vor. Real- und Nominaleinkommen bei steigenden Preisen (2023S-WISO-A9) stehen in WISO-1-6-1-K6.")
L.k(1, "Du kannst die Phasen des Konjunkturzyklus in ihrer Reihenfolge und mit ihren Merkmalen erklären: Aufschwung (Expansion: Nachfrage, Produktion und Beschäftigung steigen), Hochkonjunktur (Boom: Kapazitäten ausgelastet, kaum Arbeitslosigkeit, stark steigende Preise), Abschwung (Rezession: die Wirtschaftsleistung schrumpft, die Arbeitslosigkeit steigt) und Tiefstand (Depression: Wirtschaftsleistung auf niedrigem Niveau, hohe Arbeitslosigkeit, der Tiefpunkt ist erreicht); Stagnation heißt, dass die Wirtschaft nicht wächst.", 2,
    [K("ZB.wiso-konjunktur"), B("2025S-A4")])
L.k(2, "Du kannst eine beschriebene wirtschaftliche Lage anhand von Wachstum des Bruttoinlandsprodukts, Arbeitslosenquote und Inflationsrate einer Konjunkturphase zuordnen, zum Beispiel schrumpfendes BIP und steigende Arbeitslosigkeit dem Abschwung, solange der Tiefpunkt noch nicht erreicht ist.", 2,
    [K("ZB.wiso-konjunktur"), B("2025S-A4")], vorgegeben="Kennzahlen in einer Tabelle im Aufgabentext")
L.k(3, "Du kannst typische Merkmale einer Rezession erkennen und von denen eines Aufschwungs unterscheiden: Konsumnachfrage geht zurück, Lagerbestände steigen, Investitionen, Kapazitätsauslastung und Beschäftigung sinken.", 2,
    [K("ZB.wiso-konjunktur"), B("2023S-A26"), B("2025S-A5")])
L.k(4, "Du kannst Maßnahmen unterscheiden, die die Konjunktur beleben (höhere staatliche Investitionen, Steuersenkungen; geldpolitisch niedrigere Leitzinsen, über die die Europäische Zentralbank entscheidet, nicht der Staat) oder dämpfen (Steuererhöhungen, Kürzung staatlicher Leistungen; höhere Leitzinsen).", 2,
    [K("ZB.wiso-konjunktur"), B("2025S-A6"), B("2025W-A5")])

# ---------------------------------------------------------------- 2-2 Rechtsform und Aufbau
L.tb("WISO-2-2", "Rechtsform und Aufbau des Betriebs", "Welche Rechtsformen es gibt, wie GmbH und AG funktionieren und den Gewinn verteilen, was Kaufmann und Handelsregister bedeuten und wie ein Betrieb seine Stellen und Abläufe organisiert (Katalog: Rechtsform und organisatorischen Aufbau erläutern, WISO.02.H1).")

L.sp("WISO-2-2-1", "Einzelunternehmen, GbR und Personengesellschaften: OHG, KG, GmbH & Co. KG",
     "Einzelunternehmen und Personengesellschaften nach Gründerzahl, Haftung und Geschäftsführung unterscheiden.",
     G2, ["WISO.02.02.1", "WISO.02.02.2"],
     T("2023S-A13"),
     hinweis="Die Rechtsform für eine Gründung wählen und die eG (2023S-WISO-A23, 2023W-WISO-A15) steht in WISO-2-2-2-K7 und -K8.")
L.k(1, "Du kannst Einzelunternehmen, GbR, OHG, KG und GmbH & Co. KG von den Kapitalgesellschaften abgrenzen: Bei ihnen stehen die Personen im Vordergrund, ein Mindestkapital ist für die Gesellschaft selbst nicht vorgeschrieben (bei der GmbH & Co. KG braucht aber die Komplementär-GmbH ihr Stammkapital).", 2,
    [K("WISO.02.02.1"), K("WISO.02.02.2")])
L.k(2, "Du kannst die Haftung erklären: Der Einzelunternehmer haftet unbeschränkt; die Gesellschafter von GbR und OHG haften unbeschränkt, unmittelbar und gesamtschuldnerisch, also jeder auch mit seinem Privatvermögen für alle Schulden der Gesellschaft.", 2,
    [K("WISO.02.02.1"), K("WISO.02.02.2")])
L.k(7, "Du kannst die Geschäftsführung in GbR und OHG erklären: Alle Gesellschafter sind zur Geschäftsführung berechtigt und verpflichtet, in der GbR grundsätzlich gemeinsam, in der OHG jeder allein, wenn der Gesellschaftsvertrag nichts anderes regelt.", 2,
    [K("WISO.02.02.1"), K("WISO.02.02.2")])
L.k(3, "Du kannst die KG erklären: Der Komplementär haftet unbeschränkt und führt die Geschäfte, der Kommanditist haftet nur bis zur Höhe seiner Einlage und ist von der Geschäftsführung ausgeschlossen.", 2,
    [K("WISO.02.02.2"), B("2023S-A13")])
L.k(4, "Du kannst die GmbH & Co. KG erklären: eine KG, deren unbeschränkt haftender Gesellschafter eine GmbH ist, sodass am Ende keine natürliche Person unbeschränkt haftet.", 2,
    [K("WISO.02.02.2")])
L.k(5, "Du kannst erklären, dass eine Personengesellschaft wie GbR, OHG oder KG mindestens zwei Gesellschafter braucht, während ein Einzelunternehmen einer Person gehört.", 2,
    [K("WISO.02.02.1"), K("WISO.02.02.2")])

L.sp("WISO-2-2-2", "Kapitalgesellschaften GmbH und AG, Genossenschaft, gemeinnützige Organisationen, Wahl der Rechtsform",
     "Gründung, Haftung, Geschäftsführung und Ziele von GmbH und AG erklären, Genossenschaft und gemeinnützige Organisationen einordnen und einer Gründung die passende Rechtsform zuordnen.",
     G2, ["WISO.02.02", ("WISO.02.02.3", "GmbH und AG"), "WISO.02.02.4"],
     T("2021W-A12", "2022W-A2", "2023S-A15", "2023W-A19", "2024S-A17", "2025S-A21", "2025S-A22", "2025W-A18", "2025W-A19", "2023S-A21", "2023S-A22", "2023S-A23", "2023W-A15"),
     hinweis="Personengesellschaften (Haftung, Geschäftsführung) stehen in WISO-2-2-1; K8 setzt sie voraus.")
L.k(1, "Du kannst die Gründung einer GmbH beschreiben: durch eine oder mehrere Personen, mit notariell beurkundetem Gesellschaftsvertrag, einem Stammkapital von mindestens 25.000 Euro, auf das vor der Anmeldung auf jeden Geschäftsanteil mindestens ein Viertel und insgesamt mindestens 12.500 Euro eingezahlt sein müssen (Sacheinlagen vollständig), und der Eintragung ins Handelsregister, mit der die GmbH entsteht.", 2,
    [K("WISO.02.02.3"), B("2021W-A12"), B("2023W-A19"), B("2024S-A17"), B("2025S-A21"), B("2025W-A18")])
L.k(2, "Du kannst die Haftung der GmbH erklären: Sie ist eine Kapitalgesellschaft und juristische Person des Privatrechts (keine juristische Person oder Körperschaft des öffentlichen Rechts wie eine Kammer); für ihre Schulden haftet nur das Gesellschaftsvermögen, die Gesellschafter verlieren höchstens ihre Einlage.", 2,
    [K("WISO.02.02.3"), B("2023S-A15"), B("2022W-A2")])
L.k(3, "Du kannst Geschäftsführung und Organe der GmbH erklären: Geschäftsführer leiten und vertreten die GmbH, Gesellschafter oder fremde Personen können es sein; die Gesellschafter entscheiden in der Gesellschafterversammlung und müssen nicht selbst mitarbeiten.", 2,
    [K("WISO.02.02.3"), B("2025S-A22"), B("2025W-A19")])
L.k(5, "Du kannst die AG in Grundzügen beschreiben und von der GmbH unterscheiden: Grundkapital mindestens 50.000 Euro in Aktien, die an der Börse gehandelt werden können; Organe Vorstand, Aufsichtsrat und Hauptversammlung; vorrangiges Ziel ist Gewinn, aus dem die Aktionäre Dividende erhalten.", 2,
    [K("WISO.02.02.3"), B("2023S-A21"), B("2023S-A22"), B("2023S-A23")])
L.k(6, "Du kannst gemeinnützige Organisationen erklären: Sie verfolgen einen Zweck für die Allgemeinheit, schütten keinen Gewinn an Eigentümer aus und sind steuerlich begünstigt, zum Beispiel als eingetragener Verein, Stiftung oder gemeinnützige GmbH.", 2,
    [K("WISO.02.02.4")])
L.k(7, "Du kannst die eingetragene Genossenschaft (eG) erklären: Sie braucht mindestens drei Mitglieder, fördert vor allem den Erwerb oder die Wirtschaft ihrer Mitglieder, haftet für ihre Schulden nur mit dem Genossenschaftsvermögen und wird ins Genossenschaftsregister eingetragen.", 2,
    [K("WISO.02.02"), B("2023S-A23"), B("2023W-A15")])
L.k(8, "Du kannst einer Gründung mit Vorgaben zu Zahl der Gründer, Geschäftsführung, Haftung und Kapital die passende Rechtsform zuordnen und die übrigen an je einem Merkmal ausschließen, zum Beispiel zwei Gründer, beide Geschäftsführer, beschränkte Haftung, 40.000 Euro Kapital: GmbH (nicht AG mit Vorstand und Börse, nicht KG oder GbR mit persönlicher Haftung, nicht eG mit mindestens drei Mitgliedern).", 2,
    [K("WISO.02.02"), K("WISO.02.02.3"), B("2023W-A15")])
L.grenze("Unternehmergesellschaft (haftungsbeschränkt), KGaA und SE gehören nicht dazu.",
         "Der Katalog nennt als Kapitalgesellschaften GmbH und AG als Beispiele (WISO.02.02.3); weitere Formen wären nach P-BEISPIELLISTE nur mit zwei unabhängigen Hinweisquellen Puffer, sonst Kür (G3).",
         ["WISO.02.02.3"])

L.sp("WISO-2-2-3", "Gewinnverteilung in der GmbH berechnen",
     "Den Gewinnanteil eines GmbH-Gesellschafters nach seinem Geschäftsanteil berechnen.",
     G2, [("WISO.02.02.3", "Gewinnverteilung")],
     T("2022S-A18", "2024S-A16", "2025S-A23", "2025W-A20"))
L.k(1, "Du kannst erklären, dass der Gewinn einer GmbH nach dem Verhältnis der Geschäftsanteile verteilt wird, wenn der Gesellschaftsvertrag nichts anderes regelt.", 2,
    [K("WISO.02.02.3"), B("2022S-A18")])
L.k(2, "Du kannst den Anteil eines Gesellschafters am Stammkapital als Bruch oder Prozentsatz bestimmen, auch wenn nur der Anteil der anderen Gesellschafter und das Stammkapital angegeben sind.", 3,
    [K("WISO.02.02.3"), B("2024S-A16")])
L.k(3, "Du kannst daraus den Gewinnanteil eines Gesellschafters in Euro berechnen.", 3,
    [K("WISO.02.02.3"), B("2024S-A16"), B("2025S-A23"), B("2025W-A20")])

L.sp("WISO-2-2-4", "Kaufmann, Firma und Handelsregister",
     "Den Ist-Kaufmann und die Wirkung der Handelsregistereintragung erklären, die Abteilungen des Handelsregisters unterscheiden, einen Registerauszug lesen und die Firma erklären.",
     G2, ["ZB.wiso-kaufmann"],
     T("2023W-A5", "2022W-A24", "2025W-A18", "2024S-A15", "2025S-A21", "2025W-A19"), baut_auf=["AP1-2-4-3"],
     hinweis="Neuer Stichpunkt (Zusatzbaustein): Kaufmann und Handelsregister stehen nicht im Katalog, kamen aber in fünf Prüfungen vor. Prokura und ihre Eintragung ins Handelsregister stehen in AP1-2-4-3.")
L.k(1, "Du kannst das Handelsregister erklären: ein öffentliches Verzeichnis beim Amtsgericht, in Abteilung A mit Einzelkaufleuten und Personengesellschaften, in Abteilung B mit Kapitalgesellschaften; die Kammer führt es nicht.", 2,
    [K("ZB.wiso-kaufmann"), B("2023W-A5")])
L.k(2, "Du kannst deklaratorische und konstitutive Eintragung unterscheiden: Der Ist-Kaufmann (Gewerbe, das eine kaufmännische Einrichtung braucht) ist schon vor der Eintragung Kaufmann, die Eintragung bestätigt das nur; eine GmbH oder AG entsteht erst mit der Eintragung.", 2,
    [K("ZB.wiso-kaufmann"), B("2022W-A24"), B("2025W-A18")])
L.k(3, "Du kannst einen Auszug aus dem Handelsregister von anderen Registern wie Grundbuch oder Vereinsregister unterscheiden und ihm Firma, Sitz, Stamm- oder Grundkapital, Gesellschafter und Prokura entnehmen.", 2,
    [K("ZB.wiso-kaufmann"), B("2024S-A15")], vorgegeben="Registerauszug im Aufgabentext")
L.k(4, "Du kannst die Firma erklären: der Name, unter dem ein Kaufmann seine Geschäfte betreibt; sie muss die Rechtsform nennen (also „EcoTech Services GmbH“, nicht nur „EcoTech Services“) und sich von anderen Firmen am selben Ort deutlich unterscheiden.", 2,
    [K("ZB.wiso-kaufmann"), B("2025S-A21"), B("2025W-A19")])

L.sp("WISO-2-2-5", "Leitungssysteme: Stabliniensystem und Spartenorganisation",
     "Über die Formen aus AP1 hinaus Stabliniensystem und Spartenorganisation am Organigramm erkennen und erklären und den Leitungssystemen ihre Vor- und Nachteile zuordnen.",
     G2, [("WISO.02.03.1", "Stabliniensystem; Vor- und Nachteile des Mehrliniensystems"), "WISO.02.03.2", ("WISO.02.03.3", "Vor- und Nachteile")],
     T("2021W-A13", "2022S-A21", "2023W-A21", "2024S-A21", "2025W-A23", "2025W-A24"), baut_auf=["AP1-2-4-2"],
     hinweis="Einlinien-, Mehrlinien- und Matrixorganisation (Erkennen am Organigramm, Unterschiede, je einen Vor- und Nachteil nennen) stehen in AP1-2-4-2; damit lösen sich 2022S-WISO-A21, 2023W-WISO-A21 und 2024S-WISO-A21. Das Zuordnen von Vor- und Nachteilen zu Mehrlinien- und Matrixsystem (2021W-WISO-A13) geht darüber hinaus und steht in K4. Früher Stichpunkt WISO-2-3-1.")
L.k(1, "Du kannst an einem Organigramm das Stabliniensystem (Stabsstellen seitlich an einer Instanz) und die Spartenorganisation (Gliederung nach Produkten, Kunden oder Regionen) von Einlinien-, Mehrlinien- und Matrixsystem unterscheiden.", 2,
    [K("WISO.02.03.1"), K("WISO.02.03.2"), B("2021W-A13"), B("2025W-A23")])
L.k(2, "Du kannst das Stabliniensystem erklären: ein Liniensystem mit Stabsstellen, die die Leitung beraten und Entscheidungen vorbereiten, aber keine Weisungsbefugnis haben, zum Beispiel eine Rechtsabteilung.", 2,
    [K("WISO.02.03.1"), B("2025W-A24"), B("2021W-A13")])
L.k(3, "Du kannst die Spartenorganisation erklären: Das Unternehmen ist nach Produkten, Kundengruppen oder Regionen gegliedert, und jede Sparte hat ihre eigenen Funktionsbereiche.", 2,
    [K("WISO.02.03.2")])
L.k(4, "Du kannst den Leitungssystemen ihre Vor- und Nachteile zuordnen: Stabliniensystem (Entlastung der Leitung durch das Spezialwissen der Stäbe gegenüber Konflikten zwischen Stab und Linie), Spartenorganisation (Marktnähe der Sparten gegenüber Doppelarbeit in den Funktionsbereichen), Mehrliniensystem (kurze Wege und Fachwissen der Vorgesetzten gegenüber uneinheitlicher Führung und Kompetenzkonflikten), Matrixorganisation (hoher Abstimmungs- und Kommunikationsbedarf, verlangt Teamfähigkeit).", 2,
    [K("WISO.02.03.1"), K("WISO.02.03.2"), K("WISO.02.03.3"), B("2021W-A13")],
    neu=(["AP1-2-4-2"], "Vor- und Nachteile von Mehrliniensystem und Matrixorganisation den Formen zuordnen (Stufe 2); AP1-2-4-2-K3 lässt nur je einen Vorteil und Nachteil nennen (Stufe 1, Beispiel Einliniensystem)."))

L.sp("WISO-2-2-6", "Arbeitsabläufe und Aufgabenteilung: Ablauforganisation, Stelle und Abteilung",
     "Aufbau- und Ablauforganisation unterscheiden, Stelle, Abteilung und Instanz erklären und Arten der Aufgabenteilung unterscheiden.",
     G2, ["WISO.02.03.4", "WISO.02.03.5"], [],
     hinweis="Früher Stichpunkt WISO-2-3-2. Betriebliche Arbeitsteilung erkennen (2025W-WISO-A22) steht in WISO-2-1-2-K2.")
L.k(1, "Du kannst Aufbauorganisation (wer ist wofür zuständig und wem unterstellt) und Ablauforganisation (in welcher Reihenfolge, wann und womit gearbeitet wird) unterscheiden.", 2,
    [K("WISO.02.03.4")])
L.k(2, "Du kannst die Schritte eines beschriebenen Arbeitsablaufs den beteiligten Stellen oder Abteilungen zuordnen.", 2,
    [K("WISO.02.03.4")])
L.k(3, "Du kannst Stelle (kleinste Einheit mit festem Aufgabenbereich), Abteilung (mehrere Stellen unter einer Leitung) und Instanz (Stelle mit Weisungsbefugnis) erklären.", 2,
    [K("WISO.02.03.5")])
L.k(4, "Du kannst zwei Arten der Aufgabenteilung unterscheiden: nach Tätigkeit (Verrichtung), zum Beispiel Einkauf, Entwicklung, Vertrieb, oder nach Gegenstand (Objekt), zum Beispiel Produkt oder Kundengruppe.", 2,
    [K("WISO.02.03.5")])

# ---------------------------------------------------------------- 2-4 Ziele und Kennzahlen
L.tb("WISO-2-4", "Unternehmensziele, Kennzahlen und ökonomisches Prinzip", "Wie Ziele zueinander stehen, wie der Erfolg eines Betriebs mit Kennzahlen gemessen wird und nach welchem Prinzip er wirtschaftet.")

L.sp("WISO-2-4-1", "Produktivität, Wirtschaftlichkeit und Rentabilität berechnen",
     "Produktivität, Wirtschaftlichkeit und Rentabilität unterscheiden und aus vorgegebenen Zahlen berechnen und vergleichen.",
     G2, ["WISO.02.05.1", "WISO.02.05.2", "WISO.02.05.3"],
     T("2023S-A17", "2022S-A19", "2023W-A20", "2024S-A20", "2022W-A3", "2023W-A16"))
L.k(1, "Du kannst die Produktivität berechnen: Ausbringung geteilt durch den Einsatz eines Faktors, zum Beispiel Stück je Arbeitsstunde oder Umsatz je Mitarbeiter, und ihre Veränderung in Prozent angeben.", 3,
    [K("WISO.02.05.1"), B("2023S-A17")])
L.k(2, "Du kannst die Wirtschaftlichkeit berechnen und mehrere Aufträge vergleichen: Ertrag geteilt durch Aufwand; der Auftrag mit dem höchsten Wert ist am wirtschaftlichsten, ein Wert über 1 bedeutet Gewinn.", 3,
    [K("WISO.02.05.2"), B("2022S-A19"), B("2023W-A20"), B("2024S-A20")])
L.k(3, "Du kannst die Eigenkapitalrentabilität berechnen: Gewinn mal 100 geteilt durch das Eigenkapital, auch für einen einzelnen Gesellschafter aus Gewinnanteil und Einlage.", 3,
    [K("WISO.02.05.3"), B("2022W-A3"), B("2023W-A16")])
L.k(4, "Du kannst die drei Kennzahlen unterscheiden: Produktivität setzt die Ausbringung ins Verhältnis zum Einsatz eines Faktors (meist mengenmäßig, zum Beispiel Stück je Stunde, als Umsatz je Mitarbeiter auch wertmäßig), Wirtschaftlichkeit setzt Ertrag und Aufwand in Euro ins Verhältnis, Rentabilität den Gewinn zum eingesetzten Kapital oder zum Umsatz.", 2,
    [K("WISO.02.05.1"), K("WISO.02.05.2"), K("WISO.02.05.3")])
L.k(5, "Du kannst die Umsatzrentabilität berechnen: Gewinn mal 100 geteilt durch den Umsatz.", 3,
    [K("WISO.02.05.3"), R("P-GESCHWISTER")])
L.k(6, "Du kannst die Gesamtkapitalrentabilität berechnen: Gewinn plus Fremdkapitalzinsen, mal 100, geteilt durch das Gesamtkapital.", 3,
    [K("WISO.02.05.3"), R("P-GESCHWISTER")])

L.sp("WISO-2-4-2", "Zielbeziehungen: Zielkonflikt, Zielharmonie, Zielneutralität",
     "Beziehungen zwischen Unternehmenszielen erkennen und erklären, besonders den Zielkonflikt.",
     G2, ["WISO.02.05", "WISO.02.05.4"],
     T("2025W-A6", "2025S-A7"), baut_auf=["AP1-2-4-1"],
     hinweis="Ökonomische, ökologische und soziale Ziele einordnen (2025S-WISO-A7) steht in AP1-2-4-1. Früher Stichpunkt „Unternehmensziele“; das Einordnen der Ziele ist gestrichen (E2).")
L.k(3, "Du kannst einen Zielkonflikt erklären und unter mehreren Zielpaaren erkennen: Das Erreichen des einen Ziels erschwert das andere, zum Beispiel Personalkosten senken und zugleich Arbeitsplätze sichern.", 2,
    [K("WISO.02.05.4"), B("2025W-A6")])
L.k(4, "Du kannst Zielharmonie erklären: Zwei Ziele fördern sich gegenseitig, zum Beispiel senkt Energiesparen die Kosten und schont die Umwelt.", 2,
    [K("WISO.02.05"), R("P-GRUNDLAGE"), B("2025W-A6")])
L.k(5, "Du kannst Zielneutralität erklären: Zwei Ziele beeinflussen sich nicht, zum Beispiel ein besseres Betriebsklima und weniger Papierverbrauch.", 2,
    [K("WISO.02.05"), R("P-GRUNDLAGE"), B("2025W-A6")])

L.sp("WISO-2-4-3", "Ökonomisches Prinzip: Maximalprinzip und Minimalprinzip",
     "Maximal- und Minimalprinzip erklären und an Fällen aus dem Betrieb unterscheiden.",
     G2, ["ZB.wiso-oekonomisches-prinzip"], T("2025S-A3"),
     hinweis="Neuer Stichpunkt (Zusatzbaustein): Das ökonomische Prinzip steht nicht im Katalog, kam aber 2025S vor; es gehört zur Wirtschaftlichkeit (WISO.02.05.2).")
L.k(1, "Du kannst das Maximalprinzip erklären: Mit gegebenen Mitteln einen möglichst großen Erfolg erzielen, zum Beispiel mit gleichem Personal mehr Umsatz.", 2,
    [K("ZB.wiso-oekonomisches-prinzip")])
L.k(2, "Du kannst das Minimalprinzip erklären: Einen vorgegebenen Erfolg mit möglichst geringen Mitteln erreichen, zum Beispiel gleiche Umschlagmenge mit weniger Beschäftigten.", 2,
    [K("ZB.wiso-oekonomisches-prinzip")])
L.k(3, "Du kannst an einem beschriebenen Fall unterscheiden, ob nach dem Maximal- oder dem Minimalprinzip gehandelt wurde oder nach keinem, wenn Mitteleinsatz und Ergebnis zugleich steigen.", 2,
    [K("ZB.wiso-oekonomisches-prinzip"), B("2025S-A3")])

# ---------------------------------------------------------------- 2-5 Verbindungen, Verbände, Behörden
L.tb("WISO-2-5", "Unternehmensverbindungen, Organisationen und Behörden", "Wie sich Unternehmen zusammenschließen, wie Wirtschaft und Berufe organisiert sind und welche Aufgaben Behörden haben.")

L.sp("WISO-2-5-1", "Wirtschaftliche Verflechtungen: Konzern, Kartell, Fusion",
     "Konzern, Kartell und Fusion danach unterscheiden, ob die Unternehmen rechtlich und wirtschaftlich selbstständig bleiben, und Folgen von Zusammenschlüssen erklären.",
     G2, ["WISO.02.04.1", "WISO.02.04.2", "WISO.02.04.3"],
     T("2022S-A20", "2023W-A23", "2024S-A22", "2025W-A28"),
     hinweis="2024S-WISO-A22 fragt nach einem „anmeldepflichtigen“ Kartell; die IHK-Lösung (Normen- und Typenkartell) gibt die Rechtslage vor 2005 wieder. Seitdem gibt es keine Anmeldepflicht mehr; Unternehmen prüfen selbst, ob eine Absprache ausnahmsweise erlaubt ist (P35 Nr. 7 sinngemäß).")
L.k(1, "Du kannst den Konzern erklären und erkennen: Rechtlich selbstständige Unternehmen stehen unter einheitlicher Leitung und sind wirtschaftlich nicht mehr selbstständig, zum Beispiel wenn ein Unternehmen ein anderes kauft und unter dessen Firma weiterführt.", 2,
    [K("WISO.02.04.1"), B("2022S-A20")])
L.k(2, "Du kannst das Kartell erklären: Selbstständige Unternehmen derselben Stufe sprechen sich ab, zum Beispiel über Preise, Gebiete oder Quoten, um den Wettbewerb zu beschränken; solche Absprachen sind grundsätzlich verboten, harmlose wie gemeinsame Normen und Typen können erlaubt sein.", 2,
    [K("WISO.02.04.2"), B("2023W-A23"), B("2024S-A22")])
L.k(3, "Du kannst die Fusion erklären: Unternehmen verschmelzen zu einem einzigen und verlieren ihre rechtliche und wirtschaftliche Selbstständigkeit.", 2,
    [K("WISO.02.04.3")])
L.k(4, "Du kannst Auswirkungen einer Fusion erklären: Rationalisierung und Einsparungen, breitere Kapitalbasis und bessere Finanzierung, mehr Marktmacht; möglich ist auch der Abbau von Arbeitsplätzen.", 2,
    [K("WISO.02.04.3"), B("2025W-A28")])
L.k(5, "Du kannst Arbeitsgemeinschaft (Zusammenarbeit für einen bestimmten Auftrag auf Zeit) und Interessengemeinschaft (Zusammenarbeit auf Dauer für einen gemeinsamen Zweck, zum Beispiel Forschung) vom Konzern unterscheiden: In beiden bleiben die Unternehmen rechtlich selbstständig und arbeiten nur in einem Teilbereich zusammen, ohne unter eine einheitliche Leitung zu treten.", 2,
    [K("WISO.02.04.1"), B("2022S-A20")])
L.k(6, "Du kannst die Aufgabe des Bundeskartellamts erklären: Es prüft große Zusammenschlüsse und verfolgt verbotene Kartelle.", 2,
    [K("WISO.02.04.2")])
L.grenze("Einzelheiten des Kartellrechts (GWB) und der Fusionskontrolle, etwa Schwellenwerte, Fristen oder Ausnahmetatbestände, gehören nicht dazu.",
         "Der Katalog nennt Kartell und Fusion ohne Operator (WISO.02.04.2, WISO.02.04.3: Stufe 2, erkennen und erklären); Rechtsdetails gehen darüber hinaus (G3) und sind in Auswahlaufgaben ohne Hilfsmittel kaum abfragbar (G4).",
         ["WISO.02.04.2", "WISO.02.04.3"])

L.sp("WISO-2-5-2", "Branchenorganisation, Wirtschaftsorganisationen, berufsständische Vertretungen und Ehrenamt",
     "Einem Betrieb über seine Branche Tarifpartner und Branchenverband zuordnen, berufsständische Vertretungen einordnen und ehrenamtliche Mitwirkung beschreiben.",
     G2, ["WISO.02.07.1", "WISO.02.07.2", "WISO.02.07.3", "WISO.02.07.4"], [],
     hinweis="Ziele und Aufgaben von Gewerkschaften, Arbeitgeberverbänden, Kammern (IHK, Handwerkskammer) und Wirtschaftsverbänden stehen in WISO-1-5-3; hier nur die Zuordnung über die Branche.")
L.k(3, "Du kannst einem Betrieb anhand seiner Branche seine Tarifpartner und seinen Branchenverband zuordnen, zum Beispiel in der Metall- und Elektroindustrie die IG Metall und den Arbeitgeberverband der Metall- und Elektroindustrie, für einen IT-Betrieb den Wirtschaftsverband Bitkom, der keine Tarifverträge abschließt.", 2,
    [K("WISO.02.07.1"), K("WISO.02.07.2")])
L.k(4, "Du kannst ehrenamtliche Mitwirkung am Beispiel des Prüfungsausschusses der Kammer erklären: Arbeitgeber, Arbeitnehmer und Lehrkräfte nehmen dort ehrenamtlich die Prüfungen ab.", 2,
    [K("WISO.02.07.4")])
L.k(6, "Du kannst berufsständische Vertretungen erklären: Kammern bestimmter Berufe, zum Beispiel der Ärzte oder Rechtsanwälte, die ihre Mitglieder vertreten und die Berufsausübung überwachen.", 2,
    [K("WISO.02.07.3")])

L.sp("WISO-2-5-3", "Behörden und Verwaltungen: Ziele und Aufgaben",
     "Die Ziele von Behörden von denen der Betriebe unterscheiden und Behörden ihre Aufgaben zuordnen.",
     G2, ["WISO.02.08"], [],
     hinweis="Handelsregister beim Amtsgericht: WISO-2-2-4-K1; Gewerbeaufsicht und Arbeitsschutz: WISO-3-1-1; Bundeskartellamt: WISO-2-5-1-K6.")
L.k(1, "Du kannst erklären, dass Behörden und Verwaltungen Gesetze ausführen und dem Gemeinwohl dienen, während erwerbswirtschaftliche Betriebe Gewinn anstreben.", 2,
    [K("WISO.02.08")])
L.k(2, "Du kannst Behörden ihre Aufgabe zuordnen: Gewerbeamt (Anmeldung eines Gewerbes, nicht zu verwechseln mit der Gewerbeaufsicht für den Arbeitsschutz), Finanzamt (Steuern), Agentur für Arbeit (Arbeitsvermittlung und Arbeitslosengeld).", 2,
    [K("WISO.02.08")])
L.k(3, "Du kannst die drei Ebenen der öffentlichen Verwaltung unterscheiden: Bund (zum Beispiel die Bundesagentur für Arbeit mit den örtlichen Agenturen für Arbeit), Länder (zum Beispiel die Finanzämter) und Gemeinden und Städte (zum Beispiel das Gewerbeamt).", 2,
    [K("WISO.02.08")])

# ---------------------------------------------------------------- alt → neu
A = L.a
A("WISO-2-1-1-K6", "gestrichen", None, "K3: weder Katalog noch Beleg (Maßnahmen, die den Umsatz kurzfristig steigern)")
A("WISO-2-1-1-K4", "verschoben", "WISO-2-1-1-K2", "Prüfer WISO-2 Nr. 10: Summe aus K1 und K2; Beispiel IT-Dienstleister und Beleg 2024S-WISO-A9 in K2")
A("WISO-2-1-2-K1", "verschoben", "WISO-2-1-2-K2", "Prüfer WISO-2 Nr. 11: betriebliche Arbeitsteilung steckt in K2 (mit Beispiel)")
A("WISO-2-1-3-K6", "verschoben", "WISO-2-1-3-K3", "Prüfer WISO-2 Nr. 12: Sozialstaatsprinzip in die Aufgaben des Staates eingebaut")
A("WISO-2-5-2-K5", "verschoben", "WISO-1-5-3-K5", "Prüfer WISO-2 Nr. 8, D6: Kammern und Wirtschaftsverbände wohnen in WISO-1-5-3; hier nur die Zuordnung über die Branche (K3)")
A("WISO-2-1-3-K5", "verschoben", "WISO-2-1-4-K4", "Konjunkturbelebung steht im neuen Stichpunkt Konjunktur (Zusatzbaustein)")
A("WISO-2-2-2-K4", "verschoben", "WISO-2-2-4-K1", "Handelsregister steht im neuen Stichpunkt Kaufmann, Firma und Handelsregister")
A("WISO-2-2-3-K4", "gestrichen", None, "P32: Ergebnis kontrollieren ist Prüfungstechnik, keine Können-Aussage")
A("WISO-2-3-1-K1", "verschoben", "WISO-2-2-5-K1", "Stichpunkt in den Block Rechtsform und Aufbau verschoben (F4); auf Stablinie und Sparte beschränkt, Einlinien-, Mehrlinien- und Matrixsystem in AP1-2-4-2 (E2, P47)")
A("WISO-2-3-1-K2", "gestrichen", None, "E2/P36: Einlinien- und Mehrliniensystem unterscheiden steht in AP1-2-4-2-K2")
A("WISO-2-3-1-K3", "verschoben", "WISO-2-2-5-K2", "Stichpunkt verschoben (F4)")
A("WISO-2-3-1-K4", "verschoben", "WISO-2-2-5-K3", "Stichpunkt verschoben (F4)")
A("WISO-2-3-1-K5", "gestrichen", None, "E2/P47: Matrixorganisation steht in AP1-2-4-2 (WISO.02.03.3 gedeckt)")
A("WISO-2-3-1-K6", "verschoben", "WISO-2-2-5-K4", "auf Stablinie und Sparte beschränkt; Vor- und Nachteile der übrigen Formen in AP1-2-4-2-K3")
A("WISO-2-3-2-K5", "gestrichen", None, "Prüfer WISO-2 Nr. 30: Stellenbeschreibung weder im Katalog (Aufgabenteilung) noch belegt; Kür nicht angelegt (D11)")
for n in range(1, 5):
    A(f"WISO-2-3-2-K{n}", "verschoben", f"WISO-2-2-6-K{n}", "Stichpunkt in den Block Rechtsform und Aufbau verschoben (F4: der Block Aufbau- und Ablauforganisation hatte nur zwei Stichpunkte)")
A("WISO-2-4-2-K1", "gestrichen", None, "E2/P36: ökonomische, ökologische und soziale Ziele einteilen steht in AP1-2-4-1-K2 und -K3")
A("WISO-2-4-2-K2", "gestrichen", None, "E2/P36: das ökologische Ziel erkennen steht in AP1-2-4-1-K2")
A("WISO-2-5-2-K1", "gestrichen", None, "P31: Ziele und Aufgaben der Gewerkschaften stehen in WISO-1-5-3-K1")
A("WISO-2-5-2-K2", "gestrichen", None, "P31: Aufgaben der Arbeitgeberverbände stehen in WISO-1-5-3-K2")
A("WISO-2-5-4-K1", "verschoben", "WISO-1-4-2-K6", "Zusammenarbeit von Arbeitgeber und Betriebsrat gehört zur Mitbestimmung (WISO-1-4); der Stichpunkt wiederholte sie")
A("WISO-2-5-4-K2", "verschoben", "WISO-1-3-2-K1", "Sachverhalt dem BetrVG zuordnen steht bei den Rechtsquellen")
A("WISO-2-5-4-K3", "verschoben", "WISO-1-4-1-K1", "steht beim Betriebsrat")
A("WISO-2-5-4-K4", "verschoben", "WISO-1-4-1-K5", "Personalrat beim Betriebsrat ergänzt")
A("WISO-2-5-4-K5", "verschoben", "WISO-1-4-2-K5", "Einigungsstelle und Verbot des Arbeitskampfs stehen bei der Einigungsstelle")

RS = L.rahmen_satz
RS("WISO-2-1-1", "Mehr als das Zuordnen und Erklären der Begriffe war nicht verlangt.", "angepasst", "Die Tiefe folgt aus dem Katalog (Stufe 2 ohne Operator, Regelwerk) und Z3b, nicht aus fehlenden Belegen (E6)")
RS("WISO-2-1-3", "Wirtschaftstheorie und Kennzahlen der Volkswirtschaft waren nicht gefragt.", "gestrichen", "Überholt: 2025S-WISO-A4 fragt nach BIP, Inflation und Arbeitslosenquote (Zusatzbaustein ZB.wiso-konjunktur)")
RS("WISO-2-2-1", "In den ausgewerteten Prüfungen wurde nur die GmbH gefragt.", "gestrichen", "Überholt: 2023S-WISO-A13 (KG) und 2023S-WISO-A23 (OHG, AG, eG)")
RS("WISO-2-2-2", "Die AG und gemeinnützige Organisationen nennt der Katalog ebenfalls; dafür gibt es in den ausgewerteten Prüfungen keinen Beleg.", "gestrichen", "Überholt: 2023S-WISO-A21/A22 (AG); gemeinnützige Organisationen bleiben nach E6 mit Katalogtiefe")
RS("WISO-2-3-1", "Du musst die Formen am Bild erkennen und ihre Merkmale kennen; ein Organigramm selbst zeichnen musst du in dieser Prüfung nicht.", "übernommen", "Prüfungsformat G4: ca. 30 maschinell auswertbare Aufgaben, kein Zeichnen")
RS("WISO-2-4-1", "Die Formeln stehen nicht in der Aufgabe, du musst sie auswendig können.", "übernommen", "In keiner der acht Prüfungen war eine Formel vorgegeben")
RS("WISO-2-5-1", "Es genügt, die Formen danach zu unterscheiden, ob die Unternehmen rechtlich und wirtschaftlich selbstständig bleiben.", "angepasst", "Belegt sind zusätzlich Auswirkungen einer Fusion (2025W-WISO-A28) und Kartellarten (2024S-WISO-A22)")

L.gesch("WISO.02.01.2", "primärer, sekundärer, tertiärer Sektor", {"primär": ["WISO-2-1-1-K1"], "sekundär": ["WISO-2-1-1-K1"], "tertiär": ["WISO-2-1-1-K1"]})
L.gesch("WISO.02.06", "betriebliche und gesamtwirtschaftliche Arbeitsteilung", {"betrieblich": ["WISO-2-1-2-K2"], "gesamtwirtschaftlich": ["WISO-2-1-2-K2"]})
L.gesch("WISO.02.06.2", "Möglichkeiten und Grenzen der Sozialen Marktwirtschaft", {"Möglichkeiten": ["WISO-2-1-3-K3"], "Grenzen": ["WISO-2-1-3-K4"]})
L.gesch("WISO.02.02", "Personen- und Kapitalgesellschaften", {"Personengesellschaften": ["WISO-2-2-1-K1"], "Kapitalgesellschaften": ["WISO-2-2-2-K2", "WISO-2-2-2-K5"]})
L.gesch("WISO.02.03.1", "Einlinien- bzw. Mehrlinien-, Stabliniensystem", {"Stablinie": ["WISO-2-2-5-K2"], "Einlinie/Mehrlinie": ["WISO-2-2-5-K1"]})
L.gesch("ZB.wiso-oekonomisches-prinzip", "Maximal- und Minimalprinzip", {"Maximalprinzip": ["WISO-2-4-3-K1"], "Minimalprinzip": ["WISO-2-4-3-K2"]})

L.write(meta(kerntest="Alle 59 WiSo-Teilaufgaben dieses Ordners gegen die Musterlösungen gelesen. Lücken geschlossen: Konjunktur (neu, Zusatzbaustein), Kaufmann und Handelsregister (neu, Zusatzbaustein), ökonomisches Prinzip (neu), KG und Rechtsformen-Merkmale, AG als Ziel Dividende, Globalisierung fördern. Organisation und Ziele bauen auf AP1-2-4-1 und AP1-2-4-2 auf. Unabhängige Prüfung vom 16.10.2026 (umbau/berichte/WISO-2-pruefer.md, 31 Funde) eingearbeitet: GmbH-Einzahlung berichtigt, juristische Person des Privatrechts, eG, Konjunkturphasen, Interessengemeinschaft, Vor- und Nachteile von Mehrlinien und Matrix (neu gegenüber AP1-2-4-2), Doppelungen zu WISO-1-5-3 gekürzt (D6)."))
