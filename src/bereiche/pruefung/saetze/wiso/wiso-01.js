// WiSo-Probeprüfung 1 – Gutenbit Systemhaus GmbH (fiktiv). Format: ../../README.md
export default {
  id: 'wiso-01',
  teil: 'WISO',
  titel: 'Gutenbit Systemhaus GmbH',
  situation:
    'Sie werden bei der Gutenbit Systemhaus GmbH in Mainz zur Fachinformatikerin bzw. zum Fachinformatiker für Anwendungsentwicklung ausgebildet. ' +
    'Das Unternehmen wurde 2014 gegründet. Es entwickelt Individualsoftware für mittelständische Kunden, betreut deren IT-Infrastruktur und betreibt ein kleines eigenes Rechenzentrum für Hosting. ' +
    'Gutenbit beschäftigt 60 Personen, darunter sechs Auszubildende. Das Unternehmen ist Mitglied in einem Arbeitgeberverband, im Betrieb gibt es einen Betriebsrat. ' +
    'Gesellschafter sind Dr. Miriam Kessler, Jonas Albrecht und Elif Yilmaz; Geschäftsführerin ist Dr. Miriam Kessler.',
  bloecke: [
    {
      id: 's1',
      text:
        'Bei Gutenbit wurde im Frühjahr 2026 ein fünfköpfiger Betriebsrat gewählt. Im Betrieb arbeiten 57 Arbeitnehmerinnen und Arbeitnehmer im Sinne des Betriebsverfassungsgesetzes, darunter sechs Auszubildende im Alter von 17 bis 23 Jahren. ' +
        'Die Geschäftsführung plant, ein neues Zeiterfassungs- und Ticketsystem einzuführen, das auch auswertet, wie viele Tickets jede einzelne Person pro Tag bearbeitet.',
    },
    {
      id: 's2',
      text:
        'Das Stammkapital der Gutenbit Systemhaus GmbH beträgt 120.000 €. Davon halten Dr. Miriam Kessler 60.000 €, Jonas Albrecht 36.000 € und Elif Yilmaz 24.000 €. ' +
        'Der Gesellschaftsvertrag enthält keine Regelung zur Gewinnverteilung. Für das Geschäftsjahr 2025 weist Gutenbit einen Jahresüberschuss von 96.000 € aus. ' +
        'Im Juni 2026 wurde beschlossen, 84.000 € an die Gesellschafter auszuschütten und 12.000 € in die Gewinnrücklagen einzustellen.',
    },
    {
      id: 's3',
      text:
        'Der Systembetreuer Tobias Lang fährt an einem Montagmorgen mit dem Fahrrad auf direktem Weg von seiner Wohnung zum Firmengebäude von Gutenbit. ' +
        'Kurz vor dem Ziel stürzt er auf nasser Fahrbahn und bricht sich das Handgelenk. Der Arzt schreibt ihn für zwölf Tage arbeitsunfähig.',
    },
  ],
  fragen: [
    // ---------- Ausbildung, Arbeits- und Tarifrecht, Mitbestimmung, Sozialversicherung ----------
    {
      id: 'wiso-01-01',
      sp: ['WISO-1-1-1'],
      art: 'einfach',
      text: 'Die Auszubildende Lea Brandt und Gutenbit treffen verschiedene Vereinbarungen. Welche der folgenden Vereinbarungen ist nach dem Berufsbildungsgesetz **wirksam**?',
      optionen: [
        'Lea verpflichtet sich bei Abschluss des Ausbildungsvertrags, nach der Ausbildung mindestens zwei Jahre bei Gutenbit zu arbeiten.',
        'Lea zahlt für überbetriebliche Lehrgänge einen Eigenanteil von 300 € je Ausbildungsjahr.',
        'Für den Fall, dass Lea die Ausbildung nach der Probezeit abbricht, wird eine Vertragsstrafe von 1.500 € vereinbart.',
        'Fünf Monate vor dem Ende der Ausbildung vereinbaren Lea und Gutenbit, dass Lea im Anschluss unbefristet als Anwendungsentwicklerin übernommen wird.',
        'Beschädigt Lea ein Firmen-Notebook, zahlt sie pauschal 500 € Schadensersatz, unabhängig von der Höhe des tatsächlichen Schadens.',
      ],
      richtig: [3],
      erklaerung:
        'Nach § 12 BBiG sind Vereinbarungen nichtig, die Auszubildende für die Zeit nach der Ausbildung in ihrer beruflichen Tätigkeit beschränken – außer, sie verpflichten sich innerhalb der letzten sechs Monate der Ausbildung, danach ein Arbeitsverhältnis mit dem Ausbildenden einzugehen (Option 4). ' +
        'Ebenfalls nichtig sind eine Entschädigung für die Berufsausbildung (Eigenanteil für Lehrgänge), Vertragsstrafen und Schadensersatz in Pauschbeträgen. Eine Bindung bereits bei Vertragsabschluss ist ebenfalls nichtig.',
    },
    {
      id: 'wiso-01-02',
      sp: ['WISO-1-1-2'],
      art: 'einfach',
      text: 'Gutenbit möchte das Ausbildungsverhältnis mit einem Auszubildenden im dritten Monat der Probezeit beenden. Welche Aussage zur Kündigung trifft zu?',
      optionen: [
        'Gutenbit kann nur mit einer Frist von vier Wochen kündigen; die Kündigung muss schriftlich erfolgen.',
        'Eine Kündigung ist in der Probezeit nur aus wichtigem Grund möglich; die Gründe müssen im Kündigungsschreiben angegeben werden.',
        'Eine Kündigung per E-Mail oder mündlich reicht aus, da in der Probezeit keine Formvorschriften gelten.',
        'Die Kündigung ist nur wirksam, wenn die IHK als zuständige Stelle vorher schriftlich zugestimmt hat.',
        'Gutenbit kann jederzeit ohne Einhaltung einer Kündigungsfrist kündigen; die Kündigung muss schriftlich erfolgen, Gründe müssen nicht angegeben werden.',
      ],
      richtig: [4],
      erklaerung:
        'Während der Probezeit kann das Ausbildungsverhältnis von beiden Seiten jederzeit ohne Kündigungsfrist gekündigt werden (§ 22 Abs. 1 BBiG). Die Kündigung muss schriftlich erfolgen (§ 22 Abs. 3 BBiG), E-Mail oder mündlich genügen nicht. ' +
        'Gründe müssen nur bei einer Kündigung nach der Probezeit angegeben werden. Eine Zustimmung der IHK ist nicht nötig; weil Gutenbit einen Betriebsrat hat, ist dieser aber vor jeder Kündigung anzuhören (§ 102 BetrVG).',
    },
    {
      id: 'wiso-01-03',
      sp: ['WISO-1-1-4'],
      art: 'mehrfach',
      text: 'Welche **zwei** Aussagen zu den Pflichten von Gutenbit als Ausbildendem treffen nach dem Berufsbildungsgesetz zu?',
      optionen: [
        'Gutenbit muss den Auszubildenden die Ausbildungsmittel, die für die Ausbildung und die Prüfungen erforderlich sind, kostenlos zur Verfügung stellen.',
        'Gutenbit darf verlangen, dass die Auszubildenden den Ausbildungsnachweis ausschließlich in ihrer Freizeit führen.',
        'Gutenbit darf den Auszubildenden nur Aufgaben übertragen, die dem Ausbildungszweck dienen und ihren körperlichen Kräften angemessen sind.',
        'Gutenbit muss die Auszubildenden nur dann für den Berufsschulunterricht freistellen, wenn keine dringenden Kundenaufträge anstehen.',
        'Bei unverschuldeter Krankheit zahlt Gutenbit die Ausbildungsvergütung höchstens drei Tage weiter.',
        'Gutenbit muss die Auszubildenden für die Berufsschultage freistellen, nicht aber für die Teilnahme an Prüfungen.',
      ],
      richtig: [0, 2],
      erklaerung:
        'Nach § 14 BBiG muss der Ausbildende Ausbildungsmittel (z. B. Werkzeuge, Fachliteratur) kostenlos stellen und darf nur Aufgaben übertragen, die dem Ausbildungszweck dienen und den körperlichen Kräften angemessen sind. ' +
        'Den Auszubildenden ist Gelegenheit zu geben, den Ausbildungsnachweis am Arbeitsplatz während der Ausbildungszeit zu führen (§ 14 Abs. 2 BBiG). Für Berufsschule und Prüfungen muss immer freigestellt werden (§ 15 BBiG). Bei unverschuldeter Krankheit wird die Vergütung bis zu sechs Wochen weitergezahlt (Entgeltfortzahlungsgesetz, das auch für Auszubildende gilt).',
    },
    {
      id: 'wiso-01-04',
      sp: ['WISO-1-1-3'],
      art: 'einfach',
      text:
        'Der Ausbildungsvertrag eines Auszubildenden von Gutenbit endet laut Vertrag am 31. Juli. Am 24. Juni erfährt er, dass er Teil 2 der Abschlussprüfung nicht bestanden hat. Welche Aussage trifft zu?',
      optionen: [
        'Das Ausbildungsverhältnis endet am 31. Juli; eine Verlängerung ist gesetzlich nicht vorgesehen.',
        'Auf sein Verlangen verlängert sich das Ausbildungsverhältnis bis zur nächstmöglichen Wiederholungsprüfung, höchstens um ein Jahr.',
        'Das Ausbildungsverhältnis verlängert sich automatisch um genau ein Jahr, auch wenn der Auszubildende das nicht wünscht.',
        'Gutenbit kann eine Verlängerung ablehnen, wenn die Leistungen im Betrieb nicht ausreichend waren.',
        'Das Ausbildungsverhältnis endet sofort mit der Bekanntgabe des Prüfungsergebnisses, da die Prüfung nicht bestanden wurde.',
      ],
      richtig: [1],
      erklaerung:
        'Nach § 21 Abs. 3 BBiG verlängert sich das Ausbildungsverhältnis bei nicht bestandener Abschlussprüfung auf Verlangen des Auszubildenden bis zur nächstmöglichen Wiederholungsprüfung, höchstens um ein Jahr. ' +
        'Die Verlängerung tritt nur auf Verlangen ein, der Betrieb kann sie nicht ablehnen. Ohne Verlangen endet die Ausbildung mit Ablauf der vereinbarten Zeit.',
    },
    {
      id: 'wiso-01-05',
      sp: ['WISO-1-3-4'],
      art: 'einfach',
      text:
        'Die 17-jährige Auszubildende Lea Brandt arbeitet an einem Tag sieben Stunden im Betrieb. Wie lange müssen ihre Ruhepausen nach dem Jugendarbeitsschutzgesetz an diesem Tag mindestens insgesamt dauern?',
      optionen: ['15 Minuten', '30 Minuten', '45 Minuten', '60 Minuten', 'Keine Pause vorgeschrieben, da sie weniger als acht Stunden arbeitet'],
      richtig: [3],
      erklaerung:
        'Nach § 11 JArbSchG stehen Jugendlichen bei mehr als 4,5 bis 6 Stunden Arbeitszeit mindestens 30 Minuten, bei mehr als 6 Stunden mindestens 60 Minuten Ruhepause zu; als Pause zählen nur Unterbrechungen von mindestens 15 Minuten. ' +
        '30 bzw. 45 Minuten sind die Grenzen des Arbeitszeitgesetzes für Erwachsene (mehr als 6 bzw. mehr als 9 Stunden).',
    },
    {
      id: 'wiso-01-06',
      sp: ['WISO-1-3-3'],
      art: 'einfach',
      text:
        'Gutenbit kündigt dem 46-jährigen Systembetreuer Herrn Weber ordentlich. Herr Weber ist seit dem 1. April 2017 bei Gutenbit beschäftigt. Die Kündigung geht ihm am 14. Oktober 2026 zu. Weder Arbeitsvertrag noch Tarifvertrag enthalten abweichende Fristen. Auszug aus § 622 BGB:\n' +
        '- (1) Das Arbeitsverhältnis eines Arbeitnehmers kann mit einer Frist von vier Wochen zum Fünfzehnten oder zum Ende eines Kalendermonats gekündigt werden.\n' +
        '- (2) Für eine Kündigung durch den Arbeitgeber beträgt die Kündigungsfrist, wenn das Arbeitsverhältnis in dem Betrieb oder Unternehmen zwei Jahre bestanden hat, einen Monat, fünf Jahre bestanden hat, zwei Monate, acht Jahre bestanden hat, drei Monate, zehn Jahre bestanden hat, vier Monate […], jeweils zum Ende eines Kalendermonats.\n' +
        'An welchem Tag endet das Arbeitsverhältnis?',
      optionen: ['15. November 2026', '31. Dezember 2026', '14. Januar 2027', '31. Januar 2027', '28. Februar 2027'],
      richtig: [3],
      erklaerung:
        'Herr Weber ist bei Zugang der Kündigung 9 Jahre und 6 Monate beschäftigt, es gilt also die Frist für acht Jahre: drei Monate zum Ende eines Kalendermonats. ' +
        'Drei Monate ab dem 14. Oktober 2026 reichen bis zum 14. Januar 2027; das nächste Monatsende ist der 31. Januar 2027. Der 15. November wäre die Grundkündigungsfrist, die nur für Kündigungen durch den Arbeitnehmer bzw. bei kurzer Beschäftigung gilt.',
    },
    {
      id: 'wiso-01-07',
      sp: ['WISO-1-3-5'],
      art: 'einfach',
      text: 'Die Entwicklerin Sarah Klein teilt Gutenbit mit, dass sie schwanger ist. Welche Aussage zum Mutterschutz trifft zu?',
      optionen: [
        'In den sechs Wochen vor der Entbindung darf Frau Klein nicht beschäftigt werden, auch wenn sie ausdrücklich arbeiten möchte.',
        'Gutenbit darf Frau Klein während der Schwangerschaft ordentlich kündigen, wenn der Betriebsrat zustimmt.',
        'Nach der Entbindung darf Frau Klein grundsätzlich acht Wochen lang nicht beschäftigt werden, auch wenn sie selbst früher arbeiten möchte.',
        'Während der Schutzfristen erhält Frau Klein kein Geld, weil sie keine Arbeitsleistung erbringt.',
        'Frau Klein muss die Schwangerschaft spätestens im dritten Monat mitteilen, sonst verliert sie den Mutterschutz.',
      ],
      richtig: [2],
      erklaerung:
        'Nach § 3 Abs. 2 MuSchG gilt nach der Entbindung ein Beschäftigungsverbot von acht Wochen (bei Früh- oder Mehrlingsgeburten zwölf Wochen), auf das die Frau nicht verzichten kann. ' +
        'Vor der Entbindung (sechs Wochen) darf sie dagegen arbeiten, wenn sie sich ausdrücklich dazu bereit erklärt. Während der Schwangerschaft und bis vier Monate nach der Entbindung ist eine Kündigung grundsätzlich unzulässig (§ 17 MuSchG). ' +
        'In den Schutzfristen gibt es Mutterschaftsgeld der Krankenkasse plus Zuschuss des Arbeitgebers. Eine Frist für die Mitteilung gibt es nicht; sie soll erfolgen, sobald die Schwangerschaft bekannt ist.',
    },
    {
      id: 'wiso-01-08',
      sp: ['WISO-1-3-5'],
      art: 'mehrfach',
      text: 'Der Entwickler Malik Hoffmann und seine Partnerin erwarten ein Kind. Herr Hoffmann möchte Elternzeit nehmen. Welche **zwei** Aussagen treffen zu?',
      optionen: [
        'Die Elternzeit muss spätestens zwei Wochen vor ihrem Beginn mündlich angemeldet werden.',
        'Gutenbit zahlt während der Elternzeit das volle Gehalt weiter.',
        'Herr Hoffmann und seine Partnerin können gleichzeitig Elternzeit nehmen.',
        'Die Elternzeit ist auf höchstens zwölf Monate je Kind begrenzt.',
        'Gutenbit kann den Antrag auf Elternzeit ohne Angabe von Gründen ablehnen.',
        'Während der Elternzeit darf Herr Hoffmann in Teilzeit mit bis zu 32 Wochenstunden arbeiten.',
      ],
      richtig: [2, 5],
      erklaerung:
        'Nach dem BEEG können beide Elternteile Elternzeit nehmen, auch gleichzeitig; Teilzeitarbeit bis 32 Wochenstunden im Monatsdurchschnitt ist erlaubt. ' +
        'Die Elternzeit ist ein Rechtsanspruch von bis zu drei Jahren je Elternteil und Kind und muss spätestens sieben Wochen vor Beginn in Textform (z. B. per E-Mail, seit Mai 2025) verlangt werden (für die Zeit bis zum 3. Geburtstag). Der Arbeitgeber kann sie nicht ablehnen. ' +
        'Gehalt zahlt der Arbeitgeber nicht; stattdessen gibt es staatliches Elterngeld.',
    },
    {
      id: 'wiso-01-09',
      sp: ['WISO-1-4-1'],
      art: 'einfach',
      situation: 's1',
      text: 'Vor der Betriebsratswahl hat der Wahlvorstand geprüft, wer wählen darf (aktives Wahlrecht) und wer gewählt werden kann (passives Wahlrecht). Welche Aussage trifft zu?',
      optionen: [
        'Die damals 17-jährige Auszubildende Lea Brandt durfte mitwählen, konnte aber selbst nicht in den Betriebsrat gewählt werden.',
        'Der 23-jährige Auszubildende Can Özdemir, der zum Zeitpunkt der Wahl erst seit drei Monaten bei Gutenbit war, konnte in den Betriebsrat gewählt werden.',
        'Die Geschäftsführerin Dr. Miriam Kessler durfte mitwählen, weil sie im Betrieb arbeitet.',
        'Eine Teilzeitkraft mit 15 Wochenstunden durfte nicht mitwählen.',
        'Wählen durften nur Beschäftigte, die Mitglied einer Gewerkschaft sind.',
      ],
      richtig: [0],
      erklaerung:
        'Wahlberechtigt sind alle Arbeitnehmerinnen und Arbeitnehmer ab 16 Jahren (§ 7 BetrVG), also auch Auszubildende und Teilzeitkräfte, unabhängig von einer Gewerkschaftsmitgliedschaft. ' +
        'Wählbar ist, wer mindestens 18 Jahre alt ist und dem Betrieb seit mindestens sechs Monaten angehört (§ 8 BetrVG). Die Geschäftsführerin einer GmbH ist keine Arbeitnehmerin im Sinne des BetrVG (§ 5 Abs. 2).',
    },
    {
      id: 'wiso-01-10',
      sp: ['WISO-1-4-1'],
      art: 'mehrfach',
      situation: 's1',
      text: 'In welchen **zwei** Angelegenheiten hat der Betriebsrat von Gutenbit ein echtes (erzwingbares) Mitbestimmungsrecht?',
      optionen: [
        'Festlegung der Stundensätze, die Kunden für Programmierleistungen bezahlen',
        'Einführung des geplanten Zeiterfassungs- und Ticketsystems mit Auswertung je Person',
        'Bestellung eines weiteren Geschäftsführers',
        'Höhe der Gewinnausschüttung an die Gesellschafter',
        'Festlegung von Beginn und Ende der täglichen Arbeitszeit (Gleitzeitrahmen) und der Pausen',
        'Auswahl des Lieferanten für neue Server im Rechenzentrum',
      ],
      richtig: [1, 4],
      erklaerung:
        'Echte Mitbestimmung besteht vor allem in sozialen Angelegenheiten nach § 87 BetrVG, u. a. bei Beginn und Ende der täglichen Arbeitszeit und der Pausen (Nr. 2) sowie bei technischen Einrichtungen, die geeignet sind, Verhalten oder Leistung zu überwachen (Nr. 6). ' +
        'Preise, Lieferantenauswahl, Geschäftsführerbestellung und Gewinnverwendung sind unternehmerische bzw. gesellschaftsrechtliche Entscheidungen ohne Mitbestimmungsrecht des Betriebsrats.',
    },
    {
      id: 'wiso-01-11',
      sp: ['WISO-1-4-3'],
      art: 'einfach',
      situation: 's1',
      text: 'Die Auszubildenden von Gutenbit überlegen, eine Jugend- und Auszubildendenvertretung (JAV) zu wählen. Welche Aussage trifft zu?',
      optionen: [
        'Eine JAV kann nur gewählt werden, wenn im Betrieb kein Betriebsrat besteht.',
        'Die JAV kann ohne Beteiligung des Betriebsrats eigene Betriebsvereinbarungen mit der Geschäftsführung abschließen.',
        'In die JAV können nur Beschäftigte gewählt werden, die das 18. Lebensjahr noch nicht vollendet haben.',
        'Weil mindestens fünf Auszubildende unter 25 Jahren beschäftigt sind, kann eine JAV gewählt werden; ihre regelmäßige Amtszeit beträgt zwei Jahre.',
        'Die JAV wird zusammen mit dem Betriebsrat für vier Jahre gewählt.',
      ],
      richtig: [3],
      erklaerung:
        'Eine JAV wird in Betrieben mit Betriebsrat gewählt, in denen in der Regel mindestens fünf Arbeitnehmer unter 18 oder Auszubildende unter 25 Jahren beschäftigt sind (§ 60 BetrVG). Wählbar sind alle Beschäftigten unter 25 Jahren (§ 61 Abs. 2 BetrVG), die regelmäßige Amtszeit beträgt zwei Jahre (§ 64 Abs. 2 BetrVG). ' +
        'Die JAV handelt über den Betriebsrat; Betriebsvereinbarungen schließt nur der Betriebsrat.',
    },
    {
      id: 'wiso-01-12',
      sp: ['WISO-1-5-1'],
      art: 'einfach',
      text:
        'Gutenbit ist Mitglied in einem Arbeitgeberverband, der mit einer Gewerkschaft einen Entgelt- und einen Manteltarifvertrag abgeschlossen hat. Die Entwicklerin Nina Roth ist Mitglied dieser Gewerkschaft. Welche Aussage trifft zu?',
      optionen: [
        'Die Tarifverträge wurden zwischen der Geschäftsführung von Gutenbit und dem Betriebsrat abgeschlossen.',
        'Nina Roths Arbeitsvertrag darf eine höhere Vergütung vorsehen, als der Entgelttarifvertrag festlegt.',
        'Gutenbit darf mit Nina Roth wirksam vereinbaren, dass sie weniger Urlaub erhält als im Manteltarifvertrag geregelt, wenn sie zustimmt.',
        'Während der Laufzeit des Entgelttarifvertrags darf die Gewerkschaft jederzeit für höhere Entgelte streiken.',
        'Tarifverträge werden von der Industrie- und Handelskammer für allgemeinverbindlich erklärt.',
      ],
      richtig: [1],
      erklaerung:
        'Bei beiderseitiger Tarifbindung gelten die Tarifnormen unmittelbar und zwingend; Abweichungen sind nur zugunsten des Arbeitnehmers zulässig (Günstigkeitsprinzip, § 4 Abs. 3 TVG). Weniger Urlaub wäre eine Verschlechterung und daher unwirksam. ' +
        'Tarifvertragsparteien sind Gewerkschaft und Arbeitgeberverband (oder einzelner Arbeitgeber), nicht der Betriebsrat. Während der Laufzeit gilt die Friedenspflicht. Die Allgemeinverbindlicherklärung erfolgt durch das Bundesarbeitsministerium (oder eine von ihm beauftragte Landesbehörde), nicht durch die IHK.',
    },
    {
      id: 'wiso-01-13',
      sp: ['WISO-1-5-2'],
      art: 'reihenfolge',
      text: 'Bringen Sie die Schritte eines Tarifkonflikts, der mit einem Streik verbunden ist, in die richtige Reihenfolge.',
      optionen: [
        'Urabstimmung der Gewerkschaftsmitglieder über einen Streik',
        'Kündigung des bisherigen Entgelttarifvertrags',
        'Streik',
        'Erklärung des Scheiterns der Verhandlungen und erfolglose Schlichtung',
        'Tarifverhandlungen zwischen Gewerkschaft und Arbeitgeberverband',
        'Einigung und Abschluss eines neuen Entgelttarifvertrags',
      ],
      richtig: [1, 4, 3, 0, 2, 5],
      erklaerung:
        'Zuerst wird der alte Tarifvertrag gekündigt, danach wird verhandelt. Scheitern die Verhandlungen und eine Schlichtung, stimmen die Gewerkschaftsmitglieder in einer Urabstimmung über einen Streik ab. ' +
        'Nach dem Streik folgen neue Verhandlungen, eine Einigung und (meist nach einer zweiten Urabstimmung) der neue Tarifvertrag. Warnstreiks sind schon während der Verhandlungen möglich, sobald die Friedenspflicht abgelaufen ist.',
    },
    {
      id: 'wiso-01-14',
      sp: ['WISO-1-6-2'],
      art: 'zuordnung',
      text: 'Ordnen Sie den Leistungen a bis e zu, wer sie erbringt bzw. aus welchem Zweig der Sozialversicherung sie stammen. Nicht jede Ziffer wird benötigt.',
      links: [
        'a Krankengeld, nachdem die Entgeltfortzahlung bei längerer Krankheit ausgelaufen ist',
        'b Kurzarbeitergeld bei vorübergehendem Auftragsmangel',
        'c Verletztengeld nach einem Wegeunfall',
        'd Rente wegen Erwerbsminderung',
        'e Entgeltfortzahlung in den ersten sechs Wochen einer Erkrankung',
      ],
      optionen: [
        '1 Krankenversicherung',
        '2 Pflegeversicherung',
        '3 Rentenversicherung',
        '4 Arbeitslosenversicherung',
        '5 Unfallversicherung',
        '6 keine Sozialversicherung – Leistung des Arbeitgebers',
      ],
      richtig: [0, 3, 4, 2, 5],
      erklaerung:
        'a: Krankengeld zahlt die Krankenkasse nach Ende der Entgeltfortzahlung. b: Kurzarbeitergeld zahlt die Bundesagentur für Arbeit aus der Arbeitslosenversicherung. ' +
        'c: Verletztengeld nach Arbeits- oder Wegeunfällen zahlt die Unfallversicherung (Berufsgenossenschaft). d: Erwerbsminderungsrenten zahlt die Rentenversicherung. ' +
        'e: Die Entgeltfortzahlung im Krankheitsfall (bis sechs Wochen) leistet der Arbeitgeber selbst nach dem Entgeltfortzahlungsgesetz. Die Pflegeversicherung wird nicht benötigt.',
    },
    {
      id: 'wiso-01-15',
      sp: ['WISO-1-6-3', 'WISO-1-6-1'],
      art: 'zahl',
      text:
        'Der Junior-Entwickler Paul Neumann erhält ein monatliches Bruttogehalt von 3.640,00 €. Der allgemeine Beitragssatz der gesetzlichen Krankenversicherung beträgt 14,6 %, seine Krankenkasse erhebt einen Zusatzbeitrag von 2,9 %. ' +
        'Beide Beiträge tragen Arbeitgeber und Arbeitnehmer je zur Hälfte; das Gehalt liegt unter der Beitragsbemessungsgrenze. Berechnen Sie den monatlichen Arbeitnehmeranteil zur Krankenversicherung in Euro.',
      richtig: 318.5,
      stellen: 2,
      einheit: 'EUR',
      erklaerung: 'Arbeitnehmeranteil = 3.640,00 € × (14,6 % + 2,9 %) / 2 = 3.640,00 € × 8,75 % = 318,50 €.',
    },

    // ---------- Betrieb, Rechtsform, Organisation, Wirtschaftsordnung ----------
    {
      id: 'wiso-01-16',
      sp: ['WISO-2-2-2'],
      art: 'einfach',
      situation: 's2',
      text: 'Welche Aussage zur Rechtsform der Gutenbit Systemhaus GmbH trifft zu?',
      optionen: [
        'Die Gesellschafter haften für die Schulden der GmbH unbeschränkt mit ihrem Privatvermögen.',
        'Das Mindeststammkapital einer GmbH beträgt 50.000 €.',
        'Geschäftsführer einer GmbH kann nur werden, wer zugleich Gesellschafter ist.',
        'Die GmbH entsteht als juristische Person erst mit der Eintragung in das Handelsregister, Abteilung B.',
        'Der Gesellschaftsvertrag einer GmbH kann formfrei, auch mündlich, geschlossen werden.',
      ],
      richtig: [3],
      erklaerung:
        'Vor der Eintragung in das Handelsregister besteht die GmbH als solche nicht (§ 11 GmbHG); Kapitalgesellschaften stehen in Abteilung B. ' +
        'Gegenüber Gläubigern haftet nur das Gesellschaftsvermögen. Das Mindeststammkapital beträgt 25.000 € (50.000 € gilt für die AG). Geschäftsführer kann auch eine angestellte Person sein, die keine Anteile hält. Der Gesellschaftsvertrag muss notariell beurkundet werden.',
    },
    {
      id: 'wiso-01-17',
      sp: ['WISO-2-2-2'],
      art: 'einfach',
      situation: 's2',
      text: 'Welches Organ der GmbH beschließt über die Verwendung des Jahresüberschusses, also über Ausschüttung und Rücklagen?',
      optionen: [
        'die Geschäftsführerin allein',
        'die Gesellschafterversammlung',
        'der Betriebsrat',
        'der Aufsichtsrat, den jede GmbH bilden muss',
        'das Registergericht beim Amtsgericht',
      ],
      richtig: [1],
      erklaerung:
        'Die Gesellschafterversammlung ist das oberste Organ der GmbH und beschließt u. a. über die Feststellung des Jahresabschlusses und die Ergebnisverwendung (§ 46 Nr. 1 GmbHG). ' +
        'Die Geschäftsführung leitet und vertritt die GmbH. Ein Aufsichtsrat ist erst ab mehr als 500 Arbeitnehmern Pflicht; bei 60 Beschäftigten ist er freiwillig. Betriebsrat und Registergericht entscheiden darüber nicht.',
    },
    {
      id: 'wiso-01-18',
      sp: ['WISO-2-2-3'],
      art: 'zahl',
      situation: 's2',
      text: 'Berechnen Sie, wie viel Euro Jonas Albrecht von den ausgeschütteten 84.000 € erhält.',
      richtig: 25200,
      stellen: 2,
      einheit: 'EUR',
      erklaerung:
        'Ohne Regelung im Gesellschaftsvertrag wird der Gewinn nach dem Verhältnis der Geschäftsanteile verteilt (§ 29 Abs. 3 GmbHG). Anteil Albrecht = 36.000 € / 120.000 € = 30 %; 84.000 € × 30 % = 25.200,00 €.',
    },
    {
      id: 'wiso-01-19',
      sp: ['WISO-2-4-1'],
      art: 'zahl',
      text:
        'Gutenbit weist für 2025 einen Jahresgewinn von 96.000 € aus. Das durchschnittliche Eigenkapital betrug 640.000 €. Berechnen Sie die Eigenkapitalrentabilität in Prozent.',
      richtig: 15,
      stellen: 2,
      einheit: '%',
      erklaerung: 'Eigenkapitalrentabilität = Gewinn / Eigenkapital × 100 = 96.000 € / 640.000 € × 100 = 15,00 %.',
    },
    {
      id: 'wiso-01-20',
      sp: ['WISO-2-4-2', 'WISO-4-1-2'],
      art: 'einfach',
      text:
        'Gutenbit beschließt, das Rechenzentrum künftig ausschließlich mit zertifiziertem Ökostrom zu betreiben. Dieser ist teurer als der bisherige Strom; die Preise für die Hosting-Kunden sollen trotzdem gleich bleiben. Welche Aussage trifft zu?',
      optionen: [
        'Zwischen dem ökologischen Ziel und dem ökonomischen Ziel der Gewinnmaximierung besteht ein Zielkonflikt.',
        'Zwischen dem ökologischen Ziel und dem Ziel der Gewinnmaximierung besteht Zielharmonie, weil die Stromkosten sinken.',
        'Die Ziele sind voneinander unabhängig (Zielneutralität), weil Stromkosten den Gewinn nicht beeinflussen.',
        'Der Bezug von Ökostrom ist ein soziales Unternehmensziel.',
        'Ein Zielkonflikt ist ausgeschlossen, weil die Preise für die Kunden gleich bleiben.',
      ],
      richtig: [0],
      erklaerung:
        'Der teurere Ökostrom dient dem ökologischen Ziel, erhöht aber die Kosten. Da die Preise gleich bleiben, sinkt der Gewinn – die Verfolgung des einen Ziels beeinträchtigt das andere: Zielkonflikt. ' +
        'Gerade weil die Mehrkosten nicht an die Kunden weitergegeben werden, schlagen sie voll auf den Gewinn durch.',
    },
    {
      id: 'wiso-01-21',
      sp: ['WISO-2-3-1'],
      art: 'einfach',
      text:
        'Bei Gutenbit sind die Beschäftigten den Abteilungen Entwicklung, Infrastruktur und Verwaltung zugeordnet; dort erhalten sie disziplinarische Weisungen von der Abteilungsleitung. ' +
        'Für jeden Kundenauftrag wird zusätzlich eine Projektleitung eingesetzt, die den Projektmitgliedern aus verschiedenen Abteilungen fachliche Weisungen zum Projekt erteilt. Welche Aussage trifft zu?',
      optionen: [
        'Es handelt sich um ein Einliniensystem, weil jede Person nur einer Abteilung angehört.',
        'Es handelt sich um ein Stabliniensystem, weil die Projektleitungen als Stabsstellen nur beraten.',
        'Es handelt sich um eine Spartenorganisation, weil jedes Projekt eine eigenständige Sparte mit eigener Verwaltung ist.',
        'Es handelt sich um eine Matrixorganisation, bei der Kompetenzkonflikte zwischen den Leitungen ausgeschlossen sind.',
        'Es handelt sich um eine Matrixorganisation, weil sich die Weisungsbefugnisse von Abteilungs- und Projektleitung überschneiden.',
      ],
      richtig: [4],
      erklaerung:
        'In der Matrixorganisation werden zwei Gliederungen kombiniert (hier Abteilungen und Projekte); die Beschäftigten erhalten Weisungen von zwei Stellen. Dadurch kann es zu Kompetenzkonflikten kommen. ' +
        'Im Einliniensystem gibt es nur einen Vorgesetzten; Stabsstellen haben keine Weisungsbefugnis; eine Sparte ist ein dauerhafter, eigenständiger Unternehmensbereich.',
    },
    {
      id: 'wiso-01-22',
      sp: ['WISO-2-1-3'],
      art: 'einfach',
      text: 'Welches der folgenden Merkmale gehört **nicht** zur Sozialen Marktwirtschaft in Deutschland?',
      optionen: [
        'Privateigentum an Produktionsmitteln',
        'Schutz des Wettbewerbs durch das Kartellverbot und die Kartellbehörden',
        'Absicherung gegen Krankheit, Arbeitslosigkeit und im Alter durch die gesetzliche Sozialversicherung',
        'Tarifautonomie von Gewerkschaften und Arbeitgeberverbänden',
        'Festlegung von Preisen und Produktionsmengen durch eine zentrale staatliche Planungsbehörde',
      ],
      richtig: [4],
      erklaerung:
        'Zentrale Planung von Preisen und Mengen ist ein Merkmal der Zentralverwaltungswirtschaft. In der Sozialen Marktwirtschaft bilden sich Preise am Markt; der Staat schützt den Wettbewerb und sorgt für sozialen Ausgleich. ' +
        'Privateigentum, Wettbewerbsschutz, Sozialversicherung und Tarifautonomie sind typische Merkmale.',
    },
    {
      id: 'wiso-01-23',
      sp: ['WISO-2-1-2'],
      art: 'einfach',
      text:
        'Gutenbit lässt einzelne Softwaremodule von einem Partnerunternehmen in Portugal programmieren, weil dort mehr Fachkräfte verfügbar sind und die Stundensätze niedriger liegen. Welche Aussage trifft zu?',
      optionen: [
        'Es handelt sich um innerbetriebliche Arbeitszerlegung, weil ein Auftrag in Teilaufgaben zerlegt wird.',
        'Es handelt sich um internationale Arbeitsteilung; sie wird durch niedrige Kommunikationskosten und den EU-Binnenmarkt begünstigt.',
        'Es handelt sich um eine Fusion, weil beide Unternehmen zusammenarbeiten.',
        'Die Zusammenarbeit ist nicht zulässig, weil Dienstleistungen innerhalb der EU nur im eigenen Land erbracht werden dürfen.',
        'Es handelt sich um ein Kartell, weil sich zwei Unternehmen absprechen.',
      ],
      richtig: [1],
      erklaerung:
        'Wenn Leistungen grenzüberschreitend auf Unternehmen in verschiedenen Ländern verteilt werden, spricht man von internationaler Arbeitsteilung, einem Kennzeichen der Globalisierung. ' +
        'Sie wird durch Digitalisierung, geringe Kommunikationskosten und den freien Dienstleistungsverkehr im EU-Binnenmarkt gefördert. Eine Fusion (Verschmelzung) oder ein Kartell (Wettbewerbsabsprache) liegt nicht vor.',
    },
    {
      id: 'wiso-01-24',
      sp: ['WISO-2-5-1'],
      art: 'einfach',
      text:
        'Gutenbit und zwei Mainzer Wettbewerber vereinbaren, bei öffentlichen Ausschreibungen für Programmierleistungen keinen Stundensatz unter 120 € anzubieten. Welche Aussage trifft zu?',
      optionen: [
        'Es handelt sich um einen Konzern, weil die drei Unternehmen unter einheitlicher Leitung stehen.',
        'Die Absprache ist erlaubt, wenn sie vorher beim Bundeskartellamt angemeldet wird.',
        'Es handelt sich um ein Preiskartell; es ist nach dem Gesetz gegen Wettbewerbsbeschränkungen verboten und kann von der Kartellbehörde mit Bußgeldern geahndet werden.',
        'Es handelt sich um eine Fusion, weil die Unternehmen ihre Preise vereinheitlichen.',
        'Die Absprache ist erlaubt, weil es sich um kleine und mittlere Unternehmen handelt.',
      ],
      richtig: [2],
      erklaerung:
        'Absprachen zwischen Wettbewerbern über Preise sind Kartelle und nach § 1 GWB verboten; Kartellbehörden können hohe Bußgelder verhängen, Absprachen bei Ausschreibungen sind sogar strafbar. ' +
        'Eine Anmeldung macht ein Preiskartell nicht zulässig. Die Unternehmen bleiben rechtlich und wirtschaftlich selbstständig – es liegt weder ein Konzern noch eine Fusion vor.',
    },

    // ---------- Arbeitsschutz, Unfall, Brandschutz ----------
    {
      id: 'wiso-01-25',
      sp: ['WISO-3-4-2'],
      art: 'einfach',
      situation: 's3',
      text: 'Welche Aussage zum Versicherungsschutz von Tobias Lang trifft zu?',
      optionen: [
        'Tobias Lang ist nicht versichert, weil sich der Unfall nicht auf dem Betriebsgelände ereignet hat.',
        'Es handelt sich um einen Wegeunfall; zuständig ist die gesetzliche Unfallversicherung, deren Träger für Gutenbit die Berufsgenossenschaft ist.',
        'Für Unfälle auf dem Arbeitsweg ist allein die private Haftpflichtversicherung von Tobias Lang zuständig.',
        'Die Unfallversicherung leistet nur, wenn Tobias Lang zuvor selbst Beiträge zur Unfallversicherung gezahlt hat.',
        'Die Unfallversicherung leistet nicht, weil Tobias Lang den Sturz durch seine Fahrweise mitverschuldet haben könnte.',
      ],
      richtig: [1],
      erklaerung:
        'Der direkte Weg zwischen Wohnung und Arbeitsstätte ist gesetzlich unfallversichert (Wegeunfall, § 8 Abs. 2 SGB VII). Träger der Unfallversicherung für gewerbliche Unternehmen sind die Berufsgenossenschaften. ' +
        'Die Beiträge zahlt allein der Arbeitgeber. Ein Mitverschulden schließt den Versicherungsschutz grundsätzlich nicht aus.',
    },
    {
      id: 'wiso-01-26',
      sp: ['WISO-3-4-2', 'WISO-3-4-1'],
      art: 'einfach',
      situation: 's3',
      text: 'Welche Meldepflicht hat Gutenbit nach dem Unfall von Tobias Lang?',
      optionen: [
        'Gutenbit muss den Unfall nicht melden, weil Wegeunfälle außerhalb des Betriebsgeländes nicht anzeigepflichtig sind.',
        'Gutenbit muss den Unfall nur melden, wenn er tödlich ausgeht oder Tobias Lang länger als sechs Wochen arbeitsunfähig ist.',
        'Tobias Lang muss den Unfall selbst beim Gewerbeaufsichtsamt anzeigen; Gutenbit hat keine Pflichten.',
        'Gutenbit muss den Unfall innerhalb eines Monats der Polizei melden, weil er sich im öffentlichen Straßenverkehr ereignet hat.',
        'Gutenbit muss den Unfall binnen drei Tagen nach Kenntnis der Berufsgenossenschaft anzeigen, weil Tobias Lang mehr als drei Tage arbeitsunfähig ist.',
      ],
      richtig: [4],
      erklaerung:
        'Nach § 193 SGB VII muss der Unternehmer einen Arbeits- oder Wegeunfall dem Unfallversicherungsträger anzeigen, wenn die versicherte Person getötet wird oder mehr als drei Tage arbeitsunfähig ist. ' +
        'Die Anzeige ist binnen drei Tagen nach Kenntnis zu erstatten; der Betriebsrat ist zu beteiligen.',
    },
    {
      id: 'wiso-01-27',
      sp: ['WISO-3-3-1'],
      art: 'einfach',
      text: 'Bei einer Begehung prüft die Sicherheitsbeauftragte von Gutenbit die Beschilderung im Gebäude. Welche Aussage zu Sicherheitszeichen trifft zu?',
      optionen: [
        'Grüne rechteckige oder quadratische Zeichen sind Rettungszeichen, z. B. für Notausgang, Erste Hilfe oder Sammelstelle.',
        'Gelbe dreieckige Zeichen mit schwarzem Symbol sind Gebotszeichen.',
        'Blaue runde Zeichen mit weißem Symbol kennzeichnen Feuerlöscher und Brandmelder.',
        'Runde Zeichen mit rotem Rand und rotem Diagonalbalken weisen auf Erste-Hilfe-Einrichtungen hin.',
        'Rote quadratische Zeichen kennzeichnen Fluchtwege und Notausgänge.',
      ],
      richtig: [0],
      erklaerung:
        'Rettungszeichen sind grün und rechteckig bzw. quadratisch. Warnzeichen sind gelb und dreieckig, Gebotszeichen blau und rund, Verbotszeichen rund mit rotem Rand und Balken. ' +
        'Rote quadratische Zeichen sind Brandschutzzeichen (z. B. Feuerlöscher, Brandmelder).',
    },
    {
      id: 'wiso-01-28',
      sp: ['WISO-3-5-2'],
      art: 'einfach',
      text: 'Für den Serverraum von Gutenbit soll ein Feuerlöscher für Entstehungsbrände an elektrischen Anlagen beschafft werden. Welche Aussage trifft zu?',
      optionen: [
        'Am besten geeignet ist ein Wasserlöscher, weil Wasser am stärksten kühlt.',
        'Am besten geeignet ist ein Pulverlöscher, weil er keine Rückstände hinterlässt.',
        'Am besten geeignet ist ein Kohlendioxidlöscher (CO₂), weil er rückstandsfrei löscht und für Brände in elektrischen Anlagen geeignet ist.',
        'Am besten geeignet ist ein Löscher der Brandklasse D, weil Server aus Metall bestehen.',
        'Am besten geeignet ist ein Fettbrandlöscher der Brandklasse F, weil Kabelisolierungen Öle enthalten.',
      ],
      richtig: [2],
      erklaerung:
        'CO₂-Löscher ersticken den Brand, leiten keinen Strom und hinterlassen keine Rückstände – deshalb werden sie für Serverräume und elektrische Anlagen eingesetzt. ' +
        'Wasser leitet Strom. Pulver löscht zwar, verschmutzt und beschädigt aber die Hardware stark. Klasse D (brennende Metalle) und F (Speisefette) passen nicht.',
    },

    // ---------- Umweltschutz ----------
    {
      id: 'wiso-01-29',
      sp: ['WISO-4-1-1'],
      art: 'mehrfach',
      text: 'Gutenbit möchte den Stromverbrauch an den Büroarbeitsplätzen senken. Welche **zwei** Maßnahmen sind dafür geeignet?',
      optionen: [
        'Einen animierten Bildschirmschoner einrichten, der nach fünf Minuten startet',
        'Bildschirme und PCs über die Energieoptionen nach kurzer Inaktivität in den Energiesparmodus schalten',
        'Drucker dauerhaft eingeschaltet lassen, weil das Aufwärmen mehr Energie kostet als der Dauerbetrieb',
        'Die Bildschirmhelligkeit an allen Arbeitsplätzen auf den Höchstwert stellen',
        'Geräte abends über schaltbare Steckdosenleisten vollständig vom Netz trennen, damit kein Standby-Strom anfällt',
        'Alle Dokumente zusätzlich ausdrucken, damit weniger Speicherplatz auf den Servern nötig ist',
      ],
      richtig: [1, 4],
      erklaerung:
        'Energiesparmodus nach kurzer Inaktivität und das vollständige Trennen vom Netz (kein Standby-Verbrauch) senken den Stromverbrauch wirksam. ' +
        'Ein Bildschirmschoner spart keine Energie, da der Bildschirm weiterläuft. Dauerbetrieb von Druckern, maximale Helligkeit und zusätzliche Ausdrucke erhöhen den Verbrauch an Energie und Papier.',
    },
    {
      id: 'wiso-01-30',
      sp: ['WISO-4-2-1'],
      art: 'einfach',
      text: 'Gutenbit mustert 25 alte Notebooks aus, auf deren Festplatten Kundendaten gespeichert waren. Wie geht Gutenbit richtig vor?',
      optionen: [
        'Die Festplatten werden formatiert; danach dürfen die Notebooks in den Restmüll.',
        'Die Notebooks werden wegen ihrer Kunststoffgehäuse über die Gelbe Tonne entsorgt.',
        'Die Datenträger werden nachweisbar sicher gelöscht oder vernichtet; die Geräte werden als Elektroaltgeräte getrennt erfasst und über einen zertifizierten Entsorger oder eine Rücknahmestelle verwertet.',
        'Die Akkus bleiben in den Geräten, damit die Notebooks gemeinsam mit dem Hausmüll verbrannt werden können.',
        'Die Notebooks werden ohne Löschung an Beschäftigte verschenkt, da diese zur Verschwiegenheit verpflichtet sind.',
      ],
      richtig: [2],
      erklaerung:
        'Elektroaltgeräte dürfen nicht in den Rest- oder Verpackungsmüll, sondern sind getrennt zu erfassen und fachgerecht zu verwerten (Elektro- und Elektronikgerätegesetz); Akkus werden separat entsorgt. ' +
        'Formatieren löscht Daten nicht sicher – personenbezogene Kundendaten müssen vorher nachweisbar gelöscht oder die Datenträger vernichtet werden.',
    },
  ],
};
