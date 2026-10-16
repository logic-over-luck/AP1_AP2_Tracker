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
     hinweis="Dass Allgemeine Geschäftsbedingungen im BGB geregelt sind (2025S-WISO-A16 b), steht in PB1-2-1-1. Was Arbeitsschutzgesetz und Arbeitsstättenverordnung im Einzelnen regeln und wer den Arbeitsschutz überwacht, steht in WISO-3-1-1; die Zahlen zu Urlaub, Arbeitszeit, Mutterschutz und Schwerbehinderung in WISO-1-3-4 bis WISO-1-3-6. Heutige Fundstellen der Katalognamen: Das Schwerbehindertenrecht steht im Neunten Buch Sozialgesetzbuch (SGB IX), mit „Bundeselterngesetz“ ist das Bundeselterngeld- und Elternzeitgesetz gemeint; die Prüfungen verwenden noch die alten Namen (2021W-WISO-A18).")
L.k(1, "Du kannst einem Sachverhalt die Rechtsquelle zuordnen, die ihn regelt, zum Beispiel Betriebsversammlung, Jugend- und Auszubildendenvertretung und die vertrauensvolle Zusammenarbeit mit dem Betriebsrat dem Betriebsverfassungsgesetz, den Urlaub Jugendlicher dem Jugendarbeitsschutzgesetz.", 2,
    [K("WISO.01.05.2"), K("WISO.01.05.2.9"), K("WISO.02.09.1"), B("2025S-A16"), B("2025W-A13"), B("2023S-A10"), B("2025S-A11"), B("2025W-A8")])
L.k(2, "Du kannst einer Frage zuordnen, ob sie das Berufsbildungsgesetz (Ausbildung), das Betriebsverfassungsgesetz (Mitbestimmung im Betrieb) oder eine Arbeitsschutzvorschrift wie Arbeitsschutzgesetz oder Arbeitsstättenverordnung regelt.", 2,
    [K("WISO.01.05.2.1"), K("WISO.01.05.2.2"), K("WISO.01.05.2.7"), K("WISO.01.05.2.9")], alt=("angepasst", "Prüfer WISO-1 Nr. a6 (D6): nur Berufsbildungs- und Betriebsverfassungsgesetz; Arbeitsschutzvorschriften nur zur Abgrenzung (Wohnort WISO-3-1-1)"))
L.a("WISO-1-3-2-K4", "gestrichen", None, "Prüfer WISO-1 Nr. a17: Fundstellen der Katalognamen (SGB IX, BEEG) sind eine Lesehilfe, keine prüfbare Aussage; steht jetzt im Hinweis von WISO-1-3-2")
L.k(5, "Du kannst weiteren Arbeitsgesetzen ihr Thema zuordnen: Bundesurlaubsgesetz – Mindesturlaub; Entgeltfortzahlungsgesetz – Lohn bei Krankheit und an Feiertagen; Elternzeitgesetz – Freistellung bis zu drei Jahren mit Kündigungsschutz; Arbeitszeitgesetz – tägliche Höchstarbeitszeit; Schwerbehindertenrecht – Zusatzurlaub und besonderer Kündigungsschutz.", 2,
    [K("WISO.01.05.1"), B("2021W-A18")])

L.sp("WISO-1-3-3", "Kündigung, Kündigungsfristen und Kündigungsschutz",
     "Kündigungsarten und -gründe unterscheiden, mit dem abgedruckten Gesetz das Ende eines Arbeitsverhältnisses bestimmen und den Kündigungsschutz in einem Fall anwenden.",
     G1, [("WISO.01.05.1", "Kündigungsfristen, fristlose Kündigung"), "WISO.01.05.2.5", ("WISO.01.05.2.13", "Kündigungsschutz Schwangerer"), ("WISO.01.05.2.14", "Kündigungsschutz Schwerbehinderter"), "ZB.wiso-gerichtsbarkeit"],
     T("2023S-A18", "2023W-A27", "2025S-A18", "2025W-A15", "2021W-A3", "2022W-A10", "2023W-A14", "2023W-A13", "2023W-A17", "2024S-A23", "2025S-A20", "2025W-A17", "2023S-A19", "2023S-A20"),
     hinweis="Dass der Betriebsrat vor jeder Kündigung anzuhören ist (sonst ist sie unwirksam), steht in WISO-1-4-1.")
L.k(1, "Du kannst mit einem abgedruckten Auszug aus § 622 BGB das Ende eines Arbeitsverhältnisses bestimmen: Grundfrist vier Wochen zum 15. oder zum Ende eines Kalendermonats; kündigt der Arbeitgeber, verlängert sich die Frist mit der Dauer der Betriebszugehörigkeit (zum Monatsende), für den Arbeitnehmer bleibt es bei der Grundfrist.", 3,
    [K("WISO.01.05.1"), B("2023S-A18"), B("2023W-A27"), B("2025S-A18"), B("2025W-A15")], vorgegeben="§ 622 BGB (Auszug) im Aufgabentext")
L.k(2, "Du kannst Personengruppen mit besonderem Kündigungsschutz nennen und von anderen unterscheiden: Schwangere und Mütter bis vier Monate nach der Entbindung, schwerbehinderte Menschen (Zustimmung des Integrationsamts), Betriebsratsmitglieder, Auszubildende nach der Probezeit, Beschäftigte in Elternzeit – nicht aber leitende Angestellte oder Ältere allein wegen ihres Alters.", 2,
    [K("WISO.01.05.2.5"), K("WISO.01.05.2.13"), K("WISO.01.05.2.14"), B("2023W-A17"), B("2024S-A23")])
L.k(4, "Du kannst ordentliche Kündigung (mit Frist) und außerordentliche Kündigung (fristlos aus wichtigem Grund, zum Beispiel Diebstahl) unterscheiden und daran erkennen, dass Arbeitsmangel, unverschuldete Krankheit oder ein einmaliges leichteres Fehlverhalten wie ein Tag unentschuldigtes Fehlen keine fristlose Kündigung rechtfertigen (bei leichterem Fehlverhalten ist in der Regel zuerst eine Abmahnung nötig).", 2,
    [K("WISO.01.05.1"), B("2023W-A13")], alt=("angepasst", "Prüfer WISO-1 Nr. a11: Distraktor eintägiges unentschuldigtes Fehlen (2023W-A13)"))
L.k(5, "Du kannst Kündigungsgründe nach dem Kündigungsschutzgesetz zuordnen: personenbedingt (zum Beispiel lange Krankheit, fehlende Eignung), verhaltensbedingt (zum Beispiel wiederholte Verstöße trotz Abmahnung) und betriebsbedingt (zum Beispiel Schließung einer Abteilung, Auftragsmangel).", 2,
    [K("WISO.01.05.2.5"), B("2021W-A3"), B("2022W-A10"), B("2023W-A14")])
L.k(6, "Du kannst erklären, wie sich ein Arbeitnehmer gegen eine Kündigung wehrt: Er kann innerhalb von drei Wochen nach Zugang der Kündigung Kündigungsschutzklage beim Arbeitsgericht erheben; ein Widerspruch des Betriebsrats verhindert die Kündigung nicht. Das Arbeitsgericht ist auch für Streit um das Arbeitszeugnis zuständig.", 2,
    [K("WISO.01.05.2.5"), K("ZB.wiso-gerichtsbarkeit"), B("2023S-A19"), B("2023S-A20")], alt=("angepasst", "Prüfer WISO-1 Nr. a3, a21 (D6): klagen kann der Arbeitnehmer, nicht der Betriebsrat; Widerspruch hindert nicht; Anhörung wohnt in WISO-1-4-1-K4"))
L.k(7, "Du kannst bei einer betriebsbedingten Kündigung unterscheiden, wem am ehesten ordentlich gekündigt werden kann: dem Beschäftigten ohne besonderen Kündigungsschutz, der nach Betriebszugehörigkeit, Alter, Unterhaltspflichten und Schwerbehinderung am wenigsten schutzwürdig ist (Sozialauswahl).", 2,
    [K("WISO.01.05.2.5"), B("2025S-A20"), B("2025W-A17")])

L.sp("WISO-1-3-4", "Arbeitszeit und Jugendarbeitsschutz",
     "Die Regeln des Arbeitszeitgesetzes und des Jugendarbeitsschutzgesetzes kennen und mit einem abgedruckten Gesetzesauszug auf Dienstplan und Urlaub anwenden.",
     G1, ["WISO.01.05.2.6", "WISO.01.05.2.8", ("WISO.01.08.1", "günstigere Tarifregel beim Urlaub")],
     T("2022S-A3", "2022S-A4", "2022S-A5", "2023S-A2", "2023W-A11", "2025S-A14", "2025W-A11", "2025W-A13"),
     hinweis="Stand Oktober 2026 gilt die tägliche Höchstarbeitszeit (Achtstundentag). Eine Reform des Arbeitszeitgesetzes mit wöchentlicher statt täglicher Höchstarbeitszeit ist politisch geplant – vor der Prüfung den Stand prüfen.")
L.k(1, "Du kannst die Ruhepausen nach dem Arbeitszeitgesetz nennen: mindestens 30 Minuten bei mehr als sechs Stunden und 45 Minuten bei mehr als neun Stunden Arbeit.", 1,
    [K("WISO.01.05.2.8")])
L.k(2, "Du kannst die Schutzregeln des Jugendarbeitsschutzgesetzes erklären und von falschen Angaben unterscheiden: höchstens acht Stunden täglich und 40 Stunden wöchentlich an fünf Tagen, mindestens zwölf Stunden Freizeit zwischen zwei Arbeitstagen, ärztliche Erstuntersuchung vor Beginn der Beschäftigung und erste Nachuntersuchung nach einem Jahr, an Feiertagen grundsätzlich keine Beschäftigung (mit gesetzlichen Ausnahmen); Zweck ist der Schutz von Gesundheit und Entwicklung.", 2,
    [K("WISO.01.05.2.6"), B("2022S-A4"), B("2023S-A2"), B("2025S-A14"), B("2025W-A11")], alt=("angepasst", "Prüfer WISO-1 Nr. a34: Distraktoren aus 2022S-A4 (Nachuntersuchung, Feiertage)"))
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
L.k(2, "Du kannst Regeln des Mutterschutzgesetzes von falschen Angaben unterscheiden: Kündigungsverbot während der Schwangerschaft bis vier Monate nach der Entbindung, Freistellung für Vorsorgeuntersuchungen ohne Lohnausfall, Schutzfristen vor und nach der Geburt; bei einem Beschäftigungsverbot erhält sie ihren bisherigen Durchschnittsverdienst weiter, Mutterschaftsgeld gibt es nur während der Schutzfristen.", 2,
    [K("WISO.01.05.2.13"), B("2021W-A5"), B("2022W-A9")], alt=("angepasst", "Prüfer WISO-1 Nr. a12: Distraktoren Mutterschutzlohn (2021W-A5) und Mutterschaftsgeld (2022W-A9)"))
L.k(3, "Du kannst die Merkmale, wegen derer nach dem Allgemeinen Gleichbehandlungsgesetz niemand benachteiligt werden darf, von anderen unterscheiden: ethnische Herkunft, Geschlecht, Religion oder Weltanschauung, Behinderung, Alter und sexuelle Identität – nicht aber zum Beispiel die Art des Abschlusses.", 2,
    [K("WISO.01.05.2.4"), B("2024S-A27")], alt=("angepasst", "Prüfer WISO-1 Nr. a1 (D1): Auswahl-Beleg 2024S-A27, daher unterscheiden (Stufe 2)"))
L.k(4, "Du kannst an einer Stellenanzeige, einer Personalauswahl oder einer Entscheidung im Betrieb unterscheiden, ob sie gegen das Gleichbehandlungsgesetz verstößt, zum Beispiel „junge Mitarbeiter“, nur männliche Berufsbezeichnung statt geschlechtsneutral (etwa „m/w/d“) oder „deutscher Herkunft“ gegenüber einer Auswahl allein nach Qualifikation; das Gesetz gilt auch für Auszubildende, für Bewerbung, Arbeitsbedingungen und beruflichen Aufstieg, und Benachteiligte haben Anspruch auf Entschädigung oder Schadensersatz.", 2,
    [K("WISO.01.05.2.4"), B("2021W-A22"), B("2022W-A28"), B("2023S-A29"), B("2025S-A24"), B("2025S-A25"), B("2025W-A21")], alt=("angepasst", "Prüfer WISO-1 Nr. a12: Distraktoren aus 2023S-A29 (Geltungsbereich, Schadensersatz)"))
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
     hinweis="Neuer Stichpunkt: Fragen zum Arbeitsvertrag kamen in fast jeder Prüfung vor und standen vorher nur verstreut in WISO-1-3-1 und WISO-1-3-3. Das Ausbildungszeugnis nach dem Berufsbildungsgesetz steht in WISO-1-1-3; für das Arbeitszeugnis (Gewerbeordnung) gilt die Unterscheidung einfach/qualifiziert ebenso.")
L.k(1, "Du kannst die Schritte einer Einstellung ordnen (Bewerbung, Vorstellungsgespräch, Arbeitsvertrag, erster Arbeitstag, erste Vergütung, Ende der Probezeit) und erklären, welche Unterlagen der neue Arbeitgeber verlangen kann, zum Beispiel steuerliche Identifikationsnummer und Urlaubsbescheinigung des letzten Arbeitgebers.", 2,
    [K("WISO.01.05.1"), B("2023W-A1"), B("2023W-A3")])
L.k(2, "Du kannst die Probezeit im Arbeitsverhältnis von der in der Ausbildung unterscheiden: Sie ist nicht vorgeschrieben und dauert höchstens sechs Monate; in dieser Zeit gilt eine Kündigungsfrist von zwei Wochen.", 2,
    [K("WISO.01.05.1"), B("2022S-A2")])
L.k(3, "Du kannst die Regeln zur Befristung erklären: Ein befristeter Arbeitsvertrag muss schriftlich vereinbart werden und endet mit Ablauf der Zeit, ohne dass gekündigt werden muss; ohne sachlichen Grund ist eine Befristung bis zu zwei Jahren möglich.", 2,
    [K("WISO.01.05.1"), B("2022W-A4"), B("2024S-A4")])
L.k(4, "Du kannst Arbeitnehmerüberlassung (Zeitarbeit) erklären: Der Verleiher stellt den Zeitarbeitnehmer ein und bezahlt ihn, der Entleiher setzt ihn in seinem Betrieb ein.", 2,
    [K("WISO.01.05.1"), B("2022W-A6")])
L.k(5, "Du kannst Regeln des Bundesurlaubsgesetzes von falschen Angaben unterscheiden: mindestens 24 Werktage im Jahr, der volle Anspruch entsteht erst nach sechs Monaten (Wartezeit), Krankheitstage im Urlaub werden mit ärztlichem Attest nicht angerechnet; Urlaub ist im laufenden Jahr zu nehmen und nur aus dringenden Gründen in die ersten drei Monate des Folgejahres übertragbar (verfallen kann er nur, wenn der Arbeitgeber rechtzeitig auf den Verfall hingewiesen hat).", 2,
    [K("WISO.01.05.1"), B("2022W-A8")], alt=("angepasst", "Prüfer WISO-1 Nr. a32: Übertragung und Verfall nach § 7 BUrlG und Rechtsprechung"))
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
L.k(3, "Du kannst unterscheiden, in welchen Angelegenheiten der Betriebsrat mitbestimmt – zum Beispiel Beginn und Ende der täglichen Arbeitszeit, Mehrarbeit, Urlaubsplan und Betriebsferien, Einführung technischer Überwachung wie Kameras – und in welchen nicht: unternehmerische Entscheidungen wie Personalplanung, Bau- und Umbauvorhaben, Umweltschutz, Gründung einer Filiale, Wechsel der Rechtsform oder die Einstellung leitender Angestellter; dort wird er höchstens unterrichtet oder beraten. Rechtsgeschäfte für das Unternehmen schließt er nicht ab.", 2,
    [K("WISO.01.07.2.2"), B("2021W-A16"), B("2022S-A10"), B("2022W-A13"), B("2023S-A12"), B("2023W-A10")], alt=("angepasst", "Prüfer WISO-1 Nr. a1 (D1), a10: fünf Auswahl-Belege, daher unterscheiden (Stufe 2); Distraktoren Filiale, Rechtsform, leitende Angestellte, Rechtsgeschäfte"))
L.k(4, "Du kannst Mitbestimmung (ohne Zustimmung des Betriebsrats geht es nicht) von Mitwirkung (Information, Anhörung, Beratung) am Beispiel der Kündigung unterscheiden: Der Betriebsrat muss vor jeder Kündigung angehört werden, sonst ist sie unwirksam, und eine nachträgliche Anhörung heilt das nicht; seine Zustimmung braucht der Arbeitgeber aber nicht.", 2,
    [K("WISO.01.07.2.2"), K("WISO.01.05.2.9"), B("2022S-A7")], alt=("angepasst", "D6: Wohnort der Anhörung vor der Kündigung; Prüfer WISO-1 Nr. a21; Distraktoren aus 2022S-A7"))
L.k(5, "Du kannst Rahmenregeln des Betriebsrats von falschen Angaben unterscheiden: Gewählt werden kann er in Betrieben mit in der Regel mindestens fünf ständigen wahlberechtigten Arbeitnehmern, von denen drei wählbar sind – eine Pflicht zur Wahl gibt es nicht, auch nicht in großen Kapitalgesellschaften; er wird alle vier Jahre neu gewählt; das Geschlecht in der Minderheit muss mindestens entsprechend seinem Anteil vertreten sein (keine Hälfte-Hälfte-Pflicht); im öffentlichen Dienst tritt der Personalrat an seine Stelle.", 2,
    [K("WISO.01.07.2.1"), K("WISO.02.09.4"), B("2023W-A9"), B("2022S-A10")], alt=("angepasst", "Prüfer WISO-1 Nr. a1 (D1), a10, a30: Auswahl-Beleg 2023W-A9, daher Stufe 2; keine Wahlpflicht, Geschlecht in der Minderheit, „drei wählbar“ (§ 1 BetrVG)"))
L.k(6, "Du kannst mit einem abgedruckten Auszug aus §§ 7 und 9 des Betriebsverfassungsgesetzes die Zahl der Wahlberechtigten und die Größe des Betriebsrats ermitteln; Auszubildende und befristet Beschäftigte zählen dabei mit.", 3,
    [K("WISO.01.07.2.1"), B("2022W-A12"), B("2023W-A7")], vorgegeben="§§ 7 und 9 BetrVG (Auszug) im Aufgabentext", alt=("angepasst", "Prüfer WISO-1 Nr. a25: Wahlalter und Leiharbeit stehen in K2 bzw. im abgedruckten § 7 (B4)"))

L.sp("WISO-1-4-2", "Zusammenarbeit von Arbeitgeber und Betriebsrat: Betriebsvereinbarung, Betriebsversammlung, Einigungsstelle",
     "Den Grundsatz der vertrauensvollen Zusammenarbeit erklären, Inhalte einer Betriebsvereinbarung bestimmen und Betriebsversammlung und Einigungsstelle einordnen.",
     G12, ["WISO.01.05.2.10", "WISO.01.07.2.3", "WISO.01.07.2.4", "WISO.02.09.1", ("WISO.02.09.4", "Betriebsvereinbarungen")],
     T("2021W-A4", "2024S-A5", "2023S-A11", "2025S-A15", "2023S-A10"),
     hinweis="Der frühere Stichpunkt WISO-2-5-4 (vertrauensvolle Zusammenarbeit) ist hier aufgegangen; er wiederholte die Mitbestimmung aus diesem Themenblock. Tarifvorrang (§ 77 Abs. 3 BetrVG) und IHK-Lösung: 2022S-WISO-A13 wertete „Ein Tarifvertrag schließt günstigere Betriebsvereinbarungen nicht aus“ als richtig. Fachlich gilt das nur, wenn der Tarifvertrag es zulässt (Öffnungsklausel) oder für Themen, die er nicht regelt und die auch nicht tarifüblich sind; in dieser Aufgabe war die Aussage anzukreuzen. Das Günstigkeitsprinzip für den Arbeitsvertrag steht in WISO-1-3-1.")
L.k(1, "Du kannst unterscheiden, welche Sachverhalte eine Betriebsvereinbarung regeln kann – zum Beispiel Pausenregelung, Urlaubsplan, Gleitzeit, Beurteilungsverfahren – und welche nicht: Arbeitsentgelte und andere Arbeitsbedingungen, die üblicherweise der Tarifvertrag regelt, etwa Entgelte nach Gehaltsgruppen (außer der Tarifvertrag lässt es ausdrücklich zu), weniger Urlaub als im Tarifvertrag oder eine Arbeitszeit über dem Gesetz.", 2,
    [K("WISO.01.05.2.10"), B("2024S-A5")], alt=("angepasst", "an den Prüfungsfällen ausgerichtet; Prüfer WISO-1 Nr. a7 (D3): Tarifvorrang aus K3 aufgenommen"))
L.a("WISO-1-4-2-K3", "verschoben", "WISO-1-4-2-K1", "Prüfer WISO-1 Nr. a7, a8 (D3): Tarifvorrang ist die Begründung zu K1, dort aufgenommen; IHK-Lösung 2022S-A13 im Hinweis")
L.k(2, "Du kannst erklären, wie eine Betriebsvereinbarung zustande kommt und wirkt: ein Vertrag zwischen Arbeitgeber und Betriebsrat, der verbindliche Regeln für die genannten Arbeitnehmer des Betriebs schafft.", 2,
    [K("WISO.01.05.2.10"), K("WISO.02.09.4"), B("2021W-A4")])
L.k(4, "Du kannst die Betriebsversammlung erklären: die Versammlung aller Arbeitnehmer des Betriebs, einmal im Kalendervierteljahr, auf der der Betriebsrat berichtet; die Teilnahme gilt als Arbeitszeit und wird bezahlt.", 2,
    [K("WISO.01.07.2.3"), B("2023S-A11"), B("2025S-A15"), B("2023S-A10")])
L.k(5, "Du kannst erklären, wozu die Einigungsstelle dient: Sie entscheidet, wenn sich Arbeitgeber und Betriebsrat in einer mitbestimmungspflichtigen Frage nicht einigen; einen Arbeitskampf dürfen beide nicht gegeneinander führen.", 2,
    [K("WISO.01.07.2.4"), K("WISO.02.09.1")])
L.k(6, "Du kannst den Grundsatz der vertrauensvollen Zusammenarbeit aus dem Betriebsverfassungsgesetz erklären: Arbeitgeber und Betriebsrat arbeiten unter Beachtung der Tarifverträge zum Wohl der Arbeitnehmer und des Betriebs zusammen.", 2,
    [K("WISO.02.09.1")])

L.sp("WISO-1-4-3", "Jugend- und Auszubildendenvertretung",
     "Erklären, wen die JAV vertritt, wer sie wählt, welche Aufgaben sie hat und wie sie mit dem Betriebsrat zusammenarbeitet.",
     G12, ["WISO.01.07.2.5", ("WISO.02.09.3", "Rechte der JAV")],
     T("2022S-A11", "2022W-A14", "2025S-A12", "2025W-A9"),
     hinweis="Dass die JAV im Betriebsverfassungsgesetz geregelt ist (2025S-WISO-A11, 2025W-WISO-A8), steht in WISO-1-3-2. Rechtsstand: Seit dem Betriebsrätemodernisierungsgesetz (18.6.2021) gilt für Auszubildende keine Altersgrenze mehr, weder beim Wählen noch bei der Wählbarkeit. Ältere Prüfungsaufgaben gehen noch von „Auszubildende unter 25“ aus: 2022W-WISO-A14 wertete „Auszubildende bis zu einem Alter von 27 Jahren dürfen die JAV wählen“ als falsch (richtig war dort „Nur in einem Betrieb mit Betriebsrat …“); „Als Auszubildende/-r unter 25 sind Sie wahlberechtigt und auch wählbar“ (2022S-WISO-A11) ist nach beiden Fassungen richtig.")
L.a("WISO-1-4-3-K1", "verschoben", "WISO-1-3-2-K1", "Prüfer WISO-1 Nr. a4 (D6): JAV → Betriebsverfassungsgesetz steht in WISO-1-3-2-K1 (gleiche Belege)")
L.k(2, "Du kannst die Aufgaben der JAV erklären: beim Betriebsrat Maßnahmen beantragen, die Jugendlichen und Auszubildenden dienen, und darüber wachen, dass die Schutzvorschriften eingehalten werden.", 2,
    [K("WISO.01.07.2.5"), K("WISO.02.09.3"), B("2025S-A12"), B("2025W-A9")])
L.k(3, "Du kannst Voraussetzungen, Wahlrecht und Wählbarkeit der JAV erklären: Gewählt wird sie, wenn im Betrieb in der Regel mindestens fünf Arbeitnehmer unter 18 Jahren oder Auszubildende beschäftigt sind; wählen dürfen diese Arbeitnehmer unter 18 und die Auszubildenden, wählbar sind Arbeitnehmer, die das 25. Lebensjahr noch nicht vollendet haben, und Auszubildende; die Amtszeit beträgt zwei Jahre.", 2,
    [K("WISO.01.07.2.5"), B("2022S-A11"), B("2022W-A14")], alt=("angepasst", "Prüfer WISO-1 Nr. a13, a18: Mindestzahl fünf, Wählbarkeit „unter 25“ (D12) nach §§ 60, 61 BetrVG in der Fassung von 2021 (Auszubildende ohne Altersgrenze), Amtszeit aus K5"))
L.k(4, "Du kannst erklären, wie die JAV mit Betriebsrat und Arbeitgeber zusammenarbeitet: Sie gibt es nur in Betrieben mit Betriebsrat, sie bringt ihre Anliegen über den Betriebsrat ein und kann an dessen Sitzungen teilnehmen; selbstständig gegenüber der Geschäftsleitung handelt sie nicht. Ihre Mitglieder werden nach der Ausbildung nicht automatisch übernommen, können die Übernahme aber verlangen.", 2,
    [K("WISO.01.07.2.5"), K("WISO.02.09.3"), B("2022W-A14"), B("2025S-A12"), B("2025W-A9")], alt=("angepasst", "Prüfer WISO-1 Nr. a9: Distraktor „automatisch übernommen“ (2022W-A14), § 78a BetrVG"))
L.a("WISO-1-4-3-K5", "verschoben", "WISO-1-4-3-K3", "Prüfer WISO-1 Nr. a18: Ein-Fakt-Aussage (Amtszeit) in K3 aufgenommen")

# ---------------------------------------------------------------- 1-5 Tarifrecht und Verbände
L.tb("WISO-1-5", "Tarifrecht und Verbände", "Wer Tarifverträge schließt, was sie regeln und für wen sie gelten, wie eine Tarifrunde mit Schlichtung und Arbeitskampf abläuft und welche Verbände die Beteiligten vertreten.")

L.sp("WISO-1-5-1", "Tarifvertrag: Arten, Tarifautonomie, Tarifbindung, Geltungsbereich, Laufzeit",
     "Tarifvertragsparteien und Arten von Tarifverträgen unterscheiden und Tarifautonomie, Tarifbindung und Friedenspflicht erklären.",
     G1, ["WISO.01.08.1", "WISO.01.08.2", "WISO.01.08.6", "WISO.01.08.7", "WISO.01.08.8", "WISO.01.08.9"],
     T("2023W-A24", "2024S-A25", "2022S-A14", "2024S-A24", "2023W-A25", "2022S-A13", "2021W-A6", "2022S-A12"),
     hinweis="Das Günstigkeitsprinzip steht in WISO-1-3-1, Betriebsvereinbarung und Tarifvorrang in WISO-1-4-2. IHK-Lösungen: 2022S-WISO-A13 wertete „schließt günstigere Betriebsvereinbarungen nicht aus“ als richtig (fachlich nur bei Öffnungsklausel oder nicht tarifüblichen Themen, siehe WISO-1-4-2). 2022S-WISO-A14 wertete „Definition der jeweiligen Vergütungsgruppen“ nicht als Inhalt des Mantel- oder Rahmentarifvertrags; in der Praxis legt das oft ein eigener Entgeltrahmentarifvertrag fest.")
L.k(1, "Du kannst die Tarifvertragsparteien von anderen Stellen unterscheiden: Gewerkschaften auf der einen, Arbeitgeberverbände oder einzelne Arbeitgeber (Haustarif) auf der anderen Seite – nicht der Staat (Ministerium, Bundesagentur für Arbeit), die Kammer, die Berufsgenossenschaft, der Betriebsrat oder die Geschäftsführung mit den einzelnen Arbeitnehmern.", 2,
    [K("WISO.01.08.1"), B("2023W-A24"), B("2024S-A25")], alt=("angepasst", "Prüfer WISO-1 Nr. b5 (D1): Auswahl-Belege, daher unterscheiden (Stufe 2) mit den Distraktoren"))
L.k(2, "Du kannst Lohn- und Gehaltstarifvertrag (Höhe der Entgelte je Gruppe, Ecklohn, Ausbildungsvergütung, kurze Laufzeit) und Manteltarifvertrag (Arbeitszeit, Urlaub, Sonderurlaub, Kündigungsfristen, längere Laufzeit) unterscheiden.", 2,
    [K("WISO.01.08.1"), B("2022S-A14"), B("2024S-A24")], alt=("angepasst", "Prüfer WISO-1 Nr. b7: Zuordnung wie in den IHK-Lösungen 2022S-A14, 2024S-A24; Abweichung der Praxis im Hinweis"))
L.k(3, "Du kannst Tarifautonomie erklären: Die Tarifparteien regeln Löhne und Arbeitsbedingungen im Rahmen der Gesetze in freier Vereinbarung; der Staat schreibt keine Tarifinhalte vor und muss Tarifverträge nicht genehmigen (Artikel 9 Absatz 3 Grundgesetz).", 2,
    [K("WISO.01.08.2"), K("WISO.01.08.6"), B("2023W-A25"), B("2022S-A13")], alt=("angepasst", "Prüfer WISO-1 Nr. b8: „im Rahmen der Gesetze“ statt „ohne Einmischung des Staates“"))
L.k(4, "Du kannst Tarifbindung erklären: Unmittelbar gilt der Tarifvertrag für Gewerkschaftsmitglieder bei tarifgebundenen Arbeitgebern; diese dürfen und werden ihn in der Regel über den Arbeitsvertrag auch auf Nichtmitglieder anwenden; ein für allgemeinverbindlich erklärter Tarifvertrag gilt für alle Arbeitnehmer der Branche. Er legt Mindestbedingungen fest, keine Höchstgrenzen für Löhne.", 2,
    [K("WISO.01.08.7"), B("2021W-A6"), B("2022S-A13")], alt=("angepasst", "Prüfer WISO-1 Nr. b2, b3, b6 (D3): Günstigkeitsprinzip wohnt in WISO-1-3-1-K5, Betriebsvereinbarung in WISO-1-4-2; Nichtmitglieder und Mindestbedingungen ergänzt"))
L.k(5, "Du kannst den Geltungsbereich eines Tarifvertrags beschreiben: räumlich, fachlich (Branche) und persönlich; ein Haustarifvertrag gilt nur für das eine Unternehmen.", 2,
    [K("WISO.01.08.8"), B("2021W-A6")])
L.k(6, "Du kannst die Friedenspflicht erklären: Während der Laufzeit eines Tarifvertrags sind Streik und Aussperrung über die geregelten Punkte verboten (absolute Friedenspflicht: über alle Punkte).", 2,
    [K("WISO.01.08.9"), B("2022S-A12")])
L.k(7, "Du kannst die Laufzeit eines Tarifvertrags erklären: Die Tarifparteien vereinbaren sie frei, eine gesetzliche Höchstdauer gibt es nicht; nach Kündigung und Ablauf wirken seine Regeln nach, bis eine neue Abmachung gilt.", 2,
    [K("WISO.01.08.9"), B("2022S-A13")])

L.sp("WISO-1-5-2", "Tarifverhandlung, Schlichtung und Arbeitskampf: Streik und Aussperrung",
     "Den Ablauf einer Tarifrunde ordnen und Schlichtung, Streik, Urabstimmung und Aussperrung erklären.",
     G1, ["WISO.01.08.3", "WISO.01.08.4", "WISO.01.08.5"],
     T("2021W-A7", "2023W-A26", "2025S-A17", "2025W-A14"),
     hinweis="Reihenfolge der Tarifrunde nach den IHK-Lösungen (D4): 2021W-WISO-A7 ohne Arbeitskampf (Scheitern → Schlichtung), 2023W-WISO-A26 mit Arbeitskampf (Scheitern → Urabstimmung/Streik → Schlichtung). Gesetzlich ist die Reihenfolge nicht festgelegt; in manchen Branchen wird vor einem Streik geschlichtet. Wie Gewerkschaften und der DGB organisiert sind, steht in WISO-1-5-3.")
L.k(1, "Du kannst Streik und Aussperrung als Kampfmittel unterscheiden: Mit dem Streik legen Arbeitnehmer die Arbeit nieder, mit der Aussperrung lässt der Arbeitgeber Arbeitnehmer nicht arbeiten und zahlt keinen Lohn; auf einen Streik kann er mit Aussperrung antworten.", 2,
    [K("WISO.01.08.4"), B("2025S-A17"), B("2025W-A14")])
L.k(2, "Du kannst erklären, wann ein Streik zulässig ist: Über die geregelten Punkte erst nach Ende der Friedenspflicht, also nach Ablauf des Tarifvertrags; vor einem unbefristeten Streik lässt die Gewerkschaft nach ihrer Satzung die Mitglieder abstimmen (Urabstimmung); eine Genehmigung durch Staat, Ministerium oder den Dachverband DGB braucht es nicht.", 2,
    [K("WISO.01.08.4"), B("2025S-A17"), B("2025W-A14")], alt=("angepasst", "Prüfer WISO-1 Nr. b9: Friedenspflicht statt „Ablauf“, Urabstimmung nach Satzung"))
L.k(3, "Du kannst den Ablauf einer Tarifrunde ordnen: Kündigung des Tarifvertrags, Verhandlungen, Erklärung des Scheiterns, Anrufung eines neutralen Schlichters, Schlichterspruch (ein Einigungsvorschlag, den die Tarifparteien annehmen oder ablehnen können), Annahme, Abschluss des neuen Tarifvertrags; kommt es zum Arbeitskampf, stehen Urabstimmung und Streik nach dem Scheitern und vor der Schlichtung.", 2,
    [K("WISO.01.08.3"), K("WISO.01.08.5"), B("2021W-A7"), B("2023W-A26")], alt=("angepasst", "Prüfer WISO-1 Nr. b1, b10 (D4): Reihenfolge der IHK-Lösungen 2021W-A7 und 2023W-A26; Schlichtung aus K4 aufgenommen"))
L.a("WISO-1-5-2-K4", "verschoben", "WISO-1-5-2-K3", "Prüfer WISO-1 Nr. b10: Schlichtung (neutral, annehmen oder ablehnen) in K3 aufgenommen")
L.k(5, "Du kannst Warnstreik (kurz, während der Verhandlungen) und unbefristeten Streik unterscheiden: Der unbefristete Streik ist das letzte Mittel; viele Tarifrunden enden ohne ihn, und Arbeitskampfmaßnahmen müssen Verhandlungen nicht vorausgehen.", 2,
    [K("WISO.01.08.4"), B("2025S-A17"), B("2025W-A14")], alt=("angepasst", "Prüfer WISO-1 Nr. b11: Streik als letztes Mittel (Distraktoren 2025S-A17, 2025W-A14)"))

L.sp("WISO-1-5-3", "Gewerkschaften, Arbeitgeberverbände, Kammern und Wirtschaftsverbände",
     "Aufgaben der Arbeitnehmer- und Arbeitgeberorganisationen, der Kammern und der Wirtschaftsverbände unterscheiden.",
     G12, ["WISO.01.06.1", ("WISO.01.06.2", "IHK als Interessenvertretung"), "WISO.01.06.3", "WISO.01.07.1", ("WISO.02.07.2", "Kammern als Wirtschaftsorganisation: IHK und Handwerkskammer")],
     T("2022W-A17", "2023S-A16"),
     hinweis="Wohnort nach D6: Gewerkschaften, Arbeitgeberverbände, Kammern (IHK, Handwerkskammer) und Wirtschaftsverbände stehen nur hier. In WISO-2-5-2 stehen, welcher Tarifpartner für eine Branche zuständig ist, berufsständische Vertretungen und Ehrenamt (Katalog WISO.02.07); die IHK als zuständige Stelle in der Ausbildung in WISO-1-2-3.")
L.k(1, "Du kannst Ziele und Aufgaben der Gewerkschaften erklären: bessere Löhne und Arbeitsbedingungen durchsetzen, Tarifverträge aushandeln, Mitglieder beraten und vor Gericht vertreten; Einzelgewerkschaften wie ver.di oder IG Metall sind im Deutschen Gewerkschaftsbund (DGB) als Dachverband zusammengeschlossen, der selbst keine Tarifverträge schließt und keine Streiks genehmigt.", 2,
    [K("WISO.01.07.1")], alt=("angepasst", "Prüfer WISO-1 Nr. b15: DGB als Dachverband (Distraktor in 2025S-A17, 2025W-A14)"))
L.k(2, "Du kannst Aufgaben der Arbeitgeberverbände erklären: die Arbeitgeber einer Branche als Tarifpartner vertreten, ihre Mitglieder beraten und ihre Interessen gegenüber der Politik vertreten.", 2,
    [K("WISO.01.06.1")])
L.k(3, "Du kannst die Aufgaben der Industrie- und Handelskammer von denen anderer Stellen unterscheiden: Sie vertritt die gewerbliche Wirtschaft, berät ihre Mitglieder (zum Beispiel bei der Suche nach Fachkräften) und hat Aufgaben in der Aus- und Weiterbildung; sie vertritt nicht die Arbeitnehmer, schließt keine Tarifverträge, führt nicht das Handelsregister, prüft keine Bilanzen, legt keine Steuern fest und überwacht nicht die Arbeitsschutzgesetze.", 2,
    [K("WISO.01.06.2"), B("2022W-A17"), B("2023S-A16")], alt=("angepasst", "Prüfer WISO-1 Nr. b14: Ausbildungsaufgaben nur kurz (Wohnort WISO-1-2-3), Abgrenzungen aus 2022W-A17 und 2023S-A16"))
L.k(4, "Du kannst erklären, dass die Mitgliedschaft in Gewerkschaft und Arbeitgeberverband freiwillig ist, die in der Kammer dagegen Pflicht – Gewerbebetriebe gehören der IHK an, Handwerksbetriebe der Handwerkskammer; beide Kammern sind Körperschaften des öffentlichen Rechts mit Selbstverwaltung, keine Vereine.", 2,
    [K("WISO.01.06.1"), K("WISO.01.06.2"), K("WISO.01.07.1"), K("WISO.02.07.2"), B("2022W-A17")], alt=("angepasst", "Prüfer WISO-1 Nr. b12 (D6): Handwerkskammer und Rechtsform der Kammer (Körperschaft des öffentlichen Rechts, Distraktor e. V. in 2022W-A17)"))
L.k(5, "Du kannst Wirtschaftsverbände (freiwillige Interessenvertretung einer Branche gegenüber Politik und Öffentlichkeit) von den Kammern (IHK, Handwerkskammer) als gesetzlicher Vertretung aller Betriebe ihres Bezirks und von den Arbeitgeberverbänden als Tarifpartnern unterscheiden.", 2,
    [K("WISO.01.06.3"), K("WISO.02.07.2")], alt=("angepasst", "D6: Wohnort der Wirtschaftsorganisationen; aus WISO-2-5-2-K5 (Kammern und Branchenverbände) zusammengeführt"))

# ---------------------------------------------------------------- 1-6 Entgelt und Sozialversicherung
L.tb("WISO-1-6", "Entgelt und Sozialversicherung", "Wie aus dem Bruttolohn das Nettoentgelt wird, welche Sozialversicherungen es gibt, wer sie trägt und bezahlt, und wie die Beiträge berechnet werden.")

L.sp("WISO-1-6-1", "Entgeltabrechnung: Lohn- und Gehaltsformen, Brutto und Netto, Lohn- und Kirchensteuer, vermögenswirksame Leistungen",
     "Die Positionen einer Entgeltabrechnung erklären, die Steuerklasse zuordnen und vermögenswirksame Leistungen und Realeinkommen einordnen.",
     G12, ["WISO.01.09", "WISO.01.09.1", "WISO.01.09.2", "WISO.01.09.4", "WISO.01.05.2.12", ("ZB.wiso-konjunktur", "Realeinkommen")],
     T("2021W-A11", "2021W-A9", "2023S-A9", "2023W-A4"),
     hinweis="Welche Unterlagen der neue Arbeitgeber verlangen kann, zum Beispiel die steuerliche Identifikationsnummer (2023W-WISO-A3), steht in WISO-1-3-6.")
L.k(1, "Du kannst den Weg vom Brutto zum Netto beschreiben: Bruttoentgelt minus Lohnsteuer, gegebenenfalls Solidaritätszuschlag (seit 2021 nur bei höheren Einkommen) und Kirchensteuer, minus Arbeitnehmeranteile zur Sozialversicherung.", 2,
    [K("WISO.01.09.1")], alt=("angepasst", "Prüfer WISO-1 Nr. b16 (D12): Solidaritätszuschlag nur bei höheren Einkommen"))
L.k(2, "Du kannst erklären, wie die Lohnsteuer erhoben wird und einer Person ihre Steuerklasse zuordnen: Der Arbeitgeber behält sie ein und führt sie an das Finanzamt ab; Ledige ohne Kind haben Steuerklasse I, Alleinerziehende II, Verheiratete III/V oder IV.", 2,
    [K("WISO.01.09.2"), K("WISO.01.05.2.12"), B("2021W-A11")])
L.k(3, "Du kannst erklären, dass Kirchensteuer nur Mitglieder einer steuererhebenden Religionsgemeinschaft zahlen.", 2,
    [K("WISO.01.09.2")])
L.k(4, "Du kannst vermögenswirksame Leistungen erklären: eine Zahlung des Arbeitgebers in einen Sparvertrag des Arbeitnehmers; staatlich gefördert (Arbeitnehmersparzulage, nur unterhalb von Einkommensgrenzen) werden zum Beispiel der Bausparvertrag und der VL-Sparplan bei Bank oder Fondsgesellschaft, nicht aber Sparlose, Unfall- oder Sterbegeldversicherungen.", 2,
    [K("WISO.01.09.4"), B("2021W-A9")], alt=("angepasst", "Prüfer WISO-1 Nr. b17: Distraktoren aus 2021W-A9; Beteiligungen bewusst nicht pauschal ausgeschlossen; keine Beträge (B4)"))
L.k(5, "Du kannst Zeitlohn, Leistungslohn (Akkord, Prämie) und Gehalt unterscheiden.", 2,
    [K("WISO.01.09")], alt=("angepasst", "Prüfer WISO-1 Nr. b19: Herkunft Katalogpunkt WISO.01.09 (Lohn- und Gehaltsformen)"))
L.k(6, "Du kannst Nominal- und Realeinkommen unterscheiden: Steigen die Preise stärker als das Einkommen, sinkt das Realeinkommen (die Kaufkraft), auch wenn das Nominaleinkommen steigt.", 2,
    [K("WISO.01.09.1"), K("ZB.wiso-konjunktur"), B("2023S-A9")])
L.k(7, "Du kannst aus Stundenlohn, Arbeitsstunden, Zuschlägen und Sonderzahlungen den Bruttolohn eines Monats berechnen.", 3,
    [K("WISO.01.09.1"), B("2023W-A4")], vorgegeben="Stundenlohn, Zuschlag und Sonderzahlung im Aufgabentext")

L.sp("WISO-1-6-2", "Sozialversicherung: Zweige, Träger, Finanzierung, Leistungen",
     "Die fünf Zweige der Sozialversicherung mit Träger, Finanzierung und Leistungen kennen und Regeln wie Beitragsbemessungsgrenze, Versicherungspflichtgrenze und Generationenvertrag erklären.",
     G1, [("WISO.01.05.2.11", "Sozialversicherung"), ("WISO.01.09.3", "Wer zahlt welchen Beitrag"), ("ZB.wiso-gerichtsbarkeit", "Sozialgericht")],
     T("2022S-A15", "2023S-A7", "2022W-A16", "2022W-A20", "2024S-A8", "2023S-A8", "2024S-A26", "2021W-A8", "2022W-A19", "2024S-A7"),
     hinweis="Träger und Beitrag der gesetzlichen Unfallversicherung stehen hier (D6); wer in der Unfallversicherung versichert ist, Versicherungsfälle und Leistungen stehen in WISO-3-1-3. Zu 2022W-WISO-A16: Die IHK wertete „Bei geringfügig Beschäftigten zahlt der Arbeitgeber in der Regel alle Beiträge“ als richtig; fachlich trägt der Minijobber einen kleinen Rentenversicherungsanteil, wenn er sich nicht befreien lässt.")
L.k(1, "Du kannst den fünf Zweigen der gesetzlichen Sozialversicherung ihre Träger zuordnen: Krankenversicherung – Krankenkassen, Pflegeversicherung – Pflegekassen (bei den Krankenkassen), Rentenversicherung – Deutsche Rentenversicherung, Arbeitslosenversicherung – Bundesagentur für Arbeit, Unfallversicherung – Berufsgenossenschaften (im öffentlichen Dienst Unfallkassen); die Träger sind selbstverwaltete Körperschaften des öffentlichen Rechts, keine staatlichen Behörden, und private Versicherungen wie die Lebensversicherung gehören nicht dazu.", 2,
    [K("WISO.01.05.2.11"), B("2022S-A15"), B("2022W-A20")], alt=("angepasst", "Prüfer WISO-1 Nr. b22, b24: Träger aus K5 aufgenommen (Wohnort Träger der Unfallversicherung nach D6); Distraktor „staatliche Institution“ (2022W-A20)"))
L.k(3, "Du kannst Streitigkeiten mit einem Träger der Sozialversicherung (zum Beispiel einer Krankenkasse) dem Sozialgericht zuordnen.", 2,
    [K("ZB.wiso-gerichtsbarkeit"), B("2024S-A7")])
L.k(4, "Du kannst Beitragsbemessungsgrenze und Versicherungspflichtgrenze unterscheiden: Auf den Teil des Entgelts über der Bemessungsgrenze fallen keine Beiträge an, man bleibt aber versichert – in der Renten- und Arbeitslosenversicherung gibt es keine Versicherungspflichtgrenze; wer über der Versicherungspflichtgrenze der Kranken- und Pflegeversicherung verdient, kann die gesetzliche Krankenversicherung verlassen oder freiwillig darin bleiben und erhält weiter einen Arbeitgeberzuschuss.", 2,
    [K("WISO.01.05.2.11"), B("2024S-A8"), B("2023S-A8")], alt=("angepasst", "Prüfer WISO-1 Nr. b21, b22: auf Bemessungs- und Versicherungspflichtgrenze beschränkt; Distraktoren aus 2024S-A8 und 2023S-A8"))
L.a("WISO-1-6-2-K5", "verschoben", "WISO-1-6-2-K1", "Prüfer WISO-1 Nr. b22: Träger mit den Zweigen in K1 zusammengelegt (F3: sonst acht Aussagen)")
L.k(6, "Du kannst die Finanzierung erklären: Arbeitgeber und Arbeitnehmer teilen sich die Beiträge grundsätzlich je zur Hälfte; die Unfallversicherung (Träger: Berufsgenossenschaften) zahlt der Arbeitgeber allein, sie ist nicht im Arbeitnehmerbeitrag enthalten; Kinderlose ab 23 Jahren zahlen in der Pflegeversicherung einen Zuschlag; bei Minijobs zahlt der Arbeitgeber Pauschalbeiträge, der Beschäftigte höchstens einen kleinen Eigenanteil zur Rentenversicherung, von dem er sich befreien lassen kann.", 2,
    [K("WISO.01.09.3"), K("WISO.01.05.2.11"), B("2023S-A7"), B("2022W-A16"), B("2022W-A20"), B("2022S-A15")], alt=("angepasst", "Prüfer WISO-1 Nr. b25: Minijob fachlich genau, IHK-Lösung 2022W-A16 im Hinweis; D6: Beitrag der Unfallversicherung wohnt hier"))
L.k(7, "Du kannst das Umlageverfahren der Rentenversicherung (Generationenvertrag) erklären: Die Beiträge der heute Erwerbstätigen bezahlen die laufenden Renten; weil durch den demografischen Wandel weniger Beitragszahler auf mehr Rentner kommen, wird die gesetzliche Rente voraussichtlich nicht allein zur Altersvorsorge reichen, private Vorsorge ist nötig.", 2,
    [K("WISO.01.05.2.11"), B("2024S-A26"), B("2021W-A8")], alt=("angepasst", "Prüfer WISO-1 Nr. b22: auf die Rentenversicherung beschränkt, Generationenvertrag aus K4"))
L.k(8, "Du kannst das Arbeitslosengeld als Versicherungsleistung erklären: Anspruch hat, wer arbeitslos gemeldet ist, der Vermittlung zur Verfügung steht und in den letzten 30 Monaten mindestens zwölf Monate versichert war; es gibt keine Bedürftigkeitsprüfung, und die Höhe richtet sich nach dem Bruttoentgelt der letzten zwölf Monate.", 2,
    [K("WISO.01.05.2.11"), B("2022W-A19")])
L.k(9, "Du kannst Leistungen der Kranken- und Pflegeversicherung zuordnen: ärztliche Behandlung, Krankenhaus und Krankengeld nach dem Ende der Entgeltfortzahlung; Pflege zu Hause durch Angehörige oder Pflegedienste und stationäre Pflege im Heim; versichert sind auch Rentner, Studierende und Bezieher von Arbeitslosengeld.", 2,
    [K("WISO.01.05.2.11"), B("2022W-A20")])

L.sp("WISO-1-6-3", "Sozialversicherungsbeiträge berechnen",
     "Den Arbeitnehmeranteil zu einzelnen Sozialversicherungen aus Bruttoentgelt und vorgegebenen Beitragssätzen berechnen.",
     G1, [("WISO.01.09.3", "Beiträge berechnen"), ("WISO.01.09.1", "Netto berechnen")],
     T("2025W-A25", "2023S-A6", "2023W-A4"))
L.k(1, "Du kannst den Arbeitnehmeranteil zur Krankenversicherung berechnen: Bruttoentgelt mal die Hälfte von allgemeinem Beitragssatz plus Zusatzbeitrag.", 3,
    [K("WISO.01.09.3"), B("2025W-A25")], vorgegeben="Beitragssätze im Aufgabentext")
L.k(3, "Du kannst auf dieselbe Weise den Arbeitnehmeranteil zur Renten- und Arbeitslosenversicherung berechnen (halber Beitragssatz) und bei der Pflegeversicherung den Zuschlag für Kinderlose berücksichtigen, den der Arbeitnehmer allein trägt.", 3,
    [K("WISO.01.09.3"), B("2023S-A6"), B("2023W-A4")], vorgegeben="Beitragssätze im Aufgabentext")
L.k(4, "Du kannst die Beitragsbemessungsgrenze bei der Berechnung anwenden: Liegt das Entgelt darüber, wird der Beitrag nur aus dem Betrag bis zur Grenze berechnet.", 3,
    [K("WISO.01.09.3"), R("P-NAECHSTE-STUFE")], alt=("angepasst", "Prüfer WISO-1 Nr. b28: Weiterführung der belegten Beitragsrechnung (P-NÄCHSTE-STUFE)"))
L.k(5, "Du kannst aus Bruttoentgelt, vorgegebener Lohnsteuer und den Arbeitnehmeranteilen zur Sozialversicherung das Nettoentgelt berechnen.", 3,
    [K("WISO.01.09.1"), K("WISO.01.09.3"), R("P-NAECHSTE-STUFE")], alt=("angepasst", "Prüfer WISO-1 Nr. b28: Weiterführung der belegten Beitragsrechnung (P-NÄCHSTE-STUFE)"))

# ---------------------------------------------------------------- 1-7 Lernen und Arbeitstechniken
L.tb("WISO-1-7", "Lernen und Arbeitstechniken", "Mit welchen Lern- und Arbeitstechniken du dein Lernen und deine Arbeit organisierst und wie du digitale Lernmedien bewertest.")

L.sp("WISO-1-7-1", "Lerntechniken: visuell, auditiv, kommunikativ, motorisch",
     "Lerntechniken unterscheiden, einem Lernstoff eine passende Technik zuordnen und eine visuelle Lernhilfe erstellen.",
     G1, ["WISO.01.11.1", "WISO.01.11.2", "WISO.01.11.3", "WISO.01.11.4"], [],
     hinweis="Die vier Techniken sind Zugänge zum Stoff, keine festen „Lerntypen“: Das Lerntypen-Modell gilt in der Lernforschung als nicht belegt; mehrere Zugänge zu verbinden hilft am meisten.")
L.k(1, "Du kannst visuelles, auditives, kommunikatives und motorisches Lernen danach unterscheiden, über welchen Zugang gelernt wird: Sehen, Hören, Sprechen mit anderen oder eigenes Handeln.", 2,
    [K("WISO.01.11.1"), K("WISO.01.11.2"), K("WISO.01.11.3"), K("WISO.01.11.4")], alt=("angepasst", "Prüfer WISO-1 Nr. b30: auf das Unterscheidungsmerkmal geschärft, damit es nicht in K2 aufgeht (F3)"))
L.k(2, "Du kannst die Beispiele aus dem Katalog den Lerntechniken zuordnen: Lernposter mit Mindmaps, Schaubilder und Grafiken erstellen, Videos ansehen, eigene Zusammenfassungen und Lernkarteien schreiben dem visuellen; Vorträge anhören, Lerninhalte aufnehmen und abspielen dem auditiven; Dialoge, Diskussionen und Frage-Antwort-Spiele dem kommunikativen; „Learning by Doing“, Rollenspiele und Gruppenaktivitäten dem motorischen Lernen; Lerngruppen nennt der Katalog beim auditiven und beim kommunikativen Lernen.", 2,
    [K("WISO.01.11.1"), K("WISO.01.11.2"), K("WISO.01.11.3"), K("WISO.01.11.4")], alt=("angepasst", "Prüfer WISO-1 Nr. b31: Katalogbeispiele vollständig und richtig zugeordnet (P-BEISPIELLISTE: Katalogbeispiele sind Kern)"))
L.a("WISO-1-7-1-K3", "gestrichen", None, "Prüfer WISO-1 Nr. b29 (D2): Stufe 4 über P-NÄCHSTE-STUFE ohne belegtes Verfahren; Inhalt steckt in K2 (zuordnen) und K4 (erstellen)")
L.k(4, "Du kannst zu einem Thema eine visuelle Lernhilfe erstellen, zum Beispiel eine Mindmap mit Hauptbegriff, Ästen und Unterbegriffen oder eine Lernkartei mit Frage und Antwort.", 3,
    [K("WISO.01.11.1")])

L.sp("WISO-1-7-2", "Arbeitstechniken: Zeitmanagement, Moderation, Planung, lernförderlicher Arbeitsplatz",
     "Techniken für Zeitmanagement und Moderation kennen und einsetzen, Arbeitstechniken einordnen und einen lernförderlichen Arbeitsplatz gestalten.",
     G1, ["WISO.01.12.1", ("WISO.01.12.2", "Moderationstechniken"), "WISO.01.12.4", "WISO.01.12.5", ("WISO.01.12.6", "Statistiken auswerten"),
          ("AP2b.04.02.2", "Merkmale agiler Arbeit: Selbstorganisation, Boards"), ("AP1.01.01.3", "Merkmale agiler Arbeit")],
     T("2022W-A22", "2022W-A29", "2022W-A30"),
     baut_auf=["AP1-2-3-2", "AP1-2-3-3", "AP1-1-2-1", "AP1-1-1-2", "PB1-1-1-1", "PB1-1-1-3"],
     hinweis="Fachinformationen beschaffen und auswerten (AP1-2-3-2), Präsentieren (AP1-2-3-3), Projektplanung (AP1-1-2-1) sowie Scrum und agiles Vorgehen (AP1-1-1-2, PB1-1-1-1, PB1-1-1-3) kennst du aus AP1 und PB1; 2022W-WISO-A30 (Vorteil agilen Projektmanagements) beantwortest du mit PB1-1-1-1, für 2022W-WISO-A29 ergänzt K8 die Merkmale agiler Arbeit.")
L.a("WISO-1-7-2-K1", "verschoben", "WISO-1-7-2-K2", "Prüfer WISO-1 Nr. b34: Zweck des Zeitmanagements als Vorbemerkung in K2 aufgenommen")
L.k(2, "Du kannst Zeitmanagement-Techniken erklären: Sie dienen dazu, Aufgaben zu ordnen und die verfügbare Zeit zu planen, zum Beispiel mit einer Aufgabenliste nach Prioritäten, der Einteilung nach wichtig und dringend (Eisenhower-Prinzip) und eingeplanten Pufferzeiten.", 2,
    [K("WISO.01.12.1"), K("WISO.01.12.4")], alt=("angepasst", "Prüfer WISO-1 Nr. b34, b35 (D1): Stufe 3 → 2 (Katalog ohne Operator, kein Beleg); Zweck aus K1 aufgenommen"))
L.a("WISO-1-7-2-K3", "gestrichen", None, "Prüfer WISO-1 Nr. b33: keine prüfbare Aussage; Moderation steht in K4, Präsentieren in AP1-2-3-3, Planung in K2 und AP1-1-2-1")
L.k(4, "Du kannst Moderationstechniken beschreiben: Kartenabfrage, Brainstorming, Punktabfrage zur Gewichtung und die Rolle des Moderators, der das Gespräch lenkt, aber keine eigene Meinung vertritt.", 2,
    [K("WISO.01.12.2")], alt=("angepasst", "auf Moderation beschränkt; Präsentationsregeln stehen in AP1-2-3-3 (E2, P36)"))
L.k(6, "Du kannst beschreiben, was einen lernförderlichen Arbeitsplatz ausmacht: Ruhe, Ordnung, gutes Licht, Unterlagen griffbereit, Lernzeiten in den Arbeitsalltag eingeplant.", 2,
    [K("WISO.01.12.5")])
L.k(7, "Du kannst an einer Statistik oder Tabelle unterscheiden, welche Aussagen sich damit belegen lassen und welche nicht: absolute Zahlen und Veränderungen in Prozent getrennt lesen und auf die Bezugsgröße achten (zum Beispiel je 1.000 Beschäftigte).", 2,
    [K("WISO.01.12.6"), B("2022W-A22")], neu=(["AP1-2-3-2"], "Aussagen anhand einer Statistik prüfen: absolute und relative Werte, Bezugsgrößen"), vorgegeben="Statistik im Aufgabentext")
L.k(8, "Du kannst Merkmale agiler Arbeit von hierarchischer Vorgabe unterscheiden: selbstorganisierte, eigenverantwortliche Teams, offene Weitergabe von Wissen, transparente Darstellung des Fortschritts auf Boards und adaptives Planen – nicht aber, dass Vorgesetzte Lösung und Weg vorgeben.", 2,
    [B("2022W-A29")], neu=(["PB1-1-1-1", "PB1-1-1-3"], "Selbstorganisation, Transparenz über Boards und offene Wissensweitergabe als Merkmale agiler Arbeit, abgegrenzt von der Vorgabe durch die Hierarchie"))

L.sp("WISO-1-7-3", "Digitale Lernmedien: Internet, Apps, Plattformen, CBT, WBT",
     "Digitale Lernmedien unterscheiden, sie für das eigene Lernen nutzen und für einen Lernzweck bewerten.",
     G1, ["WISO.01.12.7", "WISO.01.12.7.1", "WISO.01.12.7.2", "WISO.01.12.7.3", "WISO.01.12.7.4", "WISO.01.12.7.5", "WISO.01.12.7.6", "WISO.01.12.7.7"], [],
     baut_auf=["AP1-7-4-3"],
     hinweis="Sicher mobil arbeiten (Gerät sperren, Blickschutz, VPN, Datenschutz) kennst du aus AP1-7-4-3; hier geht es um das Lernen mit mobilen Geräten.")
L.a("WISO-1-7-3-K1", "verschoben", "WISO-1-7-3-K6", "Prüfer WISO-1 Nr. b37: reine Katalogliste ohne prüfbare Unterscheidung, in K6 (nutzen) aufgenommen")
L.k(2, "Du kannst Computer Based Training (Lernprogramm auf dem eigenen Rechner, ohne Netzverbindung) und Web Based Training (über das Internet abgerufen, aktualisierbar, oft mit Austausch) unterscheiden.", 2,
    [K("WISO.01.12.7.5"), K("WISO.01.12.7.6")])
L.k(4, "Du kannst ein digitales Lernmedium für deinen Lernzweck bewerten: unabhängig von Zeit und Ort und im eigenen Tempo gegenüber nötiger Selbstdisziplin, fehlendem direktem Austausch und der Qualität der Inhalte.", 4,
    [K("WISO.01.12.7")])
L.k(5, "Du kannst beschreiben, was beim Lernen mit mobilen Endgeräten zu beachten ist: Ablenkung vermeiden, feste Lernzeiten einplanen und betriebliche Nutzungsregeln einhalten.", 2,
    [K("WISO.01.12.7.7")], alt=("angepasst", "Prüfer WISO-1 Nr. b38: Datenschutz und Sicherheit stehen in AP1-7-4-3 (baut_auf); hier nur das Lernen"))
L.k(6, "Du kannst digitale Lernmedien wie Internet, Apps, Plattformen (für Kommunikation, Information, Videos und Austausch) und Netzwerke für ein Lernziel nutzen, zum Beispiel eine Lernplattform oder eine Lernkarten-App mit geplanten Wiederholungen.", 3,
    [K("WISO.01.12.7"), K("WISO.01.12.7.1"), K("WISO.01.12.7.2"), K("WISO.01.12.7.3"), K("WISO.01.12.7.4")])

# ---------------------------------------------------------------- 1-8 Weiterbildung und Lebensplanung
L.tb("WISO-1-8", "Weiterbildung und Lebensplanung", "Welche Wege der Fort- und Weiterbildung es gibt, wie sie gefördert werden, wie du Lernen und Arbeiten in Europa nutzt und was bei einer Existenzgründung zu bedenken ist.")

L.sp("WISO-1-8-1", "Lebensbegleitendes Lernen, Fortbildung und Umschulung, staatliche Förderung",
     "Ausbildung, Fortbildung und Umschulung unterscheiden, Arten der Fortbildung zuordnen und Fördermöglichkeiten kennen.",
     G1, ["WISO.01.10.1", "WISO.01.10.2", "WISO.01.10.3", "WISO.01.10.4", "WISO.01.13.1", "WISO.01.13.2", "WISO.01.13.3", "WISO.01.13.4", "WISO.01.13.5", "WISO.01.14.1", "WISO.01.14.6"],
     T("2023S-A4", "2025W-A12", "2022W-A15"))
L.k(1, "Du kannst an einem Beispiel berufliche Fortbildung, Umschulung und andere Bildungsmaßnahmen unterscheiden: Die Umschulung befähigt jemanden, der schon einen Beruf erlernt oder ausgeübt hat, zu einem anderen Beruf (zum Beispiel nach einer Allergie); wer eine laufende Ausbildung abbricht und eine neue beginnt oder nur den Betrieb wechselt, wird nicht umgeschult. Die Fortbildung baut nach abgeschlossener Ausbildung auf dem Beruf auf; Lehrgänge während der Ausbildung, auch überbetriebliche, gehören zur Ausbildung, und ein Schulbesuch, ein Studium oder ein Freizeitkurs ist keine berufliche Fortbildung.", 2,
    [K("WISO.01.10.2"), B("2023S-A4"), B("2025W-A12")], alt=("angepasst", "unterscheiden (F1); Prüfer WISO-1 Nr. b39: Distraktoren aus 2023S-A4 und 2025W-A12"))
L.k(2, "Du kannst Erhaltungsfortbildung (Kenntnisse auffrischen), Anpassungsfortbildung (an neue Entwicklungen anpassen) und Aufstiegsfortbildung (für eine höhere Position qualifizieren) unterscheiden.", 2,
    [K("WISO.01.13.2"), K("WISO.01.13.3"), K("WISO.01.13.4"), B("2025W-A12")])
L.k(3, "Du kannst innerbetriebliche, überbetriebliche und externe Fortbildung unterscheiden.", 2,
    [K("WISO.01.10.3"), K("WISO.01.13.5"), K("WISO.01.14.6"), K("WISO.01.10.1")], alt=("angepasst", "Prüfer WISO-1 Nr. b41: auf die Lernorte beschränkt, Regelungen in K7"))
L.k(5, "Du kannst Förderungen ihren Stellen zuordnen: Arbeitsagentur (Bildungsgutschein) und Rentenversicherung (Umschulung aus gesundheitlichen Gründen), Aufstiegs-BAföG.", 2,
    [K("WISO.01.10.4"), K("WISO.01.13.1"), B("2022W-A15")])
L.k(6, "Du kannst erklären, warum lebensbegleitendes Lernen in IT-Berufen nötig ist: kurze Innovationszyklen, neue Werkzeuge und Verfahren und wachsende Sicherheitsanforderungen.", 2,
    [K("WISO.01.10.1")], alt=("angepasst", "Prüfer WISO-1 Nr. b40 (D2): P-NÄCHSTE-STUFE ohne belegtes Verfahren, zurück auf Katalogstufe 2"))
L.k(7, "Du kannst Regelungen zur Weiterbildung erklären: Freistellung und Kostenübernahme können in Betriebsvereinbarung, Tarif- oder Arbeitsvertrag geregelt sein, und die meisten Bundesländer geben Beschäftigten einen Anspruch auf Bildungsurlaub.", 2,
    [K("WISO.01.10.1"), K("WISO.01.14.1")])

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
L.k(1, "Du kannst den Zweck des Europasses erklären: Qualifikationen und Kompetenzen europaweit einheitlich und verständlich darstellen, zum Beispiel bei Bewerbungen; er ist kein Reisedokument, kostenlos und keine Pflicht für Auslandsaufenthalte; der Europass-Mobilität dokumentiert einen Auslandsaufenthalt, beglaubigt aber nichts, und Sprachkenntnisse schätzt man darin selbst ein, sie werden nicht zertifiziert.", 2,
    [K("WISO.01.14.7"), B("2021W-A24"), B("2022S-A16")], alt=("angepasst", "Prüfer WISO-1 Nr. b43: Distraktoren „beglaubigt“ und „zertifiziert“ (2022S-A16)"))
L.k(2, "Du kannst erklären, dass Teile der Ausbildung im Ausland stattfinden können – in der Regel bis zu einem Viertel der Ausbildungsdauer – und Mobilitätsprogramme der EU wie Erasmus+ solche Aufenthalte in Ausbildung, Studium und Weiterbildung fördern.", 2,
    [K("WISO.01.14.3"), K("WISO.01.14.8")], alt=("angepasst", "Prüfer WISO-1 Nr. b42: mit K3 (Erasmus+) zusammengelegt, Regel aus § 2 Abs. 3 BBiG ergänzt"))
L.a("WISO-1-8-3-K3", "verschoben", "WISO-1-8-3-K2", "Prüfer WISO-1 Nr. b42: Erasmus+ in K2 aufgenommen (doppelt)")
L.k(4, "Du kannst die Europäische Sozialcharta einordnen: ein Abkommen des Europarats, das soziale Grundrechte wie gerechte Arbeitsbedingungen und berufliche Bildung festhält.", 2,
    [K("WISO.01.14.9")])

L.sp("WISO-1-8-4", "Existenzgründung: Möglichkeiten und Grenzen",
     "Chancen und Risiken einer Existenzgründung abwägen, Standortfaktoren kennen und Zweck und Inhalt eines Businessplans erklären.",
     G1, ["WISO.01.14.12"],
     T("2022W-A23", "2023S-A14", "2023W-A22", "2024S-A19"),
     hinweis="Die Rechtsform der Gründung steht in WISO-2-2.")
L.k(1, "Du kannst Chancen und Risiken einer Existenzgründung unterscheiden: eigene Entscheidungen und höhere Verdienstmöglichkeiten gegenüber unsicherem Einkommen gerade in der Gründungsphase, hohem finanziellem Risiko und Haftung und eigener sozialer Absicherung (keine automatische Pflichtversicherung gegen Krankheit und Alter).", 2,
    [K("WISO.01.14.12"), B("2022W-A23")], alt=("angepasst", "mit K2 zusammengefasst; Prüfer WISO-1 Nr. b45 (D2): unterscheiden, Stufe 2 mit Beleg 2022W-A23 statt P-NÄCHSTE-STUFE"))
L.a("WISO-1-8-4-K2", "verschoben", "WISO-1-8-4-K1", "mit K1 zusammengefasst (Chancen und Risiken)")
L.k(3, "Du kannst erklären, was ein Businessplan enthält und wozu er dient: Geschäftsidee, Markt- und Wettbewerbsanalyse, strategische Ziele und Finanzkonzept; er dient zuerst der eigenen Planung und ist für jede Gründung sinnvoll, unabhängig von Rechtsform und Kredit, überzeugt aber auch Kapitalgeber wie Banken; er wird nicht von der Kammer ausgestellt und nirgends eingetragen.", 2,
    [K("WISO.01.14.12"), B("2023W-A22"), B("2024S-A19")], alt=("angepasst", "Prüfer WISO-1 Nr. b46: Distraktoren „nur bei Kapitalgesellschaften“ und „nur bei Darlehen“"))
L.a("WISO-1-8-4-K4", "verschoben", "WISO-1-8-4-K3", "mit K3 zusammengefasst (Inhalt und Zweck des Businessplans)")
L.k(5, "Du kannst Erfolgsfaktoren einer Gründung erklären: Kenntnis von Markt, Kunden und Wettbewerb, ausreichende Fachkenntnisse und Finanzierung.", 2,
    [K("WISO.01.14.12"), B("2022W-A23")])
L.k(6, "Du kannst Standortfaktoren für eine Gründung unterscheiden: Konkurrenz, Kundennähe und Verkehrsanbindung, Miete, behördliche Auflagen und der Gewerbesteuer-Hebesatz der Gemeinde – nicht aber der Umsatzsteuersatz, der bundesweit gleich ist.", 2,
    [K("WISO.01.14.12"), B("2023S-A14")], alt=("angepasst", "Prüfer WISO-1 Nr. b44 (D12): Gewerbesteuer-Hebesatz ist Standortfaktor, nur die Umsatzsteuer nicht"))

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

L.write(meta(kerntest="Alle 125 WiSo-Teilaufgaben dieses Ordners gegen die Musterlösungen gelesen; je Aufgabe geprüft, dass eine Aussage die richtige Antwort trägt und die falschen Antwortmöglichkeiten ausschließt. Lücken geschlossen: Arbeitsvertrag (neuer Stichpunkt WISO-1-3-6), Sozialauswahl, Fragerecht im Einstellungsgespräch, Statistik lesen, Standortfaktoren. Unabhängige Prüfung am 16.10.2026 durch zwei Prüfer (umbau/berichte/WISO-1-pruefer.md, 81 Funde); eingebaut nach den Entscheidungen D1–D12 in umbau/berichte/WISO-pruefer-bilanz.md, Entscheidung je Fund im Abschnitt „Umsetzung“ des Berichts."))
