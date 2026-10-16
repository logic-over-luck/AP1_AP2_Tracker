import sys; sys.path.insert(0, sys.path[0])
from lpw import LPW, B, T, K, R, meta

L = LPW("WISO-1", "Berufsausbildung, Arbeits- und Tarifrecht", ["G.WISO.01"])
G1 = ["G.WISO.01"]; G12 = ["G.WISO.01", "G.WISO.02"]

# ---------------------------------------------------------------- 1-1 Ausbildungsvertrag
L.tb("WISO-1-1", "Ausbildungsvertrag", "Was im Ausbildungsvertrag stehen muss und was nicht stehen darf, wie die Probezeit läuft, wie das Ausbildungsverhältnis endet und welche Rechte und Pflichten beide Seiten haben.")

L.sp("WISO-1-1-1", "Ausbildungsvertrag: Abschluss, Vertragspartner, Mindestinhalte, nichtige Vereinbarungen",
     "Die Vertragspartner und Mindestinhalte des Ausbildungsvertrags kennen und in einem Vertragsentwurf zulässige von nichtigen Vereinbarungen unterscheiden.",
     G1, ["WISO.01.01.1", "WISO.01.01.1.1", "WISO.01.01.1.2", ("WISO.01.01.1.3", "Ausbildungsplan als Vertragsbestandteil"), ("WISO.01.01.1.5", "Vergütung und Urlaub als Mindestinhalt"), "WISO.01.01.1.8", "WISO.01.03.2"],
     T("2025S-A10", "2025S-A9", "2025W-A3"))
L.k(1, "Du kannst erklären, wer den Ausbildungsvertrag schließt: der Ausbildende (Betrieb) und der Auszubildende, bei Minderjährigen mit Zustimmung der gesetzlichen Vertreter; der Ausbilder ist die Person, die im Auftrag des Betriebs ausbildet, nicht Vertragspartner.", 2,
    [K("WISO.01.01.1.1")])
L.k(2, "Du kannst erklären, welche Mindestinhalte die Vertragsniederschrift enthalten muss: Art und Ziel der Ausbildung, sachliche und zeitliche Gliederung (der betriebliche Ausbildungsplan wird Teil des Vertrags), Beginn und Dauer, tägliche Arbeitszeit, Dauer der Probezeit, Vergütung, Urlaub und Kündigungsvoraussetzungen.", 2,
    [K("WISO.01.01.1"), K("WISO.01.01.1.2"), K("WISO.01.01.1.3"), K("WISO.01.01.1.5"), B("2025S-A10")])
L.k(3, "Du kannst erklären, wann und wie der Ausbildungsvertrag festgehalten wird: Der wesentliche Inhalt ist unverzüglich nach Abschluss, spätestens vor Beginn der Ausbildung niederzulegen – seit August 2024 schriftlich oder in Textform, zum Beispiel als PDF per E-Mail mit Empfangsnachweis –, und der Betrieb beantragt die Eintragung in das Verzeichnis der Berufsausbildungsverhältnisse bei der Kammer.", 2,
    [K("WISO.01.03.2"), K("WISO.01.01.1")], alt=("angepasst", "Prüfer WISO-1 Nr. a15 (D12): Textform der Vertragsniederschrift nach dem BVaDiG (seit 1.8.2024)"))
L.k(4, "Du kannst in einem Vertragsentwurf zulässige von nichtigen Vereinbarungen unterscheiden: nichtig sind zum Beispiel die Pflicht, nach der Ausbildung im Betrieb zu bleiben (außer sie wird in den letzten sechs Monaten vereinbart), eine Vertragsstrafe, eine Zahlung des Auszubildenden für die Ausbildung oder der Ausschluss von Schadensersatz; unwirksam ist nur die nichtige Vereinbarung, der übrige Vertrag gilt weiter.", 2,
    [K("WISO.01.01.1"), B("2025S-A9"), B("2025W-A3")], alt=("angepasst", "Prüfer WISO-1 Nr. a18: Teilnichtigkeit aus K5 aufgenommen"))
L.a("WISO-1-1-1-K5", "verschoben", "WISO-1-1-1-K4", "Prüfer WISO-1 Nr. a18: Ein-Fakt-Aussage (Teilnichtigkeit) in K4 aufgenommen")
L.k(6, "Du kannst den Geltungsbereich des Berufsbildungsgesetzes erklären: Es regelt die Berufsausbildung im Betrieb, nicht die Ausbildung an berufsbildenden Schulen.", 2,
    [K("WISO.01.01.1.8")])

L.sp("WISO-1-1-2", "Probezeit und Kündigung des Ausbildungsverhältnisses",
     "Die Probezeit im Ausbildungsvertrag beurteilen und die Kündigungsregeln vor und nach der Probezeit unterscheiden.",
     G1, ["WISO.01.01.1.4", "WISO.01.01.1.6"],
     T("2021W-A1", "2023S-A3", "2024S-A1", "2025S-A8", "2025W-A7", "2022S-A8", "2024S-A2", "2025S-A9", "2025W-A3"))
L.k(1, "Du kannst zulässige und unzulässige Probezeit-Vereinbarungen im Ausbildungsvertrag unterscheiden: Das Berufsbildungsgesetz schreibt eine Probezeit von mindestens einem und höchstens vier Monaten vor; keine Probezeit oder sechs Monate sind unzulässig.", 2,
    [K("WISO.01.01.1.4"), B("2021W-A1"), B("2023S-A3"), B("2024S-A1"), B("2025S-A8"), B("2025W-A7")])
L.k(2, "Du kannst erklären, wann Auszubildende nach der Probezeit kündigen können: mit einer Frist von vier Wochen, wenn sie die Ausbildung aufgeben oder sich für einen anderen Beruf ausbilden lassen wollen.", 2,
    [K("WISO.01.01.1.6"), B("2024S-A2"), B("2025S-A9"), B("2025W-A3")])
L.k(3, "Du kannst die Kündigung in der Probezeit beschreiben: Beide Seiten können jederzeit ohne Frist und ohne Angabe von Gründen kündigen.", 2,
    [K("WISO.01.01.1.6"), B("2025S-A9")])
L.k(4, "Du kannst erklären, dass der Betrieb nach der Probezeit nur aus wichtigem Grund fristlos kündigen kann und Auszubildende nach der Probezeit deshalb nicht ordentlich kündbar sind.", 2,
    [K("WISO.01.01.1.6")])
L.k(5, "Du kannst die Form einer Kündigung des Ausbildungsverhältnisses beschreiben und in einem Fall prüfen, ob sie wirksam ist: Sie muss schriftlich erfolgen, nach der Probezeit mit Angabe der Gründe; kündigt ein Minderjähriger, müssen die gesetzlichen Vertreter mitwirken.", 2,
    [K("WISO.01.01.1.6"), B("2022S-A8")])

L.sp("WISO-1-1-3", "Ende der Ausbildung, Prüfung, Zeugnis und Weiterbeschäftigung",
     "Beschreiben, wann und wie das Ausbildungsverhältnis endet, was nach der Prüfung gilt und welches Zeugnis der Betrieb ausstellen muss.",
     G1, ["WISO.01.01.1.9", "WISO.01.01.1.10"],
     T("2024S-A3", "2025S-A9", "2025W-A3", "2025W-A4", "2022S-A9"))
L.k(1, "Du kannst erklären, wann das Ausbildungsverhältnis endet: mit Ablauf der Ausbildungszeit, bei vorher bestandener Abschlussprüfung schon mit der Bekanntgabe des Ergebnisses; eine Kündigung ist dafür nicht nötig.", 2,
    [K("WISO.01.01.1.9"), B("2024S-A3"), B("2025S-A9")])
L.k(2, "Du kannst erklären, was nach bestandener Prüfung für die Weiterbeschäftigung gilt: Der Betrieb muss Auszubildende nicht übernehmen und ihnen keinen Arbeitsvertrag anbieten; arbeitet ein Auszubildender aber ohne ausdrückliche Vereinbarung weiter, entsteht ein unbefristetes Arbeitsverhältnis.", 2,
    [K("WISO.01.01.1.9"), B("2025W-A4"), B("2025S-A9"), B("2025W-A3")], alt=("angepasst", "Prüfer WISO-1 Nr. a9: keine Übernahmepflicht ergänzt (Distraktoren 2025S-A9, 2025W-A3)"))
L.k(3, "Du kannst erklären, welches Zeugnis der Betrieb am Ende ausstellen muss: immer ein einfaches Zeugnis über Art, Dauer und Ziel der Ausbildung; Angaben zu Verhalten und Leistung (qualifiziertes Zeugnis) nur auf Verlangen des Auszubildenden.", 2,
    [K("WISO.01.01.1.9"), B("2022S-A9"), B("2025S-A9"), B("2025W-A3")])
L.k(4, "Du kannst erklären, was bei nicht bestandener Abschlussprüfung gilt: Auf Verlangen des Auszubildenden verlängert sich das Ausbildungsverhältnis bis zur nächsten Wiederholungsprüfung, höchstens um ein Jahr.", 2,
    [K("WISO.01.01.1.10")])

L.sp("WISO-1-1-4", "Rechte und Pflichten von Auszubildenden und Ausbildenden",
     "Die Pflichten beider Seiten nennen, den Zweck einzelner Pflichten erklären und die Folgen von Pflichtverletzungen beschreiben.",
     G1, ["WISO.01.01", "WISO.01.01.1.7", ("WISO.01.01.1.5", "Ausbildungsvergütung"), "WISO.01.03.7"],
     T("2021W-A2", "2025W-A2"))
L.k(1, "Du kannst die Pflichten des Ausbildenden erklären: ausbilden (selbst oder durch geeignete Ausbilder), Ausbildungsmittel wie Werkzeuge und Fachliteratur kostenlos bereitstellen, die Vergütung zahlen und ein Zeugnis ausstellen.", 2,
    [K("WISO.01.01"), K("WISO.01.03.7")], alt=("angepasst", "Prüfer WISO-1 Nr. a24: Freistellung für Berufsschule und Prüfungen nur noch in WISO-1-2-1-K3"))
L.k(2, "Du kannst Pflichten des Auszubildenden nennen: sich bemühen, das Ausbildungsziel zu erreichen, Weisungen befolgen, die Berufsschule besuchen, den Ausbildungsnachweis führen und Betriebs- und Geschäftsgeheimnisse wahren.", 1,
    [K("WISO.01.01")])
L.k(4, "Du kannst die Regeln zur Ausbildungsvergütung erklären: Sie muss angemessen sein – gilt ein Tarifvertrag, ist dessen Vergütung maßgeblich, ohne Tarifbindung darf sie die gesetzliche Mindestvergütung nicht unterschreiten –, sie steigt mindestens mit jedem Ausbildungsjahr und ist spätestens am letzten Arbeitstag des Monats zu zahlen.", 2,
    [K("WISO.01.01.1.5")], alt=("angepasst", "Prüfer WISO-1 Nr. a14: Vorrang des Tarifvertrags vor der Mindestvergütung (§ 17 BBiG); Beträge nicht genannt (B4)"))
L.k(5, "Du kannst Folgen von Pflichtverletzungen beschreiben: Abmahnung, Kündigung aus wichtigem Grund und Schadensersatz.", 2,
    [K("WISO.01.01.1.7")])
L.k(6, "Du kannst den Zweck des Ausbildungsnachweises (Berichtsheft) erklären: Er dokumentiert die vermittelten Ausbildungsinhalte und ist Voraussetzung für die Zulassung zur Abschlussprüfung, wird aber nicht benotet.", 2,
    [K("WISO.01.01"), B("2021W-A2")])
L.k(7, "Du kannst die Verschwiegenheitspflicht von Auszubildenden abgrenzen: Sie umfasst Betriebs- und Geschäftsgeheimnisse, nicht jedes Vorkommnis im Betrieb, und gilt gegenüber allen Dritten.", 2,
    [K("WISO.01.01"), B("2025W-A2")])

# ---------------------------------------------------------------- 1-2 Duales System
L.tb("WISO-1-2", "Duales System, Ausbildungsordnung und zuständige Stelle", "Wie Betrieb und Berufsschule zusammen ausbilden, welche Pläne die Ausbildung regeln und welche Aufgaben Kammer und Ausbilder haben.")

L.sp("WISO-1-2-1", "Duales System: Lernorte, Zusammenwirken, Berufsschulpflicht",
     "Die Lernorte des dualen Systems unterscheiden, ihr Zusammenwirken beschreiben und die Regeln zu Berufsschule und Freistellung erklären.",
     G1, ["WISO.01.02.1", "WISO.01.02.2", "WISO.01.02.2.1", "WISO.01.02.2.2", "WISO.01.02.2.3", "WISO.01.03.4", "WISO.01.03.5", "WISO.01.03.6"], [])
L.k(1, "Du kannst die Lernorte des dualen Systems und ihre Aufgaben unterscheiden: der Betrieb für die praktische Ausbildung, die Berufsschule für die fachtheoretische und allgemeine Bildung, ergänzend überbetriebliche Ausbildungsstätten in der Region.", 2,
    [K("WISO.01.02.1")])
L.k(2, "Du kannst beschreiben, wie Betrieb und Berufsschule zusammenwirken: Absprachen, gemeinsame Arbeitskreise und die Abstimmung, wann welche Inhalte vermittelt werden.", 2,
    [K("WISO.01.02.2"), K("WISO.01.02.2.1"), K("WISO.01.02.2.2"), K("WISO.01.02.2.3")])
L.k(3, "Du kannst die Regeln zu Berufsschule und Prüfung erklären: Die Berufsschulpflicht regelt das Landesrecht – wer die Ausbildung jung beginnt, ist berufsschulpflichtig, Ältere sind je nach Bundesland nur berufsschulberechtigt –; der Betrieb muss Auszubildende für den Unterricht und für Prüfungen freistellen, und die Berufsschulzeit wird auf die Arbeitszeit angerechnet.", 2,
    [K("WISO.01.03.4"), K("WISO.01.03.5"), K("WISO.01.03.6")], alt=("angepasst", "Prüfer WISO-1 Nr. a16: Berufsschulpflicht ist Landesrecht (Ältere teils nur berechtigt)"))
L.k(5, "Du kannst Vorteile des dualen Systems beschreiben: Praxisnähe, Verbindung von Theorie und Anwendung, Einblick in den Betrieb und bundesweit anerkannte Abschlüsse.", 2,
    [K("WISO.01.02.1")])

L.sp("WISO-1-2-2", "Ausbildungsordnung, Ausbildungsrahmenplan, Rahmenlehrplan und betrieblicher Ausbildungsplan",
     "Die Regelwerke der Ausbildung unterscheiden und erklären, wie der Betrieb daraus seinen Ausbildungsplan macht.",
     G1, ["WISO.01.03.1", "WISO.01.04.1", ("WISO.01.04.2", "Ausbildungsplan"), "WISO.01.04.3", "WISO.01.04.4", "WISO.01.04.5"],
     T("2021W-A10"),
     hinweis="Dass der betriebliche Ausbildungsplan Teil des Ausbildungsvertrags wird (2025S-WISO-A10), steht in WISO-1-1-1.")
L.k(1, "Du kannst Ausbildungsrahmenplan (sachliche und zeitliche Gliederung für den Betrieb) und Rahmenlehrplan (Lernfelder der Berufsschule) unterscheiden.", 2,
    [K("WISO.01.04.1"), K("WISO.01.04.5")])
L.k(2, "Du kannst den betrieblichen Ausbildungsplan erklären: Der Betrieb ordnet die Lernziele des Ausbildungsrahmenplans seinen Abteilungen und Aufgaben zu und berücksichtigt dabei seine Besonderheiten.", 2,
    [K("WISO.01.04.2"), K("WISO.01.04.3")], alt=("angepasst", "Prüfer WISO-1 Nr. a23: „wird Teil des Vertrags“ und Beleg 2025S-A10 nur noch in WISO-1-1-1-K2"))
L.k(3, "Du kannst erklären, was ein Einsatz- und Versetzungsplan regelt: wann der Auszubildende in welcher Abteilung ist.", 2,
    [K("WISO.01.04.4")])
L.k(4, "Du kannst beschreiben, was die Ausbildungsordnung regelt: Berufsbezeichnung, Ausbildungsdauer, das Ausbildungsberufsbild mit den zu vermittelnden Kenntnissen, Fertigkeiten und Fähigkeiten, den Ausbildungsrahmenplan und die Prüfungsanforderungen – nicht aber Vergütung oder Urlaub.", 2,
    [K("WISO.01.03.1"), B("2021W-A10")])
L.k(5, "Du kannst die Zuständigkeiten zuordnen: Der Bund erlässt die Ausbildungsordnung, die Kultusministerkonferenz der Länder den Rahmenlehrplan.", 2,
    [K("WISO.01.03.1"), K("WISO.01.04.1")], alt=("angepasst", "zuordnen (F1)"))

L.sp("WISO-1-2-3", "Zuständige Stelle und Ausbilder: Aufgaben der Kammer, Eignung",
     "Die Aufgaben der Kammer als zuständige Stelle in der Ausbildung kennen, die Eignung von Ausbildern erklären und einer Frage die zuständige Stelle zuordnen.",
     G1, [("WISO.01.03.3", "Berufsbildungsgesetz: Eignung, zuständige Stelle"), ("WISO.01.06.2", "IHK als zuständige Stelle")],
     T("2022S-A6", "2022W-A1", "2023W-A12", "2025W-A1", "2021W-A14", "2023S-A28"),
     hinweis="Neuer Stichpunkt: Die Aufgaben der Kammer standen vorher in WISO-1-2-1, die Eignung der Ausbilder in WISO-1-1-4; beide kamen in fast jeder Prüfung vor. Wer den Arbeitsschutz überwacht (Gewerbeaufsicht, Berufsgenossenschaft), steht in WISO-3-1-1; die IHK als Interessenvertretung der Wirtschaft in WISO-1-5-3.")
L.k(1, "Du kannst die Aufgaben der Kammer als zuständige Stelle in der Berufsausbildung von anderen Pflichten unterscheiden: Sie trägt Ausbildungsverträge ein, überwacht die Eignung von Betrieb und Ausbildern, berät Betriebe und Auszubildende (Ausbildungsberater), nimmt Prüfungen ab und genehmigt eine Verkürzung oder Verlängerung der Ausbildung – der Betrieb muss ihr aber nicht jede Fehlzeit melden und kann keinen späteren Prüfungstermin wegen der Auftragslage verlangen.", 2,
    [K("WISO.01.06.2"), K("WISO.01.03.3"), B("2021W-A14")], alt=("angepasst", "Prüfer WISO-1 Nr. a1 (D1): Auswahl-Beleg 2021W-A14, daher unterscheiden (Stufe 2) mit den Distraktoren"))
L.k(2, "Du kannst die gesetzlichen Voraussetzungen für Ausbilder erklären: Sie müssen persönlich und fachlich geeignet sein; zur fachlichen Eignung gehören berufliche sowie berufs- und arbeitspädagogische Kenntnisse (zum Beispiel die Ausbildereignungsprüfung).", 2,
    [K("WISO.01.03.3"), B("2022S-A6"), B("2022W-A1"), B("2023W-A12"), B("2025W-A1")])
L.k(3, "Du kannst einer Frage aus der Ausbildung die zuständige Stelle zuordnen, zum Beispiel Abweichungen vom Ausbildungsplan oder eine Verkürzung der Ausbildung der Kammer (IHK) – nicht etwa der Berufsgenossenschaft, der Gewerbeaufsicht, der Berufsberatung oder dem Gesundheitsamt.", 2,
    [K("WISO.01.03.3"), B("2023S-A28"), B("2021W-A14")], alt=("angepasst", "Prüfer WISO-1 Nr. a27 (D6): Gewerbeaufsicht und Berufsgenossenschaft nur als Abgrenzung (Wohnort WISO-3-1-1)"))

# ---------------------------------------------------------------- 1-3 Arbeitsrecht
L.tb("WISO-1-3", "Arbeitsrecht", "Wie ein Arbeitsverhältnis zustande kommt und endet, welche Gesetze Arbeitnehmer schützen und welche Rechtsquelle was regelt.")

L.sp("WISO-1-3-1", "Individual- und Kollektivarbeitsrecht; Rechte und Pflichten im Arbeitsverhältnis",
     "Individual- und Kollektivarbeitsrecht unterscheiden, die Pflichten aus dem Arbeitsvertrag nennen und die Rangfolge der Regelungen anwenden.",
     G1, ["WISO.01.05", ("WISO.01.05.1", "Pflichten aus dem Arbeitsvertrag")],
     T("2022W-A7", "2022W-A5", "2022S-A1", "2021W-A23"), baut_auf=["AP1-3-4-1"],
     hinweis="Wem die Rechte an Software gehören, die ein Angestellter im Rahmen seiner Arbeit schreibt (2021W-WISO-A23), steht in AP1-3-4-1. Zu 2022W-WISO-A7: Die IHK wertete nur die im Arbeitsvertrag vereinbarte Regel (übertarifliche Gehaltsvereinbarung) als Individualarbeitsrecht, nicht aber Urlaubsregelungen nach dem Bundesurlaubsgesetz oder Unfallverhütungsvorschriften; in der Fachliteratur wird das Arbeitnehmerschutzrecht teils dem Individualarbeitsrecht zugerechnet. Betriebsvereinbarung und Tarifvorrang stehen in WISO-1-4-2, Tarifbindung in WISO-1-5-1.")
L.k(1, "Du kannst Individualarbeitsrecht (Verhältnis zwischen einzelnem Arbeitnehmer und Arbeitgeber, zum Beispiel Arbeitsvertrag) und Kollektivarbeitsrecht (Regelungen für Gruppen, zum Beispiel Tarifvertrag und Betriebsvereinbarung) unterscheiden.", 2,
    [K("WISO.01.05")])
L.k(2, "Du kannst eine Regelung dem Individual- oder dem Kollektivarbeitsrecht zuordnen, zum Beispiel eine übertarifliche Gehaltsvereinbarung im Arbeitsvertrag dem Individualarbeitsrecht, eine Betriebsvereinbarung oder betriebliche Überstundenregelung dem Kollektivarbeitsrecht.", 2,
    [K("WISO.01.05"), B("2022W-A7")], alt=("angepasst", "Prüfer WISO-1 Nr. a20: Distraktoren aus 2022W-A7 ergänzt, IHK-Wertung im Hinweis"))
L.k(3, "Du kannst die Hauptpflichten im Arbeitsverhältnis nennen: Arbeitsleistung auf der einen, Vergütung auf der anderen Seite.", 1,
    [K("WISO.01.05.1")])
L.k(4, "Du kannst Nebenpflichten unterscheiden: Verschwiegenheit und Treue (keine Konkurrenztätigkeit) beim Arbeitnehmer, Fürsorge und Beschäftigung beim Arbeitgeber.", 2,
    [K("WISO.01.05.1"), B("2022W-A5")])
L.k(5, "Du kannst die Rangfolge der Regelungen erklären: Gesetz vor Tarifvertrag vor Betriebsvereinbarung vor Arbeitsvertrag; eine für den Arbeitnehmer günstigere Abmachung geht vor (Günstigkeitsprinzip), deshalb gilt zum Beispiel ein übertarifliches Gehalt im Arbeitsvertrag auch neben einem Tarifvertrag.", 2,
    [K("WISO.01.05.1"), B("2022S-A1")], alt=("angepasst", "Prüfer WISO-1 Nr. a2: Stufe 3 → 2 (Beleg 2022S-A1 ist Einfachauswahl, Z3b); Wohnort des Günstigkeitsprinzips nach D3"))

L.sp("WISO-1-3-2", "Rechtsquellen zuordnen: welches Gesetz regelt was",
     "Einem Sachverhalt aus dem Betrieb die Rechtsquelle zuordnen, die ihn regelt.",
     G12, ["WISO.01.05.2", "WISO.01.05.2.1", "WISO.01.05.2.2", "WISO.01.05.2.7", ("WISO.01.05.2.9", "Gesetz zuordnen"), ("WISO.02.09.1", "BetrVG als Grundlage der Zusammenarbeit"), ("WISO.01.05.1", "weitere Arbeitsgesetze")],
     T("2025S-A16", "2025W-A13", "2021W-A18", "2023S-A10", "2025S-A11", "2025W-A8"), baut_auf=["PB1-2-1-1"],
     hinweis="Dass Allgemeine Geschäftsbedingungen im BGB geregelt sind (2025S-WISO-A16 b), steht in PB1-2-1-1.")
L.k(1, "Du kannst einem Sachverhalt die Rechtsquelle zuordnen, die ihn regelt, zum Beispiel Betriebsversammlung, Jugend- und Auszubildendenvertretung und die vertrauensvolle Zusammenarbeit mit dem Betriebsrat dem Betriebsverfassungsgesetz, den Urlaub Jugendlicher dem Jugendarbeitsschutzgesetz.", 2,
    [K("WISO.01.05.2"), K("WISO.01.05.2.9"), K("WISO.02.09.1"), B("2025S-A16"), B("2025W-A13"), B("2023S-A10"), B("2025S-A11"), B("2025W-A8")])
L.k(2, "Du kannst den wichtigsten Gesetzen ihren Regelungsbereich zuordnen: das Berufsbildungsgesetz der Ausbildung, das Betriebsverfassungsgesetz der Mitbestimmung im Betrieb, das Arbeitsschutzgesetz der Sicherheit und Gesundheit bei der Arbeit, die Arbeitsstättenverordnung der Gestaltung der Arbeitsräume.", 2,
    [K("WISO.01.05.2.1"), K("WISO.01.05.2.2"), K("WISO.01.05.2.7"), K("WISO.01.05.2.9")])
L.k(4, "Du kannst die heutigen Fundstellen der Katalognamen nennen: Das Schwerbehindertenrecht steht im Neunten Buch Sozialgesetzbuch (SGB IX), mit „Bundeselterngesetz“ ist das Bundeselterngeld- und Elternzeitgesetz gemeint.", 1,
    [K("WISO.01.05.2")])
L.k(5, "Du kannst weiteren Arbeitsgesetzen ihren Inhalt zuordnen: Bundesurlaubsgesetz (Mindesturlaub 24 Werktage), Entgeltfortzahlungsgesetz (Lohn bei Krankheit und an Feiertagen), Elternzeit (Kündigungsschutz während der Elternzeit), Arbeitszeitgesetz (acht Stunden werktäglich, Verlängerung im Ausnahmefall), Schwerbehindertenrecht (Zusatzurlaub, besonderer Kündigungsschutz).", 2,
    [K("WISO.01.05.1"), B("2021W-A18")])

L.sp("WISO-1-3-3", "Kündigung, Kündigungsfristen und Kündigungsschutz",
     "Kündigungsarten und -gründe unterscheiden, mit dem abgedruckten Gesetz das Ende eines Arbeitsverhältnisses bestimmen und den Kündigungsschutz in einem Fall anwenden.",
     G1, [("WISO.01.05.1", "Kündigungsfristen, fristlose Kündigung"), "WISO.01.05.2.5", ("WISO.01.05.2.13", "Kündigungsschutz Schwangerer"), ("WISO.01.05.2.14", "Kündigungsschutz Schwerbehinderter"), "ZB.wiso-gerichtsbarkeit"],
     T("2023S-A18", "2023W-A27", "2025S-A18", "2025W-A15", "2021W-A3", "2022W-A10", "2023W-A14", "2023W-A13", "2023W-A17", "2024S-A23", "2025S-A20", "2025W-A17", "2023S-A19", "2023S-A20"))
L.k(1, "Du kannst mit einem abgedruckten Auszug aus § 622 BGB das Ende eines Arbeitsverhältnisses bestimmen: Grundfrist vier Wochen zum 15. oder zum Ende eines Kalendermonats; kündigt der Arbeitgeber, verlängert sich die Frist mit der Dauer der Betriebszugehörigkeit (zum Monatsende), für den Arbeitnehmer bleibt es bei der Grundfrist.", 3,
    [K("WISO.01.05.1"), B("2023S-A18"), B("2023W-A27"), B("2025S-A18"), B("2025W-A15")], vorgegeben="§ 622 BGB (Auszug) im Aufgabentext")
L.k(2, "Du kannst Personengruppen mit besonderem Kündigungsschutz nennen und von anderen unterscheiden: Schwangere und Mütter bis vier Monate nach der Entbindung, schwerbehinderte Menschen (Zustimmung des Integrationsamts), Betriebsratsmitglieder, Auszubildende nach der Probezeit, Beschäftigte in Elternzeit – nicht aber leitende Angestellte oder Ältere allein wegen ihres Alters.", 2,
    [K("WISO.01.05.2.5"), K("WISO.01.05.2.13"), K("WISO.01.05.2.14"), B("2023W-A17"), B("2024S-A23")])
L.k(4, "Du kannst ordentliche Kündigung (mit Frist) und außerordentliche Kündigung (fristlos aus wichtigem Grund, zum Beispiel Diebstahl) unterscheiden und erkennen, dass Arbeitsmangel oder unverschuldete Krankheit keine fristlose Kündigung rechtfertigen.", 2,
    [K("WISO.01.05.1"), B("2023W-A13")])
L.k(5, "Du kannst Kündigungsgründe nach dem Kündigungsschutzgesetz zuordnen: personenbedingt (zum Beispiel lange Krankheit, fehlende Eignung), verhaltensbedingt (zum Beispiel wiederholte Verstöße trotz Abmahnung) und betriebsbedingt (zum Beispiel Schließung einer Abteilung, Auftragsmangel).", 2,
    [K("WISO.01.05.2.5"), B("2021W-A3"), B("2022W-A10"), B("2023W-A14")])
L.k(6, "Du kannst erklären, wie sich ein Arbeitnehmer gegen eine Kündigung wehrt: Der Betriebsrat ist vorher anzuhören, und innerhalb von drei Wochen nach Zugang kann er Kündigungsschutzklage beim Arbeitsgericht erheben; das Arbeitsgericht ist auch für Streit um das Arbeitszeugnis zuständig.", 2,
    [K("WISO.01.05.2.5"), K("ZB.wiso-gerichtsbarkeit"), B("2023S-A19"), B("2023S-A20")])
L.k(7, "Du kannst bei einer betriebsbedingten Kündigung unterscheiden, wem am ehesten ordentlich gekündigt werden kann: dem Beschäftigten ohne besonderen Kündigungsschutz, der nach Betriebszugehörigkeit, Alter, Unterhaltspflichten und Schwerbehinderung am wenigsten schutzwürdig ist (Sozialauswahl).", 2,
    [K("WISO.01.05.2.5"), B("2025S-A20"), B("2025W-A17")])

L.sp("WISO-1-3-4", "Arbeitszeit und Jugendarbeitsschutz",
     "Die Regeln des Arbeitszeitgesetzes und des Jugendarbeitsschutzgesetzes kennen und mit einem abgedruckten Gesetzesauszug auf Dienstplan und Urlaub anwenden.",
     G1, ["WISO.01.05.2.6", "WISO.01.05.2.8", ("WISO.01.08.1", "günstigere Tarifregel beim Urlaub")],
     T("2022S-A3", "2022S-A4", "2022S-A5", "2023S-A2", "2023W-A11", "2025S-A14", "2025W-A11", "2025W-A13"))
L.k(1, "Du kannst die Ruhepausen nach dem Arbeitszeitgesetz nennen: mindestens 30 Minuten bei mehr als sechs Stunden und 45 Minuten bei mehr als neun Stunden Arbeit.", 1,
    [K("WISO.01.05.2.8")])
L.k(2, "Du kannst die Schutzregeln des Jugendarbeitsschutzgesetzes erklären und von falschen Angaben unterscheiden: höchstens acht Stunden täglich und 40 Stunden wöchentlich an fünf Tagen, mindestens zwölf Stunden Freizeit zwischen zwei Arbeitstagen, ärztliche Erstuntersuchung vor Beginn der Beschäftigung; Zweck ist der Schutz von Gesundheit und Entwicklung.", 2,
    [K("WISO.01.05.2.6"), B("2022S-A4"), B("2023S-A2"), B("2025S-A14"), B("2025W-A11")])
L.k(3, "Du kannst die Ruhepausen für Jugendliche nennen: 30 Minuten bei mehr als viereinhalb und 60 Minuten bei mehr als sechs Stunden Arbeitszeit; länger als viereinhalb Stunden hintereinander ohne Pause ist nicht erlaubt.", 1,
    [K("WISO.01.05.2.6")])
L.k(4, "Du kannst weitere Regeln für Jugendliche nennen: Beschäftigung nur zwischen 6 und 20 Uhr, Freistellung am Arbeitstag unmittelbar vor der schriftlichen Abschlussprüfung.", 1,
    [K("WISO.01.05.2.6")])
L.k(5, "Du kannst die Grundregeln des Arbeitszeitgesetzes für Erwachsene nennen: werktäglich acht Stunden, verlängerbar auf zehn, wenn im Durchschnitt acht eingehalten werden, und elf Stunden Ruhezeit zwischen zwei Arbeitstagen.", 1,
    [K("WISO.01.05.2.8")])
L.k(6, "Du kannst mit einem abgedruckten Auszug aus dem Jugendarbeitsschutzgesetz den Urlaubsanspruch eines Jugendlichen bestimmen: Maßgeblich ist das Alter zu Beginn des Kalenderjahres; gewährt ein Tarifvertrag mehr, gilt die günstigere Regelung.", 3,
    [K("WISO.01.05.2.6"), K("WISO.01.08.1"), B("2022S-A5")], vorgegeben="§ 19 JArbSchG und Auszug aus dem Tarifvertrag im Aufgabentext")
L.k(7, "Du kannst mit einem abgedruckten Auszug aus dem Jugendarbeitsschutzgesetz für einen Dienstplan bestimmen, ob Beginn und Pausen zulässig sind: Beschäftigung frühestens ab 6 Uhr, Pausen frühestens eine Stunde nach Beginn, nicht länger als viereinhalb Stunden ohne Pause.", 3,
    [K("WISO.01.05.2.6"), B("2022S-A3"), B("2023W-A11")], vorgegeben="§ 11 und § 14 JArbSchG (Auszug) im Aufgabentext")

L.sp("WISO-1-3-5", "Mutterschutz, Elternzeit, Gleichbehandlung und Schutz schwerbehinderter Menschen",
     "Die Schutzregeln für Schwangere und Mütter, Eltern und schwerbehinderte Menschen kennen und Verstöße gegen das Gleichbehandlungsgesetz erkennen.",
     G1, ["WISO.01.05.2.3", "WISO.01.05.2.4", "WISO.01.05.2.13", "WISO.01.05.2.14"],
     T("2021W-A5", "2022W-A9", "2023W-A18", "2024S-A18", "2021W-A22", "2022W-A28", "2023S-A29", "2024S-A27", "2025S-A24", "2025S-A25", "2025W-A21", "2023S-A1", "2023W-A2"))
L.k(1, "Du kannst die Schutzfrist nach der Entbindung nennen: acht Wochen, bei Früh- und Mehrlingsgeburten zwölf Wochen; in dieser Zeit darf die Mutter nicht beschäftigt werden.", 1,
    [K("WISO.01.05.2.13"), B("2023W-A18"), B("2024S-A18")])
L.k(2, "Du kannst Regeln des Mutterschutzgesetzes von falschen Angaben unterscheiden: Kündigungsverbot während der Schwangerschaft bis vier Monate nach der Entbindung, Freistellung für Vorsorgeuntersuchungen ohne Lohnausfall, Schutzfristen vor und nach der Geburt.", 2,
    [K("WISO.01.05.2.13"), B("2021W-A5"), B("2022W-A9")])
L.k(3, "Du kannst die Merkmale nennen, wegen derer nach dem Allgemeinen Gleichbehandlungsgesetz niemand benachteiligt werden darf: ethnische Herkunft, Geschlecht, Religion oder Weltanschauung, Behinderung, Alter und sexuelle Identität – nicht aber zum Beispiel die Art des Abschlusses.", 1,
    [K("WISO.01.05.2.4"), B("2024S-A27")])
L.k(4, "Du kannst an einer Stellenanzeige, einer Personalauswahl oder einer Entscheidung im Betrieb unterscheiden, ob sie gegen das Gleichbehandlungsgesetz verstößt, zum Beispiel „junge Mitarbeiter“, nur männliche Berufsbezeichnung oder „deutscher Herkunft“ gegenüber einer Auswahl allein nach Qualifikation.", 2,
    [K("WISO.01.05.2.4"), B("2021W-A22"), B("2022W-A28"), B("2023S-A29"), B("2025S-A24"), B("2025S-A25"), B("2025W-A21")])
L.k(5, "Du kannst die Schutzfrist vor der Entbindung (sechs Wochen, auf eigenen Wunsch darf die Frau weiterarbeiten) und die Elternzeit nennen: bis zu drei Jahre je Kind, mit Kündigungsschutz.", 1,
    [K("WISO.01.05.2.13"), K("WISO.01.05.2.3")])
L.k(6, "Du kannst Schutzregeln für schwerbehinderte Menschen nennen: fünf Arbeitstage Zusatzurlaub, Kündigung nur mit Zustimmung des Integrationsamts.", 1,
    [K("WISO.01.05.2.14")])
L.k(7, "Du kannst im Einstellungsgespräch zulässige von unzulässigen Fragen unterscheiden: zulässig sind Fragen nach Qualifikation, bisherigen Tätigkeiten und Gehaltsvorstellung, unzulässig nach Heiratsplänen, Schwangerschaft, Partei-, Gewerkschafts- oder Religionszugehörigkeit, Krankheiten oder Vermögen.", 2,
    [K("WISO.01.05.2.4"), B("2023S-A1"), B("2023W-A2")])

L.sp("WISO-1-3-6", "Arbeitsverhältnis: Einstellung, Probezeit, Befristung, Zeitarbeit, Urlaub und Zeugnis",
     "Den Weg von der Bewerbung bis zum laufenden Arbeitsverhältnis beschreiben und Regeln zu Probezeit, Befristung, Zeitarbeit, Urlaub und Arbeitszeugnis anwenden.",
     G1, [("WISO.01.05.1", "Arbeitsvertrag, Befristung, Zeitarbeit, Urlaub, Zeugnis")],
     T("2023W-A1", "2023W-A3", "2022S-A2", "2022W-A4", "2024S-A4", "2022W-A6", "2022W-A8", "2022W-A11", "2025S-A19", "2025W-A16"),
     hinweis="Neuer Stichpunkt: Fragen zum Arbeitsvertrag kamen in fast jeder Prüfung vor und standen vorher nur verstreut in WISO-1-3-1 und WISO-1-3-3.")
L.k(1, "Du kannst die Schritte einer Einstellung ordnen (Bewerbung, Vorstellungsgespräch, Arbeitsvertrag, erster Arbeitstag, erste Vergütung, Ende der Probezeit) und erklären, welche Unterlagen der neue Arbeitgeber verlangen kann, zum Beispiel steuerliche Identifikationsnummer und Urlaubsbescheinigung des letzten Arbeitgebers.", 2,
    [K("WISO.01.05.1"), B("2023W-A1"), B("2023W-A3")])
L.k(2, "Du kannst die Probezeit im Arbeitsverhältnis von der in der Ausbildung unterscheiden: Sie ist nicht vorgeschrieben und dauert höchstens sechs Monate; in dieser Zeit gilt eine Kündigungsfrist von zwei Wochen.", 2,
    [K("WISO.01.05.1"), B("2022S-A2")])
L.k(3, "Du kannst die Regeln zur Befristung erklären: Ein befristeter Arbeitsvertrag muss schriftlich vereinbart werden und endet mit Ablauf der Zeit, ohne dass gekündigt werden muss; ohne sachlichen Grund ist eine Befristung bis zu zwei Jahren möglich.", 2,
    [K("WISO.01.05.1"), B("2022W-A4"), B("2024S-A4")])
L.k(4, "Du kannst Arbeitnehmerüberlassung (Zeitarbeit) erklären: Der Verleiher stellt den Zeitarbeitnehmer ein und bezahlt ihn, der Entleiher setzt ihn in seinem Betrieb ein.", 2,
    [K("WISO.01.05.1"), B("2022W-A6")])
L.k(5, "Du kannst Regeln des Bundesurlaubsgesetzes von falschen Angaben unterscheiden: mindestens 24 Werktage im Jahr, der volle Anspruch entsteht erst nach sechs Monaten (Wartezeit), Krankheitstage im Urlaub werden mit ärztlichem Attest nicht angerechnet, Resturlaub ist grundsätzlich bis Ende März des Folgejahres zu nehmen.", 2,
    [K("WISO.01.05.1"), B("2022W-A8")])
L.k(6, "Du kannst einfaches und qualifiziertes Arbeitszeugnis unterscheiden und die Zeugnissprache deuten: Das einfache enthält Art und Dauer der Tätigkeit, das qualifizierte auf Verlangen des Arbeitnehmers zusätzlich Leistung und Verhalten; „stets zu unserer vollsten Zufriedenheit“ bedeutet sehr gut.", 2,
    [K("WISO.01.05.1"), B("2022W-A11"), B("2025S-A19"), B("2025W-A16")])

# ---------------------------------------------------------------- 1-4 Mitbestimmung
L.tb("WISO-1-4", "Mitbestimmung im Betrieb", "Wie Arbeitnehmer im Betrieb über Betriebsrat, Betriebsversammlung und Jugend- und Auszubildendenvertretung mitbestimmen und wie Arbeitgeber und Betriebsrat zusammenarbeiten.")

L.sp("WISO-1-4-1", "Betriebsrat: Wahl, Zusammensetzung, Mitbestimmungs- und Mitwirkungsrechte",
     "Wer den Betriebsrat wählt und gewählt werden kann, wie groß er ist und wo er mitbestimmt oder nur mitwirkt.",
     G12, ["WISO.01.07.2", "WISO.01.07.2.1", "WISO.01.07.2.2", ("WISO.01.05.2.9", "Betriebsrat"), ("WISO.02.09.2", "Betriebsrat vertritt die Arbeitnehmer"), ("WISO.02.09.4", "Personalvertretung")],
     T("2024S-A6", "2021W-A15", "2025S-A13", "2025W-A10", "2023W-A8", "2023W-A9", "2022W-A12", "2023W-A7", "2021W-A16", "2022S-A10", "2022W-A13", "2023S-A12", "2023W-A10", "2022S-A7"))
L.k(1, "Du kannst erklären, wessen Interessen der Betriebsrat vertritt: die der Arbeitnehmer des Betriebs, nicht die des Arbeitgebers oder der leitenden Angestellten.", 2,
    [K("WISO.01.07.2"), K("WISO.02.09.2"), B("2024S-A6")])
L.k(2, "Du kannst Wahlrecht und Wählbarkeit unterscheiden: Wählen dürfen alle Arbeitnehmer ab 16 Jahren (Leiharbeitnehmer erst nach mehr als drei Monaten Einsatz), gewählt werden können volljährige Arbeitnehmer, die dem Betrieb mindestens sechs Monate angehören; eine Gewerkschaftsmitgliedschaft ist nicht nötig.", 2,
    [K("WISO.01.07.2.1"), B("2021W-A15"), B("2025S-A13"), B("2025W-A10"), B("2023W-A8")])
L.k(3, "Du kannst Angelegenheiten nennen, in denen der Betriebsrat mitbestimmt, zum Beispiel Beginn und Ende der Arbeitszeit, Mehrarbeit, Urlaubsplan und Betriebsferien, Einführung technischer Überwachung wie Kameras – nicht aber Personalplanung, Bauvorhaben oder die Besetzung der Geschäftsführung.", 1,
    [K("WISO.01.07.2.2"), B("2021W-A16"), B("2022S-A10"), B("2022W-A13"), B("2023S-A12"), B("2023W-A10")])
L.k(4, "Du kannst Mitbestimmung (ohne Zustimmung des Betriebsrats geht es nicht) von Mitwirkung (Information, Anhörung, Beratung) unterscheiden und erklären, dass eine Kündigung ohne Anhörung des Betriebsrats unwirksam ist.", 2,
    [K("WISO.01.07.2.2"), K("WISO.01.05.2.9"), B("2022S-A7")])
L.k(5, "Du kannst Rahmenregeln des Betriebsrats nennen: Er kann ab fünf wahlberechtigten Arbeitnehmern gewählt werden, die Amtszeit beträgt vier Jahre; im öffentlichen Dienst tritt der Personalrat an seine Stelle.", 1,
    [K("WISO.01.07.2.1"), K("WISO.02.09.4"), B("2023W-A9")])
L.k(6, "Du kannst mit einem abgedruckten Auszug aus dem Betriebsverfassungsgesetz die Zahl der Wahlberechtigten und die Größe des Betriebsrats ermitteln: Mitgezählt werden alle Arbeitnehmer ab 16 Jahren einschließlich Auszubildender und befristet Beschäftigter, Leiharbeitnehmer erst nach drei Monaten Einsatz.", 3,
    [K("WISO.01.07.2.1"), B("2022W-A12"), B("2023W-A7")], vorgegeben="§§ 7 und 9 BetrVG (Auszug) im Aufgabentext")

L.sp("WISO-1-4-2", "Zusammenarbeit von Arbeitgeber und Betriebsrat: Betriebsvereinbarung, Betriebsversammlung, Einigungsstelle",
     "Den Grundsatz der vertrauensvollen Zusammenarbeit erklären, Inhalte einer Betriebsvereinbarung bestimmen und Betriebsversammlung und Einigungsstelle einordnen.",
     G12, ["WISO.01.05.2.10", "WISO.01.07.2.3", "WISO.01.07.2.4", "WISO.02.09.1", ("WISO.02.09.4", "Betriebsvereinbarungen")],
     T("2021W-A4", "2024S-A5", "2023S-A11", "2025S-A15", "2023S-A10"),
     hinweis="Der frühere Stichpunkt WISO-2-5-4 (vertrauensvolle Zusammenarbeit) ist hier aufgegangen; er wiederholte die Mitbestimmung aus diesem Themenblock.")
L.k(1, "Du kannst unterscheiden, welche Sachverhalte eine Betriebsvereinbarung regeln kann, zum Beispiel Pausenregelung, Urlaubsplan, Gleitzeit, Beurteilungsverfahren – nicht aber Entgelte nach Gehaltsgruppen, weniger Urlaub als im Tarifvertrag oder eine Arbeitszeit über dem Gesetz.", 2,
    [K("WISO.01.05.2.10"), B("2024S-A5")], alt=("angepasst", "an den Prüfungsfällen ausgerichtet"))
L.k(2, "Du kannst erklären, wie eine Betriebsvereinbarung zustande kommt und wirkt: ein Vertrag zwischen Arbeitgeber und Betriebsrat, der verbindliche Regeln für die genannten Arbeitnehmer des Betriebs schafft.", 2,
    [K("WISO.01.05.2.10"), K("WISO.02.09.4"), B("2021W-A4")])
L.k(3, "Du kannst erklären, dass Arbeitsentgelte und andere Arbeitsbedingungen, die üblicherweise ein Tarifvertrag regelt, nicht Gegenstand einer Betriebsvereinbarung sein können, außer der Tarifvertrag lässt es ausdrücklich zu.", 2,
    [K("WISO.01.05.2.10")])
L.k(4, "Du kannst die Betriebsversammlung erklären: die Versammlung aller Arbeitnehmer des Betriebs, einmal im Kalendervierteljahr, auf der der Betriebsrat berichtet; die Teilnahme gilt als Arbeitszeit und wird bezahlt.", 2,
    [K("WISO.01.07.2.3"), B("2023S-A11"), B("2025S-A15"), B("2023S-A10")])
L.k(5, "Du kannst erklären, wozu die Einigungsstelle dient: Sie entscheidet, wenn sich Arbeitgeber und Betriebsrat in einer mitbestimmungspflichtigen Frage nicht einigen; einen Arbeitskampf dürfen beide nicht gegeneinander führen.", 2,
    [K("WISO.01.07.2.4"), K("WISO.02.09.1")])
L.k(6, "Du kannst den Grundsatz der vertrauensvollen Zusammenarbeit aus dem Betriebsverfassungsgesetz erklären: Arbeitgeber und Betriebsrat arbeiten unter Beachtung der Tarifverträge zum Wohl der Arbeitnehmer und des Betriebs zusammen.", 2,
    [K("WISO.02.09.1")])

L.sp("WISO-1-4-3", "Jugend- und Auszubildendenvertretung",
     "Erklären, wen die JAV vertritt, wer sie wählt, welche Aufgaben sie hat und wie sie mit dem Betriebsrat zusammenarbeitet.",
     G12, ["WISO.01.07.2.5", ("WISO.02.09.3", "Rechte der JAV")],
     T("2025S-A11", "2025W-A8", "2022S-A11", "2022W-A14", "2025S-A12", "2025W-A9"))
L.k(1, "Du kannst zuordnen, wo die JAV geregelt ist: im Betriebsverfassungsgesetz.", 2,
    [K("WISO.01.07.2.5"), B("2025S-A11"), B("2025W-A8")])
L.k(2, "Du kannst die Aufgaben der JAV erklären: beim Betriebsrat Maßnahmen beantragen, die Jugendlichen und Auszubildenden dienen, und darüber wachen, dass die Schutzvorschriften eingehalten werden.", 2,
    [K("WISO.01.07.2.5"), K("WISO.02.09.3"), B("2025S-A12"), B("2025W-A9")])
L.k(3, "Du kannst Wahlrecht und Wählbarkeit zur JAV erklären: Wählen dürfen Arbeitnehmer unter 18 Jahren und Auszubildende unter 25 Jahren, gewählt werden können Arbeitnehmer bis 25 Jahre.", 2,
    [K("WISO.01.07.2.5"), B("2022S-A11")])
L.k(4, "Du kannst erklären, wie die JAV mit Betriebsrat und Arbeitgeber zusammenarbeitet: Sie gibt es nur in Betrieben mit Betriebsrat, sie bringt ihre Anliegen über den Betriebsrat ein und kann an dessen Sitzungen teilnehmen; selbstständig gegenüber der Geschäftsleitung handelt sie nicht.", 2,
    [K("WISO.01.07.2.5"), K("WISO.02.09.3"), B("2022W-A14"), B("2025S-A12"), B("2025W-A9")])
L.k(5, "Du kannst die Amtszeit der JAV nennen: zwei Jahre.", 1,
    [K("WISO.01.07.2.5")])

# ---------------------------------------------------------------- 1-5 Tarifrecht und Verbände
L.tb("WISO-1-5", "Tarifrecht und Verbände", "Wer Tarifverträge schließt, was sie regeln und für wen sie gelten, wie eine Tarifrunde mit Schlichtung und Arbeitskampf abläuft und welche Verbände die Beteiligten vertreten.")

L.sp("WISO-1-5-1", "Tarifvertrag: Arten, Tarifautonomie, Tarifbindung, Geltungsbereich, Laufzeit",
     "Tarifvertragsparteien und Arten von Tarifverträgen unterscheiden und Tarifautonomie, Tarifbindung und Friedenspflicht erklären.",
     G1, ["WISO.01.08.1", "WISO.01.08.2", "WISO.01.08.6", "WISO.01.08.7", "WISO.01.08.8", "WISO.01.08.9"],
     T("2023W-A24", "2024S-A25", "2022S-A14", "2024S-A24", "2023W-A25", "2022S-A13", "2021W-A6", "2022S-A12"))
L.k(1, "Du kannst die Tarifvertragsparteien nennen: Gewerkschaften auf der einen, Arbeitgeberverbände oder einzelne Arbeitgeber (Haustarif) auf der anderen Seite – nicht der Staat, die Kammer oder der Betriebsrat.", 1,
    [K("WISO.01.08.1"), B("2023W-A24"), B("2024S-A25")])
L.k(2, "Du kannst Lohn- und Gehaltstarifvertrag (Höhe der Entgelte je Gruppe, kurze Laufzeit) und Mantel- oder Rahmentarifvertrag (Arbeitszeit, Urlaub, Sonderurlaub, Kündigungsfristen, längere Laufzeit) unterscheiden.", 2,
    [K("WISO.01.08.1"), B("2022S-A14"), B("2024S-A24")])
L.k(3, "Du kannst Tarifautonomie erklären: Die Tarifparteien regeln Löhne und Arbeitsbedingungen in freier Vereinbarung ohne Einmischung des Staates.", 2,
    [K("WISO.01.08.2"), K("WISO.01.08.6"), B("2023W-A25"), B("2022S-A13")])
L.k(4, "Du kannst Tarifbindung erklären: Der Tarifvertrag gilt unmittelbar für Gewerkschaftsmitglieder bei tarifgebundenen Arbeitgebern; ein für allgemeinverbindlich erklärter Tarifvertrag gilt für alle Arbeitnehmer der Branche; günstigere Regelungen in Betriebsvereinbarung oder Arbeitsvertrag bleiben möglich.", 2,
    [K("WISO.01.08.7"), B("2021W-A6"), B("2022S-A13")])
L.k(5, "Du kannst den Geltungsbereich eines Tarifvertrags beschreiben: räumlich, fachlich (Branche) und persönlich; ein Haustarifvertrag gilt nur für das eine Unternehmen.", 2,
    [K("WISO.01.08.8"), B("2021W-A6")])
L.k(6, "Du kannst die Friedenspflicht erklären: Während der Laufzeit eines Tarifvertrags sind Streik und Aussperrung über die geregelten Punkte verboten (absolute Friedenspflicht: über alle Punkte).", 2,
    [K("WISO.01.08.9"), B("2022S-A12")])

L.sp("WISO-1-5-2", "Tarifverhandlung, Schlichtung und Arbeitskampf: Streik und Aussperrung",
     "Den Ablauf einer Tarifrunde ordnen und Schlichtung, Streik, Urabstimmung und Aussperrung erklären.",
     G1, ["WISO.01.08.3", "WISO.01.08.4", "WISO.01.08.5"],
     T("2021W-A7", "2023W-A26", "2025S-A17", "2025W-A14"))
L.k(1, "Du kannst Streik und Aussperrung als Kampfmittel unterscheiden: Mit dem Streik legen Arbeitnehmer die Arbeit nieder, mit der Aussperrung lässt der Arbeitgeber Arbeitnehmer nicht arbeiten und zahlt keinen Lohn; auf einen Streik kann er mit Aussperrung antworten.", 2,
    [K("WISO.01.08.4"), B("2025S-A17"), B("2025W-A14")])
L.k(2, "Du kannst erklären, dass vor einem unbefristeten Streik eine Urabstimmung der Gewerkschaftsmitglieder stattfindet und Streiks erst nach Ablauf des Tarifvertrags zulässig sind; eine Genehmigung durch Staat oder Dachverband braucht es nicht.", 2,
    [K("WISO.01.08.4"), B("2025S-A17"), B("2025W-A14")])
L.k(3, "Du kannst den Ablauf einer Tarifrunde ordnen: Kündigung des Tarifvertrags, Verhandlungen, Erklärung des Scheiterns, Schlichtung (Schlichterspruch, Annahme) oder Urabstimmung und Streik, neue Verhandlung, Abschluss des neuen Tarifvertrags.", 2,
    [K("WISO.01.08.3"), K("WISO.01.08.5"), B("2021W-A7"), B("2023W-A26")])
L.k(4, "Du kannst die Schlichtung erklären: Ein neutraler Schlichter schlägt eine Einigung vor, die die Tarifparteien annehmen oder ablehnen.", 2,
    [K("WISO.01.08.5")])
L.k(5, "Du kannst Warnstreik (kurz, während der Verhandlungen) und unbefristeten Streik unterscheiden.", 2,
    [K("WISO.01.08.4")])

L.sp("WISO-1-5-3", "Gewerkschaften, Arbeitgeberverbände, Kammern und Wirtschaftsverbände",
     "Aufgaben der Arbeitnehmer- und Arbeitgeberorganisationen, der Kammern und der Wirtschaftsverbände unterscheiden.",
     G1, ["WISO.01.06.1", ("WISO.01.06.2", "IHK als Interessenvertretung"), "WISO.01.06.3", "WISO.01.07.1"],
     T("2022W-A17", "2023S-A16"),
     hinweis="Branchenorganisation, berufsständische Vertretungen und Ehrenamt (Katalog WISO.02.07) stehen in WISO-2-5-2; Ziele und Aufgaben von Gewerkschaften und Arbeitgeberverbänden nur hier.")
L.k(1, "Du kannst Ziele und Aufgaben der Gewerkschaften erklären: bessere Löhne und Arbeitsbedingungen durchsetzen, Tarifverträge aushandeln, Mitglieder beraten und vor Gericht vertreten.", 2,
    [K("WISO.01.07.1")])
L.k(2, "Du kannst Aufgaben der Arbeitgeberverbände erklären: die Arbeitgeber einer Branche als Tarifpartner vertreten, ihre Mitglieder beraten und ihre Interessen gegenüber der Politik vertreten.", 2,
    [K("WISO.01.06.1")])
L.k(3, "Du kannst die Aufgaben der Industrie- und Handelskammer von denen anderer Stellen unterscheiden: Sie vertritt die gewerbliche Wirtschaft, berät ihre Mitglieder (zum Beispiel bei der Suche nach Fachkräften) und ist zuständige Stelle für Aus- und Weiterbildung; sie führt nicht das Handelsregister, legt keine Steuern fest und schließt keine Tarifverträge.", 2,
    [K("WISO.01.06.2"), B("2022W-A17"), B("2023S-A16")])
L.k(4, "Du kannst erklären, dass die Mitgliedschaft in Gewerkschaft und Arbeitgeberverband freiwillig ist, die in der Kammer für Gewerbebetriebe dagegen Pflicht.", 2,
    [K("WISO.01.06.1"), K("WISO.01.06.2"), K("WISO.01.07.1")])
L.k(5, "Du kannst Wirtschaftsverbände als Interessenvertretung einer Branche gegenüber Politik und Öffentlichkeit einordnen und von den Arbeitgeberverbänden als Tarifpartnern unterscheiden.", 2,
    [K("WISO.01.06.3")])

# ---------------------------------------------------------------- 1-6 Entgelt und Sozialversicherung
L.tb("WISO-1-6", "Entgelt und Sozialversicherung", "Wie aus dem Bruttolohn das Nettoentgelt wird, welche Sozialversicherungen es gibt, wer sie trägt und bezahlt, und wie die Beiträge berechnet werden.")

L.sp("WISO-1-6-1", "Entgeltabrechnung: Lohn- und Gehaltsformen, Brutto und Netto, Lohn- und Kirchensteuer, vermögenswirksame Leistungen",
     "Die Positionen einer Entgeltabrechnung erklären, die Steuerklasse zuordnen und vermögenswirksame Leistungen und Realeinkommen einordnen.",
     G12, ["WISO.01.09.1", "WISO.01.09.2", "WISO.01.09.4", "WISO.01.05.2.12", ("ZB.wiso-konjunktur", "Realeinkommen")],
     T("2021W-A11", "2021W-A9", "2023S-A9", "2023W-A3", "2023W-A4"))
L.k(1, "Du kannst den Weg vom Brutto zum Netto beschreiben: Bruttoentgelt minus Lohnsteuer, Solidaritätszuschlag und gegebenenfalls Kirchensteuer, minus Arbeitnehmeranteile zur Sozialversicherung.", 2,
    [K("WISO.01.09.1")])
L.k(2, "Du kannst erklären, wie die Lohnsteuer erhoben wird und einer Person ihre Steuerklasse zuordnen: Der Arbeitgeber behält sie ein und führt sie an das Finanzamt ab; Ledige ohne Kind haben Steuerklasse I, Alleinerziehende II, Verheiratete III/V oder IV.", 2,
    [K("WISO.01.09.2"), K("WISO.01.05.2.12"), B("2021W-A11")])
L.k(3, "Du kannst erklären, dass Kirchensteuer nur Mitglieder einer steuererhebenden Religionsgemeinschaft zahlen.", 2,
    [K("WISO.01.09.2")])
L.k(4, "Du kannst vermögenswirksame Leistungen erklären und geförderte Anlageformen erkennen: eine Zahlung des Arbeitgebers in einen Sparvertrag des Arbeitnehmers, staatlich gefördert zum Beispiel beim Bausparvertrag oder speziellen VL-Sparplan.", 2,
    [K("WISO.01.09.4"), B("2021W-A9")])
L.k(5, "Du kannst Zeitlohn, Leistungslohn (Akkord, Prämie) und Gehalt unterscheiden.", 2,
    [K("WISO.01.09.1")])
L.k(6, "Du kannst Nominal- und Realeinkommen unterscheiden: Steigen die Preise stärker als das Einkommen, sinkt das Realeinkommen (die Kaufkraft), auch wenn das Nominaleinkommen steigt.", 2,
    [K("WISO.01.09.1"), K("ZB.wiso-konjunktur"), B("2023S-A9")])
L.k(7, "Du kannst aus Stundenlohn, Arbeitsstunden, Zuschlägen und Sonderzahlungen den Bruttolohn eines Monats berechnen.", 3,
    [K("WISO.01.09.1"), B("2023W-A4")], vorgegeben="Stundenlohn, Zuschlag und Sonderzahlung im Aufgabentext")

L.sp("WISO-1-6-2", "Sozialversicherung: Zweige, Träger, Finanzierung, Leistungen",
     "Die fünf Zweige der Sozialversicherung mit Träger, Finanzierung und Leistungen kennen und Regeln wie Beitragsbemessungsgrenze, Versicherungspflichtgrenze und Generationenvertrag erklären.",
     G1, [("WISO.01.05.2.11", "Sozialversicherung"), ("WISO.01.09.3", "Wer zahlt welchen Beitrag"), ("ZB.wiso-gerichtsbarkeit", "Sozialgericht")],
     T("2022S-A15", "2023S-A7", "2022W-A16", "2022W-A20", "2024S-A8", "2023S-A8", "2024S-A26", "2021W-A8", "2022W-A19", "2024S-A7"),
     hinweis="Die gesetzliche Unfallversicherung (Träger, Leistungen, versicherte Fälle) steht jetzt gesammelt in WISO-3-1-3.")
L.k(1, "Du kannst die fünf Zweige der gesetzlichen Sozialversicherung nennen (Kranken-, Pflege-, Renten-, Arbeitslosen- und Unfallversicherung) und von privaten Versicherungen wie der Lebensversicherung unterscheiden.", 2,
    [K("WISO.01.05.2.11"), B("2022S-A15")])
L.k(3, "Du kannst Streitigkeiten mit einem Träger der Sozialversicherung (zum Beispiel einer Krankenkasse) dem Sozialgericht zuordnen.", 2,
    [K("ZB.wiso-gerichtsbarkeit"), B("2024S-A7")])
L.k(4, "Du kannst Beitragsbemessungsgrenze, Versicherungspflichtgrenze und Generationenvertrag unterscheiden: Für Einkommen über der Bemessungsgrenze fallen keine Beiträge an; wer über der Versicherungspflichtgrenze verdient, kann die gesetzliche Krankenversicherung verlassen oder freiwillig bleiben; die Renten werden aus den Beiträgen der heute Erwerbstätigen bezahlt (Umlageverfahren).", 2,
    [K("WISO.01.05.2.11"), B("2024S-A8"), B("2023S-A8"), B("2024S-A26")])
L.k(5, "Du kannst den Zweigen ihre Träger zuordnen: Krankenkassen, Pflegekassen, Deutsche Rentenversicherung, Bundesagentur für Arbeit, Berufsgenossenschaften.", 2,
    [K("WISO.01.05.2.11")])
L.k(6, "Du kannst die Finanzierung erklären: Arbeitgeber und Arbeitnehmer teilen sich die Beiträge grundsätzlich je zur Hälfte, die Unfallversicherung zahlt der Arbeitgeber allein, bei geringfügig Beschäftigten trägt er in der Regel alle Beiträge, und Kinderlose ab 23 Jahren zahlen in der Pflegeversicherung einen Zuschlag.", 2,
    [K("WISO.01.09.3"), K("WISO.01.05.2.11"), B("2023S-A7"), B("2022W-A16"), B("2022W-A20")])
L.k(7, "Du kannst Leistungen der Renten- und Arbeitslosenversicherung erklären: Die gesetzliche Rente wird voraussichtlich nicht allein zur Altersvorsorge reichen (demografischer Wandel), das Arbeitslosengeld richtet sich nach dem Bruttoentgelt der letzten zwölf Monate.", 2,
    [K("WISO.01.05.2.11"), B("2021W-A8"), B("2022W-A19")])

L.sp("WISO-1-6-3", "Sozialversicherungsbeiträge berechnen",
     "Den Arbeitnehmeranteil zu einzelnen Sozialversicherungen aus Bruttoentgelt und vorgegebenen Beitragssätzen berechnen.",
     G1, [("WISO.01.09.3", "Beiträge berechnen"), ("WISO.01.09.1", "Netto berechnen")],
     T("2025W-A25", "2023S-A6", "2023W-A4"))
L.k(1, "Du kannst den Arbeitnehmeranteil zur Krankenversicherung berechnen: Bruttoentgelt mal die Hälfte von allgemeinem Beitragssatz plus Zusatzbeitrag.", 3,
    [K("WISO.01.09.3"), B("2025W-A25")], vorgegeben="Beitragssätze im Aufgabentext")
L.k(3, "Du kannst auf dieselbe Weise den Arbeitnehmeranteil zur Renten- und Arbeitslosenversicherung berechnen (halber Beitragssatz) und bei der Pflegeversicherung den Zuschlag für Kinderlose berücksichtigen, den der Arbeitnehmer allein trägt.", 3,
    [K("WISO.01.09.3"), B("2023S-A6"), B("2023W-A4")], vorgegeben="Beitragssätze im Aufgabentext")
L.k(4, "Du kannst die Beitragsbemessungsgrenze bei der Berechnung anwenden: Liegt das Entgelt darüber, wird der Beitrag nur aus dem Betrag bis zur Grenze berechnet.", 3,
    [K("WISO.01.09.3")])
L.k(5, "Du kannst aus Bruttoentgelt, vorgegebener Lohnsteuer und den Arbeitnehmeranteilen zur Sozialversicherung das Nettoentgelt berechnen.", 3,
    [K("WISO.01.09.1"), K("WISO.01.09.3")])

# ---------------------------------------------------------------- 1-7 Lernen und Arbeitstechniken
L.tb("WISO-1-7", "Lernen und Arbeitstechniken", "Mit welchen Lern- und Arbeitstechniken du dein Lernen und deine Arbeit organisierst und wie du digitale Lernmedien bewertest.")

L.sp("WISO-1-7-1", "Lerntechniken: visuell, auditiv, kommunikativ, motorisch",
     "Lerntechniken unterscheiden, einem Lernstoff eine passende Technik zuordnen und eine visuelle Lernhilfe erstellen.",
     G1, ["WISO.01.11.1", "WISO.01.11.2", "WISO.01.11.3", "WISO.01.11.4"], [])
L.k(1, "Du kannst visuelles, auditives, kommunikatives und motorisches Lernen unterscheiden.", 2,
    [K("WISO.01.11.1"), K("WISO.01.11.2"), K("WISO.01.11.3"), K("WISO.01.11.4")])
L.k(2, "Du kannst Beispiele den Lerntechniken zuordnen: Mindmaps, Schaubilder und Lernkarteien dem visuellen; Vorträge anhören und Aufnahmen abspielen dem auditiven; Diskussionen, Frage-Antwort-Spiele und Lerngruppen dem kommunikativen; „Learning by Doing“ und Rollenspiele dem motorischen Lernen.", 2,
    [K("WISO.01.11.1"), K("WISO.01.11.2"), K("WISO.01.11.3"), K("WISO.01.11.4")])
L.k(3, "Du kannst für einen Lernstoff eine passende Lerntechnik auswählen und begründen.", 4,
    [K("WISO.01.11.1"), R("P-NAECHSTE-STUFE")], alt=("angepasst", "Operator auswählen und begründen; nächste Stufe nach dem Zuordnen (P-NÄCHSTE-STUFE)"))
L.k(4, "Du kannst zu einem Thema eine visuelle Lernhilfe erstellen, zum Beispiel eine Mindmap mit Hauptbegriff, Ästen und Unterbegriffen oder eine Lernkartei mit Frage und Antwort.", 3,
    [K("WISO.01.11.1")])

L.sp("WISO-1-7-2", "Arbeitstechniken: Zeitmanagement, Moderation, Planung, lernförderlicher Arbeitsplatz",
     "Techniken für Zeitmanagement und Moderation kennen und einsetzen, Arbeitstechniken einordnen und einen lernförderlichen Arbeitsplatz gestalten.",
     G1, ["WISO.01.12.1", ("WISO.01.12.2", "Moderationstechniken"), "WISO.01.12.4", "WISO.01.12.5", ("WISO.01.12.6", "Statistiken auswerten")],
     T("2022W-A22", "2022W-A29", "2022W-A30"),
     baut_auf=["AP1-2-3-2", "AP1-2-3-3", "AP1-1-2-1", "AP1-1-1-2", "PB1-1-1-1"],
     hinweis="Fachinformationen beschaffen und auswerten (AP1-2-3-2), Präsentieren (AP1-2-3-3), Projektplanung (AP1-1-2-1) sowie Scrum und agiles Vorgehen (AP1-1-1-2, PB1-1-1-1) kennst du aus AP1 und PB1; 2022W-WISO-A29/A30 (agiles Projektmanagement) beantwortest du mit PB1-1-1-1.")
L.k(1, "Du kannst erklären, wozu Zeitmanagement dient: Aufgaben ordnen und die verfügbare Zeit planen.", 2,
    [K("WISO.01.12.1")])
L.k(2, "Du kannst Zeitmanagement-Techniken anwenden: eine Aufgabenliste nach Prioritäten ordnen, Aufgaben nach wichtig und dringend einteilen (Eisenhower-Prinzip) und Pufferzeiten einplanen.", 3,
    [K("WISO.01.12.1"), K("WISO.01.12.4")], alt=("angepasst", "Operator anwenden; Eisenhower-Prinzip als Beispiel"))
L.k(3, "Du kannst Moderations-, Präsentations- und Planungstechniken als Arbeitstechniken einordnen.", 2,
    [K("WISO.01.12.2"), K("WISO.01.12.4")])
L.k(4, "Du kannst Moderationstechniken beschreiben: Kartenabfrage, Brainstorming, Punktabfrage zur Gewichtung und die Rolle des Moderators, der das Gespräch lenkt, aber keine eigene Meinung vertritt.", 2,
    [K("WISO.01.12.2")], alt=("angepasst", "auf Moderation beschränkt; Präsentationsregeln stehen in AP1-2-3-3 (E2, P36)"))
L.k(6, "Du kannst beschreiben, was einen lernförderlichen Arbeitsplatz ausmacht: Ruhe, Ordnung, gutes Licht, Unterlagen griffbereit, Lernzeiten in den Arbeitsalltag eingeplant.", 2,
    [K("WISO.01.12.5")])
L.k(7, "Du kannst an einer Statistik oder Tabelle unterscheiden, welche Aussagen sich damit belegen lassen und welche nicht: absolute Zahlen und Veränderungen in Prozent getrennt lesen und auf die Bezugsgröße achten (zum Beispiel je 1.000 Beschäftigte).", 2,
    [K("WISO.01.12.6"), B("2022W-A22")], neu=(["AP1-2-3-2"], "Aussagen anhand einer Statistik prüfen: absolute und relative Werte, Bezugsgrößen"), vorgegeben="Statistik im Aufgabentext")

L.sp("WISO-1-7-3", "Digitale Lernmedien: Internet, Apps, Plattformen, CBT, WBT",
     "Digitale Lernmedien unterscheiden, sie für das eigene Lernen nutzen und für einen Lernzweck bewerten.",
     G1, ["WISO.01.12.7", "WISO.01.12.7.1", "WISO.01.12.7.2", "WISO.01.12.7.3", "WISO.01.12.7.4", "WISO.01.12.7.5", "WISO.01.12.7.6", "WISO.01.12.7.7"], [])
L.k(1, "Du kannst digitale Lernmedien unterscheiden: Internet, Apps, Plattformen für Kommunikation, Information, Videos und Austausch sowie Netzwerke.", 2,
    [K("WISO.01.12.7.1"), K("WISO.01.12.7.2"), K("WISO.01.12.7.3"), K("WISO.01.12.7.4")])
L.k(2, "Du kannst Computer Based Training (Lernprogramm auf dem eigenen Rechner, ohne Netzverbindung) und Web Based Training (über das Internet abgerufen, aktualisierbar, oft mit Austausch) unterscheiden.", 2,
    [K("WISO.01.12.7.5"), K("WISO.01.12.7.6")])
L.k(4, "Du kannst ein digitales Lernmedium für deinen Lernzweck bewerten: unabhängig von Zeit und Ort und im eigenen Tempo gegenüber nötiger Selbstdisziplin, fehlendem direktem Austausch und der Qualität der Inhalte.", 4,
    [K("WISO.01.12.7")])
L.k(5, "Du kannst beschreiben, was beim Lernen mit mobilen Endgeräten zu beachten ist: Ablenkung vermeiden, betriebliche Regeln und Datenschutz einhalten.", 2,
    [K("WISO.01.12.7.7")])
L.k(6, "Du kannst ein digitales Lernmedium für ein Lernziel nutzen, zum Beispiel eine Lernplattform oder Lernkarten-App mit Wiederholungen planen.", 3,
    [K("WISO.01.12.7")])

# ---------------------------------------------------------------- 1-8 Weiterbildung und Lebensplanung
L.tb("WISO-1-8", "Weiterbildung und Lebensplanung", "Welche Wege der Fort- und Weiterbildung es gibt, wie sie gefördert werden, wie du Lernen und Arbeiten in Europa nutzt und was bei einer Existenzgründung zu bedenken ist.")

L.sp("WISO-1-8-1", "Lebensbegleitendes Lernen, Fortbildung und Umschulung, staatliche Förderung",
     "Ausbildung, Fortbildung und Umschulung unterscheiden, Arten der Fortbildung zuordnen und Fördermöglichkeiten kennen.",
     G1, ["WISO.01.10.1", "WISO.01.10.2", "WISO.01.10.3", "WISO.01.10.4", "WISO.01.13.1", "WISO.01.13.2", "WISO.01.13.3", "WISO.01.13.4", "WISO.01.13.5", "WISO.01.14.1", "WISO.01.14.6"],
     T("2023S-A4", "2025W-A12", "2022W-A15"))
L.k(1, "Du kannst an einem Beispiel berufliche Fortbildung, Umschulung und andere Bildungsmaßnahmen unterscheiden: Die Umschulung führt in einen anderen anerkannten Beruf (zum Beispiel nach einer Allergie), die Fortbildung baut nach der Ausbildung auf dem Beruf auf.", 2,
    [K("WISO.01.10.2"), B("2023S-A4"), B("2025W-A12")], alt=("angepasst", "unterscheiden (F1); Beispiele aus den Prüfungen"))
L.k(2, "Du kannst Erhaltungsfortbildung (Kenntnisse auffrischen), Anpassungsfortbildung (an neue Entwicklungen anpassen) und Aufstiegsfortbildung (für eine höhere Position qualifizieren) unterscheiden.", 2,
    [K("WISO.01.13.2"), K("WISO.01.13.3"), K("WISO.01.13.4"), B("2025W-A12")])
L.k(3, "Du kannst innerbetriebliche, überbetriebliche und externe Fortbildung unterscheiden und Regelungen zur Weiterbildung in Betrieb und Tarifvertrag nennen, zum Beispiel Freistellung und Kostenübernahme.", 2,
    [K("WISO.01.10.3"), K("WISO.01.13.5"), K("WISO.01.14.6"), K("WISO.01.10.1"), K("WISO.01.14.1")])
L.k(5, "Du kannst Förderungen ihren Stellen zuordnen: Arbeitsagentur (Bildungsgutschein) und Rentenversicherung (Umschulung aus gesundheitlichen Gründen), Aufstiegs-BAföG.", 2,
    [K("WISO.01.10.4"), K("WISO.01.13.1"), B("2022W-A15")])
L.k(6, "Du kannst begründen, warum lebensbegleitendes Lernen in IT-Berufen nötig ist.", 4,
    [K("WISO.01.10.1"), R("P-NAECHSTE-STUFE")], alt=("angepasst", "Herkunft ergänzt; begründen = Stufe 4 über P-NÄCHSTE-STUFE"))

L.sp("WISO-1-8-2", "Persönliche Weiterbildung, Kompetenzentwicklung und Karriereplanung",
     "Wege der persönlichen Weiterbildung und Bereiche der persönlichen Entwicklung kennen und eine eigene Karriereplanung beschreiben.",
     G1, ["WISO.01.14.2", "WISO.01.14.4", "WISO.01.14.4.1", "WISO.01.14.4.2", "WISO.01.14.4.3", "WISO.01.14.5", "WISO.01.14.5.1", "WISO.01.14.5.2", "WISO.01.14.5.3", "WISO.01.14.5.4", "WISO.01.14.5.5", "WISO.01.14.5.6", "WISO.01.14.5.7", "WISO.01.14.10", "WISO.01.14.11"], [])
L.k(1, "Du kannst Wege der persönlichen Weiterbildung unterscheiden: Fachliteratur, Selbstlernmaterialien, Fachmessen, Bildungseinrichtungen wie Volkshochschule, Kammer oder Hochschule.", 2,
    [K("WISO.01.14.2"), K("WISO.01.14.4"), K("WISO.01.14.4.1"), K("WISO.01.14.4.2"), K("WISO.01.14.4.3")])
L.k(2, "Du kannst Bereiche der persönlichen Entwicklung erklären: Eigenständigkeit, Verantwortung, Reflexivität, Lernkompetenz, Team- und Führungsfähigkeit, Mitgestaltung und Kommunikation.", 2,
    [K("WISO.01.14.5"), K("WISO.01.14.5.1"), K("WISO.01.14.5.2"), K("WISO.01.14.5.3"), K("WISO.01.14.5.4"), K("WISO.01.14.5.5"), K("WISO.01.14.5.6"), K("WISO.01.14.5.7")])
L.k(3, "Du kannst erklären, was eine Potenzialanalyse ist: Stärken, Schwächen und Entwicklungsmöglichkeiten einer Person werden ermittelt.", 2,
    [K("WISO.01.14.10")])
L.k(4, "Du kannst erklären, was Karriereplanung bedeutet: berufliche Ziele festlegen und die Schritte dahin planen, zum Beispiel über Aufstiegsfortbildung oder Studium.", 2,
    [K("WISO.01.14.11")])

L.sp("WISO-1-8-3", "Lernen und Arbeiten in Europa: Europass, Mobilitätsprogramme, Auslandsaufenthalte, Europäische Sozialcharta",
     "Zweck des Europasses und der Mobilitätsprogramme kennen und die Europäische Sozialcharta einordnen.",
     G1, ["WISO.01.14.3", "WISO.01.14.7", "WISO.01.14.8", "WISO.01.14.9"],
     T("2021W-A24", "2022S-A16"))
L.k(1, "Du kannst den Zweck des Europasses erklären: Qualifikationen und Kompetenzen europaweit einheitlich und verständlich darstellen, zum Beispiel bei Bewerbungen; er ist kein Reisedokument, kostenlos und keine Pflicht für Auslandsaufenthalte.", 2,
    [K("WISO.01.14.7"), B("2021W-A24"), B("2022S-A16")])
L.k(2, "Du kannst erklären, dass Teile der Ausbildung im Ausland stattfinden können und EU-Förderprogramme solche Aufenthalte unterstützen.", 2,
    [K("WISO.01.14.3")])
L.k(3, "Du kannst Erasmus+ als Mobilitätsprogramm der EU einordnen, das Auslandsaufenthalte in Ausbildung, Studium und Weiterbildung fördert.", 2,
    [K("WISO.01.14.8")])
L.k(4, "Du kannst die Europäische Sozialcharta einordnen: ein Abkommen des Europarats, das soziale Grundrechte wie gerechte Arbeitsbedingungen und berufliche Bildung festhält.", 2,
    [K("WISO.01.14.9")])

L.sp("WISO-1-8-4", "Existenzgründung: Möglichkeiten und Grenzen",
     "Chancen und Risiken einer Existenzgründung abwägen, Standortfaktoren kennen und Zweck und Inhalt eines Businessplans erklären.",
     G1, ["WISO.01.14.12"],
     T("2022W-A23", "2023S-A14", "2023W-A22", "2024S-A19"),
     hinweis="Die Rechtsform der Gründung steht in WISO-2-2.")
L.k(1, "Du kannst Chancen und Risiken einer Existenzgründung abwägen: eigene Entscheidungen und höhere Verdienstmöglichkeiten gegenüber unsicherem Einkommen, Haftung und eigener sozialer Absicherung (keine automatische Pflichtversicherung).", 4,
    [K("WISO.01.14.12"), R("P-NAECHSTE-STUFE")], alt=("angepasst", "mit K2 zusammengefasst, abwägen (Katalog „Möglichkeiten und Grenzen“)"))
L.a("WISO-1-8-4-K2", "verschoben", "WISO-1-8-4-K1", "mit K1 zusammengefasst (Chancen und Risiken)")
L.k(3, "Du kannst erklären, was ein Businessplan enthält und wozu er dient: Geschäftsidee, Markt- und Wettbewerbsanalyse, strategische Ziele und Finanzkonzept, um die Gründung zu planen und Kapitalgeber wie Banken zu überzeugen; er wird nicht von der Kammer ausgestellt und nirgends eingetragen.", 2,
    [K("WISO.01.14.12"), B("2023W-A22"), B("2024S-A19")])
L.a("WISO-1-8-4-K4", "verschoben", "WISO-1-8-4-K3", "mit K3 zusammengefasst (Inhalt und Zweck des Businessplans)")
L.k(5, "Du kannst Erfolgsfaktoren einer Gründung erklären: Kenntnis von Markt, Kunden und Wettbewerb, ausreichende Fachkenntnisse und Finanzierung.", 2,
    [K("WISO.01.14.12"), B("2022W-A23")])
L.k(6, "Du kannst Standortfaktoren für eine Gründung unterscheiden: Konkurrenz, Kundennähe und Verkehrsanbindung, Miete, behördliche Auflagen – nicht aber Steuersätze, die bundesweit gleich sind wie die Umsatzsteuer.", 2,
    [K("WISO.01.14.12"), B("2023S-A14")])

# ---------------------------------------------------------------- alt → neu (übrige)
A = L.a
A("WISO-1-1-4-K3", "verschoben", "WISO-1-2-3-K2", "Eignung der Ausbilder steht im neuen Stichpunkt Zuständige Stelle und Ausbilder")
A("WISO-1-2-1-K4", "verschoben", "WISO-1-2-3-K1", "Aufgaben der Kammer stehen im neuen Stichpunkt Zuständige Stelle und Ausbilder")
A("WISO-1-3-2-K3", "gestrichen", None, "Ein abgedrucktes Gesetz anwenden steckt in den Fach-Aussagen mit vorgegebenem Auszug (WISO-1-3-3-K1, WISO-1-3-4-K6/K7, WISO-1-4-1-K6, B4); als eigene Aussage doppelt (P31)")
A("WISO-1-3-3-K3", "verschoben", "WISO-1-3-6-K3", "Befristung steht im neuen Stichpunkt Arbeitsverhältnis")
A("WISO-1-6-2-K2", "verschoben", "WISO-3-1-3-K1", "Gesetzliche Unfallversicherung gesammelt in WISO-3-1-3 (stand doppelt in WISO-1-6-2 und WISO-3-4-2)")
A("WISO-1-6-3-K2", "gestrichen", None, "P32: „auf Cent genau angeben“ ist Prüfungstechnik, keine Können-Aussage")
A("WISO-1-7-2-K5", "gestrichen", None, "E2/P36/P47: Fachinformationen beschaffen, auswählen und auswerten steht in AP1-2-3-2 (WISO.01.12.6 gedeckt); neu ist nur das Prüfen von Aussagen an einer Statistik (WISO-1-7-2-K7)")
A("WISO-1-7-3-K3", "verschoben", "WISO-1-7-3-K2", "Erklärung von CBT und WBT in K2 aufgenommen (doppelt)")
A("WISO-1-8-1-K4", "verschoben", "WISO-1-8-1-K1", "Abgrenzung Ausbildung, Fortbildung, Umschulung in K1 aufgenommen")

# ---------------------------------------------------------------- Rahmen
RS = L.rahmen_satz
RS("WISO-1-2-1", "In den ausgewerteten Prüfungen gab es dazu keine eigene Aufgabe; die Regeln zu Berufsschule und Freistellung stecken in den Fragen zum Berufsbildungsgesetz.", "gestrichen", "E6: fehlende Belege sind keine Grenze; die Katalogpunkte bleiben mit Katalogtiefe")
RS("WISO-1-3-2", "Einzelne Paragrafen musst du nicht kennen; Gesetzestexte, auf die es ankam, waren abgedruckt.", "übernommen", "B4: vorgegebene Gesetzesauszüge sind „anwenden, nicht auswendig“; als Feld vorgegeben an den Aussagen")
RS("WISO-1-3-5", "Zu Elternzeit und Schwerbehindertenrecht gab es in den ausgewerteten Prüfungen keine Aufgabe.", "gestrichen", "Überholt: 2021W-WISO-A18 und mehrere Fragen zum besonderen Kündigungsschutz belegen beides")
RS("WISO-1-7-1", "In den ausgewerteten Prüfungen gab es dazu keine Aufgabe.", "gestrichen", "E6")
RS("WISO-2-2-3", "Gewinnverteilungen anderer Rechtsformen kamen nicht vor.", "gestrichen", "E6; die gesetzliche Gewinnverteilung der Personengesellschaften ist keine Pflicht-Aussage, weil der Katalog nur Rechtsformen nennt (siehe WISO-2-2)")

# ---------------------------------------------------------------- R4
L.gesch("WISO.01.05", "Individual- und Kollektivarbeitsrecht", {"Individualarbeitsrecht": ["WISO-1-3-1-K1", "WISO-1-3-1-K2"], "Kollektivarbeitsrecht": ["WISO-1-3-1-K1"]})
L.gesch("WISO.01.01", "Rechte und Pflichten des Auszubildenden und des Ausbildenden", {"Auszubildender": ["WISO-1-1-4-K2"], "Ausbildender": ["WISO-1-1-4-K1"]})
L.gesch("WISO.01.09.1", "Brutto/Netto", {"Brutto": ["WISO-1-6-1-K7"], "Netto": ["WISO-1-6-1-K1", "WISO-1-6-3-K5"]})
L.gesch("WISO.01.09.2", "Lohnsteuer, Kirchensteuer", {"Lohnsteuer": ["WISO-1-6-1-K2"], "Kirchensteuer": ["WISO-1-6-1-K3"]})
L.gesch("WISO.01.10.1", "interne und externe Weiterbildung", {"intern": ["WISO-1-8-1-K3"], "extern": ["WISO-1-8-1-K3"]})
L.gesch("WISO.01.12.7.5", "CBT/WBT", {"CBT": ["WISO-1-7-3-K2"], "WBT": ["WISO-1-7-3-K2"]})
L.gesch("WISO.01.06", "Arbeitgeber- und Arbeitnehmerorganisationen", {"Arbeitgeber": ["WISO-1-5-3-K2"], "Arbeitnehmer": ["WISO-1-5-3-K1"]})
L.gesch("WISO.01.08.4", "Streik und Aussperrung", {"Streik": ["WISO-1-5-2-K1"], "Aussperrung": ["WISO-1-5-2-K1"]})

L.write(meta(kerntest="Alle 125 WiSo-Teilaufgaben dieses Ordners gegen die Musterlösungen gelesen; je Aufgabe geprüft, dass eine Aussage die richtige Antwort trägt und die falschen Antwortmöglichkeiten ausschließt. Lücken geschlossen: Arbeitsvertrag (neuer Stichpunkt WISO-1-3-6), Sozialauswahl, Fragerecht im Einstellungsgespräch, Statistik lesen, Standortfaktoren."))
