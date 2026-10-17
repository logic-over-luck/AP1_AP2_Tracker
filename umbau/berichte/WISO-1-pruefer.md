# Prüfbericht WISO-1 (Berufsbildung, Arbeits- und Tarifrecht)

Zwei unabhängige Prüfer, je eine Hälfte des Ordners (Auftrag umbau/auftraege/WISO-pruefung.md).

## Teil a: Themenblöcke WISO-1-1 bis WISO-1-4


Prüfer: KI-Prüfagent (unabhängig, ohne Kenntnis von `umbau/berichte/`, `meta`, `alt_neu`, Bau-Skripten und Altinhalten).
Stand der Prüfung: 16.10.2026. Grundlage: `umbau/auftraege/WISO-pruefung.md`.

**Geprüft:** 16 Stichpunkte, 85 Können-Aussagen (WISO-1-1-1 bis WISO-1-4-3). 98 verschiedene Aufgaben aus `teilaufgaben`
vollständig samt Musterlösung und allen Antwortmöglichkeiten in `quellen/pruefungen/wiso/*.md` gelesen (inkl. 2023W-WISO-A12).
Abgleich mit `umbau/zuordnung/wiso/*.json` (alle 240 Aufgaben): Jede Aufgabe, deren Bausteine zu WISO.01.01–01.05 (ohne
05.2.11/12), WISO.01.06.2, WISO.01.07.2.* oder WISO.02.09.* gehören, steht in einem Stichpunkt; die übrigen Treffer
(Tarif 01.08, Sozialversicherung 05.2.11, IHK-Aufgaben 01.06.2 ohne Ausbildungsbezug) stehen korrekt in WISO-1-5/1-6 bzw.
WISO-3-1-3. Keine Aufgabe ist ohne Stichpunkt. Katalogbausteine (`katalog-bausteine.json`), Zusatzbaustein
`ZB.wiso-gerichtsbarkeit`, `wiso-deckung.json` (kein Eintrag für WISO.01.01–01.07/02.09), Exporte AP1/PB1/PB2 (insb.
AP1-3-4-1, PB1-2-1-1, AP1-4-3-1) sowie die übrigen WiSo-Ordner (Stichwortsuche nach Doppelungen) herangezogen.
Fachstand: BBiG nach BVaDiG (in Kraft 1.8.2024), BetrVG nach Betriebsrätemodernisierungsgesetz 2021, ArbZG-Reform
(Stand Mitte 2026 nicht verabschiedet), MuSchG, AGG, TzBfG, BUrlG.

Gesamturteil: Die Abdeckung ist gut – fast alle Aufgaben sind mit den Aussagen sicher lösbar. Die Hauptprobleme sind
(1) 15 Aussagen mit Stufe 1 unter der WiSo-Untergrenze 2, (2) mehrfache Doppelungen innerhalb von WISO-1-3 und zu
WISO-3/WISO-1-5, (3) einige Distraktoren aus mehreren Prüfungen, die keine Aussage entschärft, (4) wenige fachliche
Ungenauigkeiten (Vergütung, JAV-Alter, Textform), eine missverständliche Formulierung (WISO-1-3-3-K6).

### Funde

| Nr | Stelle (ID) | Art | Befund | Vorschlag (konkreter neuer Wortlaut, wo möglich) | Sicherheit |
|---|---|---|---|---|---|
| 1 | WISO-1-1-4-K2, WISO-1-2-3-K1, WISO-1-3-1-K3, WISO-1-3-2-K4, WISO-1-3-4-K1, -K3, -K4, -K5, WISO-1-3-5-K1, -K3, -K5, -K6, WISO-1-4-1-K3, -K5, WISO-1-4-3-K5 | K2 Stufe | 15 Aussagen haben Stufe 1. Alle hängen an WiSo-Katalogpunkten ohne Operator (Stufe 2 laut 4.1/`ohne_operator`; Z3b: „Katalogstufe bleibt Untergrenze“). Mehrere sind zudem durch Auswahlaufgaben belegt (Z3b = 2): WISO-1-4-1-K3 (5 Auswahl-Belege), WISO-1-2-3-K1 (2021W-A14), WISO-1-3-5-K3 (2024S-A27). Auch Eintrag-Aufgaben (2023W-A18, 2024S-A18: Stufe 1) heben die Katalogstufe 2 nicht auf. | Alle auf Stufe 2 setzen; Operator von „nennen“ auf „unterscheiden/zuordnen/erklären“ umstellen, z. B. WISO-1-4-1-K3: „Du kannst unterscheiden, in welchen Angelegenheiten der Betriebsrat mitbestimmt (…) und in welchen nicht (…)“. | hoch |
| 2 | WISO-1-3-1-K5 | K2 Stufe | Stufe 3 („anwenden“), Beleg 2022S-WISO-A1 ist Einfachauswahl (Z3b = 2), Katalog WISO.01.05.1 ohne Operator (2). Keine Rechnung, keine Fallanwendung über Auswahl hinaus. | Stufe 2: „Du kannst die Rangfolge der Regelungen erklären (…) und mit dem Günstigkeitsprinzip begründen, warum ein übertarifliches Gehalt im Arbeitsvertrag gilt.“ | hoch |
| 3 | WISO-1-3-3-K6 | unklar | „Der Betriebsrat ist vorher anzuhören, und innerhalb von drei Wochen nach Zugang kann **er** Kündigungsschutzklage … erheben“ – grammatisch klagt der Betriebsrat. Fachlich falsch gelesen genau der Fehler, den 2023S-A19 abprüft. Außerdem fehlt Distraktor 2023S-A19 [1]: Ein Widerspruch des Betriebsrats verhindert die Kündigung nicht. | „Du kannst erklären, wie sich ein Arbeitnehmer gegen eine Kündigung wehrt: Der Arbeitgeber muss den Betriebsrat vorher anhören, ein Widerspruch des Betriebsrats verhindert die Kündigung aber nicht; der Arbeitnehmer kann innerhalb von drei Wochen nach Zugang Kündigungsschutzklage beim Arbeitsgericht erheben. Das Arbeitsgericht ist auch für Streit um das Arbeitszeugnis zuständig.“ | hoch |
| 4 | WISO-1-4-3-K1 | doppelt WiSo | Vollständig in WISO-1-3-2-K1 enthalten (JAV → Betriebsverfassungsgesetz), gleiche Belege 2025S-A11, 2025W-A8 (beide Aufgaben stehen in beiden Stichpunkten). | Streichen; WISO-1-4-3 behält 4 Aussagen (F3 erfüllt). Alternativ JAV aus WISO-1-3-2-K1 herausnehmen und hier lassen. | hoch |
| 5 | WISO-1-3-2-K5, WISO-1-3-3-K2, WISO-1-3-5-K2, -K5, -K6 | doppelt WiSo | Dieselben Fakten stehen bis zu dreimal: Kündigungsschutz in der Elternzeit (1-3-2-K5, 1-3-3-K2, 1-3-5-K5), Zusatzurlaub und Kündigungsschutz Schwerbehinderter (1-3-2-K5, 1-3-3-K2, 1-3-5-K6), Kündigungsverbot Mutterschutz (1-3-3-K2, 1-3-5-K2). | WISO-1-3-2-K5 auf die reine Zuordnung kürzen: „Du kannst den Arbeitsgesetzen ihr Thema zuordnen: Bundesurlaubsgesetz – Mindesturlaub, Entgeltfortzahlungsgesetz – Lohn bei Krankheit und an Feiertagen, Elternzeit – Freistellung mit Kündigungsschutz, Arbeitszeitgesetz – Höchstarbeitszeit, Schwerbehindertenrecht – Zusatzurlaub und besonderer Kündigungsschutz“ (Zahlen nur am Wohnort 1-3-4/1-3-5/1-3-6). WISO-1-3-5-K6 ganz streichen (steht inhaltlich in 1-3-3-K2 und 1-3-2-K5). | mittel |
| 6 | WISO-1-3-2-K2 | doppelt WiSo | Arbeitsschutzgesetz (Sicherheit und Gesundheit) und Arbeitsstättenverordnung (Arbeitsräume) werden in WISO-3-1-1-K1 und -K4 tiefer gelehrt. | In WISO-1-3-2-K2 nur Berufsbildungsgesetz und Betriebsverfassungsgesetz behalten und für ArbSchG/ArbStättV auf WISO-3-1-1 verweisen (Hinweis), oder WISO.01.05.2.2/.2.7 aus `bausteine` von WISO-1-3-2 entfernen und WISO-3-1-1 deckt sie. | mittel |
| 7 | WISO-1-4-2-K1, -K3 | doppelt WiSo / zu fein | K3 (Tarifvorrang § 77 Abs. 3 BetrVG) ist die Begründung zu K1 („nicht aber Entgelte nach Gehaltsgruppen …“). Zwei Aussagen für einen Gedanken. | Zusammenlegen: „Du kannst unterscheiden, welche Sachverhalte eine Betriebsvereinbarung regeln kann (Pausen, Urlaubsplan, Gleitzeit, Beurteilungsverfahren) und welche nicht: Entgelte und Arbeitsbedingungen, die üblicherweise der Tarifvertrag regelt (außer er lässt es ausdrücklich zu), weniger als Gesetz oder Tarifvertrag erlauben.“ | mittel |
| 8 | WISO-1-4-2-K3 (und WISO-1-5-1-K4, anderer Prüfer) | K1 fehlt / Grenze | 2022S-WISO-A13 (amtlich) wertet „Ein Tarifvertrag schließt günstigere Betriebsvereinbarungen nicht aus“ als **richtig**. Wer nur K3 kennt („Arbeitsentgelte … können nicht Gegenstand einer Betriebsvereinbarung sein“), streicht diese Antwort. Die Aussagen in WISO-1-4-2 und WISO-1-5-1-K4 müssen zusammenpassen. | Hinweis an WISO-1-4-2 (P35 Nr. 7): „Günstigere Betriebsvereinbarungen sind nicht grundsätzlich ausgeschlossen – erlaubt sind sie bei einer Öffnungsklausel im Tarifvertrag und bei Themen, die der Tarifvertrag nicht regelt; die IHK wertet ‚schließt günstigere Betriebsvereinbarungen nicht aus‘ als richtig (2022S-A13).“ | mittel |
| 9 | WISO-1-1-3-K2 | K1 fehlt | 2025S-A9 [6] und 2025W-A3 [6] („muss … einen unbefristeten Arbeitsvertrag anbieten“) und 2022W-A14 [5] („wird nach der Ausbildung automatisch übernommen“): Keine Aussage sagt, dass es **keine** Übernahmepflicht gibt; K2 regelt nur die stillschweigende Weiterbeschäftigung. | „Du kannst erklären, dass der Betrieb Auszubildende nicht übernehmen muss (JAV- und Betriebsratsmitglieder können die Übernahme verlangen, sie erfolgt nicht automatisch) und dass ein unbefristetes Arbeitsverhältnis entsteht, wenn jemand nach bestandener Prüfung ohne ausdrückliche Vereinbarung weiterarbeitet.“ | mittel |
| 10 | WISO-1-4-1-K3, -K5 | K1 fehlt | Wiederkehrende Distraktoren ohne Aussage: „Betriebsrat muss paritätisch aus Männern und Frauen gebildet werden“ (2022S-A10 [2], 2023W-A9 [2]); „muss in jeder GmbH / ab 500 Beschäftigten gewählt werden“ (2022S-A10 [1], 2023W-A9 [4]); Gründung einer Filiale / Rechtsform / Einstellung leitender Mitarbeiter (2022S-A10 [4], 2023W-A10 [5][6], 2022W-A13 [5]); „Handlungsvollmacht für Rechtsgeschäfte“ (2022S-A10 [3]). | K5 ergänzen: „… es gibt keine Pflicht, einen Betriebsrat zu wählen; das Geschlecht in der Minderheit muss mindestens entsprechend seinem Anteil vertreten sein (keine Hälfte-Hälfte-Pflicht).“ K3 ergänzen: „… nicht aber unternehmerische Entscheidungen wie Personalplanung, Bauvorhaben, Gründung einer Filiale, Wechsel der Rechtsform oder die Einstellung leitender Angestellter und der Geschäftsführung; dort wird er höchstens informiert. Rechtsgeschäfte für das Unternehmen schließt er nicht.“ | mittel |
| 11 | WISO-1-3-3-K4 | K1 fehlt | 2023W-A13 [3] „eintägiges unentschuldigtes Fehlen“ als Grund für fristlose Kündigung: Die Aussage nennt nur Arbeitsmangel und unverschuldete Krankheit als Gegenbeispiele; die Regel „einmaliges leichteres Fehlverhalten → zuerst Abmahnung“ fehlt (steht nur indirekt in K5). | „… und erkennen, dass Arbeitsmangel, unverschuldete Krankheit oder ein einmaliges leichteres Fehlverhalten wie ein Tag unentschuldigtes Fehlen keine fristlose Kündigung rechtfertigen (hier ist zuerst eine Abmahnung nötig).“ | mittel |
| 12 | WISO-1-3-5-K2, -K4 | K1 fehlt | Distraktoren ohne Aussage: „Mutterschutzlohn höchstens 75 % des Nettolohns“ (2021W-A5 [3]), „Mutterschaftsgeld während der gesamten Schwangerschaft“ (2022W-A9 [2]); „AGG gilt nicht für Auszubildende“, „kein Schadensersatz“, „gilt nicht für Aufstieg und Arbeitsbedingungen“ (2023S-A29 [1][2][5]). | K2 ergänzen: „… bei einem Beschäftigungsverbot erhält sie ihren vollen bisherigen Durchschnittsverdienst, Mutterschaftsgeld gibt es nur während der Schutzfristen.“ K4 ergänzen: „Das AGG gilt auch für Auszubildende und für Bewerbung, Arbeitsbedingungen und Aufstieg; Benachteiligte haben Anspruch auf Entschädigung oder Schadensersatz.“ | mittel |
| 13 | WISO-1-4-3-K3 | falsch (ungenau) | „gewählt werden können Arbeitnehmer bis 25 Jahre“ – § 61 Abs. 2 BetrVG: wählbar ist, wer das 25. Lebensjahr **noch nicht vollendet** hat; ein 25-Jähriger ist nicht wählbar. Außerdem fehlt die Mindestzahl (2022W-A14 [1] „mindestens zehn Jugendliche“). | „Du kannst Wahlrecht und Wählbarkeit zur JAV erklären: Eine JAV gibt es ab fünf Arbeitnehmern unter 18 oder Auszubildenden unter 25; wählen dürfen Arbeitnehmer unter 18 und Auszubildende unter 25, wählbar sind Arbeitnehmer unter 25 (das 25. Lebensjahr noch nicht vollendet); die Amtszeit beträgt zwei Jahre.“ (nimmt K5 mit auf, siehe Nr. 18) | hoch |
| 14 | WISO-1-1-4-K4 | falsch (ungenau) | „mindestens die gesetzliche Mindestvergütung oder der Tarif“ ist missverständlich: Nach § 17 BBiG geht eine tarifliche Vergütung vor, auch wenn sie unter der Mindestvergütung liegt; ohne Tarifbindung gilt „angemessen“ = in der Regel mindestens 80 % des Branchentarifs und nie unter der Mindestvergütung. | „Du kannst die Regeln zur Ausbildungsvergütung erklären: Sie muss angemessen sein – ein geltender Tarifvertrag geht vor, ohne Tarifbindung darf sie die gesetzliche Mindestvergütung nicht unterschreiten –, sie steigt mindestens jährlich und ist spätestens am letzten Arbeitstag des Monats zu zahlen.“ (Beträge nicht nennen, B4) | mittel |
| 15 | WISO-1-1-1-K3 | veraltet | Seit dem BVaDiG (1.8.2024) darf die Vertragsniederschrift in Textform (z. B. als PDF per E-Mail) erstellt werden, der Empfang ist zu bestätigen; die Aussage nennt die Form nicht. Gleiches gilt für das Ausbildungszeugnis (§ 16 BBiG: elektronisch mit Einwilligung) in WISO-1-1-3-K3. Die Kündigung (WISO-1-1-2-K5) bleibt schriftlich – der Unterschied ist prüfungsrelevant. | K3: „… ist unverzüglich nach Abschluss, spätestens vor Beginn der Ausbildung schriftlich oder in Textform (z. B. als PDF) niederzulegen …“. Bei 1-1-2-K5 „schriftlich (Textform genügt nicht)“ nur, wenn sicher geprüft; sonst unverändert lassen. | mittel |
| 16 | WISO-1-2-1-K3 | falsch (ungenau) | „Auszubildende sind berufsschulpflichtig“ – die Berufsschulpflicht ist Landesrecht; in vielen Ländern sind Auszubildende, die bei Ausbildungsbeginn älter als 21 sind, nur berufsschul**berechtigt**. Für den Lernenden (Umschüler) relevant. | „Du kannst die Regeln zu Berufsschule und Prüfung erklären: Jugendliche Auszubildende sind berufsschulpflichtig (ältere je nach Bundesland berechtigt); der Betrieb muss für Unterricht und Prüfungen freistellen und die Berufsschulzeit auf die Arbeitszeit anrechnen.“ | niedrig |
| 17 | WISO-1-3-2-K4 | zu fein / K3 | „Heutige Fundstellen der Katalognamen“ (SGB IX, BEEG) ist eine Lesehilfe, keine prüfbare Können-Aussage; die Prüfungen verwenden selbst die alten Namen („Schwerbehindertengesetz“, „Elternzeitgesetz“, 2021W-A18). | In `hinweis` von WISO-1-3-2 verschieben. | mittel |
| 18 | WISO-1-4-3-K5, WISO-1-1-1-K5 | zu fein | Ein-Fakt-Aussagen: Amtszeit JAV zwei Jahre; Teilnichtigkeit („nur die nichtige Vereinbarung ist unwirksam“). Beide gehören zur Nachbaraussage. | 1-4-3-K5 in K3 aufnehmen (Wortlaut Nr. 13); 1-1-1-K5 an K4 anhängen: „… diese Vereinbarungen sind nichtig, der übrige Vertrag bleibt wirksam.“ | niedrig |
| 19 | WISO-1-3-5 | zu grob | 7 Aussagen, 13 Aufgaben, vier Gesetze (MuSchG, BEEG, AGG, SGB IX) plus Einstellungsfragen – deutlich mehr als eine Lerneinheit. AGG-Teil (K3, K4, K7, 9 Aufgaben) ist allein prüfungsstark. | Teilen: WISO-1-3-5 „Mutterschutz, Elternzeit, Schwerbehinderung“ (K1, K2, K5, ggf. K6) und neuer Stichpunkt „Gleichbehandlung bei Stellenanzeige, Auswahl und Einstellungsgespräch“ (K3, K4, K7 + Ergänzung aus Nr. 12). | mittel |
| 20 | WISO-1-3-1-K1, -K2 | Grenze / K1 fehlt | 2022W-A7: Nur „übertarifliche Gehaltsvereinbarung“ zählt als Individualarbeitsrecht; „Urlaubsregelungen nach dem Bundesurlaubsgesetz“ und „Unfallverhütungsvorschriften“ sind Distraktoren. In der Lehre wird Arbeitnehmerschutzrecht (BUrlG, ArbZG) oft zum Individualarbeitsrecht gezählt – die Aussage lässt den Lernenden hier unsicher. | Hinweis: „In der IHK-Prüfung gehört zum Individualarbeitsrecht die zwischen Arbeitgeber und einzelnem Arbeitnehmer vereinbarte Regel (Arbeitsvertrag, übertarifliche Zulage); Gesetze wie das BUrlG und Unfallverhütungsvorschriften wurden nicht als Individualarbeitsrecht gewertet (2022W-A7).“ | mittel |
| 21 | WISO-1-3-3-K6, WISO-1-4-1-K4 | doppelt WiSo | Anhörung des Betriebsrats vor jeder Kündigung steht in beiden (Belege 2023S-A19 bzw. 2022S-A7). | In 1-3-3-K6 auf 1-4-1-K4 verweisen oder dort nur „Anhörung (sonst unwirksam), Widerspruch hindert nicht“ und in 1-4-1-K4 nur die Unterscheidung Mitbestimmung/Mitwirkung. | niedrig |
| 22 | WISO-1-3-2-K5 / WISO-1-3-4-K5 / WISO-1-3-6-K5 | doppelt WiSo | „Acht Stunden werktäglich, Verlängerung“ (1-3-2-K5 und 1-3-4-K5) und „Mindesturlaub 24 Werktage“ (1-3-2-K5 und 1-3-6-K5) doppelt. | Durch die Kürzung aus Nr. 5 erledigt. | mittel |
| 23 | WISO-1-1-1-K2 / WISO-1-2-2-K2 | doppelt WiSo | „Der betriebliche Ausbildungsplan wird Teil des Vertrags“ steht in beiden, beide mit Beleg 2025S-A10. | In WISO-1-2-2-K2 den Halbsatz streichen und 2025S-A10 dort aus `teilaufgaben` nehmen, oder umgekehrt. | niedrig |
| 24 | WISO-1-1-4-K1 / WISO-1-2-1-K3 | doppelt WiSo | Freistellung für Berufsschule und Prüfungen steht in beiden. | In 1-1-4-K1 „für Berufsschule und Prüfungen freistellen“ streichen (Wohnort 1-2-1-K3). | niedrig |
| 25 | WISO-1-4-1-K2 / -K6 | doppelt WiSo | Wahlberechtigung ab 16 und Leiharbeitnehmer nach drei Monaten stehen in K2 und K6; K6 ist eine Rechnung mit vorgegebenem § 7 BetrVG (B4). | K6 kürzen: „Du kannst mit einem abgedruckten Auszug aus §§ 7 und 9 BetrVG die Zahl der Wahlberechtigten und die Größe des Betriebsrats ermitteln (Auszubildende und befristet Beschäftigte zählen mit).“ | niedrig |
| 26 | WISO-1-3-1-K5 / WISO-1-5-1-K4 | doppelt WiSo | Günstigkeitsprinzip in beiden (Arbeitsvertrag über Tarif). Abstimmung mit dem Prüfer von WISO-1-5. | Wohnort festlegen (Vorschlag: WISO-1-3-1-K5), in WISO-1-5-1-K4 per Verweis. | niedrig |
| 27 | WISO-1-2-3-K3 | doppelt WiSo | Gewerbeaufsicht und Berufsgenossenschaft als Stellen für Arbeitsschutz stehen auch in WISO-3-1-1-K6 und WISO-2-5-3-K2. Der Kern hier (IHK bei Ausbildungsfragen) ist richtig platziert. | Halbsatz „eine Arbeitsschutzfrage der Gewerbeaufsicht oder der Berufsgenossenschaft“ durch „nicht etwa Berufsgenossenschaft, Gewerbeaufsicht oder Berufsberatung“ ersetzen (nur als Abgrenzung, Wohnort WISO-3-1-1). | niedrig |
| 28 | WISO-1-1-3-K3 / WISO-1-3-6-K6 | doppelt WiSo | Einfaches/qualifiziertes Zeugnis steht zweimal (BBiG § 16 / GewO § 109), fast gleicher Wortlaut. Zeugnissprache-Aufgabe 2022W-A11 ist ein Ausbildungszeugnis, steht aber in 1-3-6. | Vertretbar, weil zwei Gesetze; dann in 1-3-6-K6 nur „gilt ebenso für das Arbeitszeugnis; Zeugnissprache deuten“ und auf 1-1-3-K3 verweisen. | niedrig |
| 29 | WISO-1-3-3-K6 | K2 Herkunft | Herkunft „katalog:ZB.wiso-gerichtsbarkeit“ – ein Zusatzbaustein ist keine Katalogstelle (F2 kennt nur katalog/beleg/regel). | Prüfen, wie andere Räume Zusatzbausteine in `herkunft` führen; ggf. nur über Beleg 2023S-A20 begründen. | niedrig |
| 30 | WISO-1-4-1-K5 | falsch (ungenau) | § 1 BetrVG: Betriebsrat ab fünf ständigen wahlberechtigten Arbeitnehmern, **von denen drei wählbar sind**. | „… ab in der Regel fünf ständigen wahlberechtigten Arbeitnehmern, von denen drei wählbar sind …“ | niedrig |
| 31 | WISO-1-3-4-K5 | veraltet (Risiko) | Eine Reform des Arbeitszeitgesetzes (wöchentliche statt tägliche Höchstarbeitszeit) ist geplant; Stand Mitte 2026 nicht verabschiedet. Die Aussage ist zum Prüfstand richtig, muss aber beobachtet werden; Prüfungen fragen den Achtstundentag (2021W-A18 d). | Keine Änderung jetzt; Merker im `hinweis`: „Stand Oktober 2026; ArbZG-Reform geplant – vor der Prüfung prüfen.“ | niedrig |
| 32 | WISO-1-3-6-K5 | falsch (ungenau) | „Resturlaub ist grundsätzlich bis Ende März des Folgejahres zu nehmen“ – nach BAG/EuGH verfällt er nur, wenn der Arbeitgeber rechtzeitig auf den drohenden Verfall hingewiesen hat. Für die Prüfung reicht die Grundregel (2022W-A8). | Optional: „… grundsätzlich bis 31. März des Folgejahres übertragbar (Verfall nur nach Hinweis des Arbeitgebers)“. | niedrig |
| 33 | WISO-1-3-5-K1, -K6 | zur Kür | 12 Wochen Schutzfrist gelten auch bei Geburt eines Kindes mit Behinderung (auf Antrag); seit 1.6.2025 gestaffelte Schutzfristen nach Fehlgeburt ab der 13. Woche; „Integrationsamt“ heißt in manchen Ländern „Inklusionsamt“. Nicht prüfungsrelevant belegt. | Nicht aufnehmen oder als Kür-Hinweis. | niedrig |
| 34 | WISO-1-3-4-K2 | K1 fehlt | 2022S-A4: Distraktoren „erste Nachuntersuchung nach drei Monaten“, „an Feiertagen ohne Ausnahme verboten“, „Ruhetage müssen aufeinander folgen“. Lösbar über „fünf Tage“, aber ohne Aussage, die die Falschen als falsch erkennbar macht. | Nicht zwingend; ggf. ergänzen: „… Nachuntersuchung vor Ablauf des ersten Beschäftigungsjahres“. | niedrig |
| 35 | WISO-1-1-2-K4 / WISO-1-3-3-K2 | (geprüft, kein Fund) | Auszubildende nach der Probezeit erscheinen in beiden – einmal aus Sicht BBiG, einmal als Gruppe mit besonderem Kündigungsschutz (Belege 2023W-A17, 2024S-A23). Verschiedene Fragerichtung, bleibt. | – | – |

### Ergänzende Feststellungen ohne Fund

- **K1 vollständig lösbar** (mit den Ergänzungen oben): alle Aufgaben zu Probezeit, Kündigung Ausbildung, Ende/Zeugnis,
  Eignung der Ausbilder, Ausbildungsordnung, Kündigungsfristen (§ 622 BGB vorgegeben), Kündigungsgründe, Sozialauswahl,
  JArbSchG (Dienstplan, Urlaub mit Tarif), AGG-Stellenanzeigen, Einstellungsfragen, Befristung, Zeitarbeit,
  Betriebsratswahl (Rechnungen 2022W-A12 = 11, 2023W-A7 = 58 mit K6 nachvollzogen), Betriebsversammlung, JAV.
- **Doppelt zu AP1/PB1/PB2:** keine Wiederholung gefunden. 2021W-A23 (Urheberrecht an Software Angestellter) ist durch
  AP1-3-4-1-K7 vollständig gedeckt (`baut_auf` richtig), AGB (2025S-A16 b) durch PB1-2-1-1-K3.
- **Deckung (P47):** `wiso-deckung.json` führt keinen Baustein aus WISO.01.01–01.07 oder WISO.02.09; das ist richtig –
  kein früherer Raum lehrt Ausbildungs-, Arbeits- oder Betriebsverfassungsrecht.
- **K3:** Keine Aussage ohne Grundlage in Katalog, Beleg oder Regel gefunden (außer Nr. 17 als Lesehilfe).
- **Stufen 3:** WISO-1-3-3-K1, WISO-1-3-4-K6, -K7, WISO-1-4-1-K6 sind durch Rechenaufgaben (Z3b, Typ „berechnen“)
  korrekt auf 3; `vorgegeben` ist bei allen vier richtig gesetzt.
- **WISO-1-2-1** hat keine Belege; die Aussagen stehen wörtlich im Katalog (WISO.01.02, 01.03.4–6) und bleiben nach E6.

### Offene Fragen an den Projektinhaber

1. Die Parkplatz-Einträge P46–P48 stehen nicht in `UMBAU.md` (nur in `regelwerk.json` für Z3b/P46). Sind sie noch
   nicht übertragen? Die Bewertung zu Nr. 1 stützt sich auf den Z3b-Text in `regelwerk.json` („Katalogstufe bleibt
   Untergrenze“).
2. Sollen Stufe-1-Aussagen in WiSo grundsätzlich unzulässig sein (dann Nr. 1 vollständig umsetzen), oder gilt die
   Untergrenze nur je Baustein (T8: höchste Stufe je Baustein reicht)? Im zweiten Fall wären Nr. 1 nur die Aussagen mit
   Auswahl-Beleg zu heben (WISO-1-2-3-K1, WISO-1-3-5-K3, WISO-1-4-1-K3).
3. Widerspruch Tarifvorrang (§ 77 Abs. 3 BetrVG, WISO-1-4-2-K3) gegen IHK-Lösung 2022S-A13 und WISO-1-5-1-K4: Bitte
   mit dem Prüfer von WISO-1-5 abstimmen, welche Formulierung beide Stichpunkte tragen (Nr. 8, 26).
4. Kein Stichpunkt in WISO-1-1 bis WISO-1-4 hat ein Feld `grenzen`. Ist das für WiSo so gewollt?

## Teil b: Themenblöcke WISO-1-5 bis WISO-1-8


Geprüft: `umbau/lernplan/wiso/WISO-1.json`, Themenblöcke WISO-1-5 (Tarifrecht und Verbände), WISO-1-6 (Entgelt und
Sozialversicherung), WISO-1-7 (Lernen und Arbeitstechniken), WISO-1-8 (Weiterbildung und Lebensplanung). Die erste Hälfte
(WISO-1-1 bis WISO-1-4) prüft ein anderer Prüfer; ihr Abschnitt kommt in `WISO-1-pruefer.md`.

**Was geprüft wurde:** 13 Stichpunkte, 65 Können-Aussagen (Text, Stufe, Herkunft, `neu`, `vorgegeben`), Bausteine,
`baut_auf` und `hinweis`. 43 Teilaufgaben aus den `teilaufgaben` habe ich vollständig in den Abschriften gelesen, mit
Musterlösung und allen falschen Antwortmöglichkeiten (2023W-WISO-A4 unter `# 2023W-WISO-A4`). Gegengeprüft habe ich die
8 Zuordnungsdateien. Alle 57 Teilaufgaben, deren Bausteine zu WISO.01.06 bis WISO.01.14, WISO.01.05.2.11/.12,
ZB.wiso-konjunktur oder ZB.wiso-gerichtsbarkeit gehören, stehen in einem Stichpunkt. 14 davon stehen sachlich
richtig anderswo: WISO-1-2-3, WISO-1-3-x, WISO-2-1-4 und WISO-3-1-3. Außerdem habe ich alle WiSo-Aufgabentexte nach
passenden Stichwörtern durchsucht (Tarif, Sozialversicherung, Fortbildung, Lernen, Gründung …). Dabei fand sich keine
Aufgabe ohne Stichpunkt. Weiter verglichen habe ich mit dem Katalog (WISO.01.06–WISO.01.14), `wiso-deckung.json`,
`zusatzbausteine.json`, den AP1- und PB1-Exporten (Präsentieren, Informationsbeschaffung, Projektplanung, Scrum,
mobiles Arbeiten) und den übrigen WiSo-Plänen (Doppelungen). Nicht gelesen: `umbau/berichte/` (nur den Dateinamen
geprüft, damit nichts überschrieben wird), `meta`, `alt_neu`, `tools/umbau/gen-wiso/` und `inhalte/`.

**Ergebnis kurz:** Die Abdeckung der Aufgaben ist vollständig. Fachlich falsch sind die Standortfaktoren (Steuersätze).
Im Widerspruch zu WISO-1-4-2 steht die Aussage zur Betriebsvereinbarung. Für mehrere Aufgaben fehlt ein Satz, mit dem
man die falschen Antwortmöglichkeiten sicher ausschließt (Tarifrunde mit Streik vor Schlichtung, Umschulung gegen
Ausbildungswechsel, Tarifvertrag für Nichtmitglieder, Europass-Mobilität). Dreimal ist Stufe 4 per P-NÄCHSTE-STUFE
vergeben, obwohl es keinen Beleg gibt. Dazu kommen einige Doppelungen innerhalb von WiSo.

### Abschnitt WISO-1-5 bis WISO-1-8

| Nr | Stelle (ID) | Art | Befund | Vorschlag (konkreter neuer Wortlaut, wo möglich) | Sicherheit |
|---|---|---|---|---|---|
| 1 | WISO-1-5-2-K3 | K1 fehlt | Die beiden Reihenfolgeaufgaben haben verschiedene amtliche Abläufe. In 2021W-WISO-A7 kommt die Schlichtung ohne Streik. In 2023W-WISO-A26 lautet die Lösung: Kündigung → Verhandlung → Scheitern → **Urabstimmung/Streik → Schlichtung** → Schlichterempfehlung → Annahme. K3 bietet „Schlichtung … **oder** Urabstimmung und Streik, neue Verhandlung“ als Alternativen an. Damit lässt sich 2023W-A26 nicht sicher ordnen (Streik vor oder nach der Schlichtung?). Eine „neue Verhandlung“ kommt in keiner der beiden Aufgaben vor. | „Du kannst den Ablauf einer Tarifrunde ordnen: Kündigung des Tarifvertrags, Verhandlungen, Erklärung des Scheiterns, Anrufung des Schlichters, Schlichterspruch, Annahme, Abschluss des neuen Tarifvertrags. Kommt es zum Arbeitskampf, stehen Urabstimmung und Streik nach dem Scheitern und **vor** der Schlichtung.“ Am Stichpunkt ein `hinweis` auf 2023W-WISO-A26. | hoch |
| 2 | WISO-1-5-1-K4 (gegen WISO-1-4-2-K3) | falsch (Widerspruch) | K4 sagt: „günstigere Regelungen in **Betriebsvereinbarung** oder Arbeitsvertrag bleiben möglich“. WISO-1-4-2-K3 sagt dagegen richtig, dass Arbeitsentgelte, die üblicherweise ein Tarifvertrag regelt, nicht Gegenstand einer Betriebsvereinbarung sein können (§ 77 Abs. 3 BetrVG). Die IHK-Lösung 2022S-WISO-A13 [3] („schließt günstigere Betriebsvereinbarungen nicht aus“) folgt K4 und ist fachlich ungenau. Nach P35 Nr. 7 bleibt die Aussage fachlich richtig, und am Stichpunkt steht ein Hinweis auf die IHK-Lösung. | K4 (Ende): „… günstigere Abmachungen bleiben erlaubt (Günstigkeitsprinzip), vor allem im Arbeitsvertrag; eine Betriebsvereinbarung über Entgelte nur, wenn der Tarifvertrag es zulässt.“ `hinweis`: „2022S-WISO-A13 wertet ‚schließt günstigere Betriebsvereinbarungen nicht aus‘ als richtig.“ | hoch |
| 3 | WISO-1-5-1-K4 | K1 fehlt | 2022S-WISO-A13 [4] „darf nur für gewerkschaftlich organisierte Arbeitende angewendet werden“ ist falsch. K4 sagt aber nur, dass der Tarifvertrag „unmittelbar für Gewerkschaftsmitglieder“ gilt. Wer genau das gelernt hat, hält [4] für richtig. Ebenso fehlt „Mindestbedingungen, keine Höchstgrenzen“ (Option [6]). | K4 ergänzen: „Tarifgebundene Arbeitgeber wenden ihn in der Regel über den Arbeitsvertrag auch auf Nichtmitglieder an. Er legt Mindestbedingungen fest, keine Höchstgrenzen für Löhne.“ | hoch |
| 4 | WISO-1-5-1 | K1 fehlt | Katalog WISO.01.08.9 „Laufzeit“ steht im Titel, aber keine Aussage behandelt die Laufzeit. Nur K2 erwähnt sie in Klammern („kurze/längere Laufzeit“). 2022S-WISO-A13 [5] „Laufzeit höchstens drei Jahre“ lässt sich so nicht ausschließen. | In K6 aufnehmen: „Die Laufzeit wird frei vereinbart (keine gesetzliche Höchstdauer). Nach Ablauf und Kündigung wirkt der Tarifvertrag nach, bis ein neuer gilt; während der Laufzeit gilt die Friedenspflicht …“ | mittel |
| 5 | WISO-1-5-1-K1 | K2 Stufe | Stufe 1 („nennen“). WiSo-Katalogpunkte ohne Operator haben Stufe 2. Die Belege 2023W-A24 und 2024S-A25 sind Auswahlaufgaben, also nach Z3b auch Stufe 2. | Stufe 2: „Du kannst die Tarifvertragsparteien von anderen Stellen unterscheiden: …“ | mittel |
| 6 | WISO-1-5-1-K4 / WISO-1-3-1-K5 | doppelt WiSo | Das Günstigkeitsprinzip steht vollständig in WISO-1-3-1-K5 (Beleg 2022S-A1) und wird in 1-5-1-K4 wiederholt. | In 1-5-1-K4 nur verweisen („Günstigkeitsprinzip siehe WISO-1-3-1“) und die Aussage auf Tarifbindung und Allgemeinverbindlichkeit kürzen. | mittel |
| 7 | WISO-1-5-1-K2 | unklar | 2022S-WISO-A14: Als Inhalte des Manteltarifvertrags gelten in der Lösung nicht „Definition der Vergütungsgruppen“, „Ausbildungsvergütung“, „Ecklohn“ und „Mindest-/Höchstlohnsätze“. In der Praxis definieren oft Rahmen- bzw. Entgeltrahmentarifverträge die Entgeltgruppen. K2 grenzt das nicht ab, deshalb ist Option [4] für Lernende eine Falle. | K2 ergänzen: „In IHK-Aufgaben gehören Ausbildungsvergütung, Ecklohn und die Entgeltgruppen zum Lohn- und Gehaltstarifvertrag.“ | niedrig |
| 8 | WISO-1-5-1-K3 | unklar | „ohne Einmischung des Staates“ ist zu absolut. Die Aufgabe 2023W-A25 sagt „unter Beachtung der gesetzlichen Vorschriften“. Auch die Allgemeinverbindlicherklärung und der Mindestlohn sind staatliche Eingriffe. | „… regeln Löhne und Arbeitsbedingungen im Rahmen der Gesetze in freier Vereinbarung; der Staat schreibt keine Tarifinhalte vor (Art. 9 Abs. 3 GG).“ | niedrig |
| 9 | WISO-1-5-2-K2 | unklar | „Streiks erst nach Ablauf des Tarifvertrags zulässig“: Genau genommen gilt das erst nach Ende der Friedenspflicht und bei relativer Friedenspflicht nur für die geregelten Punkte (siehe 1-5-1-K6). Die Urabstimmung schreibt die Satzung der Gewerkschaft vor, kein Gesetz. | „… Streiks über die geregelten Punkte erst nach Ende der Friedenspflicht; vor einem unbefristeten Streik lässt die Gewerkschaft nach ihrer Satzung die Mitglieder abstimmen (Urabstimmung) …“ | niedrig |
| 10 | WISO-1-5-2-K4 | doppelt WiSo / zu fein | Die Schlichtung steht schon in K3 (Schlichterspruch, Annahme). K4 fügt nur „neutral, annehmen oder ablehnen“ hinzu. | K4 in K3 aufnehmen (siehe Nr. 1); dafür bei Nr. 4 bzw. 11 ergänzen. | niedrig |
| 11 | WISO-1-5-2-K5 | K1 fehlt | 2025S-A17 [4] und 2025W-A14 [4] („Tarifverhandlungen werden immer von (unbefristeten) Streiks begleitet“) setzen voraus, dass der Streik das letzte Mittel ist. Das steht nirgends. | K5: „Du kannst Warnstreik (kurz, während der Verhandlungen) und unbefristeten Streik unterscheiden; der unbefristete Streik ist das letzte Mittel, viele Tarifrunden enden ohne ihn.“ | niedrig |
| 12 | WISO-1-5-3-K3/K4 | K1 fehlt | 2022W-WISO-A17: Die falsche Option [4] beschreibt die IHK als „eingetragenen Verein“. K3/K4 nennen die Pflichtmitgliedschaft, aber nicht die Rechtsform (Körperschaft des öffentlichen Rechts). | K4: „… die Mitgliedschaft in der Kammer ist für Gewerbebetriebe Pflicht; die IHK ist eine Körperschaft des öffentlichen Rechts, kein Verein.“ | mittel |
| 13 | WISO-1-5-3-K5 / WISO-2-5-2-K3, -K5 | doppelt WiSo | WISO-2-5-2-K5 („Kammern … und Branchenverbände vertreten die Interessen der Betriebe“) deckt sich im Kern mit 1-5-3-K5 (Wirtschaftsverbände). WISO-2-5-2-K3 (Gewerkschaften und Arbeitgeberverbände nach Branchen, wer Tarifpartner ist) überschneidet sich mit 1-5-1-K1 und 1-5-3-K1/K2, obwohl der `hinweis` von 1-5-3 sagt „nur hier“. | Wirtschaftsverbände nur in 1-5-3-K5 (Katalog WISO.01.06.3). WISO-2-5-2-K5 auf die Kammern als Wirtschaftsorganisation kürzen, mit Verweis. 2-5-2-K3 als Verweis auf 1-5-3 umformulieren oder hier einordnen (Hinweis an den WISO-2-Prüfer). | mittel |
| 14 | WISO-1-5-3-K3 | doppelt WiSo | „zuständige Stelle für Aus- und Weiterbildung“ steht ausführlich in WISO-1-2-3-K1, „führt nicht das Handelsregister“ in WISO-2-2-4-K1. | In K3 nur die Interessenvertretung und Beratung behalten (Anteil laut `bausteine`), den Rest mit Verweis. Die Abgrenzung „keine Steuern, keine Tarifverträge“ bleibt (Distraktoren 2022W-A17, 2023S-A16). | niedrig |
| 15 | WISO-1-5-3-K1 | zur Kür | Der DGB taucht als Distraktor auf (2025S-A17 [1], 2025W-A14 [1]), und 1-5-2-K2 spricht vom „Dachverband“, ohne ihn zu erklären. | K1 ergänzen: „Einzelgewerkschaften wie ver.di oder IG Metall sind im DGB als Dachverband zusammengeschlossen; der DGB schließt keine Tarifverträge und genehmigt keine Streiks.“ | niedrig |
| 16 | WISO-1-6-1-K1 | veraltet | Der Solidaritätszuschlag steht als regelmäßiger Abzug da. Seit 2021 zahlen ihn wegen der Freigrenze nur noch Beschäftigte mit hohem Einkommen. | „… Bruttoentgelt minus Lohnsteuer, gegebenenfalls Solidaritätszuschlag (seit 2021 nur bei höheren Einkommen) und Kirchensteuer, minus Arbeitnehmeranteile zur Sozialversicherung.“ | mittel |
| 17 | WISO-1-6-1-K4 | K1 fehlt | 2021W-WISO-A9: Distraktoren sind Sparlose, Unfallversicherung, Sterbegeldversicherung und Aktien einer AG. K4 nennt nur die zwei richtigen Beispiele. Vorsicht: Beteiligungen sind nach dem VermBG zum Teil förderfähig, deshalb nicht pauschal „keine Aktien“ schreiben. | K4 ergänzen: „… geförderte Formen sind zum Beispiel Bausparvertrag und VL-Sparplan bei Bank oder Fondsgesellschaft; Versicherungen und Lose gehören nicht dazu. Die Arbeitnehmersparzulage gibt es nur unterhalb von Einkommensgrenzen.“ | mittel |
| 18 | WISO-1-6-1 (teilaufgaben: 2023W-WISO-A3) | Grenze | 2023W-A3 (Steuer-ID, Urlaubsbescheinigung) wird in WISO-1-3-6-K1 vollständig behandelt. In 1-6-1 gibt es dazu keine Aussage. | 2023W-A3 aus den `teilaufgaben` von 1-6-1 nehmen oder einen `hinweis` „siehe WISO-1-3-6“ setzen. | niedrig |
| 19 | WISO-1-6-1-K5 | K2 Herkunft | Zeitlohn, Leistungslohn und Gehalt verweisen auf `katalog:WISO.01.09.1` (Brutto/Netto). Gemeint ist der Katalogpunkt WISO.01.09 „Lohn- und Gehaltsformen“. | Herkunft `katalog:WISO.01.09` (Punkttitel). | niedrig |
| 20 | WISO-1-6-1-K2 | zur Kür | Steuerklasse VI (zweites Arbeitsverhältnis) fehlt. In den Belegen nicht verlangt (2021W-A11 bietet nur 1–5 an). | Optional: „…; für ein zweites Arbeitsverhältnis gilt Steuerklasse VI.“ | niedrig |
| 21 | WISO-1-6-2-K4 | K1 fehlt | 2024S-WISO-A8 [3]/[4]: „über der Beitragsbemessungsgrenze keine Versicherungspflicht mehr / scheidet aus der Rentenversicherung aus“. K4 verbindet die Versicherungspflichtgrenze mit dem Verlassen der GKV, sagt aber nicht, dass es in der Rentenversicherung keine solche Grenze gibt. 2023S-A8 [5] („Beitrag zu 100 % selbst tragen“) ist ebenfalls nicht abgedeckt. | „… In der Renten- und Arbeitslosenversicherung bleibt man auch über der Beitragsbemessungsgrenze pflichtversichert; eine Versicherungspflichtgrenze gibt es nur in der Kranken- und Pflegeversicherung. Wer dort freiwillig versichert bleibt, erhält weiter einen Arbeitgeberzuschuss.“ | mittel |
| 22 | WISO-1-6-2-K4, -K7 | zu grob | K4 verlangt drei Begriffe auf einmal (BBG, VPG, Generationenvertrag). K7 verbindet Rente und Arbeitslosengeld. | Aufteilen: (a) BBG und VPG unterscheiden (mit Nr. 21); (b) Generationenvertrag/Umlageverfahren und demografischer Wandel → private Vorsorge (aus K4 + K7); (c) Arbeitslosengeld (Nr. 23). | niedrig |
| 23 | WISO-1-6-2-K7 | K1 fehlt | 2022W-WISO-A19: Die Distraktoren „nur an Bedürftige und Arbeitsunfähige“ und „erst Ersparnisse aufbrauchen“ setzen voraus, dass ALG I eine Versicherungsleistung ohne Bedürftigkeitsprüfung ist. Das steht nicht da. | „Du kannst das Arbeitslosengeld als Versicherungsleistung erklären: Anspruch hat, wer arbeitslos gemeldet und arbeitsfähig ist und in den letzten 30 Monaten mindestens zwölf Monate versichert war; es gibt keine Bedürftigkeitsprüfung, und die Höhe richtet sich nach dem Bruttoentgelt der letzten zwölf Monate.“ | mittel |
| 24 | WISO-1-6-2 | K1 fehlt | Der Titel verspricht „Leistungen“, behandelt werden aber nur Renten- und Arbeitslosenversicherung. 2022W-A20 hat Distraktoren zu Pflegekassen („staatliche Institution“), zu Versicherten („Rentner, Studenten nicht versichert“) und zu Leistungen („nur ambulante Pflege durch Angehörige“). Lösbar ist die Aufgabe über K6, aber es fehlt jede Aussage zu Kranken- und Pflegeleistungen. | Neue Aussage (Stufe 2): „Du kannst Leistungen der Kranken- und Pflegeversicherung zuordnen: ärztliche Behandlung, Krankenhaus, Krankengeld nach dem Ende der Entgeltfortzahlung; Pflege ambulant und stationär. Träger sind selbstverwaltete Körperschaften, keine Behörden.“ | mittel |
| 25 | WISO-1-6-2-K6 | unklar | „bei geringfügig Beschäftigten trägt er in der Regel alle Beiträge“ entspricht der IHK-Lösung 2022W-A16. Fachlich sind Minijobber aber rentenversicherungspflichtig und zahlen einen kleinen Eigenanteil, wenn sie sich nicht befreien lassen. | „… bei Minijobs zahlt der Arbeitgeber Pauschalbeiträge, der Beschäftigte nur einen kleinen Rentenversicherungsanteil, wenn er sich nicht befreien lässt …“ | niedrig |
| 26 | WISO-1-6-2-K5, -K6 / WISO-3-1-3-K2 | doppelt WiSo | „Berufsgenossenschaften“ als Träger und „Unfallversicherung zahlt der Arbeitgeber allein“ stehen auch in WISO-3-1-3-K2. Der `hinweis` sagt selbst, dass die Unfallversicherung dort gesammelt ist. | In K5 die Berufsgenossenschaften streichen (Verweis WISO-3-1-3). In K6 nur „die Unfallversicherung ist nicht im Arbeitnehmerbeitrag“ behalten (nötig für 2022S-A15). | niedrig |
| 27 | WISO-1-6-2-K6 | zur Kür | Seit 07/2023 gibt es in der Pflegeversicherung Abschläge für Eltern mit mehreren Kindern unter 25. Die Beitragssätze stehen in der Aufgabe (B4). | Optional: „… Eltern mehrerer Kinder unter 25 zahlen weniger.“ Ohne Zahlen. | niedrig |
| 28 | WISO-1-6-3-K4, -K5 | K2 Herkunft | Mit der BBG rechnen und das Netto berechnen ist ohne Beleg. Als Rechnung ist Stufe 3 in Ordnung, die Herkunft ist aber eine Weiterführung der belegten Beitragsrechnung. | Herkunft um `regel:P-NAECHSTE-STUFE` ergänzen. | niedrig |
| 29 | WISO-1-7-1-K3 | flacher / K2 Herkunft | Stufe 4 („auswählen und begründen“) über P-NÄCHSTE-STUFE. Die Regel setzt ein **belegtes** Verfahren voraus, aber 1-7-1 hat keine Teilaufgabe. Der Katalog WISO.01.11 trägt nur „erstellen“ (Stufe 3). | Streichen. Inhalt bleibt in K2 (Zuordnen) und K4 (Erstellen). Wenn behalten: Stufe 2 „einem Lernstoff eine passende Lerntechnik zuordnen“. | mittel |
| 30 | WISO-1-7-1-K1 / -K2 | doppelt WiSo / zu fein | K1 („unterscheiden“) ist ganz in K2 (Beispiele zuordnen) enthalten. | K1 streichen oder mit K2 zusammenlegen. | mittel |
| 31 | WISO-1-7-1-K2 | K2 Herkunft | Katalogbeispiele fehlen oder sind anders zugeordnet: „Videos ansehen“ (visuell), „Lerngruppen bilden“ (steht im Katalog bei **auditiv** und bei kommunikativ), „Gruppenaktivitäten“ (motorisch). Nach P-BEISPIELLISTE sind die Katalogbeispiele Kern. | „… Mindmaps, Schaubilder, Videos, Zusammenfassungen und Lernkarteien dem visuellen; Vorträge anhören, Lerninhalte aufnehmen und abspielen, Lerngruppen dem auditiven; Dialoge, Diskussionen, Frage-Antwort-Spiele dem kommunikativen; Learning by Doing, Rollenspiele und Gruppenaktivitäten dem motorischen Lernen.“ | mittel |
| 32 | WISO-1-7-1 | unklar (Lehrmeinung) | „Lerntypen“ gelten in der Lernforschung als nicht belegt. Der Plan spricht richtig von Lerntechniken, aber ein Hinweis fehlt, damit K3 nicht als „finde deinen Lerntyp“ gelesen wird. | `hinweis`: „Die vier Techniken sind Zugänge zum Stoff, keine festen Lerntypen; mehrere Zugänge zu verbinden hilft am meisten.“ | niedrig |
| 33 | WISO-1-7-2-K3 | streichen | „Moderations-, Präsentations- und Planungstechniken als Arbeitstechniken einordnen“: Dazu lässt sich keine prüfbare Frage stellen. Der Inhalt steht in K4 (Moderation), in AP1-2-3-3 (Präsentieren, `baut_auf`) und in AP1-1-2-1 bzw. K2 (Planung). | Streichen. | mittel |
| 34 | WISO-1-7-2-K1 / -K2 | zu fein | K1 („wozu Zeitmanagement dient“) ist eine Vorbemerkung zu K2. | In K2 aufnehmen. | niedrig |
| 35 | WISO-1-7-2-K2 | K2 Stufe | Stufe 3 („anwenden“) ohne Beleg. WISO.01.12.1 hat keinen Operator, also Stufe 2. Die Herkunft nennt nur den Katalog. | Stufe 2: „Du kannst Zeitmanagement-Techniken erklären und Aufgaben nach wichtig/dringend (Eisenhower) einordnen …“, oder Herkunft `regel:P-NAECHSTE-STUFE` mit Begründung. | mittel |
| 36 | WISO-1-7-2 (`hinweis`, 2022W-WISO-A29) | K1 fehlt | Nach dem Hinweis wird A29/A30 mit PB1-1-1-1 gelöst. A29 fragt Merkmale agiler Prozesse ab: Transparenz, Boards, **Selbstorganisation** und adaptive Planung gegen die Vorgabe durch die Hierarchie. PB1-1-1-1 (Export) deckt Planung und Änderungen ab, nicht aber Selbstorganisation und Boards. A30 ist gedeckt. | `baut_auf` um PB1-1-1-3 ergänzen und im `hinweis` nennen. Wenn das im PB1-Export auch fehlt, eine `neu`-Aussage: „Du kannst Merkmale agiler Arbeit erkennen: selbstorganisierte Teams, transparente Boards, adaptive Planung – keine Vorgabe des Wegs durch Vorgesetzte.“ | niedrig |
| 37 | WISO-1-7-3-K1 | zu fein | Die Aussage ist nur die Katalogliste ohne prüfbare Unterscheidung. | Mit K6 (nutzen) oder K4 (bewerten) zusammenlegen: „… digitale Lernmedien wie Internet, Apps, Plattformen und Netzwerke für ein Lernziel nutzen …“ | niedrig |
| 38 | WISO-1-7-3-K5 | doppelt AP1 | „Datenschutz einhalten“ bei mobilen Endgeräten überschneidet sich mit AP1-7-4-3 (sicher mobil arbeiten). Neu ist nur das Lernen: Ablenkung, Lernzeiten, betriebliche Regeln. | `baut_auf: AP1-7-4-3` und K5 auf das Neue kürzen: „… beim Lernen mit mobilen Endgeräten Ablenkung vermeiden und betriebliche Nutzungsregeln einhalten.“ | niedrig |
| 39 | WISO-1-8-1-K1 | K1 fehlt | 2023S-WISO-A4: Option [2] („bricht Ausbildung ab, beginnt Ausbildung zum Tischler“) führt auch „in einen anderen anerkannten Beruf“, ist aber keine Umschulung. K1 kann sie nicht ausschließen. 2025W-WISO-A12 [2] (überbetrieblicher Lehrgang **während** der Ausbildung), [3] Segelkurs und [4] Studium werden nicht abgegrenzt. | „Du kannst an einem Beispiel Fortbildung, Umschulung und andere Bildungsmaßnahmen unterscheiden: Die Umschulung befähigt jemanden, der schon einen Beruf erlernt oder ausgeübt hat, zu einem anderen Beruf (zum Beispiel nach einer Allergie); wer eine laufende Ausbildung abbricht und eine neue beginnt oder den Betrieb wechselt, wird nicht umgeschult. Die Fortbildung baut nach abgeschlossener Ausbildung auf dem Beruf auf; Lehrgänge während der Ausbildung, auch überbetriebliche, gehören zur Ausbildung, private Freizeitkurse nicht zur beruflichen Fortbildung.“ | hoch |
| 40 | WISO-1-8-1-K6 | flacher | Stufe 4 („begründen“) über P-NÄCHSTE-STUFE, ohne belegtes Verfahren. Der Katalog WISO.01.10 hat keinen Operator, also Stufe 2. | Stufe 2: „Du kannst erklären, warum lebensbegleitendes Lernen in IT-Berufen nötig ist: kurze Innovationszyklen, neue Werkzeuge und Sicherheitsanforderungen.“ | mittel |
| 41 | WISO-1-8-1-K3 | zu grob | Zwei Dinge in einer Aussage: Lernorte der Fortbildung (innerbetrieblich, überbetrieblich, extern) und Regelungen (Freistellung, Kostenübernahme). Ein übliches Beispiel für eine Regelung fehlt. | Teilen. (a) Lernorte; (b) „Regelungen zur Weiterbildung nennen: Freistellung und Kostenübernahme nach Betriebsvereinbarung, Tarif- oder Arbeitsvertrag, Bildungsurlaub nach den Gesetzen der meisten Bundesländer.“ | niedrig |
| 42 | WISO-1-8-3-K2 / -K3 | doppelt WiSo | K2 (Ausbildung im Ausland, EU-Förderprogramme) und K3 (Erasmus+ fördert Auslandsaufenthalte) sagen im Kern dasselbe. Es fehlt die dauerhafte, prüfbare Regel aus § 2 Abs. 3 BBiG. | Zusammenlegen: „Du kannst erklären, dass bis zu einem Viertel der Ausbildungsdauer im Ausland stattfinden kann und Mobilitätsprogramme wie Erasmus+ der EU solche Aufenthalte in Ausbildung, Studium und Weiterbildung fördern.“ | mittel |
| 43 | WISO-1-8-3-K1 | K1 fehlt | 2022S-WISO-A16: Die falschen Optionen [3] „Europass-Mobilität **beglaubigt** Ausbildungsabschnitte“ und [5] „**zertifiziert** Fremdsprachenkenntnisse“ klingen nach echten Europass-Dokumenten. K1 grenzt nur Reisepass, Kosten und Pflicht ab. | K1 ergänzen: „… der Europass-Mobilität dokumentiert einen Auslandsaufenthalt, beglaubigt aber nichts und ist keine Pflicht; Sprachkenntnisse werden selbst eingeschätzt, nicht zertifiziert.“ | mittel |
| 44 | WISO-1-8-4-K6 | falsch | „nicht aber **Steuersätze**, die bundesweit gleich sind wie die Umsatzsteuer“ verallgemeinert falsch. Der **Gewerbesteuer-Hebesatz** ist von Gemeinde zu Gemeinde verschieden und ein klassischer Standortfaktor. Nur die Umsatzsteuer (2023S-A14 [2]) spielt keine Rolle. | „Du kannst Standortfaktoren für eine Gründung unterscheiden: Konkurrenz, Kundennähe und Verkehrsanbindung, Miete, behördliche Auflagen und der Gewerbesteuer-Hebesatz der Gemeinde – nicht aber der Umsatzsteuersatz, der bundesweit gleich ist.“ | hoch |
| 45 | WISO-1-8-4-K1 | flacher / K2 Herkunft | Stufe 4 („abwägen“) über P-NÄCHSTE-STUFE ohne belegtes Verfahren. Der Katalog WISO.01.14.12 hat keinen Operator, also Stufe 2, und der Beleg ist eine Auswahlaufgabe. Die Aussage deckt die Distraktoren 1, 4 und 5 von 2022W-WISO-A23 ab, nennt den Beleg aber nicht. | Stufe 2: „Du kannst Chancen und Risiken einer Existenzgründung unterscheiden: …“; Herkunft `beleg:2022W-WISO-A23` statt `regel:P-NAECHSTE-STUFE`. | mittel |
| 46 | WISO-1-8-4-K3 | K1 fehlt | 2023W-A22 und 2024S-A19 haben die Distraktoren [3] „nur bei Kapitalgesellschaften“ und [4] „nur bei der Aufnahme von Darlehen“. K3 nennt als Zweck nur, Kapitalgeber zu überzeugen; das lenkt zu [4]. | K3 ergänzen: „… er ist für jede Gründung sinnvoll, unabhängig von Rechtsform und Kredit, und dient zuerst der eigenen Planung …“ | mittel |

**Ohne Befund geprüft (Auswahl):** Die Deckung WISO.01.12.6 → AP1-2-3-2 ist korrekt, mit `neu` in 1-7-2-K7 (Statistik,
Bezugsgrößen; 2022W-A22 damit lösbar). Die Deckung WISO.01.12.3 → AP1-1-2-1 stimmt für die Projektplanung; die
persönliche Arbeitsplanung trägt 1-7-2-K2. WISO.01.12.2 (Präsentation) steht zu Recht nicht in der Deckungstabelle,
weil die Moderation neu ist. Die Rechenaufgaben 2023S-A6, 2023W-A4 und 2025W-A25 sind mit 1-6-1-K7 und 1-6-3-K1/K3
lösbar (Sätze vorgegeben, B4). Sachlich richtig sind die Europäische Sozialcharta (Europarat, nicht EU), der
Pflegezuschlag ab 23, der paritätische Zusatzbeitrag zur Krankenversicherung und die Förderstellen aus 2022W-A15.
1-8-2 hat keinen Beleg; die Aussagen bleiben auf Katalogstufe 2 (E6), ohne Befund.

**Zählung:** 46 Funde (hoch 5, mittel 20, niedrig 21) bei 65 geprüften Aussagen und 43 gelesenen Teilaufgaben.
Nach Art: K1 fehlt 13, doppelt WiSo 7, unklar 5, K2 Herkunft 3, flacher 3, zur Kür 3, falsch 2, K2 Stufe 2,
zu fein 2, zu grob 2, streichen 1, Grenze 1, veraltet 1, doppelt AP1 1 (Mischarten nach der erstgenannten Art gezählt).

### Offene Fragen an den Projektinhaber

1. **Amtliche Lösung gegen Fachrecht (Nr. 2):** 2022S-WISO-A13 wertet „schließt günstigere Betriebsvereinbarungen
   nicht aus“ als richtig, § 77 Abs. 3 BetrVG sperrt aber Betriebsvereinbarungen über tarifübliche Entgelte. Gilt hier
   P35 Nr. 7 (Aussage fachlich richtig, `hinweis` auf die IHK-Lösung)? Ich schlage das vor.
2. **Reihenfolge der Tarifrunde (Nr. 1):** Die beiden amtlichen Lösungen 2021W-A7 und 2023W-A26 setzen die Schlichtung
   verschieden (ohne Streik bzw. nach dem Streik). Soll die Aussage den Ablauf von 2023W-A26 als IHK-Regel lehren, wenn
   es zum Streik kommt?
3. **P-NÄCHSTE-STUFE ohne Beleg (Nr. 29, 40, 45):** Darf die Regel eine Stufe-4-Aussage tragen, wenn der Stichpunkt
   keinen Prüfungsbeleg hat? Nach dem Wortlaut von 4.3 („Verfahren, das schon belegt ist“) nein.
4. **Lerntypen (Nr. 32):** Der Katalog verlangt die vier Lerntechniken (E6, bleibt). Soll ein fachlicher Hinweis zum
   Lerntypen-Modell in den Plan, oder gilt das als Lehrmeinung außerhalb des Prüfungsbereichs?

## Umsetzung (16.10.2026)

Eingebaut in `tools/umbau/gen-wiso/wiso_1.py` nach den Entscheidungen D1–D12 aus `WISO-pruefer-bilanz.md`.
`node tools/umbau/lernplan-pruefen.mjs WISO-1` meldet OK. Es bleiben drei Hinweise, die gewollt sind: 2025S-A9 und
2025W-A3 in WISO-1-1-1 (nichtige Vereinbarungen; die Zuordnung führt nur WISO.01.01.1.6/.9/.10), 2021W-A23 in WISO-1-3-1
(gelöst über AP1-3-4-1). Die Prüfungen für WISO-2 und WISO-3 laufen ebenfalls OK; die Verschiebeziele WISO-1-5-3-K5
(aus WISO-2-5-2-K5) und WISO-1-6-2-K6 (aus WISO-3-4-2-K5) bestehen.

### Teil a (WISO-1-1 bis WISO-1-4)

| Nr | Entscheidung | Was geändert / Grund |
|---|---|---|
| a1 | teilweise | Nach D1 auf Stufe 2 gehoben, weil die Belege Auswahlaufgaben sind: WISO-1-2-3-K1, WISO-1-3-5-K3, WISO-1-4-1-K3 und WISO-1-4-1-K5 (jetzt „unterscheiden“, mit den Distraktoren). WISO-1-3-2-K4 und WISO-1-4-3-K5 entfallen (siehe a17, a18). Neun Aussagen bleiben auf Stufe 1, weil sie keinen Auswahlbeleg haben und ihr Baustein Stufe 2 anderswo erreicht (D1, T8): WISO-1-1-4-K2, WISO-1-3-1-K3, WISO-1-3-4-K1/K3/K4/K5 und WISO-1-3-5-K5/K6. Dazu kommt WISO-1-3-5-K1 mit Eintrag-Belegen (Z3b: Stufe 1). |
| a2 | umgesetzt | WISO-1-3-1-K5 jetzt Stufe 2 mit „erklären“. Hier wohnt das Günstigkeitsprinzip (D3). WISO.01.05.1 erreicht Stufe 3 weiter über WISO-1-3-3-K1. |
| a3 | umgesetzt | WISO-1-3-3-K6: Klagen kann der Arbeitnehmer. Neu steht dort, dass ein Widerspruch des Betriebsrats die Kündigung nicht verhindert. |
| a4 | umgesetzt | Nach D6 ist WISO-1-4-3-K1 „verschoben“ nach WISO-1-3-2-K1. 2025S-A11 und 2025W-A8 sind aus den Teilaufgaben von WISO-1-4-3 entfernt; der Hinweis verweist auf WISO-1-3-2. |
| a5 | teilweise | WISO-1-3-2-K5 ist auf die reine Zuordnung Gesetz → Thema gekürzt (ohne 24 Werktage und acht Stunden). Stehen bleibt „Elternzeit bis zu drei Jahren“: Nur daran lässt sich 2021W-A18 a („36 Monate“) von e unterscheiden. WISO-1-3-5-K6 bleibt, weil WISO-1-3-5 laut Titel der Wohnort für den Schutz Schwerbehinderter ist. WISO-1-3-3-K2 nennt die Gruppen nur für 2023W-A17 und 2024S-A23. |
| a6 | umgesetzt | Nach D6 nennt WISO-1-3-2-K2 Berufsbildungs- und Betriebsverfassungsgesetz; Arbeitsschutzgesetz und Arbeitsstättenverordnung stehen nur noch zur Abgrenzung da, der Hinweis verweist auf WISO-3-1-1. Die Bausteine WISO.01.05.2.2 und .2.7 bleiben in WISO-1-3-2: WISO-3-1-1 führt sie nicht, ohne sie wären sie unabgedeckt (T1). |
| a7 | umgesetzt | WISO-1-4-2-K3 (Tarifvorrang) ist in K1 aufgegangen, K3 „verschoben“ nach K1. |
| a8 | umgesetzt | Nach D3 steht die IHK-Lösung 2022S-A13 im Hinweis an WISO-1-4-2 (P35 Nr. 7). Die Aussage ist fachlich richtig nach § 77 Abs. 3 BetrVG. |
| a9 | umgesetzt | WISO-1-1-3-K2: Es gibt keine Übernahmepflicht (Belege 2025S-A9, 2025W-A3 ergänzt). WISO-1-4-3-K4: Mitglieder der JAV werden nicht automatisch übernommen, können die Übernahme aber verlangen (§ 78a BetrVG, 2022W-A14). |
| a10 | umgesetzt | WISO-1-4-1-K3 grenzt jetzt unternehmerische Entscheidungen ab (Filiale, Rechtsform, leitende Angestellte, Umbau, Umweltschutz) und sagt, dass der Betriebsrat keine Rechtsgeschäfte abschließt. WISO-1-4-1-K5: Es gibt keine Pflicht, einen Betriebsrat zu wählen; das Geschlecht in der Minderheit ist nach seinem Anteil vertreten, eine Hälfte-Hälfte-Pflicht gibt es nicht. |
| a11 | umgesetzt | WISO-1-3-3-K4: Ein einmaliges leichteres Fehlverhalten (ein Tag unentschuldigt gefehlt) rechtfertigt keine fristlose Kündigung; zuerst kommt in der Regel eine Abmahnung. |
| a12 | umgesetzt | WISO-1-3-5-K2: Beim Beschäftigungsverbot gibt es den bisherigen Durchschnittsverdienst, Mutterschaftsgeld nur in den Schutzfristen. WISO-1-3-5-K4: Das AGG gilt auch für Auszubildende, für Arbeitsbedingungen und Aufstieg; Betroffene haben Anspruch auf Entschädigung oder Schadensersatz. |
| a13 | umgesetzt (mit Abweichung) | WISO-1-4-3-K3 nennt jetzt die Mindestzahl fünf, die Amtszeit und als Wählbarkeitsgrenze, dass das 25. Lebensjahr noch nicht vollendet ist (D12). Abweichung vom Vorschlag: Seit dem Betriebsrätemodernisierungsgesetz (18.6.2021) gilt für Auszubildende keine Altersgrenze mehr, weder beim Wählen noch bei der Wählbarkeit (§§ 60, 61 BetrVG). Die Aussage lautet deshalb „Auszubildende“ ohne „unter 25“. Der Hinweis nennt die IHK-Lösung 2022W-A14, nach der „Auszubildende bis 27 dürfen wählen“ falsch ist (P35 Nr. 7). |
| a14 | umgesetzt | WISO-1-1-4-K4: Gilt ein Tarifvertrag, ist dessen Vergütung maßgeblich; ohne Tarifbindung gilt mindestens die Mindestvergütung. Keine Beträge (B4). |
| a15 | teilweise | WISO-1-1-1-K3: Die Vertragsniederschrift ist schriftlich oder in Textform möglich (BVaDiG, D12). Nicht übernommen: das elektronische Ausbildungszeugnis (nicht belegt, Rechtslage nicht sicher geprüft). Die Kündigung in WISO-1-1-2-K5 bleibt unverändert „schriftlich“. |
| a16 | umgesetzt | WISO-1-2-1-K3: Die Berufsschulpflicht ist Landesrecht; Ältere sind teils nur berufsschulberechtigt. Die Freistellung gilt für alle Auszubildenden. |
| a17 | umgesetzt | WISO-1-3-2-K4 ist „gestrichen“ (Lesehilfe); der Inhalt steht jetzt im Hinweis von WISO-1-3-2. |
| a18 | umgesetzt | WISO-1-4-3-K5 ist „verschoben“ nach K3, WISO-1-1-1-K5 „verschoben“ nach K4. |
| a19 | abgelehnt | D7: WISO-1-3-5 bleibt ein Stichpunkt (7 Aussagen, F3 erfüllt). |
| a20 | umgesetzt | WISO-1-3-1-K2 nennt jetzt Betriebsvereinbarung und Überstundenregelung als Kollektivarbeitsrecht. Der Hinweis gibt die IHK-Wertung aus 2022W-A7 und die abweichende Lehrmeinung an. |
| a21 | umgesetzt | Nach D6 steht die Anhörung nur noch in WISO-1-4-1-K4 (unwirksam ohne Anhörung, nachträgliche Anhörung heilt nicht, eine Zustimmung ist nicht nötig). WISO-1-3-3 verweist im Hinweis darauf. |
| a22 | umgesetzt | Durch die Kürzung aus a5 erledigt. |
| a23 | umgesetzt | „Ausbildungsplan wird Teil des Vertrags“ und der Beleg 2025S-A10 stehen nur noch in WISO-1-1-1-K2. WISO-1-2-2 hat jetzt einen Hinweis. |
| a24 | umgesetzt | Die Freistellung ist aus WISO-1-1-4-K1 gestrichen; ihr Wohnort ist WISO-1-2-1-K3. |
| a25 | umgesetzt | WISO-1-4-1-K6 ist auf die Rechnung mit abgedrucktem §§ 7/9 gekürzt; Auszubildende und befristet Beschäftigte zählen mit. |
| a26 | umgesetzt | Nach D3 wohnt das Günstigkeitsprinzip in WISO-1-3-1-K5; WISO-1-5-1-K4 verweist nur noch im Hinweis darauf. |
| a27 | umgesetzt | WISO-1-2-3-K3 nennt Berufsgenossenschaft, Gewerbeaufsicht, Berufsberatung und Gesundheitsamt nur als Abgrenzung; der Hinweis verweist auf WISO-3-1-1 (D6). |
| a28 | teilweise | Beide Aussagen bleiben, weil zwei Gesetze (BBiG und GewO) und verschiedene Belege dahinterstehen. WISO-1-3-6 verweist im Hinweis auf WISO-1-1-3. |
| a29 | abgelehnt | Zusatzbausteine sind nach Z1 abdeckungspflichtig wie Katalogbausteine und werden in allen Räumen als `katalog:ZB.…` geführt (AP1, PB1, PB2, WISO). T3 erkennt sie an. |
| a30 | umgesetzt | WISO-1-4-1-K5: „mindestens fünf ständige wahlberechtigte Arbeitnehmer, von denen drei wählbar sind“. |
| a31 | umgesetzt | Hinweis an WISO-1-3-4: Stand Oktober 2026 gilt die tägliche Höchstarbeitszeit, eine Reform ist geplant (unsicher, siehe unten). |
| a32 | umgesetzt | WISO-1-3-6-K5: Übertragung nur aus dringenden Gründen bis Ende März; verfallen kann der Urlaub nur nach einem Hinweis des Arbeitgebers. |
| a33 | abgelehnt | Kür ohne Hinweisquelle (D11): P49 (Kür, keine Hinweisquelle). |
| a34 | umgesetzt | WISO-1-3-4-K2 nennt jetzt die erste Nachuntersuchung nach einem Jahr und das Feiertagsverbot mit Ausnahmen. |
| a35 | kein Fund | – |

### Teil b (WISO-1-5 bis WISO-1-8)

| Nr | Entscheidung | Was geändert / Grund |
|---|---|---|
| b1 | umgesetzt | Nach D4 lehrt WISO-1-5-2-K3 die Reihenfolge der IHK: Scheitern → (Urabstimmung/Streik) → Schlichtung. Die „neue Verhandlung“ ist gestrichen. Der Hinweis nennt 2021W-A7 und 2023W-A26. |
| b2 | umgesetzt | Nach D3 lautet WISO-1-5-1-K4 nicht mehr „günstigere Betriebsvereinbarung möglich“. Der Hinweis nennt die IHK-Lösung 2022S-A13 und verweist auf WISO-1-4-2. |
| b3 | umgesetzt | WISO-1-5-1-K4: Der Tarifvertrag darf auch auf Nichtmitglieder angewendet werden; er setzt Mindestbedingungen, keine Höchstgrenzen. |
| b4 | umgesetzt | Neue WISO-1-5-1-K7 zur Laufzeit: frei vereinbart, keine gesetzliche Höchstdauer, Nachwirkung (Beleg 2022S-A13). |
| b5 | umgesetzt | WISO-1-5-1-K1 jetzt Stufe 2 mit „unterscheiden“ (D1) und den Distraktoren. |
| b6 | umgesetzt | Siehe b2: Das Günstigkeitsprinzip steht nur noch im Hinweis (Wohnort WISO-1-3-1-K5). |
| b7 | umgesetzt | WISO-1-5-1-K2 ordnet Ecklohn und Ausbildungsvergütung dem Lohn- und Gehaltstarif zu. Der Hinweis erklärt den Entgeltrahmentarif gegenüber der IHK-Lösung 2022S-A14. |
| b8 | umgesetzt | WISO-1-5-1-K3: „im Rahmen der Gesetze“; der Staat schreibt keine Inhalte vor und genehmigt Tarifverträge nicht. |
| b9 | umgesetzt | WISO-1-5-2-K2: Streik erst nach Ende der Friedenspflicht; die Urabstimmung folgt aus der Gewerkschaftssatzung. |
| b10 | umgesetzt | WISO-1-5-2-K4 ist in K3 aufgegangen (K4 „verschoben“). |
| b11 | umgesetzt | WISO-1-5-2-K5: Der unbefristete Streik ist das letzte Mittel und begleitet Verhandlungen nicht immer (Belege 2025S-A17, 2025W-A14). |
| b12 | umgesetzt | Nach D6 nennt WISO-1-5-3-K4 Handwerkskammer und IHK als Körperschaften des öffentlichen Rechts mit Pflichtmitgliedschaft, keine Vereine (Beleg 2022W-A17). Baustein WISO.02.07.2 mit Anteil, Gebiet G.WISO.02 ergänzt. |
| b13 | teilweise | WISO-1-Seite umgesetzt: Nach D6 wohnen Kammern und Wirtschaftsverbände in WISO-1-5-3. K5 nimmt den Inhalt von WISO-2-5-2-K5 auf (Verschiebeziel) und grenzt Kammern, Wirtschaftsverbände und Arbeitgeberverbände voneinander ab; der Hinweis ist angepasst. Die Kürzung in WISO-2-5-2 übernimmt WISO-2. |
| b14 | teilweise | WISO-1-5-3-K3: Ausbildung nur noch kurz („Aufgaben in der Aus- und Weiterbildung“, die richtige Antwort in 2022W-A17), Wohnort ist WISO-1-2-3. Die Abgrenzungen bleiben. Das Handelsregister bleibt als Distraktor von 2023S-A16. |
| b15 | umgesetzt | Nicht als Kür: Der DGB ist Distraktor in zwei Belegen (D11: was für einen Distraktor nötig ist, gehört in die Aussage). Ergänzt in WISO-1-5-3-K1 und WISO-1-5-2-K2. |
| b16 | umgesetzt | WISO-1-6-1-K1: Solidaritätszuschlag nur bei höheren Einkommen (D12). |
| b17 | umgesetzt | WISO-1-6-1-K4 schließt Sparlose, Unfall- und Sterbegeldversicherung aus; die Sparzulage gibt es nur unterhalb von Einkommensgrenzen. Aktien sind nicht pauschal ausgeschlossen. |
| b18 | umgesetzt | 2023W-A3 ist aus WISO-1-6-1 entfernt und steht in WISO-1-3-6-K1; WISO-1-6-1 verweist im Hinweis darauf. |
| b19 | umgesetzt | WISO-1-6-1-K5 hat die Herkunft `katalog:WISO.01.09`; der Baustein ist ergänzt. |
| b20 | abgelehnt | Kür ohne Hinweisquelle (Steuerklasse VI, nicht belegt): P49 (Kür, keine Hinweisquelle). |
| b21 | umgesetzt | WISO-1-6-2-K4: Über der Bemessungsgrenze bleibt man versichert; keine Versicherungspflichtgrenze in der Renten- und Arbeitslosenversicherung; Arbeitgeberzuschuss bei freiwilliger Versicherung. |
| b22 | umgesetzt | Aufgeteilt in K4 (Bemessungs- und Versicherungspflichtgrenze), K7 (Generationenvertrag und private Vorsorge) und neu K8 (Arbeitslosengeld). Damit F3 gilt (höchstens 7), ist K5 (Träger) in K1 aufgegangen (K5 „verschoben“). |
| b23 | umgesetzt | Neue WISO-1-6-2-K8: Arbeitslosengeld als Versicherungsleistung ohne Bedürftigkeitsprüfung, Anwartschaft, Bemessung (2022W-A19). |
| b24 | umgesetzt | Neue WISO-1-6-2-K9: Leistungen der Kranken- und Pflegeversicherung, versicherte Gruppen (2022W-A20). Dass die Träger selbstverwaltete Körperschaften und keine Behörden sind, steht in K1. |
| b25 | umgesetzt | WISO-1-6-2-K6: Minijob fachlich genau (Pauschalbeiträge, Eigenanteil zur Rentenversicherung mit Befreiung). Der Hinweis nennt die IHK-Lösung 2022W-A16. |
| b26 | abgelehnt | Nach D6 wohnen Träger und Beitrag der Unfallversicherung in WISO-1-6-2 (K1, K6). Die Berufsgenossenschaften bleiben; K6 ist Verschiebeziel von WISO-3-4-2-K5. Der Hinweis ist angepasst: Versicherte, Fälle und Leistungen stehen in WISO-3-1-3. |
| b27 | abgelehnt | Kür ohne Hinweisquelle (Kinderabschlag Pflege): P49 (Kür, keine Hinweisquelle). |
| b28 | umgesetzt | WISO-1-6-3-K4 und K5 haben zusätzlich die Herkunft `regel:P-NAECHSTE-STUFE` (Weiterführung der belegten Beitragsrechnung). |
| b29 | umgesetzt | Nach D2 ist WISO-1-7-1-K3 „gestrichen“. |
| b30 | teilweise | K1 nicht gestrichen, weil WISO-1-7-1 sonst nur zwei Aussagen hätte (F3). Stattdessen ist K1 auf das Unterscheidungsmerkmal geschärft (Sehen, Hören, Sprechen, Handeln). |
| b31 | umgesetzt | WISO-1-7-1-K2 enthält die Katalogbeispiele vollständig (Videos, Gruppenaktivitäten, Lerngruppen bei auditiv und kommunikativ). |
| b32 | umgesetzt | Hinweis an WISO-1-7-1: Die Techniken sind Zugänge zum Stoff, keine Lerntypen. Damit ist auch die offene Frage 4 aus Teil b beantwortet. |
| b33 | umgesetzt | WISO-1-7-2-K3 „gestrichen“. |
| b34 | umgesetzt | WISO-1-7-2-K1 ist in K2 aufgegangen (K1 „verschoben“). |
| b35 | umgesetzt | WISO-1-7-2-K2 jetzt Stufe 2 mit „erklären“ (D1: Katalog ohne Operator, kein Beleg). |
| b36 | umgesetzt | Neue WISO-1-7-2-K8 (Merkmale agiler Arbeit, Beleg 2022W-A29) mit `neu` gegenüber PB1-1-1-1 und PB1-1-1-3. `baut_auf` ist um PB1-1-1-3 ergänzt. AP2b.04.02.2 und AP1.01.01.3 stehen mit Anteil in den Bausteinen (T7 erfüllt), damit entfallen die beiden Hinweise zu 2022W-A29 und A30. |
| b37 | umgesetzt | WISO-1-7-3-K1 ist in K6 (nutzen) aufgegangen (K1 „verschoben“). |
| b38 | umgesetzt | WISO-1-7-3 hat jetzt `baut_auf: AP1-7-4-3` und einen Hinweis; K5 ist auf das Lernen gekürzt (Datenschutz gestrichen). |
| b39 | umgesetzt | WISO-1-8-1-K1 grenzt Umschulung von Ausbildungswechsel und Betriebswechsel ab, Fortbildung von Lehrgang in der Ausbildung, Schule, Studium und Freizeitkurs. |
| b40 | umgesetzt | Nach D2 ist WISO-1-8-1-K6 jetzt Stufe 2 mit „erklären“ und Gründen, ohne P-NÄCHSTE-STUFE. |
| b41 | umgesetzt | WISO-1-8-1-K3 behält nur die Lernorte; die neue K7 enthält die Regelungen (Betriebsvereinbarung, Tarif- und Arbeitsvertrag, Bildungsurlaub). |
| b42 | umgesetzt | WISO-1-8-3-K3 ist in K2 aufgegangen (K3 „verschoben“); ergänzt ist die Regel „bis zu einem Viertel der Ausbildungsdauer“ (§ 2 Abs. 3 BBiG). |
| b43 | umgesetzt | WISO-1-8-3-K1: Der Europass-Mobilität dokumentiert, beglaubigt aber nicht; Sprachkenntnisse werden selbst eingeschätzt. |
| b44 | umgesetzt | WISO-1-8-4-K6: Der Gewerbesteuer-Hebesatz ist ein Standortfaktor, der Umsatzsteuersatz nicht (D12). |
| b45 | umgesetzt | Nach D2 ist WISO-1-8-4-K1 jetzt Stufe 2 mit „unterscheiden“ und Herkunft `beleg:2022W-A23` statt P-NÄCHSTE-STUFE. |
| b46 | umgesetzt | WISO-1-8-4-K3: Der Businessplan ist für jede Gründung sinnvoll, unabhängig von Rechtsform und Kredit, und dient zuerst der eigenen Planung. |

### Zahlen

- Entscheidungen: Teil a 27 umgesetzt, 4 teilweise, 3 abgelehnt, 1 kein Fund; Teil b 40 umgesetzt, 3 teilweise,
  3 abgelehnt. Zusammen 67 umgesetzt, 7 teilweise, 6 abgelehnt (davon 3 als P49), 1 kein Fund, 0 Parkplatz.
- Stichpunkte: 29 → 29 (keine neuen, D7). Können-Aussagen: 150 → 143 (Aussagen auf Stufe 1: 15 → 9; Stufe 4 über
  P-NÄCHSTE-STUFE: 3 → 0).
- Neue Aussagen (IDs über jeder je vergebenen Nummer): WISO-1-5-1-K7, WISO-1-6-2-K8, WISO-1-6-2-K9, WISO-1-7-2-K8,
  WISO-1-8-1-K7.
- „Verschoben“ in WISO-1 neu: WISO-1-1-1-K5, WISO-1-4-2-K3, WISO-1-4-3-K1, WISO-1-4-3-K5, WISO-1-5-2-K4, WISO-1-6-2-K5,
  WISO-1-7-2-K1, WISO-1-7-3-K1, WISO-1-8-3-K3. „Gestrichen“ neu: WISO-1-3-2-K4, WISO-1-7-1-K3, WISO-1-7-2-K3.

### Parkplatz-Fragen

- **Rechtsänderung nach dem Prüfungstermin (a13):** 2022W-A14 wertet „Auszubildende bis 27 dürfen die JAV wählen“ als
  falsch. Nach dem Betriebsrätemodernisierungsgesetz (in Kraft seit 18.6.2021, also vor dem Prüfungstermin) ist die
  Aussage richtig. Umgesetzt wie P35 Nr. 7: Die Aussage ist fachlich richtig, der Hinweis nennt die IHK-Lösung. Vorschlag:
  P35 Nr. 7 ausdrücklich auch auf Lösungen anwenden, die durch eine Rechtsänderung falsch geworden sind. D12 („JAV unter
  25“) ist so umgesetzt, dass die Grenze „unter 25“ für Arbeitnehmer gilt, die keine Auszubildenden sind.
- **P49 (Kür, keine Hinweisquelle):** a33 (Schutzfrist bei Behinderung des Kindes, Fehlgeburt, Inklusionsamt), b20
  (Steuerklasse VI), b27 (Kinderabschlag in der Pflegeversicherung), dazu das elektronische Ausbildungszeugnis aus a15.

### Unsichere Stellen

- WISO-1-3-4 (Hinweis): Stand der Reform des Arbeitszeitgesetzes im Oktober 2026 nicht geprüft; der Hinweis ist
  vorsichtig gefasst.
- WISO-1-1-1-K3: Textform seit BVaDiG belegt (Info RP Gießen 11/2024). Ob eine Unterschrift entfallen kann, ist dort
  offen; die Aussage nennt deshalb nur „schriftlich oder in Textform … mit Empfangsnachweis“.
- WISO-1-2-1-K3: Die Altersgrenzen der Berufsschulpflicht unterscheiden sich je Land und sind bewusst nicht beziffert.
- WISO-1-8-1-K7: „Die meisten Bundesländer“ haben ein Bildungsurlaubsgesetz (ohne Bayern und Sachsen); Stand nicht
  einzeln geprüft.
- WISO-1-6-2-K8: Anwartschaft „zwölf Monate in 30 Monaten“ nach Stand SGB III seit 2020. WISO-1-6-2-K6: Eigenanteil des
  Minijobbers zur Rentenversicherung mit Befreiungsmöglichkeit.
