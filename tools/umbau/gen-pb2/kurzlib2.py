import json, sys
HINWEIS = "teaser: je Stichpunkt ein kurzer Einstieg, worum es geht (Kurzfassung). erklaerung: je Können-Aussage die ausführliche Erklärung (Langfassung), in der App an der Aussage aufklappbar. Auszeichnung wie bei Lernkarten: Zeilen mit „- “ als Liste, **fett**, `Code`."
def schreibe(ordner, teaser, erkl):
    lp = json.load(open(f"/home/claude/AP1_AP2_Tracker/umbau/lernplan/pb2/{ordner}.json", encoding="utf8"))
    sps = [s for t in lp["themenbloecke"] for s in t["stichpunkte"]]
    ks = [k["id"] for s in sps for k in s["koennen"]]
    T = {}; E = {}
    for i, s in enumerate(sps): T[s["id"]] = teaser[i]
    assert len(teaser) == len(sps), (len(teaser), len(sps))
    assert len(erkl) == len(ks), (len(erkl), len(ks))
    for kid, e in zip(ks, erkl): E[kid] = e.strip()
    out = {"ordner": ordner, "stand": "2026-10-14", "grundlage": f"umbau/lernplan/pb2/{ordner}.json", "hinweis": HINWEIS, "teaser": T, "erklaerung": E}
    json.dump(out, open(f"/home/claude/AP1_AP2_Tracker/umbau/kurz/pb2/{ordner}.json", "w", encoding="utf8"), ensure_ascii=False, indent=2)
    print(ordner, len(T), "Teaser,", len(E), "Erklärungen")
