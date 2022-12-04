import { readInput } from "../utils.js";
import { intersection, isSuperset } from "../set.js";

const parser = line => {
  const input = line.split(",").map(v => v.split("-").map(n => parseInt(n, 10)));

  const section = (a, b) => new Array(b - a + 1).fill(a).map((v, i) => v + i);

  const sections = [section(input[0][0], input[0][1]), section(input[1][0], input[1][1])];

  const sets = [new Set(sections[0]), new Set(sections[1])];

  const included = isSuperset(sets[0], sets[1]) || isSuperset(sets[1], sets[0]);

  const overlaps = intersection(sets[0], sets[1]).size > 0;

  return {
    included,
    overlaps
  }
};

const { values } = await readInput({ sourceUrl: import.meta.url, parser });

// part 1

console.log(values.filter(v => v.included).length);

// part 2

console.log(values.filter(v => v.overlaps).length);
