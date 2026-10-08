// WiSo-Probeprüfung 2 – Taunuscode Software GmbH & Co. KG (fiktiv). Format: ../../README.md
export default {
  id: 'wiso-02',
  teil: 'WISO',
  titel: 'Taunuscode Software GmbH & Co. KG',
  situation:
    'Sie werden bei der Taunuscode Software GmbH & Co. KG in Wiesbaden zur Fachinformatikerin bzw. zum Fachinformatiker für Anwendungsentwicklung ausgebildet. ' +
    'Das Softwarehaus entwickelt Praxissoftware für Arzt- und Therapiepraxen, Online-Dienste für Gemeindeverwaltungen und Individualsoftware für mittelständische Kunden. ' +
    'Taunuscode beschäftigt 35 Personen: 31 Arbeitnehmerinnen und Arbeitnehmer sowie vier Auszubildende. Das Unternehmen ist nicht tarifgebunden; im Betrieb gibt es einen dreiköpfigen Betriebsrat. ' +
    'Geschäftsführer der Komplementär-GmbH ist Henrik Albers.',
  bloecke: [
    {
      id: 's1',
      text:
        'Bei Taunuscode lernen unter anderem der 19-jährige Auszubildende Jonas Becker (drittes Ausbildungsjahr) und die Auszubildende Mia Kowalski, geboren am 12. Mai 2009 (erstes Ausbildungsjahr). ' +
        'Die regelmäßige tägliche Ausbildungszeit beträgt im Betrieb acht Stunden an fünf Tagen pro Woche. Die Berufsschule findet einmal pro Woche statt.',
    },
    {
      id: 's2',
      text:
        'Der Entwickler Tim Rauscher ist 28 Jahre alt, ledig und kinderlos. Er arbeitet seit vier Jahren in der Sparte Praxissoftware und erhält ein monatliches Bruttogehalt von 4.200,00 €. ' +
        'Er ist Mitglied der evangelischen Kirche und gesetzlich krankenversichert.',
    },
    {
      id: 's3',
      text:
        'Die Taunuscode Software GmbH & Co. KG ist im Handelsregister des Amtsgerichts Wiesbaden eingetragen. Persönlich haftende Gesellschafterin (Komplementärin) ist die Taunuscode Verwaltungs-GmbH mit einem Stammkapital von 25.000 €; ihr Geschäftsführer ist Henrik Albers. ' +
        'Kommanditisten sind Henrik Albers mit einer Einlage von 120.000 € und Dr. Sabine Wendt mit einer Einlage von 80.000 €; beide Einlagen sind voll eingezahlt. ' +
        'Die kaufmännische Leiterin Katrin Morawe hat Einzelprokura. Die KG ist Eigentümerin ihres Bürogebäudes in Wiesbaden.',
    },
  ],
  fragen: [
    // ---------- Ausbildung, Arbeits- und Tarifrecht, Mitbestimmung, Entgelt und Sozialversicherung ----------
    {
      id: 'wiso-02-01',
      sp: ['WISO-1-1-4'],
      art: 'einfach',
      situation: 's1',
      text:
        'Jonas Becker hat dienstags Berufsschule von 7:45 bis 13:00 Uhr mit sechs Unterrichtsstunden zu je 45 Minuten. Welche Aussage trifft nach dem Berufsbildungsgesetz zu?',
      optionen: [
        'Jonas muss nach dem Unterricht in den Betrieb kommen, weil die Freistellungsregeln für die Berufsschule nur für Jugendliche gelten.',
        'Der Dienstag wird mit der durchschnittlichen täglichen Ausbildungszeit von acht Stunden angerechnet; Jonas muss danach nicht mehr in den Betrieb.',
        'Angerechnet wird nur die reine Unterrichtszeit von 4,5 Stunden; die übrige Zeit bis acht Stunden muss Jonas im Betrieb nacharbeiten.',
        'Taunuscode darf Jonas vor dem Unterricht von 6:30 bis 7:15 Uhr im Betrieb beschäftigen, wenn er pünktlich zur Schule kommt.',
        'Die Berufsschulzeit wird nicht auf die Ausbildungszeit angerechnet; Jonas muss sie an den anderen Tagen der Woche ausgleichen.',
      ],
      richtig: [1],
      erklaerung:
        'Seit 2020 gelten die Regeln des § 15 BBiG für alle Auszubildenden, auch für volljährige. An einem Berufsschultag mit mehr als fünf Unterrichtsstunden von mindestens je 45 Minuten darf einmal pro Woche nicht mehr im Betrieb ausgebildet werden (§ 15 Abs. 1 Satz 2 Nr. 2 BBiG); dieser Tag wird mit der durchschnittlichen täglichen Ausbildungszeit angerechnet (§ 15 Abs. 2 Nr. 2 BBiG). ' +
        'Vor einem Unterricht, der vor 9 Uhr beginnt, ist eine Beschäftigung ebenfalls verboten (§ 15 Abs. 1 Satz 2 Nr. 1 BBiG). Nachgearbeitet werden muss nichts.',
    },
    {
      id: 'wiso-02-02',
      sp: ['WISO-1-3-4'],
      art: 'einfach',
      situation: 's1',
      text:
        'Mia Kowalskis Ausbildungsvertrag sieht den gesetzlichen Mindesturlaub vor. Wie viele Werktage Urlaub stehen ihr für das Kalenderjahr 2026 nach dem Jugendarbeitsschutzgesetz mindestens zu?',
      optionen: ['20 Werktage', '24 Werktage', '25 Werktage', '27 Werktage', '30 Werktage'],
      richtig: [3],
      erklaerung:
        'Maßgeblich ist das Alter zu Beginn des Kalenderjahres (§ 19 Abs. 2 JArbSchG). Am 1. Januar 2026 ist Mia 16 Jahre alt, also noch nicht 17: Ihr stehen mindestens 27 Werktage zu. ' +
        '30 Werktage gelten für Jugendliche unter 16, 25 Werktage für Jugendliche unter 18 Jahren. 24 Werktage ist der Mindesturlaub für Erwachsene nach § 3 BUrlG (entspricht 20 Arbeitstagen bei einer Fünftagewoche). Der Urlaub soll in den Berufsschulferien gewährt werden (§ 19 Abs. 3 JArbSchG).',
    },
    {
      id: 'wiso-02-03',
      sp: ['WISO-1-1-3'],
      art: 'einfach',
      situation: 's1',
      text: 'Jonas Becker beendet im Sommer 2027 seine Ausbildung. Welche Aussage zum Ausbildungszeugnis trifft zu?',
      optionen: [
        'Das Ausbildungszeugnis stellt die IHK zusammen mit dem Prüfungszeugnis aus; Taunuscode muss selbst kein Zeugnis ausstellen.',
        'Taunuscode muss ein Ausbildungszeugnis nur ausstellen, wenn Jonas die Abschlussprüfung bestanden hat.',
        'Taunuscode muss ein Zeugnis über Art, Dauer und Ziel der Ausbildung und die erworbenen Kenntnisse ausstellen; Verhalten und Leistung kommen auf Verlangen hinzu.',
        'Das Zeugnis muss immer Angaben zu Verhalten und Leistung enthalten, auch wenn Jonas das ausdrücklich nicht möchte.',
        'Jonas erhält nur dann ein Ausbildungszeugnis, wenn er nach der Ausbildung nicht von Taunuscode übernommen wird.',
      ],
      richtig: [2],
      erklaerung:
        'Nach § 16 BBiG muss der Ausbildende bei Beendigung der Ausbildung immer ein Zeugnis ausstellen – unabhängig vom Prüfungsergebnis und von einer Übernahme. Es enthält Art, Dauer und Ziel der Ausbildung sowie die erworbenen beruflichen Fertigkeiten, Kenntnisse und Fähigkeiten (einfaches Zeugnis). ' +
        'Angaben über Verhalten und Leistung sind nur auf Verlangen des Auszubildenden aufzunehmen (qualifiziertes Zeugnis, § 16 Abs. 2 BBiG). Die IHK stellt nur das Prüfungszeugnis aus (§ 37 BBiG).',
    },
    {
      id: 'wiso-02-04',
      sp: ['WISO-1-6-1', 'WISO-1-3-2'],
      art: 'einfach',
      text:
        'Der gesetzliche Mindestlohn beträgt 2026 brutto 13,90 € je Zeitstunde. Für welche der folgenden Personen muss Taunuscode den gesetzlichen Mindestlohn zahlen?',
      optionen: [
        'für die Auszubildende Mia Kowalski',
        'für einen Studenten, der ein in seiner Studienordnung vorgeschriebenes Pflichtpraktikum absolviert',
        'für eine 17-jährige Schülerin ohne abgeschlossene Berufsausbildung, die in den Ferien als Aushilfe Daten erfasst',
        'für eine 52-jährige geringfügig Beschäftigte (Minijob), die die Buchhaltung unterstützt',
        'für einen Schüler, der ein zweiwöchiges, von der Schule vorgeschriebenes Betriebspraktikum absolviert',
      ],
      richtig: [3],
      erklaerung:
        'Der Mindestlohn gilt für alle Arbeitnehmerinnen und Arbeitnehmer, auch für Minijobber (§ 1, § 22 Abs. 1 MiLoG). Ausgenommen sind u. a. Auszubildende (§ 22 Abs. 3 MiLoG; für sie gilt die Mindestausbildungsvergütung nach § 17 BBiG), ' +
        'Pflichtpraktika aufgrund einer schul- oder hochschulrechtlichen Bestimmung (§ 22 Abs. 1 Satz 2 Nr. 1 MiLoG) sowie Jugendliche unter 18 Jahren ohne abgeschlossene Berufsausbildung (§ 22 Abs. 2 MiLoG).',
    },
    {
      id: 'wiso-02-05',
      sp: ['WISO-1-3-4'],
      art: 'mehrfach',
      text:
        'Vor der Auslieferung einer neuen Version der Praxissoftware arbeitet das Entwicklungsteam mehrere Tage länger. Welche **zwei** Aussagen treffen nach dem Arbeitszeitgesetz für die erwachsenen Beschäftigten zu?',
      optionen: [
        'Bei einer Arbeitszeit von zehn Stunden genügt eine Ruhepause von insgesamt 30 Minuten.',
        'Länger als sechs Stunden hintereinander dürfen Beschäftigte nicht ohne Ruhepause arbeiten.',
        'Für Beschäftigte, die mobil von zu Hause aus arbeiten, gilt das Arbeitszeitgesetz nicht.',
        'Kurze Unterbrechungen von je fünf Minuten werden auf die vorgeschriebene Ruhepause angerechnet.',
        'Nach Ende der täglichen Arbeitszeit ist eine ununterbrochene Ruhezeit von mindestens elf Stunden einzuhalten.',
        'Überstunden müssen nach dem Arbeitszeitgesetz immer mit einem Zuschlag von 25 % vergütet werden.',
      ],
      richtig: [1, 4],
      erklaerung:
        'Nach § 4 ArbZG dürfen Beschäftigte nicht länger als sechs Stunden hintereinander ohne Ruhepause arbeiten; bei mehr als sechs bis neun Stunden sind mindestens 30, bei mehr als neun Stunden mindestens 45 Minuten Pause vorgeschrieben. Pausen zählen nur in Abschnitten von mindestens 15 Minuten. ' +
        'Nach § 5 Abs. 1 ArbZG ist nach Arbeitsende eine ununterbrochene Ruhezeit von mindestens elf Stunden einzuhalten. Das Gesetz gilt für alle Arbeitnehmer, auch im Homeoffice (§ 2 ArbZG). Einen gesetzlichen Überstundenzuschlag gibt es nicht; er kann im Arbeits- oder Tarifvertrag vereinbart werden.',
    },
    {
      id: 'wiso-02-06',
      sp: ['WISO-1-3-1'],
      art: 'zahl',
      text:
        'Die Entwicklerin Lena Hartmann beginnt am 1. August 2026 bei Taunuscode. Sie arbeitet an fünf Tagen pro Woche. Ihr Arbeitsvertrag sieht 24 Arbeitstage Urlaub im Kalenderjahr vor; für Teilurlaub gelten die Regeln des Bundesurlaubsgesetzes. ' +
        'Berechnen Sie, wie viele Urlaubstage Frau Hartmann für das Jahr 2026 zustehen.',
      richtig: 10,
      stellen: 0,
      einheit: 'Tage',
      erklaerung:
        'Den vollen Urlaubsanspruch erwirbt man erst nach sechs Monaten Wartezeit (§ 4 BUrlG). Diese ist 2026 nicht erfüllt (sie endet am 31. Januar 2027). Deshalb gibt es Teilurlaub: ein Zwölftel des Jahresurlaubs je vollem Beschäftigungsmonat (§ 5 Abs. 1 Buchst. a BUrlG). ' +
        'August bis Dezember = 5 volle Monate; 24 Tage × 5 / 12 = 10 Tage.',
    },
    {
      id: 'wiso-02-07',
      sp: ['WISO-1-3-1'],
      art: 'einfach',
      text:
        'Taunuscode möchte den Softwaretester Ali Demir, der noch nie bei Taunuscode beschäftigt war, ohne sachlichen Grund befristet einstellen. Welche Aussage trifft nach dem Teilzeit- und Befristungsgesetz zu?',
      optionen: [
        'Die Befristung ist ohne Sachgrund bis zu fünf Jahren zulässig, wenn Herr Demir der Befristung zustimmt.',
        'Eine mündliche Absprache über die Befristung genügt, wenn der Vertrag einige Wochen nach Arbeitsbeginn schriftlich bestätigt wird.',
        'Ein befristeter Vertrag kann nie ordentlich gekündigt werden, auch wenn dies im Arbeitsvertrag ausdrücklich vereinbart ist.',
        'Die Befristung ist ohne Sachgrund bis zu zwei Jahren zulässig; in dieser Zeit darf der Vertrag höchstens dreimal verlängert werden.',
        'Nach Ablauf der Befristung hat Herr Demir automatisch einen Anspruch auf einen unbefristeten Arbeitsvertrag.',
      ],
      richtig: [3],
      erklaerung:
        'Nach § 14 Abs. 2 TzBfG ist eine sachgrundlose Befristung bis zu zwei Jahren zulässig; bis zu dieser Gesamtdauer darf der Vertrag höchstens dreimal verlängert werden. Das gilt nicht, wenn mit demselben Arbeitgeber schon ein Arbeitsverhältnis bestanden hat. ' +
        'Die Befristung muss vor Arbeitsbeginn schriftlich vereinbart werden (§ 14 Abs. 4 TzBfG); sonst gilt der Vertrag als unbefristet (§ 16 TzBfG). Eine ordentliche Kündigung ist möglich, wenn sie vereinbart ist (§ 15 TzBfG). Einen Anspruch auf Übernahme gibt es nicht; das Arbeitsverhältnis endet mit Fristablauf.',
    },
    {
      id: 'wiso-02-08',
      sp: ['WISO-1-3-1'],
      art: 'einfach',
      text:
        'Die Entwicklerin Nora Lindner ist seit drei Jahren in Vollzeit bei Taunuscode beschäftigt. Sie möchte ihre Arbeitszeit ab dem 1. März 2027 dauerhaft auf 30 Wochenstunden verringern. Welche Aussage trifft zu?',
      optionen: [
        'Frau Lindner kann die Verringerung verlangen; sie muss ihren Wunsch spätestens drei Monate vor dem gewünschten Beginn in Textform geltend machen.',
        'Frau Lindner hat keinen Anspruch, weil ein Anspruch auf Teilzeit erst in Unternehmen mit mehr als 45 Arbeitnehmern besteht.',
        'Taunuscode muss jedem Teilzeitwunsch zustimmen; betriebliche Gründe dürfen dem Wunsch nicht entgegengehalten werden.',
        'Frau Lindner kann auch verlangen, die Arbeitszeit nur für zwei Jahre zu verringern und danach zur Vollzeit zurückzukehren.',
        'Eine Verringerung der Arbeitszeit ist nur wirksam, wenn der Betriebsrat ihr vorher zugestimmt hat.',
      ],
      richtig: [0],
      erklaerung:
        'Den Anspruch auf dauerhafte Teilzeit nach § 8 TzBfG hat, wessen Arbeitsverhältnis länger als sechs Monate besteht, wenn der Arbeitgeber in der Regel mehr als 15 Arbeitnehmer beschäftigt (Auszubildende zählen nicht mit, § 8 Abs. 7 TzBfG). Der Wunsch ist spätestens drei Monate vorher in Textform geltend zu machen (§ 8 Abs. 2 TzBfG). ' +
        'Der Arbeitgeber kann aus betrieblichen Gründen ablehnen (§ 8 Abs. 4 TzBfG). Die zeitlich begrenzte Brückenteilzeit (§ 9a TzBfG) gibt es erst bei mehr als 45 Arbeitnehmern – Taunuscode hat nur 31. Eine Zustimmung des Betriebsrats ist nicht nötig.',
    },
    {
      id: 'wiso-02-09',
      sp: ['WISO-1-3-5'],
      art: 'einfach',
      text:
        'Der Entwickler Jan Weiß ist seit 2019 bei Taunuscode beschäftigt. Bei ihm ist ein Grad der Behinderung von 50 festgestellt; er ist als schwerbehinderter Mensch anerkannt. Welche Aussage trifft zu?',
      optionen: [
        'Herr Weiß hat Anspruch auf einen bezahlten Zusatzurlaub von zehn Arbeitstagen im Jahr.',
        'Eine Kündigung von Herrn Weiß ist grundsätzlich ausgeschlossen, auch wenn der Betrieb stillgelegt wird.',
        'Als schwerbehindert gelten Menschen erst ab einem Grad der Behinderung von 80.',
        'Taunuscode darf Herrn Weiß ohne Beteiligung einer Behörde kündigen, wenn der Betriebsrat zustimmt.',
        'Eine Kündigung durch Taunuscode bedarf der vorherigen Zustimmung des Integrationsamts.',
      ],
      richtig: [4],
      erklaerung:
        'Die Kündigung schwerbehinderter Menschen durch den Arbeitgeber bedarf der vorherigen Zustimmung des Integrationsamts (§ 168 SGB IX), wenn das Arbeitsverhältnis länger als sechs Monate besteht (§ 173 SGB IX). Ausgeschlossen ist sie damit nicht. ' +
        'Schwerbehindert ist, wer einen Grad der Behinderung von mindestens 50 hat (§ 2 Abs. 2 SGB IX). Der Zusatzurlaub beträgt fünf Arbeitstage bei einer Fünftagewoche (§ 208 SGB IX). Die Zustimmung des Betriebsrats ersetzt die des Integrationsamts nicht.',
    },
    {
      id: 'wiso-02-10',
      sp: ['WISO-1-3-3'],
      art: 'mehrfach',
      text:
        'Taunuscode verliert den größten Kunden der Sparte Kommunale Lösungen und plant, zwei Entwicklerstellen betriebsbedingt abzubauen. Unter den vergleichbaren Beschäftigten muss eine Sozialauswahl getroffen werden. Welche **zwei** Gesichtspunkte muss Taunuscode dabei nach dem Kündigungsschutzgesetz berücksichtigen?',
      optionen: [
        'Anzahl der Krankheitstage in den letzten zwei Jahren',
        'Höhe des monatlichen Bruttogehalts',
        'Dauer der Betriebszugehörigkeit',
        'Ergebnis des letzten Mitarbeitergesprächs',
        'Mitgliedschaft in einer Gewerkschaft',
        'Unterhaltspflichten, z. B. gegenüber Kindern',
      ],
      richtig: [2, 5],
      erklaerung:
        'Das Kündigungsschutzgesetz gilt, weil Taunuscode mehr als zehn Arbeitnehmer beschäftigt (§ 23 KSchG) und die Arbeitsverhältnisse länger als sechs Monate bestehen (§ 1 Abs. 1 KSchG). ' +
        'Bei der Sozialauswahl sind Dauer der Betriebszugehörigkeit, Lebensalter, Unterhaltspflichten und eine Schwerbehinderung zu berücksichtigen (§ 1 Abs. 3 KSchG). Gehalt, Krankheitstage und Leistungsbeurteilungen sind keine Sozialkriterien; eine Benachteiligung wegen Gewerkschaftsmitgliedschaft ist verboten (Art. 9 Abs. 3 GG). Vor jeder Kündigung ist der Betriebsrat anzuhören (§ 102 BetrVG).',
    },
    {
      id: 'wiso-02-11',
      sp: ['WISO-1-3-3'],
      art: 'einfach',
      situation: 's2',
      text:
        'Tim Rauscher ist in den letzten Wochen mehrfach ohne Entschuldigung zu spät zu vereinbarten Kundenterminen erschienen. Taunuscode erteilt ihm deshalb eine Abmahnung. Welche Aussage trifft zu?',
      optionen: [
        'Die Abmahnung ist nur wirksam, wenn der Betriebsrat ihr vorher ausdrücklich zugestimmt hat.',
        'Mit der Abmahnung endet das Arbeitsverhältnis, wenn Herr Rauscher nicht binnen einer Woche widerspricht.',
        'Die Abmahnung rügt ein konkretes Fehlverhalten und kündigt für den Wiederholungsfall Konsequenzen bis zur Kündigung an.',
        'Wegen der bereits abgemahnten Verspätungen kann Taunuscode zusätzlich sofort kündigen, auch ohne weiteren Verstoß.',
        'Eine Abmahnung muss schriftlich erfolgen; eine mündliche Abmahnung ist in jedem Fall unwirksam.',
      ],
      richtig: [2],
      erklaerung:
        'Die Abmahnung hat eine Hinweis- und eine Warnfunktion: Sie beschreibt das Fehlverhalten konkret und droht für den Wiederholungsfall arbeitsrechtliche Folgen an. Vor einer verhaltensbedingten Kündigung ist sie in der Regel erforderlich (§ 314 Abs. 2 BGB, § 1 Abs. 2 KSchG). ' +
        'Eine Form ist nicht vorgeschrieben; schriftlich ist sie nur zum Nachweis üblich. Der Betriebsrat muss nicht zustimmen. Mit der Abmahnung verzichtet der Arbeitgeber darauf, wegen derselben Vorfälle zu kündigen; eine Kündigung kommt erst bei einem erneuten Verstoß in Betracht.',
    },
    {
      id: 'wiso-02-12',
      sp: ['WISO-1-6-3'],
      art: 'zahl',
      situation: 's2',
      text:
        'Für Tim Rauscher gelten folgende Beitragssätze: Rentenversicherung 18,6 % (je zur Hälfte Arbeitgeber und Arbeitnehmer), Pflegeversicherung 3,6 % (je zur Hälfte) zuzüglich 0,6 % Beitragszuschlag für Kinderlose, den der Arbeitnehmer allein trägt. ' +
        'Sein Gehalt liegt unter den Beitragsbemessungsgrenzen. Berechnen Sie die Summe der monatlichen Arbeitnehmeranteile zur Renten- und Pflegeversicherung in Euro.',
      richtig: 491.4,
      stellen: 2,
      einheit: 'EUR',
      erklaerung:
        'Rentenversicherung: 4.200,00 € × 18,6 % / 2 = 4.200,00 € × 9,3 % = 390,60 €. Pflegeversicherung: 4.200,00 € × (1,8 % + 0,6 %) = 4.200,00 € × 2,4 % = 100,80 €. Summe: 491,40 €. ' +
        'Den Kinderlosenzuschlag zahlen kinderlose Versicherte ab 23 Jahren allein (§ 55 Abs. 3, § 58 Abs. 1 SGB XI).',
    },
    {
      id: 'wiso-02-13',
      sp: ['WISO-1-6-1'],
      art: 'einfach',
      situation: 's2',
      text: 'Tim Rauscher prüft seine Gehaltsabrechnung. Welche Aussage trifft zu?',
      optionen: [
        'Den Beitrag zur gesetzlichen Unfallversicherung tragen Arbeitgeber und Arbeitnehmer je zur Hälfte; er wird vom Brutto abgezogen.',
        'Taunuscode behält die Lohnsteuer vom Bruttogehalt ein und führt sie an das Finanzamt ab.',
        'Vermögenswirksame Leistungen von Taunuscode sind steuer- und beitragsfrei und erscheinen nicht in der Abrechnung.',
        'Kirchensteuer wird von allen Beschäftigten erhoben, unabhängig davon, ob sie einer Kirche angehören.',
        'Der Arbeitgeberanteil zur Sozialversicherung wird zusätzlich vom Brutto abgezogen und mindert das Nettogehalt.',
      ],
      richtig: [1],
      erklaerung:
        'Der Arbeitgeber behält die Lohnsteuer bei jeder Lohnzahlung ein und führt sie an das Finanzamt ab (§ 38 Abs. 3, § 41a EStG); ebenso die Kirchensteuer, die nur Kirchenmitglieder zahlen (in Hessen 9 % der Lohnsteuer). ' +
        'Die Unfallversicherung trägt der Arbeitgeber allein (§ 150 SGB VII). Der Arbeitgeberanteil zur Sozialversicherung wird nicht vom Brutto abgezogen. Vermögenswirksame Leistungen des Arbeitgebers erhöhen das steuer- und beitragspflichtige Bruttoentgelt.',
    },
    {
      id: 'wiso-02-14',
      sp: ['WISO-1-4-2'],
      art: 'einfach',
      text:
        'Geschäftsführung und Betriebsrat von Taunuscode wollen Regeln für das mobile Arbeiten (z. B. Erreichbarkeit, Ausstattung) in einer Betriebsvereinbarung festlegen. Welche Aussage trifft zu?',
      optionen: [
        'Die Betriebsvereinbarung wird zwischen einer Gewerkschaft und der Geschäftsführung abgeschlossen.',
        'Die Betriebsvereinbarung gilt nur für Beschäftigte, die ihr einzeln schriftlich zugestimmt haben.',
        'Die Betriebsvereinbarung ist wirksam, wenn sie mündlich in einer Betriebsversammlung beschlossen wurde.',
        'Kommt keine Einigung zustande, legt das Arbeitsgericht den Inhalt der Regelung abschließend fest.',
        'Die Betriebsvereinbarung ist schriftlich niederzulegen, von beiden Seiten zu unterzeichnen und gilt unmittelbar und zwingend.',
      ],
      richtig: [4],
      erklaerung:
        'Betriebsvereinbarungen werden von Arbeitgeber und Betriebsrat beschlossen, schriftlich niedergelegt und von beiden Seiten unterzeichnet (§ 77 Abs. 2 BetrVG). Sie gelten unmittelbar und zwingend für alle Arbeitnehmer des Betriebs (§ 77 Abs. 4 BetrVG). ' +
        'Die Ausgestaltung mobiler Arbeit ist mitbestimmungspflichtig (§ 87 Abs. 1 Nr. 14 BetrVG); kommt keine Einigung zustande, entscheidet die Einigungsstelle (§ 87 Abs. 2, § 76 BetrVG). Gewerkschaften schließen Tarifverträge, keine Betriebsvereinbarungen.',
    },
    {
      id: 'wiso-02-15',
      sp: ['WISO-1-5-2'],
      art: 'einfach',
      text:
        'Mia Kowalski liest, dass bei einem großen tarifgebundenen IT-Dienstleister in Frankfurt nach gescheiterten Tarifverhandlungen und einer Urabstimmung gestreikt wird. Welche Aussage zum Arbeitskampf trifft zu?',
      optionen: [
        'Während des Streiks ruhen die Hauptpflichten; Streikende erhalten kein Entgelt, Gewerkschaftsmitglieder bekommen Streikgeld.',
        'Der Betriebsrat des IT-Dienstleisters darf zum Streik aufrufen, wenn die Mehrheit der Beschäftigten zustimmt.',
        'Mit einer Aussperrung kündigt der Arbeitgeber allen Streikenden fristlos; sie müssen später neu eingestellt werden.',
        'Streikende haben für die Dauer des Streiks Anspruch auf Arbeitslosengeld der Bundesagentur für Arbeit.',
        'Ein Streik ist auch während der Laufzeit des Tarifvertrags jederzeit zulässig, wenn die Gewerkschaft ihn beschließt.',
      ],
      richtig: [0],
      erklaerung:
        'Das Streikrecht folgt aus der Koalitionsfreiheit (Art. 9 Abs. 3 GG); Einzelheiten hat die Rechtsprechung entwickelt. Während eines rechtmäßigen Streiks ruhen Arbeits- und Entgeltpflicht; Gewerkschaftsmitglieder erhalten Streikgeld. Eine Aussperrung suspendiert die Arbeitsverhältnisse ebenfalls nur, sie beendet sie nicht. ' +
        'Zum Streik aufrufen darf nur eine Gewerkschaft; der Betriebsrat darf keine Arbeitskämpfe führen (§ 74 Abs. 2 BetrVG). Der Anspruch auf Arbeitslosengeld ruht bei Arbeitskämpfen (§ 160 SGB III). Während der Laufzeit eines Tarifvertrags gilt die Friedenspflicht.',
    },

    // ---------- Betrieb, Rechtsform, Organisation, Wirtschaftsordnung ----------
    {
      id: 'wiso-02-16',
      sp: ['WISO-2-2-1'],
      art: 'einfach',
      situation: 's3',
      text: 'Ein Lieferant möchte wissen, wer für die Verbindlichkeiten der Taunuscode Software GmbH & Co. KG haftet. Welche Aussage trifft zu?',
      optionen: [
        'Henrik Albers haftet als Geschäftsführer der Komplementär-GmbH mit seinem gesamten Privatvermögen unbeschränkt.',
        'Alle Gesellschafter haften wie bei einer OHG unbeschränkt und gesamtschuldnerisch mit ihrem Privatvermögen.',
        'Die Kommanditisten haften bis zur doppelten Höhe ihrer Einlage, Dr. Sabine Wendt also bis 160.000 €.',
        'Die GmbH & Co. KG ist eine Kapitalgesellschaft; Gläubigern haftet nur das Stammkapital von 25.000 €.',
        'Neben dem Vermögen der KG haftet die Verwaltungs-GmbH unbeschränkt; die Kommanditisten haften nach voller Einzahlung nicht mehr.',
      ],
      richtig: [4],
      erklaerung:
        'Die GmbH & Co. KG ist eine Personengesellschaft (KG), deren Komplementärin eine GmbH ist. Für die Schulden haftet das Gesellschaftsvermögen der KG; daneben haftet die Komplementär-GmbH unbeschränkt mit ihrem gesamten Vermögen (§ 161 Abs. 1 HGB), ihre Gesellschafter und ihr Geschäftsführer aber nicht persönlich (§ 13 Abs. 2 GmbHG). ' +
        'Kommanditisten haften nur bis zur Höhe ihrer Einlage; ist sie geleistet, ist die Haftung ausgeschlossen (§ 171 Abs. 1 HGB). Von der Geschäftsführung sind sie ausgeschlossen (§ 164 HGB).',
    },
    {
      id: 'wiso-02-17',
      sp: ['WISO-2-2-2'],
      art: 'einfach',
      situation: 's3',
      text: 'Welches der folgenden Geschäfte darf Katrin Morawe aufgrund ihrer Prokura **ohne** besondere Befugnis **nicht** vornehmen?',
      optionen: [
        'einen Kredit über 50.000 € bei der Hausbank aufnehmen',
        'eine neue Entwicklerin unbefristet einstellen',
        'das Bürogebäude der KG in Wiesbaden verkaufen',
        'einen Rechtsstreit gegen einen säumigen Kunden führen',
        'einen Rahmenvertrag mit einem Cloud-Anbieter abschließen',
      ],
      richtig: [2],
      erklaerung:
        'Die Prokura ermächtigt zu allen Arten von Geschäften, die der Betrieb irgendeines Handelsgewerbes mit sich bringt (§ 49 Abs. 1 HGB) – also auch zu Krediten, Einstellungen, Prozessen und Verträgen. ' +
        'Grundstücke veräußern oder belasten darf der Prokurist nur, wenn ihm diese Befugnis besonders erteilt ist (§ 49 Abs. 2 HGB). Außerdem darf er u. a. keine Prokura erteilen, den Jahresabschluss nicht unterschreiben und keine Insolvenz beantragen.',
    },
    {
      id: 'wiso-02-18',
      sp: ['WISO-2-2-2'],
      art: 'einfach',
      situation: 's3',
      text: 'Welche Aussage zum Handelsregister trifft zu?',
      optionen: [
        'Das Handelsregister wird von der IHK Wiesbaden geführt; Einsicht erhalten nur deren Mitglieder.',
        'Die Taunuscode Software GmbH & Co. KG steht in Abteilung A, die Taunuscode Verwaltungs-GmbH in Abteilung B.',
        'Neben der Prokura von Frau Morawe müssen auch alle Handlungsvollmachten eingetragen werden.',
        'Die Prokura von Frau Morawe wird erst mit ihrer Eintragung in das Handelsregister wirksam.',
        'Eintragungen werden nur im gedruckten Amtsblatt bekannt gemacht und können nicht online eingesehen werden.',
      ],
      richtig: [1],
      erklaerung:
        'Abteilung A enthält Einzelkaufleute und Personenhandelsgesellschaften (OHG, KG – auch die GmbH & Co. KG), Abteilung B die Kapitalgesellschaften (GmbH, AG) (§ 3 Handelsregisterverordnung). ' +
        'Das Register führen die Amtsgerichte elektronisch (§ 8 HGB); jeder darf es einsehen, auch online (§ 9 HGB). Die Prokura ist zur Eintragung anzumelden (§ 53 HGB), wirksam wird sie aber schon mit der Erteilung (deklaratorische Eintragung). Handlungsvollmachten (§ 54 HGB) werden nicht eingetragen.',
    },
    {
      id: 'wiso-02-19',
      sp: ['WISO-2-2-2', 'WISO-2-2-1'],
      art: 'zuordnung',
      text: 'Ordnen Sie den Merkmalen a bis e die passende Rechtsform zu. Nicht jede Ziffer wird benötigt.',
      links: [
        'a Mindestens drei Mitglieder; Zweck ist die Förderung des Erwerbs oder der Wirtschaft der Mitglieder durch einen gemeinschaftlichen Geschäftsbetrieb.',
        'b Mindestgrundkapital 50.000 €; Organe sind Vorstand, Aufsichtsrat und Hauptversammlung.',
        'c Gründung schon mit 1 € Stammkapital möglich; ein Viertel des Jahresüberschusses ist in eine gesetzliche Rücklage einzustellen.',
        'd Mindeststammkapital 25.000 €; die Gesellschafter haften Gläubigern nicht persönlich.',
        'e Mindestens ein Gesellschafter haftet unbeschränkt, mindestens einer nur bis zur Höhe seiner Einlage.',
      ],
      optionen: [
        '1 Aktiengesellschaft (AG)',
        '2 Gesellschaft mit beschränkter Haftung (GmbH)',
        '3 Unternehmergesellschaft (haftungsbeschränkt)',
        '4 eingetragene Genossenschaft (eG)',
        '5 Kommanditgesellschaft (KG)',
        '6 eingetragener Kaufmann (e. K.)',
      ],
      richtig: [3, 0, 2, 1, 4],
      erklaerung:
        'a: eG – Förderzweck (§ 1 GenG), mindestens drei Mitglieder (§ 4 GenG). b: AG – Grundkapital mindestens 50.000 € (§ 7 AktG), Organe Vorstand, Aufsichtsrat, Hauptversammlung. ' +
        'c: UG (haftungsbeschränkt) – Sonderform der GmbH mit weniger als 25.000 € Stammkapital, Pflicht zur Rücklage von einem Viertel des Jahresüberschusses (§ 5a GmbHG). d: GmbH – Mindeststammkapital 25.000 € (§ 5 GmbHG), Haftung nur mit dem Gesellschaftsvermögen (§ 13 Abs. 2 GmbHG). ' +
        'e: KG – Komplementär und Kommanditist (§ 161 Abs. 1 HGB). Der eingetragene Kaufmann wird nicht benötigt.',
    },
    {
      id: 'wiso-02-20',
      sp: ['WISO-2-3-1'],
      art: 'einfach',
      text:
        'Taunuscode ist in die drei Bereiche Praxissoftware, Kommunale Lösungen und Individualentwicklung gegliedert; jeder Bereich hat eine eigene Leitung mit eigener Entwicklung, eigenem Vertrieb und eigenem Support. ' +
        'Personal, Buchhaltung und Einkauf sind im Zentralbereich Verwaltung gebündelt. Die Stelle „Datenschutz und Informationssicherheit“ ist direkt der Geschäftsführung zugeordnet; sie berät Geschäftsführung und Bereichsleitungen, darf ihnen aber keine Weisungen erteilen. Welche Aussage trifft zu?',
      optionen: [
        'Es handelt sich um eine Matrixorganisation, weil die Beschäftigten von Bereichs- und Verwaltungsleitung gleichzeitig fachliche Weisungen erhalten.',
        'Es handelt sich um eine funktionale Organisation, weil Entwicklung, Vertrieb und Support jeweils eine Hauptabteilung für das ganze Unternehmen bilden.',
        'Die Gliederung nach Produktbereichen ist eine Spartenorganisation; die Stelle Datenschutz und Informationssicherheit ist eine Stabsstelle.',
        'Die Stelle Datenschutz und Informationssicherheit ist eine Linienstelle, weil sie unmittelbar unter der Geschäftsführung angesiedelt ist.',
        'Eine Spartenorganisation ist für ein Softwarehaus ungeeignet, weil sie nur für Industriebetriebe mit mehr als 1.000 Beschäftigten taugt.',
      ],
      richtig: [2],
      erklaerung:
        'Bei der Spartenorganisation (divisionale Organisation) wird das Unternehmen nach Produkten bzw. Kundengruppen gegliedert; jede Sparte hat eigene Funktionen wie Entwicklung, Vertrieb und Support. Zentrale Aufgaben können in einem Zentralbereich gebündelt sein. ' +
        'Eine Stabsstelle unterstützt und berät eine Leitungsstelle, hat aber keine Weisungsbefugnis. Bei der funktionalen Organisation wäre das ganze Unternehmen nach Funktionen gegliedert; eine Matrix setzt zwei gleichberechtigte Weisungslinien voraus.',
    },
    {
      id: 'wiso-02-21',
      sp: ['WISO-2-4-1'],
      art: 'einfach',
      text: 'Die Leitung der Sparte Praxissoftware möchte die **Produktivität** des Support-Teams messen. Welche Kennzahl ist dafür geeignet?',
      optionen: [
        'Anzahl gelöster Support-Tickets / geleistete Arbeitsstunden im Support',
        'Umsatzerlöse der Sparte / Aufwendungen der Sparte',
        'Gewinn des Geschäftsjahres / durchschnittliches Eigenkapital × 100',
        'Gewinn der Sparte / Umsatzerlöse der Sparte × 100',
        'Personalkosten des Support-Teams / Anzahl der Beschäftigten im Support',
      ],
      richtig: [0],
      erklaerung:
        'Die Produktivität ist eine mengenmäßige Kennzahl: Ausbringungsmenge / Einsatzmenge, hier gelöste Tickets je Arbeitsstunde. ' +
        'Erträge / Aufwendungen ist die Wirtschaftlichkeit (wertmäßig), Gewinn / Eigenkapital × 100 die Eigenkapitalrentabilität, Gewinn / Umsatz × 100 die Umsatzrentabilität; Personalkosten je Beschäftigtem sind eine Durchschnittskostengröße.',
    },
    {
      id: 'wiso-02-22',
      sp: ['WISO-2-4-1'],
      art: 'zahl',
      text:
        'Taunuscode hat 2026 zwei Projekte abgeschlossen. Projekt „Bürgerportal“: Erträge 156.000 €, Aufwendungen 120.000 €. Projekt „Terminbuchung“: Erträge 98.000 €, Aufwendungen 70.000 €. ' +
        'Berechnen Sie die Wirtschaftlichkeit des Projekts, das wirtschaftlicher war (auf zwei Nachkommastellen).',
      richtig: 1.4,
      stellen: 2,
      erklaerung:
        'Wirtschaftlichkeit = Erträge / Aufwendungen. Bürgerportal: 156.000 € / 120.000 € = 1,30. Terminbuchung: 98.000 € / 70.000 € = 1,40. ' +
        'Das Projekt Terminbuchung war wirtschaftlicher, obwohl es den geringeren absoluten Überschuss (28.000 € statt 36.000 €) erzielt hat. Werte über 1 bedeuten, dass die Erträge die Aufwendungen übersteigen.',
    },
    {
      id: 'wiso-02-23',
      sp: ['WISO-2-1-1'],
      art: 'einfach',
      text:
        'Taunuscode betreibt die Praxissoftware für ihre Kunden in der Cloud. Für die benötigten Rechenkapazitäten kommen nur wenige große Cloud-Anbieter infrage, denen sehr viele Unternehmen als Kunden gegenüberstehen. Welche Marktform liegt vor?',
      optionen: ['Angebotsmonopol', 'Angebotsoligopol', 'Polypol (vollständige Konkurrenz)', 'Nachfragemonopol', 'zweiseitiges Oligopol'],
      richtig: [1],
      erklaerung:
        'Wenige Anbieter und viele Nachfrager kennzeichnen ein Angebotsoligopol. Ein Monopol hätte nur einen Anbieter (bzw. Nachfrager), ein Polypol viele Anbieter und viele Nachfrager, ein zweiseitiges Oligopol wenige Anbieter und wenige Nachfrager. ' +
        'Im Oligopol beobachten die Anbieter ihre Konkurrenten genau; Preisabsprachen sind als Kartell verboten (§ 1 GWB).',
    },
    {
      id: 'wiso-02-24',
      sp: ['WISO-2-1-3'],
      art: 'einfach',
      text:
        'Kunden von Taunuscode verschieben Aufträge. Wirtschaftsforschungsinstitute melden sinkende Auftragseingänge, eine geringe Auslastung der Kapazitäten und steigende Arbeitslosigkeit. Welche Maßnahme entspricht einer antizyklischen Finanzpolitik des Staates?',
      optionen: [
        'Der Staat erhöht die Einkommen- und Unternehmensteuern, um seine Schulden schneller abzubauen.',
        'Der Staat kürzt geplante Investitionen in Schulgebäude und den Breitbandausbau.',
        'Der Staat legt zusätzliche Mittel in einer Konjunkturausgleichsrücklage still, statt sie auszugeben.',
        'Die Europäische Zentralbank erhöht die Leitzinsen, damit Kredite teurer werden.',
        'Der Staat zieht öffentliche Investitionen vor, z. B. in die Digitalisierung der Verwaltung, und stärkt so die Nachfrage.',
      ],
      richtig: [4],
      erklaerung:
        'Die beschriebene Lage ist ein Abschwung bzw. eine Rezession. Antizyklisch handelt der Staat, wenn er dann gegensteuert: mehr Staatsausgaben, vorgezogene Investitionen oder Steuersenkungen erhöhen die Nachfrage (vgl. Stabilitäts- und Wachstumsgesetz, § 1 StabG). ' +
        'Steuererhöhungen, Ausgabenkürzungen und das Stilllegen von Mitteln in einer Konjunkturausgleichsrücklage bremsen die Nachfrage – das passt in einen Boom. Leitzinserhöhungen sind Geldpolitik der EZB, nicht Finanzpolitik des Staates, und würden die Konjunktur zusätzlich dämpfen.',
    },

    // ---------- Arbeitsschutz, Erste Hilfe, Brandschutz ----------
    {
      id: 'wiso-02-25',
      sp: ['WISO-3-1-1', 'WISO-3-2-2'],
      art: 'einfach',
      text: 'Taunuscode hat für die Büroarbeitsplätze noch keine Gefährdungsbeurteilung erstellt. Welche Aussage trifft zu?',
      optionen: [
        'Eine Gefährdungsbeurteilung ist erst für Betriebe mit mindestens 50 Beschäftigten vorgeschrieben.',
        'Die Gefährdungsbeurteilung erfasst nur körperliche Gefährdungen; psychische Belastungen bleiben außer Betracht.',
        'Die Gefährdungsbeurteilung erstellt die Berufsgenossenschaft, die dafür unaufgefordert in den Betrieb kommt.',
        'Taunuscode muss die Gefährdungen einschließlich psychischer Belastungen ermitteln, Schutzmaßnahmen festlegen und dies dokumentieren.',
        'Die Gefährdungsbeurteilung wird einmal erstellt; eine Überprüfung bei Änderungen der Arbeit ist nicht vorgesehen.',
      ],
      richtig: [3],
      erklaerung:
        'Jeder Arbeitgeber muss – unabhängig von der Betriebsgröße – die mit der Arbeit verbundenen Gefährdungen beurteilen und die erforderlichen Schutzmaßnahmen ermitteln (§ 5 Abs. 1 ArbSchG); dazu gehören ausdrücklich psychische Belastungen (§ 5 Abs. 3 Nr. 6 ArbSchG). ' +
        'Das Ergebnis und die Maßnahmen sind zu dokumentieren (§ 6 ArbSchG); die Maßnahmen sind auf Wirksamkeit zu überprüfen und anzupassen (§ 3 Abs. 1 ArbSchG). Die Verantwortung liegt beim Arbeitgeber; Berufsgenossenschaft, Fachkraft für Arbeitssicherheit und Betriebsarzt beraten.',
    },
    {
      id: 'wiso-02-26',
      sp: ['WISO-3-1-2', 'WISO-3-4-1'],
      art: 'einfach',
      text:
        'Im Bürogebäude von Taunuscode sind an einem normalen Arbeitstag in der Regel 30 Beschäftigte anwesend. Welche Aussage zur Ersten Hilfe trifft nach der Unfallverhütungsvorschrift „Grundsätze der Prävention“ (DGUV Vorschrift 1) zu?',
      optionen: [
        'Es müssen mindestens zwei ausgebildete Ersthelferinnen oder Ersthelfer zur Verfügung stehen.',
        'Ein Ersthelfer genügt, weil es sich um einen Bürobetrieb ohne besondere Gefahren handelt.',
        'Ersthelfer brauchen keine Fortbildung, wenn sie ihre Ausbildung einmal erfolgreich abgeschlossen haben.',
        'Ersthelfer müssen eine abgeschlossene Ausbildung in einem Gesundheitsberuf haben.',
        'Die Lehrgangsgebühren für die Ausbildung zum Ersthelfer tragen die Beschäftigten selbst.',
      ],
      richtig: [0],
      erklaerung:
        'Nach § 26 Abs. 1 DGUV Vorschrift 1 ist bei 2 bis 20 anwesenden Versicherten ein Ersthelfer nötig, bei mehr als 20 in Verwaltungs- und Handelsbetrieben 5 % der anwesenden Versicherten: 30 × 5 % = 1,5, also mindestens zwei. ' +
        'Ersthelfer werden in einem Erste-Hilfe-Lehrgang ausgebildet und in der Regel alle zwei Jahre fortgebildet (§ 26 Abs. 3 DGUV Vorschrift 1); eine medizinische Berufsausbildung ist nicht nötig. Die Lehrgangsgebühren übernimmt die Berufsgenossenschaft (§ 23 Abs. 2 SGB VII).',
    },
    {
      id: 'wiso-02-27',
      sp: ['WISO-3-2-2'],
      art: 'mehrfach',
      text: 'Taunuscode richtet für neue Beschäftigte Bildschirmarbeitsplätze ein. Welche **zwei** Aussagen treffen zu?',
      optionen: [
        'Die Oberkante des Bildschirms sollte deutlich über Augenhöhe liegen, damit der Kopf leicht nach oben geneigt ist.',
        'Taunuscode muss den Beschäftigten eine arbeitsmedizinische Vorsorge zu Augen und Sehvermögen anbieten.',
        'Die Teilnahme an dieser Vorsorge ist Pflicht; wer sie ablehnt, darf nicht am Bildschirm arbeiten.',
        'Bildschirme sind so aufzustellen, dass Blendungen und Spiegelungen durch Fenster oder Leuchten möglichst vermieden werden.',
        'Eine spezielle Bildschirmbrille, die nur wegen der Bildschirmarbeit nötig ist, müssen die Beschäftigten selbst bezahlen.',
        'Nach jeder Stunde Bildschirmarbeit ist gesetzlich eine bezahlte Pause von genau 15 Minuten vorgeschrieben.',
      ],
      richtig: [1, 3],
      erklaerung:
        'Bei Tätigkeiten an Bildschirmgeräten muss der Arbeitgeber eine Angebotsvorsorge zu Augen und Sehvermögen anbieten (ArbMedVV, Anhang Teil 4 Abs. 2 Nr. 1); die Teilnahme ist freiwillig. Ergibt sie, dass eine spezielle Sehhilfe nötig ist, stellt der Arbeitgeber sie zur Verfügung. ' +
        'Nach der Arbeitsstättenverordnung (Anhang Nr. 6) sind Blendungen und Spiegelungen zu vermeiden; der Bildschirm steht am besten mit der Blickrichtung parallel zum Fenster, die Oberkante auf oder leicht unter Augenhöhe. Bildschirmarbeit ist durch Pausen oder andere Tätigkeiten zu unterbrechen, eine feste 15-Minuten-Regel gibt es nicht.',
    },
    {
      id: 'wiso-02-28',
      sp: ['WISO-3-5-2'],
      art: 'einfach',
      text: 'Bei einer Brandschutzunterweisung werden die Brandklassen nach DIN EN 2 besprochen. Welche Zuordnung von Brandklasse und brennbarem Stoff trifft zu?',
      optionen: [
        'Brandklasse B: brennbare Gase wie Propan oder Erdgas',
        'Brandklasse D: Speiseöle und -fette in Fettbackgeräten',
        'Brandklasse C: flüssige oder flüssig werdende Stoffe wie Benzin oder Wachs',
        'Brandklasse F: brennbare Metalle wie Aluminium oder Magnesium',
        'Brandklasse A: feste, glutbildende Stoffe wie Papier, Holz oder Textilien',
      ],
      richtig: [4],
      erklaerung:
        'Brandklassen nach DIN EN 2: A feste, meist glutbildende Stoffe (Papier, Holz, Textilien), B flüssige oder flüssig werdende Stoffe (Benzin, Wachs, viele Kunststoffe), C Gase (Propan, Erdgas), D Metalle (Aluminium, Magnesium), F Speiseöle und -fette. ' +
        'Auf jedem Feuerlöscher ist angegeben, für welche Brandklassen er geeignet ist.',
    },

    // ---------- Umweltschutz ----------
    {
      id: 'wiso-02-29',
      sp: ['WISO-4-2-1'],
      art: 'reihenfolge',
      text:
        'Taunuscode muss entscheiden, was mit 40 älteren Notebooks geschehen soll. Bringen Sie die Stufen der Abfallhierarchie nach dem Kreislaufwirtschaftsgesetz in die richtige Rangfolge – beginnend mit der Stufe, die den höchsten Vorrang hat.',
      optionen: [
        'Recycling: Die Geräte werden zerlegt; Metalle und Kunststoffe werden als Rohstoffe zurückgewonnen.',
        'Vermeidung: Die Notebooks werden aufgerüstet und weiter genutzt, sodass gar kein Abfall entsteht.',
        'Beseitigung: Nicht verwertbare Reste werden auf einer Deponie abgelagert.',
        'Vorbereitung zur Wiederverwendung: Die Geräte werden geprüft, die Datenträger sicher gelöscht und die Notebooks gebraucht weiterverkauft.',
        'Sonstige, insbesondere energetische Verwertung: Nicht recycelbare Kunststoffteile werden zur Energiegewinnung verbrannt.',
      ],
      richtig: [1, 3, 0, 4, 2],
      erklaerung:
        'Die Rangfolge nach § 6 Abs. 1 KrWG lautet: 1. Vermeidung, 2. Vorbereitung zur Wiederverwendung, 3. Recycling, 4. sonstige Verwertung, insbesondere energetische Verwertung, 5. Beseitigung. ' +
        'Elektroaltgeräte, die doch Abfall werden, sind getrennt zu erfassen und über Rücknahmestellen oder zertifizierte Entsorger zu verwerten (ElektroG).',
    },
    {
      id: 'wiso-02-30',
      sp: ['WISO-4-1-2', 'WISO-4-3-2'],
      art: 'mehrfach',
      text: 'Taunuscode will beim Kauf neuer Notebooks auf Nachhaltigkeit achten. Welche **zwei** Kriterien sind dafür geeignet?',
      optionen: [
        'Geräte mit dem Umweltzeichen Blauer Engel, das u. a. Energieverbrauch, Schadstoffe und Langlebigkeit berücksichtigt',
        'Geräte mit fest verklebtem Akku, weil sie besonders flach und leicht sind',
        'Austausch aller Notebooks in jedem Jahr, damit immer die neueste Technik genutzt wird',
        'Auswahl des Lieferanten ausschließlich nach dem niedrigsten Anschaffungspreis',
        'Geräte, für die der Hersteller über viele Jahre Ersatzteile, Reparaturen und Sicherheitsupdates zusagt',
        'Einzelverpackung jedes Zubehörteils in Kunststofffolie zum Schutz beim Transport',
      ],
      richtig: [0, 4],
      erklaerung:
        'Nachhaltige Beschaffung berücksichtigt den ganzen Lebenszyklus: Umweltzeichen wie der Blaue Engel für Computer prüfen u. a. Energieverbrauch, Schadstoffarmut, Reparierbarkeit und Ersatzteilverfügbarkeit. Lange Versorgung mit Ersatzteilen und Updates verlängert die Nutzungsdauer und vermeidet Abfall. ' +
        'Verklebte Akkus erschweren Reparatur und Recycling, jährlicher Austausch erzeugt unnötig Elektroschrott, reine Preisorientierung lässt Umweltkriterien außer Acht, und Einzelverpackungen erhöhen den Verpackungsmüll.',
    },
  ],
};
