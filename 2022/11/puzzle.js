import { readInput } from "../utils.js";
import { parser } from "./parser.js";
import { createMonkeyList } from "./entities.js";
import vm from "node:vm";

const { values } = await readInput({ sourceUrl: import.meta.url, parser });

// part 1

const round = (monkeys, cfg) => {
  for (let m = 0; m < monkeys.length; m++) {
    const monkey = monkeys[m];
    while (monkey.items.length) {
      monkey.inspects++;

      const item = monkey.items.shift();

      const ctx = {
        old: BigInt(item),
        result: null,
        test: BigInt(monkey.test),
        divide: cfg.divide ? BigInt(cfg.divide) : null,
        newVal: null
      };

      vm.runInNewContext(`
        ${monkey.op};
        if (divide) {
          newVal /= divide;
        }
        result = newVal % test === 0n;
      `, ctx);

      monkeys[monkey[ctx.result ? "nextTrue" : "nextFalse"]].items.push(ctx.newVal);
    }
  }
}

const run = (times, cfg = {}) => {
  const monkeys = createMonkeyList(values);
  Array.from({ length: times }).forEach((_, i) => {
    console.log(i);
    round(monkeys, cfg);
  });
  monkeys.sort((m1, m2) => m2.inspects - m1.inspects);
  console.log(monkeys)
  return monkeys.at(0).inspects * monkeys.at(1).inspects;
};

console.log(run(20, { divide: 3 }));

// part 2

//console.log(run(10_000));
/*
evalmachine.<anonymous>:1
newVal = old * old
             ^
RangeError: Maximum BigInt size exceeded
*/