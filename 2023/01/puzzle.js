import { readInput, sum } from "../utils.js";

const { values } = await readInput({ sourceUrl: import.meta.url, parser: l => l });

const calc = (values) => {
  const numberStrings = values.map(line => line.split('').filter(n => Number.isFinite(parseInt(n))));
  const numbers = numberStrings.map(line => parseInt(line.at(0) + line.at(-1)));
  return sum(numbers);
};

PART_1: {
  console.log(calc(values));
}

PART_2: {
  const spelledNumbers = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];

  const replacer = (string) => {
    let index = 0;
    while (index < string.length) {
      for (let n = 0; n < spelledNumbers.length; n++) {
        const num = spelledNumbers[n];
        if (string.substring(index, index + num.length) === num) {
          string = string.replace(num, num.at(0) + (n + 1) + num.at(-1));
          break;
        }
      }
      index++;
    }
    return string;
  };

  console.log(calc(values.map(replacer)));
}
