# Prüfbericht Glossar

Grundlage: `glossar-gesamt.json` (1108 Einträge aus drei Teilen). Ergebnis: `inhalte/glossar.json` mit **1098 Einträgen**, alphabetisch nach DIN 5007 (ä = a, ß = ss, Satzzeichen und Leerzeichen ignoriert).

## Zusammengeführt (10)

Das Synonym steht jetzt jeweils in der Erklärung, `sp` ist vereinigt.

- **Komponententest** ← Unit-Test (laut Katalog AP2-5-1-2 dasselbe; „meist automatisiert“ aus der Können-Aussage übernommen)
- **Zweigüberdeckung** ← Branch coverage (C1)
- **Anweisungsüberdeckung** ← Statement coverage (C0)
- **Syntaxfehler** (neuer Sammelbegriff) ← Formaler Fehler (AP1) + Syntaktischer Fehler (AP2)
- **Inhaltlicher Fehler** ← Semantischer Fehler
- **Übertragbarkeit** ← Portabilität
- **Benutzbarkeit** ← Usability
- **Übertragungsrate** ← Datenübertragungsrate (der Katalog verwendet „Übertragungsrate“ öfter)
- **Vertragsstrafe** ← Konventionalstrafe
- **Störungsmanagement** ← Incident Management

Geprüft und **nicht** zusammengeführt, weil es keine eigenen Doppel gab oder die Bedeutungen verschieden sind: Kohlendioxid-Löscher, Persönliche Schutzausrüstung, Predictive Maintenance, Kopfgesteuerte Schleife, Gleitkommazahl, Grundsatz der geringsten Rechte, Kapselung, Gesetzliche Unfallversicherung, Hexadezimalsystem, Boolescher Wert, Anwendungsfall, Breakpoint, Ausnahme (Exception), Arbeitsspeicher, CPU, Entwurfsmuster und Fremdvergabe kamen nur einmal vor. Schnittstelle (allgemein) und Interface (OOP) sind verschieden, ebenso Schwimmbahn und Partition (Datenträger), Schlechtleistung (Mängelart) und Mangelhafte Lieferung (Oberbegriff, wie in AP1-3-3-3) sowie Service Level 1 bis 3 und die einzelnen Support-Level.

Mehrdeutige Begriffe bekamen einen Zusatz: **Instanz (Organisation)** (sonst mit der OOP-Instanz verwechselbar), **Partition (Datenträger)** und **Update (Software)** (sonst doppelt mit `UPDATE`, wenn man Groß- und Kleinschreibung nicht unterscheidet).

## Fachliche Korrekturen (8)

- **Tunneling**: Die Erklärung sagte, dass Pakete beim Tunneling verschlüsselt werden. Tunneling heißt aber nur Kapseln. → Jetzt: Pakete werden in andere Pakete verpackt; beim VPN kommt die Verschlüsselung hinzu.
- **JAV**: Es fehlte die Altersgrenze. → Jetzt nach § 60 BetrVG: Arbeitnehmer unter 18 und Auszubildende unter 25 Jahren.
- **SOP**: Als Langform stand vorne „Standard Operation Procedure“. → Langform jetzt „Standard Operating Procedure“; die Erklärung sagt, dass der Prüfungskatalog „Standard Operation Procedure“ schreibt.
- **Kündigungsfrist**: Genannt war nur die Frist aus § 622 BGB (vier Wochen zum 15. oder zum Monatsende), obwohl der Eintrag auch in WISO-1-1-2 (Ausbildung) steht. → Jetzt ergänzt: Auszubildende, die nach der Probezeit die Ausbildung aufgeben oder den Beruf wechseln, kündigen mit einer Frist von vier Wochen ohne festen Endtermin (§ 22 BBiG).
- **Virtuelle Maschine**: Erklärt war nur die Laufzeitumgebung für Java. Der Eintrag „Virtueller Desktop“ meint aber eine virtualisierte Maschine. → Jetzt stehen beide Bedeutungen da.
- **Array** (auch AP1): Der Satz zu JSON setzte AP2-Wissen voraus. → Gestrichen, denn der Eintrag JSON erklärt das bereits.
- **Schnittstelle** (auch AP1): Der Zusatz zum OOP-Interface setzte AP2-Wissen voraus. → Gestrichen; dafür gibt es den Eintrag „Interface“.
- **Agentur für Arbeit**: Der Satz ließ sich so lesen, als sei die örtliche Agentur Träger der Arbeitslosenversicherung. → Klargestellt: Träger ist die Bundesagentur.

## Sonstiges

- **Qualitätsmanagement, Qualitätsmanagementsystem, Qualitätssicherung**: In `langform` stand die Abkürzung. Jetzt ist `langform` null, und die Abkürzung steht in der Erklärung („kurz QM“ usw.).
- **Endknoten**: Den verunglückten Satzteil habe ich neu formuliert („markiert im Zustandsdiagramm den Endzustand“).
- **Schwimmbahn** und **Objekt**: Die Verweise auf „Partition“ bzw. „Instanz“ sind jetzt eindeutig formuliert.
- `sp` ergänzt, wo der Begriff wörtlich im Rahmen oder in den Können-Aussagen steht: Kopfgesteuerte und Fußgesteuerte Schleife, Zählschleife (AP1-8-2-1), Endknoten (AP1-8-3-3), Inhaltlicher Fehler (AP2-5-2-3), Vertragsstrafe (AP2-7-1-1).
- Die übrigen 19 Einträge mit `neu_formuliert: true` habe ich einzeln geprüft; sie bleiben unverändert. Außerdem habe ich alle Abkürzungen, Ports, Paragraphen, Beträge, Fristen und Formeln durchgesehen und darüber hinaus keinen Fehler gefunden.

## Offene Zweifel (3)

1. **Schlechtleistung / Mangelhafte Lieferung**: Manche Lehrbücher verwenden „Schlechtleistung“ als Oberbegriff, also gleichbedeutend mit mangelhafter Lieferung. Das Glossar folgt der Inhaltsdatei (AP1-3-3-3), nach der Schlechtleistung eine der Mängelarten ist.
2. **Branchensoftware**: Nach dem Katalog zählen ERP, SCM und CRM dazu. In der Fachliteratur gelten ERP-Systeme meist als Standardsoftware. Ich habe den Eintrag beim Katalog belassen.
3. **Auffindbarkeit**: Sucht die App Glossarbegriffe wörtlich im Stichpunkttext, findet sie die eingegangenen Synonyme (Usability, Unit-Test, Incident Management, Portabilität, Konventionalstrafe, Datenübertragungsrate, branch/statement coverage, syntaktische, formale und semantische Fehler) nur noch über die Erklärung. Über `sp` sind sie weiter verknüpft.

## Prüfung per Skript

Gültiges JSON; alle `sp`-IDs stehen in der Inhaltsdatei; keine doppelten Begriffe, auch ohne Unterscheidung von Groß- und Kleinschreibung; jede Erklärung hat 1–2 Sätze und höchstens 240 Zeichen (die längste hat 228); keine geraden Anführungszeichen außerhalb von `Code`; „…“ ist überall gepaart.
