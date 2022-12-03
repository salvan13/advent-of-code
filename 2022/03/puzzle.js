import { readInput, sum } from "../utils.js";

const parser = (line) => [
  line.substring(0, line.length / 2),
  line.substring(line.length / 2)
];

const { values, lines } = await readInput({ sourceUrl: import.meta.url, parser });

// part 1

const findDuplicate = array => {
  const letters = array.reduce((accumulator, word) => {
    new Set(word.split("")).forEach(char => {
      if (!accumulator[char]) {
        accumulator[char] = 1;
      } else {
        accumulator[char]++;
      }
    })
    return accumulator;
  }, {});
  return Object.entries(letters).find(e => e[1] === array.length)[0];
};

const calcValue = (item) => {
  const charCode = item.charCodeAt(0);
  return charCode - (charCode < 91 ? 38 : 96);
};

console.log(sum(values.map(findDuplicate).map(calcValue)));

// part 2

const ELF_PER_GROUP = 3;

const groups = new Array(lines.length / ELF_PER_GROUP)
  .fill(null)
  .map((_, i) => lines.slice(i * ELF_PER_GROUP, i * ELF_PER_GROUP + ELF_PER_GROUP));

console.log(sum(groups.map(findDuplicate).map(calcValue)));
