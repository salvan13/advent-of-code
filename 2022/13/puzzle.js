import { readInput, sum } from "../utils.js";

const pairs = (await readInput({ sourceUrl: import.meta.url, parser: l => l && JSON.parse(l) }))
  .values.reduce((a, c) => {
    if (c) {
      a.at(-1).push(c);
    } else {
      a.push([]);
    }
    return a;
  }, [[]]);

// part 1

const compare = ([left, right]) => {
  if (typeof right === 'undefined') {
    return -1;
  }

  if (typeof left === 'undefined') {
    return 1;
  }

  if (Number.isInteger(left) && Number.isInteger(right)) {
    if (left === right) {
      return 0;
    }
    return right - left;
  }

  if (Number.isInteger(left)) {
    left = [left];
  }

  if (Number.isInteger(right)) {
    right = [right];
  }

  const size = Math.max(left.length, right.length);

  for (let i = 0; i < size; i++) {
    const r = compare([left[i], right[i]]);
    if (r !== 0) {
      return r;
    }
  }

  return 0;
};

console.log(sum(pairs.map(p => compare(p)).map((r, i) => r > 0 ? i + 1 : 0)));

// part 2

const lower = [[2]];
const higher = [[6]]

const finder = p => i => i === p;

const sortedPackets = pairs.flat().concat([lower, higher]).sort((a, b) => compare([b, a]));

const lowerIndex = sortedPackets.findIndex(finder(lower));
const higherIndex = sortedPackets.findIndex(finder(higher));

console.log((lowerIndex + 1) * (higherIndex + 1));
