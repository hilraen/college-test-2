#!/usr/bin/env node

import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const fileName = process.argv[2];
const content = fs.readFileSync(path.join(
  __dirname,
  fileName
), 'utf-8');

// BEGIN
const data = content
  .trim()
  .split('\r\n')
  .slice(1);
const diffUnitsCount = data.length;
console.log(`Количество видов существ: ${diffUnitsCount}`);

const mapped = data
  .map((a) => a.slice(2, a.length - 2))
  .map((s) => s.split(' | '));
const strongest = [];
const weakest = [];
let strength = 0;
let weakness = 100;
for (let creatures of mapped) {
  if (creatures[1] > strength) {
    strength = creatures[1];
    strongest[0] = creatures;
  } else if (creatures[1] < weakness) {
    weakness = creatures[1];
    weakest[0] = creatures;
  }
}
const normalisedStrongest = strongest.flat();
const normalisedWeakest = weakest.flat();
const tenStrongestCost = normalisedStrongest[6] * 10;
const twentyWeakestCost = normalisedWeakest[6] * 20;
console.log(`Стоимость найма 10 самых сильных: ${tenStrongestCost}. Стоимость найма 20 самых слабых: ${twentyWeakestCost}`);

const fattest = [];
const thinnest = [];
let fat = 0;
let thin = 1000;
for (let units of mapped) {
  if (Number(units[2]) > fat) {
    fat = Number(units[2]);
    fattest[0] = units;
  } else if (Number(units[2]) < thin) {
    thin = Number(units[2]);
    thinnest[0] = units;
  }
}
const normalisedFattest = fattest.flat();
const normalisedThinnest = thinnest.flat();
const groupFattestCost = (normalisedFattest[6] * 1) * (normalisedFattest[3] * 1);
const groupThinnestCost = (normalisedThinnest[6] * 1) * (normalisedThinnest[3] * 1);
console.log(`Стоимость найма отряда самых толстых: ${groupFattestCost}. Стоимость найма отряда самых худых: ${groupThinnestCost}`);

const bestRatio = (collection) => {
  let ratio = 0;
  const bR = [];
  for (let f of collection) {
    if (Number((f[1]*1)/(f[6]*1)) > ratio) {
      ratio = Number((f[1]*1)/(f[6]*1));
      bR[0] = f;
    }
  }
  return bR.flat();
}
const worstRatio = (collection) => {
  let ratio = 0;
  const wR = [];
  for (let f of collection) {
    if (Number((f[6]*1)/(f[1]*1)) > ratio) {
      ratio = Number((f[6]*1)/(f[1]*1));
      wR[0] = f;
    }
  }
  return wR.flat();
}
console.log(`Самый выгодный: ${bestRatio(mapped)[0]}; самый невыгодный: ${worstRatio(mapped)[0]}`);

const tenKWorthStrength = [];
for (let l of mapped) {
  let count = (10000 / Number(l[6])) * Number(l[1]);
  tenKWorthStrength.push([l[0], count]);
}
let num = 0;
const bestTKW = [];
for (let par of tenKWorthStrength) {
  if (Number(par[1]) > num) {
    num = Number(par[1]);
    bestTKW[0] = par[1];
  }
}
console.log(`Самый большая сила за 10 к: ${bestTKW.join()}`);
//console.log(normalisedThinnest);
//console.log(mapped);
// END