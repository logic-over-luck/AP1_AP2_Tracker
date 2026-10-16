import sys; sys.path.insert(0, sys.path[0])
from lpw import LPW, B, T, K, R, meta

L = LPW("WISO-3", "Sicherheit und Gesundheitsschutz bei der Arbeit", ["G.WISO.03"])
G3 = ["G.WISO.03"]; G13 = ["G.WISO.03", "G.WISO.01"]

# ---------------------------------------------------------------- 3-1 Vorschriften und Zuständige
L.tb("WISO-3-1", "Arbeitsschutz: Vorschriften, Zuständige und Unfallversicherung", "Welche Vorschriften den Arbeitsschutz regeln, wer im Betrieb und außerhalb dafür zuständig ist und wie die gesetzliche Unfallversicherung Beschäftigte absichert.")

L.sp("WISO-3-1-1", "Arbeitsschutzvorschriften im Überblick und Unterweisung",
     "Die Arbeitsschutzvorschriften ihrem Regelungsbereich zuordnen, wissen, wer ihre Einhaltung überwacht, und die Pflicht zur Unterweisung erklären.",
     G3, ["WISO.03.01.1", "WISO.03.01.2", ("WISO.03.01.3", "Arbeitszeitgesetz im Arbeitsschutz"), "WISO.03.01.4", "WISO.03.01.5", "WISO.03.01.6", "WISO.03.01.9", ("WISO.03.01.10", "Jugendarbeitsschutzgesetz im Arbeitsschutz")],
     T("2024S-A10", "2022S-A24", "2021W-A17", "2025S-A26"),
     hinweis="Die einzelnen Regeln des Arbeitszeit- und des Jugendarbeitsschutzgesetzes stehen in WISO-1-3-4; die Ergonomie des Arbeitsplatzes in AP1-4-3-1.")
L.k(1, "Du kannst Arbeitsschutzgesetz (Grundpflichten des Arbeitgebers: Gefährdungen beurteilen, Schutzmaßnahmen treffen, Beschäftigte unterweisen) und Arbeitssicherheitsgesetz (Betriebsärzte, Fachkräfte für Arbeitssicherheit, Arbeitsschutzausschuss) unterscheiden.", 2,
    [K("WISO.03.01.1"), K("WISO.03.01.2")])
L.k(2, "Du kannst erklären, dass ein Unternehmen mit mehr als 20 Beschäftigten einen Arbeitsschutzausschuss bilden muss, in dem die Themen des Arbeitsschutzes beraten werden.", 2,
    [K("WISO.03.01.2"), B("2024S-A10")])
L.k(3, "Du kannst Arbeitszeitgesetz (Höchstarbeitszeit, Ruhepausen, Ruhezeit für Erwachsene) und Jugendarbeitsschutzgesetz (strengere Regeln für Beschäftigte unter 18 Jahren) dem Arbeitsschutz zuordnen.", 2,
    [K("WISO.03.01.3"), K("WISO.03.01.10")])
L.k(4, "Du kannst Betriebssicherheitsverordnung (sichere Arbeitsmittel und ihre Prüfung) und Arbeitsstättenverordnung (Räume, Beleuchtung, Raumklima, Fluchtwege, Bildschirmarbeitsplätze) zuordnen.", 2,
    [K("WISO.03.01.4"), K("WISO.03.01.5")])
L.k(5, "Du kannst erklären, wer die Unfallverhütungsvorschriften erlässt und wie sie bekannt gemacht werden: die Berufsgenossenschaften; sie sind für Betrieb und Beschäftigte verbindlich und im Betrieb an gut sichtbarer Stelle auszuhängen oder auszulegen.", 2,
    [K("WISO.03.01.6"), B("2022S-A24")])
L.k(6, "Du kannst die Gewerbeaufsicht (Amt für Arbeitsschutz) als staatliche Aufsichtsbehörde von der Berufsgenossenschaft als Träger der Unfallversicherung unterscheiden.", 2,
    [K("WISO.03.01.9")])
L.k(7, "Du kannst die Pflicht zur Unterweisung erklären: Der Arbeitgeber bzw. die Vorgesetzten unterweisen über Unfall- und Gesundheitsgefahren bei Beginn der Beschäftigung, bei neuen Aufgaben oder Arbeitsmitteln und danach regelmäßig (mindestens jährlich, Jugendliche halbjährlich).", 2,
    [K("WISO.03.01.1"), K("WISO.03.01.6"), B("2021W-A17"), B("2025S-A26")])

L.sp("WISO-3-1-2", "Sicherheitsbeauftragte, Fachkraft für Arbeitssicherheit, Ersthelfer und Fürsorgepflicht",
     "Die Personen im betrieblichen Arbeitsschutz und ihre Aufgaben unterscheiden und die Fürsorgepflicht des Arbeitgebers und die Pflichten der Beschäftigten erklären.",
     G3, ["WISO.03.04", ("WISO.03.01.2", "Fachkraft für Arbeitssicherheit"), ("WISO.03.02.5", "Fürsorgepflicht"), ("WISO.03.02.6", "Ersthelfer"), ("WISO.03.02.3", "Gefahren melden"), ("WISO.03.02.4", "Anweisungen beachten")],
     T("2023W-A6", "2025S-A27", "2021W-A17"))
L.k(1, "Du kannst die Aufgaben der Sicherheitsbeauftragten erklären: Sie unterstützen den Arbeitgeber dabei, Unfälle und Gesundheitsgefahren zu verhüten, und machen auf Mängel aufmerksam; Informationen und Ausbildung erhalten sie von der Berufsgenossenschaft.", 2,
    [K("WISO.03.04"), B("2023W-A6"), B("2025S-A27")])
L.k(2, "Du kannst die Fürsorgepflicht des Arbeitgebers erklären: Er muss Arbeitsplatz, Arbeitsmittel und Abläufe so gestalten, dass Leben und Gesundheit der Beschäftigten geschützt sind, und bleibt für die Unterweisung verantwortlich.", 2,
    [K("WISO.03.02.5"), B("2021W-A17")])
L.k(3, "Du kannst die Pflichten der Beschäftigten erklären: Sicherheitshinweise, Vorschriften und Anweisungen beachten und festgestellte Gefahren oder Mängel sofort melden.", 2,
    [K("WISO.03.02.3"), K("WISO.03.02.4")])
L.k(4, "Du kannst erklären, wer Ersthelfer ist: Beschäftigte mit einer Ausbildung in Erster Hilfe; der Arbeitgeber muss dafür sorgen, dass genügend von ihnen anwesend sind.", 2,
    [K("WISO.03.02.6")])
L.k(5, "Du kannst erklären, dass Sicherheitsbeauftragte ihr Amt neben ihrer eigentlichen Arbeit ausüben, keine Weisungen erteilen dürfen und die Verantwortung beim Arbeitgeber bleibt.", 2,
    [K("WISO.03.04")])
L.k(6, "Du kannst Sicherheitsbeauftragte von der Fachkraft für Arbeitssicherheit unterscheiden: Die Fachkraft ist dafür eigens ausgebildet und berät den Arbeitgeber fachlich.", 2,
    [K("WISO.03.04"), K("WISO.03.01.2")])

L.sp("WISO-3-1-3", "Gesetzliche Unfallversicherung: versicherte Fälle, Träger, Leistungen",
     "Erklären, welche Fälle die gesetzliche Unfallversicherung abdeckt, wer sie trägt und bezahlt und welche Leistungen sie erbringt.",
     G13, [("WISO.01.05.2.11", "gesetzliche Unfallversicherung")],
     T("2024S-A11", "2022W-A18", "2024S-A12", "2023W-A28"),
     hinweis="Neuer Stichpunkt: Die Unfallversicherung stand vorher doppelt in WISO-1-6-2 und WISO-3-4-2 und kam in vier Prüfungen vor.")
L.k(1, "Du kannst unterscheiden, welche Fälle die gesetzliche Unfallversicherung abdeckt: Arbeitsunfälle bei der versicherten Tätigkeit, Wegeunfälle auf dem direkten Weg zur Arbeit und zurück und Berufskrankheiten – nicht Unfälle in der Freizeit oder gewöhnliche Krankheiten.", 2,
    [K("WISO.01.05.2.11"), B("2024S-A11"), B("2022W-A18")])
L.k(2, "Du kannst Träger und Finanzierung erklären: Träger sind die Berufsgenossenschaften (im öffentlichen Dienst die Unfallkassen), die Beiträge zahlt der Arbeitgeber allein, und versichert sind alle Beschäftigten, auch Auszubildende und Ersthelfer bei der Hilfeleistung.", 2,
    [K("WISO.01.05.2.11"), B("2022W-A18"), B("2024S-A12")])
L.k(3, "Du kannst Beispiele den Leistungen der gesetzlichen Unfallversicherung zuordnen: Heilbehandlung und Rehabilitation, Verletztengeld bei Arbeitsunfähigkeit, Pflegegeld bei Pflegebedürftigkeit und Rente bei einer dauerhaft um mindestens 20 Prozent geminderten Erwerbsfähigkeit.", 2,
    [K("WISO.01.05.2.11"), B("2023W-A28")])
L.k(4, "Du kannst die Rolle des Durchgangsarztes erklären: ein von der Berufsgenossenschaft zugelassener Arzt, den Verletzte nach einem Arbeitsunfall aufsuchen und der die Behandlung übernimmt oder steuert.", 2,
    [K("WISO.01.05.2.11")])

# ---------------------------------------------------------------- 3-2 Gefährdungen
L.tb("WISO-3-2", "Gefährdungen und gesunder Arbeitsplatz", "Welche Gefährdungen es an IT-Arbeitsplätzen gibt, wie man sie einschätzt und Schutzmaßnahmen ableitet und was für Bildschirmarbeit und psychische Belastung gilt.")

L.sp("WISO-3-2-1", "Gefährdungsarten: mechanisch, elektrisch, thermisch, chemisch, ergonomisch, akustisch, psychisch",
     "Die Gefährdungsarten unterscheiden und Sachverhalte aus der IT-Arbeit zuordnen.",
     G3, [("WISO.03.02.1", "Gefährdungsarten"), ("WISO.03.02.2", "Gefährdungsarten")], [],
     hinweis="Schwere Geräte heben ordnet der Katalog nicht ausdrücklich zu; als Lastenhandhabung gilt es als mechanische Gefährdung (Verletzung durch die Last), die körperliche Belastung als ergonomische.")
L.k(1, "Du kannst die sieben Gefährdungsarten unterscheiden: mechanisch, elektrisch, thermisch, chemisch, ergonomisch, akustisch, psychisch.", 2,
    [K("WISO.03.02.1"), K("WISO.03.02.2")])
L.k(2, "Du kannst einen beschriebenen Sachverhalt der passenden Gefährdungsart zuordnen.", 2,
    [K("WISO.03.02.1"), K("WISO.03.02.2")])
L.k(3, "Du kannst Beispiele aus der IT-Arbeit zuordnen: Stolpern über Kabel (mechanisch), Arbeiten an geöffneten Geräten (elektrisch), heiße Bauteile (thermisch), Tonerstaub oder ausgelaufene Akkus (chemisch), langes Sitzen in starrer Haltung (ergonomisch), Lärm im Serverraum (akustisch), Zeitdruck und ständige Unterbrechungen (psychisch).", 2,
    [K("WISO.03.02.1"), K("WISO.03.02.2")])

L.sp("WISO-3-2-2", "Bildschirmarbeit, Vorsorgeuntersuchungen und psychische Belastung",
     "Die Vorschriften und Vorsorge für Bildschirmarbeit kennen und psychische Belastungen in der Gefährdungsbeurteilung berücksichtigen.",
     G3, ["WISO.03.01.8", "WISO.03.03.1", "WISO.03.03.2", ("WISO.03.02.2", "psychische Belastung")], [],
     baut_auf=["AP1-4-3-1"],
     hinweis="Wie ein Bildschirmarbeitsplatz ergonomisch gestaltet und beurteilt wird, steht in AP1-4-3-1 (WISO.03.01.7 und WISO.03.02.7 gedeckt, P47).")
L.k(3, "Du kannst erklären, dass der Arbeitgeber Beschäftigten an Bildschirmarbeitsplätzen eine Untersuchung der Augen anbieten muss (Angebotsvorsorge) und bei Bedarf eine Bildschirmbrille bezahlt.", 2,
    [K("WISO.03.03.1")])
L.k(4, "Du kannst erklären, dass die Gefährdungsbeurteilung auch psychische Belastungen erfassen muss, zum Beispiel Zeitdruck, Arbeitsmenge und häufige Störungen.", 2,
    [K("WISO.03.03.2"), K("WISO.03.02.2")])
L.k(5, "Du kannst geeignete von ungeeigneten Maßnahmen gegen psychische Belastung unterscheiden, zum Beispiel klare Prioritäten, störungsfreie Zeiten und realistische Termine gegenüber ständiger Erreichbarkeit.", 2,
    [K("WISO.03.02.2")])
L.k(6, "Du kannst die Regeln für Bildschirmarbeit einordnen: Sie stehen heute in der Arbeitsstättenverordnung (die frühere Bildschirmarbeitsverordnung gibt es nicht mehr), und Bildschirmarbeit soll regelmäßig durch andere Tätigkeiten oder kurze Pausen unterbrochen werden.", 2,
    [K("WISO.03.01.8")])

L.sp("WISO-3-2-3", "Gefährdungen einschätzen und Schutzmaßnahmen ableiten",
     "Gefährdungen eines Arbeitsplatzes einschätzen, Schutzmaßnahmen in der richtigen Rangfolge ableiten und beurteilen, ob Beschäftigte und Arbeitgeber ihre Pflichten erfüllen.",
     G3, ["WISO.03.02.1", "WISO.03.02.2", "WISO.03.02.3", "WISO.03.02.4", "WISO.03.02.5", "WISO.03.02.6", ("WISO.03.01.1", "Gefährdungsbeurteilung")],
     T("2025S-A26", "2021W-A17"),
     hinweis="Neuer Stichpunkt: Der Katalog verlangt Gefährdungen „wahrnehmen und einschätzen“ (Stufe 4); die Gefährdungsbeurteilung und die Rangfolge der Maßnahmen standen vorher in WISO-3-2-1.")
L.k(1, "Du kannst die Gefährdungsbeurteilung erklären: Der Arbeitgeber muss die Gefährdungen jedes Arbeitsplatzes ermitteln, bewerten, Maßnahmen festlegen, ihre Wirkung prüfen und das Ergebnis dokumentieren.", 2,
    [K("WISO.03.01.1")])
L.k(2, "Du kannst die Rangfolge der Schutzmaßnahmen erklären: erst die Gefahr beseitigen (Substitution), dann technisch absichern, dann organisatorisch regeln, zuletzt persönliche Schutzausrüstung (STOP).", 2,
    [K("WISO.03.01.1"), K("WISO.03.02.1")])
L.k(3, "Du kannst die Gefährdungen eines beschriebenen Arbeitsplatzes oder Auftrags einschätzen (welche Art, wie wahrscheinlich, wie schwer) und begründen, welche Schutzmaßnahme nach der Rangfolge zuerst zu treffen ist, zum Beispiel beim Austausch eines Netzteils im Serverschrank.", 4,
    [K("WISO.03.02.1"), K("WISO.03.02.2")])
L.k(4, "Du kannst an einer Situation beurteilen, ob Beschäftigte Sicherheitshinweise und Anweisungen beachten und erkannte Gefahren melden, und begründen, was zu tun ist.", 4,
    [K("WISO.03.02.3"), K("WISO.03.02.4"), B("2025S-A26")])
L.k(5, "Du kannst beurteilen, ob der Arbeitgeber seiner Fürsorgepflicht nachkommt, zum Beispiel bei Unterweisung, genügend Ersthelfern und sicheren Arbeitsmitteln.", 4,
    [K("WISO.03.02.5"), K("WISO.03.02.6"), B("2021W-A17")])

# ---------------------------------------------------------------- 3-3 Sicherheitszeichen und Arbeitsmittel
L.tb("WISO-3-3", "Sicherheitszeichen und sichere Arbeitsmittel", "Woran man Sicherheitszeichen, Flucht- und Rettungswege erkennt, was Schutzarten, Schutzklassen und Prüfzeichen bedeuten und wie man mit Gefahrenquellen umgeht.")

L.sp("WISO-3-3-1", "Sicherheitszeichen, Flucht- und Rettungswege, Notausgänge und Sammelplätze",
     "Sicherheitszeichen nach Form und Farbe einordnen und ihre Bedeutung zuordnen sowie Flucht- und Rettungswege und Sammelplatz kennen.",
     G3, ["WISO.03.05.9", ("WISO.03.07.7", "Brandschutzzeichen"), "WISO.03.05.3", "WISO.03.05.4", "WISO.03.05.5", "WISO.03.07.6", ("WISO.03.06.4", "Sammelplatz"), "WISO.03.07.5"],
     T("2022S-A23", "2022W-A26", "2022W-A27", "2024S-A13", "2025S-A28", "2024S-A28"))
L.k(1, "Du kannst Sicherheitszeichen nach Form und Farbe einordnen: Verbotszeichen (rund, roter Rand mit Schrägbalken), Gebotszeichen (rund, blau), Warnzeichen (dreieckig, gelb mit schwarzem Rand), Rettungszeichen (rechteckig oder quadratisch, grün), Brandschutzzeichen (rechteckig oder quadratisch, rot); Gefahrstoff-Piktogramme sind rot umrandete Rauten.", 2,
    [K("WISO.03.05.9"), K("WISO.03.07.7"), B("2022W-A26"), B("2025S-A28")])
L.k(2, "Du kannst abgebildete Zeichen ihrer Bedeutung zuordnen, zum Beispiel Rettungsweg, Erste Hilfe, Sammelstelle, Feuerlöscher, Löschschlauch, Brandmelder, „Vor Öffnen Netzstecker ziehen“, Warnung vor Laserstrahl, Hochspannung oder feuergefährlichen Stoffen.", 2,
    [K("WISO.03.05.9"), K("WISO.03.07.7"), B("2022S-A23"), B("2024S-A13"), B("2024S-A28"), B("2022W-A27")])
L.k(3, "Du kannst erklären, dass du die Flucht- und Rettungswege und Notausgänge im Gebäude und am eigenen Arbeitsplatz kennen musst und dass sie gekennzeichnet, frei und unverschlossen sein müssen.", 2,
    [K("WISO.03.05.3"), K("WISO.03.05.4"), K("WISO.03.05.5"), K("WISO.03.07.6")])
L.k(4, "Du kannst erklären, wozu der Sammelplatz dient: Dort treffen sich nach einer Räumung alle, damit geprüft werden kann, ob jemand fehlt.", 2,
    [K("WISO.03.06.4"), K("WISO.03.07.5"), B("2022W-A27")])
L.k(5, "Du kannst einen Flucht- und Rettungsplan lesen: eigener Standort, Fluchtwege, Feuerlöscher, Erste-Hilfe-Einrichtungen, Sammelplatz.", 2,
    [K("WISO.03.07.6"), K("WISO.03.05.5")])

L.sp("WISO-3-3-2", "Elektrische Betriebsmittel: Schutzarten (IP-Code), Schutzklassen und Prüfzeichen wie das CE-Zeichen",
     "Schutzarten, Schutzklassen und das CE-Zeichen an elektrischen Geräten erklären und einordnen.",
     G3, ["WISO.03.05.6", "WISO.03.05.7", "WISO.03.05.8"], [])
L.k(1, "Du kannst die Schutzart erklären: Der IP-Code gibt mit der ersten Ziffer den Schutz gegen Berührung und Fremdkörper und mit der zweiten den Schutz gegen Wasser an.", 2,
    [K("WISO.03.05.6")])
L.k(2, "Du kannst die drei Schutzklassen unterscheiden: I mit Schutzleiter, II mit Schutzisolierung, III mit Schutzkleinspannung.", 2,
    [K("WISO.03.05.7")])
L.k(3, "Du kannst das CE-Zeichen erklären: Der Hersteller erklärt damit selbst, dass sein Produkt die europäischen Vorschriften erfüllt; es ist kein Prüfsiegel einer unabhängigen Stelle und kein Umweltzeichen.", 2,
    [K("WISO.03.05.8")])
L.k(4, "Du kannst eine Angabe wie IP 20 oder IP 67 einordnen: Je höher die Ziffer, desto besser der Schutz; IP 20 eignet sich nur für trockene Innenräume.", 2,
    [K("WISO.03.05.6")])

L.sp("WISO-3-3-3", "Verhaltensregeln und sachgerechter Umgang mit Gefahrenpotenzialen",
     "Allgemeine und betriebliche Verhaltensregeln kennen und mit typischen Gefahrenquellen in der IT sachgerecht umgehen.",
     G3, ["WISO.03.05.1", "WISO.03.05.2"], [])
L.k(1, "Du kannst allgemeine Verhaltensregeln erklären: Verkehrs- und Fluchtwege freihalten, Kabel stolperfrei verlegen, Schutzeinrichtungen nicht außer Kraft setzen, defekte Geräte nicht weiter benutzen und melden.", 2,
    [K("WISO.03.05.2")])
L.k(2, "Du kannst erklären, dass betriebliche Regeln in Betriebsanweisungen und Unterweisungen festgelegt werden und für dich verbindlich sind.", 2,
    [K("WISO.03.05.2")])
L.k(3, "Du kannst Regeln für den Umgang mit elektrischen Geräten erklären: vor dem Öffnen den Netzstecker ziehen, Arbeiten an Netzteilen und an der Stromversorgung nur durch Elektrofachkräfte.", 2,
    [K("WISO.03.05.1")])
L.k(4, "Du kannst den richtigen Umgang mit weiteren IT-typischen Gefahren erklären: schwere Geräte zu zweit oder mit Hilfsmittel heben, beschädigte Akkus nicht weiterverwenden, Tonerstaub nicht einatmen.", 2,
    [K("WISO.03.05.1")])

# ---------------------------------------------------------------- 3-4 Unfall und Brand
L.tb("WISO-3-4", "Notfall: Unfall und Brand", "Was bei einem Unfall zu tun ist, wie ein Arbeitsunfall gemeldet wird, wie Brände entstehen und verhütet werden und wie man sich im Brandfall verhält und löscht.")

L.sp("WISO-3-4-1", "Verhalten bei Unfällen: Erste Hilfe, Notruf, Meldekette, Evakuierung und Dokumentation",
     "Die ersten Schritte am Unfallort ordnen, einen Notruf absetzen, Erste-Hilfe-Maßnahmen kennen und Meldekette, Evakuierung und Dokumentation erklären.",
     G3, ["WISO.03.06.1", "WISO.03.06.2", "WISO.03.06.3", "WISO.03.06.5"],
     T("2021W-A21"))
L.k(1, "Du kannst die ersten Schritte am Unfallort ordnen: Unfallstelle sichern und auf die eigene Sicherheit achten, Notruf absetzen, Erste Hilfe leisten.", 2,
    [K("WISO.03.06.1")])
L.k(2, "Du kannst einen Notruf über die 112 absetzen und seine Angaben erklären: Wo ist es passiert, was ist passiert, wie viele Verletzte, welche Verletzungen, auf Rückfragen warten.", 2,
    [K("WISO.03.06.2")])
L.k(3, "Du kannst erklären, wo im Betrieb die Ersthelfer und die betrieblichen Notfallnummern verzeichnet sind: im Aushang zur Ersten Hilfe und in der Brandschutz- bzw. Alarmordnung.", 2,
    [K("WISO.03.06.2")])
L.k(4, "Du kannst erklären, was eine Meldekette ist: die festgelegte Reihenfolge, in der nach einem Vorfall Personen und Stellen informiert werden.", 2,
    [K("WISO.03.06.3")])
L.k(5, "Du kannst erklären, dass bei einer Evakuierung alle das Gebäude geordnet über die Fluchtwege verlassen und dass jede Erste-Hilfe-Leistung im Betrieb aufgezeichnet wird (Verbandbuch).", 2,
    [K("WISO.03.06.5")])
L.k(6, "Du kannst richtige von falschen Erste-Hilfe-Maßnahmen unterscheiden, zum Beispiel Brandwunden kühlen und keimfrei abdecken statt Salben aufzutragen oder Blasen zu öffnen, stabile Seitenlage, Druckverband, bei einem Stromunfall zuerst den Strom abschalten.", 2,
    [K("WISO.03.06.1"), B("2021W-A21")])

L.sp("WISO-3-4-2", "Arbeitsunfall melden",
     "Erklären, wann und an wen der Arbeitgeber einen Arbeitsunfall meldet und welche Stationen nach einem Unfall folgen.",
     G3, ["WISO.03.06.6"], T("2022W-A21", "2023S-A5"),
     hinweis="Versicherte Fälle, Träger und Leistungen der Unfallversicherung stehen in WISO-3-1-3.")
L.k(1, "Du kannst erklären, dass der Arbeitgeber einen Arbeitsunfall dem Träger der Unfallversicherung (Berufsgenossenschaft) melden muss, nicht der Krankenkasse, der Gewerbeaufsicht oder einer privaten Versicherung.", 2,
    [K("WISO.03.06.6"), B("2022W-A21"), B("2023S-A5")])
L.k(3, "Du kannst die Stationen nach einem Arbeitsunfall ordnen: Erste Hilfe, ärztliche Behandlung (Durchgangsarzt), Unfallanzeige, Rückkehr an den Arbeitsplatz.", 2,
    [K("WISO.03.06.6")])
L.k(6, "Du kannst erklären, wann ein Arbeitsunfall meldepflichtig ist: wenn er zu mehr als drei Kalendertagen Arbeitsunfähigkeit führt (oder tödlich ist); die Unfallanzeige ist dann innerhalb von drei Tagen zu erstatten.", 2,
    [K("WISO.03.06.6"), B("2023S-A5")])

L.sp("WISO-3-4-3", "Vorbeugender Brandschutz: Brandursachen und Brandschutzordnung",
     "Erklären, wie Brände entstehen, Brandursachen in Büro und Serverraum vermeiden und die Brandschutzordnung einordnen.",
     G3, ["WISO.03.07.1", "WISO.03.07.1.1", "WISO.03.07.2"], [],
     hinweis="Früher Stichpunkt WISO-3-5-1.")
L.k(1, "Du kannst erklären, wie ein Brand entsteht: Ein brennbarer Stoff trifft auf genügend Hitze, zum Beispiel bei einem Heißwasserkocher oder einer Kaffeemaschine, die nicht ausgeschaltet wurden.", 2,
    [K("WISO.03.07.1"), K("WISO.03.07.1.1")])
L.k(2, "Du kannst vorbeugende Maßnahmen erklären: Geräte nach Gebrauch ausschalten, nichts Brennbares neben Wärmequellen lagern, defekte Geräte und Kabel aus dem Betrieb nehmen.", 2,
    [K("WISO.03.07.1"), K("WISO.03.07.1.1")])
L.k(3, "Du kannst erklären, was die Brandschutzordnung ist: die betrieblichen Regeln zur Verhütung von Bränden und zum Verhalten im Brandfall.", 2,
    [K("WISO.03.07.2")])
L.k(4, "Du kannst weitere Brandursachen im Büro und im Serverraum erklären: überlastete Mehrfachsteckdosen, beschädigte Akkus, verstellte Lüftungsöffnungen.", 2,
    [K("WISO.03.07.1")])
L.k(5, "Du kannst erklären, dass für ein Feuer brennbarer Stoff, Sauerstoff und Zündtemperatur zusammenkommen müssen und Löschen bedeutet, eines davon zu entziehen.", 2,
    [K("WISO.03.07.1")])
L.k(6, "Du kannst erklären, warum Brandschutztüren geschlossen bleiben und nicht verkeilt werden dürfen.", 2,
    [K("WISO.03.07.2")])

L.sp("WISO-3-4-4", "Verhalten im Brandfall und Brandschutzmittel: Brandmeldung, Feuerlöscher, Löschdecken, Brandklassen",
     "Die richtige Reihenfolge im Brandfall kennen, einen Feuerlöscher richtig bedienen und einsetzen und Löschmittel den Brandklassen zuordnen.",
     G3, ["WISO.03.07.3", "WISO.03.07.3.1", "WISO.03.07.3.2", "WISO.03.07.4", "WISO.03.07.4.1", "WISO.03.07.4.2", "WISO.03.07.8", "WISO.03.07.9"],
     T("2024S-A14", "2022W-A25", "2022S-A25", "2022S-A26"),
     hinweis="Früher Stichpunkt WISO-3-5-2.")
L.k(1, "Du kannst die Reihenfolge im Brandfall erklären: zuerst den Brand melden (Brandmelder, 112), Menschen warnen und in Sicherheit bringen, erst dann löschen, und nur ohne dich selbst zu gefährden.", 2,
    [K("WISO.03.07.9"), K("WISO.03.07.3"), B("2024S-A14")])
L.k(2, "Du kannst richtiges von falschem Verhalten im Brandfall unterscheiden: keinen Aufzug benutzen, Türen und Fenster schließen (kein Fenster öffnen, das facht das Feuer an), den gekennzeichneten Fluchtwegen zum Sammelplatz folgen.", 2,
    [K("WISO.03.07.3"), K("WISO.03.07.3.1"), K("WISO.03.07.3.2"), B("2022W-A25")])
L.k(3, "Du kannst einen Feuerlöscher bedienen: zum Gerät gehen, aus der Halterung nehmen, Sicherung ziehen, Betätigungshebel ziehen und den Schlauch auf das Feuer richten; Standort und Bedienungsanleitung am Gerät gehören dazu.", 3,
    [K("WISO.03.07.4.1"), B("2022S-A26")])
L.k(4, "Du kannst die Brandklassen zuordnen: A feste Stoffe, B flüssige Stoffe, C Gase, D Metalle.", 2,
    [K("WISO.03.07.8")])
L.k(5, "Du kannst erklären, wofür eine Löschdecke dient: Sie erstickt kleine Brände, zum Beispiel an Kleidung oder in einem Papierkorb.", 2,
    [K("WISO.03.07.4.2")])
L.k(6, "Du kannst erklären, warum für elektrische Geräte und Serverräume Kohlendioxid-Löscher geeignet sind: Sie leiten keinen Strom und hinterlassen keine Rückstände; das Löschmittel muss immer zum brennenden Stoff passen.", 2,
    [K("WISO.03.07.4"), K("WISO.03.07.4.1")])
L.k(7, "Du kannst richtige von falschen Löschregeln unterscheiden: mit dem Wind löschen, von vorn und von unten in die Glut, Tropf- und Fließbrände von oben nach unten, mehrere Löscher gleichzeitig statt nacheinander, Brandstelle danach beobachten.", 2,
    [K("WISO.03.07.4.1"), B("2022S-A25")])

# ---------------------------------------------------------------- alt → neu
A = L.a
A("WISO-3-2-1-K4", "verschoben", "WISO-3-2-3-K1", "Gefährdungsbeurteilung steht im neuen Stichpunkt Gefährdungen einschätzen")
A("WISO-3-2-1-K5", "verschoben", "WISO-3-2-3-K2", "Rangfolge der Schutzmaßnahmen steht im neuen Stichpunkt Gefährdungen einschätzen")
A("WISO-3-2-2-K1", "gestrichen", None, "E2/P47: ergonomische Anforderungen an einen Bildschirmarbeitsplatz stehen in AP1-4-3-1-K2 (WISO.03.01.7 und WISO.03.02.7 gedeckt)")
A("WISO-3-2-2-K2", "gestrichen", None, "E2/P47: einen Arbeitsplatz ergonomisch beurteilen steht in AP1-4-3-1-K3")
A("WISO-3-3-2-K5", "gestrichen", None, "K3/P17: weitere Prüfzeichen (GS, VDE) stehen weder im Katalog noch in einer Prüfung; für P-BEISPIELLISTE fehlen zwei Hinweisquellen")
A("WISO-3-4-2-K2", "verschoben", "WISO-3-1-3-K1", "versicherte Fälle der Unfallversicherung gesammelt in WISO-3-1-3")
A("WISO-3-4-2-K4", "verschoben", "WISO-3-1-3-K4", "Durchgangsarzt steht bei der Unfallversicherung")
A("WISO-3-4-2-K5", "verschoben", "WISO-3-1-3-K2", "Träger und Finanzierung stehen bei der Unfallversicherung")
for n in range(1, 7):
    A(f"WISO-3-5-1-K{n}", "verschoben", f"WISO-3-4-3-K{n}", "Stichpunkt in den Block Notfall verschoben (F4: der Block Brandschutz hatte nur zwei Stichpunkte)")
    A(f"WISO-3-5-2-K{n}", "verschoben", f"WISO-3-4-4-K{n}", "Stichpunkt in den Block Notfall verschoben (F4)")
A("WISO-3-6-1-K1", "gestrichen", None, "E2/P47: Informationssicherheit und Datenschutz unterscheiden steht in AP1-7-5-1-K5 (WISO.03.08.1 gedeckt)")
A("WISO-3-6-1-K2", "verschoben", "WISO-5-2-1-K8", "Vertraulichkeit, Integrität, Verfügbarkeit stehen in AP1-7-1-1; neu für WiSo ist nur Authentizität (WISO.03.08.3), jetzt in WISO-5-2-1")
A("WISO-3-6-1-K3", "gestrichen", None, "E2/P47: einem Vorfall das Schutzziel zuordnen steht in AP1-7-1-1-K2")
A("WISO-3-6-1-K4", "gestrichen", None, "E2/P47: Ziele der DSGVO stehen in AP1-7-5-1-K1 (WISO.03.08.2 gedeckt)")
A("WISO-3-6-1-K5", "gestrichen", None, "E2/P47: personenbezogene Daten und Grundsätze der Verarbeitung stehen in AP1-7-5-1-K2 und -K6")
A("WISO-3-6-2-K1", "gestrichen", None, "E2/P47: Aufgaben des BSI stehen in AP1-7-2-1-K1 (WISO.03.08.4 gedeckt)")
A("WISO-3-6-2-K2", "gestrichen", None, "E2/P47: IT-Grundschutz-Empfehlungen begründen steht in AP1-7-2-1-K3 (WISO.03.08.5 gedeckt)")
A("WISO-3-6-2-K3", "gestrichen", None, "E2/P47: Sicherheitskonzept, Schutzbedarf und Richtlinien stehen in AP1-7-2-1, AP1-7-2-2 und AP1-7-1-3 (WISO.03.08.6 gedeckt)")
A("WISO-3-6-2-K4", "gestrichen", None, "E2/P47: technische und organisatorische Maßnahmen stehen in AP1-7-1-2 (WISO.03.08.7 gedeckt)")
A("WISO-3-6-2-K5", "verschoben", "WISO-5-2-1-K7", "eigener Beitrag zur IT-Sicherheit gehört zum Sicherheitsbewusstsein (WISO.05.02.1)")

RS = L.rahmen_satz
RS("WISO-3-1-1", "Du sollst wissen, was jede regelt und wer die Einhaltung überwacht; Paragrafen musst du nicht kennen.", "übernommen", "G4: Paragrafen und Normnummern sind ohne Hilfsmittel nicht sinnvoll abfragbar")
RS("WISO-3-2-1", "Messwerte und Grenzwerte sind nicht verlangt.", "übernommen", "G4; der Katalog verlangt Gefährdungen einschätzen, nicht messen")
RS("WISO-3-3-1", "Die Normnummern der Zeichen sind nicht gefragt.", "übernommen", "G4")
RS("WISO-3-3-2", "Es genügt, die Angaben zu deuten; elektrotechnische Berechnungen gehören nicht dazu.", "übernommen", "G2: Perspektive WiSo (Sicherheit am Arbeitsplatz), Elektrotechnik ist nicht Gegenstand von WISO.03.05")
RS("WISO-3-4-1", "Medizinische Einzelheiten der Ersten Hilfe wurden nicht gefragt.", "angepasst", "Belegt ist richtiges Verhalten bei einer Verbrennung (2021W-WISO-A21); die Grenze folgt aus G4, nicht aus fehlenden Belegen")
RS("WISO-3-6-2", "Verlangt ist das Wissen eines Anwenders, nicht das Erstellen eines Sicherheitskonzepts.", "gestrichen", "IT-Sicherheit ist in AP1-7 gelernt (P47); der WiSo-Teil ist dort gedeckt")

L.grenze("Paragrafen und Normnummern der Arbeitsschutzvorschriften gehören nicht dazu.", "G4: Der Katalog nennt die Vorschriften nur mit Namen (WISO.03.01); Paragrafen sind ohne Hilfsmittel nicht sinnvoll abfragbar, nötige Gesetzestexte werden abgedruckt (B4).", ["WISO.03.01"])
# (Grenze am letzten Stichpunkt angehängt würde falsch zuordnen – deshalb unten neu gesetzt)

L.gesch("WISO.03.05.6", "Schutzarten und Schutzklassen", {"Schutzarten": ["WISO-3-3-2-K1", "WISO-3-3-2-K4"], "Schutzklassen": ["WISO-3-3-2-K2"]})
L.gesch("WISO.03.05.3", "Fluchtwege und Notausgänge", {"Fluchtwege": ["WISO-3-3-1-K3"], "Notausgänge": ["WISO-3-3-1-K3"]})
L.gesch("WISO.03.07.4", "Feuerlöscher und Löschdecken", {"Feuerlöscher": ["WISO-3-4-4-K3"], "Löschdecken": ["WISO-3-4-4-K5"]})
L.gesch("WISO.03.02.1", "mechanisch, elektrisch, thermisch, chemisch", {"Arten": ["WISO-3-2-1-K1", "WISO-3-2-1-K3"]})
L.gesch("WISO.03.02.2", "ergonomisch, akustisch, psychisch", {"ergonomisch/akustisch": ["WISO-3-2-1-K3"], "psychisch": ["WISO-3-2-2-K4", "WISO-3-2-2-K5"]})

# Grenze an WISO-3-1-1 statt am letzten Stichpunkt
last = L.tbs[-1]["stichpunkte"][-1]
g = last.pop("grenzen")
L.tbs[0]["stichpunkte"][0]["grenzen"] = g

L.write(meta(kerntest="Alle 32 WiSo-Teilaufgaben dieses Ordners gegen die Musterlösungen gelesen. Lücken geschlossen: Unterweisung (Zeitpunkt, Verantwortung), Unfallversicherung (versicherte Fälle, Leistungen; neuer Stichpunkt WISO-3-1-3), Meldepflicht, Erste Hilfe bei Verbrennung, Löschregeln und Bedienung des Feuerlöschers. IT-Sicherheit (WISO.03.08) ist durch AP1-7 gedeckt (P47), neu ist nur Authentizität (WISO-5-2-1)."))
