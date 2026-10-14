// node dump.mjs PB1-3 [--karten]  : kompakte Sicht auf Ordner mit alten Karten
import { ladeDaten } from '/home/claude/AP1_AP2_Tracker/tools/daten.mjs';
import fs from 'node:fs';
const W='/home/claude/AP1_AP2_Tracker';
const o=process.argv[2]; const mitK=process.argv.includes('--karten');
const lp=JSON.parse(fs.readFileSync(`${W}/umbau/lernplan/pb2/${o}.json`,'utf8'));
const alle=[]; for(const f of fs.readdirSync(`${W}/umbau/lernplan/pb2`)) alle.push(JSON.parse(fs.readFileSync(`${W}/umbau/lernplan/pb2/${f}`,'utf8')));
const altNeu=new Map(alle.flatMap(p=>p.alt_neu.koennen.map(a=>[a.alt,a])));
const d=ladeDaten(W);
const jeK=new Map();
for(const k of d.karten){ if(!k.sp.startsWith('AP2')||!k.k) continue; const a=altNeu.get(k.k); if(!a||!a.neu||a.status==='PB2'||a.status==='gestrichen') continue; (jeK.get(a.neu)??jeK.set(a.neu,[]).get(a.neu)).push(k);}
let n=0;
for(const t of lp.themenbloecke){ console.log(`## ${t.id} ${t.titel}`);
 for(const s of t.stichpunkte){ console.log(`\n### ${s.id} ${s.titel}\nZiel: ${s.ziel}${s.hinweis?'\nHinweis: '+s.hinweis:''}${s.baut_auf?'\nbaut_auf: '+s.baut_auf.join(', '):''}`);
  for(const g of s.grenzen??[]) console.log(`Grenze: ${g.text}`);
  for(const k of s.koennen){ console.log(`- ${k.id} [${k.stufe}] ${k.text}${k.vorgegeben?' (vorgegeben: '+k.vorgegeben+')':''}`);
   if(mitK) for(const c of jeK.get(k.id)??[]){ n++; console.log(`    · ${c.id} | ${c.v} || ${c.h.replace(/\n/g,' / ')}`);} }
 }}
if(mitK) console.log('\nalte Karten:',n);
