import { test } from 'node:test';
import assert from 'node:assert/strict';
import { berechne, erzeuge, liesWeg, anordnen, pfeile } from '../src/bereiche/trainer/netzplan/plan.js';
import * as n from '../src/bereiche/trainer/netzplan/aufgaben.js';
import { zufall } from '../src/bereiche/trainer/rahmen/zufall.js';
import { pruefeErzeuger } from './hilfen/erzeuger.mjs';

test('Netzplan: Beispiel von Hand gerechnet', () => {
  // A(3) → B(4), C(2); B → D(5); C → D; D → E(1)
  const p = berechne([
    { id: 'A', dauer: 3, vorgaenger: [] },
    { id: 'B', dauer: 4, vorgaenger: ['A'] },
    { id: 'C', dauer: 2, vorgaenger: ['A'] },
    { id: 'D', dauer: 5, vorgaenger: ['B', 'C'] },
    { id: 'E', dauer: 1, vorgaenger: ['D'] },
  ]);
  const w = Object.fromEntries(p.vorgaenge.map((v) => [v.id, [v.faz, v.fez, v.saz, v.sez, v.gp, v.fp]]));
  assert.deepEqual(w.A, [0, 3, 0, 3, 0, 0]);
  assert.deepEqual(w.B, [3, 7, 3, 7, 0, 0]);
  assert.deepEqual(w.C, [3, 5, 5, 7, 2, 2]);
  assert.deepEqual(w.D, [7, 12, 7, 12, 0, 0]);
  assert.deepEqual(w.E, [12, 13, 12, 13, 0, 0]);
  assert.equal(p.dauer, 13);
  assert.deepEqual(p.kritisch, [['A', 'B', 'D', 'E']]);
});

test('Freier Puffer kleiner als Gesamtpuffer bei Ketten', () => {
  // A(2) → B(1) → C(1) → E ; A → D(6) → E(1)
  const p = berechne([
    { id: 'A', dauer: 2, vorgaenger: [] },
    { id: 'B', dauer: 1, vorgaenger: ['A'] },
    { id: 'C', dauer: 1, vorgaenger: ['B'] },
    { id: 'D', dauer: 6, vorgaenger: ['A'] },
    { id: 'E', dauer: 1, vorgaenger: ['C', 'D'] },
  ]);
  const B = p.vorgaenge.find((v) => v.id === 'B');
  const C = p.vorgaenge.find((v) => v.id === 'C');
  assert.equal(B.gp, 4);
  assert.equal(B.fp, 0);
  assert.equal(C.gp, 4);
  assert.equal(C.fp, 4);
});

test('Erzeugte Netzpläne sind gültig: ein Start, ein Ende, Puffer ≥ 0, FP ≤ GP', () => {
  for (let s = 1; s < 500; s++) {
    const { vorgaenge } = erzeuge(zufall(s), { min: 6, max: 10 });
    const p = berechne(vorgaenge);
    assert.equal(p.vorgaenge.filter((v) => !v.vorgaenger.length).length, 1);
    assert.equal(p.vorgaenge.filter((v) => !v.nachfolger.length).length, 1);
    for (const v of p.vorgaenge) {
      assert.ok(v.gp >= 0 && v.fp >= 0 && v.fp <= v.gp, `${s} ${v.id}`);
      assert.equal(v.sez - v.fez, v.gp);
    }
    assert.ok(p.kritisch.length >= 1);
    for (const w of p.kritisch) assert.equal(w.reduce((a, id) => a + p.vorgaenge.find((v) => v.id === id).dauer, 0), p.dauer);
  }
});

test('Kritischen Weg lesen', () => {
  assert.deepEqual(liesWeg('a - c, f'), ['A', 'C', 'F']);
  assert.deepEqual(liesWeg('A→C→F'), ['A', 'C', 'F']);
});

test('Netzplan: alle Erzeuger', () => {
  for (const [name, f] of Object.entries(n.ERZEUGER)) {
    pruefeErzeuger(name, f, 'AP1');
    pruefeErzeuger(name, f, 'AP2');
  }
});

test('Netzplan-Pfeile: rechtwinklig, von Vorgänger rechts zu Nachfolger links, keiner läuft durch einen Knoten', () => {
  const G = { KB: 176, KH: 112, AX: 80, AY: 32 };
  for (let s = 1; s <= 300; s++) {
    const { vorgaenge } = erzeuge(zufall(s), { min: 6, max: 10 });
    const a = anordnen(vorgaenge);
    const xy = (id) => {
      const p = a.pos.get(id);
      return { x: p.x * (G.KB + G.AX), y: p.y * (G.KH + G.AY) + ((a.zeilen - p.anzahl) * (G.KH + G.AY)) / 2 };
    };
    const kasten = vorgaenge.map((v) => ({ id: v.id, ...xy(v.id) }));
    for (const p of pfeile(a, G)) {
      const teile = p.d.match(/[MHV][^MHV]+/g);
      let [x, y] = teile[0].slice(1).trim().split(/\s+/).map(Number);
      assert.equal(x, xy(p.von).x + G.KB, `${s} ${p.von}->${p.nach}: Start`);
      for (const t of teile.slice(1)) {
        const w = Number(t.slice(1));
        const [nx, ny] = t[0] === 'H' ? [w, y] : [x, w];
        // Strecke darf keinen fremden Knoten schneiden
        for (const k of kasten) {
          const innen = Math.min(x, nx) < k.x + G.KB - 1 && Math.max(x, nx) > k.x + 1 && Math.min(y, ny) < k.y + G.KH - 1 && Math.max(y, ny) > k.y + 1;
          assert.ok(!innen, `${s} ${p.von}->${p.nach} schneidet ${k.id}`);
        }
        [x, y] = [nx, ny];
      }
      assert.equal(x, xy(p.nach).x - 2, `${s} ${p.von}->${p.nach}: Ende`);
      assert.equal(y, xy(p.nach).y + G.KH / 2);
    }
  }
});
