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
     hinweis="Energie sparen am Arbeitsplatz (Standby vermeiden, Energielabel, Energiesparmodus) steht in AP1-4-3-3 (WISO.04.01.2.1 gedeckt, P47).")
L.k(1, "Du kannst Umweltrisiken der IT nennen, zum Beispiel die Batterien von USV-Anlagen, den Stromverbrauch von Servern und Kühlung und die Schadstoffe in Altgeräten.", 1,
    [K("WISO.04.01.1")])
L.k(3, "Du kannst den sparsamen Umgang mit Speicher- und Printmedien beschreiben und Maßnahmen unterscheiden, die der Umwelt schaden oder nützen: nur drucken, was nötig ist, beidseitig drucken, Recyclingpapier verwenden, Datenträger weiterverwenden – nicht Hochglanzkataloge oder Einwegbecher.", 2,
    [K("WISO.04.01.2"), K("WISO.04.01.2.2"), B("2021W-A19"), B("2025S-A29")])
L.k(4, "Du kannst erklären, dass Roh-, Hilfs- und Betriebsstoffe sparsam einzusetzen sind und manche gekennzeichnet und getrennt gelagert werden müssen.", 2,
    [K("WISO.04.05.2")])
L.k(5, "Du kannst an einem Beispiel zeigen, wie Ressourcenverbrauch und Umweltschutz zusammen gedacht werden, zum Beispiel durch Strom aus regenerativen Quellen, LED-Beleuchtung oder optimierte Transportwege.", 2,
    [K("WISO.04.05.3"), B("2025S-A29")], alt=("angepasst", "zeigen = erklären an Beispiel; Beispiele aus 2025S"))
L.k(6, "Du kannst Roh-, Hilfs- und Betriebsstoffe unterscheiden: Hauptbestandteil des Produkts, Nebenbestandteil des Produkts, Verbrauch bei der Herstellung ohne Eingang ins Produkt, zum Beispiel Strom.", 2,
    [K("WISO.04.05.2")])

L.sp("WISO-4-1-2", "Nachhaltigkeit: Einkauf und Lieferantenauswahl, Auswirkungen auf Umwelt, Pflanzen, Tiere und Lebensräume",
     "Nachhaltigkeit erklären, nachhaltige Maßnahmen erkennen und beim Einkauf Kriterien der Nachhaltigkeit berücksichtigen.",
     G4, ["WISO.04.04.1", "WISO.04.05.1", ("WISO.04.05.3", "nachhaltige Maßnahmen"), ("WISO.04.01.3", "Recycling als nachhaltige Maßnahme")],
     T("2023W-A29", "2024S-A29", "2023W-A30"))
L.k(1, "Du kannst Nachhaltigkeit erklären: so wirtschaften, dass heutige Bedürfnisse gedeckt werden, ohne die Lebensgrundlagen künftiger Generationen zu gefährden.", 2,
    [K("WISO.04.04.1")])
L.k(2, "Du kannst nachhaltige von nicht nachhaltigen Maßnahmen unterscheiden, zum Beispiel Ladesäulen, Behälter aus nachwachsenden Rohstoffen, Recycling von Verpackungsabfällen gegenüber Flugreisen statt Bahn oder dem billigsten Einkauf ohne Blick auf die Herkunft.", 2,
    [K("WISO.04.05.3"), K("WISO.04.01.3"), B("2023W-A29"), B("2024S-A29")])
L.k(3, "Du kannst Kriterien für einen nachhaltigen Einkauf und die Lieferantenauswahl erklären: Energieverbrauch, Lebensdauer, Reparierbarkeit, Umweltzeichen, Rücknahme von Altgeräten, kurze Transportwege, zum Beispiel ein lokaler statt ein ferner Lieferant.", 2,
    [K("WISO.04.05.1"), B("2023W-A30")])
L.k(4, "Du kannst Auswirkungen eines Produkts oder einer Entscheidung auf Umwelt, Pflanzen, Tiere und Lebensräume erklären, zum Beispiel durch Rohstoffabbau, Flächenverbrauch, Emissionen und Abfall.", 2,
    [K("WISO.04.04.1")])
L.k(5, "Du kannst die drei Seiten der Nachhaltigkeit unterscheiden: ökonomisch, ökologisch und sozial.", 2,
    [K("WISO.04.04.1")])

L.sp("WISO-4-1-3", "Umweltzeichen: Blauer Engel und andere Kennzeichnungen",
     "Erklären, wofür der Blaue Engel steht, und ihn von anderen Zeichen auf Produkten abgrenzen.",
     G4, [("WISO.04.05.1", "Umweltzeichen beim Einkauf")],
     T("2021W-A20", "2023S-A25", "2025W-A30"), baut_auf=["AP1-4-3-3"],
     hinweis="Dass es Gütesiegel für Energieeffizienz gibt (EU-Energielabel, Energy Star, Blauer Engel als Beispiel), steht in AP1-4-3-3. Früher Stichpunkt WISO-4-3-2.")
L.k(1, "Du kannst erklären, wofür der Blaue Engel steht, und zutreffende von unzutreffenden Aussagen unterscheiden: Er kennzeichnet Produkte, die umweltschonender hergestellt und genutzt werden als vergleichbare, zum Beispiel aus Altpapier und schadstoffarmen Rohstoffen; er sagt nichts über Haltbarkeit, Sicherheit oder Entsorgungsweg.", 2,
    [K("WISO.04.05.1"), B("2021W-A20"), B("2023S-A25"), B("2025W-A30")])
L.k(2, "Du kannst erklären, dass der Blaue Engel ein freiwilliges staatliches Umweltzeichen ist und nichts über Preis oder technische Sicherheit eines Produkts sagt.", 2,
    [K("WISO.04.05.1")])
L.k(3, "Du kannst den Blauen Engel von anderen Zeichen abgrenzen: Recycling-Symbol (drei Pfeile im Kreis: wiederverwertbar), Fairtrade (fairer Handel), CE (Herstellererklärung zu EU-Vorschriften, kein Umweltzeichen).", 2,
    [K("WISO.04.05.1")])

# ---------------------------------------------------------------- 4-2 Abfall, Verpackung, Umweltrecht
L.tb("WISO-4-2", "Abfall, Verpackung und Umweltrecht", "Wie Abfall vermieden, getrennt und entsorgt wird, wie Verpackungen über das Duale System zurückkommen und welche Regeln und Folgen das Umweltrecht kennt.")

L.sp("WISO-4-2-1", "Abfall vermeiden, verringern, trennen und verwerten; IT-typische Abfälle erfassen, lagern und entsorgen",
     "Die Rangfolge im Umgang mit Abfall anwenden, Recycling erklären und IT-typische Abfälle richtig erfassen, lagern und entsorgen.",
     G4, ["WISO.04.06", ("WISO.04.01.3", "Recycling"), "WISO.04.01.4", "WISO.04.02.1", "WISO.04.02.1.1", "WISO.04.02.1.2"],
     T("2023S-A24", "2025S-A29", "2022S-A28"))
L.k(1, "Du kannst die Rangfolge im Umgang mit Abfall erklären und anwenden: zuerst vermeiden, dann verringern, dann verwerten und nur den Rest beseitigen; Vermeiden ist besser als Entsorgen.", 2,
    [K("WISO.04.06"), K("WISO.04.01.4"), B("2023S-A24"), B("2025S-A29")])
L.k(2, "Du kannst erklären, was Recycling ist, und es von anderen Maßnahmen unterscheiden: Abfälle nach Material trennen und als Rohstoff wiederverwerten, zum Beispiel Verpackungen getrennt dem Dualen System zuführen.", 2,
    [K("WISO.04.01.3"), K("WISO.04.01.4"), B("2022S-A28")])
L.k(3, "Du kannst Abfälle nennen, die für IT-Betriebe typisch sind: Altgeräte, Datenträger, Kabel, Batterien und Akkus, Tonerkartuschen, Verpackungen.", 1,
    [K("WISO.04.02.1")])
L.k(4, "Du kannst erklären, dass solche Abfälle nach Art getrennt erfasst und gelagert und über geeignete Wege entsorgt werden, zum Beispiel über Sammelstellen oder die Rücknahme durch Hersteller und Händler.", 2,
    [K("WISO.04.02.1"), K("WISO.04.02.1.1"), K("WISO.04.02.1.2")])
L.k(5, "Du kannst erklären, dass Datenträger vor der Entsorgung sicher gelöscht oder zerstört werden müssen.", 2,
    [K("WISO.04.02.1.2")])
L.k(6, "Du kannst erklären, dass Elektrogeräte und Akkus nicht in den Restmüll gehören und Akkus gegen Kurzschluss gesichert gelagert werden.", 2,
    [K("WISO.04.02.1.2")])

L.sp("WISO-4-2-2", "Verpackungen: Duales System und Recycling-Kennzeichnung",
     "Das Duale System erklären, Recycling-Kennzeichen auf Verpackungen erkennen und Grundsätze für umweltfreundliche Verpackung anwenden.",
     G4, ["WISO.04.03.1", ("WISO.04.06", "Verpackung vermeiden"), ("WISO.04.01.3", "Recycling-Symbol")],
     T("2022S-A28", "2025S-A30", "2023S-A24"),
     hinweis="Neuer Stichpunkt; das Duale System stand vorher in WISO-4-3-1.")
L.k(1, "Du kannst das Duale System erklären: ein von der Wirtschaft getragenes System, das gebrauchte Verkaufsverpackungen neben der öffentlichen Müllabfuhr sammelt und verwertet; wer Verpackungen in Verkehr bringt, muss sich daran beteiligen.", 2,
    [K("WISO.04.03.1"), B("2022S-A28")])
L.k(2, "Du kannst das Recycling-Symbol (drei Pfeile im Kreis) auf Verpackungen von anderen Kennzeichnungen unterscheiden.", 2,
    [K("WISO.04.01.3"), B("2025S-A30")])
L.k(3, "Du kannst Grundsätze für Verpackungen erklären: unnötige Verpackung vermeiden, Mehrweg vor Einweg, sortenreine und recycelbare Materialien; Papier oder recyceltes Plastik ist nicht automatisch umweltfreundlich.", 2,
    [K("WISO.04.06"), B("2023S-A24")])

L.sp("WISO-4-2-3", "Immissionsschutz, Verursacherprinzip und Rechtsfolgen",
     "Emission und Immission unterscheiden, den Zweck des Immissionsschutzrechts erklären und Verursacherprinzip und Rechtsfolgen bei Verstößen kennen.",
     G4, ["WISO.04.03.2", "WISO.04.07", "ZB.wiso-verursacherprinzip"],
     T("2025W-A29", "2022S-A27", "2024S-A30"),
     hinweis="Früher Teil von WISO-4-3-1.")
L.k(1, "Du kannst Emission (was eine Quelle abgibt) und Immission (was auf Menschen, Tiere, Pflanzen und Umwelt einwirkt) unterscheiden.", 2,
    [K("WISO.04.03.2")])
L.k(2, "Du kannst erklären, dass zu umweltbelastenden Emissionen nicht nur Abgase gehören, sondern auch Lärm, Erschütterungen, Licht, Wärme und Strahlen, und dass Vermeiden vor Verringern kommt (höhere Schornsteine lösen nichts).", 2,
    [K("WISO.04.03.2"), B("2025W-A29")])
L.k(3, "Du kannst erklären, dass das Bundes-Immissionsschutzgesetz vor schädlichen Umwelteinwirkungen schützt und technische Anleitungen, zum Beispiel zu Lärm und Luft, die Anforderungen im Einzelnen festlegen.", 2,
    [K("WISO.04.03.2")])
L.k(4, "Du kannst Folgen von Verstößen gegen Umweltvorschriften erklären, zum Beispiel Bußgeld, Strafe, behördliche Auflagen oder Schadensersatz.", 2,
    [K("WISO.04.07")])
L.k(5, "Du kannst das Verursacherprinzip erklären und von anderen Aussagen unterscheiden: Wer einen Umweltschaden verursacht, trägt die Kosten für seine Vermeidung und Beseitigung, nicht die Allgemeinheit.", 2,
    [K("ZB.wiso-verursacherprinzip"), B("2022S-A27"), B("2024S-A30")])

# ---------------------------------------------------------------- alt → neu
A = L.a
A("WISO-4-1-1-K2", "gestrichen", None, "E2/P47: unnötige Gerätelaufzeiten vermeiden steht in AP1-4-3-3-K5 (WISO.04.01.2.1 gedeckt)")
A("WISO-4-1-2-K6", "gestrichen", None, "E2/P36: Kosten über die ganze Nutzungsdauer stehen in AP1-3-1-2")
A("WISO-4-3-2-K1", "verschoben", "WISO-4-1-3-K1", "Stichpunkt in den Block Ressourcen und Nachhaltigkeit verschoben (F4: der Block Umweltrecht und Umweltzeichen hatte nur zwei Stichpunkte)")
A("WISO-4-3-2-K2", "verschoben", "WISO-4-1-3-K1", "mit K1 zusammengefasst (Bedeutung erklären und Aussagen unterscheiden)")
A("WISO-4-3-2-K3", "verschoben", "WISO-4-1-3-K2", "Stichpunkt verschoben (F4)")
A("WISO-4-3-2-K4", "verschoben", "WISO-4-1-3-K3", "Stichpunkt verschoben (F4); Recycling-Symbol und Fairtrade aus 2025S ergänzt")
A("WISO-4-3-1-K1", "verschoben", "WISO-4-2-2-K1", "Duales System steht im neuen Stichpunkt Verpackungen")
for alt, neu in [("K2", "K1"), ("K3", "K2"), ("K4", "K3"), ("K5", "K4"), ("K6", "K5")]:
    A(f"WISO-4-3-1-{alt}", "verschoben", f"WISO-4-2-3-{neu}", "Stichpunkt in den Block Abfall, Verpackung und Umweltrecht verschoben (F4: der Block Abfall hatte nur einen Stichpunkt)")

RS = L.rahmen_satz
RS("WISO-4-1-1", "Verlangt sind Beispiele und Maßnahmen, keine Verbrauchsrechnungen.", "angepasst", "Energie- und Kostenrechnungen stehen in AP1-4-2-3; WiSo verlangt nach Katalog (Stufe 1–2) Beispiele und Maßnahmen")
RS("WISO-4-3-1", "Grenzwerte und Paragrafen waren nicht gefragt.", "angepasst", "Grenze aus G4 statt aus fehlenden Belegen (E6)")
RS("WISO-4-3-2", "Der WiSo-Teil des Katalogs nennt kein Umweltzeichen.", "angepasst", "Der Blaue Engel ist belegt (2021W, 2023S, 2025W) und fällt unter WISO.04.05.1 (Nachhaltigkeit beim Einkauf berücksichtigen)")

L.gesch("WISO.04.01.4", "Abfalltrennung und -vermeidung", {"Trennung": ["WISO-4-2-1-K2"], "Vermeidung": ["WISO-4-2-1-K1"]})
L.gesch("WISO.04.03.2", "Lärm, Luft, Abfall", {"Lärm": ["WISO-4-2-3-K2"], "Luft": ["WISO-4-2-3-K3"]})
L.gesch("WISO.04.05.2", "Roh-, Hilfs- und Betriebsstoffe", {"Rohstoffe/Hilfsstoffe/Betriebsstoffe": ["WISO-4-1-1-K6"]})
L.gesch("WISO.04.06", "Abfallvermeidung und -reduzierung", {"Vermeidung": ["WISO-4-2-1-K1"], "Reduzierung": ["WISO-4-2-1-K1"]})

L.write(meta(kerntest="Alle 19 WiSo-Teilaufgaben dieses Ordners gegen die Musterlösungen gelesen. Lücken geschlossen: Recycling-Symbol und Verpackungsgrundsätze (neuer Stichpunkt WISO-4-2-2), Emissionen vermeiden statt verringern, Blauer Engel bei Recyclingpapier."))
