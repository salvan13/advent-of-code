import { readInput } from "../utils.js";

const { values } = await readInput({ sourceUrl: import.meta.url, parser: l => parseInt(l) });

// part 1

const elfs = values.reduce((elfs, calorie) => {
  if (calorie) {
    elfs[elfs.length - 1] += calorie;
  } else {
    elfs.push(0);
  }
  return elfs;
}, [0]);

console.log(Math.max(...elfs));

// part 2

const sortedElfs = elfs.sort((a, b) => b - a);
const bestElfs = sortedElfs.slice(0, 3);
console.log(bestElfs.reduce((a, c) => a + c, 0));
