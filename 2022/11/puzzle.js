import { readInput } from "../utils.js";
import { parser } from "./parser.js";
import { createMonkeyList } from "./entities.js";
import vm from "node:vm";

const { values } = await readInput({ sourceUrl: import.meta.url, parser });

// part 1

const round = (monkeys, cfg) => {
  const mod = cfg.mod && cfg.mod(monkeys);

  for (let m = 0; m < monkeys.length; m++) {
    const monkey = monkeys[m];
    while (monkey.items.length) {
      monkey.inspects++;

      let newVal = monkey.op(monkey.items.shift());

      if (cfg.divide) {
        newVal = Math.floor(newVal / cfg.divide);
      } else if (mod) {
        newVal %= mod;
      }

      const nextMonkey = monkeys[monkey[newVal % monkey.test === 0 ? "nextTrue" : "nextFalse"]];
      nextMonkey.items.push(newVal);
    }
  }
}

const run = (times, cfg = {}) => {
  const monkeys = createMonkeyList(values);
  Array.from({ length: times }).forEach(() => {
    round(monkeys, cfg);
  });
  monkeys.sort((m1, m2) => m2.inspects - m1.inspects);
  return monkeys.at(0).inspects * monkeys.at(1).inspects;
};

console.log(run(20, { divide: 3 }));

// part 2

console.log(run(10_000, { mod: monkeys => monkeys.map(m => m.test).reduce((a, c) => a * c, 1) }));
