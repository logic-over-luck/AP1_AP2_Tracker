import json
W = "/home/claude/AP1_AP2_Tracker"
ALT = json.load(open("/tmp/claude-0/-home-claude/13347ac3-9c0f-5edb-a587-371f766f39ac/scratchpad/k/altkarten2.json", encoding="utf8"))

def bau(ordner, entsch=None, neu=None, nicht=None, unsicher=None, auff=None):
    entsch = entsch or {}; neu = neu or {}; nicht = nicht or {}; unsicher = unsicher or []; auff = auff or []
    lp = json.load(open(f"{W}/umbau/lernplan/pb2/{ordner}.json", encoding="utf8"))
    kinfo = {}; korder = []
    for t in lp["themenbloecke"]:
        for s in t["stichpunkte"]:
            for k in s["koennen"]:
                kinfo[k["id"]] = (s["id"], k["stufe"]); korder.append(k["id"])
    alt = ALT.get(ordner, [])
    altids = {c["id"] for c in alt}
    for i in entsch: assert i in altids, f"unbekannte alte Karte {i}"
    karten = []; prot = []; zahl = {"bleibt": 0, "bearbeitet": 0, "entfernt": 0, "neu": 0}; verschoben = 0
    for c in alt:
        e = entsch.get(c["id"])
        k = c["k"]
        if isinstance(e, str) and e.startswith("x:"):
            prot.append({"id": c["id"], "entscheidung": "entfernt", "grund": e[2:].strip()}); zahl["entfernt"] += 1; continue
        v, h, art, grund = c["v"], c["h"], "bleibt", "passt fachlich und zur Aussage, Tiefe stimmt"
        if isinstance(e, tuple):
            typ = e[0]
            if typ == "m":  # andere Aussage, Text bleibt
                k = e[1]; grund = e[2] if len(e) > 2 else "passt besser zu dieser Aussage, Text unverändert"; verschoben += 1
            elif typ in ("b", "bm"):
                if typ == "bm": k = e[1]; e = e[1:]; verschoben += 1
                nv, nh, grund = e[1], e[2], e[3]
                v = nv or v; h = nh or h; art = "bearbeitet"
                assert (v, h) != (c["v"], c["h"]), c["id"]
        assert k in kinfo, (c["id"], k)
        karten.append({"id": c["id"], "sp": kinfo[k][0], "k": k, "vorne": v, "hinten": h})
        prot.append({"id": c["id"], "entscheidung": art, "grund": grund}); zahl[art] += 1
    for kid, liste in neu.items():
        assert kid in kinfo, kid
        for i, (v, h) in enumerate(liste, 1):
            cid = f"{kid}-{i}"
            karten.append({"id": cid, "sp": kinfo[kid][0], "k": kid, "vorne": v, "hinten": h})
            prot.append({"id": cid, "entscheidung": "neu", "grund": "Aussage hatte zu wenig oder keine passende Karte"}); zahl["neu"] += 1
    pos = {k: i for i, k in enumerate(korder)}
    karten.sort(key=lambda c: (pos[c["k"]], 0 if c["id"].startswith("AP2") else 1))
    ohne = [k for k in korder if not any(c["k"] == k for c in karten) and k not in nicht]
    assert not ohne, f"{ordner}: Aussagen ohne Karte: {ohne}"
    out = {"ordner": ordner, "stand": "2026-10-14", "auftrag": "umbau/auftraege/AP1-karten.md (für PB2 sinngemäß)",
           "grundlage": f"umbau/lernplan/pb2/{ordner}.json", "karten": karten,
           "nicht_abgefragt": [{"k": k, "grund": g} for k, g in nicht.items()], "unsicher": unsicher, "protokoll": prot}
    json.dump(out, open(f"{W}/umbau/karten/pb2/{ordner}.json", "w", encoding="utf8"), ensure_ascii=False, indent=2)
    # Bericht
    st = {}
    for k in korder:
        s = kinfo[k][1]; a, n = st.get(s, (0, 0)); st[s] = (a + 1, n + sum(1 for c in karten if c["k"] == k))
    vorher_ohne = sum(1 for k in korder if not any(c["k"] == k for c in alt))
    titel = lp["oberblock"]["titel"]
    zeile = f"**{ordner} Karten: {zahl['bleibt']} bleiben, {zahl['bearbeitet']} bearbeitet, {zahl['entfernt']} entfernt, {zahl['neu']} neu**"
    md = [f"# {ordner} Karten – {titel}", "", f"Stand: 14.10.2026 · Vorgehen wie `umbau/auftraege/AP1-karten.md` · Ergebnis `umbau/karten/pb2/{ordner}.json`", "", zeile, "",
          "## Zahlen", "", "| Entscheidung | Karten |", "|---|---|"] + [f"| {a} | {zahl[a]} |" for a in ["bleibt", "bearbeitet", "entfernt", "neu"]] + [
          f"| **alte AP2-Karten (Zielordner {ordner})** | **{len(alt)}** |", f"| **Karten danach** | **{len(karten)}** |", "",
          f"Davon innerhalb des Ordners an eine andere Aussage gehängt (ID bleibt): {verschoben}.",
          f"Können-Aussagen: {len(korder)}; mit Karte: {len(korder) - len(nicht)}; in `nicht_abgefragt`: {len(nicht)}; vorher ohne passende Karte: {vorher_ohne}. Unsicher: {len(unsicher)}.", "",
          "| Stufe | Aussagen | Karten |", "|---|---|---|"] + [f"| {s} | {st[s][0]} | {st[s][1]} |" for s in sorted(st)] + ["", "## Auffälligkeiten", ""] + ([f"- {a}" for a in auff] or ["keine"]) + [""]
    open(f"{W}/umbau/berichte/{ordner}-karten.md", "w", encoding="utf8").write("\n".join(md))
    print(zeile.strip("*"))
