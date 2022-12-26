import { readInput, sum } from "../utils.js";

const { values } = await readInput({ sourceUrl: import.meta.url, parser: l => parseInt(l) });

// part 1

const elves = values.reduce((elves, calorie) => {
  if (calorie) {
    elves[elves.length - 1] += calorie;
  } else {
    elves.push(0);
  }
  return elves;
}, [0]);

console.log(Math.max(...elves));

// part 2

const sortedElves = elves.sort((a, b) => b - a);
const bestElves = sortedElves.slice(0, 3);
console.log(sum(bestElves));
