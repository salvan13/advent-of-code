import { readInput } from "../utils.js";
import { makeCave, printCave, fall } from "./cave.js";

const parser = line => {
  return line.split("->").map(p => p.trim().split(",").map(v => parseInt(v, 10)));
};

const { values } = await readInput({ sourceUrl: import.meta.url, parser });

// part 1

const run = (c, print) => {
  let steps = 0;
  while (fall(c)) {
    steps++;
  }
  print && printCave(c);
  console.log(steps);
}

run(makeCave(values), true);

// part 2

{
  let { firstCol, lastCol, lastRow } = makeCave(values);
  const gap = 200;
  const bottom = [[[firstCol - gap, lastRow + 1], [lastCol + gap, lastRow + 1]]];

  run(makeCave(values.concat(bottom)));
}
