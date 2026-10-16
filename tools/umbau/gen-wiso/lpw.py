"""Hilfsbibliothek für die WiSo-Lernpläne (Umbau-Schritt 6, WISO).

Anders als lp.py (PB1/PB2) mit festen IDs: WISO behält die alten IDs übernommener und angepasster
Stichpunkte und Können-Aussagen (P15, P48). Neue Aussagen bekommen die nächste freie Nummer, die in der
alten Inhaltsdatei nie vergeben war.

Kurzschreibweisen:
  B("2021W-A1")      -> "beleg:2021W-WISO-A1"     (Herkunft aus einer Teilaufgabe)
  T("2021W-A1", …)   -> ["2021W-WISO-A1", …]       (Teilaufgaben eines Stichpunkts)
  K("WISO.01.01.1")  -> "katalog:WISO.01.01.1"
  R("P-GRUNDLAGE")   -> "regel:P-GRUNDLAGE"
Aufruf im Repo-Wurzelverzeichnis: python3 tools/umbau/gen-wiso/wiso_1.py
"""
import json, os

def B(x):
    t, a = x.split("-", 1)
    return f"beleg:{t}-WISO-{a}"

def T(*xs):
    return [f"{x.split('-', 1)[0]}-WISO-{x.split('-', 1)[1]}" for x in xs]

def K(x):
    return f"katalog:{x}"

def R(x):
    return f"regel:{x}"

ALT = json.load(open("Inhaltsdatei_AP1_AP2_tracker.json", encoding="utf8"))
ALT_K = {k["id"]: k["text"] for s in ALT["stichpunkte"] if s["teil"] == "WISO" for k in s["koennen"]}
ALT_SP = {s["id"]: s for s in ALT["stichpunkte"] if s["teil"] == "WISO"}


class LPW:
    def __init__(self, oid, titel, gebiete):
        self.oid = oid
        self.ob = {"id": oid, "titel": titel, "raum": "WISO", "gebiete": gebiete}
        self.tbs, self.alt, self.rahmen, self.r4, self.r3 = [], [], [], [], []
        self.cur_tb = self.cur_sp = None

    def tb(self, tid, titel, satz):
        t = {"id": tid, "titel": titel, "satz": satz, "stichpunkte": []}
        self.tbs.append(t); self.cur_tb = t

    def sp(self, sid, titel, ziel, gebiete, bausteine, teilaufgaben, baut_auf=None, hinweis=None):
        s = {"id": sid, "titel": titel, "ziel": ziel, "gebiete": gebiete,
             "bausteine": [({"id": b[0], "anteil": b[1]} if isinstance(b, tuple) else {"id": b}) for b in bausteine],
             "teilaufgaben": teilaufgaben, "koennen": []}
        if baut_auf: s["baut_auf"] = baut_auf
        if hinweis: s["hinweis"] = hinweis
        self.cur_tb["stichpunkte"].append(s); self.cur_sp = s

    def k(self, nr, text, stufe, herkunft, neu=None, vorgegeben=None, alt=None):
        """nr: Nummer der Aussage im aktuellen Stichpunkt (K<nr>).
        alt: (status, grund) für die alte Aussage mit derselben ID – 'übernommen' oder 'angepasst'.
        Ohne alt gilt: gibt es die ID in der alten Inhaltsdatei, wird sie automatisch als übernommen
        (gleicher Text) oder angepasst eingetragen."""
        s = self.cur_sp
        kid = f"{s['id']}-K{nr}"
        kk = {"id": kid, "text": text, "stufe": stufe, "herkunft": herkunft}
        if neu: kk["neu"] = {"gegenueber": neu[0], "was": neu[1]}
        if vorgegeben: kk["vorgegeben"] = vorgegeben
        s["koennen"].append(kk)
        if kid in ALT_K:
            if alt:
                self.a(kid, alt[0], kid, alt[1])
            else:
                same = ALT_K[kid].strip() == text.strip()
                self.a(kid, "übernommen" if same else "angepasst", kid, "" if same else "Wortlaut, Operator (F1) und Herkunft nach Regelwerk v1.8")
        return kid

    def grenze(self, text, begruendung, katalog):
        self.cur_sp.setdefault("grenzen", []).append({"text": text, "begruendung": begruendung, "katalog": katalog})

    def kuer(self, text, quellen, grund):
        self.cur_sp.setdefault("kuer", []).append({"text": text, "quellen": quellen, "grund": grund})

    def kuer_pruefer(self, sid, thema, text, grund):
        """Kür aus der unabhängigen Prüfung (P49): Eintrag am Stichpunkt sid und Thema im Hinweis-Abgleich (R3)."""
        sp = next(s for t in self.tbs for s in t["stichpunkte"] if s["id"] == sid)
        sp.setdefault("kuer", []).append({"text": text, "quellen": [PRUEFER], "grund": grund})
        self.r3.append({"thema": thema, "quellen": [PRUEFER], "ring": "Kür", "wo": [sid], "notiz": "Kür-Vorschlag der unabhängigen Prüfung (P49)"})

    def a(self, alt, status, ziel=None, grund=""):
        assert alt in ALT_K, f"keine alte Aussage {alt}"
        assert not any(x[0] == alt for x in self.alt), f"{alt} doppelt einsortiert"
        self.alt.append((alt, status, ziel, grund))

    def rahmen_satz(self, alt, satz, status, grund):
        self.rahmen.append({"alt": alt, "satz": satz, "status": status, "grund": grund})

    def gesch(self, katalog, paar, abgedeckt):
        self.r4.append({"katalog": katalog, "paar": paar, "abgedeckt": abgedeckt})

    def write(self, meta):
        ordner_alt = [kid for kid in ALT_K if kid.startswith(self.oid + "-")]
        fehlt = [x for x in ordner_alt if not any(a[0] == x for a in self.alt)]
        assert not fehlt, f"alte Aussagen nicht einsortiert: {fehlt}"
        an = []
        for alt, status, ziel, grund in self.alt:
            e = {"alt": alt, "status": status}
            if ziel: e["neu"] = ziel
            e["grund"] = grund
            an.append(e)
        meta = dict(meta)
        if self.r4: meta["geschwister"] = self.r4
        if self.r3:
            ha = dict(meta["hinweisabgleich"])
            ha["vorgehen"] = VORGEHEN_P49
            ha["themen"] = self.r3
            meta["hinweisabgleich"] = ha
        out = {"oberblock": self.ob, "themenbloecke": self.tbs, "alt_neu": {"koennen": an, "rahmen": self.rahmen}, "meta": meta}
        path = f"umbau/lernplan/wiso/{self.oid}.json"
        os.makedirs(os.path.dirname(path), exist_ok=True)
        json.dump(out, open(path, "w", encoding="utf8"), ensure_ascii=False, indent=1)
        n = sum(len(s["koennen"]) for t in self.tbs for s in t["stichpunkte"])
        print(f"{self.oid}: {len(self.tbs)} Themenblöcke, {sum(len(t['stichpunkte']) for t in self.tbs)} Stichpunkte, {n} Können")


PRUEFER = "pruefer:wiso-2026-10"

QUELLEN = {
    PRUEFER: "Unabhängige Prüfung WiSo vom 16.10.2026 (Berichte umbau/berichte/WISO-<n>-pruefer.md, Bilanz WISO-pruefer-bilanz.md): Kür-Vorschläge zum aktuellen Rechtsstand und zu üblichen Detailfragen; als Hinweisquelle zugelassen nach Entscheidung des Projektinhabers (P49, wie P30).",
    "podcast:themen-wiso": "IT-Berufe-Podcast (Stefan Macke): Seite „Themen der schriftlichen IHK-Prüfungen der IT-Berufe“ (abgerufen 16.10.2026). Für WiSo stehen dort nur Schlagworte zu Winter 2015/16 (Elternzeit, Betriebsrat, Streik, Wirtschaftskreislauf, Schilder); für die Termine 2021–2026 gibt es keine WiSo-Schlagworte.",
}


VORGEHEN_P49 = "Hinweisquellen nach R3 gesucht: Der IT-Berufe-Podcast nennt für die WiSo-Termine 2021–2026 keine Schlagworte; die Community-Lernzettel lagen nicht vor. Abgeglichen sind die Kür-Vorschläge der unabhängigen Prüfung (P49); liegen die Lernzettel vor, wird R3 nachgeholt."


def meta(kerntest, hinweis=""):
    return {
        "schicht": "3+4", "regelwerk_version": "1.8", "stand": "2026-10-16",
        "hinweis": hinweis or "WiSo-Ordner (UMBAU.md Schritt 6). ID-Erhalt wie AP1 (P15, P48). Inhalte früherer Räume werden mit baut_auf importiert (E2); WiSo-Bausteine, die ein früherer Raum schon lehrt, stehen in umbau/regeln/wiso-deckung.json (P47). Stufe der WiSo-Aufgaben nach Z3b (P46).",
        "kerntest": {"stand": "2026-10-16", "art": "Selbstprüfung in der bauenden Sitzung (nicht unabhängig)", "ergebnis": kerntest},
        "hinweisquellen": QUELLEN,
        "hinweisabgleich": {"stand": "2026-10-16", "umfang": "ganzer Ordner",
            "vorgehen": "Hinweisquellen nach R3 gesucht: Der IT-Berufe-Podcast nennt für die WiSo-Termine 2021–2026 keine Schlagworte; die Community-Lernzettel lagen dieser Sitzung nicht vor (Parkplatz P49). Kein Thema abzugleichen.",
            "themen": []},
    }
