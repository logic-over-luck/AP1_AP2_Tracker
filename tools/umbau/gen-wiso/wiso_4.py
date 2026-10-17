import sys; sys.path.insert(0, sys.path[0])
from lpw import LPW, B, T, K, R, meta

L = LPW("WISO-4", "Umweltschutz", ["G.WISO.04"])
G4 = ["G.WISO.04"]

# ---------------------------------------------------------------- 4-1 Ressourcen und Nachhaltigkeit
L.tb("WISO-4-1", "Ressourcen schonen und nachhaltig wirtschaften", "Welche Umweltbelastungen IT verursacht, wie man Energie, Material und Betriebsstoffe sparsam einsetzt, was nachhaltiges Wirtschaften heißt und woran man umweltfreundliche Produkte erkennt.")

L.sp("WISO-4-1-1", "Umweltrisiken von IT-Prozessen; Speicher- und Printmedien und Betriebsstoffe sparsam einsetzen",
     "Umweltrisiken der IT kennen und Maßnahmen beschreiben, mit denen Energie, Speicher- und Printmedien und Betriebsstoffe sparsam eingesetzt werden.",
     G4, ["WISO.04.01.1", ("WISO.04.01.2", "rationelle Ressourcenverwendung"), "WISO.04.01.2.2", "WISO.04.05.2", "WISO.04.05.3"],
     T("2021W-A19", "2025S-A29"), baut_auf=["AP1-4-3-3"],
     hinweis="Energie sparen am Arbeitsplatz (Standby vermeiden, Energielabel, Energiesparmodus) steht in AP1-4-3-3 (WISO.04.01.2.1 gedeckt, P47). Gemischte Maßnahmen als nachhaltig oder nicht nachhaltig unterscheiden: WISO-4-1-2.")
L.k(1, "Du kannst Umweltrisiken von IT-Prozessen mit ihrer Ursache nennen: USV-Anlagen (Blei- oder Lithium-Akkus mit Schadstoffen, Brand- und Auslaufgefahr, gehören in die Rücknahme statt in den Restmüll), Server und Kühlung (hoher Stromverbrauch), Altgeräte (Schadstoffe, seltene Rohstoffe).", 1,
    [K("WISO.04.01.1")], alt=("angepasst", "Prüfer WISO-4 Nr. 1: Risiken mit Ursache konkretisiert; Stufe bleibt 1 (WISO.04.01 „wahrnehmen“, kein Beleg, D1)"))
L.k(3, "Du kannst den sparsamen Umgang mit Speicher- und Printmedien beschreiben: nur drucken, was nötig ist, beidseitig drucken, Recyclingpapier statt Hochglanzpapier verwenden, Datenträger weiterverwenden.", 2,
    [K("WISO.04.01.2"), K("WISO.04.01.2.2"), B("2021W-A19")], alt=("angepasst", "Prüfer WISO-4 Nr. 7: auf Speicher- und Printmedien beschränkt; Maßnahmen unterscheiden nur noch in WISO-4-1-2-K2"))
L.k(6, "Du kannst Roh-, Hilfs- und Betriebsstoffe unterscheiden: Rohstoff = Hauptbestandteil des Produkts, Hilfsstoff = Nebenbestandteil des Produkts, Betriebsstoff = wird bei der Herstellung verbraucht, ohne ins Produkt einzugehen (zum Beispiel Strom); alle drei sind sparsam und effektiv einzusetzen.", 2,
    [K("WISO.04.05.2")], alt=("angepasst", "Prüfer WISO-4 Nr. 11: Grundlage vor K4 gestellt, „sparsam einsetzen“ aus K4 übernommen"))
L.k(4, "Du kannst erklären, welche Betriebsstoffe gekennzeichnet und getrennt gelagert werden müssen und warum: Gefahrstoffe wie Reinigungs- und Lösungsmittel oder Druckluftsprays tragen Gefahrenpiktogramme und werden getrennt von anderen Stoffen gelagert, damit sie nicht auslaufen, miteinander reagieren oder sich entzünden.", 2,
    [K("WISO.04.05.2")], alt=("angepasst", "Prüfer WISO-4 Nr. 10/11: welche Stoffe und warum; nur noch Kennzeichnung und Lagerung"))
L.k(5, "Du kannst an einem Beispiel zeigen, wie Ressourcenverbrauch und Umweltschutz zusammen gedacht werden, zum Beispiel durch Strom aus regenerativen Quellen, LED-Beleuchtung oder optimierte Transportwege.", 2,
    [K("WISO.04.05.3"), B("2025S-A29")], alt=("angepasst", "zeigen = erklären an Beispiel; Beispiele aus 2025S"))

L.sp("WISO-4-1-2", "Nachhaltigkeit: Einkauf und Lieferantenauswahl, Auswirkungen auf Umwelt, Pflanzen, Tiere und Lebensräume",
     "Nachhaltigkeit erklären, nachhaltige Maßnahmen erkennen und beim Einkauf Kriterien der Nachhaltigkeit berücksichtigen.",
     G4, ["WISO.04.04.1", "WISO.04.05.1", ("WISO.04.05.3", "nachhaltige Maßnahmen"), ("WISO.04.01.3", "Recycling als nachhaltige Maßnahme")],
     T("2023W-A29", "2024S-A29", "2023W-A30"), baut_auf=["AP1-2-4-1", "PB1-1-2-1"],
     hinweis="Die drei Seiten der Nachhaltigkeit (ökonomische, ökologische und soziale Ziele) stehen in AP1-2-4-1, Green IT (umweltschonend herstellen, betreiben, entsorgen) in PB1-1-2-1. Auswirkungen auf Umwelt, Pflanzen, Tiere und Lebensräume wohnen hier; WISO-5-3-1 verweist hierher und behält nur den Zeithorizont bei IT-Lösungen.")
L.k(1, "Du kannst Nachhaltigkeit erklären: so wirtschaften, dass heutige Bedürfnisse gedeckt werden, ohne die Lebensgrundlagen künftiger Generationen zu gefährden.", 2,
    [K("WISO.04.04.1")])
L.k(2, "Du kannst nachhaltige von nicht nachhaltigen Maßnahmen unterscheiden: Maßgeblich ist, ob nachwachsende statt endlicher Rohstoffe genutzt, Energie gespart und Stoffe im Kreislauf gehalten werden, zum Beispiel Behälter aus nachwachsenden Rohstoffen, Recycling von Verpackungsabfällen, Ladesäulen für Elektroautos; nicht nachhaltig sind Flugreisen statt Bahn oder der billigste Einkauf ohne Blick auf die Herkunft. Auch schonend abgebautes Rohöl bleibt ein endlicher Rohstoff, und die Herkunft allein (Ausland, Entwicklungsland) macht ein Produkt nicht nachhaltig.", 2,
    [K("WISO.04.05.3"), K("WISO.04.01.3"), B("2023W-A29"), B("2024S-A29")], alt=("angepasst", "Prüfer WISO-4 Nr. 6: Prinzip nachwachsend statt endlich und Kreislauf ergänzt (Distraktoren 2024S-A29)"))
L.k(3, "Du kannst Kriterien für einen nachhaltigen Einkauf und die Lieferantenauswahl erklären: Energieverbrauch, Lebensdauer, Reparierbarkeit, Umweltzeichen, Rücknahme von Altgeräten, kurze Transportwege, zum Beispiel ein lokaler statt ein ferner Lieferant.", 2,
    [K("WISO.04.05.1"), B("2023W-A30")])
L.k(4, "Du kannst Auswirkungen eines Produkts oder einer Entscheidung auf Umwelt, Pflanzen, Tiere und Lebensräume erklären, zum Beispiel durch Rohstoffabbau, Flächenverbrauch, Emissionen und Abfall.", 2,
    [K("WISO.04.04.1")])

L.sp("WISO-4-1-3", "Umweltzeichen: Blauer Engel und andere Kennzeichnungen",
     "Erklären, wofür der Blaue Engel steht, ihn von anderen Zeichen auf Produkten und Verpackungen abgrenzen und den Nutzen von Recyclingpapier erklären.",
     G4, [("WISO.04.05.1", "Umweltzeichen beim Einkauf"), ("WISO.04.01.3", "Recycling-Symbol"), ("WISO.04.05.2", "Rohstoffe sparen mit Recyclingpapier")],
     T("2021W-A20", "2023S-A25", "2025W-A30", "2025S-A30"), baut_auf=["AP1-4-3-3"],
     hinweis="Dass es Gütesiegel für Energieeffizienz gibt (EU-Energielabel, Energy Star, Blauer Engel als Beispiel), steht in AP1-4-3-3. Das CE-Zeichen steht in WISO-3-3-2. Früher Stichpunkt WISO-4-3-2.")
L.k(1, "Du kannst zutreffende von unzutreffenden Aussagen zum Blauen Engel unterscheiden: Er ist das freiwillige Umweltzeichen der Bundesregierung für Produkte, die über ihren Lebensweg umweltschonender sind als vergleichbare, zum Beispiel aus schadstoffarmen Rohstoffen umweltschonend hergestellt; er bedeutet nicht „besonders haltbar“, „besonders sicher“, „preisgekrönt“ oder „nur über das Duale System zu entsorgen“.", 2,
    [K("WISO.04.05.1"), B("2021W-A20"), B("2025W-A30")])
L.k(3, "Du kannst Zeichen auf Produkten und Verpackungen unterscheiden: Blauer Engel (umweltschonenderes Produkt), drei Pfeile im Kreis (Recycling-Symbol: Material oder Verpackung ist wiederverwertbar), Fairtrade (fairer Handel).", 2,
    [K("WISO.04.05.1"), K("WISO.04.01.3"), B("2025S-A30")])
L.k(4, "Du kannst erklären, wie Recyclingpapier mit dem Blauen Engel der Umwelt nützt: Es wird aus Altpapier hergestellt und spart Rohstoffe (Holz) sowie Wasser und Energie bei der Papiererzeugung; es senkt nicht den Papierverbrauch, die Kosten oder den Energieverbrauch im eigenen Betrieb.", 2,
    [K("WISO.04.05.2"), B("2023S-A25")])

# ---------------------------------------------------------------- 4-2 Abfall, Verpackung, Umweltrecht
L.tb("WISO-4-2", "Abfall, Verpackung und Umweltrecht", "Wie Abfall vermieden, getrennt und entsorgt wird, wie Verpackungen über das Duale System zurückkommen und welche Regeln und Folgen das Umweltrecht kennt.")

L.sp("WISO-4-2-1", "Abfall vermeiden, verringern, trennen und verwerten; IT-typische Abfälle erfassen, lagern und entsorgen",
     "Die Abfallhierarchie des Kreislaufwirtschaftsgesetzes anwenden, Recycling erklären und IT-typische Abfälle richtig erfassen, lagern und entsorgen.",
     G4, ["WISO.04.06", ("WISO.04.01.3", "Recycling"), "WISO.04.01.4", "WISO.04.02.1", "WISO.04.02.1.1", "WISO.04.02.1.2"],
     T("2025S-A29", "2022S-A28"),
     hinweis="Verpackungen vermeiden (2023S-A24) steht in WISO-4-2-2, Emissionen vermeiden in WISO-4-2-3.")
L.k(1, "Du kannst Maßnahmen den Stufen der Abfallhierarchie des Kreislaufwirtschaftsgesetzes (§ 6 KrWG) zuordnen: Vermeidung (auch Abfallmenge und Schadstoffe verringern), Vorbereitung zur Wiederverwendung, Recycling, sonstige, zum Beispiel energetische Verwertung, Beseitigung; grundsätzlich hat die höhere Stufe Vorrang, Trennen und Entsorgen ersetzen kein Vermeiden.", 2,
    [K("WISO.04.06"), K("WISO.04.01.4"), B("2025S-A29")], alt=("angepasst", "Prüfer WISO-4 Nr. 12, D12: fünfstufige Abfallhierarchie § 6 KrWG statt vereinfachter Rangfolge"))
L.k(2, "Du kannst erklären, was Recycling ist, und es von anderen Maßnahmen unterscheiden: Abfälle nach Material trennen und als Rohstoff wiederverwerten, zum Beispiel Verpackungen getrennt dem Dualen System zuführen.", 2,
    [K("WISO.04.01.3"), K("WISO.04.01.4"), B("2022S-A28")])
L.k(4, "Du kannst erklären, wie IT-typische Abfälle (Altgeräte, Datenträger, Kabel, Batterien und Akkus, Tonerkartuschen, Verpackungen) nach Art getrennt erfasst, gelagert und entsorgt werden: gewerbliche Altgeräte über die Rücknahme durch Hersteller oder Händler oder einen zertifizierten Entsorgungsfachbetrieb; kommunale Sammelstellen nehmen in der Regel nur Geräte aus privaten Haushalten an.", 2,
    [K("WISO.04.02.1"), K("WISO.04.02.1.1"), K("WISO.04.02.1.2")], alt=("angepasst", "Prüfer WISO-4 Nr. 13/14: Liste aus K3 aufgenommen; Entsorgungswege für gewerbliche Altgeräte"))
L.k(5, "Du kannst erklären, dass Datenträger vor der Entsorgung sicher gelöscht oder zerstört werden müssen.", 2,
    [K("WISO.04.02.1.2")])
L.k(6, "Du kannst erklären, dass Elektrogeräte und Akkus nicht in den Restmüll gehören und Akkus gegen Kurzschluss gesichert gelagert werden.", 2,
    [K("WISO.04.02.1.2")])
L.grenze("Keine Sicherheitsstufen oder Normen der Datenträgervernichtung.",
         "G4: Normnummern und Sicherheitsstufen sind ohne Hilfsmittel nicht abfragbar; der Katalog verlangt nur Lagerung und Entsorgung von Datenträgern (Prüfer WISO-4 Nr. 15).",
         ["WISO.04.02.1.2"])

L.sp("WISO-4-2-2", "Verpackungen: Duales System, Teilnahmepflicht und Grundsätze",
     "Das Duale System und die Pflicht zur Teilnahme erklären und Grundsätze für umweltfreundliche Verpackung anwenden.",
     G4, ["WISO.04.03.1", ("WISO.04.06", "Verpackung vermeiden")],
     T("2022S-A28", "2023S-A24"),
     hinweis="Neuer Stichpunkt; das Duale System stand vorher in WISO-4-3-1. Das Recycling-Symbol steht in WISO-4-1-3, die Abfallhierarchie in WISO-4-2-1.")
L.k(1, "Du kannst das Duale System erklären: ein privatwirtschaftlich organisiertes System mehrerer Betreiber, das gebrauchte Verkaufsverpackungen von privaten Endverbrauchern (Haushalte und vergleichbare Stellen wie Büros) neben der öffentlichen Müllabfuhr sammelt, sortiert und verwertet.", 2,
    [K("WISO.04.03.1"), B("2022S-A28")], alt=("angepasst", "Teilnahmepflicht in eigene Aussage K4 (Prüfer WISO-4 Nr. 16, Katalog „Teilnahme am Dualen System“)"))
L.k(3, "Du kannst Grundsätze für Verpackungen erklären: unnötige Verpackung vermeiden statt entsorgen, Mehrweg vor Einweg, sortenreine und recycelbare Materialien; Papier oder recyceltes Plastik ist nicht automatisch umweltfreundlich.", 2,
    [K("WISO.04.06"), B("2023S-A24")])
L.k(4, "Du kannst die Pflicht zur Teilnahme am Dualen System erklären: Wer mit Ware befüllte Verpackungen, die typischerweise bei privaten Endverbrauchern anfallen, als Erster in Verkehr bringt (Hersteller, auch Online-Händler), muss sich nach dem Verpackungsgesetz an einem dualen System beteiligen und im Verpackungsregister registrieren.", 2,
    [K("WISO.04.03.1")])

L.sp("WISO-4-2-3", "Immissionsschutz, Verursacherprinzip und Rechtsfolgen",
     "Emission und Immission unterscheiden, den Zweck des Immissionsschutzrechts erklären und Verursacherprinzip und Rechtsfolgen bei Verstößen kennen.",
     G4, ["WISO.04.03.2", "WISO.04.07", "ZB.wiso-verursacherprinzip"],
     T("2025W-A29", "2022S-A27", "2024S-A30"),
     hinweis="Früher Teil von WISO-4-3-1. Vermeiden vor Verwerten und Beseitigen (Distraktoren in 2022S-A27 und 2024S-A30): WISO-4-2-1. Allgemeine Folgen von Pflichtverstößen stehen je Ordner nur spezifisch (Ausbildung WISO-1-1-4, Compliance WISO-5-3-2).")
L.k(1, "Du kannst Emission (was eine Quelle abgibt) und Immission (was auf Menschen, Tiere, Pflanzen und Umwelt einwirkt) unterscheiden.", 2,
    [K("WISO.04.03.2")])
L.k(2, "Du kannst erklären, dass zu umweltbelastenden Emissionen nicht nur Abgase gehören, sondern auch Lärm, Erschütterungen, Licht, Wärme und Strahlen, und dass Vermeiden vor Verringern kommt (höhere Schornsteine lösen nichts).", 2,
    [K("WISO.04.03.2"), B("2025W-A29")])
L.k(3, "Du kannst erklären, dass das Bundes-Immissionsschutzgesetz vor schädlichen Umwelteinwirkungen schützt, technische Anleitungen, zum Beispiel zu Lärm und Luft, die Anforderungen im Einzelnen festlegen und dafür der Betreiber der Anlage (gegebenenfalls mit einem Immissionsschutzbeauftragten) verantwortlich ist, überwacht von der Behörde, nicht die Sicherheitsbeauftragte.", 2,
    [K("WISO.04.03.2")], alt=("angepasst", "Prüfer WISO-4 Nr. 19: Zuständigkeit (Distraktor 2025W-A29)"))
L.k(4, "Du kannst umweltspezifische Folgen von Verstößen gegen Umweltvorschriften erklären: Bußgeld, Strafe für Umweltstraftaten, behördliche Anordnungen bis zur Stilllegung einer Anlage und die Pflicht, den Schaden zu beseitigen oder zu ersetzen.", 2,
    [K("WISO.04.07")], alt=("angepasst", "Prüfer WISO-4 Nr. 20, D6: nur das Umweltspezifische"))
L.k(5, "Du kannst das Verursacherprinzip erklären und von anderen Aussagen unterscheiden: Wer einen Umweltschaden verursacht, trägt die Kosten für seine Vermeidung und Beseitigung, nicht die Allgemeinheit.", 2,
    [K("ZB.wiso-verursacherprinzip"), B("2022S-A27"), B("2024S-A30")])
L.grenze("Keine Grenzwerte oder Inhalte der TA Lärm und TA Luft; die im Katalog genannte TA Abfall ist seit 2009 aufgehoben (Deponieverordnung).",
         "G4: Grenzwerte und Einzelinhalte technischer Anleitungen sind ohne Hilfsmittel nicht abfragbar; der Katalog nennt die technischen Anleitungen nur als Beispiele (Prüfer WISO-4 Nr. 18).",
         ["WISO.04.03.2"])

# ---------------------------------------------------------------- alt → neu
A = L.a
A("WISO-4-1-1-K2", "gestrichen", None, "E2/P47: unnötige Gerätelaufzeiten vermeiden steht in AP1-4-3-3-K5 (WISO.04.01.2.1 gedeckt)")
A("WISO-4-1-2-K5", "gestrichen", None, "Prüfer WISO-4 Nr. 8: drei Seiten der Nachhaltigkeit nicht in WISO.04.04.1, Ziele einordnen steht in AP1-2-4-1-K2 (E2, baut_auf)")
A("WISO-4-1-2-K6", "gestrichen", None, "E2/P36: Kosten über die ganze Nutzungsdauer stehen in AP1-3-1-2")
A("WISO-4-2-1-K3", "verschoben", "WISO-4-2-1-K4", "Prüfer WISO-4 Nr. 13: Liste IT-typischer Abfälle in K4 aufgegangen")
A("WISO-4-3-2-K1", "verschoben", "WISO-4-1-3-K1", "Stichpunkt in den Block Ressourcen und Nachhaltigkeit verschoben (F4: der Block Umweltrecht und Umweltzeichen hatte nur zwei Stichpunkte)")
A("WISO-4-3-2-K2", "verschoben", "WISO-4-1-3-K1", "mit K1 zusammengefasst (Bedeutung erklären und Aussagen unterscheiden)")
A("WISO-4-3-2-K3", "verschoben", "WISO-4-1-3-K1", "Stichpunkt verschoben (F4); Prüfer WISO-4 Nr. 3: „freiwillig, staatlich“ in K1 aufgegangen, „Preis“ ohne Katalog- und Prüfungsbezug entfallen")
A("WISO-4-3-2-K4", "verschoben", "WISO-4-1-3-K3", "Stichpunkt verschoben (F4); Recycling-Symbol und Fairtrade aus 2025S ergänzt; Prüfer WISO-4 Nr. 4, D6: CE-Zeichen nur noch in WISO-3-3-2")
A("WISO-4-3-1-K1", "verschoben", "WISO-4-2-2-K1", "Duales System steht im neuen Stichpunkt Verpackungen")
for alt, neu in [("K2", "K1"), ("K3", "K2"), ("K4", "K3"), ("K5", "K4"), ("K6", "K5")]:
    A(f"WISO-4-3-1-{alt}", "verschoben", f"WISO-4-2-3-{neu}", "Stichpunkt in den Block Abfall, Verpackung und Umweltrecht verschoben (F4: der Block Abfall hatte nur einen Stichpunkt)")

RS = L.rahmen_satz
RS("WISO-4-1-1", "Verlangt sind Beispiele und Maßnahmen, keine Verbrauchsrechnungen.", "angepasst", "Energie- und Kostenrechnungen stehen in AP1-4-2-3; WiSo verlangt nach Katalog (Stufe 1–2) Beispiele und Maßnahmen")
RS("WISO-4-3-1", "Grenzwerte und Paragrafen waren nicht gefragt.", "angepasst", "Grenze aus G4 statt aus fehlenden Belegen (E6); jetzt als Grenze an WISO-4-2-3")
RS("WISO-4-3-2", "Der WiSo-Teil des Katalogs nennt kein Umweltzeichen.", "angepasst", "Der Blaue Engel ist belegt (2021W, 2023S, 2025W) und fällt unter WISO.04.05.1 (Nachhaltigkeit beim Einkauf berücksichtigen)")

L.gesch("WISO.04.01.4", "Abfalltrennung und -vermeidung", {"Trennung": ["WISO-4-2-1-K2"], "Vermeidung": ["WISO-4-2-1-K1"]})
L.gesch("WISO.04.03.2", "Lärm, Luft, Abfall", {"Lärm": ["WISO-4-2-3-K2"], "Luft": ["WISO-4-2-3-K3"]})
L.gesch("WISO.04.05.2", "Roh-, Hilfs- und Betriebsstoffe", {"Rohstoffe/Hilfsstoffe/Betriebsstoffe": ["WISO-4-1-1-K6"]})
L.gesch("WISO.04.06", "Abfallvermeidung und -reduzierung", {"Vermeidung": ["WISO-4-2-1-K1"], "Reduzierung": ["WISO-4-2-1-K1"]})

# Kür aus der unabhängigen Prüfung (P49, Hinweisquelle pruefer:wiso-2026-10)
L.kuer_pruefer('WISO-4-2-2', 'Grüner Punkt', 'Der „Grüne Punkt“ ist die Marke eines Systembetreibers des Dualen Systems, kein vorgeschriebenes Zeichen; Pflicht ist die Systembeteiligung, nicht ein Aufdruck.', 'Kür-Vorschlag der unabhängigen Prüfung (P49): möglicher Distraktor bei Zeichenaufgaben; ergänzt WISO-4-2-2-K4')

L.write(meta(kerntest="Alle 19 WiSo-Teilaufgaben dieses Ordners gegen die Musterlösungen gelesen. Lücken geschlossen: Recycling-Symbol und Verpackungsgrundsätze (neuer Stichpunkt WISO-4-2-2), Emissionen vermeiden statt verringern, Blauer Engel bei Recyclingpapier. Unabhängige Prüfung (umbau/berichte/WISO-4-pruefer.md, 16.10.2026) eingearbeitet: Distraktoren zu Rohöl/nachwachsenden Rohstoffen, Blauem Engel und Recyclingpapier ergänzt, Zeichen und Folgen von Verstößen entdoppelt, Abfallhierarchie nach § 6 KrWG."))
