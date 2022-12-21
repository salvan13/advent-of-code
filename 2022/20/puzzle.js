import { readInput, sum } from "../utils.js";
import { RotatingList } from "./entities.js";

const { values } = await readInput({ sourceUrl: import.meta.url, parser: l => parseInt(l) });

// part 1

const run = (array, times = 1) => {
  const list = new RotatingList(array);
  while (times--) {
    for (let i = 0; i < array.length; i++) {
      const v = array[i];
      list.move(i, v);
    }
  }

  const nodeZero = list.getNodeByValue(0);

  return sum([1, 2, 3].map(v => list.getNode(nodeZero.id, v * 1000).value));
}

console.log(run(values));

// part 2

console.log(run(values.map(n => n * 811589153), 10));
