#!/usr/bin/env node
// Erzeugt je Paket eine lesbare Markdown-Datei für eine unabhängige Durchsicht:
// Vorgaben aus der Inhaltsdatei (Rahmen, Können-Aussagen) neben dem, was daraus
// geschrieben wurde (Blocksatz, Kurzfassung, Lernkarten, Glossar). Ohne Belege.
// Aufruf: node tools/pruefpakete.mjs  →  inhalte/pruefpakete/<paket>.md

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const wurzel = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const inhalt = JSON.parse(
  fs.readFileSync(
    path.join(wurzel, "Inhaltsdatei_AP1_AP2_tracker.json"),
    "utf8",
  ),
);
const blockById = new Map();
for (const teil of inhalt.struktur)
  for (const ordner of teil.ordner)
    for (const block of ordner.bloecke) blockById.set(block.id, block);

const VERMERK = {
  belegt: "Katalog oder Prüfung",
  in_pruefung_belegt: "nur Prüfung",
  abgeleitet: "abgeleitet",
  grundlage: "Grundlage",
};
const zitat = (text) =>
  String(text)
    .split("\n")
    .map((z) => `> ${z}`)
    .join("\n");

const ordnerLernen = path.join(wurzel, "inhalte/lernen");
const ziel = path.join(wurzel, "inhalte/pruefpakete");
fs.mkdirSync(ziel, { recursive: true });

for (const datei of fs
  .readdirSync(ordnerLernen)
  .filter((d) => d.endsWith(".json"))
  .sort()) {
  const paket = JSON.parse(
    fs.readFileSync(path.join(ordnerLernen, datei), "utf8"),
  );
  const karten = Map.groupBy(paket.karten ?? [], (k) => k.sp);
  const z = [`# Prüfpaket ${paket.paket}`, ""];
  z.push(
    "Jeder Stichpunkt zeigt zuerst die **Vorgabe** (Rahmen und Können-Aussagen aus der Inhaltsdatei),",
    "danach, was daraus für die App geschrieben wurde: **Kurzfassung** und **Lernkarten**.",
    "Am Ende stehen die Glossar-Einträge des Pakets.",
    "",
    "Vermerke an den Können-Aussagen:",
    "",
    ...Object.entries(VERMERK).map(
      ([k, name]) => `- *${name}*: ${inhalt.meta.vermerke[k]}`,
    ),
    "",
  );

  for (const [blockId, block] of Object.entries(paket.bloecke ?? {})) {
    z.push(
      `## ${blockId} ${blockById.get(blockId)?.titel ?? ""}`.trimEnd(),
      "",
      `**Blocksatz:** ${block.satz}`,
      "",
    );
    const sps = inhalt.stichpunkte
      .filter((s) => s.block_id === blockId)
      .sort((a, b) => a.position - b.position);
    for (const sp of sps) {
      const kurz = paket.stichpunkte?.[sp.id];
      z.push(
        `### ${sp.id} – ${sp.stichpunkt}`,
        "",
        `*Art:* ${sp.art}`,
        "",
        "**Vorgabe – Rahmen**",
        "",
        zitat(sp.rahmen),
        "",
      );
      z.push("**Vorgabe – Können-Aussagen**", "");
      for (const k of sp.koennen ?? [])
        z.push(
          `- \`${k.id.slice(sp.id.length + 1)}\` ${k.text} *(${VERMERK[k.vermerk] ?? k.vermerk})*`,
        );
      z.push("");
      if (kurz) {
        z.push(`**Kurzfassung – Ziel:** ${kurz.ziel}`, "");
        for (const p of kurz.punkte ?? []) z.push(`- ${p}`);
        z.push("");
      } else z.push("**Kurzfassung:** fehlt", "");
      const eigene = karten.get(sp.id) ?? [];
      z.push(`**Lernkarten (${eigene.length})**`, "");
      eigene.forEach((k, i) => {
        z.push(
          `${i + 1}. \`${k.id}\` **${k.vorne}**`,
          "",
          zitat(k.hinten).replace(/^/gm, "   "),
          "",
        );
      });
    }
  }

  if (paket.nicht_abgefragt?.length) {
    z.push("## Bewusst ohne Lernkarte", "");
    for (const n of paket.nicht_abgefragt) z.push(`- \`${n.k}\` ${n.grund}`);
    z.push("");
  }
  if (paket.glossar?.length) {
    z.push(`## Glossar (${paket.glossar.length})`, "");
    for (const g of paket.glossar)
      z.push(
        `- **${g.begriff}**${g.langform ? ` (${g.langform})` : ""}: ${g.erklaerung}`,
      );
    z.push("");
  }
  fs.writeFileSync(path.join(ziel, `${paket.paket}.md`), z.join("\n"));
}
console.log(`Prüfpakete geschrieben nach ${path.relative(wurzel, ziel)}/`);
