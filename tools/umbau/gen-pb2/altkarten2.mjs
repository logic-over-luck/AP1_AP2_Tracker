import { ladeDaten } from '/home/claude/AP1_AP2_Tracker/tools/daten.mjs';
import fs from 'node:fs';
const W='/home/claude/AP1_AP2_Tracker';
const plaene=fs.readdirSync(`${W}/umbau/lernplan/pb2`).map(f=>JSON.parse(fs.readFileSync(`${W}/umbau/lernplan/pb2/${f}`,'utf8')));
const altNeu=new Map(plaene.flatMap(p=>p.alt_neu.koennen.map(a=>[a.alt,a])));
const kSp=new Map(); for(const p of plaene) for(const t of p.themenbloecke) for(const s of t.stichpunkte) for(const k of s.koennen) kSp.set(k.id,s.id);
const d=ladeDaten(W); const out={};
for(const k of d.karten){ if(!k.sp.startsWith('AP2')||!k.k) continue; const a=altNeu.get(k.k); if(!a||!a.neu||a.status==='PB2'||a.status==='gestrichen') continue;
 const sp=kSp.get(a.neu); const o=sp.split('-').slice(0,2).join('-'); (out[o]??=[]).push({id:k.id,v:k.v,h:k.h,k:a.neu,sp});}
fs.writeFileSync(process.argv[2], JSON.stringify(out));
console.log(Object.fromEntries(Object.entries(out).map(([o,l])=>[o,l.length])));
console.log('ohne k:', d.karten.filter(k=>k.sp.startsWith('AP2')&&!k.k).length);
