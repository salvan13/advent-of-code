import { readInput } from "../utils.js";

const parser = l => {
  const v = l.split(' ').map(i => parseInt(i, 10)).filter(n => Number.isFinite(n));
  return {
    quantity: v[0],
    from: v[1],
    to: v[2]
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

  moves.forEach(move => {
    let crates = cargo[move.from - 1]
      .splice(cargo[move.from - 1].length - move.quantity, move.quantity);
    reverse && (crates = crates.reverse());
    cargo[move.to - 1] = cargo[move.to - 1].concat(crates);
  });

  return cargo.map(c => c[c.length - 1]).join('');
};


console.log(solve());

// part 2

console.log(solve({ reverse: false }));
