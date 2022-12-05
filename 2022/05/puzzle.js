import { readInput } from "../utils.js";

const parser = l => {
  const v = l.split(' ').map(i => parseInt(i, 10)).filter(n => Number.isFinite(n));
  return {
    quantity: v[0],
    from: v[1] - 1,
    to: v[2] - 1
  }
};

const { values: moves } = await readInput({ sourceUrl: import.meta.url, parser });

const initialCargo = () => [
  "WDGBHRV",
  "JNGCRF",
  "LSFHDNJ",
  "JDSV",
  "SHDRQWNV",
  "PGHCM",
  "FJBGLZHC",
  "SJR",
  "LGSRBNVM"
].map(s => s.split(""));

// part 1

const solve = ({ reverse = true } = {}) => {
  const cargo = initialCargo();

  moves.forEach(({ quantity, from, to }) => {
    let crates = cargo[from]
      .splice(cargo[from].length - quantity, quantity);
    reverse && (crates = crates.reverse());
    cargo[to] = cargo[to].concat(crates);
  });

  return cargo.map(c => c[c.length - 1]).join('');
};


console.log(solve());

// part 2

console.log(solve({ reverse: false }));
