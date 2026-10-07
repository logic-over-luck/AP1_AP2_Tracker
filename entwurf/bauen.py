#!/usr/bin/env python3
"""Baut den Design-Entwurf: bettet die AP1-Daten in die Vorlage ein.

Aufruf:  python3 entwurf/bauen.py
Ergebnis: entwurf/ap1-entwurf.html (ohne Server im Browser zu öffnen)

Liegt im Hauptverzeichnis die Datei Kurzfassung_AP1_AP2_tracker.json, nimmt die
Seite deren Kurzformen. Sonst kürzt das Skript als Platzhalter selbst (erster Satz
des Rahmens, die ersten drei Können-Aussagen) und die Seite kennzeichnet das.

Mit --nur-inhalt PFAD wird zusätzlich eine Fassung ohne <html>/<head>/<body>
geschrieben (zum Veröffentlichen als Artifact).
"""
import json
import re
import pathlib
import sys

HIER = pathlib.Path(__file__).resolve().parent
QUELLE = HIER.parent / "Inhaltsdatei_AP1_AP2_tracker.json"
KURZ = HIER.parent / "Kurzfassung_AP1_AP2_tracker.json"
VORLAGE = HIER / "vorlage.html"
ZIEL = HIER / "ap1-entwurf.html"
TRENNER = "<!--KOERPER-->"


ANFANG = re.compile(r"^Du (kannst|kennst|weißt|verstehst|unterscheidest) ")


def platzhalter(s):
    """Grobe Kürzung, bis die echte Kurzfassung da ist."""
    satz = re.split(r"(?<=[.!?])\s+(?=[A-ZÄÖÜ])", s["rahmen"].strip())[0]
    koennen = []
    for k in s["koennen"][:3]:
        t = ANFANG.sub("", k["text"]).rstrip(".")
        koennen.append(t[:1].upper() + t[1:])
    return {"rahmen": satz, "koennen": koennen, "auto": True}


def kurzfassungen():
    if not KURZ.exists():
        return {}
    k = json.loads(KURZ.read_text("utf-8"))["stichpunkte"]
    return {
        i: {"rahmen": v["rahmen_kurz"], "koennen": [x["text"] for x in v["koennen_kurz"]], "auto": False}
        for i, v in k.items()
    }


def ap1_daten():
    """Nur der Teil AP1 und nur die Felder, die die Seite anzeigt."""
    d = json.loads(QUELLE.read_text("utf-8"))
    sp = {s["id"]: s for s in d["stichpunkte"]}
    kurz = kurzfassungen()
    teil = next(t for t in d["struktur"] if t["teil"] == "AP1")
    return {
        "teil": "AP1",
        "titel": teil["titel"],
        "ordner": [
            {
                "id": o["id"],
                "titel": o["titel"],
                "bloecke": [
                    {
                        "id": b["id"],
                        "titel": b["titel"],
                        "stichpunkte": [
                            {
                                "id": i,
                                "titel": sp[i]["stichpunkt"],
                                "art": sp[i]["art"],
                                "kurz": kurz.get(i) or platzhalter(sp[i]),
                            }
                            for i in b["stichpunkte"]
                        ],
                    }
                    for b in o["bloecke"]
                ],
            }
            for o in teil["ordner"]
        ],
    }


def main():
    js = json.dumps(ap1_daten(), ensure_ascii=False, separators=(",", ":"))
    js = js.replace("</", "<\\/")
    inhalt = VORLAGE.read_text("utf-8").replace("/*__DATEN__*/null", js)
    kopf, koerper = inhalt.split(TRENNER, 1)

    ZIEL.write_text(
        "<!doctype html>\n<html lang=\"de\">\n<head>\n<meta charset=\"utf-8\">\n"
        "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n"
        + kopf.strip() + "\n</head>\n<body>\n" + koerper.strip() + "\n</body>\n</html>\n",
        "utf-8",
    )
    print("geschrieben:", ZIEL.relative_to(HIER.parent))

    if "--nur-inhalt" in sys.argv:
        pfad = pathlib.Path(sys.argv[sys.argv.index("--nur-inhalt") + 1])
        pfad.write_text(kopf.strip() + "\n" + koerper.strip() + "\n", "utf-8")
        print("geschrieben:", pfad)


if __name__ == "__main__":
    main()
