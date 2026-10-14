"""Hilfsbibliothek: Lernplan-Ordner für PB1 als JSON erzeugen (Format wie umbau/lernplan/ap1/*.json).
Labels statt IDs: Können und Stichpunkte bekommen kurze Labels, die in alt_neu, R3 und R4 aufgelöst werden."""
import json, os

class LP:
    def __init__(self, oid, titel, raum, gebiete):
        self.oid = oid
        self.ob = {"id": oid, "titel": titel, "raum": raum, "gebiete": gebiete}
        self.tbs = []
        self.lab = {}       # label -> id (Können oder Stichpunkt)
        self.alt = []
        self.rahmen = []
        self.r3 = []
        self.r4 = []
        self.cur_tb = None
        self.cur_sp = None

    def tb(self, titel, satz):
        t = {"id": f"{self.oid}-{len(self.tbs)+1}", "titel": titel, "satz": satz, "stichpunkte": []}
        self.tbs.append(t); self.cur_tb = t
        return t

    def sp(self, label, titel, ziel, gebiete, bausteine, teilaufgaben, baut_auf=None, hinweis=None):
        t = self.cur_tb
        s = {"id": f"{t['id']}-{len(t['stichpunkte'])+1}", "titel": titel, "ziel": ziel, "gebiete": gebiete,
             "bausteine": [({"id": b[0], "anteil": b[1]} if isinstance(b, tuple) else {"id": b}) for b in bausteine],
             "teilaufgaben": teilaufgaben, "koennen": []}
        if baut_auf: s["baut_auf"] = baut_auf
        if hinweis: s["hinweis"] = hinweis
        t["stichpunkte"].append(s); self.cur_sp = s
        assert label not in self.lab, label
        self.lab[label] = s["id"]
        return s

    def k(self, label, text, stufe, herkunft, vorgegeben=None):
        s = self.cur_sp
        kk = {"id": f"{s['id']}-K{len(s['koennen'])+1}", "text": text, "stufe": stufe, "herkunft": herkunft}
        if vorgegeben: kk["vorgegeben"] = vorgegeben
        s["koennen"].append(kk)
        assert label not in self.lab, label
        self.lab[label] = kk["id"]

    def grenze(self, text, begruendung, katalog):
        self.cur_sp.setdefault("grenzen", []).append({"text": text, "begruendung": begruendung, "katalog": katalog})

    def kuer(self, text, quellen, grund):
        self.cur_sp.setdefault("kuer", []).append({"text": text, "quellen": quellen, "grund": grund})

    def a(self, alt, status, ziel=None, grund=""):
        self.alt.append((alt, status, ziel, grund))

    def themen(self, thema, quellen, ring, wo, notiz=None):
        self.r3.append((thema, quellen, ring, wo, notiz))

    def gesch(self, katalog, paar, abgedeckt):
        self.r4.append((katalog, paar, abgedeckt))

    def _r(self, x):
        return self.lab.get(x, x)

    def write(self, path, meta):
        an = []
        for alt, status, ziel, grund in self.alt:
            e = {"alt": alt, "status": status}
            if ziel: e["neu"] = self._r(ziel)
            if grund: e["grund"] = grund
            an.append(e)
        meta = dict(meta)
        if self.r3:
            meta["hinweisabgleich"]["themen"] = [
                {"thema": t, "quellen": q, "ring": r, "wo": [self._r(w) for w in wo], **({"notiz": n} if n else {})}
                for t, q, r, wo, n in self.r3]
        if self.r4:
            meta["geschwister"] = [{"katalog": k, "paar": p, "abgedeckt": {s: [self._r(x) for x in ids] for s, ids in ab.items()}}
                                   for k, p, ab in self.r4]
        out = {"oberblock": self.ob, "themenbloecke": self.tbs, "alt_neu": {"koennen": an, "rahmen": self.rahmen}, "meta": meta}
        os.makedirs(os.path.dirname(path), exist_ok=True)
        json.dump(out, open(path, "w", encoding="utf8"), ensure_ascii=False, indent=1)
        n = sum(len(s["koennen"]) for t in self.tbs for s in t["stichpunkte"])
        print(f"{self.oid}: {len(self.tbs)} Themenblöcke, {sum(len(t['stichpunkte']) for t in self.tbs)} Stichpunkte, {n} Können")

QUELLEN = {
    "podcast:themen-pb1": "IT-Berufe-Podcast (Stefan Macke): Seite „Themen der schriftlichen IHK-Prüfungen der IT-Berufe“, Schlagworte zu „Planen eines Softwareproduktes“ (AP2 FIAE) je Termin Winter 2021/22 bis Winter 2025/26 (abgerufen 14.10.2026)",
    "podcast:themen-ap2": "IT-Berufe-Podcast: Seite „Mögliche Themen von Teil 2 der gestreckten Abschlussprüfung (GAP) für Fachinformatiker Anwendungsentwicklung“, Stand 15.06.2026, Themencluster bis einschließlich UML (der Rest der Seite war nicht abrufbar; abgerufen 14.10.2026)",
}

QUELLEN_PB2 = {
    "podcast:themen-pb2": "IT-Berufe-Podcast (Stefan Macke): Seite „Themen der schriftlichen IHK-Prüfungen der IT-Berufe“, Schlagworte zu „Entwicklung und Umsetzung von Algorithmen“ (AP2 FIAE) je Termin Winter 2021/22 bis Winter 2025/26 (abgerufen 14.10.2026)",
}

def meta(stand="2026-10-14", hinweis="", kerntest="", umfang="ganzer Ordner", quellen=None):
    return {
        "schicht": "3+4", "regelwerk_version": "1.7" if quellen is QUELLEN_PB2 else "1.6", "stand": stand,
        "hinweis": hinweis or "PB1-Ordner nach dem Muster von AP1 (UMBAU.md Schritt 6). Neue IDs nach P33; alte AP2-Aussagen stehen in alt_neu. Inhalte aus AP1 werden mit baut_auf importiert (E2), neu geschrieben wird nur, was PB1 neu oder tiefer verlangt.",
        "kerntest": {"stand": stand, "art": "Selbstprüfung in der bauenden Sitzung (nicht unabhängig)", "ergebnis": kerntest},
        "hinweisquellen": quellen or QUELLEN,
        "hinweisabgleich": {"stand": stand, "umfang": umfang,
            "vorgehen": "Jedes in den Hinweisquellen genannte Thema dieses Ordners nach R1 geprüft: Kern (Katalogwortlaut oder Beleg) → Puffer (P-Regel) → Außen (Katalogstelle schließt aus) → sonst Kür. Themen anderer Ordner oder Räume stehen als Ring „Ordner“.",
            "themen": []},
    }
